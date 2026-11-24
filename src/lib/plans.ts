export type PlanId = "free" | "essential" | "signature" | "duo" | "atelier";

export interface PlanDef {
  id: PlanId;
  name: string;
  tagline: string;
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
    usd: 0,
    features: [
      "Every template and opening",
      "Full studio with live phone preview",
      "Private preview link",
      "No account and no payment details",
    ],
    cta: "Start designing",
  },
  {
    id: "essential",
    name: "Essential",
    tagline: "One beautiful invitation with everything guests need.",
    usd: 19,
    features: [
      "One published invitation",
      "Unlimited guests and RSVPs",
      "Every opening and soundscape",
      "Countdown, schedule, map and gallery",
      "Image card to send on WhatsApp",
      "Live reply tracking with CSV export",
      "Live for 12 months",
    ],
    cta: "Choose Essential",
  },
  {
    id: "signature",
    name: "Signature",
    tagline: "The full living invitation, personal to every guest.",
    usd: 35,
    highlight: true,
    features: [
      "Everything in Essential",
      "Personal link for every guest or family",
      "Key moments with live countdowns",
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
    tagline: "Two events, two invitations, one price.",
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

export interface AddOnDef {
  id: string;
  name: string;
  description: string;
  usd: number;
}

/** Optional extras bought on top of a published card. Prices are a starting proposal. */
export const addOns: AddOnDef[] = [
  {
    id: "print",
    name: "Printed card design",
    description:
      "A design for a physical card, in a shape of your choice, matched to your web card. You get a print-ready PDF with bleed and a cut line, and the back carries a QR code to your invitation. Printing itself is done by your own print shop.",
    usd: 7,
  },
];

export function getPlan(id: string): PlanDef {
  return plans.find((p) => p.id === id) ?? plans[0];
}

export function formatPrice(plan: PlanDef): string {
  if (plan.usd === null) return "Custom";
  if (plan.usd === 0) return "Free";
  return plan.from ? `From $${plan.usd}` : `$${plan.usd}`;
}

/**
 * off: publishing is free (launch and testing mode).
 * manual: a published invitation waits for an admin to confirm payment.
 */
export function paymentsMode(): "off" | "manual" {
  return process.env.PAYMENTS_MODE === "manual" ? "manual" : "off";
}
