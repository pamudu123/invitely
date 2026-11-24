"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";

interface Flake { x: number; y: number; vx: number; vy: number; r: number; w: number }

/** Snow that swirls inside a round glass. Call shake() to stir it up. */
function useSnow(count: number) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const flakes = useRef<Flake[]>([]);
  const shake = useCallback((power = 1, dx = 0) => {
    for (const f of flakes.current) {
      f.vx += (Math.random() - 0.5) * 0.05 * power + dx;
      f.vy -= Math.random() * 0.045 * power;
    }
  }, []);
  useEffect(() => {
    const cv = ref.current;
    const ctx = cv?.getContext("2d");
    if (!cv || !ctx || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const n = 600;
    cv.width = n;
    cv.height = n;
    flakes.current = Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 1.7, y: Math.random() * 1.5 - 1, vx: 0, vy: 0, r: 1.6 + Math.random() * 3.4, w: Math.random() * 6.28,
    }));
    let raf = 0;
    const tick = () => {
      ctx.clearRect(0, 0, n, n);
      ctx.fillStyle = "#fff";
      for (const f of flakes.current) {
        f.w += 0.03;
        f.vx = f.vx * 0.975 + Math.sin(f.w) * 0.00012;
        f.vy = f.vy * 0.975 + 0.00012 + f.r * 0.00002;
        f.x += f.vx;
        f.y += f.vy;
        const d = Math.hypot(f.x, f.y);
        if (d > 0.95) {
          f.x *= 0.95 / d;
          f.y *= 0.95 / d;
          f.vx *= -0.4;
          f.vy *= -0.3;
        }
        if (f.y > 0.72) {
          f.y = 0.72;
          f.vy = 0;
          f.vx *= 0.6;
          if (Math.random() < 0.004) {
            f.y = -0.9;
            f.x = (Math.random() - 0.5) * 0.8;
          }
        }
        ctx.globalAlpha = 0.65 + f.r * 0.08;
        ctx.beginPath();
        ctx.arc((f.x * 0.5 + 0.5) * n, (f.y * 0.5 + 0.5) * n, f.r, 0, 6.2832);
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [count]);
  return { ref, shake };
}

export function Pine({ x, y, s, c = "#1F7A8C" }: { x: number; y: number; s: number; c?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-5 0h10v14h-10z" fill="#3B4A7A" />
      <path d="M0 -92L30 -44H16L38 -14H20L44 4H-44L-20 -14H-38L-16 -44H-30Z" fill={c} />
      <path d="M0 -92L30 -44H16L4 -56L-8 -44H-30ZM-38 -14L-20 -40L-4 -24L10 -38L38 -14H20L4 -26L-10 -14Z" fill="#fff" opacity="0.92" />
    </g>
  );
}

export function IcePalace() {
  const tower = (x: number, w: number, h: number, t: number, c: string) => (
    <g key={x}>
      <path d={`M${x - w / 2} 0V${-h}h${w}V0z`} fill={c} />
      <path d={`M${x - w / 2 - 5} ${-h}L${x} ${-h - t}L${x + w / 2 + 5} ${-h}z`} fill="#4B6BFF" />
      <path d={`M${x} ${-h - t}L${x + w / 2 + 5} ${-h}H${x}z`} fill="#2F49D9" />
      <path d={`M${x} ${-h - t}v-16`} stroke="#F3F9FF" strokeWidth="3" />
      <path d={`M${x} ${-h - t - 16}l16 5-16 6z`} fill="#8F7BFF" />
      <path d={`M${x - 6} ${-h + 34}v-14a6 6 0 0 1 12 0v14z`} fill="#FFE9A8" />
      {h > 100 ? <path d={`M${x - 6} ${-h + 74}v-14a6 6 0 0 1 12 0v14z`} fill="#FFE9A8" /> : null}
    </g>
  );
  return (
    <g>
      {tower(-96, 34, 92, 48, "#CFE4FF")}
      {tower(96, 34, 92, 48, "#CFE4FF")}
      {tower(-54, 40, 132, 62, "#E4F1FF")}
      {tower(54, 40, 132, 62, "#E4F1FF")}
      <path d="M-110 0V-64H110V0z" fill="#F3F9FF" />
      <path d="M-110 -64h14v-12h14v12h14v-12h14v12h14v-12h14v12h14v-12h14v12h14v-12h14v12h14v-12h14v12h14v-12h14v12h14v-12h10v12" fill="#F3F9FF" />
      {tower(0, 52, 168, 84, "#FFFFFF")}
      <path d="M-18 0v-36a18 18 0 0 1 36 0V0z" fill="#4B6BFF" />
      <path d="M0 -54V0" stroke="#CFE4FF" strokeWidth="3" />
      {[-78, -44, 44, 78].map((x) => <path key={x} d={`M${x - 6} -22v-14a6 6 0 0 1 12 0v14z`} fill="#FFE9A8" />)}
    </g>
  );
}

/** The couple, hand in hand. Feet at 0,0 and about 92 units tall. */
export function Couple() {
  return (
    <g className="frost-couple">
      <ellipse cx="2" cy="1" rx="58" ry="7" fill="#7FA6E8" opacity="0.5" />
      {/* Veil */}
      <path d="M27 -84C46 -74 56 -38 58 -3C48 2 40 2 34 0C40 -32 36 -62 25 -80Z" fill="#E9E4FF" stroke="#A795F5" strokeWidth="1.4" opacity="0.95" />
      {/* Gown */}
      <path d="M14 -46C8 -24 -4 -8 -6 0C8 5 34 5 46 0C42 -14 34 -28 31 -46Z" fill="#F8F5FF" stroke="#8F7BEB" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M18 -40C14 -22 8 -8 6 1M24 -42C24 -24 24 -10 24 2M29 -40C34 -24 37 -10 39 1" fill="none" stroke="#B5A6F2" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M14 -46C13 -56 15 -62 18 -64C20 -60 25 -60 27 -64C31 -62 32 -56 31 -46C26 -43 19 -43 14 -46Z" fill="#EDE6FF" stroke="#8F7BEB" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M14 -46C19 -43 26 -43 31 -46" fill="none" stroke="#6A4FE0" strokeWidth="3" strokeLinecap="round" />
      {/* Bride's arms, neck and head */}
      <path d="M16 -60C10 -54 4 -48 0 -41" fill="none" stroke="#E3AD86" strokeWidth="5" strokeLinecap="round" />
      <path d="M30 -60C36 -53 37 -46 32 -40" fill="none" stroke="#E3AD86" strokeWidth="5" strokeLinecap="round" />
      <path d="M20 -68h5v8h-5z" fill="#D89F78" />
      <circle cx="22" cy="-76" r="9.500" fill="#E9B68F" />
      <path d="M13 -76C12 -90 33 -90 32 -75C30 -82 22 -84 18 -82C16 -81 14 -79 13 -76Z" fill="#4A2C1E" />
      <circle cx="30" cy="-84" r="5" fill="#4A2C1E" />
      <path d="M14 -84C18 -90 26 -90 30 -85" fill="none" stroke="#A9FBE4" strokeWidth="2.600" strokeLinecap="round" />
      <path d="M17 -71.500q2.500 2.200 5 0" fill="none" stroke="#8A3B2A" strokeWidth="1.300" strokeLinecap="round" />
      {/* Bouquet */}
      <path d="M31 -38l3 10 3-10z" fill="#1F8A72" />
      {[[29, -42, "#FF9CC4"], [35, -44, "#C9A8FF"], [38, -39, "#FF9CC4"], [32, -37, "#FFFFFF"], [34, -40, "#8F6BFF"]].map(([x, y, c]) => (
        <circle key={`${x}${y}`} cx={x as number} cy={y as number} r="4" fill={c as string} stroke="#6A4FE0" strokeWidth="0.700" />
      ))}
      {/* Groom */}
      <path d="M-32 0L-30 -40H-12L-10 0H-18L-21 -30L-24 0Z" fill="#101B66" />
      <path d="M-35 -2h12v4h-14c0-2 1-3 2-4zM-19 -2h11c2 1 3 2 3 4h-14z" fill="#0A1248" />
      <path d="M-36 -36C-37 -54 -34 -62 -28 -66H-14C-8 -62 -6 -54 -7 -36C-14 -32 -29 -32 -36 -36Z" fill="#17258A" />
      <path d="M-26 -66L-21 -44L-16 -66Z" fill="#FFFFFF" />
      <path d="M-28 -66L-25 -50L-21 -44L-17 -50L-14 -66L-18 -66L-21 -52L-24 -66Z" fill="#2E45D6" />
      <path d="M-26 -63l5 2.500 5-2.500v5l-5-2.500-5 2.500z" fill="#A9FBE4" />
      <circle cx="-30" cy="-54" r="2.600" fill="#FF9CC4" />
      <path d="M-34 -60C-39 -52 -40 -44 -38 -36" fill="none" stroke="#17258A" strokeWidth="7" strokeLinecap="round" />
      <path d="M-10 -60C-4 -54 -1 -48 0 -42" fill="none" stroke="#17258A" strokeWidth="6.500" strokeLinecap="round" />
      <circle cx="-38" cy="-34" r="3.200" fill="#C98F66" />
      <circle cx="0" cy="-40" r="4" fill="#D89F78" />
      <path d="M-24 -72h6v8h-6z" fill="#BF855C" />
      <circle cx="-21" cy="-80" r="10" fill="#CF9468" />
      <path d="M-31 -79C-33 -94 -11 -96 -11 -80C-13 -85 -18 -87 -23 -86C-27 -85 -30 -83 -31 -79Z" fill="#1E1420" />
      <path d="M-21 -75q3 2.200 5.500 0" fill="none" stroke="#6B2E20" strokeWidth="1.300" strokeLinecap="round" />
      {/* A heart between them */}
      <path className="frost-heart" d="M1 -94C-10 -103 -8 -111 -3 -111C0 -111 1 -108 1 -107C1 -108 2 -111 5 -111C10 -111 12 -103 1 -94Z" fill="#FF6F9F" />
    </g>
  );
}

function Scene() {
  return (
    <svg viewBox="-200 -200 400 400" aria-hidden="true">
      <defs>
        <linearGradient id="frost-in" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2746E0" />
          <stop offset="0.55" stopColor="#5FA8FF" />
          <stop offset="1" stopColor="#C8F4FF" />
        </linearGradient>
      </defs>
      <path d="M-200 -200h400v400h-400z" fill="url(#frost-in)" />
      <circle cx="84" cy="-104" r="34" fill="#F6FBFF" />
      <path d="M-200 100C-120 50 -60 90 0 74C80 56 130 90 200 68V200H-200Z" fill="#9FD4FF" />
      <g transform="translate(0 112)"><IcePalace /></g>
      <Pine x={-146} y={122} s={0.8} />
      <Pine x={146} y={122} s={0.8} />
      <Pine x={-176} y={138} s={0.62} c="#2A9AA6" />
      <Pine x={122} y={140} s={0.56} c="#2A9AA6" />
      <Pine x={-118} y={142} s={0.5} c="#2A9AA6" />
      <path d="M-200 122C-100 102 100 102 200 122V200H-200Z" fill="#FFFFFF" />
      <path d="M-200 150C-90 132 90 160 200 142V200H-200Z" fill="#E4F2FF" />
      <g transform="translate(0 162) scale(1.08)"><Couple /></g>
    </svg>
  );
}

/** Tap or drag across the glass to shake it. Changing `nudge` from outside shakes it too. */
export function SnowGlobe({ nudge = 0 }: { nudge?: number }) {
  const { ref, shake } = useSnow(160);
  const [taps, setTaps] = useState(0);
  const last = useRef<number | null>(null);
  const jolt = nudge + taps;

  useEffect(() => {
    const t = window.setTimeout(() => shake(jolt ? 1.6 : 1.2), jolt ? 0 : 600);
    return () => window.clearTimeout(t);
  }, [jolt, shake]);

  const onMove = (e: PointerEvent) => {
    if (last.current !== null) shake(0.05, (e.clientX - last.current) * 0.00028);
    last.current = e.clientX;
  };

  return (
    <button
      type="button"
      className="frost-globe"
      aria-label="Shake the snow globe"
      onClick={() => setTaps((n) => n + 1)}
      onPointerMove={onMove}
      onPointerLeave={() => { last.current = null; }}
    >
      <span key={jolt} className={jolt ? "frost-jolt" : undefined}>
        <span className="frost-ball">
          <Scene />
          <canvas ref={ref} aria-hidden="true" />
          <span className="frost-shine" />
        </span>
        <svg viewBox="-220 0 440 130" className="frost-base" aria-hidden="true">
          <defs>
            <linearGradient id="frost-silver" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#8FA3D6" />
              <stop offset="0.3" stopColor="#FFFFFF" />
              <stop offset="0.55" stopColor="#C3D0F0" />
              <stop offset="0.8" stopColor="#F6F9FF" />
              <stop offset="1" stopColor="#7F92C8" />
            </linearGradient>
          </defs>
          <path d="M-150 0h300l16 34h-332z" fill="url(#frost-silver)" />
          <path d="M-166 34h332v16h-332z" fill="#6E83C4" />
          <path d="M-172 50h344l26 54h-396z" fill="url(#frost-silver)" />
          <path d="M-206 104h412v22h-412z" fill="#7A8ECC" />
          {Array.from({ length: 9 }, (_, i) => (
            <path key={i} d="M0 -13L4 -4L13 0L4 4L0 13L-4 4L-13 0L-4 -4Z" transform={`translate(${(i - 4) * 36} 77)`} fill="#4B6BFF" />
          ))}
        </svg>
      </span>
    </button>
  );
}
