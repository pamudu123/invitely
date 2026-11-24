import { getOccasion } from "./occasions";
import type { InvitationData, OccasionId, ThemeConfig } from "./types";

export interface TemplateDef {
  id: string;
  name: string;
  /** Short meaning of the name, shown under it */
  meaning: string;
  description: string;
  occasion: OccasionId;
  /** Other occasions this design also suits */
  alsoFor: OccasionId[];
  tags: string[];
  theme: ThemeConfig;
  sample: Partial<InvitationData>;
}

const t = (
  paletteId: string,
  fontPair: ThemeConfig["fontPair"],
  ornament: ThemeConfig["ornament"],
  hero: ThemeConfig["hero"],
  ritual: ThemeConfig["ritual"],
  music: ThemeConfig["music"],
  effect: ThemeConfig["effect"],
): ThemeConfig => ({ paletteId, fontPair, ornament, hero, ritual, music, effect });

export const templates: TemplateDef[] = [
  {
    id: "pahana",
    name: "Pahana",
    meaning: "The oil lamp",
    description: "Guests light a brass lamp and its glow reveals your invitation. Ivory paper, liyawel scrollwork and classic script.",
    occasion: "wedding",
    alsoFor: ["homecoming", "engagement", "housewarming"],
    tags: ["Traditional", "Sinhala", "Signature"],
    theme: t("ivory-brass", "heirloom", "liyawel", "classic", "lamp", "serene", "sparkles"),
    sample: {
      name1: "Amaya", name2: "Dinuka",
      hostsLine: "Mr & Mrs Sunil Perera and Mr & Mrs Ananda Jayasuriya",
      venueName: "Cinnamon Grand, Oak Room", venueAddress: "77 Galle Road, Colombo 03",
      mapQuery: "Cinnamon Grand Colombo",
      hashtag: "#AmayaAndDinuka",
      ritualHint: "Light the lamp to begin",
      languages: ["en", "si"],
      translations: {
        si: {
          kicker: "දෙපාර්ශවයේ දෙමාපියන්ගේ ආශිර්වාදයෙන්",
          message: "අපගේ විවාහ මංගල්‍යයට ඔබගේ පැමිණීම අප ඉතා ගෞරවයෙන් අපේක්ෂා කරමු.",
        },
      },
    },
  },
  {
    id: "mahanuwara",
    name: "Mahanuwara",
    meaning: "The hill capital",
    description: "Kandyan maroon and gold with carved liyawel borders. Velvet curtains part to open the day.",
    occasion: "wedding",
    alsoFor: ["homecoming", "anniversary"],
    tags: ["Traditional", "Kandyan", "Regal"],
    theme: t("kandyan", "regal", "liyawel", "monogram", "curtain", "warm", "none"),
    sample: {
      name1: "Sanduni", name2: "Kavindu",
      kicker: "With the blessings of our parents",
      hostsLine: "The Ekanayake and Ratnayake families",
      venueName: "Earl's Regency", venueAddress: "Tennekumbura, Kandy", mapQuery: "Earl's Regency Hotel Kandy",
      hashtag: "#SanduniWedsKavindu", ritualHint: "Draw the curtains",
    },
  },
  {
    id: "nelum",
    name: "Nelum",
    meaning: "The lotus",
    description: "A lotus bud opens petal by petal. Soft pink, hand-drawn lotus motifs and airy serif type.",
    occasion: "wedding",
    alsoFor: ["engagement", "coming-of-age", "anniversary"],
    tags: ["Floral", "Soft", "Signature"],
    theme: t("nelum", "classic", "lotus", "arch", "lotus", "serene", "petals"),
    sample: {
      name1: "Tharushi", name2: "Ravindu",
      hostsLine: "Mr & Mrs Fernando and Mr & Mrs Wickramasinghe",
      venueName: "Waters Edge", venueAddress: "316 Ethul Kotte Road, Battaramulla", mapQuery: "Waters Edge Battaramulla",
      hashtag: "#TharuAndRavi", ritualHint: "Touch the lotus to open",
    },
  },
  {
    id: "atelier",
    name: "Atelier",
    meaning: "Sealed by hand",
    description: "A heavy envelope with your initials pressed in wax. Editorial type, generous white space, botanical line art.",
    occasion: "wedding",
    alsoFor: ["engagement", "anniversary", "celebration"],
    tags: ["Modern", "Minimal", "Church"],
    theme: t("sage", "editorial", "botanical", "arch", "seal", "warm", "none"),
    sample: {
      name1: "Natasha", name2: "Shehan",
      hostsLine: "Together with our parents",
      venueName: "All Saints' Church, then The Kingsbury", venueAddress: "Borella, Colombo 08", mapQuery: "All Saints Church Borella",
      hashtag: "#TheDeSilvas", ritualHint: "Break the seal",
    },
  },
  {
    id: "tharu",
    name: "Tharu",
    meaning: "The stars",
    description: "A midnight sky dusted with gold. Guests scratch away foil to reveal the date.",
    occasion: "wedding",
    alsoFor: ["engagement", "anniversary", "birthday", "celebration"],
    tags: ["Dark", "Modern", "Evening"],
    theme: t("midnight", "modern", "stars", "classic", "scratch", "serene", "sparkles"),
    sample: {
      name1: "Ishara", name2: "Malith",
      kicker: "Under a sky full of stars",
      hostsLine: "Together with their families",
      venueName: "Shangri-La Ballroom", venueAddress: "1 Galle Face, Colombo 02", mapQuery: "Shangri-La Colombo",
      hashtag: "#IsharaMalith", ritualHint: "Scratch to reveal the date",
    },
  },
  {
    id: "monara",
    name: "Monara",
    meaning: "The peacock",
    description: "Deep peacock green and brass with art deco fans. Made for grand ballrooms and homecomings.",
    occasion: "homecoming",
    alsoFor: ["wedding", "anniversary", "celebration"],
    tags: ["Art deco", "Grand", "Evening"],
    theme: t("peacock", "regal", "deco", "classic", "curtain", "warm", "sparkles"),
    sample: {
      name1: "Hiruni", name2: "Chamara",
      hostsLine: "Hosted by Mr & Mrs Gamini Dissanayake",
      venueName: "Galle Face Hotel, Grand Ballroom", venueAddress: "2 Galle Road, Colombo 03", mapQuery: "Galle Face Hotel",
      hashtag: "#HiruAndChamara", ritualHint: "Draw the curtains",
    },
  },
  {
    id: "kolam",
    name: "Kolam",
    meaning: "Drawn at the threshold",
    description: "Kumkum red and turmeric gold with kolam dot patterns, for Hindu and Tamil weddings. Opens with the kuthu vilakku lamp.",
    occasion: "wedding",
    alsoFor: ["engagement", "coming-of-age", "housewarming"],
    tags: ["Traditional", "Tamil", "Hindu"],
    theme: t("kumkum", "regal", "kolam", "classic", "lamp", "warm", "petals"),
    sample: {
      name1: "Priya", name2: "Arjun",
      kicker: "With the blessings of our elders",
      hostsLine: "Mr & Mrs Sivakumar and Mr & Mrs Rajendran",
      venueName: "Sri Kathiresan Hall", venueAddress: "Galle Road, Bambalapitiya, Colombo 04", mapQuery: "Kathiresan Hall Bambalapitiya",
      hashtag: "#PriyaWedsArjun", ritualHint: "Light the lamp to begin",
      languages: ["en", "ta"],
      translations: {
        ta: {
          kicker: "பெரியோர்களின் ஆசியுடன்",
          message: "எங்கள் திருமண விழாவிற்கு தங்கள் வருகையை அன்புடன் எதிர்பார்க்கிறோம்.",
        },
      },
    },
  },
  {
    id: "noor",
    name: "Noor",
    meaning: "Light",
    description: "Emerald and gold with eight-point star geometry, for nikah and walima celebrations.",
    occasion: "wedding",
    alsoFor: ["engagement", "celebration"],
    tags: ["Islamic", "Nikah", "Geometric"],
    theme: t("emerald", "classic", "geometric", "classic", "seal", "serene", "none"),
    sample: {
      name1: "Aaliyah", name2: "Imran",
      kicker: "In the name of the Most Merciful",
      subline: "request your presence at their nikah",
      hostsLine: "Mr & Mrs Farook and Mr & Mrs Hameed",
      venueName: "Galadari Hotel, Grand Ballroom", venueAddress: "64 Lotus Road, Colombo 01", mapQuery: "Galadari Hotel Colombo",
      hashtag: "#AaliyahAndImran", ritualHint: "Break the seal",
    },
  },
  {
    id: "verala",
    name: "Verala",
    meaning: "The shore",
    description: "Sea glass blues and warm sand for beach and destination weddings. Your photo fills the cover.",
    occasion: "wedding",
    alsoFor: ["engagement", "anniversary", "celebration"],
    tags: ["Beach", "Destination", "Photo"],
    theme: t("coast", "modern", "waves", "photo", "seal", "serene", "none"),
    sample: {
      name1: "Emma", name2: "Nuwan",
      kicker: "Barefoot on the south coast",
      hostsLine: "Together with their families",
      venueName: "Cape Weligama", venueAddress: "Abimanagama Road, Weligama", mapQuery: "Cape Weligama",
      hashtag: "#EmmaAndNuwan", ritualHint: "Break the seal",
    },
  },
  {
    id: "promise",
    name: "Promise",
    meaning: "Before the big day",
    description: "Blush clay tones and loose botanical sprigs for ring ceremonies and intimate dinners.",
    occasion: "engagement",
    alsoFor: ["wedding", "anniversary", "baby-shower"],
    tags: ["Soft", "Intimate", "Botanical"],
    theme: t("clay", "heirloom", "botanical", "arch", "seal", "serene", "petals"),
    sample: {
      name1: "Dilini", name2: "Pasan",
      venueName: "The Gallery Café", venueAddress: "2 Alfred House Road, Colombo 03", mapQuery: "Gallery Cafe Colombo",
      hashtag: "#DiliniSaidYes", ritualHint: "Break the seal",
    },
  },
  {
    id: "pop",
    name: "Pop!",
    meaning: "Party time",
    description: "Bright, bouncy and loud. Guests pop a balloon and confetti bursts into the invitation.",
    occasion: "birthday",
    alsoFor: ["baby-shower", "celebration"],
    tags: ["Kids", "Fun", "Colourful"],
    theme: t("sunny", "playful", "confetti", "classic", "balloon", "joyful", "confetti"),
    sample: {
      name1: "Kiara", name2: "",
      subline: "is turning one",
      venueName: "Excel World, Party Room 2", venueAddress: "338 T B Jayah Mawatha, Colombo 10", mapQuery: "Excel World Colombo",
      hashtag: "#KiaraTurnsOne", ritualHint: "Pop the balloon",
    },
  },
  {
    id: "golden-year",
    name: "Golden Year",
    meaning: "Milestones in style",
    description: "Black tie, gold foil and art deco lines for the big birthdays and jubilees.",
    occasion: "birthday",
    alsoFor: ["anniversary", "celebration"],
    tags: ["Elegant", "Milestone", "Adults"],
    theme: t("noir", "editorial", "deco", "monogram", "scratch", "warm", "sparkles"),
    sample: {
      name1: "Rohan", name2: "",
      kicker: "Fifty years young",
      subline: "requests the pleasure of your company",
      message: "An evening of dinner, old friends and good music to mark five decades. Black tie optional, dancing expected.",
      venueName: "The Colombo Club", venueAddress: "Taj Samudra, Colombo 03", mapQuery: "Taj Samudra Colombo",
      hashtag: "#RohanAt50", ritualHint: "Scratch to reveal the date",
    },
  },
  {
    id: "little-star",
    name: "Little Star",
    meaning: "For the smallest guest of honour",
    description: "Soft sky blue with twinkling stars. Sweet for showers, naming ceremonies and first birthdays.",
    occasion: "baby-shower",
    alsoFor: ["birthday"],
    tags: ["Baby", "Soft", "Sweet"],
    theme: t("sky", "modern", "stars", "classic", "balloon", "joyful", "sparkles"),
    sample: {
      name1: "Nimasha & Kasun", name2: "",
      venueName: "The Sooriya Village", venueAddress: "49 Skelton Road, Colombo 05", mapQuery: "Sooriya Village Colombo",
      hashtag: "#BabyKOnTheWay", ritualHint: "Pop the balloon",
    },
  },
  {
    id: "new-nest",
    name: "Aluth Gedara",
    meaning: "The new home",
    description: "For the milk boiling ceremony and open house. The lamp is lit first, just as it will be on the day.",
    occasion: "housewarming",
    alsoFor: ["almsgiving", "celebration"],
    tags: ["Home", "Traditional", "Warm"],
    theme: t("sage", "classic", "liyawel", "classic", "lamp", "serene", "none"),
    sample: {
      name1: "The Gunawardena family", name2: "",
      venueName: "Our new home", venueAddress: "24/3 Temple Lane, Nugegoda", mapQuery: "Nugegoda",
      hashtag: "", ritualHint: "Light the lamp to begin",
    },
  },
  {
    id: "piyum",
    name: "Piyum",
    meaning: "In bloom",
    description: "Lotus pink and ivory for coming of age ceremonies, with the auspicious times set out clearly.",
    occasion: "coming-of-age",
    alsoFor: ["birthday", "engagement"],
    tags: ["Traditional", "Family", "Floral"],
    theme: t("nelum", "heirloom", "lotus", "classic", "lotus", "serene", "petals"),
    sample: {
      name1: "Sethmi", name2: "",
      hostsLine: "Mr & Mrs Lakmal Senanayake",
      venueName: "At our residence", venueAddress: "112 Lake Road, Kurunegala", mapQuery: "Kurunegala",
      hashtag: "", ritualHint: "Touch the lotus to open",
    },
  },
  {
    id: "pin",
    name: "Pin",
    meaning: "Merit",
    description: "A calm, respectful design for almsgivings, pirith ceremonies and remembrance.",
    occasion: "almsgiving",
    alsoFor: ["celebration"],
    tags: ["Religious", "Calm", "Simple"],
    theme: t("ivory-brass", "classic", "lotus", "classic", "lamp", "none", "none"),
    sample: {
      name1: "Mrs Kusuma Wijeratne", name2: "",
      hostsLine: "Children and grandchildren",
      venueName: "At our residence", venueAddress: "8 Pagoda Road, Nugegoda", mapQuery: "Pagoda Road Nugegoda",
      hashtag: "", ritualHint: "Light the lamp",
    },
  },
];

export function getTemplate(id: string): TemplateDef | undefined {
  return templates.find((tpl) => tpl.id === id);
}

type Uid = (p: string) => string;

/** Fixed base date so server rendering stays deterministic. Client code passes today's date. */
export const SAMPLE_BASE_DATE = "2027-01-10";

export function addDays(date: string, offsetDays: number): string {
  const [y, m, d] = date.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + offsetDays, 12));
  return `${dt.getUTCFullYear()}-${String(dt.getUTCMonth() + 1).padStart(2, "0")}-${String(dt.getUTCDate()).padStart(2, "0")}`;
}

function defaultEvents(occasion: OccasionId, uid: Uid): InvitationData["events"] {
  switch (occasion) {
    case "wedding":
      return [
        { id: uid("e"), title: "Guests arrive", time: "09:00", note: "Welcome drinks in the foyer" },
        { id: uid("e"), title: "Poruwa ceremony", time: "09:42", note: "Please be seated ten minutes before" },
        { id: uid("e"), title: "Lunch is served", time: "12:30" },
        { id: uid("e"), title: "Going away", time: "15:30" },
      ];
    case "homecoming":
      return [
        { id: uid("e"), title: "Welcome", time: "18:30" },
        { id: uid("e"), title: "Entrance of the couple", time: "19:15" },
        { id: uid("e"), title: "Dinner", time: "20:30" },
        { id: uid("e"), title: "Dance floor opens", time: "21:30" },
      ];
    case "engagement":
      return [
        { id: uid("e"), title: "Guests arrive", time: "17:30" },
        { id: uid("e"), title: "Exchange of rings", time: "18:14" },
        { id: uid("e"), title: "Dinner", time: "19:30" },
      ];
    case "birthday":
      return [
        { id: uid("e"), title: "Party starts", time: "16:00" },
        { id: uid("e"), title: "Games", time: "16:30" },
        { id: uid("e"), title: "Cake cutting", time: "17:30" },
      ];
    case "baby-shower":
      return [
        { id: uid("e"), title: "High tea", time: "15:30" },
        { id: uid("e"), title: "Games and gifts", time: "16:15" },
      ];
    case "housewarming":
      return [
        { id: uid("e"), title: "Milk boiling ceremony", time: "06:48" },
        { id: uid("e"), title: "Breakfast", time: "07:30" },
        { id: uid("e"), title: "Open house", time: "10:00", endTime: "14:00" },
      ];
    case "coming-of-age":
      return [
        { id: uid("e"), title: "Ceremony", time: "07:12" },
        { id: uid("e"), title: "Lunch", time: "12:00" },
      ];
    case "almsgiving":
      return [
        { id: uid("e"), title: "Pirith chanting", time: "19:00", note: "The evening before" },
        { id: uid("e"), title: "Almsgiving", time: "11:00" },
        { id: uid("e"), title: "Lunch for guests", time: "12:15" },
      ];
    default:
      return [
        { id: uid("e"), title: "Doors open", time: "18:30" },
        { id: uid("e"), title: "Dinner", time: "20:00" },
      ];
  }
}

function defaultNekath(occasion: OccasionId, uid: Uid): InvitationData["nekath"] {
  switch (occasion) {
    case "wedding":
      return [
        { id: uid("n"), title: "Stepping onto the poruwa", time: "09:42", note: "Facing east" },
        { id: uid("n"), title: "Tying of the nuptial knot", time: "09:58" },
        { id: uid("n"), title: "Signing the register", time: "10:24" },
      ];
    case "engagement":
      return [{ id: uid("n"), title: "Exchange of rings", time: "18:14" }];
    case "housewarming":
      return [
        { id: uid("n"), title: "Entering the house", time: "06:31", note: "Facing north" },
        { id: uid("n"), title: "Lighting the hearth and boiling milk", time: "06:48" },
      ];
    case "coming-of-age":
      return [{ id: uid("n"), title: "Bathing ceremony", time: "07:12" }];
    default:
      return [];
  }
}

/** Build a complete invitation from a template, filling every field with sensible sample content. */
export function createFromTemplate(
  templateId: string,
  occasionOverride?: OccasionId,
  today: string = SAMPLE_BASE_DATE,
): InvitationData {
  let counter = 0;
  const uid: Uid = (p) => `${p}${++counter}`;
  const tpl = getTemplate(templateId) ?? templates[0];
  const occasionId = occasionOverride ?? tpl.occasion;
  const occ = getOccasion(occasionId);
  const useSample = occasionId === tpl.occasion;
  const sample = useSample ? tpl.sample : {
    name1: tpl.sample.name1,
    name2: occ.hosts === "couple" ? tpl.sample.name2 || "Partner" : "",
    venueName: tpl.sample.venueName,
    venueAddress: tpl.sample.venueAddress,
    mapQuery: tpl.sample.mapQuery,
    ritualHint: tpl.sample.ritualHint,
  };
  const date = addDays(today, 96);
  const events = defaultEvents(occasionId, uid);
  const isCouple = occ.hosts === "couple";

  const base: InvitationData = {
    version: 1,
    occasion: occasionId,
    templateId: tpl.id,
    theme: { ...tpl.theme },
    name1: "Amaya",
    name2: isCouple ? "Dinuka" : "",
    kicker: occ.kicker,
    subline: occ.subline,
    message: occ.message,
    hostsLine: "",
    date,
    time: (occasionId === "wedding" || occasionId === "engagement" ? events[1] : events[0])?.time ?? "18:00",
    timezone: "Asia/Colombo",
    venueName: "Venue name",
    venueAddress: "Street, City",
    mapQuery: "Colombo",
    heroPhoto: undefined,
    gallery: [],
    events,
    nekath: defaultNekath(occasionId, uid),
    story: isCouple
      ? [
          { id: uid("s"), title: "How we met", when: "2019", text: "A shared umbrella at a bus stop on a rainy Colombo evening, and a conversation that never really ended." },
          { id: uid("s"), title: "The proposal", when: "2025", text: "At sunrise on Adam's Peak, a little out of breath and completely sure." },
        ]
      : [],
    contacts: [
      { id: uid("c"), name: "Nadeesha", role: "Family", phone: "+94 77 123 4567" },
    ],
    dressCode: occasionId === "birthday" || occasionId === "baby-shower" ? "Come comfy and colourful" : "Formal or traditional attire",
    notes: "Parking is available at the venue. Children are most welcome.",
    giftNote: "Your presence is the only gift we need. If you wish to give something, a contribution towards our new home would be gratefully received.",
    hashtag: "",
    thankYou: "Thank you for being part of our day. Your love and blessings mean more than we can say.",
    rsvp: {
      enabled: true,
      deadline: addDays(today, 75),
      maxPartySize: 4,
      askMeal: occasionId === "wedding" || occasionId === "homecoming",
      mealOptions: ["Non vegetarian", "Vegetarian", "Vegan"],
      askMessage: true,
      customQuestion: "",
    },
    sections: [...occ.sections],
    language: "en",
    languages: ["en"],
    translations: {},
    ritualHint: "Tap to open",
  };

  return { ...base, ...sample, theme: { ...tpl.theme } };
}

/** Keep content, switch the design. */
export function applyTemplateDesign(data: InvitationData, templateId: string): InvitationData {
  const tpl = getTemplate(templateId);
  if (!tpl) return data;
  return {
    ...data,
    templateId: tpl.id,
    theme: { ...tpl.theme, musicUrl: data.theme.musicUrl },
    ritualHint: tpl.sample.ritualHint ?? data.ritualHint,
  };
}

/** Make sure stored data has every field, so older drafts keep working. */
export function normalizeInvitation(input: unknown): InvitationData {
  const raw = (input && typeof input === "object" ? input : {}) as Partial<InvitationData>;
  const base = createFromTemplate(raw.templateId ?? "pahana", raw.occasion);
  const merged: InvitationData = {
    ...base,
    ...raw,
    theme: { ...base.theme, ...(raw.theme ?? {}) },
    rsvp: { ...base.rsvp, ...(raw.rsvp ?? {}) },
    version: 1,
  };
  merged.gallery = Array.isArray(merged.gallery) ? merged.gallery : [];
  merged.events = Array.isArray(merged.events) ? merged.events : [];
  merged.nekath = Array.isArray(merged.nekath) ? merged.nekath : [];
  merged.story = Array.isArray(merged.story) ? merged.story : [];
  merged.contacts = Array.isArray(merged.contacts) ? merged.contacts : [];
  merged.sections = Array.isArray(merged.sections) ? merged.sections : base.sections;
  merged.languages = Array.isArray(merged.languages) && merged.languages.length ? merged.languages : [merged.language];
  if (!merged.languages.includes(merged.language)) merged.languages = [merged.language, ...merged.languages];
  merged.translations = merged.translations ?? {};
  return merged;
}

export function displayNames(data: Pick<InvitationData, "name1" | "name2">): string {
  return data.name2 ? `${data.name1} & ${data.name2}` : data.name1;
}

export function initials(data: Pick<InvitationData, "name1" | "name2">): string {
  const a = data.name1.trim().charAt(0).toUpperCase();
  const b = data.name2.trim().charAt(0).toUpperCase();
  return b ? `${a}${b}` : a;
}
