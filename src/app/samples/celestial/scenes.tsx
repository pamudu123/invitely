"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { lives } from "../_parts/content";
import { GEmblem } from "../_parts/GEmblem";
import { gOpenings } from "../_parts/global";
import { burst } from "../_parts/hooks";

const star = (r: number) => `M0 ${-r}Q0 0 ${r} 0Q0 0 0 ${r}Q0 0 ${-r} 0Q0 0 0 ${-r}Z`;

export function Stars({ n = 90, className }: { n?: number; className?: string }) {
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden="true">
      {Array.from({ length: n }, (_, i) => {
        const x = (i * 397 + 61) % 1600;
        const y = (i * 211 + 37) % 900;
        const big = i % 9 === 0;
        return big ? (
          <path key={i} d={star(9 + (i % 4) * 3)} transform={`translate(${x} ${y})`} fill={i % 2 ? "#BFF3FF" : "#FFFFFF"} className="ce-tw" style={{ animationDelay: `${-(i % 7) * 0.6}s` }} />
        ) : (
          <circle key={i} cx={x} cy={y} r={1 + (i % 3) * 0.8} fill={i % 5 ? "#FFFFFF" : "#C9B8FF"} className="ce-tw" style={{ animationDelay: `${-(i % 11) * 0.4}s` }} />
        );
      })}
    </svg>
  );
}

function Constellation({ pts, close, className, delay = 0 }: { pts: [number, number][]; close?: boolean; className: string; delay?: number }) {
  const d = `M${pts.map((p) => p.join(" ")).join("L")}${close ? "Z" : ""}`;
  return (
    <svg viewBox="0 0 300 300" className={className} aria-hidden="true">
      <path d={d} pathLength={1} className="ce-line" style={{ animationDelay: `${delay}s` }} />
      {pts.map(([x, y], i) => <path key={i} d={star(i % 2 ? 15 : 20)} transform={`translate(${x} ${y})`} fill="#fff" className="ce-tw" style={{ animationDelay: `${-i * 0.4}s` }} />)}
    </svg>
  );
}

export function Moon({ className }: { className?: string }) {
  return (
    <svg viewBox="-400 -400 800 800" className={className} aria-hidden="true">
      <defs>
        <radialGradient id="ce-moon" cx="0.4" cy="0.28" r="0.85">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="0.5" stopColor="#E4EAFF" />
          <stop offset="1" stopColor="#9FB0F5" />
        </radialGradient>
      </defs>
      <circle r="396" fill="url(#ce-moon)" />
      {[[-150, -170, 72], [90, -240, 46], [190, -60, 84], [-40, -20, 52], [-240, 30, 44], [40, 130, 92], [250, 130, 40], [-150, 190, 64], [-20, -330, 30], [-300, -110, 28], [300, -170, 26]].map(([x, y, r], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          <circle r={r} fill="#B9C6F7" opacity="0.65" />
          <path d={`M${-r} 0A${r} ${r} 0 0 1 ${r * 0.7} ${-r * 0.7}A${r * 1.12} ${r * 1.12} 0 0 0 ${-r} 0Z`} fill="#8C9CE8" opacity="0.55" />
        </g>
      ))}
    </svg>
  );
}

const heart: [number, number][] = [[150, 250], [70, 176], [40, 110], [66, 56], [118, 54], [150, 96], [182, 54], [234, 56], [260, 110], [230, 176]];
const crown: [number, number][] = [[50, 226], [36, 104], [100, 156], [150, 66], [200, 156], [264, 104], [250, 226]];

/** Tap the sky to draw your own constellation. */
export function SkyHero() {
  const [pts, setPts] = useState<[number, number][]>([]);
  const ref = useRef<HTMLElement | null>(null);
  return (
    <section
      ref={ref}
      className="ce-hero"
      onPointerMove={(e) => ref.current?.style.setProperty("--mx", ((e.clientX / window.innerWidth - 0.5) * 2).toFixed(3))}
      onClick={(e) => {
        if ((e.target as Element).closest("a, button") || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        const p: [number, number] = [Math.round(e.clientX - r.left), Math.round(e.clientY - r.top)];
        setPts((x) => (x.length >= 12 ? [p] : [...x, p]));
        burst(e.clientX, e.clientY, 10);
      }}
    >
      <Stars className="ce-stars" />
      <div className="ce-milky" />
      <div className="ce-shoot"><i /><i /><i /></div>
      <Constellation pts={heart} close className="ce-con ce-con-l" delay={0.4} />
      <Constellation pts={crown} close className="ce-con ce-con-r" delay={0.9} />
      <div className="ce-moonwrap">
        <div className="ce-orbit ce-o1"><i /></div>
        <div className="ce-orbit ce-o2"><i /></div>
        <div className="ce-orbit ce-o3"><i /></div>
        <Moon className="ce-moon" />
      </div>
      <svg className="ce-draw" aria-hidden="true">
        {pts.length > 1 ? <path d={`M${pts.map((p) => p.join(" ")).join("L")}`} className="ce-mine" /> : null}
        {pts.map(([x, y], i) => <g key={`${x}-${y}-${i}`} transform={`translate(${x} ${y})`}><path d={star(16)} fill="#fff" className="ce-pop" /></g>)}
      </svg>
      <div className="ce-copy">
        <h1>Invitations that open like a <em>ceremony</em></h1>
        <p>Your guests break the seal, draw the curtains or open the doors, and the stars line up for your day.</p>
        <div className="ce-actions">
          <Link href="/templates" className="cl-btn">Start designing free <ArrowRight size={18} /></Link>
          {pts.length ? <button type="button" className="cl-btn cl-btn-2" onClick={() => setPts([])}>Clear my stars</button> : null}
        </div>
      </div>
      <p className="ce-hint">Tap the sky to draw your own constellation</p>
    </section>
  );
}

const worlds: { bg: string; e1: string; e2: string }[] = [
  { bg: "#7D6BFF", e1: "#2B2FC4", e2: "#171A80" },
  { bg: "#2FA8E8", e1: "#4A3FD6", e2: "#2A2090" },
  { bg: "#4B5BFF", e1: "#7DE3FF", e2: "#2F9BD6" },
  { bg: "#38D6D0", e1: "#3B3FE0", e2: "#1F2190" },
  { bg: "#A98BFF", e1: "#2F6BFF", e2: "#38D6D0" },
  { bg: "#1F7AF0", e1: "#6A4FF0", e2: "#3A25A8" },
  { bg: "#C9D2FF", e1: "#3B3FE0", e2: "#1F2190" },
];

/** Openings as planets on one orbit. Choosing one brings it round to the front. */
export function Orbit() {
  const [i, setI] = useState(0);
  const [turn, setTurn] = useState(0);
  const n = gOpenings.length;
  const step = 360 / n;
  const pick = (k: number) => {
    let diff = (((k - i) % n) + n) % n;
    if (diff > n / 2) diff -= n;
    setTurn((t) => t - diff * step);
    setI(k);
  };
  const o = gOpenings[i];
  return (
    <div className="ce-sys">
      <div className="ce-ring" style={{ "--turn": `${turn}deg` } as CSSProperties}>
        {gOpenings.map((x, k) => (
          <button
            key={x.id}
            type="button"
            className="ce-planet"
            aria-label={x.label}
            aria-pressed={k === i}
            onClick={() => pick(k)}
            style={{ "--at": `${k * step + 90}deg`, background: `radial-gradient(circle at 34% 28%, color-mix(in srgb, ${worlds[k].bg} 45%, #fff), ${worlds[k].bg} 60%)`, "--e1": worlds[k].e1, "--e2": worlds[k].e2, "--g1": "#FFF3C9", "--g2": "#C7A95C" } as CSSProperties}
          >
            <GEmblem id={x.id} />
          </button>
        ))}
      </div>
      <div className="ce-said" aria-live="polite" key={o.id}>
        <h3>{o.label}</h3>
        <p>{o.text}</p>
        <Link href={`/demo/${o.template}`} target="_blank" className="cl-link">Try it live <ArrowRight size={16} /></Link>
      </div>
    </div>
  );
}

/** Crescent, full and waning moons. */
export function Phases() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setOn(true), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className="ce-phases" data-on={on || undefined}>
      {lives.map((x, i) => (
        <article key={x.tag}>
          <div className={`ce-phase ce-phase-${i}`}>
            <Moon />
            <span />
          </div>
          <small>{x.tag}</small>
          <h3>{x.title}</h3>
          <p>{x.text}</p>
        </article>
      ))}
    </div>
  );
}
