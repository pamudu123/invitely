"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { lives } from "../_parts/content";
import { GEmblem } from "../_parts/GEmblem";
import { gOpenings } from "../_parts/global";
import { burstFrom, useScrollVar } from "../_parts/hooks";

/** Scalloped outline of one shell valve, hinged at 0,0 and opening upwards. */
const SHELL = (() => {
  const n = 11;
  const R = 250;
  let d = "M-34 0";
  for (let i = 0; i < n; i++) {
    const a0 = Math.PI + (Math.PI * (0.07 + (0.86 * i) / n));
    const a1 = Math.PI + (Math.PI * (0.07 + (0.86 * (i + 1)) / n));
    const am = (a0 + a1) / 2;
    const p = (a: number, r: number) => `${(Math.cos(a) * r * 1.08).toFixed(1)} ${(Math.sin(a) * r).toFixed(1)}`;
    if (i === 0) d += `L${p(a0, R)}`;
    d += `Q${p(am, R * 1.13)} ${p(a1, R)}`;
  }
  return `${d}L34 0Q0 18 -34 0Z`;
})();

const ribs = Array.from({ length: 10 }, (_, i) => {
  const a = Math.PI + Math.PI * (0.07 + (0.86 * (i + 1)) / 11);
  return `M${(Math.cos(a) * 30).toFixed(1)} ${(Math.sin(a) * 20).toFixed(1)}L${(Math.cos(a) * 268).toFixed(1)} ${(Math.sin(a) * 248).toFixed(1)}`;
}).join("");

export function Shell({ open, id, pearl = true }: { open: boolean; id: string; pearl?: boolean }) {
  return (
    <svg viewBox="-300 -330 600 520" className="pl-shell-svg" data-open={open || undefined} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-in`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FDEBFF" />
          <stop offset="0.35" stopColor="#C9D6FF" />
          <stop offset="0.65" stopColor="#B8F5EC" />
          <stop offset="1" stopColor="#E3CCFF" />
        </linearGradient>
        <linearGradient id={`${id}-out`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7FE9E0" />
          <stop offset="0.5" stopColor="#3FB6E8" />
          <stop offset="1" stopColor="#5B6BF0" />
        </linearGradient>
        <radialGradient id={`${id}-p`} cx="0.36" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="0.4" stopColor="#F4ECFF" />
          <stop offset="0.72" stopColor="#C6CDF8" />
          <stop offset="1" stopColor="#8FB7E8" />
        </radialGradient>
      </defs>
      <g className="pl-top">
        <path d={SHELL} fill={`url(#${id}-in)`} stroke="#FFFFFF" strokeWidth="5" />
        <path d={ribs} stroke="#FFFFFF" strokeWidth="5" opacity="0.75" />
      </g>
      <g transform="translate(0 4) scale(1 -0.46)">
        <path d={SHELL} fill={`url(#${id}-in)`} stroke="#FFFFFF" strokeWidth="5" />
      </g>
      {pearl ? (
        <g className="pl-pearl">
          <circle cy="-34" r="96" fill="#FFFFFF" opacity="0.18" />
          <circle cy="-34" r="66" fill={`url(#${id}-p)`} />
          <ellipse cx="-22" cy="-60" rx="18" ry="12" fill="#fff" opacity="0.95" />
        </g>
      ) : null}
      <g transform="translate(0 34) scale(1 -0.5)">
        <path d={SHELL} fill={`url(#${id}-out)`} stroke="#E9FFFC" strokeWidth="5" />
        <path d={ribs} stroke="#E9FFFC" strokeWidth="5" opacity="0.6" />
      </g>
      <g className="pl-lid">
        <path d={SHELL} fill={`url(#${id}-out)`} stroke="#E9FFFC" strokeWidth="5" />
        <path d={ribs} stroke="#E9FFFC" strokeWidth="5" opacity="0.6" />
      </g>
    </svg>
  );
}

function Jelly({ className, c, d }: { className: string; c: string; d: string }) {
  return (
    <svg viewBox="-70 -70 140 250" className={className} aria-hidden="true">
      <g className="pl-jelly">
        <path d="M-60 0C-60 -84 60 -84 60 0C48 14 36 -4 24 8C12 18 0 2 -12 12C-24 18 -36 -2 -60 0Z" fill={c} opacity="0.88" />
        <path d="M-42 -8C-40 -54 40 -54 42 -8" fill="none" stroke="#fff" strokeWidth="5" opacity="0.65" />
        {[-34, -14, 8, 30].map((x, i) => (
          <path key={x} d={`M${x} 8C${x - 22} 50 ${x + 24} 84 ${x - 6} ${130 + (i % 2) * 36}`} fill="none" stroke={d} strokeWidth={i % 2 ? 4 : 7} strokeLinecap="round" />
        ))}
      </g>
    </svg>
  );
}

function Fish({ className, c, d }: { className: string; c: string; d: string }) {
  return (
    <svg viewBox="-70 -40 140 80" className={className} aria-hidden="true">
      <path d="M-40 0L-68 -26V26Z" fill={d} />
      <path d="M-48 0C-20 -40 40 -38 62 0C40 38 -20 40 -48 0Z" fill={c} />
      <path d="M-6 -30C8 -10 8 10 -6 30M14 -30C26 -10 26 10 14 30" stroke="#fff" strokeWidth="6" fill="none" opacity="0.8" />
      <circle cx="42" cy="-6" r="6" fill="#062A5E" />
    </svg>
  );
}

export function Reef({ className }: { className?: string }) {
  const coral = (x: number, s: number, c: string) => (
    <g key={x} transform={`translate(${x} 260) scale(${s})`} stroke={c} strokeWidth="15" strokeLinecap="round" fill="none">
      <path d="M0 0V-90M0 -30C-30 -40 -42 -66 -40 -100M0 -54C28 -62 42 -86 40 -124M-30 -62C-52 -66 -62 -80 -62 -96M0 -86C-8 -104 -6 -124 2 -146" />
    </g>
  );
  const fan = (x: number, s: number, c: string) => (
    <g key={x} transform={`translate(${x} 262) scale(${s})`}>
      <path d="M0 0C-92 -30 -104 -126 -60 -160C-30 -184 30 -184 60 -160C104 -126 92 -30 0 0Z" fill={c} />
      {[-40, -20, 0, 20, 40].map((a) => <path key={a} d="M0 0V-160" stroke="#fff" strokeOpacity="0.5" strokeWidth="4" transform={`rotate(${a})`} />)}
    </g>
  );
  const weed = (x: number, h: number, c: string) => <path key={x} d={`M${x} 262C${x - 24} ${262 - h * 0.3} ${x + 24} ${262 - h * 0.6} ${x} ${262 - h}C${x + 34} ${262 - h * 0.6} ${x - 4} ${262 - h * 0.3} ${x + 14} 262Z`} fill={c} />;
  return (
    <svg viewBox="0 0 1600 300" preserveAspectRatio="xMidYMax slice" className={className} aria-hidden="true">
      {weed(60, 180, "#16B89A")}{weed(120, 130, "#0E9A86")}{weed(1500, 190, "#16B89A")}{weed(1440, 140, "#0E9A86")}{weed(560, 110, "#0E9A86")}{weed(1060, 120, "#16B89A")}
      {fan(230, 0.9, "#8F7BFF")}{coral(360, 0.9, "#C9A8FF")}{coral(1250, 1, "#7FE9E0")}{fan(1370, 0.8, "#5B6BF0")}{coral(700, 0.55, "#8F7BFF")}{fan(960, 0.5, "#37C6E0")}
      <path d="M0 250C200 220 420 270 640 250C900 226 1100 272 1320 246C1440 234 1540 244 1600 240V300H0Z" fill="#D8F3F0" />
      <path d="M0 276C260 252 520 290 800 272C1080 256 1340 290 1600 266V300H0Z" fill="#B4E3E4" />
    </svg>
  );
}

export function ShellHero() {
  const ref = useRef<HTMLElement | null>(null);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setOpen(true), 900);
    return () => window.clearTimeout(t);
  }, []);
  useScrollVar(ref);
  return (
    <section ref={ref} className="pl-hero">
      <div className="pl-stage">
        <div className="pl-deep" />
        <div className="pl-rays"><i /><i /><i /><i /></div>
        <Jelly className="pl-j pl-j1" c="#B79BFF" d="#E4D6FF" />
        <Jelly className="pl-j pl-j2" c="#7FE9E0" d="#D6FFF8" />
        <Jelly className="pl-j pl-j3" c="#9FB4FF" d="#E6ECFF" />
        <Fish className="pl-f pl-f1" c="#FFE27A" d="#FFC23D" />
        <Fish className="pl-f pl-f2" c="#C9A8FF" d="#8F7BFF" />
        <Fish className="pl-f pl-f3" c="#A8FFE9" d="#16B89A" />
        <div className="pl-copy">
          <h1>Invitations that open like a <em>ceremony</em></h1>
          <p>Your guests break the seal, draw the curtains or unwrap the gift, and find your day waiting inside.</p>
          <Link href="/templates" className="cl-btn">Start designing free <ArrowRight size={18} /></Link>
        </div>
        <Reef className="pl-reef" />
        <button type="button" className="pl-shell" aria-label={open ? "Close the shell" : "Open the shell"} onClick={(e) => { burstFrom(e.currentTarget, 50); setOpen((o) => !o); }}>
          <Shell open={open} id="plh" />
        </button>
        <div className="pl-veil" />
      </div>
    </section>
  );
}

const pool: { bg: string; e1: string; e2: string }[] = [
  { bg: "#5B6BF0", e1: "#C2438F", e2: "#7A1E66" },
  { bg: "#0E9AA8", e1: "#5B4FE0", e2: "#2E2699" },
  { bg: "#7A5CE8", e1: "#16B89A", e2: "#0A6B60" },
  { bg: "#1FB5A0", e1: "#3B3FD0", e2: "#20227E" },
  { bg: "#2F8BE8", e1: "#8F5BFF", e2: "#FFE27A" },
  { bg: "#0B6FB0", e1: "#16B89A", e2: "#0A6B60" },
  { bg: "#4A3FC4", e1: "#37C6E0", e2: "#11799A" },
];

/** Openings float in bubbles. Pop one to bring it to the front. */
export function Bubbles() {
  const [i, setI] = useState(0);
  const o = gOpenings[i];
  const c = pool[i];
  return (
    <div className="pl-bubbles">
      <div className="pl-big-wrap">
        <div key={o.id} className="pl-big" style={{ background: `radial-gradient(circle at 34% 28%, color-mix(in srgb, ${c.bg} 55%, #fff), ${c.bg} 62%)`, "--e1": c.e1, "--e2": c.e2, "--g1": "#FFEFC2", "--g2": "#C9A552" } as CSSProperties}>
          <GEmblem id={o.id} />
        </div>
      </div>
      <div>
        <h2>Every invitation begins with a gesture</h2>
        <div className="pl-said" aria-live="polite">
          <b>{o.label}</b>
          <p>{o.text}</p>
          <Link href={`/demo/${o.template}`} target="_blank" className="cl-link">Try it live <ArrowRight size={16} /></Link>
        </div>
        <ul>
          {gOpenings.map((x, n) => (
            <li key={x.id} style={{ "--i": n } as CSSProperties}>
              <button
                type="button"
                aria-label={x.label}
                aria-pressed={n === i}
                style={{ background: `radial-gradient(circle at 34% 28%, color-mix(in srgb, ${pool[n].bg} 50%, #fff), ${pool[n].bg} 66%)`, "--e1": pool[n].e1, "--e2": pool[n].e2, "--g1": "#FFEFC2", "--g2": "#C9A552" } as CSSProperties}
                onClick={(e) => { burstFrom(e.currentTarget, 22); setI(n); }}
              >
                <GEmblem id={x.id} />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** Three depths: the surface, the reef and the deep. */
export function Depths() {
  return (
    <section className="pl-depths">
      {lives.map((x, i) => (
        <article key={x.tag} className={`pl-depth pl-depth-${i}`}>
          <svg viewBox="0 0 1600 90" preserveAspectRatio="none" className="pl-wave" aria-hidden="true"><path d="M0 90V40C130 -6 270 -6 400 40S670 86 800 40S1070 -6 1200 40S1470 86 1600 40V90Z" /></svg>
          <div className="cl-wrap">
            <div>
              <small>{x.tag}</small>
              <h2>{x.title}</h2>
              <p>{x.text}</p>
            </div>
            <div className="pl-depth-art">
              {i === 0 ? (
                <svg viewBox="-160 -150 320 260" aria-hidden="true">
                  <path d="M-118 40H118C104 92 58 106 0 106S-104 92 -118 40Z" fill="#4A3FC4" />
                  <path d="M-114 52H114" stroke="#fff" strokeWidth="7" />
                  <path d="M6 34V-138C76 -96 106 -34 108 34Z" fill="#FFFFFF" />
                  <path d="M-8 34V-110C-66 -70 -92 -18 -96 34Z" fill="#B79BFF" />
                </svg>
              ) : i === 1 ? (
                <>
                  <Fish className="pl-school pl-s1" c="#FFE27A" d="#FFC23D" />
                  <Fish className="pl-school pl-s2" c="#C9A8FF" d="#8F7BFF" />
                  <Fish className="pl-school pl-s3" c="#FFFFFF" d="#A8FFE9" />
                  <Fish className="pl-school pl-s4" c="#FFE27A" d="#FFC23D" />
                </>
              ) : (
                <Shell open id="pld" />
              )}
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
