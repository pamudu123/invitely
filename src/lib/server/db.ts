import "server-only";
import { createClient, type Client } from "@libsql/client";
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
    published_at INTEGER
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

async function ensureSchema() {
  const c = client();
  await c.execute("PRAGMA foreign_keys = ON");
  for (const sql of schema) await c.execute(sql);
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
