import { zonedToUtc } from "@/lib/invitation/time";

/** "16 April 2027" from a yyyy-mm-dd date. */
export function formatEventDate(date: string): string {
  const [y, m, d] = date.split("-").map(Number);
  if (!y || !m || !d) return "Date to be set";
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(Date.UTC(y, m - 1, d, 12)),
  );
}

/**
 * "24 Nov, 10:32 am" for a timestamp. The time zone is always passed in so the
 * server and the browser print the same text.
 */
export function formatWhen(ms: number, timeZone: string): string {
  const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", hour: "numeric", minute: "2-digit", hour12: true };
  try {
    return new Intl.DateTimeFormat("en-GB", { ...opts, timeZone }).format(new Date(ms));
  } catch {
    return new Intl.DateTimeFormat("en-GB", { ...opts, timeZone: "UTC" }).format(new Date(ms));
  }
}

/** Whole days from now until the start of the event day in its own time zone. Negative once the day has passed. */
export function daysUntil(date: string, timeZone: string, now: number): number | null {
  const start = zonedToUtc(date, "00:00", timeZone);
  if (Number.isNaN(start)) return null;
  if (now < start) return Math.ceil((start - now) / 86400_000);
  return -Math.floor((now - start) / 86400_000);
}

export const plural = (n: number, one: string, many: string): string => `${n} ${n === 1 ? one : many}`;
