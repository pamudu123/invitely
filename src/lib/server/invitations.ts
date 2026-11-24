import "server-only";
import { allSections, occasions } from "@/lib/invitation/occasions";
import { displayNames, normalizeInvitation, templates } from "@/lib/invitation/templates";
import { fontPairs, palettes } from "@/lib/invitation/theme";
import type { InvitationData, LanguageId, WishItem } from "@/lib/invitation/types";
import { db, SYSTEM_OWNER } from "./db";
import { randomId, slugify } from "./ids";
import { hashSecret, isManageToken, newManageToken, verifySecret } from "./secrets";

export interface InvitationRecord {
  id: string;
  /** Secret that grants full control of this card. Never show it to guests. */
  manageToken: string;
  ownerName: string;
  ownerContact: string;
  hasPin: boolean;
  /** none, requested (waiting for the team), ready (waiting for the host) or confirmed */
  reviewStatus: ReviewStatus;
  confirmedAt: number | null;
  slug: string;
  occasion: string;
  title: string;
  status: "draft" | "published";
  plan: string;
  data: InvitationData;
  views: number;
  createdAt: number;
  updatedAt: number;
  publishedAt: number | null;
}

export type ReviewStatus = "none" | "requested" | "ready" | "confirmed";

export interface InvitationSummary extends Omit<InvitationRecord, "data"> {
  templateId: string;
  date: string;
  attending: number;
  declined: number;
  headcount: number;
  guestCount: number;
}

export interface GuestRecord {
  id: string;
  invitationId: string;
  name: string;
  seats: number;
  token: string;
  table: string;
  phone: string;
  openedAt: number | null;
  checkedInAt: number | null;
  createdAt: number;
}

export interface RsvpRecord {
  id: string;
  invitationId: string;
  guestId: string | null;
  name: string;
  phone: string;
  attending: boolean;
  partySize: number;
  meal: string;
  answer: string;
  message: string;
  hidden: boolean;
  createdAt: number;
  updatedAt: number;
}

type Row = Record<string, unknown>;

const clip = (v: unknown, max: number): string => (typeof v === "string" ? v.slice(0, max) : "");
const oneOf = <T extends string>(v: unknown, allowed: readonly T[], fallback: T): T =>
  allowed.includes(v as T) ? (v as T) : fallback;
const hex = (v: unknown): string | undefined =>
  typeof v === "string" && /^#[0-9a-fA-F]{6}$/.test(v) ? v : undefined;
const isDate = (v: unknown): v is string => typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v);
const isTime = (v: unknown): v is string => typeof v === "string" && /^\d{2}:\d{2}$/.test(v);

const MEDIA_PATH = /^\/api\/media\/[a-z0-9]{6,32}$/;
const DATA_URL = /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/;
const MAX_IMAGE_BYTES = 1_400_000;

/** Store an inline image and return its URL. Unknown or oversized values are dropped. */
async function resolveImage(value: unknown): Promise<string | undefined> {
  if (typeof value !== "string" || !value) return undefined;
  if (MEDIA_PATH.test(value)) return value;
  if (/^https:\/\/[^\s"'<>]{4,500}$/.test(value)) return value;
  const m = DATA_URL.exec(value);
  if (!m) return undefined;
  const bytes = Buffer.from(m[2], "base64");
  if (!bytes.length || bytes.length > MAX_IMAGE_BYTES) return undefined;
  const id = randomId(16);
  const c = await db();
  await c.execute({
    sql: "INSERT INTO media (id, user_id, mime, bytes, created_at) VALUES (?, ?, ?, ?, ?)",
    args: [id, SYSTEM_OWNER, m[1], bytes, Date.now()],
  });
  return `/api/media/${id}`;
}

const ritualIds = ["lamp", "seal", "curtain", "lotus", "scratch", "balloon", "betel", "doors", "clapper", "gift", "none"] as const;
const ornamentIds = ["liyawel", "lotus", "botanical", "deco", "stars", "kolam", "geometric", "confetti", "waves", "mandala", "peacock", "paisley", "tracery", "film", "snow", "sun", "betel", "minimal"] as const;
const heroIds = ["classic", "arch", "photo", "monogram", "frame", "poster", "ticket", "gazette", "polaroid"] as const;
const musicIds = ["none", "serene", "warm", "joyful", "custom"] as const;
const effectIds = ["none", "petals", "sparkles", "confetti", "snow"] as const;
const langIds = ["en", "si", "ta"] as const;

/** Validate and clamp anything a client sends before it is stored. */
export async function sanitizeInvitation(raw: unknown): Promise<InvitationData> {
  const d = normalizeInvitation(raw);
  const occasion = oneOf(d.occasion, occasions.map((o) => o.id), "wedding");
  const templateId = oneOf(d.templateId, templates.map((t) => t.id), templates[0].id);
  const custom = d.theme.custom ?? {};
  const cleanCustom = {
    bg: hex(custom.bg),
    surface: hex(custom.surface),
    ink: hex(custom.ink),
    accent: hex(custom.accent),
    deep: hex(custom.deep),
    onDeep: hex(custom.onDeep),
  };
  const customEntries = Object.entries(cleanCustom).filter(([, v]) => v);
  const musicUrl = typeof d.theme.musicUrl === "string" && /^https:\/\/[^\s"'<>]{4,500}$/.test(d.theme.musicUrl) ? d.theme.musicUrl : undefined;

  const languages = Array.from(new Set((d.languages as unknown[]).filter((l): l is LanguageId => langIds.includes(l as LanguageId)))).slice(0, 3);
  const language = oneOf(d.language, langIds, "en");
  if (!languages.includes(language)) languages.unshift(language);

  const translations: InvitationData["translations"] = {};
  for (const l of langIds) {
    const t = d.translations?.[l];
    if (t && typeof t === "object") {
      translations[l] = { kicker: clip(t.kicker, 160), message: clip(t.message, 900), closing: clip(t.closing, 300) };
    }
  }

  const gallery: string[] = [];
  for (const g of d.gallery.slice(0, 12)) {
    const url = await resolveImage(g);
    if (url) gallery.push(url);
  }
  const story = [];
  for (const s of d.story.slice(0, 6)) {
    story.push({
      id: clip(s.id, 24) || randomId(6),
      title: clip(s.title, 100),
      when: clip(s.when, 40),
      text: clip(s.text, 600),
      photo: await resolveImage(s.photo),
    });
  }

  return {
    version: 1,
    occasion,
    templateId,
    theme: {
      paletteId: oneOf(d.theme.paletteId, palettes.map((p) => p.id), palettes[0].id),
      custom: customEntries.length ? (Object.fromEntries(customEntries) as InvitationData["theme"]["custom"]) : undefined,
      fontPair: oneOf(d.theme.fontPair, fontPairs.map((f) => f.id), "classic"),
      ornament: oneOf(d.theme.ornament, ornamentIds, "minimal"),
      hero: oneOf(d.theme.hero, heroIds, "classic"),
      ritual: oneOf(d.theme.ritual, ritualIds, "none"),
      music: oneOf(d.theme.music, musicIds, "none"),
      musicUrl,
      effect: oneOf(d.theme.effect, effectIds, "none"),
    },
    name1: clip(d.name1, 60) || "Your name",
    name2: clip(d.name2, 60),
    kicker: clip(d.kicker, 160),
    subline: clip(d.subline, 160),
    message: clip(d.message, 900),
    hostsLine: clip(d.hostsLine, 200),
    date: isDate(d.date) ? d.date : "2027-01-01",
    time: isTime(d.time) ? d.time : "18:00",
    timezone: clip(d.timezone, 60) || "Asia/Colombo",
    venueName: clip(d.venueName, 120),
    venueAddress: clip(d.venueAddress, 200),
    mapQuery: clip(d.mapQuery, 400),
    heroPhoto: await resolveImage(d.heroPhoto),
    gallery,
    events: d.events.slice(0, 16).map((e) => ({
      id: clip(e.id, 24) || randomId(6),
      title: clip(e.title, 100),
      date: isDate(e.date) ? e.date : undefined,
      time: isTime(e.time) ? e.time : "00:00",
      endTime: isTime(e.endTime) ? e.endTime : undefined,
      place: clip(e.place, 120),
      note: clip(e.note, 200),
    })),
    nekath: d.nekath.slice(0, 10).map((n) => ({
      id: clip(n.id, 24) || randomId(6),
      title: clip(n.title, 100),
      date: isDate(n.date) ? n.date : undefined,
      time: isTime(n.time) ? n.time : "00:00",
      note: clip(n.note, 200),
    })),
    story,
    contacts: d.contacts.slice(0, 6).map((c) => ({
      id: clip(c.id, 24) || randomId(6),
      name: clip(c.name, 60),
      role: clip(c.role, 40),
      phone: clip(c.phone, 30),
    })),
    dressCode: clip(d.dressCode, 160),
    notes: clip(d.notes, 600),
    giftNote: clip(d.giftNote, 600),
    hashtag: clip(d.hashtag, 60),
    thankYou: clip(d.thankYou, 600),
    rsvp: {
      enabled: Boolean(d.rsvp.enabled),
      deadline: isDate(d.rsvp.deadline) ? d.rsvp.deadline : undefined,
      maxPartySize: Math.min(20, Math.max(1, Math.round(Number(d.rsvp.maxPartySize) || 1))),
      askMeal: Boolean(d.rsvp.askMeal),
      mealOptions: (Array.isArray(d.rsvp.mealOptions) ? d.rsvp.mealOptions : []).slice(0, 8).map((m) => clip(m, 40)).filter(Boolean),
      askMessage: Boolean(d.rsvp.askMessage),
      customQuestion: clip(d.rsvp.customQuestion, 120),
    },
    sections: Array.from(new Set(d.sections.filter((s) => allSections.includes(s)))),
    language,
    languages,
    translations,
    ritualHint: clip(d.ritualHint, 60),
  };
}

function toRecord(row: Row): InvitationRecord {
  let data: InvitationData;
  try {
    data = normalizeInvitation(JSON.parse(String(row.data)));
  } catch {
    data = normalizeInvitation({});
  }
  return {
    id: String(row.id),
    manageToken: String(row.manage_token ?? ""),
    ownerName: String(row.owner_name ?? ""),
    ownerContact: String(row.owner_contact ?? ""),
    hasPin: Boolean(row.pin_hash),
    reviewStatus: (["requested", "ready", "confirmed"].includes(String(row.review_status)) ? String(row.review_status) : "none") as ReviewStatus,
    confirmedAt: row.confirmed_at === null || row.confirmed_at === undefined ? null : Number(row.confirmed_at),
    slug: String(row.slug),
    occasion: String(row.occasion),
    title: String(row.title),
    status: row.status === "published" ? "published" : "draft",
    plan: String(row.plan),
    data,
    views: Number(row.views),
    createdAt: Number(row.created_at),
    updatedAt: Number(row.updated_at),
    publishedAt: row.published_at === null ? null : Number(row.published_at),
  };
}

async function uniqueSlug(base: string, excludeId?: string): Promise<string> {
  const c = await db();
  const root = slugify(base) || "invitation";
  for (let i = 0; i < 6; i++) {
    const candidate = i === 0 ? root : `${root}-${randomId(4)}`;
    const res = await c.execute({ sql: "SELECT id FROM invitations WHERE slug = ?", args: [candidate] });
    if (!res.rows.length || String(res.rows[0].id) === excludeId) return candidate;
  }
  return `${root}-${randomId(8)}`;
}

export interface OwnerDetails {
  name: string;
  contact: string;
  pin: string;
}

export async function createInvitation(data: InvitationData, owner: OwnerDetails): Promise<InvitationRecord> {
  const c = await db();
  const id = randomId(12);
  const now = Date.now();
  const title = displayNames(data);
  const slug = await uniqueSlug(title);
  const token = newManageToken();
  const pin = cleanPin(owner.pin);
  await c.execute({
    sql: `INSERT INTO invitations (id, user_id, slug, occasion, title, status, plan, data, created_at, updated_at, manage_token, owner_name, owner_contact, pin_hash)
          VALUES (?, ?, ?, ?, ?, 'draft', 'free', ?, ?, ?, ?, ?, ?, ?)`,
    args: [id, SYSTEM_OWNER, slug, data.occasion, title, JSON.stringify(data), now, now, token, clip(owner.name, 80), clip(owner.contact, 120), pin ? await hashSecret(pin) : ""],
  });
  return (await getInvitationByToken(token))!;
}

/** Look a card up by its private manage link. This is the only owner check there is. */
export async function getInvitationByToken(token: string): Promise<InvitationRecord | null> {
  if (!isManageToken(token)) return null;
  const c = await db();
  const res = await c.execute({ sql: "SELECT * FROM invitations WHERE manage_token = ?", args: [token] });
  return res.rows[0] ? toRecord(res.rows[0] as Row) : null;
}

/** PINs are 4 to 8 digits. Anything else counts as no PIN. */
export function cleanPin(pin: string): string {
  const digits = String(pin ?? "").replace(/\D/g, "");
  return digits.length >= 4 && digits.length <= 8 ? digits : "";
}

export async function setInvitationPin(id: string, pin: string): Promise<boolean> {
  const clean = cleanPin(pin);
  if (!clean) return false;
  const c = await db();
  await c.execute({
    sql: "UPDATE invitations SET pin_hash = ?, pin_fails = 0, pin_locked_until = 0 WHERE id = ?",
    args: [await hashSecret(clean), id],
  });
  return true;
}

export async function setInvitationOwner(id: string, name: string, contact: string): Promise<void> {
  const c = await db();
  await c.execute({
    sql: "UPDATE invitations SET owner_name = ?, owner_contact = ? WHERE id = ?",
    args: [clip(name, 80), clip(contact, 120), id],
  });
}

const PIN_TRIES = 5;
const PIN_LOCK_MS = 15 * 60_000;

/**
 * Recover the manage link with the card's public link and its PIN.
 * Five wrong tries lock the card for fifteen minutes.
 */
export async function recoverWithPin(
  slug: string,
  pin: string,
  now: number,
): Promise<{ ok: true; token: string } | { ok: false; reason: "not-found" | "no-pin" | "locked" | "wrong" }> {
  const c = await db();
  const res = await c.execute({
    sql: "SELECT id, manage_token, pin_hash, pin_fails, pin_locked_until FROM invitations WHERE slug = ?",
    args: [slug],
  });
  const row = res.rows[0];
  if (!row) return { ok: false, reason: "not-found" };
  if (!row.pin_hash) return { ok: false, reason: "no-pin" };
  if (Number(row.pin_locked_until) > now) return { ok: false, reason: "locked" };
  const good = await verifySecret(cleanPin(pin), String(row.pin_hash)).catch(() => false);
  if (good) {
    await c.execute({ sql: "UPDATE invitations SET pin_fails = 0, pin_locked_until = 0 WHERE id = ?", args: [String(row.id)] });
    return { ok: true, token: String(row.manage_token) };
  }
  const fails = Number(row.pin_fails) + 1;
  const lock = fails >= PIN_TRIES;
  await c.execute({
    sql: "UPDATE invitations SET pin_fails = ?, pin_locked_until = ? WHERE id = ?",
    args: [lock ? 0 : fails, lock ? now + PIN_LOCK_MS : 0, String(row.id)],
  });
  return { ok: false, reason: lock ? "locked" : "wrong" };
}

export async function getInvitationBySlug(slug: string): Promise<InvitationRecord | null> {
  const c = await db();
  const res = await c.execute({ sql: "SELECT * FROM invitations WHERE slug = ?", args: [slug] });
  return res.rows[0] ? toRecord(res.rows[0] as Row) : null;
}

/** Summaries for the cards a device remembers. Unknown tokens are skipped. */
export async function listInvitationsByTokens(tokens: string[]): Promise<InvitationSummary[]> {
  const valid = Array.from(new Set(tokens.filter(isManageToken))).slice(0, 50);
  if (!valid.length) return [];
  const c = await db();
  const res = await c.execute({
    sql: `SELECT i.*,
            (SELECT COUNT(*) FROM rsvps r WHERE r.invitation_id = i.id AND r.attending = 1) AS attending,
            (SELECT COUNT(*) FROM rsvps r WHERE r.invitation_id = i.id AND r.attending = 0) AS declined,
            (SELECT COALESCE(SUM(r.party_size), 0) FROM rsvps r WHERE r.invitation_id = i.id AND r.attending = 1) AS headcount,
            (SELECT COUNT(*) FROM guests g WHERE g.invitation_id = i.id) AS guest_count
          FROM invitations i WHERE i.manage_token IN (${valid.map(() => "?").join(", ")}) ORDER BY i.updated_at DESC`,
    args: valid,
  });
  return res.rows.map((r) => {
    const row = r as Row;
    const { data, ...rest } = toRecord(row);
    return {
      ...rest,
      templateId: data.templateId,
      date: data.date,
      attending: Number(row.attending),
      declined: Number(row.declined),
      headcount: Number(row.headcount),
      guestCount: Number(row.guest_count),
    };
  });
}

export async function updateInvitationData(id: string, data: InvitationData): Promise<boolean> {
  const c = await db();
  const res = await c.execute({
    sql: "UPDATE invitations SET data = ?, title = ?, occasion = ?, updated_at = ? WHERE id = ?",
    args: [JSON.stringify(data), displayNames(data), data.occasion, Date.now(), id],
  });
  return res.rowsAffected > 0;
}

export async function setInvitationStatus(id: string, status: "draft" | "published", plan?: string): Promise<boolean> {
  const c = await db();
  const now = Date.now();
  const res = await c.execute({
    sql: `UPDATE invitations SET status = ?, plan = COALESCE(?, plan), updated_at = ?,
            published_at = CASE WHEN ? = 'published' THEN COALESCE(published_at, ?) ELSE published_at END
          WHERE id = ?`,
    args: [status, plan ?? null, now, status, now, id],
  });
  return res.rowsAffected > 0;
}

export async function setInvitationSlug(id: string, desired: string): Promise<{ ok: boolean; slug?: string; error?: string }> {
  const slug = slugify(desired);
  if (slug.length < 3) return { ok: false, error: "Use at least 3 letters or numbers." };
  const c = await db();
  const taken = await c.execute({ sql: "SELECT id FROM invitations WHERE slug = ? AND id != ?", args: [slug, id] });
  if (taken.rows.length) return { ok: false, error: "That link is already taken." };
  const res = await c.execute({
    sql: "UPDATE invitations SET slug = ?, updated_at = ? WHERE id = ?",
    args: [slug, Date.now(), id],
  });
  return res.rowsAffected > 0 ? { ok: true, slug } : { ok: false, error: "Invitation not found." };
}

export async function deleteInvitation(id: string): Promise<boolean> {
  const c = await db();
  const res = await c.execute({ sql: "DELETE FROM invitations WHERE id = ?", args: [id] });
  return res.rowsAffected > 0;
}

export async function recordView(id: string): Promise<void> {
  const c = await db();
  await c.execute({ sql: "UPDATE invitations SET views = views + 1 WHERE id = ?", args: [id] });
}

/* ------------------------------- Guests ------------------------------- */

function toGuest(row: Row): GuestRecord {
  return {
    id: String(row.id),
    invitationId: String(row.invitation_id),
    name: String(row.name),
    seats: Number(row.seats),
    token: String(row.token),
    table: String(row.table_name),
    phone: String(row.phone),
    openedAt: row.opened_at === null ? null : Number(row.opened_at),
    checkedInAt: row.checked_in_at === null ? null : Number(row.checked_in_at),
    createdAt: Number(row.created_at),
  };
}

export async function listGuests(invitationId: string): Promise<GuestRecord[]> {
  const c = await db();
  const res = await c.execute({ sql: "SELECT * FROM guests WHERE invitation_id = ? ORDER BY created_at ASC, name ASC", args: [invitationId] });
  return res.rows.map((r) => toGuest(r as Row));
}

export async function addGuests(
  invitationId: string,
  list: { name: string; seats: number; phone?: string; table?: string }[],
): Promise<number> {
  const c = await db();
  const now = Date.now();
  let added = 0;
  for (const g of list.slice(0, 500)) {
    const name = clip(g.name, 80).trim();
    if (!name) continue;
    await c.execute({
      sql: "INSERT INTO guests (id, invitation_id, name, seats, token, table_name, phone, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      args: [randomId(12), invitationId, name, Math.min(20, Math.max(1, Math.round(g.seats) || 1)), randomId(10), clip(g.table, 40), clip(g.phone, 30), now + added],
    });
    added++;
  }
  return added;
}

export async function updateGuest(
  invitationId: string,
  guestId: string,
  patch: { name: string; seats: number; phone: string; table: string },
): Promise<void> {
  const c = await db();
  await c.execute({
    sql: "UPDATE guests SET name = ?, seats = ?, phone = ?, table_name = ? WHERE id = ? AND invitation_id = ?",
    args: [clip(patch.name, 80).trim() || "Guest", Math.min(20, Math.max(1, Math.round(patch.seats) || 1)), clip(patch.phone, 30), clip(patch.table, 40), guestId, invitationId],
  });
}

export async function deleteGuest(invitationId: string, guestId: string): Promise<void> {
  const c = await db();
  await c.execute({ sql: "DELETE FROM guests WHERE id = ? AND invitation_id = ?", args: [guestId, invitationId] });
}

export async function getGuestByToken(invitationId: string, token: string): Promise<GuestRecord | null> {
  if (!/^[a-z0-9]{6,20}$/.test(token)) return null;
  const c = await db();
  const res = await c.execute({ sql: "SELECT * FROM guests WHERE invitation_id = ? AND token = ?", args: [invitationId, token] });
  return res.rows[0] ? toGuest(res.rows[0] as Row) : null;
}

export async function markGuestOpened(guestId: string): Promise<void> {
  const c = await db();
  await c.execute({ sql: "UPDATE guests SET opened_at = COALESCE(opened_at, ?) WHERE id = ?", args: [Date.now(), guestId] });
}

export async function setGuestCheckedIn(invitationId: string, guestId: string, checkedIn: boolean): Promise<void> {
  const c = await db();
  await c.execute({
    sql: "UPDATE guests SET checked_in_at = ? WHERE id = ? AND invitation_id = ?",
    args: [checkedIn ? Date.now() : null, guestId, invitationId],
  });
}

/* -------------------------------- RSVPs -------------------------------- */

function toRsvp(row: Row): RsvpRecord {
  return {
    id: String(row.id),
    invitationId: String(row.invitation_id),
    guestId: row.guest_id === null ? null : String(row.guest_id),
    name: String(row.name),
    phone: String(row.phone),
    attending: Number(row.attending) === 1,
    partySize: Number(row.party_size),
    meal: String(row.meal),
    answer: String(row.answer),
    message: String(row.message),
    hidden: Number(row.hidden) === 1,
    createdAt: Number(row.created_at),
    updatedAt: Number(row.updated_at),
  };
}

export async function listRsvps(invitationId: string): Promise<RsvpRecord[]> {
  const c = await db();
  const res = await c.execute({ sql: "SELECT * FROM rsvps WHERE invitation_id = ? ORDER BY updated_at DESC", args: [invitationId] });
  return res.rows.map((r) => toRsvp(r as Row));
}

export async function getRsvpForGuest(guestId: string): Promise<RsvpRecord | null> {
  const c = await db();
  const res = await c.execute({ sql: "SELECT * FROM rsvps WHERE guest_id = ? ORDER BY updated_at DESC LIMIT 1", args: [guestId] });
  return res.rows[0] ? toRsvp(res.rows[0] as Row) : null;
}

export async function saveRsvp(input: {
  invitationId: string;
  guestId: string | null;
  name: string;
  phone: string;
  attending: boolean;
  partySize: number;
  meal: string;
  answer: string;
  message: string;
}): Promise<void> {
  const c = await db();
  const now = Date.now();
  if (input.guestId) {
    const existing = await getRsvpForGuest(input.guestId);
    if (existing) {
      await c.execute({
        sql: "UPDATE rsvps SET name = ?, phone = ?, attending = ?, party_size = ?, meal = ?, answer = ?, message = ?, updated_at = ? WHERE id = ?",
        args: [input.name, input.phone, input.attending ? 1 : 0, input.partySize, input.meal, input.answer, input.message, now, existing.id],
      });
      return;
    }
  }
  await c.execute({
    sql: `INSERT INTO rsvps (id, invitation_id, guest_id, name, phone, attending, party_size, meal, answer, message, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [randomId(12), input.invitationId, input.guestId, input.name, input.phone, input.attending ? 1 : 0, input.partySize, input.meal, input.answer, input.message, now, now],
  });
}

export async function countRecentRsvps(invitationId: string, sinceMs: number): Promise<number> {
  const c = await db();
  const res = await c.execute({ sql: "SELECT COUNT(*) AS n FROM rsvps WHERE invitation_id = ? AND created_at > ?", args: [invitationId, sinceMs] });
  return Number(res.rows[0]?.n ?? 0);
}

export async function listWishes(invitationId: string): Promise<WishItem[]> {
  const c = await db();
  const res = await c.execute({
    sql: "SELECT id, name, message FROM rsvps WHERE invitation_id = ? AND hidden = 0 AND message != '' ORDER BY updated_at DESC LIMIT 24",
    args: [invitationId],
  });
  return res.rows.map((r) => ({ id: String(r.id), name: String(r.name), message: String(r.message) }));
}

export async function setRsvpHidden(invitationId: string, rsvpId: string, hidden: boolean): Promise<void> {
  const c = await db();
  await c.execute({ sql: "UPDATE rsvps SET hidden = ? WHERE id = ? AND invitation_id = ?", args: [hidden ? 1 : 0, rsvpId, invitationId] });
}

export async function deleteRsvp(invitationId: string, rsvpId: string): Promise<void> {
  const c = await db();
  await c.execute({ sql: "DELETE FROM rsvps WHERE id = ? AND invitation_id = ?", args: [rsvpId, invitationId] });
}

export async function getMedia(id: string): Promise<{ mime: string; bytes: Uint8Array } | null> {
  if (!/^[a-z0-9]{6,32}$/.test(id)) return null;
  const c = await db();
  const res = await c.execute({ sql: "SELECT mime, bytes FROM media WHERE id = ?", args: [id] });
  const row = res.rows[0];
  if (!row) return null;
  const raw = row.bytes as ArrayBuffer | Uint8Array;
  return { mime: String(row.mime), bytes: raw instanceof Uint8Array ? raw : new Uint8Array(raw) };
}
