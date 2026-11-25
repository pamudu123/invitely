import { cookies } from "next/headers";
import { connection } from "next/server";
import { z } from "zod";
import { formatLikes, LIKES_COOKIE, LIKES_COOKIE_AGE, MAX_LIKES_PER_REQUEST } from "@/lib/invitation/likes";
import { addLikes, getLikeCounts, isLikeable } from "@/lib/server/likes";

const schema = z.object({
  /** New likes per design */
  add: z.record(z.string(), z.number().int().min(1).max(MAX_LIKES_PER_REQUEST)),
  /** Every design this device likes now, for its cookie */
  mine: z.array(z.string()).max(200),
});

// People may like a design as often as they wish. This only slows down scripts, per server instance.
const recent = new Map<string, { since: number; count: number }>();
const LIKES_PER_MINUTE = 1200;

function allow(ip: string, count: number): boolean {
  const now = Date.now();
  if (recent.size > 5000) recent.clear();
  const slot = recent.get(ip);
  const used = slot && now - slot.since < 60_000 ? slot : { since: now, count: 0 };
  if (used.count + count > LIKES_PER_MINUTE) return false;
  used.count += count;
  recent.set(ip, used);
  return true;
}

export async function GET() {
  await connection();
  return Response.json(await getLikeCounts(), { headers: { "Cache-Control": "no-store" } });
}

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return new Response("Bad request", { status: 400 });

  const likes = Object.entries(parsed.data.add).filter(([id]) => isLikeable(id));
  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "local";
  if (!allow(ip, likes.reduce((sum, [, n]) => sum + n, 0))) return new Response("Too many likes", { status: 429 });
  await addLikes(likes);

  // Set here as well as in the page, because Safari drops cookies set by scripts after a week.
  (await cookies()).set(LIKES_COOKIE, formatLikes([...new Set(parsed.data.mine)].filter(isLikeable)), {
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: LIKES_COOKIE_AGE,
  });
  return new Response(null, { status: 204 });
}
