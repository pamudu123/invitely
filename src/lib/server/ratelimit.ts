import "server-only";
import { createHash } from "node:crypto";
import { db } from "./db";

/** A short fingerprint of the caller's network. Addresses themselves are not stored. */
export function callerKey(headers: Headers): string {
  const ip = (headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "local";
  return createHash("sha256").update(`invitely-ip:${ip}`).digest("hex").slice(0, 24);
}

/** Count `cost` against a key. False once the window's limit is passed. Shared by every server instance. */
export async function allow(key: string, limit: number, windowMs: number, cost = 1): Promise<boolean> {
  const c = await db();
  const start = Math.floor(Date.now() / windowMs) * windowMs;
  const res = await c.execute({
    sql: `INSERT INTO rate_limits AS r (key, window_start, count) VALUES (?, ?, ?)
          ON CONFLICT (key) DO UPDATE SET
            count = CASE WHEN r.window_start = excluded.window_start THEN r.count + excluded.count ELSE excluded.count END,
            window_start = excluded.window_start
          RETURNING count`,
    args: [key, start, cost],
  });
  return Number(res.rows[0].count) <= limit;
}

/** Whether a key has already used up its window, without counting this call. */
export async function isBlocked(key: string, limit: number, windowMs: number): Promise<boolean> {
  const c = await db();
  const start = Math.floor(Date.now() / windowMs) * windowMs;
  const res = await c.execute({ sql: "SELECT count FROM rate_limits WHERE key = ? AND window_start = ?", args: [key, start] });
  return Number(res.rows[0]?.count ?? 0) >= limit;
}
