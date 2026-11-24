import type { ReactNode } from "react";

export type OpeningArtId = "seal" | "curtain" | "doors" | "gift" | "balloon" | "scratch" | "clapper";

const g1 = "var(--g1,#E8F2FF)";
const g2 = "var(--g2,#8FA3D6)";
const e1 = "var(--e1,#2F49D9)";
const e2 = "var(--e2,#1A2C96)";
const l = "var(--l,#FFFFFF)";

function Both({ children }: { children: ReactNode }) {
  return (
    <>
      <g>{children}</g>
      <g transform="translate(240 0) scale(-1 1)">{children}</g>
    </>
  );
}

const art: Record<OpeningArtId, ReactNode> = {
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

/** Pictures of the openings. Colours come from --e1, --e2 (body), --g1, --g2 (trim) and --l (light). */
export function OpeningArt({ id }: { id: OpeningArtId }) {
  return <svg viewBox="0 0 240 240" aria-hidden="true">{art[id]}</svg>;
}
