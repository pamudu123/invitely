"use server";

import { refresh } from "next/cache";
import { redirect } from "next/navigation";
import type { InvitationData } from "@/lib/invitation/types";
import { paymentsMode } from "@/lib/plans";
import { getUser, requireUser } from "@/lib/server/auth";
import {
  createInvitation,
  deleteInvitation,
  getInvitation,
  sanitizeInvitation,
  setInvitationSlug,
  setInvitationStatus,
  updateInvitationData,
} from "@/lib/server/invitations";

export type SaveResult =
  | { ok: true; id: string; slug: string; data: InvitationData }
  | { ok: false; error: "auth" | "not-found" | "invalid" };

/** Create or update an invitation. Returns "auth" when signed out so the studio can keep the local draft. */
export async function saveInvitationAction(id: string | null, raw: unknown): Promise<SaveResult> {
  const user = await getUser();
  if (!user) return { ok: false, error: "auth" };
  let data: InvitationData;
  try {
    data = await sanitizeInvitation(raw, user.id);
  } catch {
    return { ok: false, error: "invalid" };
  }
  if (!id) {
    const created = await createInvitation(user.id, data);
    return { ok: true, id: created.id, slug: created.slug, data };
  }
  const existing = await getInvitation(id, user.id);
  if (!existing) return { ok: false, error: "not-found" };
  await updateInvitationData(id, user.id, data);
  return { ok: true, id, slug: existing.slug, data };
}

export async function publishAction(id: string): Promise<{ ok: boolean; error?: string }> {
  const user = await requireUser();
  const inv = await getInvitation(id, user.id);
  if (!inv) return { ok: false, error: "Invitation not found." };
  if (paymentsMode() === "manual" && inv.plan === "free") {
    return { ok: false, error: "payment" };
  }
  await setInvitationStatus(id, user.id, "published", inv.plan === "free" ? "signature" : undefined);
  refresh();
  return { ok: true };
}

export async function unpublishAction(id: string): Promise<{ ok: boolean }> {
  const user = await requireUser();
  const ok = await setInvitationStatus(id, user.id, "draft");
  refresh();
  return { ok };
}

export async function changeSlugAction(id: string, slug: string): Promise<{ ok: boolean; slug?: string; error?: string }> {
  const user = await requireUser();
  const res = await setInvitationSlug(id, user.id, slug);
  if (res.ok) refresh();
  return res;
}

export async function deleteInvitationAction(id: string): Promise<void> {
  const user = await requireUser();
  await deleteInvitation(id, user.id);
  redirect("/dashboard");
}
