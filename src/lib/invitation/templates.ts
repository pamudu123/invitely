import { getOccasion } from "./occasions";
import { sceneTemplates } from "./templates-scenes";
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
    tags: ["Traditional", "Heritage", "Signature"],
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
    description: "Kumkum red and turmeric gold with kolam dot patterns, for Hindu weddings. Opens with the kuthu vilakku lamp.",
    occasion: "wedding",
    alsoFor: ["engagement", "coming-of-age", "housewarming"],
    tags: ["Traditional", "Heritage", "Hindu"],
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
  {
    id: "bulath",
    name: "Bulath",
    meaning: "The betel sheaf",
    description: "The oldest way to invite someone in Sri Lanka is to offer a sheaf of betel leaves. Guests accept it and the leaves fan open into your invitation.",
    occasion: "wedding",
    alsoFor: ["homecoming", "engagement", "coming-of-age", "housewarming"],
    tags: ["Traditional", "Heritage", "Signature"],
    theme: t("betel", "heirloom", "betel", "frame", "betel", "serene", "none"),
    sample: {
      name1: "Sachini", name2: "Lahiru",
      kicker: "With the blessings of our parents",
      hostsLine: "Mr & Mrs Rathnayake and Mr & Mrs Bandara",
      venueName: "Mount Lavinia Hotel", venueAddress: "100 Hotel Road, Mount Lavinia", mapQuery: "Mount Lavinia Hotel",
      hashtag: "#SachiniWedsLahiru", ritualHint: "Accept the betel leaves",
      languages: ["en", "si"],
      translations: {
        si: {
          kicker: "දෙමාපියන්ගේ ආශිර්වාදයෙන්",
          message: "බුලත් හුරුල්ලක් පිළිගන්වා අපගේ විවාහ මංගල්‍යයට ඔබට ආරාධනා කරමු.",
        },
      },
    },
  },
  {
    id: "dorakada",
    name: "Dorakada",
    meaning: "The doorway",
    description: "Carved teak doors with brass studs swing open onto a formal card with mandala corners. Made for grand entrances.",
    occasion: "wedding",
    alsoFor: ["homecoming", "housewarming", "anniversary"],
    tags: ["Traditional", "Grand", "Mandala"],
    theme: t("teak", "regal", "mandala", "frame", "doors", "warm", "none"),
    sample: {
      name1: "Dulani", name2: "Isuru",
      hostsLine: "The Weerasinghe and Karunaratne families",
      venueName: "The Grand Kandyan", venueAddress: "Lady Longden Drive, Kandy", mapQuery: "The Grand Kandyan Hotel",
      hashtag: "#DulaniAndIsuru", ritualHint: "Open the doors",
    },
  },
  {
    id: "pihatu",
    name: "Pihatu",
    meaning: "Feathers",
    description: "Peacock feather eyes in teal and deep blue, with fashion lettering. Elegant for garden weddings and engagements.",
    occasion: "wedding",
    alsoFor: ["engagement", "homecoming", "mehendi"],
    tags: ["Peacock", "Elegant", "Garden"],
    theme: t("feather", "couture", "peacock", "classic", "curtain", "serene", "sparkles"),
    sample: {
      name1: "Anjali", name2: "Kasun",
      hostsLine: "Together with their families",
      venueName: "Jetwing Lagoon", venueAddress: "Pamunugama Road, Negombo", mapQuery: "Jetwing Lagoon Negombo",
      hashtag: "#AnjaliAndKasun", ritualHint: "Draw the curtains",
    },
  },
  {
    id: "cathedral",
    name: "Cathedral",
    meaning: "Stone and stained glass",
    description: "Gothic window tracery, cool stone tones and flowing script for church weddings. The doors open as the service begins.",
    occasion: "wedding",
    alsoFor: ["engagement", "anniversary", "save-the-date"],
    tags: ["Church", "Christian", "Classic"],
    theme: t("stone", "romance", "tracery", "arch", "doors", "warm", "none"),
    sample: {
      name1: "Shanelle", name2: "Ryan",
      kicker: "With joy and thanksgiving",
      subline: "invite you to witness their holy matrimony",
      hostsLine: "Mr & Mrs De Mel and Mr & Mrs Pereira",
      venueName: "St Lucia's Cathedral", venueAddress: "St Lucia's Street, Kotahena, Colombo 13", mapQuery: "St Lucia's Cathedral Colombo",
      hashtag: "#ShanelleAndRyan", ritualHint: "Open the doors",
      time: "15:00",
      sections: ["message", "countdown", "schedule", "venue", "story", "gallery", "details", "rsvp", "wishes"],
      events: [
        { id: "c1", title: "Guests are seated", time: "14:30" },
        { id: "c2", title: "Holy matrimony", time: "15:00", place: "St Lucia's Cathedral" },
        { id: "c3", title: "Reception", time: "18:30", place: "The Kingsbury, Colombo" },
        { id: "c4", title: "First dance", time: "20:00" },
      ],
    },
  },
  {
    id: "ran",
    name: "Ran",
    meaning: "Gold",
    description: "Black and gold with art deco fans and a monogram crest. Heavy doors open onto an evening to remember.",
    occasion: "homecoming",
    alsoFor: ["wedding", "anniversary", "celebration", "corporate"],
    tags: ["Dark", "Luxury", "Evening"],
    theme: t("onyx", "couture", "deco", "monogram", "doors", "warm", "sparkles"),
    sample: {
      name1: "Yasodha", name2: "Chathura",
      hostsLine: "Hosted by Mr & Mrs Samarasekara",
      venueName: "Cinnamon Life, Grand Ballroom", venueAddress: "Sir James Peiris Mawatha, Colombo 02", mapQuery: "Cinnamon Life Colombo",
      hashtag: "#YasodhaAndChathura", ritualHint: "Open the doors",
    },
  },
  {
    id: "maruthani",
    name: "Maruthani",
    meaning: "Henna",
    description: "Marigold and magenta with paisley motifs for mehendi nights, sangeet and haldi. Loud, warm and ready to dance.",
    occasion: "mehendi",
    alsoFor: ["wedding", "engagement", "birthday"],
    tags: ["Mehendi", "Colourful", "Pre-wedding"],
    theme: t("mehendi", "romance", "paisley", "classic", "lotus", "joyful", "petals"),
    sample: {
      name1: "Meera", name2: "Vikram",
      venueName: "Taj Samudra, The Lawn", venueAddress: "25 Galle Face Centre Road, Colombo 03", mapQuery: "Taj Samudra Colombo",
      hashtag: "#MeeraKiMehendi", ritualHint: "Touch the lotus to open",
      dressCode: "Bright colours. Yellow, pink and orange are perfect",
    },
  },
  {
    id: "first-class",
    name: "First Class",
    meaning: "Now boarding",
    description: "A boarding pass with a tear-off stub and barcode. A playful save the date for destination weddings and guests flying in.",
    occasion: "save-the-date",
    alsoFor: ["wedding", "engagement", "anniversary", "celebration"],
    tags: ["Travel", "Destination", "Playful"],
    theme: t("airmail", "press", "waves", "ticket", "seal", "joyful", "none"),
    sample: {
      name1: "Olivia", name2: "Tharindu",
      kicker: "Boarding pass",
      subline: "are getting married in Sri Lanka",
      message: "Pack light and keep the week free. Flights, hotels and the full invitation will follow soon.",
      venueName: "Galle Fort", venueAddress: "Church Street, Galle", mapQuery: "Galle Fort",
      hashtag: "#OliviaAndTharindu", ritualHint: "Break the seal",
    },
  },
  {
    id: "udarata",
    name: "Udarata Menike",
    meaning: "The hill country train",
    description: "A train ticket to the tea country, for weddings in Kandy, Nuwara Eliya and Ella. Guests scratch the foil to find the date.",
    occasion: "wedding",
    alsoFor: ["save-the-date", "engagement", "anniversary"],
    tags: ["Hill country", "Destination", "Ticket"],
    theme: t("tea", "press", "botanical", "ticket", "scratch", "serene", "none"),
    sample: {
      name1: "Hannah", name2: "Dilshan",
      kicker: "Colombo Fort to Ella · One way",
      subline: "invite you up the hills for their wedding",
      hostsLine: "Together with their families",
      venueName: "98 Acres Resort", venueAddress: "Greenland Estate, Ella", mapQuery: "98 Acres Resort Ella",
      hashtag: "#HannahAndDilshan", ritualHint: "Scratch to reveal the date",
      notes: "The train from Colombo takes about nine hours and is worth every minute. Book early, and bring a jumper for the evening.",
    },
  },
  {
    id: "gazette",
    name: "The Gazette",
    meaning: "Front page news",
    description: "Your news as a newspaper front page, with a masthead, a headline and a story set in columns. Add a photo and it prints in black and white.",
    occasion: "engagement",
    alsoFor: ["wedding", "save-the-date", "birthday", "anniversary"],
    tags: ["Newspaper", "Witty", "Typographic"],
    theme: t("newsprint", "press", "minimal", "gazette", "seal", "warm", "none"),
    sample: {
      name1: "Kavya", name2: "Nipun",
      kicker: "The Engagement Gazette",
      subline: "Colombo couple to make it official after seven years",
      message: "After seven years, two cities and one very patient cat, the pair have decided to make it official. Family and friends are invited to witness the exchange of rings and to stay for dinner. Sources close to the couple expect dancing.",
      venueName: "Barefoot Garden Café", venueAddress: "704 Galle Road, Colombo 03", mapQuery: "Barefoot Garden Cafe Colombo",
      hashtag: "#KavyaAndNipun", ritualHint: "Break the seal",
    },
  },
  {
    id: "mathaka",
    name: "Mathaka",
    meaning: "Memories",
    description: "Instant photos taped to the page with a handwritten caption. Add two of your own for anniversaries, birthdays and save the dates.",
    occasion: "anniversary",
    alsoFor: ["birthday", "engagement", "save-the-date", "wedding"],
    tags: ["Photo", "Casual", "Handwritten"],
    theme: t("snapshot", "handwritten", "minimal", "polaroid", "gift", "warm", "none"),
    sample: {
      name1: "Shirani", name2: "Ranjith",
      kicker: "Thirty years of us",
      subline: "invite you to their pearl anniversary",
      venueName: "Ministry of Crab", venueAddress: "Old Dutch Hospital, Colombo 01", mapQuery: "Ministry of Crab Colombo",
      hashtag: "#30YearsOfUs", ritualHint: "Open the gift",
    },
  },
  {
    id: "manel",
    name: "Manel",
    meaning: "The water lily",
    description: "Soft lavender blue and the national flower, for baby showers, naming ceremonies and gentle celebrations.",
    occasion: "baby-shower",
    alsoFor: ["coming-of-age", "birthday", "engagement"],
    tags: ["Baby", "Soft", "Floral"],
    theme: t("lavender", "romance", "lotus", "arch", "lotus", "serene", "petals"),
    sample: {
      name1: "Dilki & Roshan", name2: "",
      venueName: "Paradise Road, The Gallery Café", venueAddress: "2 Alfred House Road, Colombo 03", mapQuery: "Gallery Cafe Colombo",
      hashtag: "", ritualHint: "Touch the lotus to open",
    },
  },
  {
    id: "premiere",
    name: "Premiere",
    meaning: "Now showing",
    description: "A film poster in black and gold. With a personal link the cover reads as a private screening for that guest, then the clapperboard snaps.",
    occasion: "birthday",
    alsoFor: ["anniversary", "wedding", "engagement", "celebration", "corporate"],
    tags: ["Cinema", "Dark", "Bold"],
    theme: t("cinema", "poster", "film", "poster", "clapper", "warm", "sparkles"),
    sample: {
      name1: "Dinesh", name2: "",
      kicker: "Now showing · One night only",
      subline: "The big four-oh, a feature presentation",
      message: "Forty years in the making. Join the cast and crew for dinner, drinks and a late show on the dance floor.",
      venueName: "Scope Cinemas, Colombo City Centre", venueAddress: "137 Sir James Peiris Mawatha, Colombo 02", mapQuery: "Colombo City Centre",
      hashtag: "#DineshAt40", ritualHint: "Tap for action",
      dressCode: "Red carpet ready",
    },
  },
  {
    id: "suriya",
    name: "Suriya",
    meaning: "The new year sun",
    description: "For the April New Year table. The lamp is lit, and each auspicious time for the hearth, the first meal and the first transaction counts down.",
    occasion: "festive",
    alsoFor: ["housewarming", "celebration"],
    tags: ["Avurudu", "New Year", "Family"],
    theme: t("avurudu", "classic", "sun", "classic", "lamp", "joyful", "none"),
    sample: {
      name1: "The Jayawardena family", name2: "",
      kicker: "Suba aluth avuruddak wewa",
      subline: "invite you to their Avurudu table",
      message: "Join us as we light the hearth, boil the milk and share kiribath, kavum and kokis. Come early for the nekath and stay for the games.",
      venueName: "At our home", venueAddress: "17 Temple Road, Maharagama", mapQuery: "Maharagama",
      hashtag: "", ritualHint: "Light the lamp to begin",
      time: "09:26",
      sections: ["message", "countdown", "nekath", "schedule", "venue", "details", "rsvp"],
      nekath: [
        { id: "a1", title: "Lighting the hearth", time: "08:41", note: "Facing south, dressed in white" },
        { id: "a2", title: "First meal and first transaction", time: "09:26", note: "Facing south" },
        { id: "a3", title: "Anointing with oil", time: "10:16", note: "Facing north" },
      ],
      events: [
        { id: "a4", title: "Family arrives", time: "08:00" },
        { id: "a5", title: "Avurudu table", time: "09:26" },
        { id: "a6", title: "Games in the garden", time: "14:00", note: "Kotta pora, kana mutti and tug of war" },
      ],
      dressCode: "Something new, in this year's lucky colour",
      languages: ["en", "si"],
      translations: {
        si: {
          kicker: "සුබ අලුත් අවුරුද්දක් වේවා",
          message: "ලිප ගිනි මොළවා, කිරි උතුරවා, අවුරුදු මේසය සමඟ සතුට බෙදා ගැනීමට අප හා එක්වන්න.",
        },
      },
    },
  },
  {
    id: "deepam",
    name: "Deepam",
    meaning: "The festival lamp",
    description: "Deep ruby and gold with kolam at the corners, for Deepavali, Thai Pongal and temple festivals. It opens by lighting the lamp.",
    occasion: "festive",
    alsoFor: ["housewarming", "wedding", "celebration"],
    tags: ["Deepavali", "Festival", "Dark"],
    theme: t("ruby", "regal", "kolam", "frame", "lamp", "warm", "sparkles"),
    sample: {
      name1: "The Sivakumar family", name2: "",
      kicker: "Happy Deepavali",
      subline: "invite you to celebrate the festival of lights",
      message: "Join us for an evening of lamps, sweets and family. Come hungry. There will be more murukku and laddu than anyone can finish.",
      venueName: "At our home", venueAddress: "42 Ramakrishna Road, Wellawatte, Colombo 06", mapQuery: "Wellawatte",
      hashtag: "", ritualHint: "Light the lamp to begin",
      sections: ["message", "countdown", "schedule", "venue", "details", "rsvp"],
      languages: ["en", "ta"],
      translations: {
        ta: {
          kicker: "இனிய தீபாவளி நல்வாழ்த்துகள்",
          message: "விளக்குகள், இனிப்புகள் மற்றும் குடும்பத்துடன் ஒரு மாலைப் பொழுதைக் கொண்டாட எங்களுடன் இணையுங்கள்.",
        },
      },
    },
  },
  {
    id: "hilal",
    name: "Hilal",
    meaning: "The crescent",
    description: "A crescent moon over a deep green night with gold stars, for Eid feasts, iftar evenings and walima dinners.",
    occasion: "festive",
    alsoFor: ["wedding", "celebration"],
    tags: ["Eid", "Islamic", "Dark"],
    theme: t("hilal", "classic", "stars", "classic", "curtain", "serene", "sparkles"),
    sample: {
      name1: "The Hameed family", name2: "",
      kicker: "Eid Mubarak",
      subline: "invite you to share the Eid feast",
      message: "After a month of fasting, our doors and our table are open. Please join us for biryani, watalappan and good company.",
      venueName: "At our home", venueAddress: "8 Mosque Lane, Dehiwala", mapQuery: "Dehiwala",
      hashtag: "", ritualHint: "Draw the curtains",
      sections: ["message", "countdown", "schedule", "venue", "details", "rsvp"],
    },
  },
  {
    id: "nattal",
    name: "Nattal",
    meaning: "Christmas",
    description: "Snow falling on deep green and gold. Guests lift the lid off a wrapped gift to find your Christmas lunch, carol night or office party.",
    occasion: "festive",
    alsoFor: ["celebration", "corporate", "birthday"],
    tags: ["Christmas", "Snow", "Dark"],
    theme: t("noel", "couture", "snow", "classic", "gift", "joyful", "snow"),
    sample: {
      name1: "The Fernando family", name2: "",
      kicker: "Joy to the world",
      subline: "invite you to Christmas lunch",
      message: "Come for breudher and Christmas cake, stay for carols round the piano. Bring a small gift for the Secret Santa sack.",
      venueName: "At our home", venueAddress: "21 St Mary's Road, Negombo", mapQuery: "Negombo",
      hashtag: "", ritualHint: "Open the gift",
      sections: ["message", "countdown", "schedule", "venue", "details", "rsvp"],
    },
  },
  {
    id: "laurel",
    name: "Laurel",
    meaning: "Well earned",
    description: "Navy and gold with a laurel wreath and a monogram, for convocations, graduation dinners and award nights.",
    occasion: "graduation",
    alsoFor: ["celebration", "birthday", "corporate"],
    tags: ["Graduation", "Formal", "Navy"],
    theme: t("royal", "couture", "botanical", "monogram", "seal", "warm", "none"),
    sample: {
      name1: "Tharushi Perera", name2: "",
      hostsLine: "With love from her proud family",
      venueName: "Hilton Colombo, Blue Elephant Room", venueAddress: "2 Sir Chittampalam A Gardiner Mawatha, Colombo 02", mapQuery: "Hilton Colombo",
      hashtag: "#DrTharushi", ritualHint: "Break the seal",
    },
  },
  {
    id: "keynote",
    name: "Keynote",
    meaning: "For launches and galas",
    description: "Big confident type and one sharp colour. No opening and no ornament, so the event speaks for itself.",
    occasion: "corporate",
    alsoFor: ["celebration", "graduation"],
    tags: ["Corporate", "Modern", "Minimal"],
    theme: t("electric", "poster", "minimal", "poster", "none", "none", "none"),
    sample: {
      name1: "Horizon 2027", name2: "",
      kicker: "Annual partner summit",
      venueName: "Cinnamon Life, Colombo", venueAddress: "Sir James Peiris Mawatha, Colombo 02", mapQuery: "Cinnamon Life Colombo",
      hashtag: "#Horizon2027", ritualHint: "",
      dressCode: "Business formal",
    },
  },
  ...sceneTemplates,
];

/** Order used in the gallery, so signature and new designs are mixed through the page. */
const galleryOrder = [
  "pahana", "bulath", "gambit", "mahanuwara", "dorakada", "yorker", "nelum", "gazette", "heartbeat", "atelier", "first-class", "baseline",
  "kolam", "udarata", "noor", "cathedral", "tharu", "pihatu", "monara", "ran",
  "maruthani", "verala", "promise", "mathaka", "premiere", "pop", "golden-year", "manel",
  "little-star", "suriya", "deepam", "hilal", "nattal", "new-nest", "piyum", "pin", "laurel", "keynote",
  "mise", "top-corner", "blueprint", "cleared", "buzzer", "verdict", "aperture", "podium", "commit", "fairway", "b-side", "drop-shot",
  "torque", "conversion", "chalk", "rally",
];

export function galleryTemplates(): TemplateDef[] {
  const rank = (id: string) => {
    const i = galleryOrder.indexOf(id);
    return i === -1 ? galleryOrder.length : i;
  };
  return [...templates].sort((a, b) => rank(a.id) - rank(b.id));
}

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
    case "mehendi":
      return [
        { id: uid("e"), title: "Henna artists begin", time: "16:00" },
        { id: uid("e"), title: "Dinner", time: "19:30" },
        { id: uid("e"), title: "Sangeet performances", time: "20:30" },
      ];
    case "save-the-date":
      return [];
    case "graduation":
      return [
        { id: uid("e"), title: "Convocation ceremony", time: "10:00" },
        { id: uid("e"), title: "Celebration dinner", time: "19:00" },
      ];
    case "festive":
      return [
        { id: uid("e"), title: "Guests arrive", time: "11:00" },
        { id: uid("e"), title: "Lunch is served", time: "12:30" },
        { id: uid("e"), title: "Games and tea", time: "15:00" },
      ];
    case "corporate":
      return [
        { id: uid("e"), title: "Registration and welcome drinks", time: "17:30" },
        { id: uid("e"), title: "Keynote", time: "18:15" },
        { id: uid("e"), title: "Dinner and networking", time: "19:30" },
      ];
    case "sports":
      return [
        { id: uid("e"), title: "Gates open", time: "15:00" },
        { id: uid("e"), title: "First match", time: "15:30" },
        { id: uid("e"), title: "Prizes and dinner", time: "18:30" },
      ];
    case "career":
      return [
        { id: uid("e"), title: "Welcome drinks", time: "18:00" },
        { id: uid("e"), title: "A few words", time: "18:45" },
        { id: uid("e"), title: "Dinner", time: "19:30" },
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
    dressCode: occasionId === "sports" ? "Team colours or sportswear" : occasionId === "birthday" || occasionId === "baby-shower" ? "Come comfy and colourful" : "Formal or traditional attire",
    notes: "Parking is available at the venue. Children are most welcome.",
    giftNote: "Your presence is the only gift we need. If you wish to give something, a contribution towards our new home would be gratefully received.",
    hashtag: "",
    thankYou: occasionId === "sports"
      ? "Thank you for playing, cheering and making it a great day. See you next season."
      : "Thank you for being part of our day. Your love and blessings mean more than we can say.",
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

  // New cards are English only. Older cards keep the languages they were saved with.
  return { ...base, ...sample, theme: { ...tpl.theme }, language: "en", languages: ["en"], translations: {} };
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
  const first = (s: string) => s.trim().charAt(0).toUpperCase();
  if (data.name2.trim()) return `${first(data.name1)}${first(data.name2)}`;
  // One name field: drop titles and "The ... family", then use up to two initials.
  const cleaned = data.name1
    .trim()
    .replace(/^the\s+/i, "")
    .replace(/\s+family$/i, "")
    .replace(/^(mr|mrs|ms|miss|dr|prof)\.?\s+/i, "");
  const parts = cleaned.split(/\s*&\s*|\s+and\s+|\s+/).filter(Boolean);
  if (parts.length <= 1) return first(cleaned || data.name1);
  return `${first(parts[0])}${first(parts[parts.length - 1])}`;
}
