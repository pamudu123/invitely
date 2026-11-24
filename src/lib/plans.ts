export type PlanId = "free" | "essential" | "signature" | "duo" | "atelier";

export interface PlanDef {
  id: PlanId;
  name: string;
  tagline: string;
  lkr: number | null;
  usd: number | null;
  /** Shown as "from" pricing */
  from?: boolean;
  highlight?: boolean;
  features: string[];
  cta: string;
}

/**
 * Pricing is a starting proposal based on the market research in docs/PLAN.md.
 * Change the numbers here and every page updates.
 */
export const plans: PlanDef[] = [
  {
    id: "free",
    name: "Design",
    tagline: "Build and preview. Pay only when you publish.",
    lkr: 0,
    usd: 0,
    features: [
      "Every template and opening",
      "Full studio with live phone preview",
      "Private preview link",
      "No card needed",
    ],
    cta: "Start designing",
  },
  {
    id: "essential",
    name: "Essential",
    tagline: "One beautiful invitation with everything guests need.",
    lkr: 3900,
    usd: 19,
    features: [
      "One published invitation",
      "Unlimited guests and RSVPs",
      "Every opening and soundscape",
      "Countdown, schedule, map and gallery",
      "RSVP dashboard with CSV export",
      "Live for 12 months",
    ],
    cta: "Choose Essential",
  },
  {
    id: "signature",
    name: "Signature",
    tagline: "The full living invitation, personal to every guest.",
    lkr: 6900,
    usd: 35,
    highlight: true,
    features: [
      "Everything in Essential",
      "Personal link for every guest or family",
      "Sinhala, Tamil and English switch",
      "Auspicious times with live countdowns",
      "Day-of live view and after-event thank you",
      "QR check-in at the door",
      "Wishes wall",
      "Link never expires",
    ],
    cta: "Choose Signature",
  },
  {
    id: "duo",
    name: "Duo",
    tagline: "Wedding and homecoming, two invitations, one price.",
    lkr: 9900,
    usd: 49,
    features: [
      "Two Signature invitations",
      "Separate guest lists and RSVPs",
      "Matching or different designs",
    ],
    cta: "Choose Duo",
  },
  {
    id: "atelier",
    name: "Atelier",
    tagline: "Our designers build it for you, with custom artwork.",
    lkr: 20000,
    usd: 99,
    from: true,
    features: [
      "Everything in Signature",
      "Designed for you in 3 working days",
      "Custom monogram and colour story",
      "Three rounds of changes",
    ],
    cta: "Talk to us",
  },
];

export function getPlan(id: string): PlanDef {
  return plans.find((p) => p.id === id) ?? plans[0];
}

export function formatPrice(plan: PlanDef, currency: "LKR" | "USD"): string {
  const amount = currency === "LKR" ? plan.lkr : plan.usd;
  if (amount === null) return "Custom";
  if (amount === 0) return "Free";
  const text = currency === "LKR" ? `LKR ${amount.toLocaleString("en-LK")}` : `$${amount}`;
  return plan.from ? `From ${text}` : text;
}

/**
 * off: publishing is free (launch and testing mode).
 * manual: a published invitation waits for an admin to confirm payment.
 */
export function paymentsMode(): "off" | "manual" {
  return process.env.PAYMENTS_MODE === "manual" ? "manual" : "off";
}
