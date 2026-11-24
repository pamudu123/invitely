import "server-only";
import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt) as (secret: string, salt: Buffer, keylen: number) => Promise<Buffer>;

/** Hash a short secret such as an edit PIN. */
export async function hashSecret(secret: string): Promise<string> {
  const salt = randomBytes(16);
  const hash = await scryptAsync(secret, salt, 64);
  return `scrypt$${salt.toString("hex")}$${hash.toString("hex")}`;
}

export async function verifySecret(secret: string, stored: string): Promise<boolean> {
  const [scheme, saltHex, hashHex] = stored.split("$");
  if (scheme !== "scrypt" || !saltHex || !hashHex) return false;
  const expected = Buffer.from(hashHex, "hex");
  if (expected.length !== 64) return false;
  const actual = await scryptAsync(secret, Buffer.from(saltHex, "hex"), expected.length);
  return timingSafeEqual(expected, actual);
}

/** Long random value used as the private manage link of a card. */
export function newManageToken(): string {
  return randomBytes(24).toString("base64url");
}

export function isManageToken(value: string): boolean {
  return /^[A-Za-z0-9_-]{24,64}$/.test(value);
}
