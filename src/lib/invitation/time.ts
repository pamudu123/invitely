/** Convert a local wall-clock date and time in an IANA zone to a UTC timestamp (ms). */
export function zonedToUtc(date: string, time: string, timeZone: string): number {
  const [y, m, d] = date.split("-").map(Number);
  const [hh, mm] = (time || "00:00").split(":").map(Number);
  if (!y || !m || !d) return NaN;
  const guess = Date.UTC(y, m - 1, d, hh || 0, mm || 0);
  try {
    const offset = tzOffset(guess, timeZone);
    const adjusted = guess - offset;
    // Second pass handles zones where the offset changes near the guess.
    const offset2 = tzOffset(adjusted, timeZone);
    return guess - offset2;
  } catch {
    return guess;
  }
}

function tzOffset(utcMs: number, timeZone: string): number {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });
  const parts: Record<string, number> = {};
  for (const p of dtf.formatToParts(new Date(utcMs))) {
    if (p.type !== "literal") parts[p.type] = Number(p.value);
  }
  const asUtc = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second);
  return asUtc - utcMs;
}

const locales = { en: "en-GB", si: "si-LK", ta: "ta-LK" } as const;

export function formatLongDate(date: string, lang: keyof typeof locales = "en"): string {
  const [y, m, d] = date.split("-").map(Number);
  if (!y || !m || !d) return "";
  const dt = new Date(Date.UTC(y, m - 1, d, 12));
  try {
    return new Intl.DateTimeFormat(locales[lang], {
      weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
    }).format(dt);
  } catch {
    return dt.toDateString();
  }
}

export function dateParts(date: string, lang: keyof typeof locales = "en") {
  const [y, m, d] = date.split("-").map(Number);
  if (!y || !m || !d) return { day: "", month: "", year: "", weekday: "" };
  const dt = new Date(Date.UTC(y, m - 1, d, 12));
  const f = (o: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat(locales[lang], { ...o, timeZone: "UTC" }).format(dt);
  return {
    day: String(d).padStart(2, "0"),
    month: f({ month: "long" }),
    year: String(y),
    weekday: f({ weekday: "long" }),
  };
}

export function formatTime(time: string): string {
  if (!time) return "";
  const [h, m] = time.split(":").map(Number);
  if (Number.isNaN(h)) return time;
  const suffix = h >= 12 ? "PM" : "AM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${String(m || 0).padStart(2, "0")} ${suffix}`;
}

export function todayPlus(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Google Calendar link for an event. */
export function googleCalendarUrl(opts: {
  title: string; startUtc: number; endUtc: number; location: string; details: string;
}): string {
  const fmt = (ms: number) => new Date(ms).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const p = new URLSearchParams({
    action: "TEMPLATE",
    text: opts.title,
    dates: `${fmt(opts.startUtc)}/${fmt(opts.endUtc)}`,
    location: opts.location,
    details: opts.details,
  });
  return `https://calendar.google.com/calendar/render?${p.toString()}`;
}

export function icsContent(opts: {
  title: string; startUtc: number; endUtc: number; location: string; details: string; uid: string;
}): string {
  const fmt = (ms: number) => new Date(ms).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const esc = (s: string) => s.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\;");
  return [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Invitely//EN", "BEGIN:VEVENT",
    `UID:${opts.uid}@invitely`, `DTSTAMP:${fmt(opts.startUtc)}`,
    `DTSTART:${fmt(opts.startUtc)}`, `DTEND:${fmt(opts.endUtc)}`,
    `SUMMARY:${esc(opts.title)}`, `LOCATION:${esc(opts.location)}`, `DESCRIPTION:${esc(opts.details)}`,
    "END:VEVENT", "END:VCALENDAR",
  ].join("\r\n");
}

export function mapEmbedUrl(query: string): string {
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
}

export function mapLinkUrl(query: string): string {
  if (/^https?:\/\//i.test(query)) return query;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
