import type { FontPairId, Palette, ThemeConfig } from "./types";

export interface PaletteDef extends Palette {
  id: string;
  label: string;
  dark?: boolean;
}

export const palettes: PaletteDef[] = [
  { id: "frost-royal", label: "Frost Royal", bg: "#1A2C9E", surface: "#2438B4", ink: "#FFFFFF", accent: "#A9E9FF", deep: "#101C70", onDeep: "#E6F6FF", dark: true },
  { id: "glacier", label: "Glacier", bg: "#E6F4FF", surface: "#F6FBFF", ink: "#12226E", accent: "#3B2FB8", deep: "#2740C9", onDeep: "#FFFFFF" },
  { id: "amethyst-ice", label: "Amethyst Ice", bg: "#3D2AA8", surface: "#4A36BC", ink: "#FFFFFF", accent: "#B9F7E2", deep: "#281A78", onDeep: "#F0E9FF", dark: true },
  { id: "lagoon-ice", label: "Lagoon Ice", bg: "#06505F", surface: "#0A6072", ink: "#FFFFFF", accent: "#A8F0F5", deep: "#043842", onDeep: "#E4FBFF", dark: true },
  { id: "lilac-ice", label: "Lilac Ice", bg: "#DCD4FF", surface: "#EBE6FF", ink: "#24147A", accent: "#3426A8", deep: "#3D2AA8", onDeep: "#F3EFFF" },
  { id: "aurora", label: "Aurora", bg: "#0F2473", surface: "#17307F", ink: "#EAF6FF", accent: "#5FF0C8", deep: "#081650", onDeep: "#EAF6FF", dark: true },
  { id: "aqua-ice", label: "Aqua Ice", bg: "#CDF2F7", surface: "#E4FAFC", ink: "#0A2F5E", accent: "#2B2AA8", deep: "#0A4A6E", onDeep: "#E4FAFC" },
  { id: "cherry", label: "Cherry Blossom", bg: "#FFE4EE", surface: "#FFF4F8", ink: "#4A0F2E", accent: "#A81558", deep: "#7A1145", onDeep: "#FFE8F1" },
  { id: "meadow", label: "Meadow", bg: "#174A2C", surface: "#1F5A37", ink: "#FFFFFF", accent: "#FFC4DB", deep: "#0D3019", onDeep: "#EFFBE6", dark: true },
  { id: "wisteria", label: "Wisteria", bg: "#E9DFFB", surface: "#F6F1FF", ink: "#2E1760", accent: "#6A32B8", deep: "#43218A", onDeep: "#F4EDFF" },
  { id: "primrose", label: "Primrose", bg: "#FFF3BF", surface: "#FFFBE3", ink: "#2F3A0C", accent: "#3F6B17", deep: "#2F5412", onDeep: "#FBFAD8" },
  { id: "lagoon", label: "Lagoon", bg: "#00606F", surface: "#006B7A", ink: "#FFFFFF", accent: "#FFE27A", deep: "#00404B", onDeep: "#E4FBFF", dark: true },
  { id: "sunflower", label: "Sunflower", bg: "#FFCB3D", surface: "#FFDF85", ink: "#3A1E00", accent: "#7D2604", deep: "#6B2405", onDeep: "#FFE9B8" },
  { id: "coral-reef", label: "Coral Reef", bg: "#FFDCD0", surface: "#FFF1EB", ink: "#4A1108", accent: "#A8230D", deep: "#8A1C0C", onDeep: "#FFE7DF" },
  { id: "sandbar", label: "Sandbar", bg: "#FBEFD5", surface: "#FFF9EA", ink: "#0B3B44", accent: "#00697A", deep: "#00525F", onDeep: "#FFF1CF" },
  { id: "harvest", label: "Harvest Moon", bg: "#3D0F1C", surface: "#501828", ink: "#FFF1DF", accent: "#FFC46B", deep: "#26070F", onDeep: "#FFE6C7", dark: true },
  { id: "maple", label: "Maple", bg: "#A63A12", surface: "#93310D", ink: "#FFFFFF", accent: "#FFE0A3", deep: "#5C1B05", onDeep: "#FFEBCB", dark: true },
  { id: "woodland", label: "Woodland", bg: "#2E3A12", surface: "#3B4A1A", ink: "#FBF5DF", accent: "#F2B44B", deep: "#1B230A", onDeep: "#F6EFCF", dark: true },
  { id: "cider", label: "Cider", bg: "#F9E3BD", surface: "#FFF4DF", ink: "#4A1D0A", accent: "#963408", deep: "#6E2508", onDeep: "#FFE7C2" },
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
  { id: "teak", label: "Teak & Gold", bg: "#F6EEDD", surface: "#FFFAEE", ink: "#33200F", accent: "#B07A2A", deep: "#3A2413", onDeep: "#F3DFB5" },
  { id: "betel", label: "Betel Green", bg: "#F2F3E4", surface: "#FBFCF1", ink: "#1E3316", accent: "#A98331", deep: "#1F3D1B", onDeep: "#EBE7C4" },
  { id: "royal", label: "Royal Blue", bg: "#F2F0EA", surface: "#FBFAF6", ink: "#14213D", accent: "#B38B3F", deep: "#101C3A", onDeep: "#EDE3C8" },
  { id: "feather", label: "Peacock Feather", bg: "#EEF3EF", surface: "#F9FCFA", ink: "#0E3440", accent: "#1F8A7C", deep: "#0B2F4A", onDeep: "#E2F1EA" },
  { id: "mehendi", label: "Mehendi", bg: "#FFF2D6", surface: "#FFFAEB", ink: "#4A1436", accent: "#D2386C", deep: "#5B1640", onDeep: "#FFE2A6" },
  { id: "stone", label: "Cathedral Stone", bg: "#EEEBE4", surface: "#F8F6F1", ink: "#25303F", accent: "#7B6A4B", deep: "#1F2A3A", onDeep: "#E9E3D4" },
  { id: "tea", label: "Tea Country", bg: "#EFF1E6", surface: "#F9FAF3", ink: "#1F3524", accent: "#5E8A4A", deep: "#1B3A2A", onDeep: "#E6ECD6" },
  { id: "lavender", label: "Lavender", bg: "#F3F0F7", surface: "#FCFAFE", ink: "#2F2748", accent: "#7A62B3", deep: "#2E2550", onDeep: "#ECE6F8" },
  { id: "airmail", label: "Airmail", bg: "#F4EFE4", surface: "#FFFDF7", ink: "#1B2B4B", accent: "#C8402F", deep: "#1B2B4B", onDeep: "#F4EFE4" },
  { id: "newsprint", label: "Newsprint", bg: "#F1ECE0", surface: "#F8F4EA", ink: "#1A1814", accent: "#8A1F1F", deep: "#1A1814", onDeep: "#F1ECE0" },
  { id: "snapshot", label: "Snapshot", bg: "#EFE9DF", surface: "#FFFFFF", ink: "#2B2A28", accent: "#C7663F", deep: "#2B2A28", onDeep: "#F4EEE4" },
  { id: "avurudu", label: "Avurudu", bg: "#FFF3D9", surface: "#FFFAEC", ink: "#4A2508", accent: "#E07A1F", deep: "#7A2E0E", onDeep: "#FFE7A8" },
  { id: "electric", label: "Electric", bg: "#F3F3F1", surface: "#FFFFFF", ink: "#0E0E12", accent: "#3D3BF3", deep: "#0E0E12", onDeep: "#F3F3F1" },
  { id: "cinema", label: "Cinema Noir", bg: "#111012", surface: "#1C1A1D", ink: "#F2E9D8", accent: "#D4A94E", deep: "#060506", onDeep: "#F2E9D8", dark: true },
  { id: "onyx", label: "Onyx & Gold", bg: "#0D0D0D", surface: "#181818", ink: "#EDE4D0", accent: "#C9A24B", deep: "#000000", onDeep: "#EDE4D0", dark: true },
  { id: "ruby", label: "Ruby Night", bg: "#2A0C10", surface: "#3A1318", ink: "#F6E3C0", accent: "#D9A441", deep: "#1A0608", onDeep: "#F6E3C0", dark: true },
  { id: "noel", label: "Noel", bg: "#0F2A1F", surface: "#163627", ink: "#F3EAD3", accent: "#D9B45C", deep: "#091A13", onDeep: "#F3EAD3", dark: true },
  { id: "hilal", label: "Crescent Night", bg: "#0C2B2A", surface: "#123937", ink: "#EEE6CF", accent: "#D8B25E", deep: "#071C1B", onDeep: "#EEE6CF", dark: true },
  { id: "gambit", label: "Walnut & Brass", bg: "#1C1410", surface: "#2A1F18", ink: "#F3E7D0", accent: "#D9A85A", deep: "#100B08", onDeep: "#F3E7D0", dark: true },
  { id: "yorker", label: "Outfield", bg: "#0E4A2C", surface: "#15593A", ink: "#FFFFFF", accent: "#FFD27A", deep: "#072D1A", onDeep: "#FFFFFF", dark: true },
  { id: "baseline", label: "Hard Court", bg: "#1A57A6", surface: "#2463B5", ink: "#FFFFFF", accent: "#E3F56B", deep: "#0C2F61", onDeep: "#FFFFFF", dark: true },
  { id: "top-corner", label: "Terrace Red", bg: "#B92A1A", surface: "#A52214", ink: "#FFFFFF", accent: "#FFE3A3", deep: "#4A0D07", onDeep: "#FFF3DC", dark: true },
  { id: "buzzer", label: "Night Court", bg: "#2C1759", surface: "#3A2270", ink: "#FFFFFF", accent: "#FF9F57", deep: "#190A38", onDeep: "#FFFFFF", dark: true },
  { id: "drop-shot", label: "Court Mint", bg: "#D9F2E8", surface: "#F0FBF6", ink: "#0B3530", accent: "#08705A", deep: "#0B3F38", onDeep: "#E2F7EF" },
  { id: "conversion", label: "Navy & Amber", bg: "#101F45", surface: "#1A2C5A", ink: "#FFFFFF", accent: "#F5BE48", deep: "#081128", onDeep: "#FFF6E0", dark: true },
  { id: "fairway", label: "Morning Fairway", bg: "#E4F0D3", surface: "#F5FAEC", ink: "#19361D", accent: "#2C6B34", deep: "#143A1E", onDeep: "#EEF7DF" },
  { id: "rally", label: "Blush & Rubber", bg: "#FFE1D6", surface: "#FFF4EF", ink: "#3A0F12", accent: "#B4212D", deep: "#5A1018", onDeep: "#FFE9E1" },
  { id: "podium", label: "Podium", bg: "#16121F", surface: "#231D30", ink: "#F7EEDC", accent: "#E6B450", deep: "#0A0810", onDeep: "#F7EEDC", dark: true },
  { id: "heartbeat", label: "Clinic Teal", bg: "#DDF0F2", surface: "#F3FBFC", ink: "#0A3440", accent: "#0B6A78", deep: "#08404D", onDeep: "#E4F6F8" },
  { id: "verdict", label: "Oxblood", bg: "#331012", surface: "#43191B", ink: "#F8E9D4", accent: "#DDB06A", deep: "#1E0708", onDeep: "#F8E9D4", dark: true },
  { id: "blueprint", label: "Site Plan", bg: "#ECEBE6", surface: "#FAF9F6", ink: "#1C1E22", accent: "#B4400F", deep: "#22262D", onDeep: "#F1EFE9" },
  { id: "mise", label: "Saffron", bg: "#F5B73B", surface: "#FFD27C", ink: "#2B1204", accent: "#7E150B", deep: "#5E0F08", onDeep: "#FFE7B8" },
  { id: "commit", label: "Graphite & Amber", bg: "#14171C", surface: "#1F242C", ink: "#F1EEE7", accent: "#FFA94D", deep: "#090B0E", onDeep: "#F1EEE7", dark: true },
  { id: "cleared", label: "Open Sky", bg: "#BFE2FB", surface: "#E6F4FE", ink: "#08294A", accent: "#0A479A", deep: "#0A3566", onDeep: "#E3F2FF" },
  { id: "aperture", label: "Gallery Grey", bg: "#DCDAD5", surface: "#F2F1EE", ink: "#151515", accent: "#A8160F", deep: "#1B1B1C", onDeep: "#F0EEEA" },
  { id: "chalk", label: "Blackboard", bg: "#1F3F36", surface: "#295045", ink: "#F6F3E6", accent: "#F4D35E", deep: "#12271F", onDeep: "#F6F3E6", dark: true },
  { id: "b-side", label: "Plum & Pink", bg: "#4B0C33", surface: "#611644", ink: "#FFF0F5", accent: "#FF9EBB", deep: "#2B051C", onDeep: "#FFF0F5", dark: true },
  { id: "torque", label: "Safety Orange", bg: "#FF7F1F", surface: "#FFA45C", ink: "#1F0D02", accent: "#4F1A00", deep: "#2A1104", onDeep: "#FFE3C8" },
];

export function getPalette(theme: ThemeConfig): Palette & { dark: boolean } {
  const base = palettes.find((p) => p.id === theme.paletteId) ?? palettes.find((p) => p.id === "ivory-brass")!;
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

/** Contrast between two colours, from 1 (the same) to 21 (black on white). */
export function contrast(a: string, b: string): number {
  const light = (hex: string) => {
    const n = parseInt(hex.slice(1), 16);
    const [r, g, bl] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
      const c = v / 255;
      return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
  };
  const [hi, lo] = [light(a), light(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
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
  /** Typical letter width in em, used to fit long words on the 3D covers */
  glyph: number;
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
    namesWeight: 400, glyph: 0.46, namesScale: 1.25, namesTracking: "0",
    headingUpper: true, headingTracking: "0.22em", headingWeight: 500, bodySize: "1.14rem",
  },
  {
    id: "classic", label: "Classic", sample: "Elegant serif",
    names: `var(--font-cormorant), ${scriptFallback}`,
    heading: `var(--font-cormorant), ${scriptFallback}`,
    body: `var(--font-jost), ${sansFallback}`,
    namesWeight: 500, glyph: 0.5, namesItalic: true, namesScale: 1.08, namesTracking: "-0.01em",
    headingUpper: true, headingTracking: "0.24em", headingWeight: 500, bodySize: "1rem",
  },
  {
    id: "editorial", label: "Editorial", sample: "High contrast",
    names: `var(--font-playfair), ${scriptFallback}`,
    heading: `var(--font-dm-sans), ${sansFallback}`,
    body: `var(--font-dm-sans), ${sansFallback}`,
    namesWeight: 500, glyph: 0.58, namesScale: 0.94, namesTracking: "-0.02em",
    headingUpper: true, headingTracking: "0.26em", headingWeight: 500, bodySize: "0.98rem",
  },
  {
    id: "regal", label: "Regal", sample: "Roman capitals",
    names: `var(--font-cinzel), ${scriptFallback}`,
    heading: `var(--font-cinzel), ${scriptFallback}`,
    body: `var(--font-cormorant), ${scriptFallback}`,
    namesWeight: 500, glyph: 0.86, namesScale: 0.8, namesTracking: "0.06em", namesUpper: true,
    headingUpper: true, headingTracking: "0.2em", headingWeight: 500, bodySize: "1.14rem",
  },
  {
    id: "modern", label: "Modern", sample: "Soft serif",
    names: `var(--font-fraunces), ${scriptFallback}`,
    heading: `var(--font-dm-sans), ${sansFallback}`,
    body: `var(--font-dm-sans), ${sansFallback}`,
    namesWeight: 400, glyph: 0.58, namesScale: 0.95, namesTracking: "-0.03em",
    headingUpper: true, headingTracking: "0.24em", headingWeight: 600, bodySize: "0.98rem",
  },
  {
    id: "playful", label: "Playful", sample: "Rounded & fun",
    names: `var(--font-fredoka), ${sansFallback}`,
    heading: `var(--font-fredoka), ${sansFallback}`,
    body: `var(--font-dm-sans), ${sansFallback}`,
    namesWeight: 600, glyph: 0.58, namesScale: 0.92, namesTracking: "-0.01em",
    headingUpper: false, headingTracking: "0.01em", headingWeight: 600, bodySize: "1rem",
  },
  {
    id: "couture", label: "Couture", sample: "Fashion serif",
    names: `var(--font-bodoni), ${scriptFallback}`,
    heading: `var(--font-jost), ${sansFallback}`,
    body: `var(--font-jost), ${sansFallback}`,
    namesWeight: 500, glyph: 0.6, namesItalic: true, namesScale: 0.98, namesTracking: "-0.02em",
    headingUpper: true, headingTracking: "0.3em", headingWeight: 400, bodySize: "1rem",
  },
  {
    id: "romance", label: "Romance", sample: "Flowing script",
    names: `var(--font-great-vibes), ${scriptFallback}`,
    heading: `var(--font-marcellus), ${scriptFallback}`,
    body: `var(--font-marcellus), ${scriptFallback}`,
    namesWeight: 400, glyph: 0.46, namesScale: 1.2, namesTracking: "0",
    headingUpper: true, headingTracking: "0.2em", headingWeight: 400, bodySize: "1rem",
  },
  {
    id: "handwritten", label: "Handwritten", sample: "Marker pen",
    names: `var(--font-caveat), ${sansFallback}`,
    heading: `var(--font-dm-sans), ${sansFallback}`,
    body: `var(--font-dm-sans), ${sansFallback}`,
    namesWeight: 700, glyph: 0.46, namesScale: 1.12, namesTracking: "-0.01em",
    headingUpper: true, headingTracking: "0.2em", headingWeight: 600, bodySize: "0.98rem",
  },
  {
    id: "press", label: "Press", sample: "Headline & typewriter",
    names: `var(--font-playfair), ${scriptFallback}`,
    heading: `var(--font-special-elite), ${sansFallback}`,
    body: `var(--font-cormorant), ${scriptFallback}`,
    namesWeight: 800, glyph: 0.6, namesScale: 0.9, namesTracking: "-0.025em",
    headingUpper: true, headingTracking: "0.14em", headingWeight: 400, bodySize: "1.14rem",
  },
  {
    id: "poster", label: "Poster", sample: "Tall condensed caps",
    names: `var(--font-anton), ${sansFallback}`,
    heading: `var(--font-dm-sans), ${sansFallback}`,
    body: `var(--font-dm-sans), ${sansFallback}`,
    namesWeight: 400, glyph: 0.5, namesScale: 1.12, namesTracking: "0.01em", namesUpper: true,
    headingUpper: true, headingTracking: "0.22em", headingWeight: 600, bodySize: "0.98rem",
  },
  {
    id: "athletic", label: "Athletic", sample: "Condensed italic",
    names: `var(--font-barlow-condensed), ${sansFallback}`,
    heading: `var(--font-dm-sans), ${sansFallback}`,
    body: `var(--font-dm-sans), ${sansFallback}`,
    namesWeight: 800, glyph: 0.5, namesItalic: true, namesScale: 1.16, namesTracking: "-0.01em", namesUpper: true,
    headingUpper: true, headingTracking: "0.14em", headingWeight: 700, bodySize: "1rem",
  },
  {
    id: "wide", label: "Wide", sample: "Broad and rounded",
    names: `var(--font-unbounded), ${sansFallback}`,
    heading: `var(--font-dm-sans), ${sansFallback}`,
    body: `var(--font-dm-sans), ${sansFallback}`,
    namesWeight: 700, glyph: 0.86, namesScale: 0.68, namesTracking: "-0.045em",
    headingUpper: true, headingTracking: "0.16em", headingWeight: 600, bodySize: "0.98rem",
  },
  {
    id: "terminal", label: "Terminal", sample: "Monospace",
    names: `var(--font-jetbrains), ${sansFallback}`,
    heading: `var(--font-jetbrains), ${sansFallback}`,
    body: `var(--font-dm-sans), ${sansFallback}`,
    namesWeight: 700, glyph: 0.56, namesScale: 0.76, namesTracking: "-0.05em",
    headingUpper: false, headingTracking: "0", headingWeight: 500, bodySize: "0.98rem",
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
