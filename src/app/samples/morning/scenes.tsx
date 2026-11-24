"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { lives, openings } from "../_parts/content";
import { Emblem, Lotus } from "../_parts/Emblem";
import { burstFrom } from "../_parts/hooks";

/** Marigold strings hung across the top of the page. */
export function Swags() {
  const strand = (d: string, c: string, w: number, k: string) => (
    <path key={k} d={d} fill="none" stroke={c} strokeWidth={w} strokeDasharray={`0 ${w * 0.82}`} strokeLinecap="round" />
  );
  return (
    <svg viewBox="0 0 1600 330" preserveAspectRatio="xMidYMin slice" className="pc-swags" aria-hidden="true">
      {[0, 400, 800, 1200].map((x) => (
        <g key={x}>
          {strand(`M${x} -10Q${x + 200} 190 ${x + 400} -10`, "#FF8A1F", 24, `a${x}`)}
          {strand(`M${x} -10Q${x + 200} 190 ${x + 400} -10`, "#FFC24D", 11, `b${x}`)}
          {strand(`M${x} -14Q${x + 200} 110 ${x + 400} -14`, "#E0447F", 18, `c${x}`)}
        </g>
      ))}
      {[0, 400, 1200, 1600].map((x, i) => (
        <g key={x}>
          {strand(`M${x} 0V${i % 3 ? 190 : 250}`, "#FF8A1F", 26, `d${x}`)}
          {strand(`M${x} 0V${i % 3 ? 190 : 250}`, "#FFD25E", 12, `e${x}`)}
          <g transform={`translate(${x} ${(i % 3 ? 190 : 250) + 22})`}>
            <path d="M0 -8C20 2 20 34 0 52C-20 34 -20 2 0 -8Z" fill="#E0447F" />
            <path d="M0 4C9 10 9 28 0 38C-9 28 -9 10 0 4Z" fill="#FFD3E2" />
          </g>
        </g>
      ))}
    </svg>
  );
}

function Pads({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 300 70" className={className} aria-hidden="true">
      <path d="M150 4C240 4 296 18 296 36C296 54 240 66 150 66C60 66 4 54 4 36C4 18 60 4 150 4L162 34Z" fill="#1F9A6A" />
      <path d="M150 34L40 22M150 34L30 46M150 36L120 62M150 34L262 22M150 34L270 48M150 36L186 62" stroke="#8FE0B0" strokeOpacity="0.6" strokeWidth="2" fill="none" />
    </svg>
  );
}

export function PondHero() {
  const ref = useRef<HTMLElement | null>(null);
  const [up, setUp] = useState(false);
  const [bloom, setBloom] = useState<Record<number, boolean>>({});
  useEffect(() => {
    const t = window.setTimeout(() => setUp(true), 350);
    const u = window.setTimeout(() => setBloom({ 0: true }), 1300);
    const v = window.setTimeout(() => setBloom({ 0: true, 1: true, 2: true }), 1900);
    return () => [t, u, v].forEach(window.clearTimeout);
  }, []);
  const spots = ["pc-l0", "pc-l1", "pc-l2"];
  return (
    <section
      ref={ref}
      className="pc-hero"
      data-up={up || undefined}
      onPointerMove={(e) => ref.current?.style.setProperty("--mx", ((e.clientX / window.innerWidth - 0.5) * 2).toFixed(3))}
    >
      <div className="pc-rays" />
      <div className="pc-sun" />
      <Swags />
      <div className="pc-hero-copy">
        <p className="pc-greet"><span lang="si">ආයුබෝවන්</span> <span lang="ta">வணக்கம்</span> <span>Welcome</span></p>
        <h1>Invitations that open like a <em>ceremony</em></h1>
        <p className="pc-lede">Your guests light the lamp, part the curtains or open the lotus, and your day unfolds in their hands.</p>
        <Link href="/templates" className="pc-btn" onPointerEnter={(e) => burstFrom(e.currentTarget, 20)}>Start designing free <ArrowRight size={18} /></Link>
      </div>
      <div className="pc-pond">
        <div className="pc-glint" />
        {spots.map((c, i) => (
          <button
            key={c}
            type="button"
            className={`pc-lotus ${c}`}
            aria-label={bloom[i] ? "Close the lotus" : "Open the lotus"}
            style={{ "--open": bloom[i] ? 1 : 0.06 } as CSSProperties}
            onClick={(e) => {
              if (!bloom[i]) burstFrom(e.currentTarget, 40);
              setBloom((b) => ({ ...b, [i]: !b[i] }));
            }}
          >
            <Pads className="pc-pad" />
            <Lotus id={`pc${i}`} />
          </button>
        ))}
        <Pads className="pc-pad-x pc-px1" />
        <Pads className="pc-pad-x pc-px2" />
        <Pads className="pc-pad-x pc-px3" />
      </div>
    </section>
  );
}

const tones = ["#FFB53A", "#8FD6A4", "#F2766B", "#F08BB2", "#FFC6DA", "#FF9A4D", "#C9A2E8", "#FFD25E"];

/** Eight petals, one opening on each. */
export function PetalWheel() {
  const [i, setI] = useState(0);
  const o = openings[i];
  return (
    <div className="pc-wheel">
      <ul>
        {openings.map((x, n) => (
          <li key={x.id} style={{ "--a": `${n * 45}deg` } as CSSProperties}>
            <button
              type="button"
              aria-pressed={n === i}
              aria-label={x.label}
              style={{ background: tones[n], "--e1": n === 1 ? "#1E9A4A" : "#C81E5A", "--e2": n === 1 ? "#0B5A32" : "#8E0F4F" } as CSSProperties}
              onClick={(e) => {
                setI(n);
                burstFrom(e.currentTarget, 18);
              }}
            >
              <Emblem id={x.id} />
            </button>
          </li>
        ))}
      </ul>
      <div className="pc-wheel-mid" key={o.id} aria-live="polite">
        <h3>{o.label}</h3>
        <p>{o.text}</p>
        <Link href={`/demo/${o.template}`} target="_blank" className="pc-link">Try it live <ArrowRight size={16} /></Link>
      </div>
    </div>
  );
}

export function ThreeSkies() {
  return (
    <div className="pc-skies">
      {lives.map((x, i) => (
        <article key={x.tag} className={`pc-sky pc-sky-${i}`}>
          <div className="pc-scene">
            <span className="pc-orb" />
            <span className="pc-mere" />
            <Lotus id={`sk${i}`} className="pc-scene-lotus" style={{ "--open": [0.16, 1, 0.86][i] } as CSSProperties} />
            {i === 2 ? (
              <svg viewBox="-30 -60 60 70" className="pc-scene-flame" aria-hidden="true">
                <g className="s-flame"><path d="M0 -52C18 -24 20 -6 0 6C-20 -6 -18 -24 0 -52Z" fill="#FF7A1A" /><path d="M0 -36C11 -16 12 -4 0 4C-12 -4 -11 -16 0 -36Z" fill="#FFD25E" /><path d="M0 -18C5 -8 6 -2 0 2C-6 -2 -5 -8 0 -18Z" fill="#FFFBE8" /></g>
              </svg>
            ) : null}
          </div>
          <p className="pc-script">{x.tag}</p>
          <h3>{x.title}</h3>
          <p>{x.text}</p>
        </article>
      ))}
    </div>
  );
}

export function EveningPond() {
  return (
    <div className="pc-evening" aria-hidden="true">
      <div className="pc-glint" />
      <Lotus id="ev1" className="pc-ev pc-ev1" />
      <Lotus id="ev2" className="pc-ev pc-ev2" />
      <Lotus id="ev3" className="pc-ev pc-ev3" />
      {[8, 24, 39, 60, 74, 90].map((x, i) => (
        <svg key={x} viewBox="-30 -44 60 70" className="pc-float" style={{ left: `${x}%`, bottom: `${8 + ((i * 13) % 40)}%`, animationDelay: `${i * -0.9}s`, width: `${3 + (i % 3)}rem` }}>
          <g className="s-flame"><path d="M0 -38C13 -18 15 -4 0 6C-15 -4 -13 -18 0 -38Z" fill="#FFA51F" /><path d="M0 -20C5 -9 6 -3 0 2C-6 -3 -5 -9 0 -20Z" fill="#FFF4DF" /></g>
          <path d="M-26 4C-14 -6 14 -6 26 4C18 18 -18 18 -26 4Z" fill="#F08BB2" />
          <path d="M-26 4C-18 14 18 14 26 4C14 24 -14 24 -26 4Z" fill="#C2185B" />
        </svg>
      ))}
    </div>
  );
}
