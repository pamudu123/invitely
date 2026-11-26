"use server";

import { refresh } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { InvitationData } from "@/lib/invitation/types";
import { paymentsMode } from "@/lib/plans";
import { slugify } from "@/lib/server/ids";
import { allow, callerKey } from "@/lib/server/ratelimit";
import {
  cleanPin,
  createInvitation,
  deleteInvitation,
  getInvitationByToken,
  listInvitationsByTokens,
  recoverWithPin,
  sanitizeInvitation,
  setInvitationOwner,
  setInvitationPin,
  setInvitationSlug,
  setInvitationStatus,
  updateInvitationData,
  type InvitationSummary,
} from "@/lib/server/invitations";

/*
 * There are no host accounts. Whoever holds a card's manage token owns it, so
 * every action below takes that token and looks the card up with it.
 */

export interface OwnerInput {
  name: string;
  contact: string;
  pin: string;
}

export type SaveResult =
  | { ok: true; id: string; slug: string; data: InvitationData }
  | { ok: false; error: "owner" | "not-found" | "invalid" | "busy" };

const CREATE_LIMIT = 20;
const HOUR = 3600_000;

/** Slows down scripted card creation. */
async function allowCreate(): Promise<boolean> {
  return allow(`create:${callerKey(await headers())}`, CREATE_LIMIT, HOUR);
}

/**
 * Create or update a card. `token` is the manage token of an existing card, or null for a new one.
 * A new card needs the owner's details, so the first call without them answers "owner".
 * The returned `id` is the manage token.
 */
export async function saveInvitationAction(token: string | null, raw: unknown, owner?: OwnerInput): Promise<SaveResult> {
  if (!token) {
    if (!owner) return { ok: false, error: "owner" };
    if (!(await allowCreate())) return { ok: false, error: "busy" };
  }
  let data: InvitationData;
  try {
    data = await sanitizeInvitation(raw);
  } catch {
    return { ok: false, error: "invalid" };
  }
  if (!token) {
    const made = await createInvitation(data, owner!);
    return { ok: true, id: made.manageToken, slug: made.slug, data };
  }
  const existing = await getInvitationByToken(token);
  if (!existing) return { ok: false, error: "not-found" };
  await updateInvitationData(existing.id, data);
  return { ok: true, id: token, slug: existing.slug, data };
}

export async function publishAction(token: string): Promise<{ ok: boolean; error?: string }> {
  const inv = await getInvitationByToken(token);
  if (!inv) return { ok: false, error: "Invitation not found." };
  if (paymentsMode() === "manual" && inv.plan === "free") {
    return { ok: false, error: "payment" };
  }
  await setInvitationStatus(inv.id, "published", inv.plan === "free" ? "signature" : undefined);
  refresh();
  return { ok: true };
}

export async function unpublishAction(token: string): Promise<{ ok: boolean }> {
  const inv = await getInvitationByToken(token);
  if (!inv) return { ok: false };
  const ok = await setInvitationStatus(inv.id, "draft");
  refresh();
  return { ok };
}

export async function changeSlugAction(token: string, slug: string): Promise<{ ok: boolean; slug?: string; error?: string }> {
  const inv = await getInvitationByToken(token);
  if (!inv) return { ok: false, error: "Invitation not found." };
  const res = await setInvitationSlug(inv.id, slug);
  if (res.ok) refresh();
  return res;
}

export async function deleteInvitationAction(token: string): Promise<void> {
  const inv = await getInvitationByToken(token);
  if (inv) await deleteInvitation(inv.id);
  redirect("/my");
}

export async function setPinAction(token: string, pin: string): Promise<{ ok: boolean; error?: string }> {
  const inv = await getInvitationByToken(token);
  if (!inv) return { ok: false, error: "Invitation not found." };
  if (!cleanPin(pin)) return { ok: false, error: "Use 4 to 8 digits." };
  await setInvitationPin(inv.id, pin);
  refresh();
  return { ok: true };
}

export async function setOwnerAction(token: string, name: string, contact: string): Promise<{ ok: boolean }> {
  const inv = await getInvitationByToken(token);
  if (!inv) return { ok: false };
  await setInvitationOwner(inv.id, name, contact);
  refresh();
  return { ok: true };
}

/** Cards this device remembers, looked up by their manage tokens. */
export async function myCardsAction(tokens: string[]): Promise<InvitationSummary[]> {
  if (!Array.isArray(tokens)) return [];
  return listInvitationsByTokens(tokens.filter((t): t is string => typeof t === "string"));
}

/** Get back into a card with its public link and edit PIN. */
export async function findCardAction(link: string, pin: string): Promise<{ ok: true; token: string } | { ok: false; error: string }> {
  // Accept a pasted full link, "/i/name" or just the name.
  const text = String(link ?? "").trim();
  const match = /\/i\/([^/?#\s]+)/.exec(text);
  const slug = slugify(decodeURIComponent(match ? match[1] : text));
  if (!slug) return { ok: false, error: "Enter the link of your invitation." };
  const res = await recoverWithPin(slug, String(pin ?? ""), Date.now());
  if (res.ok) return res;
  const messages = {
    "not-found": "We could not find an invitation with that link.",
    "no-pin": "This invitation has no edit PIN. Open your private manage link, or contact support.",
    locked: "Too many wrong tries. Please wait 15 minutes and try again.",
    wrong: "That PIN is not right.",
  } as const;
  return { ok: false, error: messages[res.reason] };
}
