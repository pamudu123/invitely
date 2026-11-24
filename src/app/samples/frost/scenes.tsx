"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { lives } from "../_parts/content";
import { GEmblem } from "../_parts/GEmblem";
import { gOpenings } from "../_parts/global";

interface Flake { x: number; y: number; vx: number; vy: number; r: number; w: number }

/** Snow that swirls inside a round glass. Call the returned shake() to stir it up. */
function useSnow(count: number) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const flakes = useRef<Flake[]>([]);
  const shake = useCallback((power = 1, dx = 0) => {
    for (const f of flakes.current) {
      f.vx += (Math.random() - 0.5) * 0.05 * power + dx;
      f.vy -= Math.random() * 0.045 * power;
    }
  }, []);
  useEffect(() => {
    const cv = ref.current;
    const ctx = cv?.getContext("2d");
    if (!cv || !ctx || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const n = 600;
    cv.width = n;
    cv.height = n;
    flakes.current = Array.from({ length: count }, () => ({ x: (Math.random() - 0.5) * 1.7, y: Math.random() * 1.5 - 1, vx: 0, vy: 0, r: 1.6 + Math.random() * 3.6, w: Math.random() * 6.28 }));
    let raf = 0;
    const tick = () => {
      ctx.clearRect(0, 0, n, n);
      ctx.fillStyle = "#fff";
      for (const f of flakes.current) {
        f.w += 0.03;
        f.vx = f.vx * 0.975 + Math.sin(f.w) * 0.00012;
        f.vy = f.vy * 0.975 + 0.00012 + f.r * 0.00002;
        f.x += f.vx;
        f.y += f.vy;
        const d = Math.hypot(f.x, f.y);
        if (d > 0.95) {
          f.x *= 0.95 / d;
          f.y *= 0.95 / d;
          f.vx *= -0.4;
          f.vy *= -0.3;
        }
        if (f.y > 0.66) {
          f.y = 0.66;
          f.vy = 0;
          f.vx *= 0.6;
          if (Math.random() < 0.004) {
            f.y = -0.9;
            f.x = (Math.random() - 0.5) * 0.8;
          }
        }
        ctx.globalAlpha = 0.65 + f.r * 0.08;
        ctx.beginPath();
        ctx.arc((f.x * 0.5 + 0.5) * n, (f.y * 0.5 + 0.5) * n, f.r, 0, 6.2832);
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [count]);
  return { ref, shake };
}

const pine = (x: number, y: number, s: number, c = "#1F7A8C") => (
  <g key={`${x}-${y}`} transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-5 0h10v14h-10z" fill="#3B4A7A" />
    <path d="M0 -92L30 -44H16L38 -14H20L44 4H-44L-20 -14H-38L-16 -44H-30Z" fill={c} />
    <path d="M0 -92L30 -44H16L4 -56L-8 -44H-30ZM-38 -14L-20 -40L-4 -24L10 -38L38 -14H20L4 -26L-10 -14Z" fill="#fff" opacity="0.92" />
  </g>
);

export function IcePalace() {
  const tower = (x: number, w: number, h: number, t: number, c: string) => (
    <g key={x}>
      <path d={`M${x - w / 2} 0V${-h}h${w}V0z`} fill={c} />
      <path d={`M${x - w / 2 - 5} ${-h}L${x} ${-h - t}L${x + w / 2 + 5} ${-h}z`} fill="#4B6BFF" />
      <path d={`M${x} ${-h - t}L${x + w / 2 + 5} ${-h}H${x}z`} fill="#2F49D9" />
      <path d={`M${x} ${-h - t}v-16`} stroke="#F3F9FF" strokeWidth="3" />
      <path d={`M${x} ${-h - t - 16}l16 5-16 6z`} fill="#8F7BFF" />
      <path d={`M${x - 6} ${-h + 34}v-14a6 6 0 0 1 12 0v14z`} fill="#FFE9A8" />
      {h > 100 ? <path d={`M${x - 6} ${-h + 74}v-14a6 6 0 0 1 12 0v14z`} fill="#FFE9A8" /> : null}
    </g>
  );
  return (
    <g>
      {tower(-96, 34, 92, 48, "#CFE4FF")}
      {tower(96, 34, 92, 48, "#CFE4FF")}
      {tower(-54, 40, 132, 62, "#E4F1FF")}
      {tower(54, 40, 132, 62, "#E4F1FF")}
      <path d="M-110 0V-64H110V0z" fill="#F3F9FF" />
      <path d="M-110 -64h14v-12h14v12h14v-12h14v12h14v-12h14v12h14v-12h14v12h14v-12h14v12h14v-12h14v12h14v-12h14v12h14v-12h10v12" fill="#F3F9FF" />
      {tower(0, 52, 168, 84, "#FFFFFF")}
      <path d="M-18 0v-36a18 18 0 0 1 36 0V0z" fill="#4B6BFF" />
      <path d="M0 -54V0" stroke="#CFE4FF" strokeWidth="3" />
      {[-78, -44, 44, 78].map((x) => <path key={x} d={`M${x - 6} -22v-14a6 6 0 0 1 12 0v14z`} fill="#FFE9A8" />)}
    </g>
  );
}

export function GlobeHero() {
  const { ref, shake } = useSnow(170);
  const [jolt, setJolt] = useState(0);
  const last = useRef<number | null>(null);
  useEffect(() => {
    const t = window.setTimeout(() => shake(1.2), 600);
    return () => window.clearTimeout(t);
  }, [shake]);
  return (
    <section className="fr-hero">
      <div className="fr-aurora"><i /><i /><i /></div>
      <div className="fr-stars" />
      <svg viewBox="0 0 1600 420" preserveAspectRatio="xMidYMax slice" className="fr-peaks" aria-hidden="true">
        <path d="M0 420V250L150 120L260 220L400 60L560 230L700 130L860 260L1010 90L1180 240L1330 110L1460 220L1600 130V420Z" fill="#3E63E8" />
        <path d="M400 60L470 135L430 125L405 160L372 118L340 130ZM1010 90L1080 152L1040 148L1014 176L980 146L955 156ZM150 120L200 166L168 160L148 184L118 154ZM1330 110L1380 152L1346 150L1328 172L1296 148Z" fill="#E8F6FF" />
        <path d="M0 420V330C200 260 360 320 560 300C780 270 900 330 1120 300C1300 280 1460 320 1600 290V420Z" fill="#BFE6FF" />
        <path d="M0 420V372C260 330 520 380 800 360C1080 340 1340 380 1600 350V420Z" fill="#FFFFFF" />
        {pine(90, 352, 1)}{pine(170, 366, 0.8)}{pine(250, 346, 0.7, "#2A9AA6")}{pine(1390, 350, 0.9)}{pine(1470, 366, 1.1)}{pine(1550, 344, 0.8, "#2A9AA6")}
      </svg>
      <div className="fr-copy">
        <h1>Invitations that open like a <em>ceremony</em></h1>
        <p>Your guests break the seal, draw the curtains or open the doors, and your day comes alive.</p>
        <div className="fr-actions">
          <Link href="/templates" className="cl-btn">Start designing free <ArrowRight size={18} /></Link>
          <button type="button" className="cl-btn cl-btn-2" onClick={() => { shake(1.6); setJolt((j) => j + 1); }}>Shake the globe</button>
        </div>
      </div>
      <button
        type="button"
        className="fr-globe"
        aria-label="Shake the snow globe"
        onClick={() => { shake(1.6); setJolt((j) => j + 1); }}
        onPointerMove={(e) => {
          if (last.current !== null) shake(0.05, (e.clientX - last.current) * 0.00028);
          last.current = e.clientX;
        }}
        onPointerLeave={() => { last.current = null; }}
      >
        <span key={jolt} className={jolt ? "fr-jolt" : undefined}>
          <span className="fr-ball">
            <svg viewBox="-200 -200 400 400" aria-hidden="true">
              <defs><linearGradient id="fr-in" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2746E0" /><stop offset="0.55" stopColor="#5FA8FF" /><stop offset="1" stopColor="#C8F4FF" /></linearGradient></defs>
              <path d="M-200 -200h400v400h-400z" fill="url(#fr-in)" />
              <circle cx="84" cy="-104" r="34" fill="#F6FBFF" />
              <path d="M-200 110C-120 60 -60 100 0 84C80 66 130 100 200 78V200H-200Z" fill="#9FD4FF" />
              <g transform="translate(0 128)"><IcePalace /></g>
              {pine(-146, 132, 0.8)}{pine(146, 132, 0.8)}{pine(-176, 146, 0.62, "#2A9AA6")}{pine(120, 148, 0.56, "#2A9AA6")}{pine(-118, 150, 0.5, "#2A9AA6")}
              <path d="M-200 136C-100 112 100 112 200 136V200H-200Z" fill="#FFFFFF" />
            </svg>
            <canvas ref={ref} aria-hidden="true" />
            <span className="fr-shine" />
          </span>
          <svg viewBox="-220 0 440 130" className="fr-base" aria-hidden="true">
            <defs><linearGradient id="fr-silver" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#8FA3D6" /><stop offset="0.3" stopColor="#FFFFFF" /><stop offset="0.55" stopColor="#C3D0F0" /><stop offset="0.8" stopColor="#F6F9FF" /><stop offset="1" stopColor="#7F92C8" /></linearGradient></defs>
            <path d="M-150 0h300l16 34h-332z" fill="url(#fr-silver)" />
            <path d="M-166 34h332v16h-332z" fill="#6E83C4" />
            <path d="M-172 50h344l26 54h-396z" fill="url(#fr-silver)" />
            <path d="M-206 104h412v22h-412z" fill="#7A8ECC" />
            {Array.from({ length: 9 }, (_, i) => <path key={i} d="M0 -13L4 -4L13 0L4 4L0 13L-4 4L-13 0L-4 -4Z" transform={`translate(${(i - 4) * 36} 77)`} fill="#4B6BFF" />)}
          </svg>
        </span>
      </button>
    </section>
  );
}

const pane: { bg: string; e1: string; e2: string }[] = [
  { bg: "#2F49D9", e1: "#8F7BFF", e2: "#4A34C4" },
  { bg: "#5B3FD6", e1: "#37C6E0", e2: "#11799A" },
  { bg: "#0E8FA8", e1: "#3E63E8", e2: "#20309C" },
  { bg: "#7ADCEB", e1: "#5B3FD6", e2: "#35209A" },
  { bg: "#A99BFF", e1: "#2F49D9", e2: "#37C6E0" },
  { bg: "#1FB5A0", e1: "#4B6BFF", e2: "#20309C" },
  { bg: "#163A9E", e1: "#8F7BFF", e2: "#4A34C4" },
];

/** Openings under frost. Breathe on a pane (hover, focus or tap) to clear it. */
export function FrostPanes() {
  const [on, setOn] = useState<number | null>(0);
  return (
    <ul className="fr-panes">
      {gOpenings.map((o, i) => (
        <li key={o.id}>
          <button type="button" aria-pressed={on === i} onClick={() => setOn(i)} onPointerEnter={(e) => e.pointerType === "mouse" && setOn(i)} style={{ background: pane[i].bg, "--e1": pane[i].e1, "--e2": pane[i].e2, "--g1": "#E8F2FF", "--g2": "#8FA3D6", "--l": "#FFFFFF" } as CSSProperties}>
            <GEmblem id={o.id} />
            <span className="fr-frost" />
            <span className="fr-label">{o.label}</span>
          </button>
          <p>{o.text}</p>
        </li>
      ))}
      <li className="fr-panes-end">
        <p>Breathe on a pane to clear the frost.</p>
        <Link href="/templates" className="cl-link">Try them live <ArrowRight size={16} /></Link>
      </li>
    </ul>
  );
}

export function ThreeGlobes() {
  return (
    <div className="fr-three">
      {lives.map((x, i) => (
        <article key={x.tag}>
          <div className={`fr-mini fr-mini-${i}`}>
            <svg viewBox="-200 -200 400 400" aria-hidden="true">
              {i === 2 ? (
                <>
                  <path d="M-200 -90C-120 -150 -60 -40 20 -96C90 -146 140 -70 200 -110V-40C140 -10 90 -80 20 -34C-60 16 -120 -80 -200 -30Z" fill="#5FF0C8" opacity="0.75" />
                  <path d="M-200 -130C-120 -180 -60 -90 20 -136C90 -176 140 -120 200 -150V-112C140 -76 90 -130 20 -90C-60 -46 -120 -126 -200 -86Z" fill="#B79BFF" opacity="0.8" />
                </>
              ) : (
                <circle cx={i ? 60 : -80} cy={i ? -96 : 30} r={i ? 44 : 60} fill={i ? "#FFF6D0" : "#FFE0EE"} />
              )}
              <path d="M-200 100C-120 60 -60 96 0 80C80 62 130 96 200 74V200H-200Z" fill={["#C9B8FF", "#9FDCFF", "#274BC4"][i]} />
              <g transform="translate(0 128) scale(0.86)"><IcePalace /></g>
              {pine(-130, 134, 0.7)}{pine(132, 134, 0.74)}
              <path d="M-200 132C-100 110 100 110 200 132V200H-200Z" fill={i === 2 ? "#B8D4FF" : "#fff"} />
            </svg>
          </div>
          <small>{x.tag}</small>
          <h3>{x.title}</h3>
          <p>{x.text}</p>
        </article>
      ))}
    </div>
  );
}
