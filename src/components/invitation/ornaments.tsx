import type { OrnamentId } from "@/lib/invitation/types";
import type { ReactElement, SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.1,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** Mirror children across the vertical centre line of a viewBox of the given width. */
function Mirror({ w, children }: { w: number; children: React.ReactNode }) {
  return (
    <>
      <g>{children}</g>
      <g transform={`translate(${w} 0) scale(-1 1)`}>{children}</g>
    </>
  );
}

const sparkle = (cx: number, cy: number, r: number) =>
  `M${cx} ${cy - r}Q${cx} ${cy} ${cx + r} ${cy}Q${cx} ${cy} ${cx} ${cy + r}Q${cx} ${cy} ${cx - r} ${cy}Q${cx} ${cy} ${cx} ${cy - r}Z`;

const leaf = (len: number, wid: number) =>
  `M0 0C${len * 0.3} ${-wid} ${len * 0.75} ${-wid} ${len} 0C${len * 0.75} ${wid} ${len * 0.3} ${wid} 0 0Z`;

/* ------------------------------------------------------------------ */
/* Dividers: wide, short flourishes placed between sections. 240 x 28  */
/* ------------------------------------------------------------------ */

const dividers: Record<OrnamentId, () => ReactElement> = {
  liyawel: () => (
    <>
      <path d="M120 5l5.5 9-5.5 9-5.5-9z" {...stroke} />
      <circle cx="120" cy="14" r="1.4" fill="currentColor" />
      <Mirror w={240}>
        <path d="M131 14c9-9 20-9 29 0s20 9 29 0" {...stroke} />
        <path d="M145 7.6c2-6 11-5 10 1.400-.6 3.800-5.600 4-6 .6" {...stroke} />
        <path d="M174 20.400c2 6 11 5 10-1.400-.6-3.800-5.600-4-6-.6" {...stroke} />
        <path d="M189 14q9-8 20 0q-11 8-20 0z" {...stroke} />
        <path d="M213 14h14" {...stroke} />
        <circle cx="231" cy="14" r="1.300" fill="currentColor" />
      </Mirror>
    </>
  ),
  lotus: () => (
    <>
      <path d="M120 3c6 6 6 13 0 20c-6-7-6-14 0-20z" {...stroke} />
      <Mirror w={240}>
        <path d="M120 23c7-2 13-8 14-15c-7 1-12 7-14 15z" {...stroke} />
        <path d="M120 23c10 0 20-4 25-10c-9-1-19 3-25 10z" {...stroke} />
        <path d="M152 19h70" {...stroke} />
        <circle cx="227" cy="19" r="1.500" fill="currentColor" />
        <circle cx="160" cy="19" r="1" fill="currentColor" />
      </Mirror>
    </>
  ),
  botanical: () => (
    <>
      <circle cx="120" cy="14" r="1.8" fill="currentColor" />
      <Mirror w={240}>
        <path d="M130 14c24-2 48-2 76 0" {...stroke} />
        {[146, 168, 190].map((x) => (
          <g key={x}>
            <path d={leaf(18, 5.5)} transform={`translate(${x} 13.5) rotate(-32)`} {...stroke} />
            <path d={leaf(18, 5.5)} transform={`translate(${x - 8} 14.5) rotate(32)`} {...stroke} />
          </g>
        ))}
        <path d={leaf(18, 5)} transform="translate(204 14)" {...stroke} />
      </Mirror>
    </>
  ),
  deco: () => (
    <>
      <path d="M120 4l8 10-8 10-8-10z" {...stroke} />
      <path d="M120 9l4 5-4 5-4-5z" fill="currentColor" />
      <Mirror w={240}>
        <path d="M134 14h92" {...stroke} />
        <path d="M134 9.500h46M134 18.500h46" {...stroke} />
        <path d="M186 9.500l4 4.500-4 4.500" {...stroke} />
      </Mirror>
    </>
  ),
  stars: () => (
    <>
      <path d={sparkle(120, 14, 10)} fill="currentColor" />
      <Mirror w={240}>
        <path d="M140 14h74" {...stroke} />
        <path d={sparkle(152, 14, 4)} fill="currentColor" />
        <path d={sparkle(222, 14, 3)} fill="currentColor" />
        <circle cx="178" cy="8" r="1" fill="currentColor" />
        <circle cx="196" cy="20" r="0.800" fill="currentColor" />
      </Mirror>
    </>
  ),
  kolam: () => (
    <>
      {[60, 84, 108, 132, 156, 180].map((x) => (
        <circle key={x} cx={x} cy="14" r="1.700" fill="currentColor" />
      ))}
      <path
        d="M48 14c6-12 18-12 24 0s18 12 24 0s18-12 24 0s18 12 24 0s18-12 24 0s18 12 24 0"
        {...stroke}
      />
      <path
        d="M48 14c6 12 18 12 24 0s18-12 24 0s18 12 24 0s18-12 24 0s18 12 24 0s18-12 24 0"
        {...stroke}
      />
      <path d="M22 14h18M200 14h18" {...stroke} />
    </>
  ),
  geometric: () => (
    <>
      <g transform="translate(120 14)" {...stroke}>
        <rect x="-7.500" y="-7.500" width="15" height="15" />
        <rect x="-7.500" y="-7.500" width="15" height="15" transform="rotate(45)" />
        <circle r="2" fill="currentColor" stroke="none" />
      </g>
      <Mirror w={240}>
        <path d="M138 14h80" {...stroke} />
        <path d="M150 10l4 4-4 4-4-4z" fill="currentColor" />
        <path d="M224 10.500l3.500 3.500-3.500 3.500-3.500-3.500z" {...stroke} />
      </Mirror>
    </>
  ),
  confetti: () => (
    <>
      <circle cx="120" cy="14" r="4" fill="currentColor" />
      <Mirror w={240}>
        <path d="M134 18q5-10 10 0t10 0" {...stroke} strokeWidth={2} />
        <rect x="164" y="8" width="6" height="6" rx="1" fill="currentColor" opacity="0.550" transform="rotate(20 167 11)" />
        <circle cx="182" cy="18" r="2.500" fill="currentColor" opacity="0.800" />
        <path d="M194 8l5 8h-10z" fill="currentColor" opacity="0.450" />
        <path d="M208 16q4-8 8 0" {...stroke} strokeWidth={2} />
        <circle cx="226" cy="10" r="1.800" fill="currentColor" opacity="0.600" />
      </Mirror>
    </>
  ),
  waves: () => (
    <>
      {[9, 14, 19].map((y, i) => (
        <path
          key={y}
          d={`M${56 + i * 16} ${y}q8-6 16 0${"t16 0".repeat(7 - i * 2)}`}
          {...stroke}
          opacity={1 - i * 0.25}
        />
      ))}
    </>
  ),
  minimal: () => (
    <>
      <path d="M70 14h40M130 14h40" {...stroke} />
      <path d="M120 9.500l4.500 4.500-4.500 4.500-4.500-4.500z" {...stroke} />
    </>
  ),
};

export function Divider({ kind, ...props }: { kind: OrnamentId } & P) {
  const Body = dividers[kind] ?? dividers.minimal;
  return (
    <svg viewBox="0 0 240 28" aria-hidden="true" {...props}>
      <Body />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Crests: emblem shown above the names. 160 x 90                      */
/* ------------------------------------------------------------------ */

function laurel(side: 1 | -1) {
  const items = [];
  for (let i = 0; i < 7; i++) {
    const a = (200 - i * 21) * (Math.PI / 180);
    const cx = 80 + side * Math.cos(a) * -46;
    const cy = 44 - Math.sin(a) * 40 + 30;
    const rot = side === 1 ? -(i * 21) + 250 : i * 21 - 70;
    items.push(
      <path key={`${side}${i}`} d={leaf(15, 4.500)} transform={`translate(${cx.toFixed(1)} ${cy.toFixed(1)}) rotate(${rot})`} {...stroke} />,
    );
  }
  return items;
}

const crests: Record<OrnamentId, () => ReactElement> = {
  liyawel: () => (
    <>
      <path d="M80 6c15 17 18 30 0 46c-18-16-15-29 0-46z" {...stroke} />
      <path d="M80 18v26M80 28c4-2 6-5 7-9M80 34c-4-2-6-5-7-9" {...stroke} />
      <Mirror w={160}>
        <path d="M84 58c18 1 30-8 30-19c0-8-10-10-12-2c-1 5 5 7 7 3" {...stroke} />
        <path d="M92 68c24 3 46-8 50-26c2-9-9-11-10-3c-.6 4 4 5.500 5.500 2.500" {...stroke} />
        <path d="M84 76c10 4 22 4 34-1" {...stroke} />
        <circle cx="124" cy="80" r="1.400" fill="currentColor" />
      </Mirror>
      <circle cx="80" cy="64" r="2" fill="currentColor" />
      <path d="M80 70v12" {...stroke} />
    </>
  ),
  lotus: () => (
    <>
      <path d="M80 8c12 14 12 30 0 48c-12-18-12-34 0-48z" {...stroke} />
      <Mirror w={160}>
        <path d="M80 56c13-7 22-22 21-38c-11 6-19 20-21 38z" {...stroke} />
        <path d="M80 56c18-2 34-14 40-30c-15 0-32 12-40 30z" {...stroke} />
        <path d="M80 56c20 4 42-2 54-15c-18-5-40 1-54 15z" {...stroke} />
        <path d="M92 66c12 3 26 3 40-1M100 74c8 2 16 2 24 0" {...stroke} />
      </Mirror>
      <path d="M68 66c8 2 16 2 24 0" {...stroke} />
      <circle cx="80" cy="82" r="1.500" fill="currentColor" />
    </>
  ),
  botanical: () => (
    <>
      <path d="M80 82c-30-2-48-22-44-52" {...stroke} />
      <path d="M80 82c30-2 48-22 44-52" {...stroke} />
      {laurel(1)}
      {laurel(-1)}
      <circle cx="80" cy="82" r="1.800" fill="currentColor" />
    </>
  ),
  deco: () => (
    <>
      {[-75, -60, -45, -30, -15, 0, 15, 30, 45, 60, 75].map((a) => (
        <path key={a} d="M80 78V22" transform={`rotate(${a} 80 78)`} {...stroke} opacity={a % 30 === 0 ? 1 : 0.550} />
      ))}
      <path d="M22 78a58 58 0 0 1 116 0" {...stroke} />
      <path d="M40 78a40 40 0 0 1 80 0" {...stroke} />
      <path d="M62 78a18 18 0 0 1 36 0z" fill="currentColor" stroke="none" />
      <path d="M10 82h140" {...stroke} />
    </>
  ),
  stars: () => (
    <>
      <path d="M96 20a30 30 0 1 0 22 48a24 24 0 0 1-22-48z" {...stroke} />
      <path d={sparkle(52, 30, 13)} fill="currentColor" />
      <path d={sparkle(30, 58, 6)} fill="currentColor" />
      <path d={sparkle(70, 62, 4)} fill="currentColor" />
      <path d={sparkle(134, 22, 5)} fill="currentColor" />
      <circle cx="40" cy="14" r="1.200" fill="currentColor" />
      <circle cx="140" cy="64" r="1.200" fill="currentColor" />
      <circle cx="78" cy="12" r="1" fill="currentColor" />
    </>
  ),
  kolam: () => (
    <g transform="translate(80 45)">
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
        <path
          key={a}
          d={a % 90 === 0 ? "M0 0C12-14 30-14 38 0C30 14 12 14 0 0Z" : "M0 0C8-9 20-9 26 0C20 9 8 9 0 0Z"}
          transform={`rotate(${a})`}
          {...stroke}
        />
      ))}
      {[0, 90, 180, 270].map((a) => (
        <circle key={a} cx="26" cy="0" r="1.800" fill="currentColor" transform={`rotate(${a})`} />
      ))}
      {[45, 135, 225, 315].map((a) => (
        <circle key={a} cx="34" cy="0" r="1.500" fill="currentColor" transform={`rotate(${a})`} />
      ))}
      <circle r="3" fill="currentColor" />
    </g>
  ),
  geometric: () => (
    <g transform="translate(80 45)" {...stroke}>
      <rect x="-27" y="-27" width="54" height="54" />
      <rect x="-27" y="-27" width="54" height="54" transform="rotate(45)" />
      <rect x="-15" y="-15" width="30" height="30" />
      <rect x="-15" y="-15" width="30" height="30" transform="rotate(45)" />
      <circle r="41" />
      <circle r="4" fill="currentColor" stroke="none" />
      <path d="M-70 0h24M46 0h24" />
    </g>
  ),
  confetti: () => (
    <>
      <ellipse cx="58" cy="32" rx="15" ry="19" fill="currentColor" opacity="0.850" />
      <ellipse cx="102" cy="32" rx="15" ry="19" fill="currentColor" opacity="0.550" />
      <ellipse cx="80" cy="24" rx="16" ry="20" fill="currentColor" />
      <path d="M80 44q-3 14 0 22t0 20M58 51q8 12 20 20M102 51q-8 12-20 20" {...stroke} />
      <circle cx="26" cy="20" r="3" fill="currentColor" opacity="0.600" />
      <circle cx="136" cy="58" r="2.500" fill="currentColor" opacity="0.700" />
      <path d="M130 14l6 9h-12z" fill="currentColor" opacity="0.450" />
      <path d="M18 60q5-9 10 0t10 0" {...stroke} strokeWidth={2} />
    </>
  ),
  waves: () => (
    <>
      <path d="M52 50a28 28 0 0 1 56 0" {...stroke} />
      {[0, 30, 60, 90, 120, 150, 180].map((a) => (
        <path key={a} d="M80 50h-40" transform={`rotate(${a} 80 50) translate(-36 0) scale(0.220 1)`} {...stroke} />
      ))}
      <path d="M24 60q9-7 18 0t18 0t18 0t18 0t18 0t18 0" {...stroke} />
      <path d="M38 70q9-7 18 0t18 0t18 0t18 0t18 0" {...stroke} opacity="0.700" />
      <path d="M56 80q9-7 18 0t18 0t18 0" {...stroke} opacity="0.450" />
    </>
  ),
  minimal: () => (
    <>
      <path d="M80 18v40" {...stroke} />
      <path d="M80 62l5 6-5 6-5-6z" {...stroke} />
    </>
  ),
};

export function Crest({ kind, ...props }: { kind: OrnamentId } & P) {
  const Body = crests[kind] ?? crests.minimal;
  return (
    <svg viewBox="0 0 160 90" aria-hidden="true" {...props}>
      <Body />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Corners: drawn for the top-left corner, flipped for the others.     */
/* ------------------------------------------------------------------ */

const corners: Record<OrnamentId, () => ReactElement> = {
  liyawel: () => (
    <>
      <path d="M4 96V30C4 14 14 4 30 4h66" {...stroke} />
      <path d="M14 66c0-30 22-52 52-52" {...stroke} />
      <path d="M66 14c11 0 13 13 4 14c-6 .6-7.500-6-3-7" {...stroke} />
      <path d="M14 66c0 11 13 13 14 4c.6-6-6-7.500-7-3" {...stroke} />
      <path d="M22 22c22-3 30 5 30 26c-22 1-32-6-30-26z" {...stroke} />
      <path d="M26 26l20 18" {...stroke} />
      <circle cx="84" cy="14" r="1.400" fill="currentColor" />
      <circle cx="14" cy="84" r="1.400" fill="currentColor" />
    </>
  ),
  lotus: () => (
    <g transform="translate(6 6)">
      {[8, 45, 82].map((a) => (
        <path key={a} d="M8 0C22-11 44-9 58 0C44 9 22 11 8 0Z" transform={`rotate(${a})`} {...stroke} />
      ))}
      {[26.500, 63.500].map((a) => (
        <path key={a} d="M8 0C16-6 30-5 38 0C30 5 16 6 8 0Z" transform={`rotate(${a})`} {...stroke} />
      ))}
      <path d="M70 0a70 70 0 0 1-70 70" {...stroke} opacity="0.600" />
      <circle r="3" fill="currentColor" />
    </g>
  ),
  botanical: () => (
    <>
      <path d="M6 6c20 26 40 46 84 60" {...stroke} />
      {[
        [18, 20, 5], [30, 33, 75], [44, 45, 0], [56, 53, 70], [70, 60, -5],
      ].map(([x, y, r], i) => (
        <path key={i} d={leaf(20, 6)} transform={`translate(${x} ${y}) rotate(${r})`} {...stroke} />
      ))}
      <path d="M6 6c4 22 8 40 6 70" {...stroke} opacity="0.700" />
      {[
        [8, 26, 60], [11, 44, 120], [12, 60, 65],
      ].map(([x, y, r], i) => (
        <path key={`b${i}`} d={leaf(14, 4.500)} transform={`translate(${x} ${y}) rotate(${r})`} {...stroke} opacity="0.700" />
      ))}
    </>
  ),
  deco: () => (
    <>
      <path d="M4 96V4h92" {...stroke} />
      <path d="M12 80V12h68" {...stroke} />
      <path d="M20 56V20h36" {...stroke} />
      {[15, 30, 45, 60, 75].map((a) => (
        <path key={a} d="M20 20h30" transform={`rotate(${a} 20 20)`} {...stroke} opacity="0.700" />
      ))}
      <path d="M20 50a30 30 0 0 0 30-30" {...stroke} />
    </>
  ),
  stars: () => (
    <>
      <path d="M4 70V4h66" {...stroke} opacity="0.700" />
      <path d={sparkle(26, 26, 12)} fill="currentColor" />
      <path d={sparkle(52, 16, 5)} fill="currentColor" />
      <path d={sparkle(16, 54, 4)} fill="currentColor" />
      <circle cx="46" cy="42" r="1.300" fill="currentColor" />
      <circle cx="70" cy="26" r="1" fill="currentColor" />
      <circle cx="30" cy="72" r="1" fill="currentColor" />
    </>
  ),
  kolam: () => (
    <g transform="translate(8 8)">
      {[0, 45, 90].map((a) => (
        <path key={a} d="M0 0C14-13 40-13 52 0C40 13 14 13 0 0Z" transform={`rotate(${a})`} {...stroke} />
      ))}
      {[22.500, 67.500].map((a) => (
        <circle key={a} cx="44" cy="0" r="1.800" fill="currentColor" transform={`rotate(${a})`} />
      ))}
      {[0, 45, 90].map((a) => (
        <circle key={`o${a}`} cx="62" cy="0" r="1.500" fill="currentColor" transform={`rotate(${a})`} />
      ))}
      <circle r="3" fill="currentColor" />
    </g>
  ),
  geometric: () => (
    <>
      <path d="M4 96V4h92" {...stroke} />
      <g transform="translate(30 30)" {...stroke}>
        <rect x="-14" y="-14" width="28" height="28" />
        <rect x="-14" y="-14" width="28" height="28" transform="rotate(45)" />
        <circle r="3" fill="currentColor" stroke="none" />
      </g>
      <path d="M56 12l4 4-4 4-4-4zM12 56l4 4-4 4-4-4z" fill="currentColor" />
      <path d="M68 16h22M16 68v22" {...stroke} />
    </>
  ),
  confetti: () => (
    <>
      <circle cx="16" cy="16" r="6" fill="currentColor" opacity="0.850" />
      <rect x="36" y="8" width="9" height="9" rx="1.500" fill="currentColor" opacity="0.500" transform="rotate(18 40 12)" />
      <path d="M12 40l8 12H4z" fill="currentColor" opacity="0.450" />
      <path d="M56 22q5-10 10 0t10 0" {...stroke} strokeWidth={2.200} />
      <path d="M26 62q-8-6 0-12t0-12" {...stroke} strokeWidth={2.200} />
      <circle cx="44" cy="40" r="3" fill="currentColor" opacity="0.650" />
      <circle cx="84" cy="10" r="2" fill="currentColor" opacity="0.500" />
      <circle cx="10" cy="80" r="2" fill="currentColor" opacity="0.500" />
    </>
  ),
  waves: () => (
    <>
      {[18, 34, 50, 66].map((r, i) => (
        <path key={r} d={`M4 ${4 + r}a${r} ${r} 0 0 0 ${r}-${r}`} {...stroke} opacity={1 - i * 0.200} />
      ))}
    </>
  ),
  minimal: () => <path d="M4 44V4h40" {...stroke} />,
};

export function Corner({ kind, ...props }: { kind: OrnamentId } & P) {
  const Body = corners[kind] ?? corners.minimal;
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" {...props}>
      <Body />
    </svg>
  );
}

/** Four corners placed inside a relatively positioned parent. */
export function CornerFrame({ kind, size = 72, inset = 14, className = "", color }: { kind: OrnamentId; size?: number; inset?: number; className?: string; color?: string }) {
  const base = { position: "absolute" as const, width: size, height: size };
  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`} style={color ? { color } : undefined} aria-hidden="true">
      <Corner kind={kind} style={{ ...base, top: inset, left: inset }} />
      <Corner kind={kind} style={{ ...base, top: inset, right: inset, transform: "scaleX(-1)" }} />
      <Corner kind={kind} style={{ ...base, bottom: inset, left: inset, transform: "scaleY(-1)" }} />
      <Corner kind={kind} style={{ ...base, bottom: inset, right: inset, transform: "scale(-1,-1)" }} />
    </div>
  );
}

export const ornamentLabels: Record<OrnamentId, string> = {
  liyawel: "Liyawel scroll",
  lotus: "Lotus",
  botanical: "Botanical",
  deco: "Art deco",
  stars: "Stars",
  kolam: "Kolam",
  geometric: "Geometric star",
  confetti: "Confetti",
  waves: "Waves",
  minimal: "Minimal",
};
