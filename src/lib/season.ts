/*
 * The site has four looks. The visitor picks one in Preferences and a cookie remembers it.
 * Colours come from `data-season` on <html> (see seasons.css), so pages stay static and the
 * right look is there before the first paint. Invitations keep the colours their host chose.
 */

export const seasonIds = ["winter", "spring", "summer", "autumn"] as const;
export type SeasonId = (typeof seasonIds)[number];

export const DEFAULT_SEASON: SeasonId = "winter";
export const SEASON_COOKIE = "invitely_season";
export const SEASON_COOKIE_AGE = 365 * 86400;

export const seasons: Record<SeasonId, { label: string; note: string; /** Browser bar colour */ bar: string }> = {
  winter: { label: "Winter", note: "Ice palace and aurora", bar: "#16249a" },
  spring: { label: "Spring", note: "Blossom and fresh green", bar: "#ffe1ec" },
  summer: { label: "Summer", note: "Sun, sand and sea", bar: "#ffd24d" },
  autumn: { label: "Autumn", note: "Amber woods at dusk", bar: "#3d0f1c" },
};

export function parseSeason(value: string | undefined): SeasonId {
  return seasonIds.find((s) => s === value) ?? DEFAULT_SEASON;
}

/** Runs while the HTML is parsed, before anything is painted. */
export const seasonScript = `(function(){try{var b=${JSON.stringify(
  Object.fromEntries(seasonIds.map((s) => [s, seasons[s].bar])),
)},m=document.cookie.match(/(?:^|; )${SEASON_COOKIE}=([a-z]+)/),s=m&&Object.keys(b).indexOf(m[1])>=0?m[1]:"${DEFAULT_SEASON}";document.documentElement.setAttribute("data-season",s);var t=document.createElement("meta");t.name="theme-color";t.content=b[s];document.head.appendChild(t)}catch(e){}})()`;
