"use client";

import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { lives } from "../_parts/content";
import { GEmblem, type GEmblemId } from "../_parts/GEmblem";
import { gOpenings } from "../_parts/global";
import { burst, burstFrom, useScrollVar } from "../_parts/hooks";
import { AirBalloon, Court, Estate, GateArch, IronGate, Lantern } from "./Palace";

export function GateHero() {
  const ref = useRef<HTMLElement | null>(null);
  const [lit, setLit] = useState(false);
  const litRef = useRef(false);

  const light = useCallback((el?: Element) => {
    if (litRef.current) return;
    litRef.current = true;
    setLit(true);
    window.setTimeout(() => {
      if (el) burstFrom(el, 70);
      else burst(window.innerWidth / 2, window.innerHeight * 0.6, 70);
    }, 700);
  }, []);

  useScrollVar(ref, useCallback((p: number) => { if (p > 0.04) light(); }, [light]));

  return (
    <section ref={ref} className="pg-hero" data-lit={lit || undefined}>
      <div className="pg-stage">
        <div className="pg-sky pg-dusk" />
        <div className="pg-sky pg-day" />
        <div className="pg-stars" />
        <div className="pg-sun"><i /></div>
        <Estate />
        <Court side="left" />
        <Court side="right" />
        <div className="pg-gate">
          <IronGate side="left" />
          <IronGate side="right" />
          <GateArch />
        </div>
        <div className="pg-ground" />
        <div className="pg-copy">
          <h1>
            <span className="pg-h-left">Invitations that open</span>{" "}
            <span className="pg-h-right">like a <em>ceremony</em></span>
          </h1>
          <div className="pg-lede">
            <p>Your guests break the seal, draw the curtains or open the doors, and your day unfolds in their hands.</p>
            <Link href="/templates" className="pg-btn" onPointerEnter={(e) => burstFrom(e.currentTarget, 18)}>
              Start designing free <ArrowRight size={18} />
            </Link>
          </div>
        </div>
        <button type="button" className="pg-lamp" onClick={(e) => light(e.currentTarget)} disabled={lit}>
          <span className="pg-halo" />
          <Lantern />
          <span className="pg-lamp-label">Light the lantern</span>
        </button>
        <div className="pg-veil" />
      </div>
    </section>
  );
}

const dress: Record<GEmblemId, { bg: string; ink: string; e1: string; e2: string; word: string }> = {
  seal: { bg: "#3B1160", ink: "#FFF6E6", e1: "#E8447A", e2: "#A01A50", word: "#FFCF70" },
  curtain: { bg: "#C2275F", ink: "#FFF6E6", e1: "#6B22A0", e2: "#3B1160", word: "#FFD0DC" },
  doors: { bg: "#0B6B5C", ink: "#FFF6E6", e1: "#13947F", e2: "#06463C", word: "#FFCF70" },
  gift: { bg: "#FFB7C9", ink: "#3A0A2E", e1: "#8A3FD1", e2: "#5A1E9E", word: "#C2275F" },
  balloon: { bg: "#FF8A5C", ink: "#3A0A1E", e1: "#E8447A", e2: "#5A1E9E", word: "#7A1250" },
  scratch: { bg: "#1F4FB8", ink: "#FFFFFF", e1: "#E8447A", e2: "#A01A50", word: "#FFCF70" },
  clapper: { bg: "#FFCF70", ink: "#3A0A2E", e1: "#6B22A0", e2: "#3B1160", word: "#C2275F" },
};

export function ColourOpenings() {
  const [i, setI] = useState(0);
  const [from, setFrom] = useState<GEmblemId>(gOpenings[0].id);
  const o = gOpenings[i];
  const d = dress[o.id];
  const go = (n: number) => {
    const next = (n + gOpenings.length) % gOpenings.length;
    if (next === i) return;
    setFrom(o.id);
    setI(next);
  };
  return (
    <section id="openings" className="pg-open" style={{ background: dress[from].bg, color: d.ink }}>
      <div key={o.id} className="pg-open-fill" style={{ background: d.bg }} />
      <div className="pg-open-body">
        <h2 className="pg-open-title">Every invitation begins with a gesture</h2>
        <p key={`w${o.id}`} className="pg-open-word" style={{ color: d.word }} aria-live="polite">{o.label}</p>
        <button
          key={`e${o.id}`}
          type="button"
          className="pg-open-art"
          aria-label={`Shower petals for ${o.label.toLowerCase()}`}
          style={{ "--e1": d.e1, "--e2": d.e2 } as CSSProperties}
          onClick={(e) => burstFrom(e.currentTarget, 60)}
        >
          <GEmblem id={o.id} />
        </button>
        <div className="pg-open-foot">
          <p>{o.text}</p>
          <Link href={`/demo/${o.template}`} target="_blank" className="pg-link">Try it live <ArrowRight size={16} /></Link>
        </div>
        <div className="pg-open-nav">
          <button type="button" aria-label="Previous opening" onClick={() => go(i - 1)}><ChevronLeft /></button>
          <ul>
            {gOpenings.map((x, n) => (
              <li key={x.id}>
                <button type="button" aria-label={x.label} aria-pressed={n === i} onClick={() => go(n)} style={{ "--e1": dress[x.id].e1, "--e2": dress[x.id].e2, background: dress[x.id].bg } as CSSProperties}>
                  <GEmblem id={x.id} />
                </button>
              </li>
            ))}
          </ul>
          <button type="button" aria-label="Next opening" onClick={() => go(i + 1)}><ChevronRight /></button>
        </div>
      </div>
    </section>
  );
}

const works: { x: number; y: number; s: number; c: string; at: number }[] = [
  { x: 1120, y: 190, s: 1.2, c: "#FFCF70", at: 0.66 },
  { x: 1330, y: 330, s: 0.9, c: "#FF8FB1", at: 0.7 },
  { x: 560, y: 330, s: 0.8, c: "#9BE7D0", at: 0.74 },
  { x: 1000, y: 420, s: 0.7, c: "#FFFFFF", at: 0.78 },
  { x: 1430, y: 150, s: 1, c: "#C9A2FF", at: 0.8 },
];

/** A balloon fills at dawn, flies at noon and glows over the fireworks. */
export function BalloonDay() {
  const ref = useRef<HTMLElement | null>(null);
  const [step, setStep] = useState(0);
  useScrollVar(ref, useCallback((p: number) => setStep(p < 0.34 ? 0 : p < 0.64 ? 1 : 2), []));
  return (
    <section ref={ref} className="pg-day-story" data-step={step}>
      <div className="pg-day-stage">
        <div className="pg-sky pg-s-dawn" />
        <div className="pg-sky pg-s-noon" />
        <div className="pg-sky pg-s-night" />
        <div className="pg-stars" />
        <div className="pg-day-sun" />
        <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" className="pg-works" aria-hidden="true">
          {works.map((w) => (
            <g key={w.x} transform={`translate(${w.x} ${w.y})`}>
              <g style={{ transform: `scale(clamp(0, calc((var(--p) - ${w.at}) * 9), ${w.s}))` }}>
                {Array.from({ length: 16 }, (_, k) => (
                  <g key={k} transform={`rotate(${k * 22.5})`}>
                    <path d={`M0 ${k % 2 ? -34 : -26}V${k % 2 ? -104 : -78}`} stroke={w.c} strokeWidth="5" strokeLinecap="round" />
                    <circle cy={k % 2 ? -120 : -94} r="5" fill={w.c} />
                  </g>
                ))}
              </g>
            </g>
          ))}
        </svg>
        <div className="pg-day-copy">
          <h2>One link, three lives</h2>
          <ol>
            {lives.map((x, n) => (
              <li key={x.tag} data-on={n === step || undefined}>
                <b>{x.tag}</b>
                <span>{x.title}</span>
                <p>{x.text}</p>
              </li>
            ))}
          </ol>
        </div>
        <svg viewBox="0 0 1600 360" preserveAspectRatio="xMidYMax slice" className="pg-meadow" aria-hidden="true">
          <path d="M0 150C200 60 420 120 640 110C900 100 1100 30 1320 80C1440 106 1540 90 1600 110V360H0Z" fill="#3FB58A" />
          <path d="M0 230C260 150 520 220 800 200C1080 180 1340 240 1600 180V360H0Z" fill="#13804F" />
          <path d="M0 300C300 250 620 310 900 290C1180 270 1400 310 1600 280V360H0Z" fill="#0B5A3A" />
        </svg>
        <div className="pg-balloon"><AirBalloon /></div>
      </div>
    </section>
  );
}

/** Paper lanterns that glow and rise as the section arrives. */
export function SkyLanterns() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setOn(true), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className="pg-lanterns" data-on={on || undefined} aria-hidden="true">
      {Array.from({ length: 64 }, (_, i) => {
        const x = (i * 37 + 11) % 100;
        const y = (i * 53 + 7) % 88;
        const s = 1.6 + ((i * 29) % 10) / 3.2;
        // Keep the middle of the sky clear for the headline.
        if (x > 14 && x < 84 && y > 22 && y < 82) return null;
        return (
          <svg key={i} viewBox="-30 -44 60 84" className={y > 22 && y < 82 ? "pg-mid" : undefined} style={{ left: `${x}%`, bottom: `${y}%`, width: `${s}rem`, "--i": i } as CSSProperties}>
            <path d="M-20 -36C-10 -42 10 -42 20 -36L27 24C14 32 -14 32 -27 24Z" fill="#FFB562" />
            <path d="M-12 -36C-6 -39 6 -39 12 -36L17 26C8 30 -8 30 -17 26Z" fill="#FFD98A" />
            <ellipse cy="25" rx="26" ry="7" fill="#FFF4CF" />
          </svg>
        );
      })}
    </div>
  );
}
