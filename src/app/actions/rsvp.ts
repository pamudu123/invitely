"use server";

import { z } from "zod";
import {
  countRecentRsvps,
  getGuestByToken,
  getInvitationBySlug,
  saveRsvp,
} from "@/lib/server/invitations";

const schema = z.object({
  name: z.string().trim().min(1).max(80),
  phone: z.string().trim().max(30),
  attending: z.boolean(),
  partySize: z.number().int().min(0).max(20),
  meal: z.string().trim().max(40),
  answer: z.string().trim().max(200),
  message: z.string().trim().max(400),
});

/** Public action called from a published invitation. */
export async function submitRsvpAction(
  slug: string,
  guestToken: string | null,
  payload: unknown,
): Promise<{ ok: boolean; error?: string }> {
  const parsed = schema.safeParse(payload);
  if (!parsed.success) return { ok: false, error: "Please check your reply and try again." };
  const inv = await getInvitationBySlug(String(slug).slice(0, 80));
  if (!inv || inv.status !== "published") return { ok: false, error: "This invitation is not open for replies." };
  if (!inv.data.rsvp.enabled) return { ok: false, error: "Replies are closed." };

  // Simple flood guard per invitation.
  if ((await countRecentRsvps(inv.id, Date.now() - 60_000)) > 40) {
    return { ok: false, error: "Too many replies right now. Please try again in a minute." };
  }

  const guest = guestToken ? await getGuestByToken(inv.id, guestToken) : null;
  const cap = guest?.seats ?? inv.data.rsvp.maxPartySize;
  const input = parsed.data;
  await saveRsvp({
    invitationId: inv.id,
    guestId: guest?.id ?? null,
    name: guest?.name ?? input.name,
    phone: input.phone,
    attending: input.attending,
    partySize: input.attending ? Math.min(Math.max(1, input.partySize), cap) : 0,
    meal: input.attending && inv.data.rsvp.askMeal && inv.data.rsvp.mealOptions.includes(input.meal) ? input.meal : "",
    answer: input.attending ? input.answer : "",
    message: inv.data.rsvp.askMessage ? input.message : "",
  });
  return { ok: true };
}
