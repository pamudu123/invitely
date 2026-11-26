import { isAdminRequest } from "@/lib/server/admin";
import { listAdminCards } from "@/lib/server/reviews";

/** Cards for `npm run card -- list`. Manage tokens are left out on purpose. */
export async function GET(req: Request) {
  if (!(await isAdminRequest(req))) return Response.json({ error: "Not allowed." }, { status: 401 });
  const cards = await listAdminCards();
  return Response.json({
    cards: cards.map((c) => ({ slug: c.slug, title: c.title, status: c.status, reviewStatus: c.reviewStatus, openPins: c.openPins, round: c.round })),
  });
}
