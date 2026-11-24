import type { FontPairId, Palette, ThemeConfig } from "./types";

export interface PaletteDef extends Palette {
  id: string;
  label: string;
  dark?: boolean;
}

export const palettes: PaletteDef[] = [
  { id: "ivory-brass", label: "Ivory & Brass", bg: "#F7F1E5", surface: "#FFFCF5", ink: "#2A2620", accent: "#A47B3C", deep: "#1F1B15", onDeep: "#F2E6CF" },
  { id: "peacock", label: "Peacock", bg: "#F2EEE2", surface: "#FBF8F0", ink: "#12302F", accent: "#B08A45", deep: "#0C3334", onDeep: "#EFE3C8" },
  { id: "kandyan", label: "Kandyan Maroon", bg: "#F8EFE1", surface: "#FFFAF0", ink: "#3B1416", accent: "#B4832B", deep: "#571A1F", onDeep: "#F6E2B8" },
  { id: "sage", label: "Sage Linen", bg: "#F0EFE5", surface: "#FAF9F2", ink: "#2C382E", accent: "#71855F", deep: "#2B3A2F", onDeep: "#E9EBD9" },
  { id: "midnight", label: "Midnight", bg: "#0F1724", surface: "#172131", ink: "#EFE7D6", accent: "#D7B26B", deep: "#080E18", onDeep: "#EFE7D6", dark: true },
  { id: "clay", label: "Blush Clay", bg: "#F8EDE6", surface: "#FFF8F3", ink: "#44302B", accent: "#B9674F", deep: "#57302A", onDeep: "#F8E4D8" },
  { id: "nelum", label: "Nelum Pink", bg: "#FAEFF0", surface: "#FFF9F9", ink: "#3D2030", accent: "#BC5377", deep: "#48203A", onDeep: "#F9E1E6" },
  { id: "kumkum", label: "Kumkum & Turmeric", bg: "#FFF5E1", surface: "#FFFBF0", ink: "#55120F", accent: "#C23A1E", deep: "#6A1410", onDeep: "#FCE3A8" },
  { id: "emerald", label: "Emerald", bg: "#F1F0E4", surface: "#FAF9F1", ink: "#0F3327", accent: "#B28F42", deep: "#0C3526", onDeep: "#EDE5C8" },
  { id: "coast", label: "Coastline", bg: "#F3F2EC", surface: "#FCFBF7", ink: "#1E3A46", accent: "#C08A5B", deep: "#173440", onDeep: "#EEE6D8" },
  { id: "noir", label: "Noir", bg: "#F4F2ED", surface: "#FFFFFF", ink: "#141414", accent: "#8C7440", deep: "#111111", onDeep: "#F1ECE0" },
  { id: "sunny", label: "Sunny Pop", bg: "#FFF5E0", surface: "#FFFDF6", ink: "#25304B", accent: "#EE6447", deep: "#25304B", onDeep: "#FFF1CF" },
  { id: "sky", label: "Soft Sky", bg: "#EDF4F7", surface: "#FAFDFE", ink: "#23405A", accent: "#4F8FB5", deep: "#1F3B55", onDeep: "#E6F1F7" },
];

export function getPalette(theme: ThemeConfig): Palette & { dark: boolean } {
  const base = palettes.find((p) => p.id === theme.paletteId) ?? palettes[0];
  const merged = { ...base, ...(theme.custom ?? {}) };
  return { ...merged, dark: isDark(merged.bg) };
}

export function isDark(hex: string): boolean {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return false;
  const n = parseInt(m[1], 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return (r * 299 + g * 587 + b * 114) / 1000 < 128;
}

export interface FontPairDef {
  id: FontPairId;
  label: string;
  sample: string;
  /** CSS font-family values */
  names: string;
  heading: string;
  body: string;
  /** Style hints */
  namesWeight: number;
  namesItalic?: boolean;
  namesScale: number;
  namesTracking: string;
  namesUpper?: boolean;
  headingUpper: boolean;
  headingTracking: string;
  headingWeight: number;
  bodySize: string;
}

const scriptFallback = "var(--font-sinhala), var(--font-tamil), serif";
const sansFallback = "var(--font-sinhala), var(--font-tamil), system-ui, sans-serif";

export const fontPairs: FontPairDef[] = [
  {
    id: "heirloom", label: "Heirloom", sample: "Script & serif",
    names: `var(--font-pinyon), ${scriptFallback}`,
    heading: `var(--font-cormorant), ${scriptFallback}`,
    body: `var(--font-cormorant), ${scriptFallback}`,
    namesWeight: 400, namesScale: 1.25, namesTracking: "0",
    headingUpper: true, headingTracking: "0.22em", headingWeight: 500, bodySize: "1.14rem",
  },
  {
    id: "classic", label: "Classic", sample: "Elegant serif",
    names: `var(--font-cormorant), ${scriptFallback}`,
    heading: `var(--font-cormorant), ${scriptFallback}`,
    body: `var(--font-jost), ${sansFallback}`,
    namesWeight: 500, namesItalic: true, namesScale: 1.08, namesTracking: "-0.01em",
    headingUpper: true, headingTracking: "0.24em", headingWeight: 500, bodySize: "1rem",
  },
  {
    id: "editorial", label: "Editorial", sample: "High contrast",
    names: `var(--font-playfair), ${scriptFallback}`,
    heading: `var(--font-dm-sans), ${sansFallback}`,
    body: `var(--font-dm-sans), ${sansFallback}`,
    namesWeight: 500, namesScale: 0.94, namesTracking: "-0.02em",
    headingUpper: true, headingTracking: "0.26em", headingWeight: 500, bodySize: "0.98rem",
  },
  {
    id: "regal", label: "Regal", sample: "Roman capitals",
    names: `var(--font-cinzel), ${scriptFallback}`,
    heading: `var(--font-cinzel), ${scriptFallback}`,
    body: `var(--font-cormorant), ${scriptFallback}`,
    namesWeight: 500, namesScale: 0.8, namesTracking: "0.06em", namesUpper: true,
    headingUpper: true, headingTracking: "0.2em", headingWeight: 500, bodySize: "1.14rem",
  },
  {
    id: "modern", label: "Modern", sample: "Soft serif",
    names: `var(--font-fraunces), ${scriptFallback}`,
    heading: `var(--font-dm-sans), ${sansFallback}`,
    body: `var(--font-dm-sans), ${sansFallback}`,
    namesWeight: 400, namesScale: 0.95, namesTracking: "-0.03em",
    headingUpper: true, headingTracking: "0.24em", headingWeight: 600, bodySize: "0.98rem",
  },
  {
    id: "playful", label: "Playful", sample: "Rounded & fun",
    names: `var(--font-fredoka), ${sansFallback}`,
    heading: `var(--font-fredoka), ${sansFallback}`,
    body: `var(--font-dm-sans), ${sansFallback}`,
    namesWeight: 600, namesScale: 0.92, namesTracking: "-0.01em",
    headingUpper: false, headingTracking: "0.01em", headingWeight: 600, bodySize: "1rem",
  },
];

export function getFontPair(id: FontPairId): FontPairDef {
  return fontPairs.find((f) => f.id === id) ?? fontPairs[1];
}

/** CSS custom properties that drive the whole invitation. */
export function themeVars(theme: ThemeConfig): Record<string, string> {
  const p = getPalette(theme);
  const f = getFontPair(theme.fontPair);
  return {
    "--inv-bg": p.bg,
    "--inv-surface": p.surface,
    "--inv-ink": p.ink,
    "--inv-accent": p.accent,
    "--inv-deep": p.deep,
    "--inv-on-deep": p.onDeep,
    "--inv-font-names": f.names,
    "--inv-font-heading": f.heading,
    "--inv-font-body": f.body,
    "--inv-names-weight": String(f.namesWeight),
    "--inv-names-style": f.namesItalic ? "italic" : "normal",
    "--inv-names-scale": String(f.namesScale),
    "--inv-names-tracking": f.namesTracking,
    "--inv-names-transform": f.namesUpper ? "uppercase" : "none",
    "--inv-heading-transform": f.headingUpper ? "uppercase" : "none",
    "--inv-heading-tracking": f.headingTracking,
    "--inv-heading-weight": String(f.headingWeight),
    "--inv-body-size": f.bodySize,
  };
}
