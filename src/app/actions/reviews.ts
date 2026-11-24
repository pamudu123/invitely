"use server";

import { refresh } from "next/cache";
import { redirect } from "next/navigation";
import { checkAdminPassword, endAdminSession, isAdmin, startAdminSession } from "@/lib/server/admin";
import { getInvitationByToken } from "@/lib/server/invitations";
import { cleanPins, confirmCard, markReviewReady, requestReview, setPinDone } from "@/lib/server/reviews";

/* ------------------------------ host ------------------------------ */

/** The host sends the spots they marked on their card to the team. */
export async function sendReviewAction(token: string, note: string, pins: unknown): Promise<{ ok: boolean; error?: string }> {
  const inv = await getInvitationByToken(token);
  if (!inv) return { ok: false, error: "Invitation not found." };
  const res = await requestReview(inv, String(note ?? ""), cleanPins(pins));
  if (res.ok) refresh();
  return res;
}

/** The host confirms the card is final. Review requests close after this. */
export async function confirmCardAction(token: string): Promise<{ ok: boolean }> {
  const inv = await getInvitationByToken(token);
  if (!inv) return { ok: false };
  await confirmCard(inv.id);
  refresh();
  return { ok: true };
}

/* ------------------------------ team ------------------------------ */

export async function adminLoginAction(_prev: { error?: string }, formData: FormData): Promise<{ error?: string }> {
  if (!checkAdminPassword(String(formData.get("password") ?? ""))) return { error: "That password is not right." };
  await startAdminSession();
  redirect("/admin");
}

export async function adminLogoutAction(): Promise<void> {
  await endAdminSession();
  redirect("/admin/login");
}

export async function pinDoneAction(reviewId: string, pinId: string, done: boolean): Promise<void> {
  if (!(await isAdmin())) return;
  await setPinDone(reviewId, pinId, done);
  refresh();
}

export async function reviewReadyAction(reviewId: string, reply: string): Promise<{ ok: boolean }> {
  if (!(await isAdmin())) return { ok: false };
  const ok = await markReviewReady(reviewId, reply);
  refresh();
  return { ok };
}
