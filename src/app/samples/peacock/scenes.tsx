"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { lives, openings } from "../_parts/content";
import { Emblem, Lotus } from "../_parts/Emblem";
import { burstFrom } from "../_parts/hooks";

function FeatherDefs({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={`${id}-vane`} x1="0" y1="1" x2="0" y2="0">
        <stop offset="0" stopColor="#0B4D45" />
        <stop offset="0.5" stopColor="#0E8F6E" />
        <stop offset="1" stopColor="#5FD08A" />
      </linearGradient>
      <radialGradient id={`${id}-eye`} cx="0.5" cy="0.55" r="0.6">
        <stop offset="0" stopColor="#1FC3C9" />
        <stop offset="1" stopColor="#0A6FA8" />
      </radialGradient>
      <symbol id={`${id}-f`} viewBox="-60 -470 120 480" overflow="visible">
        <path d="M0 0C-12 -120 -50 -230 -50 -340C-50 -420 -24 -456 0 -466C24 -456 50 -420 50 -340C50 -230 12 -120 0 0Z" fill={`url(#${id}-vane)`} />
        <g stroke="#F2C85B" strokeOpacity="0.5" strokeWidth="1.4" fill="none">
          {Array.from({ length: 15 }, (_, i) => {
            const y = -70 - i * 17;
            const w = 8 + i * 2.7;
            return <path key={i} d={`M0 ${y}q${-w * 0.5} -10 ${-w} -34M0 ${y}q${w * 0.5} -10 ${w} -34`} />;
          })}
        </g>
        <path d="M0 0V-330" stroke="#F2C85B" strokeWidth="3" />
        <path d="M0 -318C-38 -330 -46 -396 0 -448C46 -396 38 -330 0 -318Z" fill="#C9922A" />
        <path d="M0 -326C-31 -336 -38 -392 0 -436C38 -392 31 -336 0 -326Z" fill="#12A67C" />
        <ellipse cy="-372" rx="25" ry="33" fill="#F2C85B" />
        <ellipse cy="-371" rx="21" ry="29" fill={`url(#${id}-eye)`} />
        <path d="M0 -346C-16 -352 -18 -378 -8 -384C-4 -386 0 -382 0 -378C0 -382 4 -386 8 -384C18 -378 16 -352 0 -346Z" fill="#1B1464" />
        <ellipse cy="-362" rx="5" ry="7" fill="#E0447F" />
      </symbol>
    </defs>
  );
}

const rings = [
  { n: 21, spread: 104, s: 1.36, delay: 0 },
  { n: 17, spread: 100, s: 1.06, delay: 130 },
  { n: 13, spread: 96, s: 0.77, delay: 260 },
];

function Feathers({ id, open }: { id: string; open: boolean }) {
  return (
    <>
      <FeatherDefs id={id} />
      {rings.map((r, ri) => (
        <g key={ri}>
          {Array.from({ length: r.n }, (_, i) => {
            const k = (i / (r.n - 1)) * 2 - 1;
            return (
              <g
                key={i}
                className="pb-feather"
                style={{
                  transform: open ? `rotate(${(k * r.spread).toFixed(2)}deg) scale(${r.s})` : `rotate(${(k * 9).toFixed(2)}deg) scale(${(r.s * 0.72).toFixed(3)})`,
                  transitionDelay: `${r.delay + Math.abs(k) * 320}ms`,
                }}
              >
                <use href={`#${id}-f`} x="-60" y="-470" width="120" height="480" />
              </g>
            );
          })}
        </g>
      ))}
    </>
  );
}

function Bird() {
  return (
    <g className="pb-bird">
      <path d="M-92 96C-116 20 -84 -60 -50 -116C-28 -152 -36 -194 -16 -222C0 -244 32 -242 40 -220C47 -200 32 -188 26 -166C14 -118 78 -66 92 14C99 52 96 78 92 96Z" fill="#1B1464" />
      <path d="M-70 96C-90 30 -62 -44 -32 -98C-12 -136 -18 -180 -2 -206C-2 -160 4 -120 20 -92C50 -46 70 10 66 96Z" fill="#1440A8" />
      {Array.from({ length: 6 }, (_, r) => (
        <path key={r} d={Array.from({ length: 5 }, (_, c) => `M${-48 + c * 24 + (r % 2) * 10} ${76 - r * 30}q12 -22 24 0`).join("")} fill="none" stroke="#35C9C0" strokeWidth="3" opacity={0.95 - r * 0.1} />
      ))}
      <path d="M40 -222L74 -208L38 -203Z" fill="#F2C85B" />
      <path d="M4 -216C12 -232 30 -230 34 -218C28 -210 12 -208 4 -216Z" fill="#FFF4DF" />
      <circle cx="21" cy="-219" r="6" fill="#1B1464" />
      {[-34, -16, 2, 20].map((a) => (
        <g key={a} transform={`translate(8 -236) rotate(${a})`}>
          <path d="M0 0V-46" stroke="#F2C85B" strokeWidth="3" />
          <path d="M0 -74C9 -64 9 -54 0 -46C-9 -54 -9 -64 0 -74Z" fill="#35C9C0" stroke="#F2C85B" strokeWidth="2" />
        </g>
      ))}
      <path d="M-58 -66C-20 -34 28 -32 58 -58" fill="none" stroke="#F2C85B" strokeWidth="9" />
      <path d="M-62 -46C-22 -12 30 -10 66 -36" fill="none" stroke="#E0447F" strokeWidth="8" strokeDasharray="0 14" strokeLinecap="round" />
      <path d="M0 -32l13 18-13 22-13-22z" fill="#E0447F" stroke="#F2C85B" strokeWidth="3" />
    </g>
  );
}

export function PeacockHero() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const t = window.setTimeout(() => setOpen(true), 500);
    return () => window.clearTimeout(t);
  }, []);
  return (
    <section
      ref={ref}
      className="pb-hero"
      onPointerMove={(e) => ref.current?.style.setProperty("--mx", ((e.clientX / window.innerWidth - 0.5) * 2).toFixed(3))}
    >
      <div className="pb-scales" />
      <button type="button" className="pb-fan" onClick={() => setOpen((o) => !o)} aria-label={open ? "Fold the feathers" : "Open the feathers"}>
        <svg viewBox="-660 -660 1320 754" aria-hidden="true">
          <g className="pb-fan-turn"><Feathers id="pbh" open={open} /></g>
          <Bird />
        </svg>
      </button>
      <div className="pb-hero-copy">
        <p className="pb-greet"><span lang="si">ආයුබෝවන්</span> <span lang="ta">வணக்கம்</span> <span>Welcome</span></p>
        <h1>Invitations that open like a <em>ceremony</em></h1>
        <p>Your guests light the lamp, part the curtains or open the lotus, and your day unfolds in their hands.</p>
        <Link href="/templates" className="pb-btn" onPointerEnter={(e) => burstFrom(e.currentTarget, 14)}>Start designing free <ArrowRight size={18} /></Link>
      </div>
    </section>
  );
}

const jewels = ["#0E7C5A", "#12713C", "#A8124F", "#6A1257", "#C2185B", "#0D2F73", "#1B1464", "#C2410C"];

export function Windows() {
  const ref = useRef<HTMLUListElement | null>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setOn(true), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <ul ref={ref} className="pb-windows" data-on={on || undefined}>
      {openings.map((o, i) => (
        <li key={o.id} style={{ "--i": i } as CSSProperties}>
          <Link href={`/demo/${o.template}`} target="_blank">
            <span className="pb-win">
              <span className="pb-win-in" style={{ background: jewels[i], "--e1": i % 2 ? "#17A398" : "#E0447F", "--e2": i % 2 ? "#00565C" : "#8E0F4F" } as CSSProperties}><Emblem id={o.id} /></span>
              <span className="pb-shut pb-shut-l" />
              <span className="pb-shut pb-shut-r" />
            </span>
            <b>{o.label}</b>
            <small>{o.text}</small>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function Dial() {
  const [i, setI] = useState(0);
  return (
    <div className="pb-dial" data-i={i}>
      <div className="pb-dial-face">
        <svg viewBox="-300 -300 600 600" className="pb-ring" style={{ transform: `rotate(${i * -120}deg)` }} aria-hidden="true">
          {Array.from({ length: 36 }, (_, k) => (
            <path key={k} d="M0 -292C16 -270 16 -246 0 -226C-16 -246 -16 -270 0 -292Z" transform={`rotate(${k * 10})`} fill={["#E0447F", "#F2C85B", "#17A398"][k % 3]} />
          ))}
          <circle r="222" fill="none" stroke="#F2C85B" strokeWidth="3" />
          <circle r="212" fill="none" stroke="#FFF4DF" strokeWidth="7" strokeDasharray="0 16" strokeLinecap="round" />
        </svg>
        <div className="pb-dial-scene">
          <span className="pb-dial-sun" />
          <Lotus id="pbd" className="pb-dial-lotus" />
        </div>
      </div>
      <ol>
        {lives.map((x, n) => (
          <li key={x.tag}>
            <button type="button" aria-expanded={n === i} onClick={() => setI(n)}>
              <small>{x.tag}</small>
              <b>{x.title}</b>
            </button>
            <p hidden={n !== i}>{x.text}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function ClosingFan() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOpen(e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className="pb-close-fan" aria-hidden="true">
      <svg viewBox="-660 -660 1320 680"><Feathers id="pbc" open={open} /></svg>
    </div>
  );
}
