export type OccasionId =
  | "wedding"
  | "homecoming"
  | "engagement"
  | "birthday"
  | "anniversary"
  | "baby-shower"
  | "housewarming"
  | "coming-of-age"
  | "almsgiving"
  | "celebration";

export type RitualId =
  | "lamp"
  | "seal"
  | "curtain"
  | "lotus"
  | "scratch"
  | "balloon"
  | "none";

export type OrnamentId =
  | "liyawel"
  | "lotus"
  | "botanical"
  | "deco"
  | "stars"
  | "kolam"
  | "geometric"
  | "confetti"
  | "waves"
  | "minimal";

export type HeroLayout = "classic" | "arch" | "photo" | "monogram";

export type FontPairId =
  | "heirloom"
  | "classic"
  | "editorial"
  | "regal"
  | "modern"
  | "playful";

export type MusicId = "none" | "serene" | "warm" | "joyful" | "custom";

export type EffectId = "none" | "petals" | "sparkles" | "confetti";

export type LanguageId = "en" | "si" | "ta";

export type SectionId =
  | "message"
  | "countdown"
  | "nekath"
  | "schedule"
  | "venue"
  | "story"
  | "gallery"
  | "details"
  | "gift"
  | "rsvp"
  | "wishes";

export interface Palette {
  /** Page background */
  bg: string;
  /** Card and raised surface */
  surface: string;
  /** Main text */
  ink: string;
  /** Accent for ornaments, buttons and highlights */
  accent: string;
  /** Deep tone used for the opening cover and footer */
  deep: string;
  /** Text on the deep tone */
  onDeep: string;
}

export interface ThemeConfig {
  paletteId: string;
  /** Optional per-colour overrides chosen in the studio */
  custom?: Partial<Palette>;
  fontPair: FontPairId;
  ornament: OrnamentId;
  hero: HeroLayout;
  ritual: RitualId;
  music: MusicId;
  musicUrl?: string;
  effect: EffectId;
}

export interface EventItem {
  id: string;
  title: string;
  /** Local date, yyyy-mm-dd. Empty means same as the main date. */
  date?: string;
  /** Local time, HH:mm */
  time: string;
  endTime?: string;
  place?: string;
  note?: string;
}

export interface NekathItem {
  id: string;
  title: string;
  date?: string;
  time: string;
  note?: string;
}

export interface StoryItem {
  id: string;
  title: string;
  when?: string;
  text: string;
  photo?: string;
}

export interface ContactItem {
  id: string;
  name: string;
  role?: string;
  phone: string;
}

export interface RsvpConfig {
  enabled: boolean;
  /** Local date, yyyy-mm-dd */
  deadline?: string;
  maxPartySize: number;
  askMeal: boolean;
  mealOptions: string[];
  askMessage: boolean;
  /** Extra free-form question, for example "Song request" */
  customQuestion?: string;
}

export interface LocalizedCopy {
  kicker?: string;
  message?: string;
  closing?: string;
}

export interface InvitationData {
  version: 1;
  occasion: OccasionId;
  templateId: string;
  theme: ThemeConfig;

  /** Main names. For couples use both. For single celebrant use name1 only. */
  name1: string;
  name2: string;
  /** Small line above the names, for example "Together with their families" */
  kicker: string;
  /** Line below the names, for example "invite you to celebrate their wedding" */
  subline: string;
  /** Main invitation paragraph */
  message: string;
  /** Hosts line, for example parents' names */
  hostsLine: string;

  /** Local date yyyy-mm-dd */
  date: string;
  /** Local time HH:mm */
  time: string;
  /** IANA time zone */
  timezone: string;

  venueName: string;
  venueAddress: string;
  /** Free text passed to the map, or a full Google Maps link */
  mapQuery: string;

  heroPhoto?: string;
  gallery: string[];

  events: EventItem[];
  nekath: NekathItem[];
  story: StoryItem[];
  contacts: ContactItem[];

  dressCode: string;
  notes: string;
  giftNote: string;
  hashtag: string;
  /** Shown after the event day has passed */
  thankYou: string;

  rsvp: RsvpConfig;

  /** Ordered list of visible sections */
  sections: SectionId[];

  /** Primary language for labels, and the extra languages guests can switch to */
  language: LanguageId;
  languages: LanguageId[];
  /** Host-written copy per extra language */
  translations: Partial<Record<LanguageId, LocalizedCopy>>;

  /** Text on the opening cover */
  ritualHint: string;
}

export interface GuestContext {
  /** Display name, for example "Uncle Sunil & family" */
  name: string;
  /** Seats reserved for this guest */
  seats: number;
  token: string;
  /** Optional table name for the on-the-day view */
  table?: string;
}

export interface WishItem {
  id: string;
  name: string;
  message: string;
}
