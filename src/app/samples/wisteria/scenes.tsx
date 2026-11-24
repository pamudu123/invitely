"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { lives } from "../_parts/content";
import { GEmblem } from "../_parts/GEmblem";
import { gOpenings } from "../_parts/global";
import { burstFrom, useScrollVar } from "../_parts/hooks";

const hues = [
  ["#8F6BFF", "#B79BFF", "#E3D6FF"],
  ["#6A7BFF", "#97A6FF", "#D9E0FF"],
  ["#A87BF5", "#CBA8FF", "#F0E2FF"],
  ["#7A5CE8", "#A48BFA", "#DCD0FF"],
];

/** A hanging raceme, wide at the top and tapering to a point. */
export function Raceme({ len = 14, hue = 0, className, style }: { len?: number; hue?: number; className?: string; style?: CSSProperties }) {
  const c = hues[hue % hues.length];
  const h = len * 20 + 44;
  return (
    <svg viewBox={`-60 0 120 ${h}`} className={className} style={style} aria-hidden="true">
      <path d={`M0 0C6 ${h * 0.3} -6 ${h * 0.6} 0 ${h - 20}`} stroke="#3F9A6C" strokeWidth="4" fill="none" />
      {Array.from({ length: len }, (_, r) => {
        const t = r / (len - 1);
        const w = 46 * Math.pow(1 - t, 0.62) + 3;
        const n = Math.max(1, Math.round(5 * (1 - t) + 1));
        return Array.from({ length: n }, (_, k) => {
          const x = n === 1 ? 0 : -w + (2 * w * k) / (n - 1);
          const s = 1.12 - t * 0.42;
          const shade = c[(r + k) % 3];
          return (
            <g key={`${r}-${k}`} transform={`translate(${(x + (r % 2 ? 5 : -5)).toFixed(1)} ${(16 + r * 20 + Math.abs(x) * -0.16).toFixed(1)}) scale(${s.toFixed(2)}) rotate(${(x * 0.5).toFixed(0)})`}>
              <path d="M0 -12C13 -18 22 -5 12 6C8 14 -8 14 -12 6C-22 -5 -13 -18 0 -12Z" fill={shade} />
              <path d="M-9 4C-5 -3 5 -3 9 4C6 14 -6 14 -9 4Z" fill={c[2]} />
              <circle cy="2" r="2.600" fill="#FFF3B8" />
            </g>
          );
        });
      })}
    </svg>
  );
}

const leaf = (x: number, y: number, r: number, s = 1, c = "#2FA36B") => (
  <g key={`${x}-${y}-${r}`} transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
    {[-40, -14, 14, 40].map((k, i) => (
      <path key={k} d="M0 0C12 -10 34 -12 48 0C34 12 12 10 0 0Z" transform={`translate(${Math.abs(k) * -0.2 + 10} ${k * 0.5}) rotate(${k * 0.8})`} fill={i % 2 ? c : "#54C08A"} />
    ))}
  </g>
);

function Vine() {
  return (
    <svg viewBox="0 0 1600 150" preserveAspectRatio="xMidYMin slice" className="wi-vine" aria-hidden="true">
      <path d="M-20 40C200 -10 380 80 600 34S1000 -14 1200 44S1500 20 1640 50" fill="none" stroke="#6B5A4A" strokeWidth="16" strokeLinecap="round" />
      <path d="M-20 70C240 110 420 20 700 66S1150 90 1640 30" fill="none" stroke="#857060" strokeWidth="9" strokeLinecap="round" />
      {Array.from({ length: 26 }, (_, i) => leaf(20 + i * 63, 34 + ((i * 37) % 46), (i * 71) % 180 - 40, 0.8 + (i % 4) * 0.16, i % 2 ? "#2FA36B" : "#1E8A72"))}
    </svg>
  );
}

/** White garden pavilion on a lake. */
export function Pavilion({ className }: { className?: string }) {
  return (
    <svg viewBox="-260 -330 520 400" className={className} aria-hidden="true">
      <path d="M-150 -160C-150 -250 -80 -290 0 -290C80 -290 150 -250 150 -160Z" fill="#8FE0D0" />
      <path d="M0 -290C-34 -262 -56 -212 -56 -160H56C56 -212 34 -262 0 -290ZM-104 -262C-124 -232 -132 -196 -132 -160M104 -262C124 -232 132 -196 132 -160" fill="#BDF2E6" stroke="#FFFFFF" strokeWidth="4" />
      <path d="M0 -290V-316M0 -326a9 9 0 1 1 .1 0" stroke="#FFFFFF" strokeWidth="6" fill="#FFF3B8" />
      <path d="M-172 -160h344v18h-344z" fill="#FFFFFF" />
      <path d="M-160 -142h320v10h-320z" fill="#C9C2FF" />
      {[-146, -92, 92, 146].map((x) => (
        <g key={x}>
          <path d={`M${x - 10} -132h20v150h-20z`} fill="#FFFFFF" />
          <path d={`M${x - 3} -132v150`} stroke="#C9C2FF" strokeWidth="4" />
          <path d={`M${x - 16} -132h32v-8h-32zM${x - 16} 18h32v-9h-32z`} fill="#F3F0FF" />
        </g>
      ))}
      <path d="M-82 -132C-60 -96 60 -96 82 -132" fill="none" stroke="#A48BFA" strokeWidth="9" strokeDasharray="0 13" strokeLinecap="round" />
      <path d="M-136 -132C-128 -104 -108 -104 -100 -132M136 -132C128 -104 108 -104 100 -132" fill="none" stroke="#A48BFA" strokeWidth="8" strokeDasharray="0 12" strokeLinecap="round" />
      <path d="M-184 18h368v14h-368zM-210 32h420v14h-420zM-236 46h472v16h-472z" fill="#FFFFFF" />
      <path d="M-210 46h420M-236 62h472" stroke="#C9C2FF" strokeWidth="4" />
    </svg>
  );
}

const hang = Array.from({ length: 22 }, (_, i) => ({ x: (i / 21) * 100, len: 9 + ((i * 7) % 9), hue: i % 4, w: 6.4 + ((i * 5) % 4), d: -((i * 13) % 10) * 0.4 }));

export function VeilHero() {
  const ref = useRef<HTMLElement | null>(null);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setOpen(true), 800);
    return () => window.clearTimeout(t);
  }, []);
  useScrollVar(ref);
  return (
    <section ref={ref} className="wi-hero" data-open={open || undefined}>
      <div className="wi-stage">
        <div className="wi-sun" />
        <svg viewBox="0 0 1600 520" preserveAspectRatio="xMidYMax slice" className="wi-land" aria-hidden="true">
          <path d="M0 220C160 130 320 200 480 160C660 110 760 190 940 160C1120 120 1300 200 1600 130V520H0Z" fill="#A9B8FF" />
          <path d="M0 270C220 200 420 260 640 236C880 210 1080 260 1300 230C1420 216 1520 230 1600 216V520H0Z" fill="#7FD3C4" />
          <path d="M0 318C300 290 560 330 800 316C1080 300 1340 330 1600 304V520H0Z" fill="#4FB8E0" />
          <g stroke="#E8FBFF" strokeWidth="4" strokeLinecap="round" opacity="0.75"><path d="M200 360h180M470 388h120M980 356h210M1250 396h150M640 440h330M300 470h160M1100 466h200" /></g>
        </svg>
        <Pavilion className="wi-pav" />
        <svg viewBox="0 0 1600 200" preserveAspectRatio="xMidYMax slice" className="wi-bank" aria-hidden="true">
          <path d="M0 200V120C200 70 400 130 620 120C700 116 720 150 800 150S900 116 980 120C1200 130 1400 70 1600 120V200Z" fill="#1E8A72" />
          {Array.from({ length: 34 }, (_, i) => {
            const x = i < 17 ? 10 + i * 36 : 980 + (i - 17) * 36;
            const c = hues[i % 4];
            return <g key={i} transform={`translate(${x} ${128 + ((i * 31) % 40)})`}><path d="M0 34V0" stroke="#54C08A" strokeWidth="4" /><circle r="15" cy="-8" fill={c[0]} /><circle r="10" cy="-11" cx="-4" fill={c[1]} /><circle r="5" cy="-13" fill={c[2]} /></g>;
          })}
        </svg>
        <div className="wi-copy">
          <h1>Invitations that open like a <em>ceremony</em></h1>
          <p>Your guests break the seal, part the curtains or open the doors, and step into your day.</p>
          <div className="wi-actions">
            <Link href="/templates" className="cl-btn">Start designing free <ArrowRight size={18} /></Link>
            <button type="button" className="cl-btn cl-btn-2" onClick={(e) => { burstFrom(e.currentTarget, 40); setOpen((o) => !o); }}>{open ? "Close the flowers" : "Part the flowers"}</button>
          </div>
        </div>
        <div className="wi-veil" aria-hidden="true">
          {hang.map((f, i) => (
            <Raceme
              key={i}
              len={f.len}
              hue={f.hue}
              className="wi-rac"
              style={{ left: `${f.x}%`, width: `${f.w}vw`, "--dir": f.x < 50 ? -1 : 1, "--far": Math.abs(f.x - 50) / 50, animationDelay: `${f.d}s` } as CSSProperties}
            />
          ))}
        </div>
        <Vine />
        <div className="wi-fade" />
      </div>
    </section>
  );
}

const glass: { bg: string; ink: string; e1: string; e2: string }[] = [
  { bg: "#8F6BFF", ink: "#FFFFFF", e1: "#1E8A72", e2: "#0E5A4A" },
  { bg: "#8FE0D0", ink: "#0A3F3A", e1: "#6A4FE0", e2: "#3A25A0" },
  { bg: "#6A7BFF", ink: "#FFFFFF", e1: "#2FA36B", e2: "#17694A" },
  { bg: "#CBA8FF", ink: "#2A1470", e1: "#2F7BE8", e2: "#1B479E" },
  { bg: "#7FC8F5", ink: "#0A2F6E", e1: "#8F4FE0", e2: "#4FB8A0" },
  { bg: "#2F9E8A", ink: "#FFFFFF", e1: "#6A4FE0", e2: "#3A25A0" },
  { bg: "#5B4FD0", ink: "#FFFFFF", e1: "#8FE0D0", e2: "#2F9E8A" },
];

/** A glasshouse wall. The chosen pane opens wide. */
export function Glasshouse() {
  const [i, setI] = useState(0);
  return (
    <div className="wi-house">
      {gOpenings.map((o, n) => (
        <div key={o.id} className="wi-pane" data-on={n === i || undefined} style={{ background: glass[n].bg, color: glass[n].ink, "--e1": glass[n].e1, "--e2": glass[n].e2, "--g1": "#FFF3C9", "--g2": "#C9A552" } as CSSProperties}>
          <button type="button" aria-expanded={n === i} onClick={() => setI(n)} onPointerEnter={(e) => e.pointerType === "mouse" && setI(n)}>
            <GEmblem id={o.id} />
            <span>{o.label}</span>
          </button>
          <div className="wi-pane-text">
            <p>{o.text}</p>
            <Link href={`/demo/${o.template}`} target="_blank" className="cl-link" tabIndex={n === i ? undefined : -1}>Try it live <ArrowRight size={16} /></Link>
          </div>
        </div>
      ))}
    </div>
  );
}

export function Seasons() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setOn(true), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className="wi-seasons" data-on={on || undefined}>
      {lives.map((x, i) => (
        <article key={x.tag}>
          <div className={`wi-arch wi-arch-${i}`}>
            {[0, 1, 2, 3, 4].map((k) => (
              <Raceme key={k} len={[5, 13, 9][i] + (k % 3)} hue={k + i} className="wi-arch-rac" style={{ left: `${k * 22 + 4}%`, "--k": k } as CSSProperties} />
            ))}
            <Pavilion className="wi-arch-pav" />
          </div>
          <small>{x.tag}</small>
          <h3>{x.title}</h3>
          <p>{x.text}</p>
        </article>
      ))}
    </div>
  );
}

export function ClosingVeil() {
  return (
    <div className="wi-closing" aria-hidden="true">
      {Array.from({ length: 18 }, (_, i) => (
        <Raceme key={i} len={6 + ((i * 5) % 8) + (i < 4 || i > 13 ? 6 : 0)} hue={i % 4} className="wi-rac wi-rac-still" style={{ left: `${(i / 17) * 100}%`, width: `${5.4 + (i % 3)}vw`, animationDelay: `${-i * 0.5}s` }} />
      ))}
      <Vine />
    </div>
  );
}
