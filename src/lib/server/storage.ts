import "server-only";
import path from "node:path";
import { randomId } from "./ids";

/*
 * Photos go straight from the browser to Supabase Storage with a signed upload
 * address, so they never pass through a server function. Without Supabase
 * settings, development keeps them in .data/media behind /api/media.
 */

const BUCKET = "photos";
export const MAX_PHOTO_BYTES = 1_400_000;
const extensions = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" } as const;

export interface UploadTicket {
  /** Where the browser sends the file */
  put: string;
  /** Where the photo is shown from afterwards */
  url: string;
}

function supabase(): { base: string; key: string } | null {
  const base = (process.env.SUPABASE_URL ?? "").replace(/\/+$/, "");
  const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  return base && key ? { base: `${base}/storage/v1`, key } : null;
}

/** Local photos are for development only. */
export const usesLocalPhotos = () => !supabase() && !process.env.VERCEL;
export const localPhotoPath = (name: string) => path.join(process.cwd(), ".data", "media", name);
export const LOCAL_PHOTO = /^[a-z0-9]{6,32}\.(jpg|png|webp)$/;

export async function createUpload(type: keyof typeof extensions): Promise<UploadTicket> {
  const name = `${randomId(20)}.${extensions[type]}`;
  const s = supabase();
  if (!s) {
    if (!usesLocalPhotos()) throw new Error("SUPABASE_URL and SUPABASE_SECRET_KEY are not set.");
    return { put: `/api/media/${name}`, url: `/api/media/${name}` };
  }
  const res = await fetch(`${s.base}/object/upload/sign/${BUCKET}/${name}`, {
    method: "POST",
    // New style keys are not JWTs and go in apikey alone.
    headers: { apikey: s.key, ...(s.key.startsWith("sb_") ? {} : { Authorization: `Bearer ${s.key}` }), "Content-Type": "application/json" },
    body: "{}",
  });
  if (!res.ok) throw new Error(`Could not sign an upload: ${res.status}`);
  const { url } = (await res.json()) as { url: string };
  return { put: `${s.base}${url}`, url: `${s.base}/object/public/${BUCKET}/${name}` };
}
