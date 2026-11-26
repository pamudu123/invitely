import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { LOCAL_PHOTO, localPhotoPath, MAX_PHOTO_BYTES, usesLocalPhotos } from "@/lib/server/storage";

/* Development only. On Vercel photos live in Supabase Storage. */

const types: Record<string, string> = { jpg: "image/jpeg", png: "image/png", webp: "image/webp" };
const missing = () => new Response("Not found", { status: 404 });

export async function GET(_req: Request, ctx: RouteContext<"/api/media/[id]">) {
  const { id } = await ctx.params;
  if (!usesLocalPhotos() || !LOCAL_PHOTO.test(id)) return missing();
  const bytes = await readFile(localPhotoPath(id)).catch(() => null);
  if (!bytes) return missing();
  return new Response(new Uint8Array(bytes), {
    headers: {
      "Content-Type": types[id.slice(id.lastIndexOf(".") + 1)],
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

export async function PUT(req: Request, ctx: RouteContext<"/api/media/[id]">) {
  const { id } = await ctx.params;
  if (!usesLocalPhotos() || !LOCAL_PHOTO.test(id)) return missing();
  const bytes = new Uint8Array(await req.arrayBuffer());
  if (!bytes.length || bytes.length > MAX_PHOTO_BYTES) return new Response("Bad size", { status: 413 });
  const file = localPhotoPath(id);
  await mkdir(path.dirname(file), { recursive: true });
  // "wx" never replaces an existing photo.
  await writeFile(file, bytes, { flag: "wx" });
  return new Response(null, { status: 200 });
}
