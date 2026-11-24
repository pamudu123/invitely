"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { lives } from "../_parts/content";
import { GEmblem } from "../_parts/GEmblem";
import { gOpenings } from "../_parts/global";
import { burstFrom, useScrollVar } from "../_parts/hooks";

export function Lemon({ x = 0, y = 0, s = 1, r = 0 }: { x?: number; y?: number; s?: number; r?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
      <path d="M0 -34C6 -30 8 -27 12 -25C30 -16 34 10 22 24C16 31 8 32 4 36C2 39 -2 39 -4 36C-8 32 -16 31 -22 24C-34 10 -30 -16 -12 -25C-8 -27 -6 -30 0 -34Z" fill="#FFD51F" />
      <path d="M8 -20C24 -10 28 10 18 22C12 28 6 29 2 33C18 20 20 -4 8 -20Z" fill="#F2A900" opacity="0.55" />
      <path d="M-14 -10C-18 -2 -18 6 -14 12" fill="none" stroke="#FFF6C2" strokeWidth="4" strokeLinecap="round" />
    </g>
  );
}

function Branch({ className }: { className: string }) {
  const leaf = (x: number, y: number, r: number, s = 1, c = "#1E8E4E") => (
    <g key={`${x}${y}${r}`} transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
      <path d="M0 0C20 -26 62 -28 92 0C62 22 20 20 0 0Z" fill={c} />
      <path d="M4 0H84" stroke="#B7E5A8" strokeWidth="2" />
    </g>
  );
  return (
    <svg viewBox="0 0 620 420" className={className} aria-hidden="true">
      <path d="M640 -20C520 40 420 60 300 60C200 60 120 90 60 150M420 46C400 110 380 150 350 200M220 66C210 120 190 170 170 210" fill="none" stroke="#7A5230" strokeWidth="9" strokeLinecap="round" />
      {[[520, 22, 160], [470, 50, 70], [400, 60, 120], [350, 60, 200], [300, 58, 40], [250, 66, 150], [180, 82, 100], [110, 114, 175], [60, 150, 130], [400, 120, 20], [372, 170, 150], [350, 200, 80], [200, 140, 160], [170, 210, 110], [190, 180, 10], [560, 0, 80]].map(([x, y, r], i) => leaf(x, y, r, 0.9 + (i % 3) * 0.12, i % 3 === 1 ? "#2FB066" : "#1E8E4E"))}
      <g className="rv-hang"><Lemon x={330} y={262} s={1.25} r={8} /></g>
      <g className="rv-hang rv-hang-2"><Lemon x={440} y={132} s={1.1} r={-12} /></g>
      <g className="rv-hang"><Lemon x={152} y={272} s={1.15} r={-6} /></g>
      <g className="rv-hang rv-hang-2"><Lemon x={92} y={206} r={14} /></g>
      <g className="rv-hang"><Lemon x={250} y={136} s={0.95} r={10} /></g>
    </svg>
  );
}

function Sea() {
  const house = (x: number, y: number, w: number, h: number, c: string) => (
    <g key={`${x}${y}`}>
      <path d={`M${x} ${y}h${w}v${-h}h${-w}z`} fill={c} />
      <path d={`M${x - 3} ${y - h}h${w + 6}v-6h${-w - 6}z`} fill="#E2603C" />
      <path d={`M${x + w * 0.22} ${y - h * 0.72}h${w * 0.18}v${h * 0.26}h${-w * 0.18}zM${x + w * 0.6} ${y - h * 0.72}h${w * 0.18}v${h * 0.26}h${-w * 0.18}z`} fill="#1456D8" />
    </g>
  );
  return (
    <svg viewBox="0 0 600 800" preserveAspectRatio="xMidYMid slice" className="rv-sea" aria-hidden="true">
      <defs>
        <linearGradient id="rv-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#4FB6FF" /><stop offset="1" stopColor="#E2F6FF" /></linearGradient>
        <linearGradient id="rv-water" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#16A3D9" /><stop offset="1" stopColor="#0B4FC4" /></linearGradient>
      </defs>
      <path d="M0 0h600v460H0z" fill="url(#rv-sky)" />
      <circle cx="420" cy="180" r="74" fill="#FFD51F" />
      <g fill="#fff"><ellipse cx="150" cy="170" rx="70" ry="20" /><ellipse cx="190" cy="152" rx="44" ry="20" /><ellipse cx="520" cy="290" rx="56" ry="15" /></g>
      <path d="M0 470C40 360 110 330 170 350C210 300 270 330 300 400L330 470Z" fill="#2F9E5B" />
      <path d="M0 470C30 410 80 390 130 410C180 420 220 440 250 470Z" fill="#1E7E48" />
      {[house(20, 470, 46, 70, "#FFD7C4"), house(70, 470, 40, 96, "#FFF1C9"), house(114, 470, 48, 62, "#FFB4A0"), house(166, 470, 38, 82, "#FFFFFF"), house(208, 470, 44, 54, "#FFD980"), house(50, 404, 36, 46, "#FFFFFF"), house(96, 398, 40, 52, "#FFC7B0"), house(150, 404, 34, 44, "#FFF1C9")]}
      <path d="M0 468h600v332H0z" fill="url(#rv-water)" />
      <g stroke="#BDEBFF" strokeWidth="4" strokeLinecap="round" opacity="0.75">{[500, 540, 590, 650, 720].map((y, i) => <path key={y} d={`M${60 + i * 40} ${y}h${80 + i * 14}M${330 - i * 12} ${y + 18}h${110 + i * 10}M${500 - i * 20} ${y + 4}h70`} />)}</g>
      <g className="rv-boat">
        <path d="M380 560h130c-8 28-30 40-65 40s-57-12-65-40z" fill="#E5383B" />
        <path d="M384 568h122" stroke="#fff" strokeWidth="5" />
        <path d="M446 556V408" stroke="#7A5230" strokeWidth="5" />
        <path d="M452 412c44 40 60 86 60 136h-60z" fill="#fff" />
        <path d="M440 430c-34 34-48 76-50 118h50z" fill="#FFD51F" />
      </g>
    </svg>
  );
}

function Shutter({ side }: { side: "l" | "r" }) {
  return (
    <span className={`rv-shut rv-shut-${side}`}>
      <i />
    </span>
  );
}

function Bougainvillea({ className }: { className: string }) {
  const pts = Array.from({ length: 74 }, (_, i) => {
    const t = i / 74;
    const a = i * 2.4;
    return { x: +(60 + Math.cos(a) * (46 + (i % 7) * 7) + t * 70).toFixed(1), y: +(40 + t * 560 + Math.sin(a) * 34).toFixed(1), r: (i * 47) % 360, c: ["#E0218A", "#FF4FA0", "#C2157A", "#FF7AB8"][i % 4], s: +(0.7 + (i % 5) * 0.12).toFixed(2) };
  });
  return (
    <svg viewBox="-40 0 300 660" className={className} aria-hidden="true">
      <path d="M40 0C70 160 40 300 110 420C140 500 120 580 150 640" fill="none" stroke="#2A7A3E" strokeWidth="8" />
      {pts.map((p, i) =>
        i % 5 === 0 ? (
          <path key={i} d="M0 0C10 -14 32 -14 44 0C32 12 10 12 0 0Z" fill="#2FA055" transform={`translate(${p.x} ${p.y}) rotate(${p.r})`} />
        ) : (
          <g key={i} transform={`translate(${p.x} ${p.y}) rotate(${p.r}) scale(${p.s})`}>
            {[0, 120, 240].map((k) => <path key={k} d="M0 0C-16 -8 -16 -30 0 -38C16 -30 16 -8 0 0Z" fill={p.c} transform={`rotate(${k})`} />)}
            <circle r="4" fill="#FFF4C2" />
          </g>
        ),
      )}
    </svg>
  );
}

export function ShutterHero() {
  const ref = useRef<HTMLElement | null>(null);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setOpen(true), 700);
    return () => window.clearTimeout(t);
  }, []);
  useScrollVar(ref);
  return (
    <section ref={ref} className="rv-hero" data-open={open || undefined}>
      <div className="rv-stage">
        <div className="rv-shade" />
        <div className="rv-copy">
          <h1>Invitations that open like a <em>ceremony</em></h1>
          <p>Your guests break the seal, throw open the doors or unwrap the gift, and your day comes pouring in.</p>
          <Link href="/templates" className="rv-btn" onPointerEnter={(e) => burstFrom(e.currentTarget, 16)}>Start designing free <ArrowRight size={18} /></Link>
        </div>
        <button type="button" className="rv-window" onClick={() => setOpen((o) => !o)} aria-label={open ? "Close the shutters" : "Open the shutters"}>
          <span className="rv-pane"><Sea /></span>
          <Shutter side="l" />
          <Shutter side="r" />
          <span className="rv-sill" />
        </button>
        <Bougainvillea className="rv-boug" />
        <Branch className="rv-branch" />
        <div className="rv-tiles" />
        <div className="rv-veil" />
      </div>
    </section>
  );
}

const tint = ["#E5383B", "#1E8E4E", "#FF7A2F", "#E0218A", "#1456D8", "#0FA3B1", "#7A3FC4"];

/** Painted tiles. Press one to turn it over. */
export function TileWall() {
  const [flip, setFlip] = useState<number | null>(null);
  return (
    <ul className="rv-wall">
      {gOpenings.map((o, i) => (
        <li key={o.id}>
          <button type="button" aria-pressed={flip === i} className="rv-tile" onClick={() => setFlip(flip === i ? null : i)} style={{ "--e1": tint[i], "--e2": "#0B3C9C", "--g1": "#FFD51F", "--g2": "#E09B00", "--l": "#FFFFFF" } as CSSProperties}>
            <span className="rv-face">
              <svg viewBox="0 0 240 240" className="rv-tile-art" aria-hidden="true">
                {[0, 90, 180, 270].map((r) => (
                  <g key={r} transform={`rotate(${r} 120 120)`}>
                    <path d="M0 0h62a62 62 0 0 1-62 62z" fill="#1456D8" />
                    <path d="M0 0h34a34 34 0 0 1-34 34z" fill="#FFD51F" />
                    <path d="M92 0h56c-4 20-14 30-28 34c-14-4-24-14-28-34z" fill="#1456D8" />
                    <circle cx="120" cy="10" r="6" fill="#fff" />
                  </g>
                ))}
              </svg>
              <GEmblem id={o.id} className="rv-tile-em" />
            </span>
            <span className="rv-back" style={{ background: tint[i] }}>
              <b>{o.label}</b>
              <span>{o.text}</span>
            </span>
          </button>
          <p>{o.label}</p>
        </li>
      ))}
      <li className="rv-wall-end">
        <p>Turn a tile to see how each one opens.</p>
        <Link href="/templates" className="rv-link">Try them live <ArrowRight size={16} /></Link>
      </li>
    </ul>
  );
}

export function Postcards() {
  const [top, setTop] = useState(0);
  return (
    <div className="rv-post" data-top={top}>
      {lives.map((x, i) => (
        <button key={x.tag} type="button" className="rv-card" style={{ "--n": (i - top + 3) % 3 } as CSSProperties} aria-pressed={i === top} onClick={() => setTop(i === top ? (top + 1) % 3 : i)}>
          <span className={`rv-view rv-view-${i}`}>
            <i className="rv-disc" />
            <svg viewBox="0 0 400 200" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
              <path d="M0 120C60 60 110 80 150 110C190 70 240 90 270 130L400 130V200H0Z" fill="currentColor" opacity="0.55" />
              <path d="M0 130h400v70H0z" fill="currentColor" />
              <path d="M250 150h60c-4 14-14 20-30 20s-26-6-30-20zM280 148V96c22 16 30 34 30 52z" fill="#fff" />
            </svg>
          </span>
          <span className="rv-msg">
            <small>{x.tag}</small>
            <b>{x.title}</b>
            <span>{x.text}</span>
          </span>
          <span className="rv-stamp"><svg viewBox="-44 -44 88 88" aria-hidden="true"><Lemon s={0.9} r={-18} /></svg></span>
        </button>
      ))}
    </div>
  );
}
