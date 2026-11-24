import "server-only";
import { db } from "./db";
import { randomId } from "./ids";
import type { InvitationRecord } from "./invitations";

/** A spot the host tapped on their card, with what they want changed there. */
export interface ReviewPin {
  id: string;
  /** Which part of the card: cover, a section id, or footer */
  section: string;
  /** Position inside that part, from 0 to 1 */
  x: number;
  y: number;
  /** The words that were under the tap, so the request makes sense without the picture */
  context: string;
  comment: string;
  done: boolean;
}

export interface ReviewRecord {
  id: string;
  invitationId: string;
  round: number;
  /** open: waiting for the team. ready: changes made, waiting for the host. closed: finished. */
  status: "open" | "ready" | "closed";
  note: string;
  pins: ReviewPin[];
  reply: string;
  createdAt: number;
  updatedAt: number;
}

type Row = Record<string, unknown>;
const clip = (v: unknown, max: number) => (typeof v === "string" ? v.slice(0, max) : "");
const unit = (v: unknown) => Math.min(1, Math.max(0, Number(v) || 0));

export function cleanPins(raw: unknown): ReviewPin[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .slice(0, 40)
    .map((p: Record<string, unknown>) => ({
      id: clip(p?.id, 16) || randomId(8),
      section: clip(p?.section, 24) || "cover",
      x: unit(p?.x),
      y: unit(p?.y),
      context: clip(p?.context, 140),
      comment: clip(p?.comment, 600).trim(),
      done: Boolean(p?.done),
    }))
    .filter((p) => p.comment);
}

function toReview(row: Row): ReviewRecord {
  let pins: ReviewPin[] = [];
  try {
    pins = cleanPins(JSON.parse(String(row.pins)));
  } catch {
    pins = [];
  }
  return {
    id: String(row.id),
    invitationId: String(row.invitation_id),
    round: Number(row.round),
    status: row.status === "ready" ? "ready" : row.status === "closed" ? "closed" : "open",
    note: String(row.note),
    pins,
    reply: String(row.reply),
    createdAt: Number(row.created_at),
    updatedAt: Number(row.updated_at),
  };
}

export async function listReviews(invitationId: string): Promise<ReviewRecord[]> {
  const c = await db();
  const res = await c.execute({ sql: "SELECT * FROM reviews WHERE invitation_id = ? ORDER BY round DESC", args: [invitationId] });
  return res.rows.map((r) => toReview(r as Row));
}

/**
 * The host sends change requests. Allowed until they confirm the card.
 * A request sent while one is still open is added to it, so the team sees one list.
 */
export async function requestReview(inv: InvitationRecord, note: string, pins: ReviewPin[]): Promise<{ ok: boolean; error?: string }> {
  if (inv.reviewStatus === "confirmed") return { ok: false, error: "This card is confirmed, so it can no longer be sent for review." };
  const cleanNote = clip(note, 1500).trim();
  if (!pins.length && !cleanNote) return { ok: false, error: "Tap the card to mark a change, or write a note." };
  const c = await db();
  const now = Date.now();
  const all = await listReviews(inv.id);
  const open = all.find((r) => r.status === "open");
  if (open) {
    const merged = [...open.pins, ...pins].slice(0, 60);
    await c.execute({
      sql: "UPDATE reviews SET pins = ?, note = ?, updated_at = ? WHERE id = ?",
      args: [JSON.stringify(merged), [open.note, cleanNote].filter(Boolean).join("\n\n").slice(0, 3000), now, open.id],
    });
  } else {
    // Anything still marked ready is superseded by the new round.
    await c.execute({ sql: "UPDATE reviews SET status = 'closed' WHERE invitation_id = ? AND status = 'ready'", args: [inv.id] });
    await c.execute({
      sql: "INSERT INTO reviews (id, invitation_id, round, status, note, pins, created_at, updated_at) VALUES (?, ?, ?, 'open', ?, ?, ?, ?)",
      args: [randomId(12), inv.id, (all[0]?.round ?? 0) + 1, cleanNote, JSON.stringify(pins), now, now],
    });
  }
  await c.execute({ sql: "UPDATE invitations SET review_status = 'requested' WHERE id = ?", args: [inv.id] });
  return { ok: true };
}

/** The host is happy. No more review rounds after this. */
export async function confirmCard(invitationId: string): Promise<void> {
  const c = await db();
  const now = Date.now();
  await c.execute({ sql: "UPDATE reviews SET status = 'closed', updated_at = ? WHERE invitation_id = ? AND status != 'closed'", args: [now, invitationId] });
  await c.execute({ sql: "UPDATE invitations SET review_status = 'confirmed', confirmed_at = ? WHERE id = ?", args: [now, invitationId] });
}

/* ------------------------------ team side ------------------------------ */

export async function getReview(reviewId: string): Promise<ReviewRecord | null> {
  const c = await db();
  const res = await c.execute({ sql: "SELECT * FROM reviews WHERE id = ?", args: [reviewId] });
  return res.rows[0] ? toReview(res.rows[0] as Row) : null;
}

export async function setPinDone(reviewId: string, pinId: string, done: boolean): Promise<void> {
  const review = await getReview(reviewId);
  if (!review) return;
  const pins = review.pins.map((p) => (p.id === pinId ? { ...p, done } : p));
  const c = await db();
  await c.execute({ sql: "UPDATE reviews SET pins = ?, updated_at = ? WHERE id = ?", args: [JSON.stringify(pins), Date.now(), reviewId] });
}

/** The team has made the changes. The host is asked to check and confirm. */
export async function markReviewReady(reviewId: string, reply: string, allDone = true): Promise<boolean> {
  const review = await getReview(reviewId);
  if (!review) return false;
  const pins = allDone ? review.pins.map((p) => ({ ...p, done: true })) : review.pins;
  const c = await db();
  await c.execute({
    sql: "UPDATE reviews SET status = 'ready', reply = ?, pins = ?, updated_at = ? WHERE id = ?",
    args: [clip(reply, 1500).trim(), JSON.stringify(pins), Date.now(), reviewId],
  });
  await c.execute({ sql: "UPDATE invitations SET review_status = 'ready' WHERE id = ?", args: [review.invitationId] });
  return true;
}

export interface AdminCard {
  id: string;
  slug: string;
  title: string;
  occasion: string;
  status: string;
  reviewStatus: string;
  manageToken: string;
  ownerName: string;
  ownerContact: string;
  updatedAt: number;
  openPins: number;
  round: number;
}

/** Every card, with those waiting for the team first. */
export async function listAdminCards(): Promise<AdminCard[]> {
  const c = await db();
  const res = await c.execute(
    `SELECT i.id, i.slug, i.title, i.occasion, i.status, i.review_status, i.manage_token, i.owner_name, i.owner_contact, i.updated_at,
            (SELECT r.pins FROM reviews r WHERE r.invitation_id = i.id AND r.status = 'open' LIMIT 1) AS open_pins,
            (SELECT COALESCE(MAX(r.round), 0) FROM reviews r WHERE r.invitation_id = i.id) AS round
       FROM invitations i
      ORDER BY CASE i.review_status WHEN 'requested' THEN 0 WHEN 'ready' THEN 1 ELSE 2 END, i.updated_at DESC
      LIMIT 300`,
  );
  return res.rows.map((r) => {
    let openPins = 0;
    try {
      openPins = r.open_pins ? cleanPins(JSON.parse(String(r.open_pins))).filter((p) => !p.done).length : 0;
    } catch {
      openPins = 0;
    }
    return {
      id: String(r.id),
      slug: String(r.slug),
      title: String(r.title),
      occasion: String(r.occasion),
      status: String(r.status),
      reviewStatus: String(r.review_status ?? "none"),
      manageToken: String(r.manage_token ?? ""),
      ownerName: String(r.owner_name ?? ""),
      ownerContact: String(r.owner_contact ?? ""),
      updatedAt: Number(r.updated_at),
      openPins,
      round: Number(r.round),
    };
  });
}
