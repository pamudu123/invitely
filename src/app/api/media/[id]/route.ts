import { getMedia } from "@/lib/server/invitations";

export async function GET(_req: Request, ctx: RouteContext<"/api/media/[id]">) {
  const { id } = await ctx.params;
  const media = await getMedia(id);
  if (!media) return new Response("Not found", { status: 404 });
  return new Response(media.bytes as BodyInit, {
    headers: {
      "Content-Type": media.mime,
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
