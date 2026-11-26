import { z } from "zod";
import { allow, callerKey } from "@/lib/server/ratelimit";
import { createUpload, MAX_PHOTO_BYTES } from "@/lib/server/storage";

// A full card holds 19 photos: the cover, 12 in the gallery and 6 in the story.
const schema = z.object({
  photos: z
    .array(z.object({ type: z.enum(["image/jpeg", "image/png", "image/webp"]), size: z.number().int().min(1).max(MAX_PHOTO_BYTES) }))
    .min(1)
    .max(24),
});

const PHOTOS_PER_HOUR = 200;

/** Upload addresses for photos, in the order they were asked for. */
export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Bad request" }, { status: 400 });
  const { photos } = parsed.data;
  if (!(await allow(`photos:${callerKey(req.headers)}`, PHOTOS_PER_HOUR, 3600_000, photos.length))) {
    return Response.json({ error: "Too many photos" }, { status: 429 });
  }
  const tickets = await Promise.all(photos.map((p) => createUpload(p.type)));
  return Response.json({ tickets }, { headers: { "Cache-Control": "no-store" } });
}
