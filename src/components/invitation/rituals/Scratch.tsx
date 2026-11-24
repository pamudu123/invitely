"use client";

import { useEffect, useRef, useState } from "react";
import { dateParts } from "@/lib/invitation/time";
import { CoverTitle, Hint, SkipButton, type RitualProps } from "./shared";

/** Scratch away the foil to reveal the date. */
export function ScratchRitual({ data, guestName, onOpen, onDone }: RitualProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [revealed, setRevealed] = useState(false);
  const started = useRef(false);
  const finished = useRef(false);
  const parts = dateParts(data.date);

  const finish = () => {
    if (finished.current) return;
    finished.current = true;
    if (!started.current) {
      started.current = true;
      onOpen();
    }
    setRevealed(true);
    window.setTimeout(onDone, 1900);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    ctx.scale(dpr, dpr);

    // Foil
    const g = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    g.addColorStop(0, "#8f6f33");
    g.addColorStop(0.25, "#e9cf8f");
    g.addColorStop(0.5, "#b08a45");
    g.addColorStop(0.75, "#f1dca3");
    g.addColorStop(1, "#8f6f33");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, rect.width, rect.height);
    // Speckle
    for (let i = 0; i < 900; i++) {
      ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.16})`;
      ctx.fillRect(Math.random() * rect.width, Math.random() * rect.height, 1.2, 1.2);
    }
    ctx.fillStyle = "rgba(60,40,10,0.55)";
    ctx.font = "600 11px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const text = "S C R A T C H   H E R E";
    ctx.fillText(text, rect.width / 2, rect.height / 2);

    ctx.globalCompositeOperation = "destination-out";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 34;

    let drawing = false;
    let last: { x: number; y: number } | null = null;
    let moves = 0;

    const pos = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const check = () => {
      const sample = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let clear = 0;
      let total = 0;
      for (let i = 3; i < sample.length; i += 4 * 24) {
        total++;
        if (sample[i] < 40) clear++;
      }
      if (clear / total > 0.42) finish();
    };
    const down = (e: PointerEvent) => {
      drawing = true;
      last = pos(e);
      canvas.setPointerCapture(e.pointerId);
      if (!started.current) {
        started.current = true;
        onOpen();
      }
      ctx.beginPath();
      ctx.arc(last.x, last.y, 17, 0, Math.PI * 2);
      ctx.fill();
    };
    const move = (e: PointerEvent) => {
      if (!drawing || !last) return;
      const p = pos(e);
      ctx.beginPath();
      ctx.moveTo(last.x, last.y);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
      last = p;
      if (++moves % 14 === 0) check();
    };
    const up = () => {
      drawing = false;
      last = null;
      check();
    };
    canvas.addEventListener("pointerdown", down);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerup", up);
    canvas.addEventListener("pointercancel", up);
    return () => {
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerup", up);
      canvas.removeEventListener("pointercancel", up);
    };
    // The canvas is set up once per mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="absolute inset-0 overflow-hidden transition-opacity duration-700"
      style={{
        background: "var(--inv-bg)",
        color: "var(--inv-ink)",
      }}
    >
      <div className="inv-paper absolute inset-0" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center gap-[6cqh] px-6">
        <CoverTitle data={data} guestName={guestName} />

        <div
          className="relative w-[min(78cqw,19rem)] select-none"
          style={{ aspectRatio: "5 / 3" }}
        >
          <div
            className="absolute inset-0 flex flex-col items-center justify-center border"
            style={{ borderColor: "var(--inv-accent)", background: "var(--inv-surface)" }}
          >
            <span className="inv-kicker" style={{ color: "var(--inv-accent)" }} suppressHydrationWarning>{parts.weekday}</span>
            <span className="inv-serif leading-none" style={{ fontSize: "clamp(3rem, 20cqw, 4.6rem)" }}>{parts.day}</span>
            <span className="inv-kicker" suppressHydrationWarning>{parts.month} {parts.year}</span>
          </div>
          <canvas
            ref={canvasRef}
            className="absolute inset-0 h-full w-full cursor-grab touch-none transition-opacity duration-700"
            style={{ opacity: revealed ? 0 : 1, boxShadow: "0 10px 30px rgba(0,0,0,0.18)" }}
            aria-label="Scratch to reveal the date"
          />
        </div>

        <Hint text={data.ritualHint || "Scratch to reveal the date"} className={`transition-opacity duration-500 ${revealed ? "opacity-0" : "opacity-80"}`} />
      </div>
      {!revealed ? <SkipButton onSkip={finish} /> : null}
    </div>
  );
}
