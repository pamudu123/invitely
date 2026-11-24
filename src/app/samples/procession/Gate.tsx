/** Artwork for the gate scene. All drawn here, no outside assets. */

const ARCH = "M280 110C268 168 120 178 120 318V640H440V318C440 178 292 168 280 110Z";
const ARCH_LEFT = "M280 110C268 168 120 178 120 318V640H280Z";

function Kalasa({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill="url(#pa-gold)">
      <path d="M0 -64C6 -54 6 -48 0 -42C-6 -48 -6 -54 0 -64Z" />
      <circle cy="-36" r="6" />
      <path d="M-4 -30h8l3 8h-14z" />
      <path d="M-16 -8c0-10 8-14 16-14s16 4 16 14c0 6-6 8-16 8s-16-2-16-8z" />
      <path d="M-22 0h44l4 8h-52z" />
    </g>
  );
}

function Pillar({ flip }: { flip?: boolean }) {
  return (
    <g transform={flip ? "translate(560 0) scale(-1 1)" : undefined}>
      <path d="M18 640V214h62v426z" fill="url(#pa-red-v)" />
      <path d="M26 640V226h46v414z" fill="none" stroke="url(#pa-gold)" strokeWidth="2" />
      {Array.from({ length: 8 }, (_, i) => (
        <g key={i} transform={`translate(49 ${262 + i * 48})`}>
          <path d="M0 -19L15 0L0 19L-15 0Z" fill="#8E0F2B" stroke="url(#pa-gold)" strokeWidth="1.6" />
          {[0, 60, 120].map((a) => (
            <ellipse key={a} rx="2.6" ry="9" transform={`rotate(${a})`} fill="url(#pa-gold)" />
          ))}
          <circle r="2.6" fill="#FFF4DF" />
        </g>
      ))}
      <path d="M8 214h82l-8-18H16z" fill="url(#pa-gold)" />
      <path d="M14 196h70v-10H14z" fill="#8E0F2B" />
      <path d="M4 186h90l-10-14H14z" fill="url(#pa-gold)" />
      <Kalasa x={49} y={170} />
      <path d="M6 640h86v-26H6z" fill="url(#pa-gold)" />
    </g>
  );
}

export function GateWall() {
  return (
    <svg viewBox="0 0 560 640" className="pa-wall" aria-hidden="true">
      <defs>
        <linearGradient id="pa-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFE9A8" />
          <stop offset="0.45" stopColor="#F2C85B" />
          <stop offset="1" stopColor="#B8791A" />
        </linearGradient>
        <linearGradient id="pa-red" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#E5302A" />
          <stop offset="1" stopColor="#B0152A" />
        </linearGradient>
        <linearGradient id="pa-red-v" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#8E0F2B" />
          <stop offset="0.45" stopColor="#E5302A" />
          <stop offset="1" stopColor="#A01228" />
        </linearGradient>
      </defs>
      <path
        fillRule="evenodd"
        d={`M60 640V250C60 214 92 198 130 182C190 156 252 120 280 44C308 120 370 156 430 182C468 198 500 214 500 250V640Z ${ARCH}`}
        fill="url(#pa-red)"
      />
      <path d="M60 250C60 214 92 198 130 182C190 156 252 120 280 44C308 120 370 156 430 182C468 198 500 214 500 250" fill="none" stroke="url(#pa-gold)" strokeWidth="9" />
      <path d="M74 252C74 226 100 212 138 196C196 170 254 136 280 72C306 136 364 170 422 196C460 212 486 226 486 252" fill="none" stroke="#FFF4DF" strokeWidth="6" strokeDasharray="0 13" strokeLinecap="round" />
      <path d="M108 640V318C108 170 262 160 280 90C298 160 452 170 452 318V640" fill="none" stroke="url(#pa-gold)" strokeWidth="7" />
      <path d="M96 640V320C96 162 254 152 280 78C306 152 464 162 464 320V640" fill="none" stroke="#FFA51F" strokeWidth="8" strokeDasharray="0 16" strokeLinecap="round" />
      {[0, 1].map((m) => (
        <g key={m} transform={m ? "translate(560 0) scale(-1 1)" : undefined}>
          <g transform="translate(150 214)" fill="none" stroke="url(#pa-gold)" strokeWidth="2.4" strokeLinecap="round">
            <path d="M-52 78C-56 20 -22 -6 26 -18C64 -28 90 -42 104 -64" />
            <path d="M-40 40c-18-4-22-24-8-32 12-6 22 6 14 14M-8 4c-10-18 4-32 18-26 10 5 8 18-2 18M42 -22c-4-16 10-26 20-18 8 6 2 16-6 14" />
            <path d="M-50 64c10-10 22-10 28-2-8 8-20 8-28 2zM-16 16c4-12 14-18 22-14-2 12-12 18-22 14zM34 -20c2-10 12-18 20-14-2 10-10 16-20 14z" fill="url(#pa-gold)" stroke="none" />
          </g>
          <g transform="translate(86 300)">
            {Array.from({ length: 8 }, (_, i) => (
              <ellipse key={i} rx="4" ry="11" cy="-9" transform={`rotate(${i * 45})`} fill="#FFA51F" />
            ))}
            <circle r="5" fill="#FFF4DF" />
          </g>
        </g>
      ))}
      <Pillar />
      <Pillar flip />
      <Kalasa x={280} y={46} s={1.25} />
      <path d="M0 640h560v-14H0z" fill="url(#pa-gold)" />
    </svg>
  );
}

export function Door({ side }: { side: "left" | "right" }) {
  return (
    <svg viewBox="0 0 560 640" className={`pa-door pa-door-${side}`} aria-hidden="true">
      <g transform={side === "right" ? "translate(560 0) scale(-1 1)" : undefined}>
        <defs>
          <clipPath id={`pa-clip-${side}`}>
            <path d={ARCH_LEFT} />
          </clipPath>
          <linearGradient id={`pa-teak-${side}`} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#004F55" />
            <stop offset="1" stopColor="#008087" />
          </linearGradient>
        </defs>
        <g clipPath={`url(#pa-clip-${side})`}>
          <path d="M110 100h170v540H110z" fill={`url(#pa-teak-${side})`} />
          <path d="M280 110C268 168 120 178 120 318V640" fill="none" stroke="#F2C85B" strokeWidth="14" />
          {[0, 1, 2].map((i) => (
            <g key={i} transform={`translate(202 ${330 + i * 112})`}>
              <path d="M-58 -48h122v96h-122z" fill="none" stroke="#F2C85B" strokeWidth="3" />
              <path d="M-50 -40h106v80h-106z" fill="none" stroke="#F2C85B" strokeOpacity="0.5" strokeWidth="1.4" />
              {Array.from({ length: 12 }, (_, k) => (
                <path key={k} d="M0 -10C7 -18 7 -28 0 -36C-7 -28 -7 -18 0 -10Z" transform={`translate(3 0) rotate(${k * 30})`} fill={k % 2 ? "#FFA51F" : "#F2C85B"} />
              ))}
              <circle cx="3" r="11" fill="#E5302A" stroke="#FFF4DF" strokeWidth="2" />
              <circle cx="3" r="4" fill="#FFF4DF" />
            </g>
          ))}
          <path d="M274 100v540" stroke="#F2C85B" strokeWidth="5" />
          <path d="M140 250c30-40 80-50 118-84" fill="none" stroke="#FFF4DF" strokeWidth="5" strokeDasharray="0 13" strokeLinecap="round" />
          <circle cx="256" cy="444" r="11" fill="none" stroke="#FFE9A8" strokeWidth="5" />
          <circle cx="256" cy="430" r="6" fill="#FFE9A8" />
        </g>
      </g>
    </svg>
  );
}

/** Hills and hipped, two-pitch roofs on the horizon. */
export function Horizon() {
  const roof = (x: number, y: number, s: number, fill: string) => (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill={fill}>
      <path d="M-120 0C-90 -10 -74 -24 -66 -36C-50 -46 -38 -76 -30 -104H30C38 -76 50 -46 66 -36C74 -24 90 -10 120 0Z" />
      <path d="M-30 -104l-4-16 10 8h48l10-8-4 16zM-3 -112h6v-22h-6z" />
      <path d="M-92 0h184v120H-92z" />
    </g>
  );
  return (
    <svg viewBox="0 0 1600 420" preserveAspectRatio="xMidYMax slice" className="pa-horizon" aria-hidden="true">
      <path d="M0 250C160 150 300 210 420 160C560 100 640 190 800 170C960 150 1060 90 1200 160C1340 220 1460 150 1600 220V420H0Z" className="pa-hill-1" />
      <g className="pa-roofs">
        {roof(150, 300, 1.1, "currentColor")}
        {roof(360, 320, 0.8, "currentColor")}
        {roof(1440, 300, 1.1, "currentColor")}
        {roof(1236, 320, 0.8, "currentColor")}
      </g>
      <path d="M0 320C200 270 380 330 620 320C900 300 1100 340 1320 310C1440 296 1540 310 1600 320V420H0Z" className="pa-hill-2" />
    </svg>
  );
}

const PARASOL = [
  { c: "#FFA51F", d: "#C81E1E" },
  { c: "#F26CA0", d: "#FFF4DF" },
  { c: "#00808A", d: "#F2C85B" },
  { c: "#FFF4DF", d: "#C81E1E" },
  { c: "#7A2A9A", d: "#FFA51F" },
];

/** Ceremonial parasols and swallowtail banners that frame the gate. */
export function Parade({ side }: { side: "left" | "right" }) {
  return (
    <svg viewBox="0 0 520 420" preserveAspectRatio="xMidYMax meet" className={`pa-parade pa-parade-${side}`} aria-hidden="true">
      <g transform={side === "right" ? "translate(520 0) scale(-1 1)" : undefined}>
        {[40, 168, 300].map((x, i) => (
          <g key={x} transform={`translate(${x} ${70 - (i % 2) * 34})`}>
            <path d="M0 -14V400" stroke="#F2C85B" strokeWidth="5" />
            <circle cy="-18" r="7" fill="#F2C85B" />
            <g className="pa-flag" style={{ animationDelay: `${i * -0.9}s` }}>
              <path d="M3 0C40 -12 52 16 84 4L70 34L86 66C54 78 40 52 3 64Z" fill={["#E5302A", "#FFA51F", "#F26CA0"][i]} />
              <path d="M3 12C36 2 48 28 78 18M3 52C36 42 50 66 78 56" fill="none" stroke="#FFF4DF" strokeWidth="3" />
              <circle cx="36" cy="33" r="9" fill="#FFF4DF" />
            </g>
          </g>
        ))}
        {PARASOL.map((p, i) => (
          <g key={i} transform={`translate(${50 + i * 98} ${214 + (i % 2) * 46}) scale(${0.92 - (i % 3) * 0.08})`} className="pa-para" style={{ animationDelay: `${i * -0.6}s` }}>
            <path d="M0 0V240" stroke="#F2C85B" strokeWidth="6" />
            <path d="M-70 12C-64 -50 -26 -74 0 -78C26 -74 64 -50 70 12C56 2 44 2 35 12C26 2 10 2 0 12C-10 2 -26 2 -35 12C-44 2 -56 2 -70 12Z" fill={p.c} />
            <path d="M0 -78C-14 -54 -32 -24 -35 12M0 -78C14 -54 32 -24 35 12M0 -78V12" fill="none" stroke={p.d} strokeWidth="3" />
            <path d="M-68 18C-56 8 -44 8 -35 18C-26 8 -10 8 0 18C10 8 26 8 35 18C44 8 56 8 68 18" fill="none" stroke={p.d} strokeWidth="6" strokeDasharray="0 10" strokeLinecap="round" />
            <path d="M0 -98C6 -90 6 -84 0 -78C-6 -84 -6 -90 0 -98Z" fill="#F2C85B" />
          </g>
        ))}
      </g>
    </svg>
  );
}
