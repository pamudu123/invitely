import "server-only";
import { printDesigns } from "@/lib/invitation/cards";
import { printLikeId } from "@/lib/invitation/likes";
import { templates } from "@/lib/invitation/templates";
import { db } from "./db";

const known = new Set([...templates.map((t) => t.id), ...printDesigns.map((d) => printLikeId(d.id))]);

export const isLikeable = (id: string) => known.has(id);

export async function getLikeCounts(): Promise<Record<string, number>> {
  const res = await (await db()).execute("SELECT design, count FROM likes");
  const counts: Record<string, number> = {};
  for (const r of res.rows) if (isLikeable(String(r.design))) counts[String(r.design)] = Number(r.count);
  return counts;
}

/** Add likes to designs. Ids must already be checked with isLikeable. */
export async function addLikes(likes: [id: string, count: number][]): Promise<void> {
  if (!likes.length) return;
  const c = await db();
  await c.batch(
    likes.map(([id, count]) => ({
      sql: "INSERT INTO likes (design, count) VALUES (?, ?) ON CONFLICT(design) DO UPDATE SET count = count + excluded.count",
      args: [id, count],
    })),
    "write",
  );
}
