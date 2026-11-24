import { CalendarHeart, Infinity as InfinityIcon, Link2, MailCheck, Music, QrCode } from "lucide-react";
import { TemplateCover } from "@/components/site/TemplateCover";
import { ritualInfo } from "@/lib/invitation/rituals";
import { createFromTemplate, templates } from "@/lib/invitation/templates";
import type { GEmblemId } from "./GEmblem";
import { occasions as all } from "./content";

/** Content for the global samples: real features only, with the regional ones left out. */
const order: { id: GEmblemId; template: string }[] = [
  { id: "seal", template: "atelier" },
  { id: "curtain", template: "pihatu" },
  { id: "doors", template: "cathedral" },
  { id: "gift", template: "mathaka" },
  { id: "balloon", template: "pop" },
  { id: "scratch", template: "golden-year" },
  { id: "clapper", template: "premiere" },
];
export const gOpenings = order.map((o) => ({ ...o, label: ritualInfo[o.id].label, text: ritualInfo[o.id].description }));

const keep = ["wedding", "engagement", "save-the-date", "anniversary", "birthday", "baby-shower", "housewarming", "graduation", "festive", "corporate", "celebration"];
export const gOccasions = all.filter((o) => keep.includes(o.id));

export const gFeatures = [
  { icon: Link2, title: "A link for every guest", text: "Each family is greeted by name and sees the seats you saved for them." },
  { icon: MailCheck, title: "Replies in one place", text: "See who is coming, how many seats and which meals as they arrive." },
  { icon: CalendarHeart, title: "A live countdown", text: "The days tick down, then the page turns into a guide for the day itself." },
  { icon: Music, title: "Soundscapes built in", text: "Soft bells, slow strings or bright kalimba, played live in the browser." },
  { icon: QrCode, title: "Check in at the door", text: "Search a name, tap once and watch the room fill." },
  { icon: InfinityIcon, title: "A keepsake that stays", text: "Afterwards it becomes a thank you page with photos and wishes." },
];

export type Pal = { bg: string; surface: string; ink: string; accent: string; deep: string; onDeep: string };
export const pal = (bg: string, surface: string, ink: string, accent: string, deep: string, onDeep = "#FFF6E0"): Pal => ({ bg, surface, ink, accent, deep, onDeep });

const picks: { id: string; label: string; a: string; b: string; venue: string; place: string }[] = [
  { id: "promise", label: "Promise", a: "Clara", b: "Hugo", venue: "The Orangery", place: "Kew, London" },
  { id: "atelier", label: "Atelier", a: "Elena", b: "Marco", venue: "Villa Aurelia", place: "Lake Como" },
  { id: "tharu", label: "Starlight", a: "Amelia", b: "Noah", venue: "The Observatory", place: "Los Angeles" },
  { id: "cathedral", label: "Cathedral", a: "Sofia", b: "Daniel", venue: "St Mary's", place: "Lisbon" },
  { id: "golden-year", label: "Golden Year", a: "Margot", b: "", venue: "The Savoy", place: "London" },
  { id: "verala", label: "Shoreline", a: "Maya", b: "Theo", venue: "Casa Mar", place: "Tulum" },
  { id: "laurel", label: "Laurel", a: "Olivia", b: "", venue: "The Great Hall", place: "Dublin" },
  { id: "piyum", label: "In Bloom", a: "Ines", b: "Lucas", venue: "The Glasshouse", place: "Copenhagen" },
  { id: "mathaka", label: "Memories", a: "Zoe", b: "Adam", venue: "The Boathouse", place: "Sydney" },
];

/** Existing designs, dressed in each sample's own colours and given neutral sample names. */
export function globalCovers(width: number, pals: Pal[], only?: string[]) {
  return picks
    .filter((p) => !only || only.includes(p.id))
    .map((p, i) => {
      const t = templates.find((x) => x.id === p.id)!;
      const d = createFromTemplate(p.id);
      const data = { ...d, name1: p.a, name2: d.name2 ? p.b : "", venueName: p.venue, venueAddress: p.place, hostsLine: "", theme: { ...d.theme, custom: pals[i % pals.length] } };
      return { id: t.id, name: p.label, cover: <TemplateCover data={data} width={width} /> };
    });
}
