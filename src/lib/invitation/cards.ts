import type { ShapeId } from "./shapes";
import type { HeroLayout, InvitationData } from "./types";

/** Layouts for the image card and the printed card. Each takes the web card's colours, lettering and ornament. */
export type CardLayoutId = "frame" | "arch" | "band" | "seal" | "lamp" | "margin" | "poster" | "photo" | "ola" | "shaped" | "ticket";

export interface CardLayoutDef {
  id: CardLayoutId;
  name: string;
  description: string;
  /** Landscape only layouts are offered with the wide formats */
  orientation: "portrait" | "landscape";
  /** Back of the printed card uses the deep tone */
  darkBack: boolean;
}

export const cardLayouts: CardLayoutDef[] = [
  { id: "frame", name: "Heirloom", description: "Double rule, corner ornaments and a crest. The formal classic.", orientation: "portrait", darkBack: false },
  { id: "arch", name: "Archway", description: "Your words inside a tall arch, set on the deep tone.", orientation: "portrait", darkBack: true },
  { id: "band", name: "Twilight", description: "Names on a deep band above, the details on paper below.", orientation: "portrait", darkBack: false },
  { id: "seal", name: "Monogram", description: "A large monogram medallion and plenty of white space.", orientation: "portrait", darkBack: false },
  { id: "lamp", name: "Pahana", description: "The brass lamp, lit, with your names in its glow.", orientation: "portrait", darkBack: true },
  { id: "margin", name: "Margin", description: "A modern layout with a deep side band and left aligned type.", orientation: "portrait", darkBack: false },
  { id: "poster", name: "Poster", description: "Big confident type with the date as an outlined numeral.", orientation: "portrait", darkBack: true },
  { id: "photo", name: "Portrait", description: "Your cover photo above, the invitation below.", orientation: "portrait", darkBack: false },
  { id: "ola", name: "Ola leaf", description: "A long card drawn like a palm leaf manuscript, with string holes.", orientation: "landscape", darkBack: false },
];

/** Faces offered for the image card. Shaped and ticket faces belong to the printed collection. */
export function getCardLayout(id: CardLayoutId): CardLayoutDef {
  return cardLayouts.find((l) => l.id === id) ?? cardLayouts[0];
}

/** The card that matches a web design out of the box. */
export function defaultCardLayout(data: Pick<InvitationData, "theme" | "heroPhoto">): CardLayoutId {
  if (data.theme.ritual === "lamp") return "lamp";
  const byHero: Record<HeroLayout, CardLayoutId> = {
    classic: "frame",
    arch: "arch",
    photo: data.heroPhoto ? "photo" : "band",
    monogram: "seal",
    frame: "frame",
    poster: "poster",
    ticket: "margin",
    gazette: "margin",
    polaroid: data.heroPhoto ? "photo" : "band",
  };
  return byHero[data.theme.hero] ?? "frame";
}

export interface CardFormat {
  id: string;
  label: string;
  hint: string;
  kind: "image" | "print";
  orientation: "portrait" | "landscape";
  /** Size on screen in CSS pixels, before scaling for preview */
  width: number;
  height: number;
  /** Multiplier applied on export to reach the final pixel size */
  pixelRatio: number;
  /** Print only: bleed on each side, in CSS pixels of this format */
  bleed: number;
  /** Print only: finished size in points (1/72 inch), without bleed */
  trimPt?: [number, number];
}

/**
 * Image formats, exported at phone friendly sizes.
 */
export const cardFormats: CardFormat[] = [
  { id: "portrait", label: "Portrait", hint: "1080 x 1350. Best for WhatsApp and feeds", kind: "image", orientation: "portrait", width: 540, height: 675, pixelRatio: 2, bleed: 0 },
  { id: "story", label: "Story", hint: "1080 x 1920. Full screen status", kind: "image", orientation: "portrait", width: 540, height: 960, pixelRatio: 2, bleed: 0 },
  { id: "square", label: "Square", hint: "1080 x 1080", kind: "image", orientation: "portrait", width: 540, height: 540, pixelRatio: 2, bleed: 0 },
  { id: "wide", label: "Wide", hint: "1600 x 760", kind: "image", orientation: "landscape", width: 800, height: 380, pixelRatio: 2, bleed: 0 },
];

export function formatsFor(orientation: "portrait" | "landscape"): CardFormat[] {
  return cardFormats.filter((f) => f.orientation === orientation);
}

/* ------------------------------ printed cards ------------------------------ */

export interface PrintSize {
  id: string;
  label: string;
  /** Finished size in inches */
  w: number;
  h: number;
}

/**
 * A design for a physical card. This is a separate collection from the image
 * card: most of these are die cut shapes, not rectangles, and each has a back.
 */
export interface PrintDesign {
  id: string;
  name: string;
  meaning: string;
  description: string;
  shape: ShapeId;
  face: CardLayoutId;
  tone: "paper" | "deep";
  /** How much the shape lets us say: full, medium or compact wording */
  density: "full" | "medium" | "compact";
  /** Type scale inside the shape's safe area */
  scale: number;
  sizes: PrintSize[];
}

const std: PrintSize[] = [
  { id: "5x7", label: "5 x 7 in", w: 5, h: 7 },
  { id: "a5", label: "A5 (148 x 210 mm)", w: 5.83, h: 8.27 },
];

export const printDesigns: PrintDesign[] = [
  { id: "thorana", name: "Thorana", meaning: "The ceremonial arch", description: "Cut to the pointed arch of a temple doorway, in your deep colour with gold lettering.", shape: "ogee", face: "shaped", tone: "deep", density: "full", scale: 0.86, sizes: [{ id: "5x7", label: "5 x 7 in", w: 5, h: 7 }, { id: "4x6", label: "4.25 x 6 in", w: 4.25, h: 6 }] },
  { id: "bulath-kole", name: "Bulath Kole", meaning: "The betel leaf", description: "A card cut in the shape of a betel leaf, the way an invitation has always been handed over.", shape: "leaf", face: "shaped", tone: "deep", density: "compact", scale: 0.8, sizes: [{ id: "5x6", label: "5 x 6.2 in", w: 5, h: 6.2 }] },
  { id: "archway", name: "Archway", meaning: "A rounded arch", description: "A soft arch top with a fine inner line. Modern, calm and easy to frame.", shape: "arch", face: "shaped", tone: "paper", density: "full", scale: 0.9, sizes: [{ id: "5x7", label: "5 x 7 in", w: 5, h: 7 }, { id: "4x6", label: "4.25 x 6 in", w: 4.25, h: 6 }] },
  { id: "sanda", name: "Sanda", meaning: "The full moon", description: "A round card with your names at its centre. Lovely as a keepsake or a coaster.", shape: "circle", face: "shaped", tone: "paper", density: "medium", scale: 0.8, sizes: [{ id: "5.5", label: "5.5 in round", w: 5.5, h: 5.5 }, { id: "4", label: "4 in round", w: 4, h: 4 }] },
  { id: "sandakada", name: "Sandakada", meaning: "The moonstone", description: "A half circle like the carved moonstone at a temple step, with its rings drawn in fine line.", shape: "moonstone", face: "shaped", tone: "paper", density: "compact", scale: 1.45, sizes: [{ id: "7x3.6", label: "7 x 3.6 in", w: 7, h: 3.6 }] },
  { id: "araliya", name: "Araliya", meaning: "The temple flower", description: "A round card with a scalloped petal edge, the most loved shaped card this year with a local name.", shape: "scallop", face: "shaped", tone: "paper", density: "medium", scale: 0.74, sizes: [{ id: "5.5", label: "5.5 in", w: 5.5, h: 5.5 }] },
  { id: "nelum-pethi", name: "Nelum Pethi", meaning: "The lotus petal", description: "One lotus petal, pointed at the top. Layer several in a box for a flower that opens.", shape: "petal", face: "shaped", tone: "paper", density: "compact", scale: 0.8, sizes: [{ id: "4.6x6.4", label: "4.6 x 6.4 in", w: 4.6, h: 6.4 }] },
  { id: "ola", name: "Ola Leaf", meaning: "The palm leaf manuscript", description: "A long strip with rounded ends, grain lines and two string holes, like a page of an old ola book.", shape: "pill", face: "ola", tone: "paper", density: "full", scale: 1, sizes: [{ id: "dl", label: "DL (210 x 99 mm)", w: 8.27, h: 3.9 }] },
  { id: "deco", name: "Deco Plaque", meaning: "Scooped corners", description: "Corners scooped inward like an art deco plaque, with a monogram medallion.", shape: "plaque", face: "seal", tone: "paper", density: "full", scale: 0.92, sizes: std },
  { id: "kavaya", name: "Kavaya", meaning: "The honeycomb", description: "A six sided card for a modern, geometric look.", shape: "hexagon", face: "shaped", tone: "paper", density: "medium", scale: 0.8, sizes: [{ id: "5.2x6", label: "5.2 x 6 in", w: 5.2, h: 6 }] },
  { id: "journey", name: "Journey Tag", meaning: "A luggage tag", description: "A tall tag with a punched hole for ribbon or twine. Made for destination weddings.", shape: "tag", face: "shaped", tone: "paper", density: "medium", scale: 0.92, sizes: [{ id: "3.5x6.5", label: "3.5 x 6.5 in", w: 3.5, h: 6.5 }] },
  { id: "admit", name: "Admit One", meaning: "A ticket", description: "A ticket with notches and a tear-off stub that carries the QR code.", shape: "ticket", face: "ticket", tone: "paper", density: "full", scale: 1, sizes: [{ id: "7.5x3", label: "7.5 x 3 in", w: 7.5, h: 3 }] },
  { id: "heirloom", name: "Heirloom", meaning: "The formal classic", description: "A straight edged card with a double rule, corner ornaments and a crest.", shape: "rect", face: "frame", tone: "paper", density: "full", scale: 1, sizes: [...std, { id: "sq", label: "Square 5.5 in", w: 5.5, h: 5.5 }] },
  { id: "pahana", name: "Pahana", meaning: "The lit lamp", description: "The brass lamp, lit, with your names in its glow.", shape: "rect", face: "lamp", tone: "deep", density: "full", scale: 1, sizes: std },
  { id: "twilight", name: "Twilight", meaning: "Two tones", description: "Names on a deep band above, the details on paper below.", shape: "rect", face: "band", tone: "paper", density: "full", scale: 1, sizes: std },
  { id: "margin", name: "Margin", meaning: "Modern and left aligned", description: "A deep side band with the date set vertically, and left aligned type.", shape: "rect", face: "margin", tone: "paper", density: "full", scale: 1, sizes: std },
];

export function getPrintDesign(id: string): PrintDesign {
  return printDesigns.find((d) => d.id === id) ?? printDesigns[0];
}

/** Print layouts use 100 CSS pixels per inch and export at 3x, which is 300 dpi. Bleed is 3 mm on each side. */
export const PRINT_BLEED = 12;

export function printFormat(size: PrintSize): CardFormat {
  return {
    id: size.id,
    label: size.label,
    hint: "",
    kind: "print",
    orientation: size.w > size.h * 1.3 ? "landscape" : "portrait",
    width: Math.round(size.w * 100) + PRINT_BLEED * 2,
    height: Math.round(size.h * 100) + PRINT_BLEED * 2,
    pixelRatio: 3,
    bleed: PRINT_BLEED,
    trimPt: [size.w * 72, size.h * 72],
  };
}
