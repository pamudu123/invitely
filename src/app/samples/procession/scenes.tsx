"use client";

import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { lives, openings } from "../_parts/content";
import { Emblem, Lotus, type EmblemId } from "../_parts/Emblem";
import { burst, burstFrom, useScrollVar } from "../_parts/hooks";
import { Door, GateWall, Horizon, Parade } from "./Gate";

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
    <section ref={ref} className="pa-hero" data-lit={lit || undefined}>
      <div className="pa-stage">
        <div className="pa-sky pa-dusk" />
        <div className="pa-sky pa-day" />
        <div className="pa-stars" />
        <div className="pa-sun"><i /></div>
        <Horizon />
        <Parade side="left" />
        <Parade side="right" />
        <div className="pa-gate">
          <div className="pa-beyond" />
          <Door side="left" />
          <Door side="right" />
          <GateWall />
        </div>
        <div className="pa-ground" />
        <div className="pa-copy">
          <h1>
            <span className="pa-h-left">Invitations that open</span>{" "}
            <span className="pa-h-right">like a <em>ceremony</em></span>
          </h1>
          <p className="pa-greet">
            <span lang="si">ආයුබෝවන්</span>
            <span lang="ta">வணக்கம்</span>
            <span>Welcome</span>
          </p>
          <div className="pa-lede">
            <p>Your guests light the lamp, part the curtains or open the lotus, and your day unfolds in their hands.</p>
            <Link href="/templates" className="pa-btn" onPointerEnter={(e) => burstFrom(e.currentTarget, 18)}>
              Start designing free <ArrowRight size={18} />
            </Link>
          </div>
        </div>
        <button type="button" className="pa-lamp" onClick={(e) => light(e.currentTarget)} disabled={lit}>
          <span className="pa-halo" />
          <Emblem id="lamp" />
          <span className="pa-lamp-label">Light the lamp</span>
        </button>
        <div className="pa-veil" />
      </div>
    </section>
  );
}

const dress: Record<EmblemId, { bg: string; ink: string; e1: string; e2: string; word: string }> = {
  lamp: { bg: "#3B1160", ink: "#FFF4DF", e1: "#C81E1E", e2: "#7E0D1C", word: "#FFA51F" },
  betel: { bg: "#0B6B3A", ink: "#FFF4DF", e1: "#3DBE6B", e2: "#0F8A48", word: "#F2C85B" },
  doors: { bg: "#C81E1E", ink: "#FFF4DF", e1: "#00808A", e2: "#004F55", word: "#FFA51F" },
  curtain: { bg: "#8E0F4F", ink: "#FFF4DF", e1: "#E0447F", e2: "#B0155F", word: "#F7A8C4" },
  lotus: { bg: "#F7A8C4", ink: "#2B0A2E", e1: "#E0447F", e2: "#B8195F", word: "#C81E6A" },
  seal: { bg: "#006B70", ink: "#FFF4DF", e1: "#E5302A", e2: "#A01228", word: "#F2C85B" },
  clapper: { bg: "#FFC02E", ink: "#2B0A2E", e1: "#7A2A9A", e2: "#2B0A2E", word: "#C81E1E" },
  gift: { bg: "#FF7A2F", ink: "#2B0A2E", e1: "#7A2A9A", e2: "#3B1160", word: "#FFE08A" },
};

export function ColourOpenings() {
  const [i, setI] = useState(0);
  const [from, setFrom] = useState(openings[0].id);
  const o = openings[i];
  const d = dress[o.id];
  const go = (n: number) => {
    const next = (n + openings.length) % openings.length;
    if (next === i) return;
    setFrom(o.id);
    setI(next);
  };
  return (
    <section id="openings" className="pa-open" style={{ background: dress[from].bg, color: d.ink }}>
      <div key={o.id} className="pa-open-fill" style={{ background: d.bg }} />
      <div className="pa-open-body">
        <h2 className="pa-open-title">Every invitation begins with a gesture</h2>
        <p key={`w${o.id}`} className="pa-open-word" style={{ color: d.word }} aria-live="polite">{o.label}</p>
        <button
          key={`e${o.id}`}
          type="button"
          className="pa-open-art"
          aria-label={`Shower petals for ${o.label.toLowerCase()}`}
          style={{ "--e1": d.e1, "--e2": d.e2 } as CSSProperties}
          onClick={(e) => burstFrom(e.currentTarget, 60)}
        >
          <Emblem id={o.id} />
        </button>
        <div className="pa-open-foot">
          <p>{o.text}</p>
          <Link href={`/demo/${o.template}`} target="_blank" className="pa-link">Try it live <ArrowRight size={16} /></Link>
        </div>
        <div className="pa-open-nav">
          <button type="button" aria-label="Previous opening" onClick={() => go(i - 1)}><ChevronLeft /></button>
          <ul>
            {openings.map((x, n) => (
              <li key={x.id}>
                <button type="button" aria-label={x.label} aria-pressed={n === i} onClick={() => go(n)} style={{ "--e1": dress[x.id].e1, "--e2": dress[x.id].e2, background: dress[x.id].bg } as CSSProperties}>
                  <Emblem id={x.id} />
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

export function LotusDay() {
  const ref = useRef<HTMLElement | null>(null);
  const [step, setStep] = useState(0);
  useScrollVar(ref, useCallback((p: number) => setStep(p < 0.34 ? 0 : p < 0.68 ? 1 : 2), []));
  return (
    <section ref={ref} className="pa-day-story" data-step={step}>
      <div className="pa-day-stage">
        <div className="pa-sky pa-s-dawn" />
        <div className="pa-sky pa-s-noon" />
        <div className="pa-sky pa-s-night" />
        <div className="pa-stars" />
        <div className="pa-day-sun" />
        <div className="pa-day-copy">
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
        <div className="pa-water" />
        <div className="pa-day-lotus">
          <svg viewBox="-30 -60 60 70" className="pa-day-flame" aria-hidden="true">
            <g className="s-flame">
              <path d="M0 -52C18 -24 20 -6 0 6C-20 -6 -18 -24 0 -52Z" fill="#FF7A1A" />
              <path d="M0 -36C11 -16 12 -4 0 4C-12 -4 -11 -16 0 -36Z" fill="#FFD25E" />
              <path d="M0 -18C5 -8 6 -2 0 2C-6 -2 -5 -8 0 -18Z" fill="#FFFBE8" />
            </g>
          </svg>
          <Lotus id="day" />
        </div>
      </div>
    </section>
  );
}

/** A field of lamps. They catch as the section arrives, or when touched. */
export function LampField() {
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
    <div ref={ref} className="pa-field" data-on={on || undefined} aria-hidden="true">
      {Array.from({ length: 5 }, (_, r) => (
        <div key={r} className="pa-field-row" style={{ "--r": r } as CSSProperties}>
          {Array.from({ length: 17 }, (_, c) => (
            <svg key={c} viewBox="-20 -42 40 60" style={{ transitionDelay: `${((c * 7 + r * 11) % 17) * 90}ms` }}>
              <g className="pa-field-flame"><g className="s-flame"><path d="M0 -34C10 -16 11 -4 0 3C-11 -4 -10 -16 0 -34Z" fill="#FFA51F" /><path d="M0 -20C5 -9 6 -3 0 2C-6 -3 -5 -9 0 -20Z" fill="#FFF4DF" /></g></g>
              <path d="M-18 2h36c-3 9-10 13-18 13s-15-4-18-13z" fill="#B8551A" />
              <path d="M-18 2h36l-2 4h-32z" fill="#E07A2A" />
            </svg>
          ))}
        </div>
      ))}
    </div>
  );
}
