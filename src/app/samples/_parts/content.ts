import { Clock, Infinity as InfinityIcon, Languages, Link2, MessageCircle, QrCode } from "lucide-react";
import { occasions as allOccasions } from "@/lib/invitation/occasions";
import { ritualInfo } from "@/lib/invitation/rituals";
import { formatPrice, plans as allPlans } from "@/lib/plans";
import type { EmblemId } from "./Emblem";

/** Real product content, shared by the three sample pages so only the design differs. */
const order: { id: EmblemId; template: string }[] = [
  { id: "lamp", template: "pahana" },
  { id: "betel", template: "bulath" },
  { id: "doors", template: "dorakada" },
  { id: "curtain", template: "mahanuwara" },
  { id: "lotus", template: "nelum" },
  { id: "seal", template: "atelier" },
  { id: "clapper", template: "premiere" },
  { id: "gift", template: "nattal" },
];

export const openings = order.map((o) => ({ ...o, label: ritualInfo[o.id].label, text: ritualInfo[o.id].description }));

export const occasions = allOccasions.map((o) => ({ id: o.id, label: o.plural }));

export const lives = [
  { tag: "Before", title: "The invitation", text: "A countdown, the schedule, the map and the reply. Guests answer in a tap." },
  { tag: "On the day", title: "The live guide", text: "What is happening now, what comes next, and directions one tap away." },
  { tag: "After", title: "The keepsake", text: "Your thank you, your photos and every wish your guests left, on the same link." },
];

export const features = [
  { icon: Link2, title: "A link for every guest", text: "Each family is greeted by name and sees the seats you saved for them." },
  { icon: Clock, title: "Auspicious times", text: "Every nekath or muhurtham is its own moment, with a live countdown." },
  { icon: Languages, title: "Three languages", text: "Sinhala, Tamil and English. Guests switch with one tap." },
  { icon: MessageCircle, title: "Made for WhatsApp", text: "Send each personal link in one tap, with the message ready." },
  { icon: QrCode, title: "Check in at the door", text: "Search a name, tap once and watch the room fill." },
  { icon: InfinityIcon, title: "A keepsake that stays", text: "After the day it becomes a thank you page with photos and wishes." },
];

export const plans = allPlans
  .filter((p) => p.id === "essential" || p.id === "signature" || p.id === "duo")
  .map((p) => ({
    id: p.id,
    name: p.name,
    tagline: p.tagline,
    usd: formatPrice(p),
    features: p.features.slice(0, 4),
  }));

export const gallery = ["mahanuwara", "nelum", "maruthani", "dorakada", "tharu", "bulath", "suriya", "monara", "noor", "ran"];
