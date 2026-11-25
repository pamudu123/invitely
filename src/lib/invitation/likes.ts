/*
 * Visitors can like any design without signing in. Web and printed designs share some
 * names, so printed ones carry a prefix.
 */
export const printLikeId = (designId: string) => `print-${designId}`;

/** Remembers which designs this device likes. Readable by the page, so it can fill in the hearts. */
export const LIKES_COOKIE = "invitely_likes";
export const LIKES_COOKIE_AGE = 365 * 86400;

/** Most likes one request may add to one design. The page sends a burst of taps in chunks of this size. */
export const MAX_LIKES_PER_REQUEST = 50;

const likeId = /^[a-z0-9-]{1,40}$/;

export function parseLikes(value: string | undefined): string[] {
  return [...new Set((value ?? "").split("."))].filter((id) => likeId.test(id)).slice(0, 200);
}

export const formatLikes = (ids: string[]) => ids.join(".");
