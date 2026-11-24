"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useCallback, useRef, useState, type CSSProperties } from "react";
import { lives } from "../_parts/content";
import { GEmblem } from "../_parts/GEmblem";
import { gOpenings } from "../_parts/global";
import { burst, burstFrom, useScrollVar } from "../_parts/hooks";

export function Chandelier({ className }: { className?: string }) {
  const tier = (y: number, rx: number, n: number, drop: number) => (
    <g>
      <ellipse cy={y} rx={rx} ry={rx * 0.16} fill="none" stroke="#C89B45" strokeWidth="7" />
      {Array.from({ length: n }, (_, i) => {
        const a = (i / n) * Math.PI * 2;
        const x = +(Math.cos(a) * rx).toFixed(2);
        const yy = +(y + Math.sin(a) * rx * 0.16).toFixed(2);
        return (
          <g key={i} transform={`translate(${x} ${yy})`}>
            <path d="M-4 0h8v-20h-8z" fill="#FFFAF0" />
            <path d="M0 -38C7 -30 7 -24 0 -20C-7 -24 -7 -30 0 -38Z" fill="#FFC24D" />
            <path d={`M0 4v${drop}`} stroke="#F7E6BE" strokeWidth="1.5" />
            <path d={`M0 ${drop}l6 10-6 12-6-12z`} fill="#FFFFFF" opacity="0.95" />
          </g>
        );
      })}
      <path d={`M${-rx} ${y}Q0 ${y + rx * 0.62} ${rx} ${y}`} fill="none" stroke="#FFFFFF" strokeWidth="5" strokeDasharray="0 9" strokeLinecap="round" />
      <path d={`M${-rx * 0.7} ${y}Q0 ${y + rx * 0.44} ${rx * 0.7} ${y}`} fill="none" stroke="#FBE9C4" strokeWidth="4" strokeDasharray="0 8" strokeLinecap="round" />
    </g>
  );
  return (
    <svg viewBox="-260 -240 520 560" className={className} aria-hidden="true">
      <path d="M0 -240V-120" stroke="#C89B45" strokeWidth="5" strokeDasharray="10 5" />
      <path d="M-14 -126C-40 -90 -22 -40 -10 -10H10C22 -40 40 -90 14 -126Z" fill="#D9AE58" />
      <path d="M-60 -70Q0 -20 60 -70M-10 -10C-40 40 -120 30 -216 40M10 -10C40 40 120 30 216 40M-12 -60C-40 -40 -90 -40 -128 -50M12 -60C40 -40 90 -40 128 -50" fill="none" stroke="#C89B45" strokeWidth="6" strokeLinecap="round" />
      {tier(-50, 130, 8, 24)}
      {tier(60, 218, 14, 36)}
      <path d="M-34 70C-30 130 -12 150 0 190C12 150 30 130 34 70Z" fill="#D9AE58" />
      <path d="M0 190l12 20-12 26-12-26z" fill="#FFFFFF" />
    </svg>
  );
}

function Ballroom() {
  const win = (x: number, s = 1) => (
    <g transform={`translate(${x} 250) scale(${s})`}>
      <path d="M-92 360V-60a92 92 0 0 1 184 0v420z" fill="#FFF1D2" />
      <path d="M-78 360V-58a78 78 0 0 1 156 0v418z" fill="url(#op-eve)" />
      <path d="M0 -136V360M-78 60H78M-78 200H78M-78 -58H78" stroke="#FFF1D2" strokeWidth="7" />
      <path d="M-104 370V-60a104 104 0 0 1 208 0v430" fill="none" stroke="#D9AE58" strokeWidth="7" />
    </g>
  );
  const pilaster = (x: number) => (
    <g transform={`translate(${x} 0)`}>
      <path d="M-26 90h52v540h-52z" fill="#FFF6E4" />
      <path d="M-14 110v500M0 110v500M14 110v500" stroke="#E7C98C" strokeWidth="4" />
      <path d="M-38 90h76l-10-24h-56z" fill="#D9AE58" />
      <path d="M-34 610h68v22h-68z" fill="#D9AE58" />
    </g>
  );
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" className="op-room" aria-hidden="true">
      <defs>
        <linearGradient id="op-eve" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3A5BE0" />
          <stop offset="0.55" stopColor="#F29AB8" />
          <stop offset="1" stopColor="#FFD08A" />
        </linearGradient>
        <linearGradient id="op-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F49AB4" />
          <stop offset="1" stopColor="#FFD9DF" />
        </linearGradient>
      </defs>
      <path d="M0 0h1600v640H0z" fill="url(#op-wall)" />
      <path d="M0 0h1600v66H0z" fill="#FFF6E4" />
      <path d="M0 66h1600" stroke="#D9AE58" strokeWidth="10" />
      <path d="M0 84h1600" stroke="#D9AE58" strokeWidth="8" strokeDasharray="0 22" strokeLinecap="round" />
      {[170, 480, 800, 1120, 1430].map((x) => <g key={x}>{win(x, x === 800 ? 1.04 : 0.9)}</g>)}
      {[20, 325, 640, 960, 1275, 1580].map((x) => <g key={x}>{pilaster(x)}</g>)}
      <path d="M0 632h1600v268H0z" fill="#FFF6E4" />
      <g fill="#2B4BD0">
        {Array.from({ length: 5 }, (_, r) => {
          const y0 = 632 + [0, 26, 64, 118, 186][r];
          const y1 = 632 + [26, 64, 118, 186, 268][r];
          const k0 = 1 + [0, 0.18, 0.44, 0.82, 1.3][r];
          const k1 = 1 + [0.18, 0.44, 0.82, 1.3, 1.9][r];
          return Array.from({ length: 24 }, (_, c) => {
            if ((c + r) % 2) return null;
            const x = (c - 12) * 92;
            return <path key={`${r}-${c}`} d={`M${800 + x * k0} ${y0}L${800 + (x + 92) * k0} ${y0}L${800 + (x + 92) * k1} ${y1}L${800 + x * k1} ${y1}Z`} />;
          });
        })}
      </g>
      <path d="M0 632h1600" stroke="#D9AE58" strokeWidth="8" />
    </svg>
  );
}

export function CurtainHero() {
  const ref = useRef<HTMLElement | null>(null);
  const [up, setUp] = useState(false);
  const done = useRef(false);
  const raise = useCallback((el?: Element) => {
    if (done.current) return;
    done.current = true;
    setUp(true);
    window.setTimeout(() => (el ? burstFrom(el, 60) : burst(window.innerWidth / 2, window.innerHeight / 2, 60)), 900);
  }, []);
  useScrollVar(ref, useCallback((p: number) => { if (p > 0.05) raise(); }, [raise]));
  return (
    <section ref={ref} className="op-hero" data-up={up || undefined}>
      <div className="op-stage">
        <Ballroom />
        <div className="op-glow" />
        <Chandelier className="op-chandelier" />
        <div className="op-curtain op-curtain-l" />
        <div className="op-curtain op-curtain-r" />
        <svg viewBox="0 0 1600 220" preserveAspectRatio="none" className="op-valance" aria-hidden="true">
          {[0, 1, 2, 3, 4].map((i) => (
            <g key={i} transform={`translate(${i * 320} 0)`}>
              <path d="M0 0H320V60C290 170 210 200 160 200C110 200 30 170 0 60Z" fill={i % 2 ? "#1636B8" : "#1B40D0"} />
              <path d="M20 30C60 120 110 150 160 152C210 150 260 120 300 30M50 20C80 80 120 104 160 104C200 104 240 80 270 20" fill="none" stroke="#0C2388" strokeWidth="7" opacity="0.6" />
              <path d="M0 60C30 170 110 200 160 200C210 200 290 170 320 60" fill="none" stroke="#F0D49A" strokeWidth="9" />
              <path d="M0 74C30 184 110 214 160 214C210 214 290 184 320 74" fill="none" stroke="#D9AE58" strokeWidth="7" strokeDasharray="0 11" strokeLinecap="round" />
            </g>
          ))}
          <path d="M0 0h1600v14H0z" fill="#F0D49A" />
        </svg>
        <div className="op-copy">
          <h1>Invitations that open like a <em>ceremony</em></h1>
          <p>Your guests break the seal, draw the curtains or open the doors, and your day takes the stage.</p>
          <div className="op-actions">
            <button type="button" className="op-btn op-raise" onClick={(e) => raise(e.currentTarget)}>Raise the curtain</button>
            <Link href="/templates" className="op-btn op-btn-gold">Start designing free <ArrowRight size={18} /></Link>
          </div>
        </div>
        <div className="op-veil" />
      </div>
    </section>
  );
}

const lights: Record<string, { bg: string; e1: string; e2: string }> = {
  seal: { bg: "#C2183A", e1: "#C2183A", e2: "#7E0D24" },
  curtain: { bg: "#1230A8", e1: "#E5253A", e2: "#9A1026" },
  doors: { bg: "#0B6B5C", e1: "#0F8F7A", e2: "#07473D" },
  gift: { bg: "#E0527E", e1: "#1B40D0", e2: "#0C2388" },
  balloon: { bg: "#5B2BB5", e1: "#FF6B8A", e2: "#FFB347" },
  scratch: { bg: "#0D6FB8", e1: "#1230A8", e2: "#0A1C6B" },
  clapper: { bg: "#D9531E", e1: "#1230A8", e2: "#0A1C6B" },
};

/** A cast list of openings. Choosing one swings the spotlight to it. */
export function CastList() {
  const [i, setI] = useState(0);
  const o = gOpenings[i];
  const c = lights[o.id];
  return (
    <section id="openings" className="op-cast" style={{ background: c.bg }}>
      <div className="op-wrap op-cast-grid">
        <div>
          <h2>In order of appearance</h2>
          <ol>
            {gOpenings.map((x, n) => (
              <li key={x.id}>
                <button type="button" aria-pressed={n === i} onClick={() => setI(n)} onPointerEnter={(e) => e.pointerType === "mouse" && setI(n)}>{x.label}</button>
              </li>
            ))}
          </ol>
        </div>
        <div className="op-spot">
          <span className="op-beam" />
          <span className="op-pool" />
          <button key={o.id} type="button" className="op-star" aria-label={`Throw petals for ${o.label.toLowerCase()}`} style={{ "--e1": c.e1, "--e2": c.e2 } as CSSProperties} onClick={(e) => burstFrom(e.currentTarget, 50)}>
            <GEmblem id={o.id} />
          </button>
          <div className="op-spot-text" aria-live="polite">
            <p>{o.text}</p>
            <Link href={`/demo/${o.template}`} target="_blank">Try it live <ArrowRight size={16} /></Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Acts() {
  const [i, setI] = useState(0);
  return (
    <div className="op-acts">
      {lives.map((x, n) => (
        <button key={x.tag} type="button" className={`op-act op-act-${n}`} aria-expanded={n === i} onClick={() => setI(n)} onPointerEnter={(e) => e.pointerType === "mouse" && setI(n)}>
          <span className="op-act-n">{["Act one", "Act two", "Finale"][n]}</span>
          <span className="op-act-body">
            <small>{x.tag}</small>
            <b>{x.title}</b>
            <span>{x.text}</span>
          </span>
        </button>
      ))}
    </div>
  );
}
