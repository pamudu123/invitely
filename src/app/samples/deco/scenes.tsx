"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { lives } from "../_parts/content";
import { GEmblem } from "../_parts/GEmblem";
import { gOpenings } from "../_parts/global";
import { burstFrom } from "../_parts/hooks";

const BOWL = "M-50 0C-50 30 -26 44 0 44C26 44 50 30 50 0Z";

function Coupe({ x, y, row, id }: { x: number; y: number; row: number; id: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <clipPath id={id}><path d={BOWL} /></clipPath>
      <path d="M-5 42h10l3 48h-16z" fill="#F7E3B0" opacity="0.9" />
      <path d="M-28 96c0-6 18-8 28-8s28 2 28 8z" fill="#F0D084" />
      <path d={BOWL} fill="#FFFDF2" opacity="0.28" />
      <g clipPath={`url(#${id})`}>
        <g className="dc-liquid" style={{ "--row": row } as CSSProperties}>
          <path d="M-60 6h120v50h-120z" fill="#FFC94A" />
          <path d="M-60 6h120v7h-120z" fill="#FFF3C4" />
          {[-28, -10, 12, 30].map((b, i) => <circle key={b} cx={b} cy={24 + (i % 2) * 9} r="2.6" fill="#FFF9E0" />)}
        </g>
      </g>
      <path d={BOWL} fill="none" stroke="#FFF3D0" strokeWidth="3" />
      <ellipse rx="50" ry="5" fill="none" stroke="#FFF9E6" strokeWidth="3" />
      <path d="M-36 10c2 10 8 18 16 22" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
    </g>
  );
}

function Tower() {
  const rows = [1, 2, 3, 4];
  return (
    <svg viewBox="-270 -150 540 590" className="dc-tower" aria-hidden="true">
      <g className="dc-bottle">
        <g transform="translate(150 -96) rotate(-105)">
          <path d="M-12 -86h24v58c0 14 20 22 20 48v112c0 8-4 12-12 12h-40c-8 0-12-4-12-12V20c0-26 20-34 20-48z" fill="#8C1A22" />
          <path d="M-14 -92h28v46h-28z" fill="#F0D084" />
          <path d="M-32 50h64v52h-64z" fill="#FFF6E0" />
          <path d="M-18 66h36M-12 78h24" stroke="#B5452F" strokeWidth="4" />
        </g>
      </g>
      <path className="dc-stream" d="M62 -72C30 -66 4 -52 0 -22V6" fill="none" stroke="#FFD76A" strokeWidth="7" strokeLinecap="round" pathLength={1} />
      {rows.map((n, r) =>
        Array.from({ length: n }, (_, i) => <Coupe key={`${r}-${i}`} id={`dc-c${r}${i}`} row={r} x={(i - (n - 1) / 2) * 112} y={r * 104} />),
      )}
      <path d="M-250 410h500v14h-500z" fill="#F0D084" />
      <path d="M-220 424h440l-20 14h-400z" fill="#C89B3C" />
    </svg>
  );
}

function Skyline({ side }: { side: "l" | "r" }) {
  const block = (x: number, w: number, h: number, c: string, t: number) => (
    <g key={x}>
      <path d={`M${x} 700V${700 - h}h${w * 0.16}v-40h${w * 0.16}v-44h${w * 0.14}v-50h${w * 0.08}v50h${w * 0.14}v44h${w * 0.16}v40h${w * 0.16}v${h}z`} fill={c} />
      <path d={`M${x + w / 2} ${700 - h - 134}v-70`} stroke="#F0D084" strokeWidth="4" />
      {Array.from({ length: Math.floor((h - 20) / 42) }, (_, r) =>
        Array.from({ length: t }, (_, k) => (
          <path key={`${r}-${k}`} d={`M${x + (w / (t + 1)) * (k + 1) - 5} ${700 - h + 20 + r * 42}h10v22h-10z`} fill={(r * 3 + k * 5 + x) % 4 ? "#FFE2A0" : "#F0D084"} opacity={(r + k + x) % 3 ? 0.95 : 0.35} />
        )),
      )}
    </g>
  );
  return (
    <svg viewBox="0 0 520 700" preserveAspectRatio="xMinYMax meet" className={`dc-sky dc-sky-${side}`} aria-hidden="true">
      <g transform={side === "r" ? "translate(520 0) scale(-1 1)" : undefined}>
        {block(250, 110, 150, "#D9573F", 3)}
        {block(120, 150, 300, "#F2785C", 4)}
        {block(0, 140, 200, "#B5452F", 4)}
        {block(350, 90, 90, "#FF9C7E", 2)}
      </g>
    </svg>
  );
}

export function TowerHero() {
  const [pour, setPour] = useState(false);
  const ref = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    const t = window.setTimeout(() => setPour(true), 900);
    return () => window.clearTimeout(t);
  }, []);
  return (
    <section className="dc-hero" data-pour={pour || undefined}>
      <div className="dc-rays" />
      <Skyline side="l" />
      <Skyline side="r" />
      <div className="dc-border" />
      <div className="dc-copy">
        <h1>Invitations that open like a <em>ceremony</em></h1>
        <p>Your guests break the seal, draw the curtains or pop the balloon, and the party begins.</p>
        <div className="dc-actions">
          <Link href="/templates" className="dc-btn">Start designing free <ArrowRight size={18} /></Link>
          <button type="button" className="dc-btn dc-btn-line" onClick={() => { setPour((x) => !x); if (ref.current) burstFrom(ref.current, 60); }}>{pour ? "Empty the glasses" : "Pour the champagne"}</button>
        </div>
      </div>
      <button ref={ref} type="button" className="dc-tower-btn" aria-label={pour ? "Empty the glasses" : "Pour the champagne"} onClick={(e) => { burstFrom(e.currentTarget, 60); setPour((x) => !x); }}>
        <Tower />
      </button>
    </section>
  );
}

const floors: { bg: string; e1: string; e2: string }[] = [
  { bg: "#D93A3A", e1: "#D93A3A", e2: "#8C1A22" },
  { bg: "#0B7A5E", e1: "#E0526E", e2: "#9A1F3E" },
  { bg: "#F0A23C", e1: "#0B7A5E", e2: "#064536" },
  { bg: "#4B3FB5", e1: "#FF7A5C", e2: "#B5452F" },
  { bg: "#FF9C7E", e1: "#D93A3A", e2: "#4B3FB5" },
  { bg: "#0E8FA3", e1: "#D93A3A", e2: "#8C1A22" },
  { bg: "#B52D6A", e1: "#0B7A5E", e2: "#064536" },
];

/** A lift with a brass floor dial. Pick a floor and the doors reveal its opening. */
export function Lift() {
  const [i, setI] = useState(0);
  const [shown, setShown] = useState(0);
  const [shut, setShut] = useState(true);
  const ref = useRef<HTMLDivElement | null>(null);
  const timers = useRef<number[]>([]);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      setShut(false);
      io.disconnect();
    }, { threshold: 0.35 });
    io.observe(el);
    const t = timers.current;
    return () => {
      io.disconnect();
      t.forEach((x) => window.clearTimeout(x));
    };
  }, []);
  const ride = (n: number) => {
    if (n === i) return;
    timers.current.forEach((x) => window.clearTimeout(x));
    timers.current.length = 0;
    setI(n);
    setShut(true);
    timers.current.push(window.setTimeout(() => setShown(n), 760), window.setTimeout(() => setShut(false), 980));
  };
  const o = gOpenings[shown];
  const f = floors[shown];
  const angle = -78 + (156 * i) / (gOpenings.length - 1);
  return (
    <div className="dc-lift-grid">
      <div ref={ref} className="dc-lift" data-shut={shut || undefined}>
        <svg viewBox="-220 -220 440 240" className="dc-dial" aria-hidden="true">
          <path d="M-212 10a212 212 0 0 1 424 0z" fill="#F0D084" />
          <path d="M-196 10a196 196 0 0 1 392 0z" fill="#0A5E50" />
          {Array.from({ length: 13 }, (_, k) => <path key={k} d="M0 0L-9 -150L9 -150Z" transform={`rotate(${-78 + k * 13})`} fill="#0E7D69" />)}
          {gOpenings.map((x, k) => (
            <text key={x.id} transform={`rotate(${-78 + (156 * k) / (gOpenings.length - 1)}) translate(0 -164)`} textAnchor="middle" fontSize="24" fill={k === i ? "#FFC94A" : "#FFF6E0"}>{k + 1}</text>
          ))}
          <g className="dc-needle" style={{ transform: `rotate(${angle}deg)` }}><path d="M-7 0L0 -142L7 0Z" fill="#FFC94A" /></g>
          <circle r="18" fill="#F0D084" />
        </svg>
        <div className="dc-car">
          <div className="dc-car-in" style={{ background: f.bg, "--e1": f.e1, "--e2": f.e2 } as CSSProperties}>
            <span className="dc-car-rays" />
            <GEmblem id={o.id} />
          </div>
          <span className="dc-door dc-door-l" />
          <span className="dc-door dc-door-r" />
        </div>
      </div>
      <div>
        <h2>Going up</h2>
        <ol className="dc-floors">
          {gOpenings.map((x, n) => (
            <li key={x.id}>
              <button type="button" aria-pressed={n === i} onClick={() => ride(n)}>
                <b>{n + 1}</b>
                <span>{x.label}</span>
              </button>
            </li>
          ))}
        </ol>
        <p className="dc-lift-text" aria-live="polite">{o.text} <Link href={`/demo/${o.template}`} target="_blank">Try it live</Link></p>
      </div>
    </div>
  );
}

export function Clock() {
  const [i, setI] = useState(0);
  const at = [180, 270, 360];
  return (
    <div className="dc-clock-grid" data-i={i}>
      <svg viewBox="-260 -260 520 520" className="dc-clock" aria-hidden="true">
        <circle r="256" fill="#F0D084" />
        <circle r="238" fill="#0A5E50" />
        {Array.from({ length: 24 }, (_, k) => <path key={k} d="M0 -60L-16 -176L16 -176Z" transform={`rotate(${k * 15})`} fill={k % 2 ? "#0E7D69" : "#0C6C5B"} />)}
        {["XII", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI"].map((n, k) => (
          <text key={n} x={(Math.sin((k * Math.PI) / 6) * 204).toFixed(2)} y={(-Math.cos((k * Math.PI) / 6) * 204 + 10).toFixed(2)} textAnchor="middle" fontSize="30" fill="#FFF6E0">{n}</text>
        ))}
        <g className="dc-hand" style={{ transform: `rotate(${at[i]}deg)` }}><path d="M-9 20L0 -150L9 20Z" fill="#FFC94A" /><path d="M0 -176l14 26-14 22-14-22z" fill="#FFC94A" /></g>
        <g className="dc-hand" style={{ transform: `rotate(${i * 360}deg)` }}><path d="M-5 24L0 -188L5 24Z" fill="#FF9C7E" /></g>
        <circle r="16" fill="#F0D084" />
      </svg>
      <ol>
        {lives.map((x, n) => (
          <li key={x.tag}>
            <button type="button" aria-expanded={n === i} onClick={() => setI(n)}>
              <small>{["Six o’clock", "Nine o’clock", "Midnight"][n]}</small>
              <b>{x.title}</b>
            </button>
            <p hidden={n !== i}><strong>{x.tag}.</strong> {x.text}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
