import type { OccasionId, WishItem } from "./types";

export const demoWishes: WishItem[] = [
  { id: "w1", name: "Aunty Kamala", message: "Wishing you both a lifetime of love and laughter. We cannot wait to celebrate with you." },
  { id: "w2", name: "Ruwan & Shalini", message: "So happy for you two. Save us a spot on the dance floor." },
  { id: "w3", name: "The Pereras", message: "May your home always be full of light. Congratulations from all of us." },
];

const sportWishes: WishItem[] = [
  { id: "w1", name: "Coach Ruwan", message: "Best of luck to both sides. Play hard, shake hands, see you at dinner." },
  { id: "w2", name: "Shalini", message: "Front row, loudest section. We will be there from the first whistle." },
];

const careerWishes: WishItem[] = [
  { id: "w1", name: "Aunty Kamala", message: "So proud of everything you have built. You earned every bit of this." },
  { id: "w2", name: "Ruwan & Shalini", message: "Congratulations! We would not miss it." },
];

/** Sample wishes that make sense for the occasion. */
export function demoWishesFor(occasion: OccasionId): WishItem[] {
  if (occasion === "sports") return sportWishes;
  if (occasion === "career" || occasion === "corporate" || occasion === "graduation") return careerWishes;
  return demoWishes;
}
