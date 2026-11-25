import { useSyncExternalStore } from "react";
import { DEFAULT_SEASON, parseSeason, SEASON_COOKIE, SEASON_COOKIE_AGE, seasons, type SeasonId } from "@/lib/season";

const listeners = new Set<() => void>();
/** Used when cookies are blocked, so the choice still holds until the page closes. */
let chosen: SeasonId | null = null;

export function readSeason(): SeasonId {
  if (chosen) return chosen;
  const entry = document.cookie.split("; ").find((c) => c.startsWith(`${SEASON_COOKIE}=`));
  return parseSeason(entry?.slice(SEASON_COOKIE.length + 1));
}

export function applySeason(season: SeasonId) {
  document.documentElement.setAttribute("data-season", season);
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", seasons[season].bar);
}

export function setSeason(season: SeasonId) {
  if (season === readSeason()) return;
  chosen = season;
  const secure = window.location.protocol === "https:" ? "; secure" : "";
  document.cookie = `${SEASON_COOKIE}=${season}; path=/; max-age=${SEASON_COOKIE_AGE}; samesite=lax${secure}`;
  const change = () => {
    applySeason(season);
    listeners.forEach((l) => l());
  };
  const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (document.startViewTransition && !still && document.visibilityState === "visible") document.startViewTransition(change);
  else change();
}

/** Another tab may have changed the cookie. */
function refresh() {
  if (document.visibilityState !== "visible") return;
  if (document.cookie.includes(`${SEASON_COOKIE}=`)) chosen = null;
  const season = readSeason();
  if (document.documentElement.getAttribute("data-season") === season) return;
  applySeason(season);
  listeners.forEach((l) => l());
}

export function subscribeSeason(listener: () => void) {
  if (!listeners.size) document.addEventListener("visibilitychange", refresh);
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (!listeners.size) document.removeEventListener("visibilitychange", refresh);
  };
}

/** The season in use. The server always renders the default, and the page corrects it right after it wakes up. */
export function useSeason(): SeasonId {
  return useSyncExternalStore(subscribeSeason, readSeason, () => DEFAULT_SEASON);
}
