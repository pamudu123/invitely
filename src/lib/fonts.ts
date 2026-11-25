import {
  Figtree,
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
  Bodoni_Moda,
  Great_Vibes,
  Marcellus,
  Caveat,
  Special_Elite,
  Anton,
  Barlow_Condensed,
  Unbounded,
  JetBrains_Mono,
} from "next/font/google";

// Brand fonts (site chrome)
export const brandSerif = Marcellus({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-brand-serif",
  display: "swap",
});
export const brandSans = Figtree({
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

export const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-bodoni",
  display: "swap",
  preload: false,
});
export const greatVibes = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-great-vibes",
  display: "swap",
  preload: false,
});
export const marcellus = Marcellus({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-marcellus",
  display: "swap",
  preload: false,
});
export const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
  preload: false,
});
export const specialElite = Special_Elite({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-special-elite",
  display: "swap",
  preload: false,
});
export const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
  display: "swap",
  preload: false,
});

export const barlowCondensed = Barlow_Condensed({
  weight: ["600", "800"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-barlow-condensed",
  display: "swap",
  preload: false,
});
export const unbounded = Unbounded({
  subsets: ["latin"],
  variable: "--font-unbounded",
  display: "swap",
  preload: false,
});
export const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
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
  bodoni,
  greatVibes,
  marcellus,
  caveat,
  specialElite,
  anton,
  barlowCondensed,
  unbounded,
  jetbrains,
]
  .map((f) => f.variable)
  .join(" ");
