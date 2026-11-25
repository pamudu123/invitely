import { Cloud, type TreeProps } from "./parts";

const foliage = [
  ["#D9541E", "#F2812F", "#FFB057"],
  ["#E39A1F", "#F5BC45", "#FFDD85"],
  ["#A82A1C", "#CC4527", "#EE7345"],
];

function Maple({ x, y, s, v = 0 }: TreeProps) {
  const [a, b, c] = foliage[v % 3];
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-6 14C-5 -4 -4 -18 -3 -34H3C4 -18 6 -4 7 14ZM-2 -20L-16 -38L-12 -40L0 -28ZM2 -22L15 -40L19 -37L3 -16Z" fill={v % 3 === 1 ? "#EFE3CF" : "#5B3020"} />
      <path d="M0 -104C14 -104 20 -94 22 -88C36 -86 42 -74 38 -64C48 -54 44 -36 30 -32C24 -22 8 -22 0 -26C-8 -22 -24 -22 -30 -32C-44 -36 -48 -54 -38 -64C-42 -74 -36 -86 -22 -88C-20 -94 -14 -104 0 -104Z" fill={a} />
      <path d="M-4 -98C8 -100 16 -92 16 -84C28 -80 30 -68 24 -62C30 -50 20 -42 10 -44C2 -36 -16 -38 -20 -48C-34 -50 -36 -64 -28 -70C-30 -82 -18 -88 -12 -86C-12 -92 -8 -98 -4 -98Z" fill={b} />
      <path d="M-12 -82C-2 -86 4 -80 4 -74C12 -70 10 -60 4 -60C-2 -54 -14 -56 -16 -64C-24 -68 -20 -80 -12 -82Z" fill={c} />
    </g>
  );
}

function Pumpkin({ x, y, s, c = "#EE7A22" }: { x: number; y: number; s: number; c?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="-10" cy="-12" rx="12" ry="13" fill={c} />
      <ellipse cx="10" cy="-12" rx="12" ry="13" fill={c} />
      <ellipse cx="0" cy="-12" rx="9" ry="14" fill="#FFA149" />
      <path d="M-2 -25C-2 -31 2 -34 7 -34L5 -30C3 -29 2 -27 2 -25Z" fill="#5A6B1E" />
    </g>
  );
}

/** Timber hall with lit windows and a string of lamps. Stands on 0,0. */
function Lodge() {
  return (
    <g>
      <path d="M56 -118h20v-54h-20z" fill="#7E3A2A" />
      <path d="M52 -176h28v8h-28z" fill="#5C261B" />
      <path d="M66 -186C56 -196 74 -202 66 -214C60 -222 72 -230 70 -240" fill="none" stroke="#FFE6C7" strokeWidth="7" strokeLinecap="round" opacity="0.6" />
      {/* Wings */}
      <path d="M-120 0V-66H-50V0ZM50 0V-66H120V0Z" fill="#8A4426" />
      <path d="M-132 -62L-84 -104H-40V-62ZM132 -62L84 -104H40V-62Z" fill="#4A1B14" />
      <path d="M-104 -46h22v28h-22zM82 -46h22v28h-22z" fill="#FFD27A" stroke="#5C261B" strokeWidth="4" />
      <path d="M-93 -46v28M93 -46v28" stroke="#5C261B" strokeWidth="2.500" />
      {/* Main hall */}
      <path d="M-58 0V-104L0 -172L58 -104V0Z" fill="#A65730" />
      <path d="M-44 0V-110M-22 0V-136M22 0V-136M44 0V-110" stroke="#8A4426" strokeWidth="2.500" />
      <path d="M0 -190L74 -102L64 -92L0 -168L-64 -92L-74 -102Z" fill="#4A1B14" />
      <path d="M0 -190L74 -102L64 -92L0 -168Z" fill="#35100C" />
      <path d="M0 -152L30 -114H-30Z" fill="#FFD27A" stroke="#5C261B" strokeWidth="4" strokeLinejoin="round" />
      <path d="M0 -152V-114" stroke="#5C261B" strokeWidth="3" />
      <path d="M-40 -98h22v34h-22zM18 -98h22v34h-22z" fill="#FFD27A" stroke="#5C261B" strokeWidth="4" />
      <path d="M-20 0v-40a20 20 0 0 1 40 0V0z" fill="#FFE3A3" />
      <path d="M-20 0v-40a20 20 0 0 1 40 0V0" fill="none" stroke="#5C261B" strokeWidth="5" />
      {/* Wreath and lamps */}
      <circle cx="0" cy="-82" r="11" fill="none" stroke="#D9541E" strokeWidth="6" />
      <path d="M-120 -62C-96 -44 -76 -44 -56 -62C-30 -42 30 -42 56 -62C76 -44 96 -44 120 -62" fill="none" stroke="#35100C" strokeWidth="2" />
      {[-106, -88, -70, -38, -13, 13, 38, 70, 88, 106].map((x) => <circle key={x} cx={x} cy={Math.abs(x) < 50 ? -49 : -50} r="4.500" fill="#FFF0B8" />)}
    </g>
  );
}

export function AutumnGlobe() {
  return (
    <>
      <defs>
        <linearGradient id="autumn-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6B1F3A" />
          <stop offset="0.4" stopColor="#C9502F" />
          <stop offset="0.75" stopColor="#FFC56B" />
        </linearGradient>
      </defs>
      <path d="M-200 -200h400v400h-400z" fill="url(#autumn-sky)" />
      <circle cx="90" cy="-104" r="38" fill="#FFE9B8" />
      <Cloud x={-96} y={-96} s={0.8} c="#FFB27A" o={0.6} />
      <Cloud x={70} y={-70} s={0.6} c="#FFB27A" o={0.5} />
      <path d="M-200 84C-130 34 -60 66 0 54C80 40 140 60 200 46V200H-200Z" fill="#B4442A" />
      <path d="M-200 104C-120 70 -60 98 0 86C70 74 130 98 200 78V200H-200Z" fill="#8E3A22" />
      {[-176, -150, -122, 124, 150, 178].map((x, i) => <Maple key={x} x={x} y={102} s={0.5} v={i} />)}
      <g transform="translate(0 114)"><Lodge /></g>
      <Maple x={-148} y={124} s={1.02} />
      <Maple x={150} y={124} s={1.08} v={1} />
      <Maple x={-182} y={144} s={0.8} v={2} />
      <path d="M-200 122C-100 104 100 104 200 122V200H-200Z" fill="#C98532" />
      <path d="M-200 150C-90 134 90 158 200 144V200H-200Z" fill="#DDA245" />
      <path d="M-18 110C-24 136 -40 170 -56 200H56C40 170 24 136 18 110Z" fill="#F4D7A0" />
      <Pumpkin x={-104} y={166} s={0.9} />
      <Pumpkin x={-80} y={170} s={0.62} c="#D9541E" />
      <Pumpkin x={108} y={168} s={0.8} />
      <Pumpkin x={130} y={164} s={0.55} c="#D9541E" />
    </>
  );
}

function Woods({ from, to, step, y, s }: { from: number; to: number; step: number; y: number; s: number }) {
  return (
    <>
      {Array.from({ length: Math.floor((to - from) / step) + 1 }, (_, i) => (
        <Maple key={i} x={from + i * step} y={y + ((i * 5) % 4) * 4} s={s * (0.85 + ((i * 3) % 4) * 0.1)} v={i + from} />
      ))}
    </>
  );
}

export function AutumnHorizon() {
  return (
    <>
      <svg viewBox="0 0 1600 420" preserveAspectRatio="none">
        <path d="M0 420V190C180 70 340 130 520 190C700 90 860 60 1040 170C1200 80 1400 70 1600 160V420Z" fill="#8C2A22" />
        <path d="M0 420V280C220 190 400 230 620 276C840 200 1060 210 1240 270C1380 226 1500 230 1600 250V420Z" fill="#6E2119" />
        <path d="M0 420V352C260 306 520 364 800 342C1080 322 1340 360 1600 328V420Z" fill="#B5702A" />
      </svg>
      <svg viewBox="0 0 1600 420" preserveAspectRatio="xMidYMax slice">
        <Woods from={20} to={720} step={58} y={326} s={0.72} />
        <Woods from={1240} to={1600} step={58} y={316} s={0.72} />
        <path d="M0 420V388C260 356 520 398 800 380C1080 362 1340 396 1600 370V420Z" fill="#D99A3E" />
        <Maple x={70} y={366} s={1.6} />
        <Maple x={200} y={380} s={1.1} v={1} />
        <Maple x={300} y={374} s={0.85} v={2} />
        <Maple x={1400} y={372} s={1.05} v={2} />
        <Maple x={1500} y={372} s={1.6} v={1} />
        <Pumpkin x={390} y={408} s={1.2} />
        <Pumpkin x={426} y={412} s={0.8} c="#D9541E" />
        <Pumpkin x={130} y={412} s={1} />
      </svg>
    </>
  );
}

export function AutumnView() {
  return (
    <>
      <circle cx="1130" cy="70" r="62" fill="#FFE9B8" />
      <path d="M0 460V260C240 170 420 270 700 240C980 210 1240 280 1600 210V460Z" fill="#9C3524" />
      <path d="M0 460V330C260 260 500 326 800 300C1100 280 1340 330 1600 286V460Z" fill="#76261B" />
      <Woods from={20} to={620} step={60} y={330} s={0.8} />
      <Woods from={1000} to={1600} step={60} y={322} s={0.8} />
      <g transform="translate(800 356) scale(1.15)"><Lodge /></g>
      <path d="M0 460V370C300 328 560 376 800 356C1040 338 1300 374 1600 338V460Z" fill="#C07C2E" />
      <path d="M0 460V418C300 388 560 434 800 418C1040 402 1300 434 1600 400V460Z" fill="#DDA245" />
      <Maple x={440} y={380} s={1.5} />
      <Maple x={560} y={392} s={1} v={1} />
      <Maple x={1050} y={386} s={1.1} v={2} />
      <Maple x={1170} y={380} s={1.6} v={1} />
      <Pumpkin x={640} y={428} s={1.2} />
      <Pumpkin x={674} y={432} s={0.8} c="#D9541E" />
      <Pumpkin x={960} y={430} s={1.1} />
    </>
  );
}

/** `i`: 0 before, 1 on the day, 2 after */
export function AutumnMini({ i }: { i: number }) {
  return (
    <>
      {i === 2 ? (
        <circle cx="90" cy="-108" r="40" fill="#FFE9B8" />
      ) : (
        <circle cx={i ? 80 : -84} cy={i ? -100 : 14} r={i ? 36 : 58} fill={i ? "#FFF1C9" : "#FFD98F"} />
      )}
      {i === 2 ? <path d="M-140 -120h.1M-110 -160h.1M-20 -144h.1M-160 -50h.1M150 -30h.1M20 -170h.1" stroke="#FFE9C9" strokeWidth="6" strokeLinecap="round" /> : <Cloud x={i ? -92 : 96} y={-96} s={0.8} c="#FFE3BD" o={0.8} />}
      <path d="M-200 96C-120 52 -60 86 0 72C80 56 130 86 200 64V200H-200Z" fill={["#D98A4A", "#B9552B", "#5A1C1C"][i]} />
      <g transform="translate(0 122) scale(0.92)"><Lodge /></g>
      <Maple x={-138} y={130} s={0.95} v={i} />
      <Maple x={140} y={130} s={1} v={i + 1} />
      <path d="M-200 126C-100 104 100 104 200 126V200H-200Z" fill={i === 2 ? "#8A5320" : "#DDA245"} />
    </>
  );
}
