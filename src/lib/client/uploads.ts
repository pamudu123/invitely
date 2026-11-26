import type { InvitationData } from "@/lib/invitation/types";

const isInline = (v?: string): v is string => Boolean(v?.startsWith("data:"));

/** Swap photos for their stored addresses. Anything not in the map is left alone. */
export function replacePhotos(data: InvitationData, stored: Map<string, string>): InvitationData {
  if (!stored.size) return data;
  const swap = (v: string) => stored.get(v) ?? v;
  return {
    ...data,
    heroPhoto: data.heroPhoto && swap(data.heroPhoto),
    gallery: data.gallery.map(swap),
    story: data.story.map((s) => ({ ...s, photo: s.photo && swap(s.photo) })),
  };
}

/** Upload photos that are still inline. Returns inline value to stored address. Throws if any photo fails. */
export async function uploadPhotos(data: InvitationData): Promise<Map<string, string>> {
  const inline = [...new Set([data.heroPhoto, ...data.gallery, ...data.story.map((s) => s.photo)].filter(isInline))];
  const stored = new Map<string, string>();
  if (!inline.length) return stored;

  const blobs = await Promise.all(inline.map(async (src) => (await fetch(src)).blob()));
  const res = await fetch("/api/uploads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ photos: blobs.map((b) => ({ type: b.type, size: b.size })) }),
  });
  if (!res.ok) throw new Error("Could not start the upload.");
  const { tickets } = (await res.json()) as { tickets: { put: string; url: string }[] };

  // Three at a time keeps a slow phone connection responsive.
  let next = 0;
  const worker = async () => {
    while (next < blobs.length) {
      const i = next++;
      const put = await fetch(tickets[i].put, {
        method: "PUT",
        headers: { "Content-Type": blobs[i].type, "Cache-Control": "max-age=31536000" },
        body: blobs[i],
      });
      if (!put.ok) throw new Error("Could not upload a photo.");
      stored.set(inline[i], tickets[i].url);
    }
  };
  await Promise.all([worker(), worker(), worker()]);
  return stored;
}
