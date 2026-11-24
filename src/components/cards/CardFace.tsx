import type { CSSProperties, ReactNode } from "react";
import { Corner, Crest, Divider } from "@/components/invitation/ornaments";
import type { CardLayoutId } from "@/lib/invitation/cards";
import { getShape, shapeSegments, toSvgPath, type ShapeId } from "@/lib/invitation/shapes";
import { displayNames, initials } from "@/lib/invitation/templates";
import { themeVars } from "@/lib/invitation/theme";
import { dateParts, formatLongDate, formatTime } from "@/lib/invitation/time";
import type { InvitationData } from "@/lib/invitation/types";
import { QrCode } from "./QrCode";

export interface CardFaceProps {
  data: InvitationData;
  layout: CardLayoutId;
  side?: "front" | "back";
  /** Box size in CSS pixels, bleed included */
  width: number;
  height: number;
  /** Extra background around the trim edge, for print */
  bleed?: number;
  /** Link the QR code and footer point to */
  link: string;
  /** Short form of the link, shown as text */
  linkLabel: string;
  footer?: "none" | "link" | "qr";
  guest?: { name: string; seats?: number };
  /** Printed cards only: the die cut silhouette and how the face should use it */
  shape?: ShapeId;
  tone?: "paper" | "deep";
  density?: "full" | "medium" | "compact";
  scale?: number;
}

/* Every size is a multiple of --u, about one percent of the card's width, so a
   layout keeps its proportions from a phone story to an A5 print. */
const u = (n: number) => `calc(var(--u) * ${n})`;
const edge = (n: number) => `calc(var(--bleed) + var(--u) * ${n})`;

const namesFont: CSSProperties = {
  fontFamily: "var(--inv-font-names)",
  fontWeight: "var(--inv-names-weight)" as unknown as number,
  fontStyle: "var(--inv-names-style)",
  letterSpacing: "var(--inv-names-tracking)",
  textTransform: "var(--inv-names-transform)" as CSSProperties["textTransform"],
  lineHeight: 1.04,
};

const labelFont: CSSProperties = {
  fontFamily: "var(--inv-font-heading)",
  fontWeight: "var(--inv-heading-weight)" as unknown as number,
  textTransform: "var(--inv-heading-transform)" as CSSProperties["textTransform"],
  letterSpacing: "var(--inv-heading-tracking)",
  lineHeight: 1.6,
};

const serif: CSSProperties = { fontFamily: "var(--inv-font-heading)", lineHeight: 1.3 };

function Label({ children, size = 2.3, style }: { children: ReactNode; size?: number; style?: CSSProperties }) {
  return <p style={{ ...labelFont, fontSize: u(size), margin: 0, textWrap: "balance", ...style }}>{children}</p>;
}

function Names({ data, size, align = "center", inline = false, style }: { data: InvitationData; size: number; align?: "center" | "left"; inline?: boolean; style?: CSSProperties }) {
  const long = Math.max(data.name1.length, data.name2.length) > 11 || (!data.name2 && data.name1.length > 14);
  const s = long ? size * 0.74 : size;
  const amp = <span style={{ ...serif, fontStyle: "italic", fontWeight: 400, textTransform: "none", letterSpacing: 0, color: "var(--inv-accent)", fontSize: "0.5em" }}>&amp;</span>;
  return (
    <h2 style={{ ...namesFont, fontSize: `calc(var(--u) * ${s} * min(var(--inv-names-scale), 1.1))`, margin: 0, textAlign: align, textWrap: "balance", ...style }}>
      {inline || !data.name2 ? (
        <>
          {data.name1}
          {data.name2 ? <> {amp} {data.name2}</> : null}
        </>
      ) : (
        <>
          <span style={{ display: "block" }}>{data.name1}</span>
          <span style={{ display: "block", fontSize: "0.5em", lineHeight: 1.25 }}>
            <span style={{ ...serif, fontStyle: "italic", fontWeight: 400, textTransform: "none", letterSpacing: 0, color: "var(--inv-accent)" }}>&amp;</span>
          </span>
          <span style={{ display: "block" }}>{data.name2}</span>
        </>
      )}
    </h2>
  );
}

function DateRow({ data, line = "var(--inv-accent)" }: { data: InvitationData; line?: string }) {
  const p = dateParts(data.date);
  const side: CSSProperties = { ...labelFont, fontSize: u(2.2), borderTop: `1px solid ${line}`, borderBottom: `1px solid ${line}`, padding: `${u(1.3)} 0`, width: u(22) };
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: u(3) }}>
      <span style={{ ...side, textAlign: "right" }}>{p.weekday}</span>
      <span style={{ ...serif, fontSize: u(9), lineHeight: 1 }}>{p.day}</span>
      <span style={{ ...side, textAlign: "left" }}>{p.month}</span>
    </div>
  );
}

function Where({ data, muted = "var(--inv-muted)", compact = false }: { data: InvitationData; muted?: string; compact?: boolean }) {
  const year = data.date.slice(0, 4);
  return (
    <div style={{ textAlign: "center" }}>
      <Label>{year} · {formatTime(data.time)}</Label>
      <p style={{ ...serif, fontSize: u(3.9), margin: `${u(0.8)} 0 0`, textWrap: "balance" }}>{data.venueName}</p>
      {data.venueAddress && !compact ? <p style={{ fontSize: u(2.5), margin: `${u(0.3)} 0 0`, color: muted, textWrap: "balance" }}>{data.venueAddress}</p> : null}
    </div>
  );
}

function Greeting({ guest, color = "var(--inv-accent)" }: { guest?: CardFaceProps["guest"]; color?: string }) {
  if (!guest) return null;
  return <Label size={2.2} style={{ color }}>Dear {guest.name}</Label>;
}

function Foot({ props, color = "var(--inv-muted)", qrColor = "var(--inv-ink)" }: { props: CardFaceProps; color?: string; qrColor?: string }) {
  if (!props.footer || props.footer === "none") return null;
  if (props.footer === "qr") {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: u(2.4) }}>
        <QrCode value={props.link} color={qrColor} className="shrink-0" />
        <Label size={1.8} style={{ color, textAlign: "left", maxWidth: u(34) }}>Scan for the map, schedule and RSVP</Label>
      </div>
    );
  }
  return <Label size={1.9} style={{ color, letterSpacing: "0.08em", textTransform: "none" }}>{props.linkLabel}</Label>;
}

/** Brass oil lamp with a lit flame, used by the Pahana card. */
function LampArt({ id, style }: { id: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 200 250" style={style} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-b`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#6f5220" />
          <stop offset="0.35" stopColor="#ecd08f" />
          <stop offset="0.6" stopColor="#b8924a" />
          <stop offset="1" stopColor="#5e4519" />
        </linearGradient>
        <radialGradient id={`${id}-f`} cx="0.5" cy="0.75" r="0.7">
          <stop offset="0" stopColor="#fffbe8" />
          <stop offset="0.35" stopColor="#ffd98a" />
          <stop offset="0.8" stopColor="#f29a3c" />
          <stop offset="1" stopColor="#e2702a" />
        </radialGradient>
      </defs>
      <path d="M100 26c14 24 20 42 0 66c-20-24-14-42 0-66z" fill={`url(#${id}-f)`} />
      <path d="M100 56c6 11 8 20 0 32c-8-12-6-21 0-32z" fill="#fffdf2" opacity="0.9" />
      <path d="M100 88v12" stroke="#2a2118" strokeWidth="3" strokeLinecap="round" />
      <path d="M30 100h140c-7 21-34 32-70 32s-63-11-70-32z" fill={`url(#${id}-b)`} />
      <ellipse cx="100" cy="100" rx="70" ry="8" fill="#5a431b" />
      <ellipse cx="100" cy="99" rx="61" ry="5.5" fill="#1c140c" opacity="0.78" />
      <path d="M93 131h14l2 14h-18z" fill={`url(#${id}-b)`} />
      <ellipse cx="100" cy="150" rx="17" ry="7" fill={`url(#${id}-b)`} />
      <path d="M94 156h12l1 22h-14z" fill={`url(#${id}-b)`} />
      <ellipse cx="100" cy="182" rx="13" ry="5.5" fill={`url(#${id}-b)`} />
      <path d="M95 186h10l3 16H92z" fill={`url(#${id}-b)`} />
      <path d="M70 212c4-8 16-11 30-11s26 3 30 11z" fill={`url(#${id}-b)`} />
      <path d="M48 232c4-14 26-20 52-20s48 6 52 20l4 8H44z" fill={`url(#${id}-b)`} />
      <ellipse cx="100" cy="240" rx="56" ry="6" fill="#4f3a16" />
    </svg>
  );
}

const fill: CSSProperties = { position: "absolute", inset: 0 };

/** Soft warm wash for paper areas. Plain gradients only: url() textures do not survive the image export. */
const paper: CSSProperties = {
  backgroundColor: "var(--inv-bg)",
  backgroundImage: "radial-gradient(120% 80% at 50% 0%, color-mix(in srgb, var(--inv-accent) 10%, transparent), transparent 62%)",
};
/** Ornaments keep their size when a column is tight. */
const fixed: CSSProperties = { flexShrink: 0, display: "block" };
const column: CSSProperties = { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" };

/* --------------------------------- fronts --------------------------------- */

function Frame(p: CardFaceProps) {
  const { data } = p;
  const corner: CSSProperties = { position: "absolute", width: u(16), height: u(16), color: "var(--inv-accent)" };
  return (
    <div style={{ ...fill, ...paper }}>
      <div style={{ position: "absolute", inset: edge(4), border: "1px solid var(--inv-accent)" }} />
      <div style={{ position: "absolute", inset: edge(5.3), border: "1px solid var(--inv-accent)", opacity: 0.45 }} />
      <Corner kind={data.theme.ornament} style={{ ...corner, top: edge(6.5), left: edge(6.5) }} />
      <Corner kind={data.theme.ornament} style={{ ...corner, top: edge(6.5), right: edge(6.5), transform: "scaleX(-1)" }} />
      <Corner kind={data.theme.ornament} style={{ ...corner, bottom: edge(6.5), left: edge(6.5), transform: "scaleY(-1)" }} />
      <Corner kind={data.theme.ornament} style={{ ...corner, bottom: edge(6.5), right: edge(6.5), transform: "scale(-1,-1)" }} />
      <div style={{ ...column, position: "absolute", inset: edge(10.5), gap: u(2.2) }}>
        <Greeting guest={p.guest} />
        <Crest kind={data.theme.ornament} style={{ ...fixed, width: u(20), color: "var(--inv-accent)" }} />
        <Label style={{ maxWidth: u(60) }}>{data.kicker}</Label>
        <Names data={data} size={11.5} />
        <Label style={{ color: "var(--inv-muted)", maxWidth: u(62) }}>{data.subline}</Label>
        <Divider kind={data.theme.ornament} style={{ ...fixed, width: u(36), color: "var(--inv-accent)" }} />
        <DateRow data={data} />
        <Where data={data} />
        <Foot props={p} />
      </div>
    </div>
  );
}

function Arch(p: CardFaceProps) {
  const { data } = p;
  return (
    <div style={{ ...fill, background: "var(--inv-deep)" }}>
      <div
        style={{
          position: "absolute",
          left: edge(6.4), right: edge(6.4), top: edge(6.4), bottom: edge(6.4),
          border: "1px solid var(--inv-accent)", opacity: 0.6,
          borderRadius: `${u(60)} ${u(60)} ${u(1)} ${u(1)}`,
        }}
      />
      <div
        style={{
          ...column,
          ...paper,
          position: "absolute",
          left: edge(8.4), right: edge(8.4), top: edge(8.4), bottom: edge(8.4),
          borderRadius: `${u(58)} ${u(58)} ${u(0.6)} ${u(0.6)}`,
          padding: `${u(13)} ${u(7)} ${u(6)}`,
          gap: u(2),
        }}
      >
        <Crest kind={data.theme.ornament} style={{ ...fixed, width: u(17), color: "var(--inv-accent)" }} />
        <Greeting guest={p.guest} />
        <Label style={{ maxWidth: u(50) }}>{data.kicker}</Label>
        <Names data={data} size={10} />
        <Label style={{ color: "var(--inv-muted)", maxWidth: u(56) }}>{data.subline}</Label>
        <Divider kind={data.theme.ornament} style={{ ...fixed, width: u(32), color: "var(--inv-accent)" }} />
        <DateRow data={data} />
        <Where data={data} compact />
        <Foot props={p} />
      </div>
    </div>
  );
}

function Band(p: CardFaceProps) {
  const { data } = p;
  return (
    <div style={{ ...fill, display: "flex", flexDirection: "column", background: "var(--inv-bg)" }}>
      <div
        style={{
          ...column,
          flex: "0 0 51%",
          background: "radial-gradient(90% 70% at 50% 0%, color-mix(in srgb, var(--inv-accent) 20%, var(--inv-deep)), var(--inv-deep) 75%)",
          color: "var(--inv-on-deep)",
          padding: `${edge(7)} ${edge(8)} ${u(5.5)}`,
          gap: u(2.2),
        }}
      >
        <Greeting guest={p.guest} />
        <Crest kind={data.theme.ornament} style={{ ...fixed, width: u(17), color: "var(--inv-accent)" }} />
        <Label style={{ maxWidth: u(60), opacity: 0.9 }}>{data.kicker}</Label>
        <Names data={data} size={11} />
      </div>
      <div style={{ position: "relative", height: 0 }}>
        <div style={{ position: "absolute", left: "50%", top: 0, transform: "translate(-50%, -50%)", background: "var(--inv-bg)", borderRadius: u(4), padding: `${u(1)} ${u(3)}` }}>
          <Divider kind={data.theme.ornament} style={{ width: u(34), display: "block", color: "var(--inv-accent)" }} />
        </div>
      </div>
      <div style={{ ...column, ...paper, flex: 1, padding: `${u(6)} ${edge(8)} ${edge(6.5)}`, gap: u(2.4) }}>
        <Label style={{ color: "var(--inv-muted)", maxWidth: u(62) }}>{data.subline}</Label>
        <DateRow data={data} />
        <Where data={data} />
        {data.hostsLine ? <Label size={1.9} style={{ color: "var(--inv-muted)", maxWidth: u(66) }}>{data.hostsLine}</Label> : null}
        <Foot props={p} />
      </div>
    </div>
  );
}

function Seal(p: CardFaceProps) {
  const { data } = p;
  const mono = initials(data);
  const ring: CSSProperties = { position: "absolute", borderRadius: "50%", border: "1px solid var(--inv-accent)" };
  return (
    <div style={{ ...fill, ...column, ...paper, padding: edge(9), gap: u(3) }}>
      <div style={{ position: "absolute", left: edge(9), right: edge(9), top: edge(5), borderTop: "1px solid var(--inv-accent)" }} />
      <div style={{ position: "absolute", left: edge(9), right: edge(9), bottom: edge(5), borderTop: "1px solid var(--inv-accent)" }} />
      <Greeting guest={p.guest} />
      <div style={{ position: "relative", width: u(38), height: u(38), display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ ...ring, inset: 0 }} />
        <span style={{ ...ring, inset: u(1.4), opacity: 0.45 }} />
        <span style={{ ...serif, fontSize: u(15), lineHeight: 1, color: "var(--inv-accent)", display: "flex", alignItems: "center", gap: u(2) }}>
          {mono.charAt(0)}
          {mono.length > 1 ? (
            <>
              <span style={{ width: 1, height: u(11), background: "var(--inv-accent)", opacity: 0.6 }} />
              {mono.charAt(1)}
            </>
          ) : null}
        </span>
      </div>
      <Label style={{ maxWidth: u(60) }}>{data.kicker}</Label>
      <Names data={data} size={9.5} inline />
      <Label style={{ color: "var(--inv-muted)", maxWidth: u(62) }}>{data.subline}</Label>
      <Divider kind={data.theme.ornament} style={{ ...fixed, width: u(34), color: "var(--inv-accent)" }} />
      <div>
        <p style={{ ...serif, fontSize: u(4.4), margin: 0 }}>{formatLongDate(data.date)}</p>
        <Label style={{ marginTop: u(1.2) }}>{formatTime(data.time)} · {data.venueName}</Label>
      </div>
      <Foot props={p} />
    </div>
  );
}

function Lamp(p: CardFaceProps) {
  const { data } = p;
  return (
    <div style={{ ...fill, background: "var(--inv-deep)", color: "var(--inv-on-deep)" }}>
      <div
        style={{
          ...fill,
          background:
            "radial-gradient(60% 34% at 50% 60%, rgba(255,200,120,0.5), rgba(255,170,80,0.14) 55%, transparent 80%), radial-gradient(120% 90% at 50% 50%, transparent 45%, rgba(0,0,0,0.5) 100%)",
        }}
      />
      <div style={{ ...fill, ...column, justifyContent: "space-between", padding: `${edge(10)} ${edge(8)} ${edge(8)}` }}>
        <div style={{ ...column, gap: u(2.6) }}>
          <Greeting guest={p.guest} />
          <Label style={{ maxWidth: u(60), opacity: 0.85 }}>{data.kicker}</Label>
          <Names data={data} size={11.5} />
          <Label style={{ maxWidth: u(62), opacity: 0.7 }}>{data.subline}</Label>
        </div>
        <LampArt id={`lamp-${p.side ?? "f"}-${p.width}`} style={{ height: "31%", width: "auto", flexShrink: 0 }} />
        <div style={{ ...column, gap: u(1.6) }}>
          <p style={{ ...serif, fontSize: u(4.8), margin: 0, color: "var(--inv-accent)" }}>{formatLongDate(data.date)}</p>
          <Label style={{ opacity: 0.85 }}>{formatTime(data.time)} · {data.venueName}</Label>
          <Foot props={p} color="color-mix(in srgb, var(--inv-on-deep) 65%, transparent)" qrColor="var(--inv-on-deep)" />
        </div>
      </div>
    </div>
  );
}

function Margin(p: CardFaceProps) {
  const { data } = p;
  const d = dateParts(data.date);
  const [, month] = data.date.split("-");
  const block = (label: string, lines: string[]) => (
    <div>
      <Label size={1.9} style={{ color: "var(--inv-accent)" }}>{label}</Label>
      {lines.filter(Boolean).map((l, i) => (
        <p key={i} style={{ ...serif, fontSize: u(i === 0 ? 4.2 : 3), margin: `${u(0.4)} 0 0`, color: i === 0 ? undefined : "var(--inv-muted)" }}>{l}</p>
      ))}
    </div>
  );
  return (
    <div style={{ ...fill, display: "flex", background: "var(--inv-bg)" }}>
      <div
        style={{
          flex: `0 0 ${edge(17)}`,
          background: "var(--inv-deep)",
          color: "var(--inv-on-deep)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          padding: `${edge(8)} 0 ${edge(8)} var(--bleed)`,
        }}
      >
        <Crest kind={data.theme.ornament} style={{ ...fixed, width: u(11), color: "var(--inv-accent)" }} />
        <span style={{ ...labelFont, fontSize: u(2.6), writingMode: "vertical-rl", transform: "rotate(180deg)", color: "var(--inv-accent)", whiteSpace: "nowrap" }}>
          {d.day} · {month} · {d.year}
        </span>
      </div>
      <div style={{ ...paper, flex: 1, minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: `${edge(9)} ${edge(7)} ${edge(8)} ${u(7)}` }}>
        <div>
          {p.guest ? <Greeting guest={p.guest} /> : null}
          <Label style={{ marginTop: p.guest ? u(2) : 0 }}>{data.kicker}</Label>
        </div>
        <div>
          <Names data={data} size={12.5} align="left" />
          <Label style={{ color: "var(--inv-muted)", marginTop: u(3.5) }}>{data.subline}</Label>
        </div>
        <div style={{ display: "grid", gap: u(3.4), borderTop: "1px solid var(--inv-ink)", paddingTop: u(4) }}>
          {block("When", [formatLongDate(data.date), formatTime(data.time)])}
          {block("Where", [data.venueName, data.venueAddress])}
          <div style={{ display: "flex", justifyContent: "flex-start" }}><Foot props={p} /></div>
        </div>
      </div>
    </div>
  );
}

function Poster(p: CardFaceProps) {
  const { data } = p;
  const d = dateParts(data.date);
  const [, month] = data.date.split("-");
  return (
    <div style={{ ...fill, background: "var(--inv-deep)", color: "var(--inv-on-deep)", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: `${edge(9)} ${edge(8)} ${edge(8)}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: u(4) }}>
        <Label style={{ maxWidth: "66%" }}>{p.guest ? `Dear ${p.guest.name}` : data.kicker}</Label>
        <Label style={{ color: "var(--inv-accent)" }}>{d.year}</Label>
      </div>
      <div>
        <Names data={data} size={15} align="left" style={{ lineHeight: 0.98, overflowWrap: "break-word" }} />
        <Label style={{ marginTop: u(4), opacity: 0.75, maxWidth: u(70) }}>{data.subline}</Label>
      </div>
      <div>
        <p
          style={{
            ...namesFont,
            fontStyle: "normal",
            fontSize: `calc(var(--u) * 27 * min(var(--inv-names-scale), 1.1))`,
            lineHeight: 0.85,
            margin: 0,
            whiteSpace: "nowrap",
            color: "transparent",
            WebkitTextStrokeWidth: u(0.28),
            WebkitTextStrokeColor: "var(--inv-accent)",
          }}
        >
          {d.day}.{month}
        </p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: u(4), borderTop: "1px solid currentColor", marginTop: u(4), paddingTop: u(3) }}>
          <Label>{d.weekday}<br />{Number(d.day)} {d.month}</Label>
          <Label style={{ textAlign: "right" }}>{data.venueName}<br />{formatTime(data.time)}</Label>
        </div>
        {p.footer && p.footer !== "none" ? (
          <div style={{ marginTop: u(3), display: "flex" }}>
            <Foot props={p} color="color-mix(in srgb, var(--inv-on-deep) 65%, transparent)" qrColor="var(--inv-on-deep)" />
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Photo(p: CardFaceProps) {
  const { data } = p;
  return (
    <div style={{ ...fill, display: "flex", flexDirection: "column", background: "var(--inv-bg)" }}>
      <div style={{ flex: "0 0 54%", position: "relative", overflow: "hidden", background: "linear-gradient(160deg, color-mix(in srgb, var(--inv-deep) 78%, var(--inv-accent)), var(--inv-deep))" }}>
        {data.heroPhoto ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={data.heroPhoto} alt="" crossOrigin="anonymous" style={{ ...fill, width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{ ...fill, ...column, color: "var(--inv-on-deep)", gap: u(2) }}>
            <Crest kind={data.theme.ornament} style={{ ...fixed, width: u(30), color: "var(--inv-accent)" }} />
            <span style={{ ...namesFont, fontSize: u(11) }}>{initials(data)}</span>
          </div>
        )}
      </div>
      <div style={{ height: u(0.5), background: "var(--inv-accent)" }} />
      <div style={{ ...column, ...paper, flex: 1, padding: `${u(5)} ${edge(8)} ${edge(7)}`, gap: u(2.4) }}>
        <Greeting guest={p.guest} />
        <Label style={{ maxWidth: u(62) }}>{data.kicker}</Label>
        <Names data={data} size={10} inline />
        <Divider kind={data.theme.ornament} style={{ ...fixed, width: u(30), color: "var(--inv-accent)" }} />
        <div>
          <p style={{ ...serif, fontSize: u(4.2), margin: 0 }}>{formatLongDate(data.date)}</p>
          <Label style={{ marginTop: u(1) }}>{formatTime(data.time)} · {data.venueName}</Label>
        </div>
        <Foot props={p} />
      </div>
    </div>
  );
}

/** Long card drawn like an ola leaf manuscript: grain, a double rule and two string holes. */
function Ola(p: CardFaceProps) {
  const { data } = p;
  const d = dateParts(data.date);
  const v = (n: number) => `calc(var(--v) * ${n})`;
  const hole = (left: string): CSSProperties => ({
    position: "absolute", left, top: "50%", width: v(8), height: v(8), transform: "translate(-50%, -50%)", borderRadius: "50%",
    background: "var(--inv-deep)", boxShadow: `0 0 0 ${v(1)} color-mix(in srgb, var(--inv-accent) 55%, transparent), inset 0 ${v(0.6)} ${v(1.2)} rgba(0,0,0,0.5)`,
  });
  const col: CSSProperties = { ...column, flex: 1, minWidth: 0, gap: v(2.2), padding: `0 ${v(5)}` };
  return (
    <div
      style={{
        ...fill,
        background:
          "repeating-linear-gradient(0deg, color-mix(in srgb, var(--inv-ink) 7%, transparent) 0 1px, transparent 1px calc(var(--v) * 2.4)), linear-gradient(180deg, color-mix(in srgb, var(--inv-accent) 26%, var(--inv-bg)), var(--inv-bg) 32%, var(--inv-bg) 68%, color-mix(in srgb, var(--inv-accent) 30%, var(--inv-bg)))",
      }}
    >
      <div style={{ position: "absolute", left: `calc(var(--bleed) + var(--v) * 5)`, right: `calc(var(--bleed) + var(--v) * 5)`, top: `calc(var(--bleed) + var(--v) * 6)`, bottom: `calc(var(--bleed) + var(--v) * 6)`, borderTop: "1px solid var(--inv-accent)", borderBottom: "1px solid var(--inv-accent)" }} />
      <div style={{ position: "absolute", left: `calc(var(--bleed) + var(--v) * 5)`, right: `calc(var(--bleed) + var(--v) * 5)`, top: `calc(var(--bleed) + var(--v) * 7.6)`, bottom: `calc(var(--bleed) + var(--v) * 7.6)`, borderTop: "1px solid var(--inv-accent)", borderBottom: "1px solid var(--inv-accent)", opacity: 0.45 }} />
      <span style={hole("27%")} />
      <span style={hole("73%")} />
      <div style={{ position: "absolute", inset: `calc(var(--bleed) + var(--v) * 12) calc(var(--bleed) + var(--v) * 6)`, display: "flex", alignItems: "center" }}>
        <div style={{ ...col, flex: "0 0 23%" }}>
          <p style={{ ...labelFont, fontSize: v(3.6), margin: 0 }}>{d.weekday}</p>
          <p style={{ ...serif, fontSize: v(21), lineHeight: 0.9, margin: 0, color: "var(--inv-accent)" }}>{d.day}</p>
          <p style={{ ...labelFont, fontSize: v(3.6), margin: 0 }}>{d.month} {d.year}</p>
        </div>
        <div style={{ ...col, flex: "1 1 54%", padding: `0 ${v(9)}` }}>
          <p style={{ ...labelFont, fontSize: v(3.3), margin: 0, textWrap: "balance" }}>{p.guest ? `Dear ${p.guest.name}` : data.kicker}</p>
          <h2 style={{ ...namesFont, fontSize: `calc(var(--v) * ${displayNames(data).length > 22 ? 12 : 16} * var(--inv-names-scale))`, margin: 0, textWrap: "balance" }}>
            {data.name1}
            {data.name2 ? <> <span style={{ ...serif, fontStyle: "italic", fontSize: "0.55em", color: "var(--inv-accent)", textTransform: "none" }}>&amp;</span> {data.name2}</> : null}
          </h2>
          <Divider kind={data.theme.ornament} style={{ ...fixed, width: v(46), color: "var(--inv-accent)" }} />
          <p style={{ ...labelFont, fontSize: v(3.1), margin: 0, color: "var(--inv-muted)", textWrap: "balance" }}>{data.subline}</p>
        </div>
        <div style={{ ...col, flex: "0 0 23%" }}>
          <p style={{ ...serif, fontSize: v(8), lineHeight: 1, margin: 0, color: "var(--inv-accent)" }}>{formatTime(data.time)}</p>
          <p style={{ ...serif, fontSize: v(5), margin: 0, textWrap: "balance" }}>{data.venueName}</p>
          {p.footer === "qr" ? (
            <div style={{ width: v(17) }}><QrCode value={p.link} color="var(--inv-ink)" /></div>
          ) : (
            <p style={{ fontSize: v(3.2), margin: 0, color: "var(--inv-muted)", textWrap: "balance" }}>{data.venueAddress}</p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------- back ---------------------------------- */

function Back(p: CardFaceProps) {
  const { data } = p;
  const dark = p.tone === "deep";
  const wide = p.width > p.height * 1.3;
  const ink = dark ? "var(--inv-on-deep)" : "var(--inv-ink)";
  const muted = dark ? "color-mix(in srgb, var(--inv-on-deep) 68%, transparent)" : "var(--inv-muted)";
  const events = data.sections.includes("schedule") ? data.events.slice(0, wide ? 4 : 5) : [];
  const nekath = data.sections.includes("nekath") ? data.nekath.slice(0, 3) : [];
  const message = data.message.length > 230 ? `${data.message.slice(0, 228).trimEnd()}…` : data.message;
  const unit = wide ? "calc(var(--v) * 1.05)" : "var(--u)";
  const k = (n: number) => `calc(${unit} * ${n})`;
  const head: CSSProperties = { ...labelFont, fontSize: k(2.1), color: "var(--inv-accent)", margin: 0 };

  const list = (title: string, rows: { time: string; title: string }[]) =>
    rows.length ? (
      <div style={{ width: "100%" }}>
        <p style={{ ...head, textAlign: "center" }}>{title}</p>
        <div style={{ marginTop: k(1.4), display: "grid", gap: k(0.9) }}>
          {rows.map((r, i) => (
            <div key={i} style={{ display: "flex", alignItems: "baseline", gap: k(2) }}>
              <span style={{ ...serif, fontSize: k(3.2), width: k(15), textAlign: "right", flexShrink: 0 }}>{formatTime(r.time)}</span>
              <span style={{ flex: "0 0 auto", width: k(3), borderTop: `1px solid ${muted}`, transform: `translateY(${k(-0.8)})` }} />
              <span style={{ ...serif, fontSize: k(3.2), textAlign: "left" }}>{r.title}</span>
            </div>
          ))}
        </div>
      </div>
    ) : null;

  const qr = (
    <div style={{ ...column, gap: k(1.6) }}>
      <div style={{ width: k(21), padding: k(1.6), background: "#fff", borderRadius: k(0.6) }}>
        <QrCode value={p.link} color="#111111" />
      </div>
      <p style={{ ...labelFont, fontSize: k(1.8), margin: 0, maxWidth: k(40), textWrap: "balance" }}>Scan for the map, live schedule and to reply</p>
      <p style={{ fontSize: k(2), margin: 0, color: muted }}>{p.linkLabel}</p>
      {p.guest?.seats ? <p style={{ ...labelFont, fontSize: k(1.8), margin: 0, color: "var(--inv-accent)" }}>Seats reserved: {p.guest.seats}</p> : null}
    </div>
  );

  const words = (
    <div style={{ ...column, gap: k(2.2) }}>
      <Divider kind={data.theme.ornament} style={{ ...fixed, width: k(34), color: "var(--inv-accent)" }} />
      {p.guest ? <p style={{ ...head }}>Dear {p.guest.name}</p> : null}
      <p style={{ ...serif, fontSize: k(3.5), lineHeight: 1.5, margin: 0, maxWidth: k(70), textWrap: "balance" }}>{message}</p>
      {data.hostsLine ? <p style={{ ...labelFont, fontSize: k(1.9), margin: 0, color: muted, maxWidth: k(66), textWrap: "balance" }}>{data.hostsLine}</p> : null}
    </div>
  );

  const extras = (
    <div style={{ ...column, gap: k(1.2) }}>
      {data.dressCode && data.sections.includes("details") ? (
        <p style={{ fontSize: k(2.5), margin: 0, color: muted }}><span style={{ ...labelFont, fontSize: k(1.9), color: "var(--inv-accent)" }}>Dress code </span>{data.dressCode}</p>
      ) : null}
      {data.rsvp.enabled && data.rsvp.deadline ? (
        <p style={{ fontSize: k(2.5), margin: 0, color: muted }}><span style={{ ...labelFont, fontSize: k(1.9), color: "var(--inv-accent)" }}>Kindly reply by </span>{formatLongDate(data.rsvp.deadline)}</p>
      ) : null}
    </div>
  );

  return (
    <div style={{ ...fill, ...(dark ? { backgroundColor: "var(--inv-deep)" } : paper), color: ink }}>
      {p.shape && p.shape !== "rect" ? (
        <ShapeRule p={p} shape={p.shape} />
      ) : (
        <div style={{ position: "absolute", inset: `calc(var(--bleed) + ${k(4)})`, border: "1px solid var(--inv-accent)", opacity: 0.55 }} />
      )}
      {wide ? (
        <div style={{ position: "absolute", inset: `calc(var(--bleed) + ${k(8)})`, display: "flex", alignItems: "center", gap: k(6) }}>
          <div style={{ flex: "1 1 36%", minWidth: 0 }}>{words}</div>
          <div style={{ flex: "1 1 36%", minWidth: 0, ...column, gap: k(3) }}>
            {list("Order of the day", events)}
            {extras}
          </div>
          <div style={{ flex: "0 0 auto" }}>{qr}</div>
        </div>
      ) : (
        <div style={{ ...column, position: "absolute", inset: `calc(var(--bleed) + ${k(9)})`, justifyContent: "space-between", gap: k(3) }}>
          {words}
          {list("Auspicious times", nekath)}
          {list("Order of the day", nekath.length ? events.slice(0, 3) : events)}
          {extras}
          {qr}
        </div>
      )}
    </div>
  );
}


/* ------------------------------ shaped cards ------------------------------ */

/** Inner rule that follows the card's silhouette, drawn a little inside the cut edge. */
function ShapeRule({ p, shape }: { p: CardFaceProps; shape: ShapeId }) {
  const bleed = p.bleed ?? 0;
  const d = toSvgPath(shapeSegments(shape, p.width - bleed * 2, p.height - bleed * 2, bleed).slice(0, getShape(shape).outline(1, 1).length));
  const cx = p.width / 2;
  const cy = p.height / 2;
  const inset = (k: number) => `translate(${cx} ${cy}) scale(${k}) translate(${-cx} ${-cy})`;
  return (
    <svg viewBox={`0 0 ${p.width} ${p.height}`} style={{ ...fill, width: "100%", height: "100%", color: "var(--inv-accent)" }} aria-hidden="true">
      <path d={d} transform={inset(0.925)} fill="none" stroke="currentColor" strokeWidth="1.1" />
      <path d={d} transform={inset(0.895)} fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.45" />
      {shape === "moonstone"
        ? [0.8, 0.77].map((k) => (
            // The carved bands of a moonstone, anchored to its flat edge
            <path key={k} d={d} transform={`translate(${cx} ${p.height - bleed}) scale(${k}) translate(${-cx} ${-(p.height - bleed)})`} fill="none" stroke="currentColor" strokeWidth="0.8" opacity={k === 0.8 ? 0.7 : 0.35} />
          ))
        : null}
    </svg>
  );
}

/** Where the words go inside a silhouette. */
function safeBox(p: CardFaceProps, shape: ShapeId): CSSProperties {
  const s = getShape(shape).safe;
  const bleed = p.bleed ?? 0;
  const w = p.width - bleed * 2;
  const h = p.height - bleed * 2;
  return {
    position: "absolute",
    top: bleed + s.top * h,
    bottom: bleed + s.bottom * h,
    left: bleed + s.left * w,
    right: bleed + s.right * w,
    ["--u" as string]: `calc(min(1cqw, 0.74cqh) * ${p.scale ?? 1})`,
  };
}

function Shaped(p: CardFaceProps) {
  const { data } = p;
  const shape = p.shape ?? "rect";
  const deep = p.tone === "deep";
  const density = p.density ?? "full";
  const muted = deep ? "color-mix(in srgb, var(--inv-on-deep) 68%, transparent)" : "var(--inv-muted)";
  const leaf = shape === "leaf";
  // Wide silhouettes such as the moonstone have little height, so the names go on one line.
  const low = p.width > p.height * 1.3;
  return (
    <div
      style={{
        ...fill,
        ...(deep
          ? { backgroundColor: "var(--inv-deep)", backgroundImage: "radial-gradient(80% 60% at 50% 30%, color-mix(in srgb, var(--inv-accent) 22%, transparent), transparent 75%)" }
          : paper),
        color: deep ? "var(--inv-on-deep)" : "var(--inv-ink)",
      }}
    >
      {leaf ? (
        // Veins of the betel leaf, faint behind the words
        <svg viewBox="0 0 100 124" preserveAspectRatio="none" style={{ ...fill, width: "100%", height: "100%", color: "var(--inv-accent)", opacity: 0.28 }} aria-hidden="true">
          <path d="M50 10V116M50 30C36 38 22 50 16 66M50 30C64 38 78 50 84 66M50 54C40 62 30 74 27 86M50 54C60 62 70 74 73 86M50 78C44 84 39 92 38 100M50 78C56 84 61 92 62 100" fill="none" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" />
        </svg>
      ) : null}
      <ShapeRule p={p} shape={shape} />
      <div style={{ ...safeBox(p, shape), ...column, gap: u(density === "full" ? 2.4 : 2.8) }}>
        <Greeting guest={p.guest} />
        {(density !== "compact" || !leaf) && !low ? <Crest kind={data.theme.ornament} style={{ ...fixed, width: u(density === "full" ? 19 : 17), color: "var(--inv-accent)" }} /> : null}
        {low ? <Label style={{ maxWidth: u(60) }}>{data.kicker}</Label> : null}
        {density !== "compact" ? <Label style={{ maxWidth: u(56), opacity: deep ? 0.9 : 1 }}>{data.kicker}</Label> : null}
        <Names data={data} size={density === "full" ? 11.5 : 11} inline={low} />
        {density === "full" ? <Label style={{ color: muted, maxWidth: u(58) }}>{data.subline}</Label> : null}
        <Divider kind={data.theme.ornament} style={{ ...fixed, width: u(30), color: "var(--inv-accent)" }} />
        {density === "full" ? (
          <>
            <DateRow data={data} />
            <Where data={data} muted={muted} compact />
          </>
        ) : (
          <div>
            <p style={{ ...serif, fontSize: u(4.4), margin: 0 }}>{formatLongDate(data.date)}</p>
            <Label style={{ marginTop: u(1), maxWidth: u(54) }}>{formatTime(data.time)} · {data.venueName}</Label>
          </div>
        )}
      </div>
    </div>
  );
}

/** Back of a shaped card: a few words and the QR code that opens the web card. */
function ShapedBack(p: CardFaceProps) {
  const { data } = p;
  const shape = p.shape ?? "rect";
  const deep = p.tone === "deep";
  const muted = deep ? "color-mix(in srgb, var(--inv-on-deep) 68%, transparent)" : "var(--inv-muted)";
  const roomy = p.density === "full";
  const message = data.message.length > 150 ? `${data.message.slice(0, 148).trimEnd()}…` : data.message;
  return (
    <div style={{ ...fill, ...(deep ? { backgroundColor: "var(--inv-deep)" } : paper), color: deep ? "var(--inv-on-deep)" : "var(--inv-ink)" }}>
      <ShapeRule p={p} shape={shape} />
      <div style={{ ...safeBox(p, shape), ...column, gap: u(2.6) }}>
        {p.guest ? <Label size={2.2} style={{ color: "var(--inv-accent)" }}>Dear {p.guest.name}</Label> : null}
        {roomy ? <p style={{ ...serif, fontSize: u(3.6), lineHeight: 1.45, margin: 0, maxWidth: u(64), textWrap: "balance" }}>{message}</p> : null}
        {roomy && data.hostsLine ? <Label size={1.9} style={{ color: muted, maxWidth: u(62) }}>{data.hostsLine}</Label> : null}
        <Divider kind={data.theme.ornament} style={{ ...fixed, width: u(30), color: "var(--inv-accent)" }} />
        <div style={{ width: u(24), padding: u(1.8), background: "#fff", borderRadius: u(0.7), flexShrink: 0 }}>
          <QrCode value={p.link} color="#111111" />
        </div>
        <Label size={1.9} style={{ maxWidth: u(48) }}>Scan for the map, live schedule and to reply</Label>
        <p style={{ fontSize: u(2.2), margin: 0, color: muted }}>{p.linkLabel}</p>
        {p.guest?.seats ? <Label size={1.9} style={{ color: "var(--inv-accent)" }}>Seats reserved: {p.guest.seats}</Label> : null}
        {data.rsvp.enabled && data.rsvp.deadline ? <Label size={1.8} style={{ color: muted }}>Kindly reply by {formatLongDate(data.rsvp.deadline)}</Label> : null}
      </div>
    </div>
  );
}

/** Admission ticket with a tear-off stub that carries the QR code. */
function Ticket(p: CardFaceProps) {
  const { data } = p;
  const d = dateParts(data.date);
  const v = (n: number) => `calc(var(--v) * ${n})`;
  const field = (label: string, value: string) => (
    <div style={{ minWidth: 0 }}>
      <p style={{ ...labelFont, fontSize: v(3.4), margin: 0, color: "var(--inv-muted)" }}>{label}</p>
      <p style={{ ...serif, fontSize: v(6.4), margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{value}</p>
    </div>
  );
  return (
    <div style={{ ...fill, ...paper, display: "flex" }}>
      <div style={{ flex: "0 0 74%", display: "flex", flexDirection: "column", minWidth: 0 }}>
        <div style={{ background: "var(--inv-deep)", color: "var(--inv-on-deep)", display: "flex", justifyContent: "space-between", alignItems: "flex-end", padding: `calc(var(--bleed) + ${v(4)}) ${v(8)} ${v(4)} calc(var(--bleed) + ${v(9)})` }}>
          <p style={{ ...labelFont, fontSize: v(3.6), margin: 0 }}>{p.guest ? `Admit ${p.guest.name}` : data.kicker}</p>
          <p style={{ ...labelFont, fontSize: v(3.6), margin: 0, color: "var(--inv-accent)" }}>{d.year}</p>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: `${v(6)} ${v(8)} calc(var(--bleed) + ${v(8)}) calc(var(--bleed) + ${v(9)})`, minWidth: 0 }}>
          <div>
            <h2 style={{ ...namesFont, fontSize: `calc(var(--v) * ${displayNames(data).length > 20 ? 14 : 19} * min(var(--inv-names-scale), 1.1))`, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {data.name1}
              {data.name2 ? <> <span style={{ ...serif, fontStyle: "italic", fontSize: "0.55em", color: "var(--inv-accent)", textTransform: "none" }}>&amp;</span> {data.name2}</> : null}
            </h2>
            <p style={{ ...labelFont, fontSize: v(3.5), margin: `${v(2)} 0 0`, color: "var(--inv-muted)" }}>{data.subline}</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.7fr 1.5fr", gap: v(6), borderTop: "1px solid var(--inv-line)", paddingTop: v(4) }}>
            {field("Date", `${Number(d.day)} ${d.month} ${d.year}`)}
            {field("Time", formatTime(data.time))}
            {field("Place", data.venueName)}
          </div>
        </div>
      </div>
      <div style={{ width: 0, borderLeft: `${v(0.6)} dashed var(--inv-line)`, margin: `calc(var(--bleed) + ${v(9)}) 0` }} />
      <div style={{ ...column, flex: 1, minWidth: 0, gap: v(2.6), padding: `calc(var(--bleed) + ${v(7)}) calc(var(--bleed) + ${v(6)})` }}>
        <p style={{ ...labelFont, fontSize: v(3.4), margin: 0 }}>{d.weekday}</p>
        <p style={{ ...serif, fontSize: v(20), lineHeight: 0.9, margin: 0, color: "var(--inv-accent)" }}>{d.day}</p>
        <p style={{ ...labelFont, fontSize: v(3.4), margin: 0 }}>{d.month}</p>
        <div style={{ width: v(26), flexShrink: 0 }}><QrCode value={p.link} color="var(--inv-ink)" /></div>
      </div>
    </div>
  );
}

const fronts: Record<CardLayoutId, (p: CardFaceProps) => ReactNode> = {
  frame: Frame,
  arch: Arch,
  band: Band,
  seal: Seal,
  lamp: Lamp,
  margin: Margin,
  poster: Poster,
  photo: Photo,
  ola: Ola,
  shaped: Shaped,
  ticket: Ticket,
};

/**
 * One face of an image card or printed card. Drawn in plain HTML and CSS at a
 * fixed size, so it can be previewed in the page and exported as a picture.
 */
export function CardFace(props: CardFaceProps) {
  const { data, layout, side = "front", width, height, bleed = 0 } = props;
  const Front = fronts[layout] ?? Frame;
  const style = {
    ...themeVars(data.theme),
    width,
    height,
    position: "relative",
    overflow: "hidden",
    containerType: "size",
    ["--bleed" as string]: `${bleed}px`,
    background: "var(--inv-bg)",
    lineHeight: 1.4,
  } as CSSProperties;
  const inner = {
    position: "absolute",
    inset: 0,
    ["--u" as string]: "min(1cqw, 0.74cqh)",
    ["--v" as string]: "1cqh",
  } as CSSProperties;
  return (
    <div className="inv-shell" style={style} data-card-face={side}>
      <div style={inner}>
        {side === "back" ? (
          // Cards cut to a narrow silhouette get the short back. Straight and long cards have room for the full one.
          props.shape && !["rect", "plaque", "pill", "ticket"].includes(props.shape) ? <ShapedBack {...props} /> : <Back {...props} />
        ) : (
          <Front {...props} />
        )}
      </div>
    </div>
  );
}
