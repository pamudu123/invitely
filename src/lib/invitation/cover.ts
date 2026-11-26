import type { HeroLayout, InvitationData } from "./types";

/** Paper colour over a photo behind the cover, in percent, until the host changes it. */
export const COVER_WASH = 70;

/** Covers with a place of their own for a photo. */
export const hasOwnPhotoSpace = (hero: HeroLayout) => ["arch", "photo", "gazette", "polaroid"].includes(hero);

/** Paper covers that can have a photo behind the words. */
export const takesPhotoBehind = (hero: HeroLayout) => ["classic", "monogram", "frame", "poster", "ticket"].includes(hero);

export const photoBehindCover = (data: Pick<InvitationData, "heroPhoto" | "coverWash" | "theme">) =>
  Boolean(data.heroPhoto) && data.coverWash !== undefined && takesPhotoBehind(data.theme.hero);
