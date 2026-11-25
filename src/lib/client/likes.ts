import { useEffect, useSyncExternalStore } from "react";
import { formatLikes, LIKES_COOKIE, LIKES_COOKIE_AGE, MAX_LIKES_PER_REQUEST, parseLikes } from "@/lib/invitation/likes";

/*
 * Likes need no account. Totals live on the server, and a cookie remembers which designs
 * this device likes. Every tap counts, so a design can be liked again and again.
 */

interface LikesState {
  /** Totals as they were when loaded, or null before that. Stable while tapping, so sorted lists do not jump. */
  totals: Record<string, number> | null;
  /** Taps on this page since it opened */
  added: Record<string, number>;
  /** Designs this device likes */
  mine: string[];
}

const empty: LikesState = { totals: null, added: {}, mine: [] };
const SEND_DELAY = 500;

let state = empty;
let started = false;
let sending = false;
let mineChanged = false;
let timer: ReturnType<typeof setTimeout> | undefined;
let unsent: Record<string, number> = {};
const listeners = new Set<() => void>();

function set(patch: Partial<LikesState>) {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
}

function readCookie(): string[] {
  const entry = document.cookie.split("; ").find((c) => c.startsWith(`${LIKES_COOKIE}=`));
  return parseLikes(entry?.slice(LIKES_COOKIE.length + 1));
}

function setMine(mine: string[]) {
  const secure = window.location.protocol === "https:" ? "; secure" : "";
  document.cookie = `${LIKES_COOKIE}=${formatLikes(mine)}; path=/; max-age=${LIKES_COOKIE_AGE}; samesite=lax${secure}`;
  mineChanged = true;
  set({ mine });
}

const bump = (counts: Record<string, number>, id: string, by: number) => ({ ...counts, [id]: (counts[id] ?? 0) + by });

/** Send waiting taps. One request at a time, so an older cookie never replaces a newer one, unless the page is closing. */
async function send(closing = false) {
  clearTimeout(timer);
  timer = undefined;
  if ((sending && !closing) || (!mineChanged && !Object.keys(unsent).length)) return;
  sending = true;
  mineChanged = false;
  const add: Record<string, number> = {};
  const rest: Record<string, number> = {};
  for (const [id, n] of Object.entries(unsent)) {
    add[id] = Math.min(n, MAX_LIKES_PER_REQUEST);
    if (n > add[id]) rest[id] = n - add[id];
  }
  unsent = rest;
  try {
    const res = await fetch("/api/likes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ add, mine: state.mine }),
      keepalive: true,
    });
    if (!res.ok) throw new Error(String(res.status));
  } catch {
    // Not counted, so do not show it as counted. The heart itself stays.
    let added = state.added;
    for (const [id, n] of Object.entries(add)) added = bump(added, id, -n);
    set({ added });
  }
  sending = false;
  if (mineChanged || Object.keys(unsent).length) sendSoon();
}

function sendSoon() {
  timer ??= setTimeout(() => void send(), SEND_DELAY);
}

async function loadTotals() {
  try {
    const res = await fetch("/api/likes", { cache: "no-store" });
    if (res.ok) set({ totals: await res.json() });
  } catch {
    // Offline. Hearts still work, only the totals are missing.
  }
}

function start() {
  if (started) return;
  started = true;
  set({ mine: readCookie() });
  void loadTotals();
  window.addEventListener("pagehide", () => void send(true));
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") void send(true);
    // Another tab may have changed the cookie.
    else if (!sending && !mineChanged) set({ mine: readCookie() });
  });
}

export function like(id: string) {
  unsent = bump(unsent, id, 1);
  set({ added: bump(state.added, id, 1) });
  if (!state.mine.includes(id)) setMine([...state.mine, id]);
  sendSoon();
}

/** Take a design off this device's list. Likes already given still count. */
export function forgetLike(id: string) {
  setMine(state.mine.filter((x) => x !== id));
  sendSoon();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useLikes(): LikesState {
  useEffect(start, []);
  return useSyncExternalStore(subscribe, () => state, () => empty);
}
