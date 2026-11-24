"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { lives } from "../_parts/content";
import { GEmblem } from "../_parts/GEmblem";
import { gOpenings } from "../_parts/global";
import { burstFrom, useScrollVar } from "../_parts/hooks";
import { Dahlia, type Bouquet } from "./Dahlia";

const cycle: Bouquet[] = ["coral", "pink", "lilac", "blue", "butter"];

export function BloomHero() {
  const ref = useRef<HTMLElement | null>(null);
  const [n, setN] = useState(0);
  const [born, setBorn] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setBorn(true), 350);
    return () => window.clearTimeout(t);
  }, []);
  useScrollVar(ref);
  return (
    <section ref={ref} className="bl-hero" data-tone={cycle[n]} data-born={born || undefined}>
      <div className="bl-stage">
        <h1>
          <span className="bl-l1">Invitations that</span>{" "}
          <span className="bl-l2">open like a</span>{" "}
          <span className="bl-l3">ceremony</span>
        </h1>
        <button
          type="button"
          className="bl-flower"
          aria-label="Change the flower"
          onClick={(e) => {
            burstFrom(e.currentTarget, 70);
            setN((x) => (x + 1) % cycle.length);
          }}
        >
          <Dahlia tone={cycle[n]} />
        </button>
        <div className="bl-lede">
          <p>Your guests break the seal, part the curtains or unwrap the gift, and your day unfolds in their hands.</p>
          <Link href="/templates" className="bl-btn">Start designing free <ArrowRight size={18} /></Link>
        </div>
        <p className="bl-hint">Tap the flower</p>
        <div className="bl-veil" />
      </div>
    </section>
  );
}

const rows: { bg: string; ink: string; e1: string; e2: string }[] = [
  { bg: "#FF6A3D", ink: "#3A0A05", e1: "#A8005E", e2: "#6E003D" },
  { bg: "#FF8CC4", ink: "#4A0030", e1: "#C8102E", e2: "#8A0A20" },
  { bg: "#C49DFF", ink: "#2A0A5E", e1: "#5B21B6", e2: "#3B1280" },
  { bg: "#80AAFF", ink: "#08205E", e1: "#EE2F93", e2: "#A8005E" },
  { bg: "#FFC653", ink: "#4A2A00", e1: "#F5432F", e2: "#2C66F5" },
  { bg: "#7FD9A0", ink: "#063A22", e1: "#0E4B3A", e2: "#062B20" },
  { bg: "#FFB8DB", ink: "#4A0030", e1: "#7434D6", e2: "#3B1280" },
];

/** Full-width stripes. The chosen one opens up. */
export function Stripes() {
  const [i, setI] = useState(0);
  return (
    <ol className="bl-stripes">
      {gOpenings.map((o, n) => {
        const c = rows[n];
        return (
          <li key={o.id} data-on={n === i || undefined} style={{ background: c.bg, color: c.ink, "--e1": c.e1, "--e2": c.e2, "--g1": "#FFF0C4", "--g2": c.ink } as CSSProperties}>
            <button type="button" aria-expanded={n === i} onClick={() => setI(n)} onPointerEnter={(e) => e.pointerType === "mouse" && setI(n)}>
              <span>{o.label}</span>
            </button>
            <div className="bl-stripe-in">
              <div>
                <p>{o.text}</p>
                <Link href={`/demo/${o.template}`} target="_blank" tabIndex={n === i ? undefined : -1}>Try it live <ArrowRight size={16} /></Link>
              </div>
              <GEmblem id={o.id} className="bl-stripe-art" />
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export function Season() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setOn(true), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const open = [0.58, 1, 0.9];
  const tone: Bouquet[] = ["pink", "coral", "butter"];
  return (
    <div ref={ref} className="bl-season">
      {lives.map((x, i) => (
        <article key={x.tag} className={`bl-phase bl-phase-${i}`}>
          <div className="bl-disc">
            <Dahlia tone={tone[i]} style={{ "--open": on ? open[i] : 0.05 } as CSSProperties} />
          </div>
          <small>{x.tag}</small>
          <h3>{x.title}</h3>
          <p>{x.text}</p>
        </article>
      ))}
    </div>
  );
}

const bed: { x: number; h: number; s: number; t: Bouquet }[] = [
  { x: 4, h: 46, s: 15, t: "pink" },
  { x: 15, h: 68, s: 18, t: "coral" },
  { x: 27, h: 40, s: 13, t: "butter" },
  { x: 38, h: 60, s: 17, t: "lilac" },
  { x: 50, h: 38, s: 15, t: "coral" },
  { x: 61, h: 64, s: 18, t: "pink" },
  { x: 73, h: 44, s: 14, t: "blue" },
  { x: 85, h: 70, s: 18, t: "butter" },
  { x: 96, h: 48, s: 15, t: "lilac" },
];

export function Garden() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className="bl-garden" data-on={on || undefined} aria-hidden="true">
      {bed.map((f, i) => (
        <span key={f.x} className="bl-stem" style={{ left: `${f.x}%`, "--h": `${f.h}%`, "--s": `${f.s}vw`, "--i": i } as CSSProperties}>
          <i />
          <Dahlia tone={f.t} style={{ "--open": on ? 1 : 0.05 } as CSSProperties} />
        </span>
      ))}
    </div>
  );
}
