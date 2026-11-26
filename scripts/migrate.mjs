#!/usr/bin/env node
// Apply supabase/migrations to the hosted database, each file once.
//
//   npm run db:migrate

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import postgres from "postgres";

const url = process.env.DIRECT_URL || process.env.POSTGRES_URL_NON_POOLING || process.env.DATABASE_URL || process.env.POSTGRES_URL;
if (!url) {
  console.error("Set DIRECT_URL or POSTGRES_URL_NON_POOLING first.");
  process.exit(1);
}
const u = new URL(url);
console.log(`Migrating ${u.hostname}${u.pathname}`);
const sql = postgres({
  host: u.hostname,
  port: Number(u.port) || 5432,
  database: u.pathname.slice(1) || "postgres",
  username: decodeURIComponent(u.username),
  password: decodeURIComponent(u.password),
  ssl: ["localhost", "127.0.0.1"].includes(u.hostname) ? false : "require",
  prepare: false,
  max: 1,
  onnotice: () => {},
});

const dir = path.join(import.meta.dirname, "..", "supabase", "migrations");
try {
  await sql.unsafe("create table if not exists schema_migrations (name text primary key)");
  await sql.unsafe("alter table schema_migrations enable row level security");
  const done = new Set((await sql`select name from schema_migrations`).map((r) => r.name));
  for (const name of (await readdir(dir)).filter((f) => f.endsWith(".sql")).sort()) {
    if (done.has(name)) continue;
    const text = await readFile(path.join(dir, name), "utf8");
    await sql.begin(async (tx) => {
      await tx.unsafe(text);
      await tx`insert into schema_migrations (name) values (${name})`;
    });
    console.log(`Applied ${name}`);
  }
  console.log("Up to date.");
} finally {
  await sql.end();
}
