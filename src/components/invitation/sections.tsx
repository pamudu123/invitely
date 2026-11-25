"use client";

import { CalendarPlus, MapPin, Phone, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { Labels } from "@/lib/invitation/labels";
import { isSceneHero } from "@/lib/invitation/scenes";
import { displayNames, initials } from "@/lib/invitation/templates";
import {
  formatLongDate,
  formatTime,
  googleCalendarUrl,
  mapEmbedUrl,
  mapLinkUrl,
  zonedToUtc,
} from "@/lib/invitation/time";
import type {
  GuestContext,
  InvitationData,
  LanguageId,
  WishItem,
} from "@/lib/invitation/types";
import { splitCountdown, useNow } from "./hooks";
import { DateLockup, Names, PhotoOrPlaceholder, ScrollHint } from "./hero-parts";
import { ExtraHero, isExtraHero } from "./heroes-extra";
import { SceneHeroView } from "./heroes-scene";
import { CornerFrame, Crest, Divider } from "./ornaments";
import { Reveal } from "./Reveal";

export type Phase = "before" | "today" | "after";

export interface SectionProps {
  data: InvitationData;
  labels: Labels;
  lang: LanguageId;
  guest?: GuestContext;
  phase: Phase;
}

export function Hero({ data, labels, lang }: SectionProps) {
  const layout = data.theme.hero;
  const kicker = data.translations[lang]?.kicker || data.kicker;
  const year = data.date.slice(0, 4);
  const rise = (i: number) => ({ ["--rise-delay" as string]: `${200 + i * 160}ms` });

  if (isExtraHero(layout)) return <ExtraHero data={data} labels={labels} lang={lang} kicker={kicker} />;

  if (isSceneHero(layout)) return <SceneHeroView layout={layout} data={data} labels={labels} lang={lang} kicker={kicker} />;

  if (layout === "photo") {
    return (
      <header className="relative flex flex-col justify-end overflow-hidden" style={{ minHeight: "var(--inv-screen)", color: "var(--inv-on-deep)", background: "var(--inv-deep)" }}>
        <div className="absolute inset-0">
          <PhotoOrPlaceholder data={data} scene />
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.25) 0%, transparent 30%, color-mix(in srgb, var(--inv-deep) 55%, transparent) 62%, var(--inv-deep) 100%)" }} />
        </div>
        <div className="relative px-7 pb-10 pt-40 text-center">
          <p className="inv-kicker inv-rise opacity-90" style={rise(0)}>{kicker}</p>
          <div className="inv-rise mt-5" style={rise(1)}><Names data={data} /></div>
          <p className="inv-kicker inv-rise mt-5 opacity-80" style={rise(2)}>{data.subline}</p>
          <div className="inv-rise mt-8" style={rise(3)}><DateLockup data={data} lang={lang} tone="deep" /></div>
          <p className="inv-kicker inv-rise mt-4 opacity-70" style={rise(4)}>{year} · {data.venueName}</p>
          <div className="mt-9 flex justify-center"><ScrollHint label={labels.scroll} /></div>
        </div>
      </header>
    );
  }

  if (layout === "arch") {
    return (
      <header className="inv-paper relative flex flex-col items-center justify-center overflow-hidden px-7 py-14 text-center" style={{ minHeight: "var(--inv-screen)" }}>
        <p className="inv-kicker inv-rise" style={rise(0)}>{kicker}</p>
        <div className="inv-rise relative mt-7" style={rise(1)}>
          <div className="inv-arch relative mx-auto" style={{ width: "min(62cqw, 17rem)", aspectRatio: "3 / 4" }}>
            <PhotoOrPlaceholder data={data} />
          </div>
          <div
            className="inv-arch pointer-events-none absolute -inset-2.5 border"
            style={{ borderColor: "var(--inv-accent)", opacity: 0.6 }}
          />
        </div>
        <div className="inv-rise mt-8" style={rise(2)}><Names data={data} /></div>
        <p className="inv-kicker inv-rise mt-4" style={{ ...rise(3), color: "var(--inv-muted)" }}>{data.subline}</p>
        <Divider kind={data.theme.ornament} className="inv-rise mx-auto mt-6 w-44" style={{ ...rise(4), color: "var(--inv-accent)" }} />
        <div className="inv-rise mt-6" style={rise(5)}><DateLockup data={data} lang={lang} /></div>
        <p className="inv-kicker inv-rise mt-3" style={{ ...rise(6), color: "var(--inv-muted)" }}>{year} · {data.venueName}</p>
      </header>
    );
  }

  if (layout === "monogram") {
    const mono = initials(data);
    return (
      <header className="inv-paper relative flex flex-col items-center justify-center overflow-hidden px-7 py-16 text-center" style={{ minHeight: "var(--inv-screen)" }}>
        <CornerFrame kind={data.theme.ornament} size={64} inset={12} className="opacity-80" color="var(--inv-accent)" />
        <div className="inv-rise relative flex items-center justify-center" style={{ ...rise(0), width: "min(46cqw, 12rem)", aspectRatio: "1" }}>
          <span className="absolute inset-0 rounded-full border" style={{ borderColor: "var(--inv-accent)" }} />
          <span className="absolute inset-2 rounded-full border" style={{ borderColor: "var(--inv-accent)", opacity: 0.45 }} />
          <span className="inv-serif flex items-center gap-3" style={{ fontSize: "clamp(2.6rem, 15cqw, 4rem)", color: "var(--inv-accent)", lineHeight: 1 }}>
            <span>{mono.charAt(0)}</span>
            {mono.length > 1 ? (
              <>
                <span className="h-12 w-px" style={{ background: "var(--inv-accent)", opacity: 0.6 }} />
                <span>{mono.charAt(1)}</span>
              </>
            ) : null}
          </span>
        </div>
        <p className="inv-kicker inv-rise mt-9" style={rise(1)}>{kicker}</p>
        <div className="inv-rise mt-4" style={{ ...rise(2), fontSize: "0.78em" }}><Names data={data} /></div>
        <p className="inv-kicker inv-rise mt-4" style={{ ...rise(3), color: "var(--inv-muted)" }}>{data.subline}</p>
        <Divider kind={data.theme.ornament} className="inv-rise mx-auto mt-7 w-44" style={{ ...rise(4), color: "var(--inv-accent)" }} />
        <div className="inv-rise mt-6" style={rise(5)}><DateLockup data={data} lang={lang} /></div>
        <p className="inv-kicker inv-rise mt-3" style={{ ...rise(6), color: "var(--inv-muted)" }}>{year} · {data.venueName}</p>
      </header>
    );
  }

  return (
    <header className="inv-paper relative flex flex-col items-center justify-center overflow-hidden px-8 py-20 text-center" style={{ minHeight: "var(--inv-screen)" }}>
      <CornerFrame kind={data.theme.ornament} size={76} inset={12} className="opacity-90" color="var(--inv-accent)" />
      <div style={{ color: "var(--inv-accent)" }}>
        <Crest kind={data.theme.ornament} className="inv-rise mx-auto w-28" style={rise(0)} />
      </div>
      <p className="inv-kicker inv-rise mt-7 max-w-[18rem]" style={rise(1)}>{kicker}</p>
      <div className="inv-rise mt-6" style={rise(2)}><Names data={data} /></div>
      <p className="inv-kicker inv-rise mt-6 max-w-[19rem]" style={{ ...rise(3), color: "var(--inv-muted)" }}>{data.subline}</p>
      <Divider kind={data.theme.ornament} className="inv-rise mx-auto mt-7 w-48" style={{ ...rise(4), color: "var(--inv-accent)" }} />
      <div className="inv-rise mt-7" style={rise(5)}><DateLockup data={data} lang={lang} /></div>
      <p className="inv-kicker inv-rise mt-3" style={{ ...rise(6), color: "var(--inv-muted)" }}>{year} · {data.venueName}</p>
    </header>
  );
}

function SectionTitle({ eyebrow, title, ornament, onDeep = false }: { eyebrow?: string; title: string; ornament: InvitationData["theme"]["ornament"]; onDeep?: boolean }) {
  return (
    <Reveal className="mb-9 text-center">
      {eyebrow ? <p className="inv-eyebrow mb-3" style={onDeep ? { color: "var(--inv-accent)" } : undefined}>{eyebrow}</p> : null}
      <h2 className="inv-heading">{title}</h2>
      <Divider kind={ornament} className="mx-auto mt-5 w-40" style={{ color: "var(--inv-accent)" }} />
    </Reveal>
  );
}

export function MessageSection({ data, labels, lang, guest, phase }: SectionProps) {
  const copy = data.translations[lang];
  const message = phase === "after" ? data.thankYou : copy?.message || data.message;
  return (
    <section className="inv-section text-center">
      <div className="inv-inner">
        {guest ? (
          <Reveal>
            <p className="inv-eyebrow">{labels.dear}</p>
            <p className="inv-heading mt-2">{guest.name}</p>
          </Reveal>
        ) : null}
        <Reveal delay={100}>
          <p className="inv-serif mt-7 text-balance" style={{ fontSize: "clamp(1.25rem, 5.6cqw, 1.6rem)", lineHeight: 1.55 }}>
            {message}
          </p>
        </Reveal>
        {phase !== "after" && data.hostsLine ? (
          <Reveal delay={200}>
            <p className="inv-kicker mt-8" style={{ color: "var(--inv-muted)" }}>{data.hostsLine}</p>
          </Reveal>
        ) : null}
        {guest && phase !== "after" ? (
          <Reveal delay={260}>
            <div className="mx-auto mt-9 inline-flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-y px-5 py-3" style={{ borderColor: "var(--inv-line)" }}>
              <span className="inv-kicker">{labels.seats}: <strong style={{ color: "var(--inv-accent)" }}>{guest.seats}</strong></span>
              {guest.table ? <span className="inv-kicker">{labels.table}: <strong style={{ color: "var(--inv-accent)" }}>{guest.table}</strong></span> : null}
            </div>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}

function CountBox({ value, label }: { value: number | null; label: string }) {
  return (
    <div className="inv-count flex flex-1 flex-col items-center">
      <span key={value} className="inv-count-digit inv-serif tabular-nums leading-none" style={{ fontSize: "clamp(2.2rem, 12cqw, 3.6rem)" }}>
        {value === null ? "--" : String(value).padStart(2, "0")}
      </span>
      <span className="inv-kicker mt-2" style={{ fontSize: "0.6rem", color: "var(--inv-muted)" }}>{label}</span>
    </div>
  );
}

export function CountdownSection({ data, labels, lang, phase }: SectionProps) {
  const now = useNow(1000);
  const target = zonedToUtc(data.date, data.time, data.timezone);
  const left = now === null ? null : splitCountdown(target - now);

  if (phase === "after") return null;

  if (phase === "today" && now !== null) {
    const items = data.events
      .filter((e) => !e.date || e.date === data.date)
      .map((e) => ({ e, start: zonedToUtc(data.date, e.time, data.timezone) }))
      .sort((a, b) => a.start - b.start);
    let current = -1;
    items.forEach((it, i) => {
      if (it.start <= now) current = i;
    });
    const nowItem = current >= 0 ? items[current] : null;
    const nextItem = items[current + 1] ?? null;
    return (
      <section className="inv-section text-center" style={{ background: "var(--inv-deep)", color: "var(--inv-on-deep)" }}>
        <div className="inv-inner">
          <p className="inv-eyebrow">{formatLongDate(data.date, lang)}</p>
          <h2 className="inv-heading mt-3">{labels.today}</h2>
          <div className="mt-9 grid gap-3 text-left">
            {nowItem ? (
              <div className="border px-5 py-4" style={{ borderColor: "var(--inv-accent)" }}>
                <p className="inv-kicker flex items-center gap-2" style={{ color: "var(--inv-accent)" }}>
                  <span className="relative flex h-2 w-2"><span className="absolute inset-0 animate-ping rounded-full bg-current" /><span className="relative h-2 w-2 rounded-full bg-current" /></span>
                  {labels.now}
                </p>
                <p className="inv-serif mt-1 text-2xl">{nowItem.e.title}</p>
                <p className="opacity-70">{formatTime(nowItem.e.time)}{nowItem.e.place ? ` · ${nowItem.e.place}` : ""}</p>
              </div>
            ) : null}
            {nextItem ? (
              <div className="border px-5 py-4" style={{ borderColor: "color-mix(in srgb, currentColor 22%, transparent)" }}>
                <p className="inv-kicker opacity-70">{labels.next}</p>
                <p className="inv-serif mt-1 text-2xl">{nextItem.e.title}</p>
                <p className="opacity-70">{formatTime(nextItem.e.time)}{nextItem.e.place ? ` · ${nextItem.e.place}` : ""}</p>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="inv-section text-center" style={{ paddingTop: "1rem" }}>
      <Reveal className="inv-inner">
        <p className="inv-eyebrow">{labels.countdown}</p>
        <div className="mt-6 flex items-start justify-between gap-1">
          <CountBox value={left?.days ?? null} label={labels.days} />
          <span className="inv-serif pt-1 text-3xl opacity-30">:</span>
          <CountBox value={left?.hours ?? null} label={labels.hours} />
          <span className="inv-serif pt-1 text-3xl opacity-30">:</span>
          <CountBox value={left?.minutes ?? null} label={labels.minutes} />
          <span className="inv-serif pt-1 text-3xl opacity-30">:</span>
          <CountBox value={left?.seconds ?? null} label={labels.seconds} />
        </div>
      </Reveal>
    </section>
  );
}

function shortLeft(ms: number, labels: Labels): string {
  if (ms <= 0) return "";
  const c = splitCountdown(ms);
  if (c.days > 0) return `${c.days} ${labels.days.toLowerCase()} ${c.hours} ${labels.hours.toLowerCase()}`;
  if (c.hours > 0) return `${c.hours} ${labels.hours.toLowerCase()} ${c.minutes} ${labels.minutes.toLowerCase()}`;
  return `${c.minutes} ${labels.minutes.toLowerCase()} ${c.seconds} ${labels.seconds.toLowerCase()}`;
}

/** Auspicious times, each with its own live countdown. */
export function NekathSection({ data, labels, lang, phase }: SectionProps) {
  const now = useNow(1000);
  if (!data.nekath.length || phase === "after") return null;
  return (
    <section className="inv-section relative overflow-hidden" style={{ background: "var(--inv-deep)", color: "var(--inv-on-deep)" }}>
      <div className="absolute inset-0 opacity-70" style={{ background: "radial-gradient(70% 50% at 50% 0%, color-mix(in srgb, var(--inv-accent) 22%, transparent), transparent 70%)" }} />
      <div className="inv-inner relative">
        <SectionTitle eyebrow={formatLongDate(data.date, lang)} title={labels.nekath} ornament={data.theme.ornament} onDeep />
        <div className="grid gap-3">
          {data.nekath.map((n, i) => {
            const at = zonedToUtc(n.date || data.date, n.time, data.timezone);
            const left = now === null ? "" : shortLeft(at - now, labels);
            return (
              <Reveal key={n.id} delay={i * 90}>
                <div className="flex items-center gap-4 border px-4 py-4" style={{ borderColor: "color-mix(in srgb, var(--inv-accent) 45%, transparent)" }}>
                  <div className="min-w-[5.2rem] text-center">
                    <p className="inv-serif leading-none" style={{ fontSize: "1.9rem", color: "var(--inv-accent)" }}>{formatTime(n.time).replace(/ (AM|PM)$/, "")}</p>
                    <p className="inv-kicker mt-1 opacity-70" style={{ fontSize: "0.6rem" }}>{formatTime(n.time).slice(-2)}</p>
                  </div>
                  <div className="h-10 w-px" style={{ background: "color-mix(in srgb, var(--inv-accent) 45%, transparent)" }} />
                  <div className="min-w-0 flex-1">
                    <p className="inv-serif text-[1.2rem] leading-snug">{n.title}</p>
                    {n.note ? <p className="text-[0.86rem] opacity-65">{n.note}</p> : null}
                    {left ? <p className="inv-kicker mt-1" style={{ fontSize: "0.58rem", color: "var(--inv-accent)" }}>{labels.in} {left}</p> : null}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function ScheduleSection({ data, labels }: SectionProps) {
  if (!data.events.length) return null;
  return (
    <section className="inv-section">
      <div className="inv-inner">
        <SectionTitle title={labels.schedule} ornament={data.theme.ornament} />
        <ol className="relative m-0 list-none p-0">
          <span className="absolute bottom-3 left-[5.6rem] top-3 w-px" style={{ background: "var(--inv-line)" }} />
          {data.events.map((e, i) => (
            <li key={e.id}>
              <Reveal delay={i * 80} className="relative flex gap-6 py-4">
                <div className="w-[4.4rem] shrink-0 pt-0.5 text-right">
                  <p className="inv-serif text-[1.25rem] leading-none">{formatTime(e.time).replace(/ (AM|PM)$/, "")}</p>
                  <p className="inv-kicker mt-1" style={{ fontSize: "0.58rem", color: "var(--inv-muted)" }}>{formatTime(e.time).slice(-2)}</p>
                </div>
                <span className="absolute left-[5.6rem] top-[1.45rem] h-2.5 w-2.5 -translate-x-1/2 rotate-45 border" style={{ background: "var(--inv-bg)", borderColor: "var(--inv-accent)" }} />
                <div className="min-w-0 flex-1 pl-2">
                  <p className="inv-serif text-[1.3rem] leading-tight">{e.title}</p>
                  {e.place ? <p className="text-[0.9rem]" style={{ color: "var(--inv-muted)" }}>{e.place}</p> : null}
                  {e.note ? <p className="text-[0.9rem]" style={{ color: "var(--inv-muted)" }}>{e.note}</p> : null}
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function VenueSection({ data, labels, showMap }: SectionProps & { showMap: boolean }) {
  const start = zonedToUtc(data.date, data.time, data.timezone);
  const query = data.mapQuery || `${data.venueName} ${data.venueAddress}`;
  const cal = googleCalendarUrl({
    title: displayNames(data),
    startUtc: start,
    endUtc: start + 4 * 3600_000,
    location: `${data.venueName}, ${data.venueAddress}`,
    details: data.subline,
  });
  return (
    <section className="inv-section" style={{ background: "var(--inv-accent-soft)" }}>
      <div className="inv-wide">
        <SectionTitle title={labels.venue} ornament={data.theme.ornament} />
        <div className="inv-two">
          <Reveal className="text-center">
            <p className="inv-serif text-[1.6rem] leading-tight">{data.venueName}</p>
            <p className="mt-2" style={{ color: "var(--inv-muted)" }}>{data.venueAddress}</p>
            <p className="inv-kicker mt-4">{formatTime(data.time)}</p>
            <div className="mt-6 flex flex-wrap justify-center gap-2.5">
              <a className="inv-btn inv-btn-solid" href={mapLinkUrl(query)} target="_blank" rel="noopener noreferrer">
                <MapPin size={15} strokeWidth={1.6} /> {labels.openMaps}
              </a>
              <a className="inv-btn" href={cal} target="_blank" rel="noopener noreferrer">
                <CalendarPlus size={15} strokeWidth={1.6} /> {labels.addCalendar}
              </a>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="inv-card overflow-hidden p-1.5">
              {showMap ? (
                <iframe
                  title="Map"
                  src={mapEmbedUrl(/^https?:/i.test(query) ? `${data.venueName} ${data.venueAddress}` : query)}
                  loading="lazy"
                  className="block h-60 w-full border-0"
                  style={{ filter: "saturate(0.7) contrast(0.95)" }}
                  referrerPolicy="no-referrer-when-downgrade"
                />
              ) : (
                <div className="flex h-60 w-full items-center justify-center" style={{ background: "var(--inv-accent-soft)", color: "var(--inv-muted)" }}>
                  <MapPin size={28} strokeWidth={1.2} />
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function StorySection({ data, labels }: SectionProps) {
  if (!data.story.length) return null;
  return (
    <section className="inv-section">
      <div className="inv-inner">
        <SectionTitle title={labels.story} ornament={data.theme.ornament} />
        <div className="grid gap-10">
          {data.story.map((s, i) => (
            <Reveal key={s.id} delay={i * 80} className="text-center">
              {s.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={s.photo} alt="" className="mx-auto mb-5 aspect-[4/3] w-full max-w-sm object-cover" loading="lazy" />
              ) : null}
              {s.when ? <p className="inv-eyebrow">{s.when}</p> : null}
              <p className="inv-serif mt-1 text-[1.5rem] leading-tight">{s.title}</p>
              <p className="mt-2" style={{ color: "var(--inv-muted)" }}>{s.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function GallerySection({ data, labels, fixed }: SectionProps & { fixed: boolean }) {
  const [open, setOpen] = useState<string | null>(null);
  if (!data.gallery.length) return null;
  return (
    <section className="inv-section" style={{ paddingLeft: "0.9rem", paddingRight: "0.9rem" }}>
      <div className="inv-wide">
        <SectionTitle title={labels.gallery} ornament={data.theme.ornament} />
        <div className="inv-gallery">
          {data.gallery.map((src, i) => (
            <Reveal key={`${src}-${i}`} delay={(i % 3) * 80}>
              <button type="button" className="block w-full cursor-zoom-in overflow-hidden" onClick={() => setOpen(src)}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" loading="lazy" className="block w-full transition-transform duration-700 hover:scale-[1.03]" />
              </button>
            </Reveal>
          ))}
        </div>
      </div>
      {open ? (
        <div
          className={`${fixed ? "fixed" : "absolute"} inset-0 z-50 flex items-center justify-center bg-black/90 p-4`}
          onClick={() => setOpen(null)}
          role="dialog"
          aria-modal="true"
        >
          <button type="button" aria-label="Close" className="absolute right-4 top-4 text-white/80"><X size={26} /></button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={open} alt="" className="max-h-full max-w-full object-contain" />
        </div>
      ) : null}
    </section>
  );
}

export function DetailsSection({ data, labels }: SectionProps) {
  const hasAny = data.dressCode || data.notes || data.contacts.length;
  if (!hasAny) return null;
  return (
    <section className="inv-section">
      <div className="inv-inner">
        <SectionTitle title={labels.details} ornament={data.theme.ornament} />
        <div className="grid gap-3">
          {data.dressCode ? (
            <Reveal className="inv-card px-5 py-5 text-center">
              <p className="inv-eyebrow">{labels.dressCode}</p>
              <p className="inv-serif mt-2 text-[1.3rem] leading-snug">{data.dressCode}</p>
            </Reveal>
          ) : null}
          {data.notes ? (
            <Reveal delay={80} className="inv-card px-5 py-5 text-center">
              <p style={{ color: "var(--inv-muted)" }}>{data.notes}</p>
            </Reveal>
          ) : null}
          {data.contacts.length ? (
            <Reveal delay={160} className="inv-card px-5 py-5 text-center">
              <p className="inv-eyebrow">{labels.contact}</p>
              <div className="mt-3 grid gap-3">
                {data.contacts.map((c) => (
                  <a key={c.id} href={`tel:${c.phone.replace(/[^+\d]/g, "")}`} className="flex items-center justify-center gap-3 no-underline" style={{ color: "inherit" }}>
                    <Phone size={14} strokeWidth={1.5} style={{ color: "var(--inv-accent)" }} />
                    <span className="inv-serif text-[1.15rem]">{c.name}</span>
                    <span style={{ color: "var(--inv-muted)" }}>{c.phone}</span>
                  </a>
                ))}
              </div>
            </Reveal>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export function GiftSection({ data, labels }: SectionProps) {
  if (!data.giftNote) return null;
  return (
    <section className="inv-section text-center" style={{ background: "var(--inv-accent-soft)" }}>
      <Reveal className="inv-inner">
        <p className="inv-eyebrow">{labels.gift}</p>
        <p className="inv-serif mt-4 text-balance" style={{ fontSize: "clamp(1.15rem, 5cqw, 1.4rem)", lineHeight: 1.55 }}>{data.giftNote}</p>
      </Reveal>
    </section>
  );
}

export function WishesSection({ data, labels, wishes }: SectionProps & { wishes: WishItem[] }) {
  if (!wishes.length) return null;
  return (
    <section className="inv-section" style={{ paddingLeft: 0, paddingRight: 0 }}>
      <div className="px-6"><SectionTitle title={labels.wishes} ornament={data.theme.ornament} /></div>
      <div className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto px-6 pb-2">
        {wishes.map((w) => (
          <figure key={w.id} className="inv-card m-0 w-[78%] max-w-xs shrink-0 snap-center px-5 py-6">
            <blockquote className="inv-serif m-0 text-[1.15rem] leading-snug">“{w.message}”</blockquote>
            <figcaption className="inv-kicker mt-4" style={{ color: "var(--inv-accent)" }}>{w.name}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

export function Footer({ data, labels, lang, branding }: SectionProps & { branding: boolean }) {
  return (
    <footer className="relative overflow-hidden px-7 pb-10 pt-16 text-center" style={{ background: "var(--inv-deep)", color: "var(--inv-on-deep)" }}>
      <Crest kind={data.theme.ornament} className="mx-auto w-24" style={{ color: "var(--inv-accent)" }} />
      <p className="inv-heading mt-6">{displayNames(data)}</p>
      <p className="inv-kicker mt-4 opacity-70" suppressHydrationWarning>{formatLongDate(data.date, lang)}</p>
      {data.hashtag ? <p className="inv-serif mt-5 text-lg italic" style={{ color: "var(--inv-accent)" }}>{data.hashtag}</p> : null}
      {branding ? (
        <Link href="/" prefetch={false} className="mt-12 inline-block text-[0.62rem] uppercase tracking-[0.22em] no-underline opacity-45 transition-opacity hover:opacity-80" style={{ color: "inherit", fontFamily: "var(--font-mono), monospace" }}>
          {labels.madeWith} Invitely
        </Link>
      ) : null}
    </footer>
  );
}
