import {
  Instrument_Serif,
  Instrument_Sans,
  Geist_Mono,
  Cormorant_Garamond,
  Playfair_Display,
  Cinzel,
  Fraunces,
  Pinyon_Script,
  Jost,
  DM_Sans,
  Fredoka,
  Noto_Serif_Sinhala,
  Noto_Sans_Tamil,
} from "next/font/google";

// Brand fonts (site chrome)
export const brandSerif = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-brand-serif",
  display: "swap",
});
export const brandSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-brand-sans",
  display: "swap",
});

export const brandMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-brand-mono",
  display: "swap",
});

// Invitation fonts. Not preloaded: the browser fetches only what a theme uses.
export const cormorant = Cormorant_Garamond({
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
  preload: false,
});
export const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
  preload: false,
});
export const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  display: "swap",
  preload: false,
});
export const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
  preload: false,
});
export const pinyon = Pinyon_Script({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pinyon",
  display: "swap",
  preload: false,
});
export const jost = Jost({
  subsets: ["latin"],
  variable: "--font-jost",
  display: "swap",
  preload: false,
});
export const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
  preload: false,
});
export const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-fredoka",
  display: "swap",
  preload: false,
});
export const notoSinhala = Noto_Serif_Sinhala({
  subsets: ["sinhala"],
  variable: "--font-sinhala",
  display: "swap",
  preload: false,
});
export const notoTamil = Noto_Sans_Tamil({
  subsets: ["tamil"],
  variable: "--font-tamil",
  display: "swap",
  preload: false,
});

export const allFontVariables = [
  brandSerif,
  brandSans,
  brandMono,
  cormorant,
  playfair,
  cinzel,
  fraunces,
  pinyon,
  jost,
  dmSans,
  fredoka,
  notoSinhala,
  notoTamil,
]
  .map((f) => f.variable)
  .join(" ");
