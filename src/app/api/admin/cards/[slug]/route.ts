import { allSections, occasions } from "@/lib/invitation/occasions";
import { ritualInfo } from "@/lib/invitation/rituals";
import { sceneHeroes, sceneIds } from "@/lib/invitation/scenes";
import { templates } from "@/lib/invitation/templates";
import { fontPairs, palettes } from "@/lib/invitation/theme";
import { isAdminRequest } from "@/lib/server/admin";
import { getInvitationBySlug, sanitizeInvitation, updateInvitationData } from "@/lib/server/invitations";
import { listReviews, markReviewReady } from "@/lib/server/reviews";

/*
 * Used by `npm run card`, so one card can be pulled, edited as a file and pushed back.
 * Every request must carry the team password in the x-admin-key header.
 */

type Ctx = RouteContext<"/api/admin/cards/[slug]">;
const denied = () => Response.json({ error: "Not allowed." }, { status: 401 });

export async function GET(req: Request, ctx: Ctx) {
  if (!(await isAdminRequest(req))) return denied();
  const { slug } = await ctx.params;
  const inv = await getInvitationBySlug(slug);
  if (!inv) return Response.json({ error: "No card with that link." }, { status: 404 });
  const rounds = await listReviews(inv.id);
  return Response.json({
    card: {
      slug: inv.slug,
      title: inv.title,
      status: inv.status,
      reviewStatus: inv.reviewStatus,
      ownerName: inv.ownerName,
      ownerContact: inv.ownerContact,
    },
    data: inv.data,
    review: rounds.find((r) => r.status === "open") ?? null,
    options: {
      templateId: templates.map((t) => t.id),
      occasion: occasions.map((o) => o.id),
      "theme.paletteId": palettes.map((p) => p.id),
      "theme.fontPair": fontPairs.map((f) => f.id),
      "theme.ornament": ["liyawel", "lotus", "botanical", "deco", "stars", "kolam", "geometric", "confetti", "waves", "mandala", "peacock", "paisley", "tracery", "film", "snow", "sun", "betel", "minimal", ...sceneIds],
      "theme.hero": ["classic", "arch", "photo", "monogram", "frame", "poster", "ticket", "gazette", "polaroid", ...sceneHeroes],
      "theme.scene": sceneIds,
      "theme.ritual": Object.keys(ritualInfo),
      "theme.music": ["none", "serene", "warm", "joyful", "custom"],
      "theme.effect": ["none", "petals", "sparkles", "confetti", "snow"],
      sections: allSections,
      language: ["en", "si", "ta"],
    },
  });
}

export async function PUT(req: Request, ctx: Ctx) {
  if (!(await isAdminRequest(req))) return denied();
  const { slug } = await ctx.params;
  const inv = await getInvitationBySlug(slug);
  if (!inv) return Response.json({ error: "No card with that link." }, { status: 404 });
  let body: { data?: unknown; ready?: boolean; reply?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Send JSON." }, { status: 400 });
  }
  if (!body.data || typeof body.data !== "object") return Response.json({ error: "Missing card data." }, { status: 400 });
  // The same checks as the studio: unknown values are replaced and long text is trimmed.
  const data = await sanitizeInvitation(body.data);
  await updateInvitationData(inv.id, data);
  let marked = false;
  if (body.ready) {
    const open = (await listReviews(inv.id)).find((r) => r.status === "open");
    if (open) marked = await markReviewReady(open.id, String(body.reply ?? ""));
  }
  return Response.json({ ok: true, slug: inv.slug, markedReady: marked });
}
