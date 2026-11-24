import type { CSSProperties, ReactNode } from "react";

export type EmblemId = "lamp" | "betel" | "doors" | "curtain" | "lotus" | "seal" | "clapper" | "gift";

const g1 = "var(--g1,#F2C85B)";
const g2 = "var(--g2,#B8791A)";
const e1 = "var(--e1,#C81E1E)";
const e2 = "var(--e2,#7E0D1C)";
const l = "var(--l,#FFF4DF)";

export function Flame({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g className="s-flame">
        <path d="M0 -38C13 -18 15 -4 0 6C-15 -4 -13 -18 0 -38Z" fill="#FF7A1A" />
        <path d="M0 -26C8 -12 9 -3 0 4C-9 -3 -8 -12 0 -26Z" fill="#FFD25E" />
        <path d="M0 -14C4 -7 4 -2 0 2C-4 -2 -4 -7 0 -14Z" fill="#FFFBE8" />
      </g>
    </g>
  );
}

const petal = (len: number, w: number) =>
  `M0 0C${-w} ${-len * 0.28} ${-w} ${-len * 0.74} 0 ${-len}C${w} ${-len * 0.74} ${w} ${-len * 0.28} 0 0Z`;

function Both({ children }: { children: ReactNode }) {
  return (
    <>
      <g>{children}</g>
      <g transform="translate(240 0) scale(-1 1)">{children}</g>
    </>
  );
}

const art: Record<EmblemId, ReactNode> = {
  lamp: (
    <>
      <path d="M120 20c7 8 9 16 5 24h-10c-4-8-2-16 5-24z" fill={g1} />
      <circle cx="120" cy="52" r="10" fill={g1} />
      <path d="M114 60h12l3 44h-18z" fill={g2} />
      <Flame x={48} y={98} s={0.82} />
      <Flame x={84} y={92} s={0.92} />
      <Flame x={156} y={92} s={0.92} />
      <Flame x={192} y={98} s={0.82} />
      <path d="M34 102h172c-8 28-42 40-86 40s-78-12-86-40z" fill={g1} />
      <path d="M34 102h172c-1 4-3 8-5 11H39c-2-3-4-7-5-11z" fill={g2} />
      <path d="M52 122c18 10 42 14 68 14s50-4 68-14" fill="none" stroke={l} strokeWidth="3" strokeDasharray="0 10" strokeLinecap="round" />
      <path d="M110 140h20l4 16h-28z" fill={g2} />
      <ellipse cx="120" cy="162" rx="26" ry="10" fill={g1} />
      <path d="M110 170h20l3 18h-26z" fill={g2} />
      <ellipse cx="120" cy="192" rx="20" ry="8" fill={g1} />
      <path d="M84 222c4-18 20-24 36-24s32 6 36 24z" fill={g1} />
      <path d="M66 222h108l8 12H58z" fill={g2} />
    </>
  ),
  betel: (
    <g transform="translate(120 206)">
      {[-64, 64, -34, 34, 0].map((a, i) => (
        <g key={a} transform={`rotate(${a})`}>
          <path
            d="M0 0C-62 -38 -60 -112 0 -178C60 -112 62 -38 0 0Z"
            fill={i < 2 ? e2 : i < 4 ? "color-mix(in srgb, var(--e1,#1E9A4A) 70%, var(--e2,#0B4D25))" : e1}
            stroke={g1}
            strokeWidth="2.5"
          />
          <path
            d="M0 0V-160M0 -30C-18 -50 -32 -66 -38 -88M0 -30C18 -50 32 -66 38 -88M0 -66C-14 -84 -24 -98 -27 -116M0 -66C14 -84 24 -98 27 -116"
            fill="none"
            stroke={g1}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </g>
      ))}
      <path d="M-30 -8h60l-8 34h-44z" fill={g1} />
      <path d="M-28 2h56M-26 12h52" stroke={g2} strokeWidth="3" />
    </g>
  ),
  doors: (
    <>
      <path d="M22 232V104C22 60 70 40 120 8c50 32 98 52 98 96v128z" fill={g1} />
      <path d="M40 232V110c0-36 40-54 80-80 40 26 80 44 80 80v122z" fill={e2} />
      <path d="M46 232V114c0-32 36-48 71-70v188z" fill={e1} />
      <path d="M194 232V114c0-32-36-48-71-70v188z" fill={e1} />
      <Both>
        <g fill="none" stroke={g1} strokeWidth="2.5">
          <path d="M58 220V122c0-22 24-36 48-52v150z" />
          <circle cx="82" cy="140" r="17" />
          <path d="M82 123v34M65 140h34M70 128l24 24M94 128l-24 24" strokeWidth="1.6" />
          <path d="M68 176h28v32H68z" />
          <path d="M82 180l10 12-10 12-10-12z" fill={g1} stroke="none" />
          <circle cx="110" cy="172" r="5" fill={g1} stroke="none" />
        </g>
      </Both>
    </>
  ),
  curtain: (
    <>
      <path d="M24 34h192v198H24z" fill={e2} opacity="0.55" />
      <Both>
        <path d="M20 30h104c-4 66-34 106-72 128 14 22 18 48 14 74H20z" fill={e1} />
        <path d="M42 30c4 60-4 104-14 128M66 30c0 58-14 98-30 126M92 30c-6 54-24 92-46 120M34 164c8 20 10 44 8 68" fill="none" stroke={e2} strokeWidth="4" opacity="0.7" />
        <path d="M22 150c14 12 28 14 40 6l-4 14c-12 4-24 2-36-6z" fill={g1} />
        <path d="M30 168l-4 34 8-4 8 6 6-6 6 2-8-32z" fill={g1} />
      </Both>
      <path d="M12 12h216v20c-18 22-36 22-54 0-18 22-36 22-54 0-18 22-36 22-54 0-18 22-36 22-54 0z" fill={g1} />
      <path d="M12 12h216v9H12z" fill={g2} />
    </>
  ),
  lotus: (
    <g transform="translate(120 196)">
      {[-84, 84, -60, 60, -36, 36, 0].map((a, i) => (
        <path key={a} d={petal(i < 2 ? 112 : 168 - i * 2, 40)} transform={`rotate(${a})`} fill={i < 4 ? e2 : e1} stroke={l} strokeWidth="2" />
      ))}
      {[-52, 52, -24, 24].map((a) => (
        <path key={a} d={petal(112, 32)} transform={`rotate(${a})`} fill="color-mix(in srgb, var(--e1,#D63A7A) 55%, var(--l,#FFF4DF))" stroke={l} strokeWidth="2" />
      ))}
      <path d={petal(96, 30)} fill={l} />
      <path d="M-92 4C-50 30 50 30 92 4C60 18 -60 18 -92 4Z" fill={g1} />
      <path d="M0 -8V-60M-8 -8L-18 -52M8 -8L18 -52" stroke={g2} strokeWidth="2.5" strokeLinecap="round" />
    </g>
  ),
  seal: (
    <>
      <path d="M96 132l-30 98 32-18 22 22 8-92zM144 132l30 98-32-18-22 22-8-92z" fill={g1} />
      <path d="M96 132l-30 98 32-18 10-72zM144 132l30 98-32-18-10-72z" fill={g2} opacity="0.55" />
      <g transform="translate(120 104)">
        {Array.from({ length: 16 }, (_, i) => (
          <circle key={i} cx={(Math.cos((i / 16) * 6.2832) * 80).toFixed(2)} cy={(Math.sin((i / 16) * 6.2832) * 80).toFixed(2)} r="18" fill={e2} />
        ))}
        <circle r="84" fill={e1} />
        <circle r="66" fill="none" stroke={e2} strokeWidth="5" />
        <circle r="58" fill="none" stroke={g1} strokeWidth="2" strokeDasharray="0 8" strokeLinecap="round" />
        <g transform="translate(0 34)" stroke={g1} strokeWidth="3" fill="none" strokeLinejoin="round">
          {[-58, 58, -30, 30, 0].map((a) => (
            <path key={a} d={petal(74, 19)} transform={`rotate(${a})`} fill={e1} />
          ))}
        </g>
      </g>
    </>
  ),
  clapper: (
    <>
      <g transform="rotate(-13 34 92)">
        <path d="M24 56h192v36H24z" fill={l} />
        <path d="M24 56h26L30 92h-6zM76 56h30L86 92H56zM132 56h30l-20 36h-30zM188 56h28v8l-18 28h-30z" fill={e2} />
      </g>
      <path d="M24 96h192v120H24z" fill={e1} />
      <path d="M24 96h192v34H24z" fill={l} />
      <path d="M24 96h26l20 34H44zM76 96h30l20 34H96zM132 96h30l20 34h-30zM188 96h28v34h-8z" fill={e2} />
      <path d="M38 146h164v56H38z" fill="none" stroke={g1} strokeWidth="3" />
      <path d="M92 146v56M148 146v56M38 174h164" stroke={g1} strokeWidth="2.5" />
      <circle cx="34" cy="92" r="8" fill={g1} />
    </>
  ),
  gift: (
    <>
      <path d="M120 70C96 20 40 22 48 54c5 20 44 22 72 16zM120 70c24-50 80-48 72-16-5 20-44 22-72 16z" fill={g1} />
      <path d="M120 68C104 40 70 34 72 50c2 12 28 18 48 18zM120 68c16-28 50-34 48-18-2 12-28 18-48 18z" fill={g2} />
      <path d="M36 112h168v118H36z" fill={e1} />
      <path d="M24 70h192v46H24z" fill={e2} />
      <path d="M102 70h36v160h-36z" fill={g1} />
      <path d="M102 70h9v160h-9z" fill={g2} opacity="0.6" />
      <path d="M36 116h168v8H36z" fill="#2b0a2e" opacity="0.16" />
      <circle cx="120" cy="72" r="13" fill={g1} stroke={g2} strokeWidth="3" />
      {[66, 174].map((x) => [148, 180, 212].map((y) => <path key={`${x}-${y}`} d={`M${x} ${y - 9}l7 9-7 9-7-9z`} fill={g1} opacity="0.85" />))}
    </>
  ),
};

/**
 * Bold emblems for the eight openings. Colours come from CSS variables so each
 * page can dress them: --e1 body, --e2 body shade, --g1 gold, --g2 gold shade, --l light.
 */
export function Emblem({ id, className, style }: { id: EmblemId; className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 240 240" className={className} style={style} aria-hidden="true">
      {art[id]}
    </svg>
  );
}

/** A lotus whose petals follow the inherited --open value, from bud (0) to bloom (1). */
export function Lotus({ className, id = "a", style }: { className?: string; id?: string; style?: CSSProperties }) {
  const rings = [
    { n: 9, spread: 92, len: 232, w: 46, fill: 3 },
    { n: 8, spread: 74, len: 220, w: 46, fill: 2 },
    { n: 7, spread: 56, len: 196, w: 42, fill: 2 },
    { n: 5, spread: 34, len: 162, w: 36, fill: 1 },
  ];
  return (
    <svg viewBox="-260 -260 520 330" className={className} style={style} aria-hidden="true">
      <defs>
        {[
          ["1", "#FFF1F4", "#F78FB5"],
          ["2", "#FFC6DA", "#E0447F"],
          ["3", "#FF9CC0", "#B8195F"],
        ].map(([k, a, b]) => (
          <linearGradient key={k} id={`lo-${id}-${k}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={a} />
            <stop offset="1" stopColor={b} />
          </linearGradient>
        ))}
      </defs>
      {rings.map((r, ri) =>
        Array.from({ length: r.n }, (_, i) => (
          <path
            key={`${ri}-${i}`}
            d={petal(r.len, r.w)}
            fill={`url(#lo-${id}-${r.fill})`}
            stroke="#fff"
            strokeOpacity="0.55"
            strokeWidth="1.4"
            style={{ transform: `rotate(calc(${(-r.spread + (2 * r.spread * i) / (r.n - 1)).toFixed(1)}deg * (0.1 + 0.9 * var(--open, 1))))` }}
          />
        )),
      )}
      <path d="M-70 6C-40 34 40 34 70 6C44 14 -44 14 -70 6Z" fill="#1E9A6A" />
    </svg>
  );
}
