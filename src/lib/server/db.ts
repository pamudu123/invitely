import "server-only";
import { createClient, type Client } from "@libsql/client";
import { randomBytes } from "node:crypto";
import { mkdirSync } from "node:fs";
import path from "node:path";

/**
 * Storage uses libSQL. With no configuration it writes to a local SQLite file,
 * which is all you need for development. In production set DATABASE_URL (and
 * DATABASE_AUTH_TOKEN) to a hosted libSQL database such as Turso.
 */
const globalForDb = globalThis as unknown as { __invitelyDb?: Client; __invitelyReady?: Promise<void> };

function client(): Client {
  if (!globalForDb.__invitelyDb) {
    let url = process.env.DATABASE_URL;
    if (!url) {
      const dir = path.join(process.cwd(), ".data");
      mkdirSync(dir, { recursive: true });
      url = `file:${path.join(dir, "invitely.db")}`;
    }
    globalForDb.__invitelyDb = createClient({ url, authToken: process.env.DATABASE_AUTH_TOKEN });
  }
  return globalForDb.__invitelyDb;
}

const schema = [
  `CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    created_at INTEGER NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at INTEGER NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS invitations (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    slug TEXT NOT NULL UNIQUE,
    occasion TEXT NOT NULL,
    title TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft',
    plan TEXT NOT NULL DEFAULT 'free',
    data TEXT NOT NULL,
    views INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    published_at INTEGER,
    manage_token TEXT,
    owner_name TEXT NOT NULL DEFAULT '',
    owner_contact TEXT NOT NULL DEFAULT '',
    pin_hash TEXT NOT NULL DEFAULT '',
    pin_fails INTEGER NOT NULL DEFAULT 0,
    pin_locked_until INTEGER NOT NULL DEFAULT 0
  )`,
  `CREATE INDEX IF NOT EXISTS invitations_user ON invitations(user_id)`,
  `CREATE TABLE IF NOT EXISTS guests (
    id TEXT PRIMARY KEY,
    invitation_id TEXT NOT NULL REFERENCES invitations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    seats INTEGER NOT NULL DEFAULT 1,
    token TEXT NOT NULL UNIQUE,
    table_name TEXT NOT NULL DEFAULT '',
    phone TEXT NOT NULL DEFAULT '',
    opened_at INTEGER,
    checked_in_at INTEGER,
    created_at INTEGER NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS guests_invitation ON guests(invitation_id)`,
  `CREATE TABLE IF NOT EXISTS rsvps (
    id TEXT PRIMARY KEY,
    invitation_id TEXT NOT NULL REFERENCES invitations(id) ON DELETE CASCADE,
    guest_id TEXT REFERENCES guests(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    phone TEXT NOT NULL DEFAULT '',
    attending INTEGER NOT NULL,
    party_size INTEGER NOT NULL DEFAULT 1,
    meal TEXT NOT NULL DEFAULT '',
    answer TEXT NOT NULL DEFAULT '',
    message TEXT NOT NULL DEFAULT '',
    hidden INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS rsvps_invitation ON rsvps(invitation_id)`,
  `CREATE TABLE IF NOT EXISTS media (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    mime TEXT NOT NULL,
    bytes BLOB NOT NULL,
    created_at INTEGER NOT NULL
  )`,
];

/** There are no host accounts. Every card belongs to this one internal owner row. */
export const SYSTEM_OWNER = "system";

/** Columns added after the first release, for databases created before them. */
const addedColumns: [string, string][] = [
  ["manage_token", "TEXT"],
  ["owner_name", "TEXT NOT NULL DEFAULT ''"],
  ["owner_contact", "TEXT NOT NULL DEFAULT ''"],
  ["pin_hash", "TEXT NOT NULL DEFAULT ''"],
  ["pin_fails", "INTEGER NOT NULL DEFAULT 0"],
  ["pin_locked_until", "INTEGER NOT NULL DEFAULT 0"],
];

async function ensureSchema() {
  const c = client();
  await c.execute("PRAGMA foreign_keys = ON");
  for (const sql of schema) await c.execute(sql);

  const info = await c.execute("PRAGMA table_info(invitations)");
  const have = new Set(info.rows.map((r) => String(r.name)));
  for (const [name, type] of addedColumns) {
    if (!have.has(name)) await c.execute(`ALTER TABLE invitations ADD COLUMN ${name} ${type}`);
  }
  await c.execute("CREATE UNIQUE INDEX IF NOT EXISTS invitations_manage_token ON invitations(manage_token)");
  await c.execute({
    sql: "INSERT OR IGNORE INTO users (id, email, name, password_hash, created_at) VALUES (?, ?, ?, '', 0)",
    args: [SYSTEM_OWNER, "system@invitely.local", "System"],
  });
  // Cards made before manage links existed get one now.
  const missing = await c.execute("SELECT id FROM invitations WHERE manage_token IS NULL OR manage_token = ''");
  for (const row of missing.rows) {
    await c.execute({
      sql: "UPDATE invitations SET manage_token = ? WHERE id = ?",
      args: [randomBytes(24).toString("base64url"), String(row.id)],
    });
  }
}

/** Returns a ready database client. Tables are created on first use. */
export async function db(): Promise<Client> {
  if (!globalForDb.__invitelyReady) {
    globalForDb.__invitelyReady = ensureSchema().catch((err) => {
      globalForDb.__invitelyReady = undefined;
      throw err;
    });
  }
  await globalForDb.__invitelyReady;
  return client();
}
