import { Cloud, type TreeProps } from "./parts";

const pinks = [
  ["#F48FB8", "#FFC2D9"],
  ["#FBB3CF", "#FFE0EC"],
  ["#E9709F", "#FFB0CC"],
];

function Blossom({ x, y, s, v = 0 }: TreeProps) {
  const [a, b] = pinks[v % 3];
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-6 14C-5 -6 -4 -24 -3 -40H3C4 -24 6 -6 7 14ZM-2 -22L-20 -44L-16 -47L0 -32ZM2 -26L18 -46L22 -43L3 -18Z" fill="#7A4A3A" />
      <circle cx="-24" cy="-48" r="20" fill={a} />
      <circle cx="24" cy="-48" r="20" fill={a} />
      <circle cx="0" cy="-60" r="27" fill={a} />
      <circle cx="-13" cy="-76" r="17" fill={a} />
      <circle cx="15" cy="-75" r="16" fill={a} />
      <circle cx="-26" cy="-53" r="11" fill={b} />
      <circle cx="-10" cy="-74" r="11" fill={b} />
      <circle cx="13" cy="-66" r="13" fill={b} />
      <circle cx="26" cy="-46" r="8" fill={b} />
      <path d="M-14 -58h.1M4 -50h.1M18 -80h.1M30 -56h.1M-30 -44h.1M-4 -84h.1M8 -72h.1" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" />
    </g>
  );
}

function Tulip({ x, y, c, s = 1 }: { x: number; y: number; c: string; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 0V-16M0 -2C-6 -4 -8 -9 -8 -13C-4 -11 -1 -7 0 -2ZM0 -2C6 -4 8 -9 8 -13C4 -11 1 -7 0 -2Z" fill="#2F8A4C" stroke="#2F8A4C" strokeWidth="1.600" />
      <path d="M-6 -26C-3 -24 -2 -23 0 -28C2 -23 3 -24 6 -26C7 -19 5 -14 0 -14C-5 -14 -7 -19 -6 -26Z" fill={c} />
    </g>
  );
}

const bulbs = ["#E5327A", "#FFC93D", "#8E5BD6", "#FF7E9F", "#FFFFFF"];

function Tulips({ from, to, step, y, s = 1 }: { from: number; to: number; step: number; y: number; s?: number }) {
  return (
    <>
      {Array.from({ length: Math.floor((to - from) / step) + 1 }, (_, i) => (
        <Tulip key={i} x={from + i * step} y={y + ((i * 7) % 5) * 2 * s} c={bulbs[i % 5]} s={s} />
      ))}
    </>
  );
}

/** Garden pavilion with a copper dome and wisteria. Stands on 0,0. */
function Pavilion() {
  const garland = [-86, -76, -66, -46, -36, -26, -14, 0, 14, 26, 36, 46, 66, 76, 86];
  return (
    <g>
      <path d="M-92 -18V-114H92V-18Z" fill="#FFF1CC" />
      <path d="M-28 -18V-70a28 28 0 0 1 56 0V-18Z" fill="#FFD3E3" />
      <path d="M-28 -18V-70a28 28 0 0 1 56 0V-18" fill="none" stroke="#FFFFFF" strokeWidth="5" />
      <path d="M-84 -60h48M36 -60h48M-84 -40h48M36 -40h48M-72 -78v60M-48 -78v60M48 -78v60M72 -78v60" stroke="#E9CBB0" strokeWidth="2.500" />
      <path d="M-98 -126C-98 -190 -50 -222 0 -222C50 -222 98 -190 98 -126Z" fill="#79C7A0" />
      <path d="M0 -222C50 -222 98 -190 98 -126H46C46 -172 28 -206 0 -222Z" fill="#56AD84" />
      <path d="M0 -222C-32 -204 -48 -172 -48 -126M0 -222V-126" fill="none" stroke="#3F9770" strokeWidth="2.500" />
      <path d="M-3 -222h6v-14h-6z" fill="#FFFFFF" />
      <circle cx="0" cy="-242" r="8" fill="#FFC93D" />
      <path d="M-112 -128h224v16h-224z" fill="#FFFFFF" />
      <path d="M-112 -116h224v5h-224z" fill="#EBCFDD" />
      {[-98, -54, 54, 98].map((x) => (
        <g key={x}>
          <path d={`M${x - 7} -18V-111h14V-18z`} fill="#FFFFFF" />
          <path d={`M${x + 2} -18V-111h5V-18z`} fill="#EBD6E2" />
          <path d={`M${x - 11} -24h22v8h-22zM${x - 10} -113h20v7h-20z`} fill="#FFFFFF" />
        </g>
      ))}
      {garland.map((x, i) => (
        <g key={x}>
          <circle cx={x} cy={-108 + (i % 3) * 3} r="7" fill="#A57BE0" />
          <circle cx={x + 1} cy={-97 + (i % 3) * 5} r="5" fill="#C4A3F2" />
          <circle cx={x} cy={-88 + (i % 3) * 6} r="3.200" fill="#DCC8FA" />
          <circle cx={x + 4} cy={-112} r="3" fill="#3F9A5A" />
        </g>
      ))}
      <path d="M-108 -18h216l8 10h-232z" fill="#FBF1F6" />
      <path d="M-118 -8h236l8 10h-252z" fill="#EAD8E2" />
    </g>
  );
}

export function SpringGlobe() {
  return (
    <>
      <defs>
        <linearGradient id="spring-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7CC7F2" />
          <stop offset="0.45" stopColor="#CDEBFA" />
          <stop offset="0.75" stopColor="#FFE9DC" />
        </linearGradient>
      </defs>
      <path d="M-200 -200h400v400h-400z" fill="url(#spring-sky)" />
      <circle cx="96" cy="-112" r="30" fill="#FFF3B8" />
      <Cloud x={-92} y={-90} s={0.9} />
      <Cloud x={112} y={-64} s={0.62} />
      <path d="M-200 92C-140 46 -70 62 0 70C80 78 140 40 200 64V200H-200Z" fill="#B4E08F" />
      <path d="M-200 104C-120 74 -60 98 0 90C70 82 130 104 200 84V200H-200Z" fill="#93D077" />
      <g transform="translate(0 114)"><Pavilion /></g>
      <Blossom x={-142} y={122} s={1.05} />
      <Blossom x={144} y={122} s={1.1} v={1} />
      <Blossom x={-180} y={142} s={0.8} v={2} />
      <Blossom x={-112} y={138} s={0.5} v={1} />
      <Blossom x={118} y={140} s={0.55} v={2} />
      <path d="M-200 122C-100 104 100 104 200 122V200H-200Z" fill="#79C25F" />
      <path d="M-200 150C-90 134 90 158 200 144V200H-200Z" fill="#5FB04E" />
      <path d="M-30 112C-34 136 -46 170 -60 200H60C46 170 34 136 30 112Z" fill="#FBE8CF" />
      <Tulips from={-150} to={-70} step={16} y={158} s={0.9} />
      <Tulips from={72} to={152} step={16} y={158} s={0.9} />
    </>
  );
}

export function SpringHorizon() {
  return (
    <>
      <svg viewBox="0 0 1600 420" preserveAspectRatio="none">
        <path d="M0 420V230C160 120 320 150 480 220C660 130 800 90 980 190C1140 110 1320 90 1600 200V420Z" fill="#C6E7A4" />
        <path d="M0 420V300C220 210 400 250 620 296C840 220 1060 230 1240 290C1380 250 1500 250 1600 270V420Z" fill="#9AD47C" />
        <path d="M0 420V366C260 316 520 372 800 352C1080 332 1340 372 1600 340V420Z" fill="#6DBB57" />
      </svg>
      <svg viewBox="0 0 1600 420" preserveAspectRatio="xMidYMax slice">
        <Blossom x={64} y={352} s={1.5} />
        <Blossom x={190} y={366} s={1.05} v={1} />
        <Blossom x={286} y={356} s={0.75} v={2} />
        <Blossom x={1360} y={352} s={1.05} v={1} />
        <Blossom x={1460} y={362} s={1.4} />
        <Blossom x={1560} y={352} s={1} v={2} />
        <Tulips from={30} to={760} step={34} y={404} s={1.1} />
        <Tulips from={1330} to={1590} step={34} y={404} s={1.1} />
      </svg>
    </>
  );
}

export function SpringView() {
  return (
    <>
      <Cloud x={330} y={70} s={1.5} />
      <Cloud x={1250} y={92} s={1.8} />
      <path d="M0 460V300C240 210 420 300 700 270C980 240 1240 310 1600 240V460Z" fill="#C0E69E" />
      <path d="M0 460V346C260 280 500 346 800 322C1100 300 1340 350 1600 306V460Z" fill="#9AD47C" />
      <g transform="translate(800 352) scale(1.1)"><Pavilion /></g>
      <path d="M0 460V366C300 324 560 374 800 354C1040 336 1300 372 1600 336V460Z" fill="#79C25F" />
      <path d="M0 460V416C300 386 560 432 800 416C1040 400 1300 432 1600 398V460Z" fill="#5FB04E" />
      <Blossom x={430} y={374} s={1.5} />
      <Blossom x={560} y={388} s={0.95} v={1} />
      <Blossom x={1040} y={384} s={1.1} v={2} />
      <Blossom x={1170} y={376} s={1.6} v={1} />
      <Tulips from={120} to={700} step={36} y={440} s={1.1} />
      <Tulips from={900} to={1500} step={36} y={440} s={1.1} />
    </>
  );
}

/** `i`: 0 before, 1 on the day, 2 after */
export function SpringMini({ i }: { i: number }) {
  return (
    <>
      {i === 2 ? (
        <path d="M76 -140a44 44 0 1 0 40 62a36 36 0 1 1 -40 -62z" fill="#FFF3C4" />
      ) : (
        <circle cx={i ? 70 : -84} cy={i ? -110 : 8} r={i ? 36 : 56} fill={i ? "#FFF3B8" : "#FFD9A8"} />
      )}
      {i < 2 ? <Cloud x={i ? -90 : 92} y={-84} s={0.8} /> : <path d="M-120 -120h.1M-60 -150h.1M-20 -104h.1M-150 -60h.1M150 -40h.1M30 -160h.1" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" />}
      <path d="M-200 100C-120 60 -60 90 0 78C80 62 130 92 200 72V200H-200Z" fill={["#CDE6A0", "#B4E08F", "#4A8A63"][i]} />
      <g transform="translate(0 122) scale(0.86)"><Pavilion /></g>
      <Blossom x={-132} y={130} s={0.95} v={i} />
      <Blossom x={134} y={130} s={1} v={i + 1} />
      <path d="M-200 126C-100 104 100 104 200 126V200H-200Z" fill={i === 2 ? "#2F6E4A" : "#79C25F"} />
    </>
  );
}
