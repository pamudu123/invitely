import type { ReactElement } from "react";
import type { SceneId } from "@/lib/invitation/types";

/* Line drawings behind the 3D object: court markings, a blueprint grid, a pulse.
   Drawn on 400 x 400. "floor" lays them down in perspective, "wall" leaves them upright. */

const range = (n: number) => Array.from({ length: n }, (_, i) => i);

const grid = (n: number) => (
  <path d={range(n + 1).map((i) => `M${(i * 400) / n} 0V400M0 ${(i * 400) / n}H400`).join("")} />
);
const rings = (...r: number[]) => <>{r.map((x) => <circle key={x} cx="200" cy="200" r={x} />)}</>;
const court = (
  <path d="M60 10H340V390H60ZM95 10V390M305 10V390M60 200H340M95 110H305M95 290H305M200 110V290" />
);
const rays = <path d={range(24).map((i) => {
  const a = (i / 24) * Math.PI * 2;
  return `M${(200 + Math.cos(a) * 70).toFixed(1)} ${(200 + Math.sin(a) * 70).toFixed(1)}L${(200 + Math.cos(a) * 320).toFixed(1)} ${(200 + Math.sin(a) * 320).toFixed(1)}`;
}).join("")} />;

const art: Record<SceneId, ReactElement> = {
  chess: <path stroke="none" fill="currentColor" d={range(32).map((i) => {
    const y = Math.floor(i / 4);
    const x = (i % 4) * 2 + (y % 2);
    return `M${x * 50} ${y * 50}h50v50h-50z`;
  }).join("")} />,
  cricket: <>{rings(190, 120)}<path d="M180 120h40v160h-40zM170 150h60M170 250h60" /></>,
  tennis: court,
  football: <><path d="M30 10H370V390H30ZM30 200H370M110 10V90H290V10M155 10V45H245V10M110 390V310H290V390M155 390V355H245V390M150 90a60 60 0 0 0 100 0M150 310a60 60 0 0 1 100 0" /><circle cx="200" cy="200" r="58" /></>,
  basketball: <><path d="M40 10H360V390H40ZM145 10V150H255V10M145 150a55 55 0 0 0 110 0M70 10v60a130 130 0 0 0 260 0V10" /><circle cx="200" cy="380" r="55" /></>,
  badminton: court,
  rugby: <path d="M30 10H370V390H30ZM30 60H370M30 200H370M30 340H370M30 130h340M30 270h340" strokeDasharray="14 10" />,
  golf: <path d="M200 60c90-10 150 60 140 150s-90 140-170 120S50 240 70 160 130 68 200 60ZM200 100c60-6 108 42 100 112s-64 104-124 88-84-70-70-124 40-70 94-76ZM200 140c36-4 66 28 62 72s-40 68-78 58-52-44-44-80 26-46 60-50Z" />,
  tabletennis: <path d="M70 20H330V380H70ZM200 20V380M70 200H330M60 200h280" strokeWidth="3" />,
  trophy: rays,
  doctor: <path strokeWidth="3" d="M-20 200H90l16-26 18 26h24l14-96 26 178 24-110 14 28h30l18-34 20 34h160" />,
  lawyer: <path d={range(9).map((i) => `M${20 + i * 45} 0V400`).join("") + "M0 40H400M0 56H400M0 350H400M0 366H400"} />,
  architect: <>{grid(20)}<path strokeWidth="2" d="M40 340H360M40 332v16M360 332v16M30 60V320M22 60h16M22 320h16" /></>,
  chef: rings(60, 100, 140, 180, 220),
  developer: <path strokeDasharray="2 10" strokeWidth="2" d={range(21).map((i) => `M0 ${i * 20}H400`).join("")} />,
  pilot: <path d="M-20 320Q200 40 420 320M-20 360Q200 110 420 360M-20 280Q200-30 420 280" strokeDasharray="10 8" strokeWidth="2" />,
  photographer: <path d="M133 0V400M266 0V400M0 133H400M0 266H400M170 200H230M200 170V230M20 70V20H70M330 20H380V70M380 330V380H330M70 380H20V330" />,
  teacher: <path d={range(14).map((i) => `M0 ${24 + i * 28}H400`).join("") + "M60 0V400"} />,
  musician: <path d={range(5).map((i) => `M-20 ${130 + i * 26}Q100 ${80 + i * 26} 200 ${130 + i * 26}T420 ${130 + i * 26}`).join("")} strokeWidth="1.500" />,
  engineer: <>{grid(16)}{rings(70, 150)}<path d="M200 0V400M0 200H400" strokeDasharray="16 5 3 5" /></>,
};

export function SceneBackdrop({ scene, plane }: { scene: SceneId; plane: "wall" | "floor" }) {
  const svg = (
    <svg
      viewBox="0 0 400 400"
      className="absolute"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.600"
      style={
        plane === "floor"
          ? { left: "-40%", width: "180%", top: "46%", transform: "rotateX(66deg)", transformOrigin: "50% 0%", opacity: 0.3 }
          : { left: "50%", top: "52%", width: "max(120cqw, calc(var(--inv-screen) * 0.7))", transform: "translate(-50%, -50%)", opacity: 0.13 }
      }
    >
      {art[scene]}
    </svg>
  );
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      style={{
        color: "var(--inv-ink)",
        perspective: plane === "floor" ? "700px" : undefined,
        perspectiveOrigin: "50% 40%",
        maskImage: plane === "floor" ? "linear-gradient(180deg, transparent 40%, #000 60%, #000 78%, transparent)" : "radial-gradient(75% 55% at 50% 52%, #000 30%, transparent 100%)",
        WebkitMaskImage: plane === "floor" ? "linear-gradient(180deg, transparent 40%, #000 60%, #000 78%, transparent)" : "radial-gradient(75% 55% at 50% 52%, #000 30%, transparent 100%)",
      }}
    >
      {svg}
    </div>
  );
}
