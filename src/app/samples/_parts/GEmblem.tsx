import type { CSSProperties, ReactNode } from "react";
import { Emblem } from "./Emblem";

export type GEmblemId = "seal" | "curtain" | "doors" | "gift" | "balloon" | "scratch" | "clapper";

const g1 = "var(--g1,#F0D49A)";
const g2 = "var(--g2,#B98B3E)";
const e1 = "var(--e1,#1230A8)";
const e2 = "var(--e2,#0A1C6B)";
const l = "var(--l,#FFFAF0)";

function Both({ children }: { children: ReactNode }) {
  return (
    <>
      <g>{children}</g>
      <g transform="translate(240 0) scale(-1 1)">{children}</g>
    </>
  );
}

const art: Partial<Record<GEmblemId, ReactNode>> = {
  seal: (
    <>
      <path d="M18 62h204v140H18z" fill={l} />
      <path d="M18 202l82-76h40l82 76z" fill={g1} opacity="0.55" />
      <path d="M18 62l102 92 102-92z" fill={g1} />
      <path d="M18 62l102 92 102-92" fill="none" stroke={g2} strokeWidth="3" strokeLinejoin="round" />
      <path d="M18 62h204v140H18z" fill="none" stroke={g2} strokeWidth="3" />
      <g transform="translate(120 138)">
        <path d="M0 -40C12 -44 20 -32 30 -28C42 -22 42 -10 40 2C40 14 42 24 30 32C20 38 12 42 0 40C-12 44 -22 38 -30 30C-42 24 -40 12 -41 0C-42 -12 -40 -24 -28 -30C-20 -38 -10 -42 0 -40Z" fill={e1} />
        <circle r="28" fill="none" stroke={e2} strokeWidth="4" />
        <path d="M0 17C-20 3 -18 -14 -7 -14C-2 -14 0 -10 0 -8C0 -10 2 -14 7 -14C18 -14 20 3 0 17Z" fill={l} />
      </g>
    </>
  ),
  doors: (
    <>
      <path d="M34 232V104a86 86 0 0 1 172 0v128z" fill={g1} />
      <path d="M48 232V106a72 72 0 0 1 144 0v126z" fill={e2} />
      <path d="M52 232V106a68 68 0 0 1 66-68v194z" fill={e1} />
      <path d="M188 232V106a68 68 0 0 0-66-68v194z" fill={e1} />
      <Both>
        <path d="M66 112a54 54 0 0 1 40-54v54zM66 124h40v36H66zM66 172h40v44H66z" fill={l} opacity="0.9" />
        <path d="M86 64v48M66 142h40" stroke={e1} strokeWidth="3" />
        <circle cx="112" cy="168" r="4.500" fill={g1} />
      </Both>
      <path d="M22 232h196v8H22z" fill={g2} />
      <path d="M120 6l8 12-8 12-8-12z" fill={g2} />
    </>
  ),
  balloon: (
    <>
      <path d="M86 128C80 178 104 176 112 232M154 128c6 50-18 48-26 104" fill="none" stroke={g2} strokeWidth="3" />
      <path d="M120 150v82" stroke={g2} strokeWidth="3" />
      <ellipse cx="72" cy="86" rx="46" ry="56" fill={g1} />
      <ellipse cx="168" cy="86" rx="46" ry="56" fill={e2} />
      <ellipse cx="120" cy="80" rx="54" ry="66" fill={e1} />
      <path d="M112 146h16l6 12h-28z" fill={e1} />
      <path d="M96 52c6-12 14-16 22-18" fill="none" stroke={l} strokeWidth="7" strokeLinecap="round" />
      <path d="M54 62c3-8 8-12 14-14" fill="none" stroke={l} strokeWidth="5" strokeLinecap="round" />
    </>
  ),
  scratch: (
    <>
      <path d="M30 52h180v140H30z" fill={l} stroke={g2} strokeWidth="3" />
      <path d="M46 68h148v108H46z" fill={e1} />
      <path d="M46 68h148v46c-20 12-30-8-48 4s-22 22-42 12-30 2-58 8z" fill={g1} />
      <path d="M58 82h40M58 94h24" stroke={g2} strokeWidth="4" strokeLinecap="round" />
      <path d="M96 146l5 11 12 1-9 8 3 12-11-6-11 6 3-12-9-8 12-1zM152 136l5 11 12 1-9 8 3 12-11-6-11 6 3-12-9-8 12-1z" fill={l} />
      <g transform="rotate(24 190 130)">
        <circle cx="194" cy="124" r="32" fill={g2} />
        <circle cx="194" cy="124" r="26" fill={g1} />
        <path d="M194 108v32M184 116c4-6 18-6 20 0 2 8-20 6-20 14 2 8 18 8 22 2" fill="none" stroke={g2} strokeWidth="4" strokeLinecap="round" />
      </g>
    </>
  ),
};

/** Openings drawn without any regional motif. Shares colour variables with Emblem. */
export function GEmblem({ id, className, style }: { id: GEmblemId; className?: string; style?: CSSProperties }) {
  const own = art[id];
  if (!own && (id === "curtain" || id === "gift" || id === "clapper")) return <Emblem id={id} className={className} style={style} />;
  return (
    <svg viewBox="0 0 240 240" className={className} style={style} aria-hidden="true">
      {own}
    </svg>
  );
}
