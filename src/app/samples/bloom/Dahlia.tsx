import type { CSSProperties } from "react";

export type Bouquet = "coral" | "pink" | "lilac" | "blue" | "butter";

const tones: Record<Bouquet, string[]> = {
  coral: ["#C8102E", "#E5272F", "#F5432F", "#FF6A3D", "#FF8F52", "#FFB877", "#FFE0A8"],
  pink: ["#A8005E", "#CF0F7A", "#EE2F93", "#FF5CAB", "#FF8CC4", "#FFB8DB", "#FFE4F0"],
  lilac: ["#5B21B6", "#7434D6", "#8F52EE", "#AB77FA", "#C49DFF", "#DBC2FF", "#F1E7FF"],
  blue: ["#0B2FA8", "#1346D6", "#2C66F5", "#5489FF", "#80AAFF", "#AECBFF", "#E0EBFF"],
  butter: ["#E08600", "#F29E0C", "#FFB52B", "#FFC653", "#FFD67E", "#FFE4A8", "#FFF5DA"],
};

const rings = [
  { n: 20, len: 300, w: 50 },
  { n: 20, len: 258, w: 48 },
  { n: 18, len: 216, w: 44 },
  { n: 16, len: 174, w: 40 },
  { n: 14, len: 132, w: 34 },
  { n: 11, len: 92, w: 28 },
  { n: 8, len: 56, w: 21 },
];

const petal = (len: number, w: number) =>
  `M0 0C${-w * 0.5} ${-len * 0.2} ${-w} ${-len * 0.55} ${-w * 0.72} ${-len * 0.82}C${-w * 0.5} ${-len * 0.97} ${-w * 0.16} ${-len * 0.98} 0 ${-len}C${w * 0.16} ${-len * 0.98} ${w * 0.5} ${-len * 0.97} ${w * 0.72} ${-len * 0.82}C${w} ${-len * 0.55} ${w * 0.5} ${-len * 0.2} 0 0Z`;

/** A many-petalled flower. --open (0 to 1, inherited) takes it from bud to full bloom. */
export function Dahlia({ tone = "coral", className, style }: { tone?: Bouquet; className?: string; style?: CSSProperties }) {
  const c = tones[tone];
  return (
    <svg viewBox="-310 -310 620 620" className={className} style={style} aria-hidden="true">
      {rings.map((r, i) => (
        <g
          key={i}
          className="bl-ring"
          style={{
            transform: `rotate(calc(${i * 9}deg - (1 - var(--open, 1)) * ${40 + i * 14}deg)) scale(calc(0.2 + 0.8 * clamp(0, (var(--open, 1) - ${((6 - i) * 0.05).toFixed(2)}) * 1.45, 1)))`,
          }}
        >
          {Array.from({ length: r.n }, (_, k) => (
            <g key={k} transform={`rotate(${((k * 360) / r.n).toFixed(2)})`}>
              <path d={petal(r.len, r.w)} fill={c[i]} stroke={c[Math.min(6, i + 1)]} strokeWidth="1.6" strokeOpacity="0.85" />
              <path d={`M0 ${-r.len * 0.34}V${-r.len * 0.86}`} stroke={c[Math.max(0, i - 1)]} strokeWidth="2" strokeOpacity="0.5" strokeLinecap="round" />
            </g>
          ))}
        </g>
      ))}
      <circle r="13" fill={c[6]} />
    </svg>
  );
}
