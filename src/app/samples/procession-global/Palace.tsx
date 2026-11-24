import type { ReactNode } from "react";

/** Artwork for the global gate: stone arch, gilded iron gates, roses, banners and a palace. */

const LEFT = "M280 140A160 160 0 0 0 120 300V640H280Z";

function Rose({ x, y, s = 1, c = "#E8447A", d = "#B01A55" }: { x: number; y: number; s?: number; c?: string; d?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-18 4C-30 -2 -30 14 -14 12ZM18 4C30 -2 30 14 14 12Z" fill="#1E8A5A" />
      <circle r="15" fill={d} />
      <path d="M-15 0A15 15 0 0 1 10 -11C2 -8 -6 -2 -8 9A15 15 0 0 1 -15 0Z" fill={c} />
      <path d="M15 1A15 15 0 0 1 -6 14C2 12 9 4 9 -7A15 15 0 0 1 15 1Z" fill={c} />
      <circle r="7" fill={c} />
      <path d="M-4 1A4 4 0 1 1 3 3" fill="none" stroke={d} strokeWidth="2.4" strokeLinecap="round" />
    </g>
  );
}

const tints: [string, string][] = [
  ["#F2658F", "#C2275F"],
  ["#FFB7C9", "#EE7F9E"],
  ["#FF8A6B", "#DB553A"],
  ["#FFE3D6", "#F5B79E"],
];

function Pillar({ flip }: { flip?: boolean }) {
  return (
    <g transform={flip ? "translate(560 0) scale(-1 1)" : undefined}>
      <path d="M14 640V236h70v404z" fill="url(#pg-stone-v)" />
      {Array.from({ length: 8 }, (_, i) => (
        <path key={i} d={`M14 ${284 + i * 46}h70`} stroke="#D9C2A0" strokeWidth="3" />
      ))}
      {Array.from({ length: 8 }, (_, i) => (
        <path key={i} d={`M${i % 2 ? 38 : 60} ${238 + i * 46}v46`} stroke="#D9C2A0" strokeWidth="3" />
      ))}
      <path d="M4 236h90l-8-18H12z" fill="url(#pg-gold)" />
      <path d="M12 218h74v-12H12z" fill="#FFF8E8" />
      <path d="M2 206h94l-10-14H12z" fill="url(#pg-gold)" />
      <path d="M34 192h30l-4-14H38z" fill="#F3E4C8" />
      <path d="M22 178c0 0 4-26 4-34h46c0 8 4 34 4 34z" fill="#FFF8E8" />
      <path d="M22 148h54" stroke="url(#pg-gold)" strokeWidth="6" />
      {[[28, 130, 0.95], [50, 118, 1.2], [72, 130, 0.95], [40, 102, 0.8], [62, 102, 0.8]].map(([x, y, s], i) => (
        <Rose key={i} x={x} y={y} s={s} c={tints[i % 4][0]} d={tints[i % 4][1]} />
      ))}
      <path d="M6 640h86v-30H6z" fill="#F3E4C8" />
      <path d="M6 610h86" stroke="url(#pg-gold)" strokeWidth="5" />
    </g>
  );
}

export function GateArch() {
  const n = 27;
  return (
    <svg viewBox="0 0 560 640" className="pg-wall" aria-hidden="true">
      <defs>
        <linearGradient id="pg-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFF0C4" />
          <stop offset="0.45" stopColor="#F2CE7A" />
          <stop offset="1" stopColor="#B98A35" />
        </linearGradient>
        <linearGradient id="pg-stone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFBF2" />
          <stop offset="1" stopColor="#EBD9BB" />
        </linearGradient>
        <linearGradient id="pg-stone-v" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#DCC7A4" />
          <stop offset="0.45" stopColor="#FFFBF2" />
          <stop offset="1" stopColor="#E3CFAE" />
        </linearGradient>
      </defs>
      <path fillRule="evenodd" d="M72 640V300A208 208 0 0 1 488 300V640ZM120 640H440V300A160 160 0 0 0 120 300Z" fill="url(#pg-stone)" />
      <path d="M72 300A208 208 0 0 1 488 300" fill="none" stroke="url(#pg-gold)" strokeWidth="8" />
      <path d="M116 640V300A164 164 0 0 1 444 300V640" fill="none" stroke="url(#pg-gold)" strokeWidth="7" />
      {Array.from({ length: n }, (_, i) => {
        const a = Math.PI + (Math.PI * i) / (n - 1);
        const r = 185 + (i % 3) * 8 - 8;
        const t = tints[(i * 3) % 4];
        return <Rose key={i} x={+(280 + Math.cos(a) * r).toFixed(1)} y={+(300 + Math.sin(a) * r).toFixed(1)} s={0.86 + (i % 4) * 0.13} c={t[0]} d={t[1]} />;
      })}
      <Pillar />
      <Pillar flip />
      {[0, 1].map((m) => (
        <g key={m} transform={m ? "translate(560 0) scale(-1 1)" : undefined}>
          {[[94, 330, 0.95], [86, 366, 0.8], [98, 400, 0.9], [88, 440, 0.7]].map(([x, y, s], i) => (
            <Rose key={i} x={x} y={y} s={s} c={tints[(i + 1) % 4][0]} d={tints[(i + 1) % 4][1]} />
          ))}
        </g>
      ))}
      {/* Crown and shield */}
      <g transform="translate(280 78)">
        <path d="M-46 -6h92v40c0 34-26 52-46 62c-20-10-46-28-46-62z" fill="#5A1E9E" stroke="url(#pg-gold)" strokeWidth="6" />
        <path d="M0 70C-40 34 -36 2 -14 2C-5 2 0 9 0 14C0 9 5 2 14 2C36 2 40 34 0 70Z" fill="#FFF0C4" />
        <path d="M-44 -14L-56 -56L-26 -36L0 -72L26 -36L56 -56L44 -14Z" fill="url(#pg-gold)" />
        <circle cy="-76" r="7" fill="#F2658F" />
        <circle cx="-57" cy="-58" r="6" fill="#FFF0C4" />
        <circle cx="57" cy="-58" r="6" fill="#FFF0C4" />
        <path d="M-44 -14h88v10h-88z" fill="#FFF0C4" />
      </g>
      <path d="M0 640h560v-12H0z" fill="url(#pg-gold)" />
    </svg>
  );
}

/** One leaf of the gilded iron gates. You can see the palace through it. */
export function IronGate({ side }: { side: "left" | "right" }) {
  const gold = `url(#pg-iron-${side})`;
  return (
    <svg viewBox="0 0 560 640" className={`pg-door pg-door-${side}`} aria-hidden="true">
      <g transform={side === "right" ? "translate(560 0) scale(-1 1)" : undefined}>
        <defs>
          <clipPath id={`pg-clip-${side}`}><path d={LEFT} /></clipPath>
          <linearGradient id={`pg-iron-${side}`} gradientUnits="userSpaceOnUse" x1="120" y1="140" x2="280" y2="640">
            <stop offset="0" stopColor="#FFF0C4" />
            <stop offset="0.5" stopColor="#F2CE7A" />
            <stop offset="1" stopColor="#C2923C" />
          </linearGradient>
        </defs>
        <g clipPath={`url(#pg-clip-${side})`} fill="none" stroke={gold} strokeLinecap="round">
          {Array.from({ length: 8 }, (_, i) => (
            <path key={i} d={`M${134 + i * 20} 140V640`} strokeWidth="5" />
          ))}
          <path d="M120 330h160M120 470h160M120 486h160M120 612h160" strokeWidth="7" />
          {[160, 200, 240].map((x) => (
            <circle key={x} cx={x} cy="400" r="20" strokeWidth="6" />
          ))}
          <path d="M140 400c0-28 40-28 40 0s40 28 40 0 40-28 40 0" strokeWidth="5" />
          {[0, 1].map((m) => (
            <g key={m} transform={m ? "translate(400 0) scale(-1 1)" : undefined} strokeWidth="6">
              <path d="M200 552c-10-34-54-34-58-4-2 20 24 26 30 8 4-12-12-16-14-6" />
              <path d="M200 552c-10 32-46 42-56 22" />
            </g>
          ))}
          <path d="M200 516l12 20-12 20-12-20z" fill={gold} stroke="none" />
          <path d="M280 220c-30 0-46 30-30 46 14 12 32-4 22-18-8-10-20-2-16 6M280 220c-40-6-84 30-96 78" strokeWidth="6" />
        </g>
        <path d="M280 140A160 160 0 0 0 120 300V640" fill="none" stroke={gold} strokeWidth="12" />
        <path d="M276 140V640" stroke={gold} strokeWidth="8" />
        <circle cx="262" cy="440" r="9" fill="#FFF0C4" />
      </g>
    </svg>
  );
}

/** Palace, avenue and gardens behind the gate. Colours change with the light, in CSS. */
export function Estate() {
  const wing = (x: number, w: number, h: number, roof: number, cols: number) => (
    <g key={x}>
      <path d={`M${x} 330v${-h}h${w}v${h}z`} className="pg-wallc" />
      <path d={`M${x - 8} ${330 - h}l14 ${-roof}h${w - 12}l14 ${roof}z`} className="pg-roof" />
      <path d={`M${x - 8} ${330 - h}h${w + 16}`} className="pg-trim" strokeWidth="5" />
      {Array.from({ length: cols }, (_, i) => {
        const cx = x + (w / (cols + 1)) * (i + 1);
        return (
          <g key={i}>
            <path d={`M${cx - 8} ${330 - h + 60}v-32a8 8 0 0 1 16 0v32z`} className="pg-win" />
            {h > 90 ? <path d={`M${cx - 8} 318v-34a8 8 0 0 1 16 0v34z`} className="pg-win" /> : null}
            <path d={`M${cx - 6} ${330 - h - 8}v-16a6 6 0 0 1 12 0v16z`} className="pg-win" />
          </g>
        );
      })}
    </g>
  );
  const spire = (x: number, y: number) => (
    <g key={x}>
      <path d={`M${x} ${y}v-60`} className="pg-trim" strokeWidth="4" />
      <path d={`M${x} ${y - 60}l34 11-34 12z`} fill="#F2658F" className="pg-pennant" />
    </g>
  );
  const bush = (x: number, r: number) => <circle key={`${x}-${r}`} cx={x} cy={352} r={r} />;
  return (
    <svg viewBox="0 0 1600 460" preserveAspectRatio="xMidYMax slice" className="pg-horizon" aria-hidden="true">
      <path d="M0 290C160 200 300 250 440 210C600 160 700 220 800 210C920 200 1040 150 1180 205C1320 250 1460 190 1600 250V460H0Z" className="pg-hill-1" />
      {spire(660, 130)}
      {spire(940, 130)}
      {spire(800, 92)}
      {[wing(430, 170, 96, 44, 4), wing(1000, 170, 96, 44, 4), wing(600, 120, 128, 72, 3), wing(880, 120, 128, 72, 3), wing(716, 168, 150, 88, 4)]}
      <path d="M0 340C260 316 520 330 800 328C1080 330 1340 316 1600 340V460H0Z" className="pg-hill-2" />
      <path d="M770 330h60l190 130H580z" className="pg-avenue" />
      <g className="pg-hedge">{[[300, 34], [350, 26], [395, 32], [1205, 32], [1250, 26], [1300, 34], [520, 20], [1080, 20]].map(([x, r]) => bush(x, r))}</g>
    </svg>
  );
}

const BANNER: { c: string; t: string; icon: ReactNode }[] = [
  { c: "#E8447A", t: "#FFE1EA", icon: <path d="M0 26C-30 0 -26 -22 -11 -22C-4 -22 0 -17 0 -13C0 -17 4 -22 11 -22C26 -22 30 0 0 26Z" /> },
  { c: "#0B7A6B", t: "#D6F5EA", icon: <path d="M0 -28L8 -9L28 -8L12 5L18 25L0 13L-18 25L-12 5L-28 -8L-8 -9Z" /> },
  { c: "#FF8A5C", t: "#FFF0DC", icon: <path d="M-26 18L-32 -16L-13 -3L0 -26L13 -3L32 -16L26 18Z" /> },
];

/** Hanging banners, topiary and flowers either side of the gate. */
export function Court({ side }: { side: "left" | "right" }) {
  const ball = (x: number, y: number, s: number, k: number) => (
    <g key={x} transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-5 0h10v170h-10z" fill="#7A5230" />
      <circle cy="-30" r="54" fill="#13804F" />
      <circle cx="-16" cy="-46" r="30" fill="#1E9A62" />
      {[[-30, -20], [6, -60], [28, -24], [-4, -8], [-26, -56], [32, -52]].map(([a, b], i) => (
        <circle key={i} cx={a} cy={b} r="7.500" fill={tints[(i + k) % 4][0]} />
      ))}
      <path d="M-42 160h84l-12 70h-60z" fill="#FFF8E8" />
      <path d="M-46 152h92v14h-92z" fill="#F2CE7A" />
    </g>
  );
  return (
    <svg viewBox="0 0 520 460" preserveAspectRatio="xMidYMax meet" className={`pg-parade pg-parade-${side}`} aria-hidden="true">
      <g transform={side === "right" ? "translate(520 0) scale(-1 1)" : undefined}>
        {BANNER.map((b, i) => (
          <g key={i} transform={`translate(${62 + i * 142} ${40 + (i % 2) * 34})`}>
            <path d="M0 -24V430" stroke="#E7BE62" strokeWidth="7" />
            <path d="M0 -46l9 12-9 14-9-14z" fill="#FFF0C4" />
            <path d="M-52 -6H52" stroke="#E7BE62" strokeWidth="6" strokeLinecap="round" />
            <g className="pg-flag" style={{ animationDelay: `${i * -0.9}s` }}>
              <path d="M-44 -4H44V128L22 108L0 136L-22 108L-44 128Z" fill={b.c} />
              <path d="M-34 4V104M34 4V104" stroke={b.t} strokeWidth="4" />
              <g transform="translate(0 52)" fill={b.t}>{b.icon}</g>
            </g>
          </g>
        ))}
        {ball(126, 248, 0.92, 0)}
        {ball(268, 262, 0.86, 1)}
        {ball(392, 276, 0.8, 2)}
        {ball(4, 262, 0.9, 3)}
      </g>
    </svg>
  );
}

export function Lantern({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 240" className={className} aria-hidden="true">
      <circle cx="80" cy="18" r="13" fill="none" stroke="#F2CE7A" strokeWidth="6" />
      <path d="M74 30h12l4 14H70z" fill="#C2923C" />
      <path d="M80 40c34 6 52 24 58 44H22c6-20 24-38 58-44z" fill="#F2CE7A" />
      <path d="M16 84h128v12H16z" fill="#FFF0C4" />
      <path d="M26 96h108l-8 104H34z" fill="#FFF6D8" opacity="0.5" />
      <path d="M72 150h16v46H72z" fill="#FFFBF2" />
      <g transform="translate(80 148) scale(1.15)">
        <g className="s-flame">
          <path d="M0 -38C13 -18 15 -4 0 6C-15 -4 -13 -18 0 -38Z" fill="#FF7A3C" />
          <path d="M0 -26C8 -12 9 -3 0 4C-9 -3 -8 -12 0 -26Z" fill="#FFD25E" />
          <path d="M0 -14C4 -7 4 -2 0 2C-4 -2 -4 -7 0 -14Z" fill="#FFFBE8" />
        </g>
      </g>
      <path d="M26 96l8 104M134 96l-8 104M80 96v8" stroke="#E7BE62" strokeWidth="7" />
      <path d="M58 96l4 104M102 96l-4 104" stroke="#E7BE62" strokeWidth="4" />
      <path d="M28 200h104v12H28z" fill="#FFF0C4" />
      <path d="M18 212h124l10 22H8z" fill="#F2CE7A" />
    </svg>
  );
}

/** Striped hot air balloon. --open (inherited) inflates it. */
export function AirBalloon({ className }: { className?: string }) {
  const gores = ["#E8447A", "#FFF3DC", "#FF8A5C", "#FFF3DC", "#8A3FD1", "#FFF3DC", "#E8447A"];
  const edge = [-150, -118, -74, -26, 26, 74, 118, 150];
  return (
    <svg viewBox="-180 -230 360 480" className={className} aria-hidden="true">
      <g className="pg-envelope">
        {gores.map((c, i) => (
          <path key={i} d={`M0 -210C${edge[i] * 0.75} -206 ${edge[i] * 1.06} -120 ${edge[i]} -50C${edge[i] * 0.9} 20 ${edge[i] * 0.36} 70 ${edge[i] * 0.24} 112L${edge[i + 1] * 0.24} 112C${edge[i + 1] * 0.36} 70 ${edge[i + 1] * 0.9} 20 ${edge[i + 1]} -50C${edge[i + 1] * 1.06} -120 ${edge[i + 1] * 0.75} -206 0 -210Z`} fill={c} />
        ))}
        <path d="M-150 -50C-100 -14 100 -14 150 -50L146 -26C96 10 -96 10 -146 -26Z" fill="#5A1E9E" />
        <path d="M-146 -38C-98 -2 98 -2 146 -38" fill="none" stroke="#F2CE7A" strokeWidth="5" strokeDasharray="0 14" strokeLinecap="round" />
        <path d="M0 -70C-34 -100 -28 -126 -12 -126C-4 -126 0 -120 0 -116C0 -120 4 -126 12 -126C28 -126 34 -100 0 -70Z" fill="#F2CE7A" />
      </g>
      <path d="M-34 112L-26 178M34 112L26 178M-10 114L-9 178M10 114L9 178" stroke="#C2923C" strokeWidth="4" />
      <g transform="translate(0 140) scale(0.8)"><g className="s-flame"><path d="M0 -38C13 -18 15 -4 0 6C-15 -4 -13 -18 0 -38Z" fill="#FF7A3C" /><path d="M0 -24C7 -11 8 -3 0 4C-8 -3 -7 -11 0 -24Z" fill="#FFD25E" /></g></g>
      <path d="M-32 178h64l-7 48h-50z" fill="#B9783A" />
      <path d="M-36 174h72v12h-72z" fill="#F2CE7A" />
      <path d="M-28 198h56M-26 212h52" stroke="#8A5526" strokeWidth="3" />
    </svg>
  );
}
