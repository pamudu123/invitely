"use client";

import { useEffect, useRef } from "react";
import type { EffectId } from "@/lib/invitation/types";
import { useReducedMotion } from "./hooks";

interface Particle {
  x: number; y: number; vx: number; vy: number; size: number; rot: number; vr: number; hue: number; life: number; sway: number;
}

const festive = ["#F2674A", "#2BB3A3", "#F5B82E", "#7C6CF0", "#EF5DA8"];

/** Gentle ambient particles drawn over the invitation. Pointer events pass through. */
export function AmbientEffect({ kind, color, fixed }: { kind: EffectId; color: string; fixed: boolean }) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || kind === "none" || reduced) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let w = 0;
    let h = 0;
    let raf = 0;
    let running = true;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const count = kind === "sparkles" ? 24 : kind === "confetti" ? 20 : kind === "snow" ? 34 : 14;
    const spawn = (anywhere: boolean): Particle => ({
      x: Math.random() * w,
      y: anywhere ? Math.random() * h : -20,
      vx: (Math.random() - 0.5) * 0.3,
      vy: kind === "sparkles" ? -(0.08 + Math.random() * 0.18) : 0.35 + Math.random() * 0.6,
      size: kind === "sparkles" ? 1 + Math.random() * 2.2 : kind === "petals" ? 3 + Math.random() * 4 : kind === "snow" ? 1.2 + Math.random() * 2.6 : 5 + Math.random() * 6,
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.03,
      hue: Math.floor(Math.random() * festive.length),
      life: Math.random() * Math.PI * 2,
      sway: 0.3 + Math.random() * 0.7,
    });
    const parts: Particle[] = Array.from({ length: count }, () => spawn(true));

    const draw = () => {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        p.life += 0.02;
        p.x += p.vx + Math.sin(p.life) * 0.35 * p.sway;
        p.y += p.vy;
        p.rot += p.vr;
        if (p.y > h + 24 || p.y < -24 || p.x < -24 || p.x > w + 24) {
          parts[i] = spawn(false);
          if (kind === "sparkles") parts[i].y = h + 10;
          continue;
        }
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        if (kind === "sparkles") {
          ctx.globalAlpha = 0.25 + 0.55 * Math.abs(Math.sin(p.life * 1.7));
          ctx.fillStyle = color;
          const r = p.size * 1.8;
          ctx.beginPath();
          ctx.moveTo(0, -r);
          ctx.quadraticCurveTo(0, 0, r, 0);
          ctx.quadraticCurveTo(0, 0, 0, r);
          ctx.quadraticCurveTo(0, 0, -r, 0);
          ctx.quadraticCurveTo(0, 0, 0, -r);
          ctx.fill();
        } else if (kind === "snow") {
          ctx.globalAlpha = 0.35 + 0.4 * Math.abs(Math.sin(p.life));
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (kind === "petals") {
          ctx.globalAlpha = 0.26;
          ctx.fillStyle = color;
          ctx.scale(1, 0.55 + 0.4 * Math.sin(p.life * 1.3));
          ctx.beginPath();
          ctx.moveTo(0, -p.size);
          ctx.bezierCurveTo(p.size, -p.size * 0.6, p.size * 0.8, p.size * 0.8, 0, p.size);
          ctx.bezierCurveTo(-p.size * 0.8, p.size * 0.8, -p.size, -p.size * 0.6, 0, -p.size);
          ctx.fill();
        } else {
          ctx.globalAlpha = 0.7;
          ctx.fillStyle = festive[p.hue];
          ctx.scale(1, Math.cos(p.life * 2));
          ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size / 1.6);
        }
        ctx.restore();
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    const onVis = () => {
      running = !document.hidden;
      if (running) raf = requestAnimationFrame(draw);
      else cancelAnimationFrame(raf);
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [kind, color, reduced]);

  if (kind === "none" || reduced) return null;
  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={`${fixed ? "fixed" : "absolute"} inset-0 z-20 h-full w-full pointer-events-none`}
    />
  );
}

/** One-off confetti burst from a point, used by the balloon opening. */
export function burstConfetti(canvas: HTMLCanvasElement, originX: number, originY: number, palette: string[]) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const r = canvas.getBoundingClientRect();
  canvas.width = Math.round(r.width * dpr);
  canvas.height = Math.round(r.height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const colors = [...palette, ...festive];
  const parts = Array.from({ length: 130 }, () => {
    const a = Math.random() * Math.PI * 2;
    const s = 3 + Math.random() * 10;
    return {
      x: originX, y: originY, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 4,
      size: 5 + Math.random() * 7, rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.4,
      color: colors[Math.floor(Math.random() * colors.length)], round: Math.random() < 0.3,
    };
  });
  let frame = 0;
  const tick = () => {
    frame++;
    ctx.clearRect(0, 0, r.width, r.height);
    for (const p of parts) {
      p.vy += 0.28;
      p.vx *= 0.985;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      ctx.save();
      ctx.globalAlpha = Math.max(0, 1 - frame / 110);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      if (p.round) {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2.4, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.scale(1, Math.cos(frame * 0.2 + p.rot));
        ctx.fillRect(-p.size / 2, -p.size / 3.5, p.size, p.size / 1.7);
      }
      ctx.restore();
    }
    if (frame < 110) requestAnimationFrame(tick);
    else ctx.clearRect(0, 0, r.width, r.height);
  };
  requestAnimationFrame(tick);
}
