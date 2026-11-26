import "server-only";
import { existsSync, mkdirSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

/**
 * Storage is Postgres. In production set DATABASE_URL (or POSTGRES_URL, which the
 * Supabase integration on Vercel sets) to the pooled connection. With neither,
 * an embedded Postgres keeps its files in .data/pg, which is all development needs.
 */

type Arg = string | number | null;
type Statement = string | { sql: string; args: Arg[] };
type Row = Record<string, unknown>;
interface Result {
  rows: Row[];
  rowsAffected: number;
}
export interface Db {
  execute(statement: Statement): Promise<Result>;
  /** Run statements in one transaction. */
  batch(statements: Statement[]): Promise<void>;
}

/** Queries are written with ? placeholders. Postgres wants $1, $2 and cannot store NUL in text. */
function prepare(statement: Statement): [sql: string, args: Arg[]] {
  if (typeof statement === "string") return [statement, []];
  let n = 0;
  return [
    statement.sql.replace(/\?/g, () => `$${++n}`),
    statement.args.map((a) => (typeof a === "string" ? a.replaceAll("\u0000", "") : a)),
  ];
}

async function hosted(url: string): Promise<Db> {
  const { default: postgres } = await import("postgres");
  const u = new URL(url);
  // The query string is dropped because Supabase adds settings Postgres itself rejects.
  const sql = postgres({
    host: u.hostname,
    port: Number(u.port) || 5432,
    database: u.pathname.slice(1) || "postgres",
    username: decodeURIComponent(u.username),
    password: decodeURIComponent(u.password),
    ssl: ["localhost", "127.0.0.1"].includes(u.hostname) ? false : "require",
    // The transaction pooler does not keep prepared statements.
    prepare: false,
    max: 5,
    idle_timeout: 20,
    connect_timeout: 10,
  });
  return {
    async execute(statement) {
      const res = await sql.unsafe<Row[]>(...prepare(statement));
      return { rows: [...res], rowsAffected: res.count };
    },
    async batch(statements) {
      await sql.begin(async (tx) => {
        for (const s of statements) await tx.unsafe(...prepare(s));
      });
    },
  };
}

async function embedded(): Promise<Db> {
  if (process.env.VERCEL) throw new Error("DATABASE_URL or POSTGRES_URL is not set.");
  const { PGlite } = await import("@electric-sql/pglite");
  const dir = path.join(process.cwd(), ".data");
  mkdirSync(dir, { recursive: true });
  const pg = await PGlite.create(path.join(dir, "pg"));

  const migrations = path.join(process.cwd(), "supabase", "migrations");
  await pg.exec("create table if not exists schema_migrations (name text primary key)");
  const done = new Set((await pg.query<{ name: string }>("select name from schema_migrations")).rows.map((r) => r.name));
  for (const name of existsSync(migrations) ? readdirSync(migrations).sort() : []) {
    if (!name.endsWith(".sql") || done.has(name)) continue;
    const text = readFileSync(path.join(migrations, name), "utf8");
    await pg.transaction(async (tx) => {
      await tx.exec(text);
      await tx.query("insert into schema_migrations (name) values ($1)", [name]);
    });
  }
  return {
    async execute(statement) {
      const res = await pg.query<Row>(...prepare(statement));
      return { rows: res.rows, rowsAffected: res.affectedRows ?? 0 };
    },
    async batch(statements) {
      await pg.transaction(async (tx) => {
        for (const s of statements) await tx.query(...prepare(s));
      });
    },
  };
}

const globalForDb = globalThis as unknown as { __invitelyDb?: Promise<Db> };

/** Returns a ready database. Hosted tables are created with `npm run db:migrate`. */
export function db(): Promise<Db> {
  if (!globalForDb.__invitelyDb) {
    const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
    globalForDb.__invitelyDb = (url ? hosted(url) : embedded()).catch((err) => {
      globalForDb.__invitelyDb = undefined;
      throw err;
    });
  }
  return globalForDb.__invitelyDb;
}
