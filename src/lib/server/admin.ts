import "server-only";
import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { allow, callerKey, isBlocked } from "./ratelimit";

const COOKIE = "inv_admin";

/**
 * The team signs in with one shared password from ADMIN_PASSWORD.
 * With no password set, the admin area is closed in production and uses "admin" in development.
 */
function password(): string | null {
  if (process.env.ADMIN_PASSWORD) return process.env.ADMIN_PASSWORD;
  return process.env.NODE_ENV === "production" ? null : "admin";
}

const digest = (value: string) => createHash("sha256").update(`invitely-admin:${value}`).digest("hex");

function same(a: string, b: string): boolean {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

function checkAdminPassword(candidate: string): boolean {
  const real = password();
  return Boolean(real) && same(digest(candidate), digest(real!));
}

const WRONG_TRIES = 10;
const WRONG_WINDOW = 15 * 60_000;

/** Check the team password, allowing ten wrong tries per network every fifteen minutes. */
export async function tryAdminPassword(candidate: string, headers: Headers): Promise<"ok" | "wrong" | "blocked"> {
  const key = `admin:${callerKey(headers)}`;
  if (await isBlocked(key, WRONG_TRIES, WRONG_WINDOW)) return "blocked";
  if (checkAdminPassword(candidate)) return "ok";
  await allow(key, WRONG_TRIES, WRONG_WINDOW);
  return "wrong";
}

export async function isAdmin(): Promise<boolean> {
  // Cookies are read first so the page is never built as a fixed redirect.
  const value = (await cookies()).get(COOKIE)?.value ?? "";
  const real = password();
  if (!real) return false;
  return same(value, digest(real));
}

export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) redirect("/admin/login");
}

export async function startAdminSession(): Promise<void> {
  const real = password();
  if (!real) return;
  (await cookies()).set(COOKIE, digest(real), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 14 * 86400,
  });
}

export async function endAdminSession(): Promise<void> {
  (await cookies()).delete(COOKIE);
}

/** For scripts: the same password sent in the x-admin-key header. */
export async function isAdminRequest(req: Request): Promise<boolean> {
  const key = req.headers.get("x-admin-key") ?? "";
  return key.length > 0 && (await tryAdminPassword(key, req.headers)) === "ok";
}
