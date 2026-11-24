import type { ReactElement } from "react";

/* Second collection of ornament sets. Same three roles as the first:
   divider (240 x 28), crest (160 x 90) and corner (100 x 100, top left). */

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.1,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function Mirror({ w, children }: { w: number; children: React.ReactNode }) {
  return (
    <>
      <g>{children}</g>
      <g transform={`translate(${w} 0) scale(-1 1)`}>{children}</g>
    </>
  );
}

const leaf = (len: number, wid: number) =>
  `M0 0C${len * 0.3} ${-wid} ${len * 0.75} ${-wid} ${len} 0C${len * 0.75} ${wid} ${len * 0.3} ${wid} 0 0Z`;

const sparkle = (cx: number, cy: number, r: number) =>
  `M${cx} ${cy - r}Q${cx} ${cy} ${cx + r} ${cy}Q${cx} ${cy} ${cx} ${cy + r}Q${cx} ${cy} ${cx - r} ${cy}Q${cx} ${cy} ${cx} ${cy - r}Z`;

const range = (n: number) => Array.from({ length: n }, (_, i) => i);

/* ----------------------------- shared shapes ----------------------------- */

/** Peacock feather eye, centred on 0,0 with the tip pointing up. */
function FeatherEye({ scale = 1 }: { scale?: number }) {
  return (
    <g transform={`scale(${scale})`}>
      <path d="M0 15C-12 7-11-11 0-18C11-11 12 7 0 15Z" {...stroke} strokeWidth={1.1 / scale} />
      <path d="M0 10C-7 5-6.500-6 0-10.500C6.500-6 7 5 0 10Z" {...stroke} strokeWidth={1.1 / scale} />
      <path d="M0 5.500C-3.600 3-3.400-2.500 0-5C3.400-2.500 3.600 3 0 5.500Z" fill="currentColor" />
    </g>
  );
}

/** Six armed snowflake. */
function Flake({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  const d = `M0 0V${-r}M0 ${-r * 0.5}l${-r * 0.24} ${-r * 0.22}M0 ${-r * 0.5}l${r * 0.24} ${-r * 0.22}M0 ${-r * 0.78}l${-r * 0.15} ${-r * 0.14}M0 ${-r * 0.78}l${r * 0.15} ${-r * 0.14}`;
  return (
    <g transform={`translate(${cx} ${cy})`}>
      {range(6).map((i) => (
        <path key={i} d={d} transform={`rotate(${i * 60})`} {...stroke} strokeWidth={r > 20 ? 1.3 : 1} />
      ))}
    </g>
  );
}

/** Betel leaf with its base on 0,0 and tip pointing up. */
function BetelLeaf({ L, W, fillOpacity = 0.1 }: { L: number; W: number; fillOpacity?: number }) {
  const body = `M0 0C${-W} ${-L * 0.06} ${-W * 0.98} ${-L * 0.62} 0 ${-L}C${W * 0.98} ${-L * 0.62} ${W} ${-L * 0.06} 0 0Z`;
  const vein = (s: 1 | -1, at: number, reach: number) =>
    `M0 ${-L * at}C${s * W * 0.25} ${-L * (at + 0.12)} ${s * W * reach} ${-L * (at + 0.22)} ${s * W * (reach - 0.06)} ${-L * (at + 0.36)}`;
  return (
    <g>
      <path d={body} {...stroke} fill="currentColor" fillOpacity={fillOpacity} />
      <path d={`M0 0V${-L * 0.9}`} {...stroke} strokeWidth={0.8} />
      <path d={`${vein(1, 0.12, 0.5)}${vein(-1, 0.12, 0.5)}${vein(1, 0.36, 0.34)}${vein(-1, 0.36, 0.34)}`} {...stroke} strokeWidth={0.7} opacity={0.8} />
    </g>
  );
}

const PAISLEY_OUT = "M30 78C8 78 0 54 12 36C22 20 44 10 60 14C70 17 70 30 60 30C54 30 52 24 57 22";
const PAISLEY_BACK = "M30 78C50 78 64 60 60 30";

function Paisley() {
  return (
    <g>
      <path d={PAISLEY_OUT} {...stroke} />
      <path d={PAISLEY_BACK} {...stroke} />
      <g transform="translate(13.500 25.200) scale(0.55)">
        <path d={PAISLEY_OUT} {...stroke} strokeWidth={1.8} />
        <path d={PAISLEY_BACK} {...stroke} strokeWidth={1.8} />
      </g>
      <circle cx="32" cy="62" r="2.600" fill="currentColor" />
      {[
        [5, 62], [2, 48], [7, 34], [17, 22], [31, 13], [46, 8],
      ].map(([x, y], i) => (
        <circle key={i} cx={x - 5} cy={y - 3} r="1.300" fill="currentColor" opacity="0.800" />
      ))}
    </g>
  );
}

/* -------------------------------- dividers -------------------------------- */

export const extraDividers: Record<string, () => ReactElement> = {
  mandala: () => (
    <>
      <g transform="translate(120 14)">
        {range(8).map((i) => (
          <path key={i} d={leaf(10, 3)} transform={`rotate(${i * 45})`} {...stroke} />
        ))}
        <circle r="12.500" {...stroke} opacity="0.600" />
        <circle r="1.600" fill="currentColor" />
      </g>
      <Mirror w={240}>
        <path d="M140 14h66" {...stroke} />
        <path d="M152 10.500l3.500 3.500-3.500 3.500-3.500-3.500z" fill="currentColor" />
        <circle cx="212" cy="14" r="2.600" {...stroke} />
        <circle cx="221" cy="14" r="1.300" fill="currentColor" />
        <circle cx="228" cy="14" r="0.900" fill="currentColor" />
      </Mirror>
    </>
  ),
  peacock: () => (
    <>
      <g transform="translate(120 15)">
        <FeatherEye scale={0.72} />
      </g>
      <Mirror w={240}>
        <g transform="translate(146 14) rotate(90)">
          <FeatherEye scale={0.46} />
        </g>
        <path d="M156 14h66" {...stroke} />
        {[168, 180, 192, 204].map((x) => (
          <path key={x} d={`M${x} 14l7-5M${x} 14l7 5`} {...stroke} opacity="0.700" />
        ))}
        <circle cx="227" cy="14" r="1.300" fill="currentColor" />
      </Mirror>
    </>
  ),
  paisley: () => (
    <>
      <g transform="translate(120 14)">
        {range(6).map((i) => (
          <circle key={i} cx="5.500" cy="0" r="1.500" fill="currentColor" transform={`rotate(${i * 60})`} />
        ))}
        <circle r="1.400" fill="currentColor" />
      </g>
      <Mirror w={240}>
        <g transform="translate(134 1) scale(0.32)">
          <path d={PAISLEY_OUT} {...stroke} strokeWidth={3.2} />
          <path d={PAISLEY_BACK} {...stroke} strokeWidth={3.2} />
          <circle cx="32" cy="58" r="6" fill="currentColor" />
        </g>
        <path d="M164 16h56" {...stroke} />
        <circle cx="172" cy="16" r="1.300" fill="currentColor" />
        <circle cx="225" cy="16" r="1.400" fill="currentColor" />
      </Mirror>
    </>
  ),
  tracery: () => (
    <>
      <g transform="translate(120 14)" {...stroke}>
        <circle cx="0" cy="-4.200" r="4.200" />
        <circle cx="0" cy="4.200" r="4.200" />
        <circle cx="-4.200" cy="0" r="4.200" />
        <circle cx="4.200" cy="0" r="4.200" />
        <circle r="11.500" opacity="0.600" />
      </g>
      <Mirror w={240}>
        <path d="M138 14h48" {...stroke} />
        <path d="M190 22V12q4-9 8 0v10M202 22V12q4-9 8 0v10M214 22V12q4-9 8 0v10" {...stroke} />
        <path d="M188 22h36" {...stroke} />
      </Mirror>
    </>
  ),
  film: () => (
    <>
      <rect x="64" y="4.500" width="112" height="19" rx="1.500" {...stroke} />
      {range(13).map((i) => (
        <g key={i}>
          <rect x={69 + i * 8.200} y="6.800" width="3.600" height="2.400" rx="0.500" fill="currentColor" />
          <rect x={69 + i * 8.200} y="18.800" width="3.600" height="2.400" rx="0.500" fill="currentColor" />
        </g>
      ))}
      <path d="M64 11.500h112M64 16.500h112" {...stroke} opacity="0.500" />
      <path d={sparkle(120, 14, 5)} fill="currentColor" />
      <Mirror w={240}>
        <path d="M184 14h36" {...stroke} />
        <path d={sparkle(227, 14, 3.500)} fill="currentColor" />
      </Mirror>
    </>
  ),
  snow: () => (
    <>
      <Flake cx={120} cy={14} r={11.500} />
      <Mirror w={240}>
        <path d="M140 14h68" {...stroke} />
        <Flake cx={219} cy={14} r={5.500} />
        <circle cx="152" cy="8" r="1" fill="currentColor" />
        <circle cx="176" cy="20" r="0.900" fill="currentColor" />
        <circle cx="196" cy="8.500" r="0.800" fill="currentColor" />
      </Mirror>
    </>
  ),
  sun: () => (
    <>
      <path d="M111 21a9 9 0 0 1 18 0" {...stroke} />
      {[-78, -52, -26, 0, 26, 52, 78].map((a, i) => (
        <path key={a} d={i % 2 === 0 ? "M120 8.500V2.500" : "M120 8.500V5"} transform={`rotate(${a} 120 21)`} {...stroke} />
      ))}
      <path d="M100 21h40" {...stroke} />
      <Mirror w={240}>
        <path d="M148 21h70" {...stroke} />
        <path d="M160 17.500l3.500 3.500-3.500 3.500-3.500-3.500z" fill="currentColor" />
        <circle cx="224" cy="21" r="1.400" fill="currentColor" />
      </Mirror>
    </>
  ),
  betel: () => (
    <>
      <g transform="translate(120 26)">
        <g transform="rotate(-62)"><BetelLeaf L={17} W={9} /></g>
        <g transform="rotate(62)"><BetelLeaf L={17} W={9} /></g>
        <BetelLeaf L={23} W={11} />
      </g>
      <Mirror w={240}>
        <path d="M144 21h76" {...stroke} />
        <circle cx="154" cy="21" r="1.300" fill="currentColor" />
        <circle cx="225" cy="21" r="1.400" fill="currentColor" />
      </Mirror>
    </>
  ),
};

/* --------------------------------- crests --------------------------------- */

export const extraCrests: Record<string, () => ReactElement> = {
  mandala: () => (
    <g transform="translate(80 45)">
      {range(12).map((i) => (
        <path key={`o${i}`} d={leaf(17, 5)} transform={`rotate(${i * 30}) translate(22 0)`} {...stroke} />
      ))}
      <circle r="21" {...stroke} />
      {range(8).map((i) => (
        <path key={`i${i}`} d={leaf(14, 4.500)} transform={`rotate(${i * 45 + 22.500}) translate(5 0)`} {...stroke} />
      ))}
      {range(12).map((i) => (
        <circle key={`d${i}`} cx="42.500" cy="0" r="1.200" fill="currentColor" transform={`rotate(${i * 30 + 15})`} />
      ))}
      <circle r="3" fill="currentColor" />
    </g>
  ),
  peacock: () => (
    <>
      {[-58, -29, 0, 29, 58].map((a) => (
        <g key={a} transform={`rotate(${a} 80 86)`}>
          <path d="M80 86V46" {...stroke} />
          {[56, 64, 72].map((y) => (
            <path key={y} d={`M80 ${y}l-5-5M80 ${y}l5-5`} {...stroke} opacity="0.600" strokeWidth={0.8} />
          ))}
          <g transform="translate(80 30)">
            <FeatherEye scale={a === 0 ? 0.92 : 0.8} />
          </g>
        </g>
      ))}
      <circle cx="80" cy="86" r="2.400" fill="currentColor" />
    </>
  ),
  paisley: () => (
    <>
      <g transform="translate(47 2) scale(1.08)">
        <Paisley />
      </g>
      <Mirror w={160}>
        <g transform="translate(124 46) scale(0.4)">
          <path d={PAISLEY_OUT} {...stroke} strokeWidth={2.6} />
          <path d={PAISLEY_BACK} {...stroke} strokeWidth={2.6} />
          <circle cx="32" cy="58" r="5" fill="currentColor" />
        </g>
      </Mirror>
      <path d="M40 88q40 6 80 0" {...stroke} opacity="0.700" />
    </>
  ),
  tracery: () => (
    <>
      <path d="M42 86V42C42 22 60 9 80 3c20 6 38 19 38 39v44" {...stroke} />
      <path d="M48 86V46C48 27 63 15 80 9.500c17 5.500 32 17.500 32 36.500v40" {...stroke} opacity="0.500" />
      <Mirror w={160}>
        <path d="M54 86V58c0-9 6-15 11-19c5 4 11 10 11 19v28" {...stroke} />
      </Mirror>
      <g transform="translate(80 30)" {...stroke}>
        <circle r="10" />
        <circle cx="0" cy="-3.600" r="3.600" />
        <circle cx="0" cy="3.600" r="3.600" />
        <circle cx="-3.600" cy="0" r="3.600" />
        <circle cx="3.600" cy="0" r="3.600" />
      </g>
      <path d="M34 86h92" {...stroke} />
    </>
  ),
  film: () => (
    <>
      <circle cx="74" cy="44" r="34" {...stroke} />
      <circle cx="74" cy="44" r="29" {...stroke} opacity="0.450" />
      {range(5).map((i) => (
        <circle key={i} cx="74" cy="25" r="7.500" transform={`rotate(${i * 72} 74 44)`} {...stroke} />
      ))}
      <circle cx="74" cy="44" r="4" fill="currentColor" />
      <path d="M98 68c10 12 26 16 44 12" {...stroke} />
      <path d="M100 72.500c9 9 23 13 40 10.500" {...stroke} opacity="0.500" />
      <path d={sparkle(132, 22, 9)} fill="currentColor" />
      <path d={sparkle(148, 44, 4)} fill="currentColor" />
      <path d={sparkle(22, 14, 4)} fill="currentColor" />
    </>
  ),
  snow: () => (
    <>
      <Flake cx={80} cy={45} r={36} />
      <Flake cx={26} cy={22} r={10} />
      <Flake cx={136} cy={68} r={9} />
      <circle cx="132" cy="18" r="1.400" fill="currentColor" />
      <circle cx="24" cy="70" r="1.400" fill="currentColor" />
      <circle cx="146" cy="38" r="1" fill="currentColor" />
      <circle cx="12" cy="46" r="1" fill="currentColor" />
    </>
  ),
  sun: () => (
    <g transform="translate(80 45)">
      <circle r="15" {...stroke} />
      <circle r="10" {...stroke} opacity="0.550" />
      <circle r="3" fill="currentColor" />
      {range(8).map((i) => (
        <path key={`l${i}`} d="M-4.500-19.500L0-40L4.500-19.500Z" transform={`rotate(${i * 45})`} {...stroke} />
      ))}
      {range(8).map((i) => (
        <path key={`s${i}`} d="M0-20c-2.500-3 2.500-5 0-8c-1-1.300 0-2.500 0-3.500" transform={`rotate(${i * 45 + 22.500})`} {...stroke} />
      ))}
    </g>
  ),
  betel: () => (
    <>
      {[
        [-60, 58], [60, 58], [-30, 66], [30, 66], [0, 74],
      ].map(([a, L]) => (
        <g key={a} transform={`translate(80 86) rotate(${a})`}>
          <BetelLeaf L={L} W={L * 0.36} fillOpacity={0.1} />
        </g>
      ))}
      <path d="M68 86h24" {...stroke} strokeWidth={1.600} />
    </>
  ),
};

/* --------------------------------- corners --------------------------------- */

export const extraCorners: Record<string, () => ReactElement> = {
  mandala: () => (
    <g transform="translate(6 6)">
      <path d="M22 0a22 22 0 0 1-22 22" {...stroke} />
      {[9, 27, 45, 63, 81].map((a) => (
        <path key={`o${a}`} d={leaf(28, 7)} transform={`rotate(${a}) translate(25 0)`} {...stroke} />
      ))}
      <path d="M58 0a58 58 0 0 1-58 58" {...stroke} opacity="0.600" />
      {[0, 18, 36, 54, 72, 90].map((a) => (
        <circle key={`d${a}`} cx="65" cy="0" r="1.300" fill="currentColor" transform={`rotate(${a})`} />
      ))}
      {[22.500, 45, 67.500].map((a) => (
        <circle key={`c${a}`} cx="12" cy="0" r="1.500" fill="currentColor" transform={`rotate(${a})`} />
      ))}
      <circle r="3" fill="currentColor" />
    </g>
  ),
  peacock: () => (
    <>
      <path d="M4 64V4h60" {...stroke} opacity="0.550" />
      <path d="M10 10q20 18 44 44" {...stroke} />
      {[
        [20, 19], [29, 28], [38, 37],
      ].map(([x, y]) => (
        <path key={x} d={`M${x} ${y}l9-1M${x} ${y}l-1 9`} {...stroke} opacity="0.650" strokeWidth={0.8} />
      ))}
      <g transform="translate(64 64) rotate(135)">
        <FeatherEye scale={0.95} />
      </g>
    </>
  ),
  paisley: () => (
    <>
      <g transform="translate(8 82) scale(0.92 -0.92)">
        <Paisley />
      </g>
      {[74, 82, 90].map((x) => (
        <circle key={x} cx={x} cy="8" r="1.300" fill="currentColor" />
      ))}
      {[84, 92].map((y) => (
        <circle key={y} cx="8" cy={y} r="1.300" fill="currentColor" />
      ))}
    </>
  ),
  tracery: () => (
    <>
      <path d="M4 96V4h92" {...stroke} />
      <path d="M4 62A58 58 0 0 0 62 4" {...stroke} />
      <path d="M4 70A66 66 0 0 0 70 4" {...stroke} opacity="0.500" />
      <g {...stroke}>
        <circle cx="17" cy="17" r="7" />
        <circle cx="32" cy="17" r="7" />
        <circle cx="17" cy="32" r="7" />
      </g>
      <path d="M40 36.500l3.500 3.500-3.500 3.500-3.500-3.500z" fill="currentColor" />
    </>
  ),
  film: () => (
    <>
      <path d="M4 78V4h74" {...stroke} />
      <path d="M17 78V17h61" {...stroke} opacity="0.500" />
      {range(6).map((i) => (
        <g key={i}>
          <rect x={22 + i * 9.500} y="8.500" width="4.200" height="4.200" rx="0.800" fill="currentColor" />
          <rect x="8.500" y={22 + i * 9.500} width="4.200" height="4.200" rx="0.800" fill="currentColor" />
        </g>
      ))}
      <path d={sparkle(38, 38, 10)} fill="currentColor" />
    </>
  ),
  snow: () => (
    <>
      <path d="M4 66V4h62" {...stroke} opacity="0.500" />
      <Flake cx={28} cy={28} r={16} />
      <Flake cx={60} cy={17} r={7} />
      <Flake cx={17} cy={60} r={6} />
      <circle cx="50" cy="44" r="1.200" fill="currentColor" />
      <circle cx="78" cy="28" r="1" fill="currentColor" />
      <circle cx="30" cy="78" r="1" fill="currentColor" />
    </>
  ),
  sun: () => (
    <g transform="translate(4 4)">
      <path d="M24 0a24 24 0 0 1-24 24" {...stroke} />
      <path d="M17 0a17 17 0 0 1-17 17" {...stroke} opacity="0.550" />
      {[7.500, 22.500, 37.500, 52.500, 67.500, 82.500].map((a, i) => (
        <path key={a} d={i % 2 === 0 ? "M30 0h28" : "M30 0h15"} transform={`rotate(${a})`} {...stroke} />
      ))}
      <path d="M66 0a66 66 0 0 1-66 66" {...stroke} opacity="0.500" strokeDasharray="1 6" />
    </g>
  ),
  betel: () => (
    <>
      <g transform="translate(9 9) rotate(135)">
        <BetelLeaf L={64} W={24} fillOpacity={0.08} />
      </g>
      <path d="M12 46c9-3 13 6 7 10c-4 2.500-7-1-5-4" {...stroke} />
      <path d="M46 12c-3 9 6 13 10 7c2.500-4-1-7-4-5" {...stroke} />
      <circle cx="74" cy="9" r="1.300" fill="currentColor" />
      <circle cx="9" cy="74" r="1.300" fill="currentColor" />
    </>
  ),
};

export const extraOrnamentLabels: Record<string, string> = {
  mandala: "Mandala",
  peacock: "Peacock feather",
  paisley: "Paisley",
  tracery: "Gothic tracery",
  film: "Film reel",
  snow: "Snowflake",
  sun: "Rising sun",
  betel: "Betel leaf",
};
