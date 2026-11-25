import { Cloud, type TreeProps } from "./parts";

function Palm({ x, y, s, v = 0 }: TreeProps) {
  const leaf = v % 2 ? "#2FA36B" : "#148A63";
  const light = v % 2 ? "#63C98A" : "#3FB57F";
  return (
    <g transform={`translate(${x} ${y}) scale(${v % 2 ? -s : s} ${s})`}>
      <path d="M-7 14C-4 -20 0 -50 8 -78L15 -76C9 -48 7 -18 8 14Z" fill="#A86F3B" />
      <path d="M-5 0l12 -3M-4 -16l11 -3M-2 -32l10 -3M1 -48l9 -3M5 -63l8 -2" stroke="#7E4E25" strokeWidth="2.400" />
      <path d="M12 -78C2 -104 -26 -108 -44 -88C-24 -92 -6 -86 12 -78Z" fill={leaf} />
      <path d="M12 -78C-10 -86 -34 -72 -38 -44C-26 -62 -8 -70 12 -78Z" fill={light} />
      <path d="M12 -78C22 -104 50 -108 66 -88C48 -92 30 -86 12 -78Z" fill={light} />
      <path d="M12 -78C34 -86 56 -72 60 -44C48 -62 30 -70 12 -78Z" fill={leaf} />
      <path d="M12 -78C4 -100 14 -118 30 -122C22 -108 18 -94 12 -78Z" fill={leaf} />
      <path d="M12 -78C2 -70 -8 -56 -6 -38C2 -52 8 -64 12 -78Z" fill={leaf} />
      <path d="M12 -78C24 -70 32 -58 30 -40C22 -52 16 -64 12 -78Z" fill={light} />
      <circle cx="8" cy="-73" r="5" fill="#6B3E1C" />
      <circle cx="16" cy="-72" r="4.500" fill="#85502A" />
    </g>
  );
}

function Boat({ x, y, s, c = "#E8452C" }: { x: number; y: number; s: number; c?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 -8V-70L-30 -14Z" fill="#FFFFFF" />
      <path d="M4 -8V-60L30 -14Z" fill={c} />
      <path d="M-34 -6H36L24 8H-24Z" fill="#0B4A55" />
    </g>
  );
}

function Parasol({ x, y, s, a = "#E8452C", b = "#FFFFFF" }: { x: number; y: number; s: number; a?: string; b?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-46 2C-46 -4 46 -4 46 2Z" fill="#D9AE62" opacity="0.8" />
      <path d="M-2 0h4v-60h-4z" fill="#8A5A2E" />
      <path d="M-44 -50C-40 -84 -18 -96 0 -96C18 -96 40 -84 44 -50Z" fill={a} />
      <path d="M-22 -50C-20 -80 -8 -94 0 -96C8 -94 20 -80 22 -50Z" fill={b} />
      <path d="M-7 -50C-7 -80 -3 -94 0 -96C3 -94 7 -80 7 -50Z" fill={a} />
    </g>
  );
}

/** Lighthouse and a beach house with a striped awning. Stands on 0,0. */
function BeachHouse() {
  return (
    <g>
      {/* Lighthouse */}
      <path d="M-100 0L-90 -176H-50L-40 0Z" fill="#FFFFFF" />
      <path d="M-97.500 -44L-95 -88H-45L-42.500 -44ZM-92.500 -132L-90 -176H-50L-47.500 -132Z" fill="#E8452C" />
      <path d="M-62 0L-60 -176H-50L-40 0Z" fill="#0B2A33" opacity="0.1" />
      <path d="M-98 -184h56v8h-56z" fill="#0B4A55" />
      <path d="M-86 -216h32v32h-32z" fill="#FFF3B0" />
      <path d="M-86 -216h6v32h-6zM-73 -216h6v32h-6zM-60 -216h6v32h-6z" fill="#0B4A55" />
      <path d="M-94 -216C-90 -236 -78 -244 -70 -244C-62 -244 -50 -236 -46 -216Z" fill="#E8452C" />
      <circle cx="-70" cy="-248" r="5" fill="#FFC933" />
      <path d="M-78 0v-26a8 8 0 0 1 16 0V0z" fill="#0B4A55" />
      <circle cx="-70" cy="-108" r="7" fill="#0B4A55" />
      {/* House */}
      <path d="M-28 0V-84H112V0Z" fill="#FFF7E2" />
      <path d="M-40 -84L42 -142L124 -84Z" fill="#0E8C99" />
      <path d="M42 -142L124 -84H70Z" fill="#0A6F7B" />
      <circle cx="42" cy="-104" r="11" fill="#FFF3B0" stroke="#FFFFFF" strokeWidth="4" />
      <path d="M24 0v-52h36V0z" fill="#0E8C99" />
      <path d="M42 0v-52" stroke="#FFF7E2" strokeWidth="2.500" />
      <path d="M-14 -48h26v28h-26zM72 -48h26v28h-26z" fill="#FFE27A" stroke="#FFFFFF" strokeWidth="4" />
      {Array.from({ length: 8 }, (_, i) => (
        <path key={i} d={`M${-36 + i * 19.5} -84h19.500l1 18a9.700 9 0 0 1 -19.500 0z`} fill={i % 2 ? "#FFFFFF" : "#FF7A52"} />
      ))}
      {/* Deck */}
      <path d="M-44 0h172v8h-172z" fill="#B98046" />
    </g>
  );
}

function Sea({ y = 46, a = "#19B5C4", b = "#3FD0D3" }: { y?: number; a?: string; b?: string }) {
  return (
    <>
      <path d={`M-200 ${y}h400v200h-400z`} fill={a} />
      <path d={`M-200 ${y + 26}q25 -8 50 0t50 0t50 0t50 0t50 0t50 0t50 0t50 0V200H-200Z`} fill={b} />
    </>
  );
}

export function SummerGlobe() {
  return (
    <>
      <defs>
        <linearGradient id="summer-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2AA8E0" />
          <stop offset="0.4" stopColor="#8EDCF2" />
          <stop offset="0.65" stopColor="#FFF0C2" />
        </linearGradient>
      </defs>
      <path d="M-200 -200h400v400h-400z" fill="url(#summer-sky)" />
      <circle cx="92" cy="-108" r="50" fill="#FFE27A" opacity="0.45" />
      <circle cx="92" cy="-108" r="34" fill="#FFD233" />
      <Cloud x={-124} y={-100} s={0.6} />
      <Cloud x={20} y={-64} s={0.5} />
      <Sea />
      <Boat x={152} y={72} s={0.6} />
      <Boat x={-160} y={66} s={0.45} c="#FFC933" />
      <path d="M-200 118C-130 88 -60 92 0 90C80 88 140 94 200 112V200H-200Z" fill="#F8DDA0" />
      <g transform="translate(0 114)"><BeachHouse /></g>
      <Palm x={-146} y={122} s={1} />
      <Palm x={156} y={122} s={1.12} v={1} />
      <Palm x={-182} y={140} s={0.78} v={1} />
      <path d="M-200 124C-100 108 100 108 200 124V200H-200Z" fill="#FCE7B5" />
      <path d="M-200 152C-90 136 90 160 200 146V200H-200Z" fill="#F6D893" />
      <Parasol x={114} y={158} s={0.62} />
      <path d="M-104 156l4 -9 4 9 9 1 -7 6 2 9 -8 -5 -8 5 2 -9 -7 -6z" fill="#FF7A52" />
    </>
  );
}

export function SummerHorizon() {
  return (
    <>
      <svg viewBox="0 0 1600 420" preserveAspectRatio="none">
        <path d="M0 196H1600V420H0Z" fill="#0FA3B5" />
        <path d="M0 238q50 -14 100 0t100 0t100 0t100 0t100 0t100 0t100 0t100 0t100 0t100 0t100 0t100 0t100 0t100 0t100 0t100 0V420H0Z" fill="#2BC0C8" />
        <path d="M0 284q80 -16 160 0t160 0t160 0t160 0t160 0t160 0t160 0t160 0t160 0t160 0V420H0Z" fill="#6ADBD8" />
        <path d="M0 420V330C200 300 420 318 640 328C880 340 1120 300 1320 310C1440 314 1540 306 1600 300V420Z" fill="#FFFFFF" opacity="0.85" />
        <path d="M0 420V342C200 312 420 330 640 340C880 352 1120 312 1320 322C1440 326 1540 318 1600 312V420Z" fill="#FCE3AC" />
        <path d="M0 420V384C260 352 520 394 800 376C1080 358 1340 394 1600 366V420Z" fill="#F4CF85" />
      </svg>
      <svg viewBox="0 0 1600 420" preserveAspectRatio="xMidYMax slice">
        <Boat x={520} y={300} s={0.9} />
        <Boat x={700} y={290} s={0.5} c="#FFC933" />
        <Palm x={70} y={366} s={1.9} />
        <Palm x={196} y={378} s={1.25} v={1} />
        <Parasol x={320} y={392} s={1} />
        <Palm x={1430} y={374} s={1.3} v={1} />
        <Palm x={1530} y={366} s={1.9} />
        <path d="M430 384l6 -14 6 14 14 2 -10 9 3 14 -13 -7 -13 7 3 -14 -10 -9z" fill="#E8452C" />
      </svg>
    </>
  );
}

export function SummerView() {
  return (
    <>
      <circle cx="800" cy="212" r="150" fill="#FFF3B8" opacity="0.55" />
      <circle cx="800" cy="212" r="108" fill="#FFE27A" />
      <path d="M0 214H1600V460H0Z" fill="#0FA3B5" />
      <path d="M0 252q50 -12 100 0t100 0t100 0t100 0t100 0t100 0t100 0t100 0t100 0t100 0t100 0t100 0t100 0t100 0t100 0t100 0V460H0Z" fill="#2BC0C8" />
      <path d="M0 300q80 -14 160 0t160 0t160 0t160 0t160 0t160 0t160 0t160 0t160 0t160 0V460H0Z" fill="#6ADBD8" />
      <Boat x={330} y={250} s={1.1} />
      <Boat x={1290} y={244} s={0.8} c="#FFC933" />
      <path d="M0 460V380C300 340 560 340 800 336C1040 334 1300 350 1600 350V460Z" fill="#FBE0A6" />
      <g transform="translate(800 358) scale(1.1)"><BeachHouse /></g>
      <path d="M0 460V384C300 344 560 372 800 356C1040 340 1300 378 1600 352V460Z" fill="#FCE7B5" />
      <path d="M0 460V422C300 392 560 436 800 420C1040 404 1300 436 1600 404V460Z" fill="#F4CF85" />
      <Palm x={450} y={380} s={1.7} />
      <Palm x={570} y={392} s={1.1} v={1} />
      <Palm x={1090} y={386} s={1.5} v={1} />
      <Parasol x={1180} y={404} s={0.9} />
      <Parasol x={370} y={410} s={0.9} a="#0E8C99" />
    </>
  );
}

/** `i`: 0 before, 1 on the day, 2 after */
export function SummerMini({ i }: { i: number }) {
  return (
    <>
      {i === 2 ? (
        <path d="M76 -140a44 44 0 1 0 40 62a36 36 0 1 1 -40 -62z" fill="#FFF3C4" />
      ) : (
        <circle cx={i ? 74 : -84} cy={i ? -108 : 28} r={i ? 38 : 62} fill={i ? "#FFD233" : "#FFE27A"} />
      )}
      {i === 1 ? <Cloud x={-92} y={-112} s={0.8} /> : null}
      {i === 2 ? <path d="M-140 -120h.1M-110 -160h.1M-20 -124h.1M-160 -50h.1M150 -20h.1M20 -170h.1" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" /> : null}
      <Sea y={60} a={["#FF9B6E", "#19B5C4", "#0B5E7A"][i]} b={["#FFB583", "#3FD0D3", "#0F7490"][i]} />
      <path d="M-200 122C-120 96 -60 100 0 98C80 96 130 100 200 118V200H-200Z" fill={i === 2 ? "#B9A06A" : "#F8DDA0"} />
      <g transform="translate(0 122) scale(0.86)"><BeachHouse /></g>
      <Palm x={-136} y={130} s={0.95} />
      <Palm x={142} y={130} s={0.98} v={1} />
      <path d="M-200 128C-100 108 100 108 200 128V200H-200Z" fill={i === 2 ? "#CDB47C" : "#FCE7B5"} />
    </>
  );
}
