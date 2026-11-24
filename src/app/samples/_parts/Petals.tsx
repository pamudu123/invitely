"use client";

import { useEffect, useRef } from "react";

interface Bit {
  x: number; y: number; vx: number; vy: number; s: number; r: number; vr: number; f: number; c: string; life: number; drift: boolean;
}

type Shape = "petal" | "bubble" | "confetti";

/** One fixed canvas: a light drift, plus bursts sent with burst(). */
export function Petals({ colors, drift = 9, shape = "petal" }: { colors: string[]; drift?: number; shape?: Shape }) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const key = colors.join();

  useEffect(() => {
    const cv = ref.current;
    const ctx = cv?.getContext("2d");
    if (!cv || !ctx || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const palette = key.split(",");
    const up = shape === "bubble";
    const pick = () => palette[Math.floor(Math.random() * palette.length)];
    let w = 0;
    let h = 0;
    let raf = 0;
    const size = () => {
      const d = Math.min(2, window.devicePixelRatio || 1);
      w = window.innerWidth;
      h = window.innerHeight;
      cv.width = w * d;
      cv.height = h * d;
      ctx.setTransform(d, 0, 0, d, 0, 0);
    };
    size();
    const floating = (edge: boolean): Bit => ({
      x: Math.random() * w, y: edge ? (up ? h + 20 : -20) : Math.random() * h,
      vx: -0.25 + Math.random() * 0.5, vy: (0.4 + Math.random() * 0.7) * (up ? -1 : 1),
      s: (up ? 2 : 6) + Math.random() * (up ? 6 : 8), r: Math.random() * 6.28, vr: -0.015 + Math.random() * 0.03,
      f: Math.random() * 6.28, c: pick(), life: 1, drift: true,
    });
    let bits: Bit[] = Array.from({ length: w < 700 ? Math.ceil(drift / 2) : drift }, () => floating(false));
    const onBurst = (e: Event) => {
      const { x, y, count } = (e as CustomEvent<{ x: number; y: number; count: number }>).detail;
      for (let i = 0; i < count; i++) {
        const a = Math.random() * Math.PI * 2;
        const v = 3 + Math.random() * 9;
        bits.push({
          x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 4, s: (up ? 3 : 6) + Math.random() * (up ? 7 : 10), r: a,
          vr: -0.12 + Math.random() * 0.24, f: Math.random() * 6.28, c: pick(), life: 1, drift: false,
        });
      }
    };
    const draw = (p: Bit) => {
      ctx.fillStyle = p.c;
      ctx.strokeStyle = p.c;
      ctx.beginPath();
      if (shape === "bubble") {
        ctx.arc(0, 0, p.s, 0, 6.2832);
        ctx.lineWidth = 1.4;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(-p.s * 0.3, -p.s * 0.3, p.s * 0.2, 0, 6.2832);
        ctx.fill();
        return;
      }
      ctx.scale(1, 0.45 + Math.abs(Math.sin(p.f)) * 0.55);
      if (shape === "confetti") {
        ctx.rect(-p.s * 0.5, -p.s * 0.8, p.s, p.s * 1.6);
      } else {
        ctx.moveTo(0, -p.s);
        ctx.bezierCurveTo(p.s, -p.s * 0.6, p.s * 0.8, p.s * 0.7, 0, p.s);
        ctx.bezierCurveTo(-p.s * 0.8, p.s * 0.7, -p.s, -p.s * 0.6, 0, -p.s);
      }
      ctx.fill();
    };
    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      bits = bits.filter((p) => p.life > 0);
      for (const p of bits) {
        p.f += 0.04;
        if (p.drift) {
          p.x += p.vx + Math.sin(p.f) * 0.5;
          p.y += p.vy;
          if (up ? p.y < -30 : p.y > h + 30) Object.assign(p, floating(true));
        } else {
          p.vx *= 0.97;
          p.vy = p.vy * 0.97 + (up ? -0.1 : 0.16);
          p.x += p.vx + Math.sin(p.f) * 0.7;
          p.y += p.vy;
          p.life -= 0.006;
        }
        p.r += p.vr;
        ctx.save();
        ctx.globalAlpha = Math.min(1, p.life * 1.6) * (p.drift ? 0.8 : 1);
        ctx.translate(p.x, p.y);
        if (!up) ctx.rotate(p.r);
        draw(p);
        ctx.restore();
      }
      raf = requestAnimationFrame(tick);
    };
    tick();
    window.addEventListener("resize", size);
    window.addEventListener("sample-petals", onBurst);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", size);
      window.removeEventListener("sample-petals", onBurst);
    };
  }, [key, drift, shape]);

  return <canvas ref={ref} aria-hidden="true" className="s-petals" />;
}
