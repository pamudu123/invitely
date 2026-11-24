"use client";

import type { Labels } from "@/lib/invitation/labels";
import { displayNames } from "@/lib/invitation/templates";
import { dateParts, formatLongDate, formatTime } from "@/lib/invitation/time";
import type { HeroLayout, InvitationData, LanguageId } from "@/lib/invitation/types";
import { DateLockup, Names, PhotoOrPlaceholder, ScrollHint } from "./hero-parts";
import { CornerFrame, Crest, Divider } from "./ornaments";

type ExtraLayout = "frame" | "poster" | "ticket" | "gazette" | "polaroid";

export function isExtraHero(layout: HeroLayout): layout is ExtraLayout {
  return layout === "frame" || layout === "poster" || layout === "ticket" || layout === "gazette" || layout === "polaroid";
}

interface Props {
  data: InvitationData;
  labels: Labels;
  lang: LanguageId;
  kicker: string;
}

const rise = (i: number) => ({ ["--rise-delay" as string]: `${200 + i * 150}ms` });
const screen = { minHeight: "var(--inv-screen)" };

/** A formal card set on a dark mount, with a double rule and corner ornaments. */
function FrameHero({ data, lang, kicker }: Props) {
  const year = data.date.slice(0, 4);
  return (
    <header className="flex p-3" style={{ ...screen, background: "var(--inv-deep)" }}>
      <div
        className="inv-paper relative flex flex-1 flex-col items-center justify-center overflow-hidden px-8 py-16 text-center"
        style={{ background: "var(--inv-bg)", border: "1px solid var(--inv-accent)" }}
      >
        <div className="pointer-events-none absolute inset-2 border" style={{ borderColor: "var(--inv-accent)", opacity: 0.45 }} />
        <CornerFrame kind={data.theme.ornament} size={68} inset={14} color="var(--inv-accent)" />
        <div style={{ color: "var(--inv-accent)" }}>
          <Crest kind={data.theme.ornament} className="inv-rise mx-auto w-32" style={rise(0)} />
        </div>
        <p className="inv-kicker inv-rise mt-6 max-w-[17rem]" style={rise(1)}>{kicker}</p>
        <div className="inv-rise mt-5" style={{ ...rise(2), fontSize: "0.9em" }}><Names data={data} /></div>
        <p className="inv-kicker inv-rise mt-5 max-w-[17rem]" style={{ ...rise(3), color: "var(--inv-muted)" }}>{data.subline}</p>
        <Divider kind={data.theme.ornament} className="inv-rise mx-auto mt-6 w-44" style={{ ...rise(4), color: "var(--inv-accent)" }} />
        <div className="inv-rise mt-6" style={rise(5)}><DateLockup data={data} lang={lang} /></div>
        <p className="inv-kicker inv-rise mt-3" style={{ ...rise(6), color: "var(--inv-muted)" }}>{year} · {data.venueName}</p>
      </div>
    </header>
  );
}

/** Big, left aligned type with the date set as an outlined numeral. */
function PosterHero({ data, lang, kicker }: Props) {
  const p = dateParts(data.date, lang);
  const [, month] = data.date.split("-");
  return (
    <header className="inv-paper relative flex flex-col justify-between overflow-hidden px-7 pb-20 pt-10" style={screen}>
      <div className="inv-rise flex items-start justify-between gap-6" style={rise(0)}>
        <p className="inv-kicker max-w-[62%]">{kicker}</p>
        <p className="inv-kicker" style={{ color: "var(--inv-accent)" }}>{p.year}</p>
      </div>

      <div className="py-8">
        <h1
          className="inv-names inv-rise"
          style={{ ...rise(1), fontSize: "calc(clamp(3.1rem, 18.5cqw, 7.5rem) * var(--inv-names-scale))", lineHeight: 0.98, overflowWrap: "break-word" }}
        >
          <span className="block">{data.name1}</span>
          {data.name2 ? (
            <span className="block">
              <span style={{ color: "var(--inv-accent)" }}>&amp; </span>
              {data.name2}
            </span>
          ) : null}
        </h1>
        <p className="inv-kicker inv-rise mt-6 max-w-[20rem]" style={{ ...rise(2), color: "var(--inv-muted)" }}>{data.subline}</p>
      </div>

      <div>
        <p
          className="inv-names inv-rise select-none"
          aria-hidden="true"
          style={{
            ...rise(3),
            fontSize: "calc(clamp(5rem, 31cqw, 12rem) * var(--inv-names-scale))",
            lineHeight: 0.85,
            whiteSpace: "nowrap",
            color: "transparent",
            WebkitTextStroke: "1.5px var(--inv-accent)",
            fontStyle: "normal",
          }}
        >
          {p.day}.{month}
        </p>
        <div className="inv-rise mt-5 flex items-end justify-between gap-6 border-t pt-4" style={{ ...rise(4), borderColor: "var(--inv-ink)" }}>
          <p className="inv-kicker shrink-0" suppressHydrationWarning>{p.weekday}<br />{Number(p.day)} {p.month}</p>
          <p className="inv-kicker min-w-0 text-right">{data.venueName}<br />{formatTime(data.time)}</p>
        </div>
      </div>
    </header>
  );
}

function TicketField({ label, value, wide = false }: { label: string; value: string; wide?: boolean }) {
  return (
    <div className={wide ? "col-span-2" : ""}>
      <p className="inv-kicker" style={{ fontSize: "0.56rem", color: "var(--inv-muted)" }}>{label}</p>
      <p className="inv-serif mt-0.5 text-[1.05rem] leading-snug" suppressHydrationWarning>{value}</p>
    </div>
  );
}

/** A boarding pass or admission ticket, with a tear-off stub. */
function TicketHero({ data, labels, lang, kicker }: Props) {
  const p = dateParts(data.date, lang);
  const notch = "absolute top-0 h-6 w-6 -translate-y-1/2 rounded-full";
  return (
    <header className="inv-paper relative flex flex-col items-center justify-center overflow-hidden px-5 py-14" style={screen}>
      <div className="inv-rise" style={{ ...rise(0), color: "var(--inv-accent)" }}>
        <Crest kind={data.theme.ornament} className="mx-auto w-24" />
      </div>
      <div
        className="inv-rise relative mt-7 w-full max-w-[22rem]"
        style={{ ...rise(1), filter: "drop-shadow(0 18px 30px color-mix(in srgb, var(--inv-ink) 22%, transparent))" }}
      >
        <div className="overflow-hidden rounded-t-[18px]" style={{ background: "var(--inv-surface)" }}>
          <div className="flex items-center justify-between gap-4 px-5 py-3" style={{ background: "var(--inv-deep)", color: "var(--inv-on-deep)" }}>
            <p className="inv-kicker" style={{ fontSize: "0.62rem" }}>{kicker}</p>
            <p className="inv-kicker shrink-0" style={{ fontSize: "0.62rem", color: "var(--inv-accent)" }}>{p.year}</p>
          </div>
          <div className="px-5 pb-6 pt-6">
            <div style={{ fontSize: "0.6em" }}><Names data={data} /></div>
            <p className="inv-kicker mt-3" style={{ fontSize: "0.62rem", color: "var(--inv-muted)" }}>{data.subline}</p>
            <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4 border-t pt-4" style={{ borderColor: "var(--inv-line)" }}>
              <TicketField label={labels.dateLabel} value={`${Number(p.day)} ${p.month} ${p.year}`} />
              <TicketField label={labels.timeLabel} value={formatTime(data.time)} />
              <TicketField label={labels.placeLabel} value={data.venueName} wide />
            </div>
          </div>
        </div>
        {/* Perforation */}
        <div className="relative" style={{ background: "var(--inv-surface)" }}>
          <div className="mx-4 border-t-2 border-dashed" style={{ borderColor: "var(--inv-line)" }} />
          <span className={`${notch} -left-3`} style={{ background: "var(--inv-bg)" }} />
          <span className={`${notch} -right-3`} style={{ background: "var(--inv-bg)" }} />
        </div>
        <div className="flex items-center justify-between gap-4 rounded-b-[18px] px-5 py-4" style={{ background: "var(--inv-surface)" }}>
          <div>
            <p className="inv-kicker" style={{ fontSize: "0.56rem", color: "var(--inv-muted)" }} suppressHydrationWarning>{p.weekday}</p>
            <p className="inv-serif leading-none" style={{ fontSize: "2.3rem", color: "var(--inv-accent)" }}>{p.day}</p>
          </div>
          <div
            aria-hidden="true"
            className="h-12 flex-1"
            style={{
              maxWidth: "11rem",
              backgroundImage:
                "repeating-linear-gradient(90deg, var(--inv-ink) 0 2px, transparent 2px 4px, var(--inv-ink) 4px 5px, transparent 5px 9px, var(--inv-ink) 9px 12px, transparent 12px 14px)",
              opacity: 0.85,
            }}
          />
        </div>
      </div>
      <div className="mt-9"><ScrollHint label={labels.scroll} /></div>
    </header>
  );
}

/** The front page of a newspaper, with the names as the headline. */
function GazetteHero({ data, lang, kicker }: Props) {
  const rule = { borderColor: "var(--inv-ink)" };
  return (
    <header className="inv-paper relative flex flex-col justify-center overflow-hidden px-5 py-10" style={screen}>
      <div className="inv-rise flex items-center justify-between gap-4" style={rise(0)}>
        <p className="inv-kicker" style={{ fontSize: "0.58rem" }} suppressHydrationWarning>{formatLongDate(data.date, lang)}</p>
        <p className="inv-kicker truncate text-right" style={{ fontSize: "0.58rem" }}>{data.venueName}</p>
      </div>
      <div className="inv-rise mt-2 border-y-2 py-3 text-center" style={{ ...rise(1), ...rule }}>
        <p
          style={{
            fontFamily: "var(--inv-font-names)",
            fontStyle: "italic",
            fontWeight: 500,
            fontSize: "clamp(1.7rem, 9cqw, 2.6rem)",
            lineHeight: 1.05,
            letterSpacing: "-0.01em",
          }}
        >
          {kicker}
        </p>
      </div>
      <div className="mt-1 border-t" style={rule} />

      <h1
        className="inv-names inv-rise mt-6 text-center"
        style={{ ...rise(2), fontSize: "calc(clamp(2.7rem, 14.5cqw, 5rem) * var(--inv-names-scale))", lineHeight: 0.95 }}
      >
        {data.name1}
        {data.name2 ? (
          <>
            {" "}
            <span style={{ color: "var(--inv-accent)", fontStyle: "italic", fontWeight: 400 }}>&amp;</span> {data.name2}
          </>
        ) : null}
      </h1>
      <p
        className="inv-rise mt-4 text-center italic"
        style={{ ...rise(3), fontFamily: "var(--inv-font-body)", fontSize: "1.2rem", lineHeight: 1.3 }}
      >
        {data.subline}
      </p>

      <figure className="inv-rise m-0 mt-6" style={rise(4)}>
        <div className="overflow-hidden border" style={{ ...rule, aspectRatio: "16 / 10", filter: data.heroPhoto ? "grayscale(1) contrast(1.1)" : undefined }}>
          <PhotoOrPlaceholder data={data} />
        </div>
        <figcaption className="inv-kicker mt-2 flex justify-between gap-4" style={{ fontSize: "0.56rem", color: "var(--inv-muted)" }}>
          <span>{displayNames(data)}</span>
          <span>{formatTime(data.time)}</span>
        </figcaption>
      </figure>

      <p
        className="inv-rise mt-5 text-justify"
        style={{
          ...rise(5),
          columnCount: 2,
          columnGap: "1.1rem",
          columnRule: "1px solid var(--inv-line)",
          fontSize: "0.86rem",
          lineHeight: 1.5,
          hyphens: "auto",
        }}
      >
        <span
          className="float-left pr-1.5"
          style={{ fontFamily: "var(--inv-font-names)", fontWeight: 800, fontSize: "2.5rem", lineHeight: 0.82, color: "var(--inv-accent)" }}
        >
          {data.message.charAt(0)}
        </span>
        {data.message.slice(1)}
      </p>
      <div className="mt-5 border-t-2" style={rule} />
    </header>
  );
}

/** Instant photos taped to the page, with a handwritten caption. */
function PolaroidHero({ data, lang, kicker }: Props) {
  const year = data.date.slice(0, 4);
  const card = { background: "#fffdf8", boxShadow: "0 14px 30px rgba(0,0,0,0.22), 0 2px 4px rgba(0,0,0,0.12)" };
  const second = data.gallery[0];
  return (
    <header className="inv-paper relative flex flex-col items-center justify-center overflow-hidden px-6 py-14 text-center" style={screen}>
      <p className="inv-kicker inv-rise" style={rise(0)}>{kicker}</p>
      <div className="inv-rise relative mt-9" style={{ ...rise(1), width: "min(70cqw, 18rem)" }}>
        <div className="absolute inset-0 p-3 pb-14" style={{ ...card, transform: "rotate(7deg) translate(14%, 3%)" }}>
          {second ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={second} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full" style={{ background: "color-mix(in srgb, var(--inv-accent) 35%, var(--inv-bg))" }} />
          )}
        </div>
        <div className="relative p-3" style={{ ...card, transform: "rotate(-4deg)" }}>
          <div style={{ aspectRatio: "1" }} className="overflow-hidden">
            <PhotoOrPlaceholder data={data} />
          </div>
          <p
            className="flex h-16 items-center justify-center"
            style={{ fontFamily: "var(--inv-font-names)", fontWeight: "var(--inv-names-weight)" as unknown as number, fontSize: "1.75rem", lineHeight: 1, color: "#2b2a28" }}
          >
            {displayNames(data)}
          </p>
          <span
            aria-hidden="true"
            className="absolute -top-3 left-1/2 h-7 w-24"
            style={{ background: "color-mix(in srgb, var(--inv-accent) 45%, transparent)", transform: "translateX(-50%) rotate(-3deg)" }}
          />
        </div>
      </div>
      <p className="inv-kicker inv-rise mt-12 max-w-[18rem]" style={{ ...rise(2), color: "var(--inv-muted)" }}>{data.subline}</p>
      <Divider kind={data.theme.ornament} className="inv-rise mx-auto mt-5 w-40" style={{ ...rise(3), color: "var(--inv-accent)" }} />
      <div className="inv-rise mt-5" style={rise(4)}><DateLockup data={data} lang={lang} /></div>
      <p className="inv-kicker inv-rise mt-3" style={{ ...rise(5), color: "var(--inv-muted)" }}>{year} · {data.venueName}</p>
    </header>
  );
}

export function ExtraHero(props: Props) {
  switch (props.data.theme.hero) {
    case "frame": return <FrameHero {...props} />;
    case "poster": return <PosterHero {...props} />;
    case "ticket": return <TicketHero {...props} />;
    case "gazette": return <GazetteHero {...props} />;
    default: return <PolaroidHero {...props} />;
  }
}
