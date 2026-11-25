import type { OccasionId, SectionId } from "./types";

export interface OccasionDef {
  id: OccasionId;
  label: string;
  plural: string;
  blurb: string;
  /** couple shows two name fields, single shows one */
  hosts: "couple" | "single";
  name1Label: string;
  name2Label?: string;
  kicker: string;
  subline: string;
  message: string;
  sections: SectionId[];
  /** Whether nekath (auspicious times) is commonly used */
  nekath: boolean;
}

export const occasions: OccasionDef[] = [
  {
    id: "wedding", label: "Wedding", plural: "Weddings",
    blurb: "Ceremonies, church and garden weddings, and receptions.",
    hosts: "couple", name1Label: "Partner one", name2Label: "Partner two",
    kicker: "Together with their families",
    subline: "invite you to celebrate their wedding",
    message: "With joyful hearts, we request the honour of your presence as we begin our life together. Your blessing would mean the world to us.",
    sections: ["message", "countdown", "nekath", "schedule", "venue", "story", "gallery", "details", "rsvp", "wishes"],
    nekath: true,
  },
  {
    id: "homecoming", label: "Homecoming", plural: "Homecomings",
    blurb: "The second celebration, hosted by the groom's family.",
    hosts: "couple", name1Label: "Partner one", name2Label: "Partner two",
    kicker: "The families joyfully invite you to the",
    subline: "homecoming celebration",
    message: "Join us as we welcome the newlyweds home with an evening of food, music and family.",
    sections: ["message", "countdown", "schedule", "venue", "gallery", "details", "rsvp", "wishes"],
    nekath: false,
  },
  {
    id: "engagement", label: "Engagement", plural: "Engagements",
    blurb: "Ring ceremonies and family gatherings before the big day.",
    hosts: "couple", name1Label: "Partner one", name2Label: "Partner two",
    kicker: "We said yes",
    subline: "and we would love you to join our engagement",
    message: "Please join us for an intimate gathering as we exchange rings and celebrate the start of our forever.",
    sections: ["message", "countdown", "nekath", "schedule", "venue", "gallery", "rsvp", "wishes"],
    nekath: true,
  },
  {
    id: "birthday", label: "Birthday", plural: "Birthdays",
    blurb: "First birthdays, sweet sixteens, milestone parties and surprises.",
    hosts: "single", name1Label: "Who is celebrating",
    kicker: "You are invited to celebrate",
    subline: "is turning one",
    message: "Come for cake, games and plenty of laughter. It will not be a party without you.",
    sections: ["message", "countdown", "schedule", "venue", "gallery", "details", "rsvp", "wishes"],
    nekath: false,
  },
  {
    id: "anniversary", label: "Anniversary", plural: "Anniversaries",
    blurb: "Silver, golden and every year worth a toast.",
    hosts: "couple", name1Label: "Partner one", name2Label: "Partner two",
    kicker: "Twenty five years and counting",
    subline: "invite you to their anniversary celebration",
    message: "Please join us for an evening of memories, music and gratitude as we celebrate our years together.",
    sections: ["message", "countdown", "schedule", "venue", "story", "gallery", "rsvp", "wishes"],
    nekath: false,
  },
  {
    id: "baby-shower", label: "Baby shower", plural: "Baby showers",
    blurb: "Showers, gender reveals and naming ceremonies.",
    hosts: "single", name1Label: "Parent or family name",
    kicker: "Please join us for a baby shower honouring",
    subline: "A little one is on the way",
    message: "Come and shower the parents to be with love, laughter and good wishes.",
    sections: ["message", "countdown", "schedule", "venue", "details", "gift", "rsvp", "wishes"],
    nekath: false,
  },
  {
    id: "housewarming", label: "Housewarming", plural: "Housewarmings",
    blurb: "Gewadeema, milk boiling ceremonies and open houses.",
    hosts: "single", name1Label: "Family name",
    kicker: "A new home, a new beginning",
    subline: "warmly invite you to their housewarming",
    message: "Our doors are open. Join us as we boil the milk at the auspicious time and share our first meal in our new home.",
    sections: ["message", "countdown", "nekath", "schedule", "venue", "details", "rsvp", "wishes"],
    nekath: true,
  },
  {
    id: "coming-of-age", label: "Coming of age", plural: "Coming of age ceremonies",
    blurb: "Puberty ceremonies, saree ceremonies and sweet sixteens.",
    hosts: "single", name1Label: "Who is being celebrated",
    kicker: "With love and pride, we invite you to celebrate",
    subline: "on her coming of age",
    message: "Please join our family for the ceremony and lunch as we celebrate this special milestone.",
    sections: ["message", "countdown", "nekath", "schedule", "venue", "gallery", "rsvp", "wishes"],
    nekath: true,
  },
  {
    id: "almsgiving", label: "Almsgiving & pirith", plural: "Almsgivings",
    blurb: "Dana, pirith and remembrance ceremonies.",
    hosts: "single", name1Label: "In memory of, or family name",
    kicker: "In loving memory of",
    subline: "an almsgiving and pirith ceremony",
    message: "You are kindly invited to join the pirith chanting and almsgiving to invoke blessings and transfer merit.",
    sections: ["message", "schedule", "venue", "details", "rsvp"],
    nekath: false,
  },
  {
    id: "mehendi", label: "Mehendi & sangeet", plural: "Mehendi nights",
    blurb: "Henna evenings, sangeet, haldi and pre-wedding parties.",
    hosts: "couple", name1Label: "Partner one", name2Label: "Partner two",
    kicker: "Henna, music and dancing",
    subline: "invite you to their mehendi night",
    message: "Before the big day, come for an evening of henna, music and far too much food. Wear your brightest colours and bring your dancing shoes.",
    sections: ["message", "countdown", "schedule", "venue", "gallery", "details", "rsvp", "wishes"],
    nekath: false,
  },
  {
    id: "save-the-date", label: "Save the date", plural: "Save the dates",
    blurb: "A first announcement before the formal invitation.",
    hosts: "couple", name1Label: "Partner one", name2Label: "Partner two",
    kicker: "Save the date",
    subline: "are getting married",
    message: "Please keep the day free. Our formal invitation will follow, with all the details you need.",
    sections: ["message", "countdown", "venue"],
    nekath: false,
  },
  {
    id: "graduation", label: "Graduation", plural: "Graduations",
    blurb: "Convocations, graduation dinners and send-offs.",
    hosts: "single", name1Label: "Graduate",
    kicker: "Please join us to celebrate the graduation of",
    subline: "Bachelor of Science, Class of 2027",
    message: "After years of late nights and early lectures, it is time to celebrate. Join us for dinner and a toast to what comes next.",
    sections: ["message", "countdown", "schedule", "venue", "gallery", "details", "rsvp", "wishes"],
    nekath: false,
  },
  {
    id: "festive", label: "Festive gathering", plural: "Festive gatherings",
    blurb: "Avurudu, Christmas, Eid, Deepavali, Vesak and Thai Pongal.",
    hosts: "single", name1Label: "Host or family name",
    kicker: "Celebrate the season with",
    subline: "Join us at our table",
    message: "Come and share the table with us. There will be plenty of food, old friends and good cheer.",
    sections: ["message", "countdown", "schedule", "venue", "details", "rsvp"],
    nekath: true,
  },
  {
    id: "corporate", label: "Corporate event", plural: "Corporate events",
    blurb: "Launches, galas, award nights and conferences.",
    hosts: "single", name1Label: "Event name",
    kicker: "You are invited to",
    subline: "An evening of ideas, people and what comes next",
    message: "Join us for the keynote, a first look at what we have been building and time to meet the team. Seats are limited, so please confirm your place.",
    sections: ["message", "countdown", "schedule", "venue", "details", "rsvp"],
    nekath: false,
  },
  {
    id: "sports", label: "Sports event", plural: "Sports",
    blurb: "Matches, tournaments, club days and prize givings.",
    hosts: "single", name1Label: "Event name",
    kicker: "You are invited to",
    subline: "A day of sport, food and friendly rivalry",
    message: "Come to play or come to cheer. There will be good sport, good food and bragging rights to settle.",
    sections: ["message", "countdown", "schedule", "venue", "details", "rsvp", "wishes"],
    nekath: false,
  },
  {
    id: "career", label: "Career milestone", plural: "Professions",
    blurb: "New practices, openings, promotions, retirements and farewells.",
    hosts: "single", name1Label: "Name or event",
    kicker: "Please join us to celebrate",
    subline: "A new chapter begins",
    message: "It took long days, late nights and a great deal of help. Please join us to mark the moment and raise a glass to what comes next.",
    sections: ["message", "countdown", "schedule", "venue", "gallery", "details", "rsvp", "wishes"],
    nekath: false,
  },
  {
    id: "celebration", label: "Other celebration", plural: "Celebrations",
    blurb: "Graduations, retirements, launches, reunions and anything else.",
    hosts: "single", name1Label: "Event title or host",
    kicker: "You are invited",
    subline: "Join us for an evening to remember",
    message: "We would be delighted to have you with us. Save the date and let us know if you can make it.",
    sections: ["message", "countdown", "schedule", "venue", "details", "rsvp"],
    nekath: false,
  },
];

export function getOccasion(id: OccasionId): OccasionDef {
  return occasions.find((o) => o.id === id) ?? occasions[0];
}

export const sectionLabels: Record<SectionId, { label: string; hint: string }> = {
  message: { label: "Invitation message", hint: "Your personal words and hosts line" },
  countdown: { label: "Countdown", hint: "Live timer to the big moment" },
  nekath: { label: "Auspicious times", hint: "Key ceremony times with their own countdowns" },
  schedule: { label: "Schedule", hint: "Order of the day" },
  venue: { label: "Venue & map", hint: "Directions and add to calendar" },
  story: { label: "Our story", hint: "A short timeline of your journey" },
  gallery: { label: "Photo gallery", hint: "Your favourite photos" },
  details: { label: "Good to know", hint: "Dress code, notes and contacts" },
  gift: { label: "Gift note", hint: "A gentle word about gifts" },
  rsvp: { label: "RSVP", hint: "Collect replies and meal choices" },
  wishes: { label: "Wishes wall", hint: "Guests' messages shown on the invitation" },
};

export const allSections: SectionId[] = [
  "message", "countdown", "nekath", "schedule", "venue", "story", "gallery", "details", "gift", "rsvp", "wishes",
];
