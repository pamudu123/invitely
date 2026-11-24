import { createFromTemplate, templates } from "./templates";
import type { InvitationData, WishItem } from "./types";

/** Designs shown on the home page, each in one of the Frost colours, with neutral sample names. */
export const showcase: { id: string; palette: string; a: string; b: string; venue: string; place: string }[] = [
  { id: "promise", palette: "frost-royal", a: "Clara", b: "Hugo", venue: "The Orangery", place: "London" },
  { id: "atelier", palette: "glacier", a: "Elena", b: "Marco", venue: "Villa Aurelia", place: "Lake Como" },
  { id: "tharu", palette: "amethyst-ice", a: "Amelia", b: "Noah", venue: "The Observatory", place: "Los Angeles" },
  { id: "cathedral", palette: "lagoon-ice", a: "Sofia", b: "Daniel", venue: "St Mary's", place: "Lisbon" },
  { id: "golden-year", palette: "lilac-ice", a: "Margot", b: "", venue: "The Savoy", place: "London" },
  { id: "verala", palette: "aurora", a: "Maya", b: "Theo", venue: "Casa Mar", place: "Tulum" },
  { id: "piyum", palette: "aqua-ice", a: "Ines", b: "", venue: "The Glasshouse", place: "Copenhagen" },
];

export const showcaseWishes: WishItem[] = [
  { id: "w1", name: "Aunt Grace", message: "Wishing you both a lifetime of love and laughter. We cannot wait to celebrate with you." },
  { id: "w2", name: "Oliver and June", message: "So happy for you two. Save us a spot on the dance floor." },
];

/** Sample data for a design, in a given colour and with neutral names. */
export function showcaseData(templateId: string, palette: string, a = "Clara", b = "Hugo", venue = "The Orangery", place = "London"): InvitationData {
  const d = createFromTemplate(templateId);
  return {
    ...d,
    name1: a,
    name2: d.name2 ? b : "",
    venueName: venue,
    venueAddress: place,
    mapQuery: `${venue}, ${place}`,
    hostsLine: "",
    hashtag: "",
    story: [],
    contacts: [],
    nekath: [],
    sections: d.sections.filter((s) => s !== "nekath" && s !== "story"),
    theme: { ...d.theme, paletteId: palette, custom: undefined },
  };
}

export function showcaseName(templateId: string): string {
  return templates.find((t) => t.id === templateId)?.name ?? templateId;
}
