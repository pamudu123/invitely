import "server-only";
import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

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

export function checkAdminPassword(candidate: string): boolean {
  const real = password();
  return Boolean(real) && same(digest(candidate), digest(real!));
}

export async function isAdmin(): Promise<boolean> {
  const real = password();
  if (!real) return false;
  const value = (await cookies()).get(COOKIE)?.value ?? "";
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
export function isAdminRequest(req: Request): boolean {
  const key = req.headers.get("x-admin-key") ?? "";
  return key.length > 0 && checkAdminPassword(key);
}
