import { cardFormats, cardLayouts, getPrintDesign, printDesigns, type CardLayoutId } from "./cards";
import { ornamentIds } from "./ornamentIds";
import type { ShapeId } from "./shapes";
import { fontPairs, palettes } from "./theme";
import type { FontPairId, InvitationData, OrnamentId, Palette, ThemeConfig } from "./types";

/*
 * What a host changed on an image card or a printed card. Anything left out
 * follows the web card, so a card nobody has touched is an empty design.
 */

export type CardKind = "image" | "print";
export type CardSide = "front" | "back";

/** Wording that can differ from the web card */
export type CardWord = "name1" | "name2" | "kicker" | "subline" | "venueName" | "venueAddress" | "message" | "hostsLine";

/** Parts that can be switched off */
export type CardPart = "crest" | "divider" | "border" | "kicker" | "subline" | "address" | "message" | "hosts" | "schedule" | "nekath" | "notes" | "qr";

/** background: behind the words. emblem: in place of the crest. full: the picture is the whole side. */
export type PicturePlacement = "background" | "emblem" | "full";

export interface CardPicture {
  src: string;
  /** Pixel width, and width divided by height, of the uploaded file */
  px: number;
  ratio: number;
  placement: PicturePlacement;
  /** Which part of the picture stays in view, in percent */
  x: number;
  y: number;
  zoom: number;
  /** How much paper colour covers the picture, in percent */
  wash: number;
}

export interface CardSticker {
  id: string;
  side: CardSide;
  src: string;
  px: number;
  ratio: number;
  /** Centre and width, in percent of the card, bleed included */
  x: number;
  y: number;
  w: number;
  rotate: number;
  shape: "none" | "rounded" | "circle";
}

export interface CardDesign {
  /** Image card: a layout. Printed card: a design from the collection. */
  base?: string;
  /** Printed card: another front for a straight edged card */
  layout?: CardLayoutId;
  format?: string;
  footer?: "link" | "qr" | "none";
  theme: { paletteId?: string; custom?: Partial<Palette>; fontPair?: FontPairId; ornament?: OrnamentId };
  /** Swap the paper and deep tones */
  flip: boolean;
  /** Type size in percent */
  names: number;
  text: number;
  hide: CardPart[];
  words: Partial<Record<CardWord, string>>;
  front?: CardPicture;
  back?: CardPicture;
  stickers: CardSticker[];
}

export interface CardDesigns {
  image?: CardDesign;
  print?: CardDesign;
}

/** A change, or a function of the newest design for changes that arrive late, such as an upload */
export type CardPatch = Partial<CardDesign> | ((current: CardDesign) => Partial<CardDesign>);

export const MAX_STICKERS = 6;
export const NAMES_RANGE = [60, 130] as const;
export const TEXT_RANGE = [80, 125] as const;

export const wordLimits: Record<CardWord, number> = {
  name1: 60, name2: 60, kicker: 160, subline: 160, venueName: 120, venueAddress: 200, message: 900, hostsLine: 200,
};

const cardParts: CardPart[] = ["crest", "divider", "border", "kicker", "subline", "address", "message", "hosts", "schedule", "nekath", "notes", "qr"];

export const emptyCardDesign = (): CardDesign => ({ theme: {}, flip: false, names: 100, text: 100, hide: [], words: {}, stickers: [] });

/** Straight edged printed cards can use any of these fronts. */
export const straightFronts = cardLayouts.filter((l) => l.orientation === "portrait");

/** The crest is the only place an emblem can sit, and not every face has one. */
export function hasEmblem(layout: CardLayoutId, shape?: ShapeId): boolean {
  if (layout === "shaped") return shape !== "moonstone";
  return ["frame", "arch", "band", "seal"].includes(layout);
}

/** The lamp only glows on a dark card. */
export const canFlip = (layout: CardLayoutId) => layout !== "lamp";

/** The card's content and theme with the host's changes on top. */
export function applyCardDesign(data: InvitationData, design?: CardDesign): InvitationData {
  if (!design) return data;
  const t = design.theme;
  const theme: ThemeConfig = {
    ...data.theme,
    ...(t.paletteId ? { paletteId: t.paletteId, custom: undefined } : {}),
    ...(t.fontPair ? { fontPair: t.fontPair } : {}),
    ...(t.ornament ? { ornament: t.ornament } : {}),
  };
  if (t.custom) theme.custom = { ...theme.custom, ...t.custom };
  const next: InvitationData = { ...data, theme };
  for (const [key, value] of Object.entries(design.words) as [CardWord, string][]) {
    if (value.trim()) next[key] = value;
  }
  const off = (part: CardPart) => design.hide.includes(part);
  if (off("kicker")) next.kicker = "";
  if (off("subline")) next.subline = "";
  if (off("address")) next.venueAddress = "";
  if (off("message")) next.message = "";
  if (off("hosts")) next.hostsLine = "";
  if (off("schedule")) next.events = [];
  if (off("nekath")) next.nekath = [];
  if (off("notes")) {
    next.dressCode = "";
    next.rsvp = { ...next.rsvp, deadline: undefined };
  }
  return next;
}

/** Dots per inch a picture reaches when it covers a whole printed side. */
export function coverDpi(p: CardPicture, widthIn: number, heightIn: number): number {
  return p.px / (Math.max(widthIn, heightIn * p.ratio) * p.zoom);
}

export function stickerDpi(s: CardSticker, widthIn: number): number {
  return s.px / ((s.w / 100) * widthIn);
}

/* ------------------------------- checking ------------------------------- */

const MEDIA_PATH = /^\/api\/media\/[a-z0-9]{6,32}$/;
type Loose = Record<string, unknown>;
const obj = (v: unknown): Loose => (v && typeof v === "object" && !Array.isArray(v) ? (v as Loose) : {});
const num = (v: unknown, min: number, max: number, fallback: number) => {
  const n = typeof v === "number" && Number.isFinite(v) ? v : fallback;
  return Math.round(Math.min(max, Math.max(min, n)) * 1000) / 1000;
};
const pick = <T extends string>(v: unknown, allowed: readonly T[]): T | undefined => (allowed.includes(v as T) ? (v as T) : undefined);

function cleanPicture(v: unknown, side: CardSide): CardPicture | undefined {
  const p = obj(v);
  if (typeof p.src !== "string" || !MEDIA_PATH.test(p.src)) return undefined;
  const placement = pick(p.placement, ["background", "emblem", "full"] as const) ?? "background";
  return {
    src: p.src,
    px: num(p.px, 1, 10_000, 1000),
    ratio: num(p.ratio, 0.05, 20, 1),
    placement: side === "back" && placement === "emblem" ? "background" : placement,
    x: num(p.x, 0, 100, 50),
    y: num(p.y, 0, 100, 50),
    zoom: num(p.zoom, 1, 3, 1),
    wash: num(p.wash, 0, 95, 70),
  };
}

function cleanSticker(v: unknown, index: number): CardSticker | undefined {
  const s = obj(v);
  if (typeof s.src !== "string" || !MEDIA_PATH.test(s.src)) return undefined;
  return {
    id: typeof s.id === "string" && /^[a-z0-9]{1,24}$/.test(s.id) ? s.id : `s${index}`,
    side: s.side === "back" ? "back" : "front",
    src: s.src,
    px: num(s.px, 1, 10_000, 1000),
    ratio: num(s.ratio, 0.05, 20, 1),
    x: num(s.x, 0, 100, 50),
    y: num(s.y, 0, 100, 50),
    w: num(s.w, 3, 100, 25),
    rotate: num(s.rotate, -180, 180, 0),
    shape: pick(s.shape, ["none", "rounded", "circle"] as const) ?? "none",
  };
}

/** Validate and clamp a design from a client or from storage. Never throws. */
export function cleanCardDesign(raw: unknown, kind: CardKind): CardDesign {
  const d = obj(raw);
  const t = obj(d.theme);
  const custom: Partial<Palette> = {};
  for (const key of ["bg", "surface", "ink", "accent", "deep", "onDeep"] as const) {
    const v = obj(t.custom)[key];
    if (typeof v === "string" && /^#[0-9a-fA-F]{6}$/.test(v)) custom[key] = v;
  }
  const words: CardDesign["words"] = {};
  for (const key of Object.keys(wordLimits) as CardWord[]) {
    const v = obj(d.words)[key];
    if (typeof v === "string" && v.trim()) words[key] = v.slice(0, wordLimits[key]);
  }
  const base = pick(d.base, kind === "print" ? printDesigns.map((x) => x.id) : cardLayouts.map((x) => x.id));
  const formats = kind === "print" ? printDesigns.flatMap((x) => x.sizes.map((s) => s.id)) : cardFormats.map((f) => f.id);
  const stickers = (Array.isArray(d.stickers) ? d.stickers : [])
    .slice(0, MAX_STICKERS)
    .map(cleanSticker)
    .filter((s): s is CardSticker => Boolean(s))
    // Ids are keys on screen, so a repeated one is renamed
    .map((s, i, all) => (all.findIndex((x) => x.id === s.id) === i ? s : { ...s, id: `${s.id.slice(0, 20)}x${i}` }));
  return {
    base,
    layout: kind === "print" && getPrintDesign(base ?? "").shape === "rect" ? pick(d.layout, straightFronts.map((l) => l.id)) : undefined,
    format: pick(d.format, formats),
    footer: pick(d.footer, ["link", "qr", "none"] as const),
    theme: {
      paletteId: pick(t.paletteId, palettes.map((p) => p.id)),
      custom: Object.keys(custom).length ? custom : undefined,
      fontPair: pick(t.fontPair, fontPairs.map((f) => f.id)),
      ornament: pick(t.ornament, ornamentIds),
    },
    flip: d.flip === true,
    names: num(d.names, NAMES_RANGE[0], NAMES_RANGE[1], 100),
    text: num(d.text, TEXT_RANGE[0], TEXT_RANGE[1], 100),
    hide: cardParts.filter((p) => Array.isArray(d.hide) && d.hide.includes(p)),
    words,
    front: cleanPicture(d.front, "front"),
    back: kind === "print" ? cleanPicture(d.back, "back") : undefined,
    stickers,
  };
}

export function cleanCardDesigns(raw: unknown): CardDesigns | undefined {
  const d = obj(raw);
  const out: CardDesigns = {};
  if (d.image) out.image = cleanCardDesign(d.image, "image");
  if (d.print) out.print = cleanCardDesign(d.print, "print");
  return out.image || out.print ? out : undefined;
}
