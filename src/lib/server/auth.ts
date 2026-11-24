import "server-only";
import { createHash, randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { promisify } from "node:util";
import { db } from "./db";
import { randomId } from "./ids";

const scryptAsync = promisify(scrypt) as (password: string, salt: Buffer, keylen: number) => Promise<Buffer>;

const COOKIE = "inv_session";
const SESSION_DAYS = 30;

export interface SessionUser {
  id: string;
  email: string;
  name: string;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const hash = await scryptAsync(password, salt, 64);
  return `scrypt$${salt.toString("hex")}$${hash.toString("hex")}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [scheme, saltHex, hashHex] = stored.split("$");
  if (scheme !== "scrypt" || !saltHex || !hashHex) return false;
  const expected = Buffer.from(hashHex, "hex");
  if (expected.length !== 64) return false;
  const actual = await scryptAsync(password, Buffer.from(saltHex, "hex"), expected.length);
  return timingSafeEqual(expected, actual);
}

const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");

export async function createSession(userId: string): Promise<void> {
  const token = randomBytes(32).toString("base64url");
  const expires = Date.now() + SESSION_DAYS * 86400_000;
  const c = await db();
  await c.execute({
    sql: "INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)",
    args: [hashToken(token), userId, expires],
  });
  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DAYS * 86400,
  });
}

export async function destroySession(): Promise<void> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (token) {
    const c = await db();
    await c.execute({ sql: "DELETE FROM sessions WHERE id = ?", args: [hashToken(token)] });
  }
  jar.delete(COOKIE);
}

/** The signed in user for this request, or null. Deduplicated per request. */
export const getUser = cache(async (): Promise<SessionUser | null> => {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;
  const c = await db();
  const res = await c.execute({
    sql: "SELECT u.id, u.email, u.name, s.expires_at FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.id = ?",
    args: [hashToken(token)],
  });
  const row = res.rows[0];
  if (!row || Number(row.expires_at) < Date.now()) return null;
  return { id: String(row.id), email: String(row.email), name: String(row.name) };
});

export async function requireUser(next?: string): Promise<SessionUser> {
  const user = await getUser();
  if (!user) redirect(next ? `/login?next=${encodeURIComponent(next)}` : "/login");
  return user;
}

export async function createUser(email: string, name: string, password: string): Promise<SessionUser | null> {
  const c = await db();
  const existing = await c.execute({ sql: "SELECT id FROM users WHERE email = ?", args: [email] });
  if (existing.rows.length) return null;
  const id = randomId(14);
  await c.execute({
    sql: "INSERT INTO users (id, email, name, password_hash, created_at) VALUES (?, ?, ?, ?, ?)",
    args: [id, email, name, await hashPassword(password), Date.now()],
  });
  return { id, email, name };
}

const dummyHash = `scrypt$${"00".repeat(16)}$${"00".repeat(64)}`;

export async function checkCredentials(email: string, password: string): Promise<SessionUser | null> {
  const c = await db();
  const res = await c.execute({
    sql: "SELECT id, email, name, password_hash FROM users WHERE email = ?",
    args: [email],
  });
  const row = res.rows[0];
  // Hash even when the account is missing so timing does not reveal which emails exist.
  const ok = await verifyPassword(password, row ? String(row.password_hash) : dummyHash).catch(() => false);
  if (!row || !ok) return null;
  return { id: String(row.id), email: String(row.email), name: String(row.name) };
}

/** Admins are listed by email in ADMIN_EMAILS, comma separated. */
export function isAdmin(user: SessionUser | null): boolean {
  if (!user) return false;
  const list = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  return list.includes(user.email.toLowerCase());
}
