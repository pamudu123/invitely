"use client";

import { useRef, useState } from "react";
import { burstConfetti } from "../Effects";
import { CoverTitle, Hint, SkipButton, type RitualProps } from "./shared";

function BalloonShape({ color, className = "", style }: { color: string; className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 100 190" className={className} style={style} aria-hidden="true">
      <path d="M50 122q-7 22 0 36t0 30" fill="none" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1.200" />
      <ellipse cx="50" cy="60" rx="44" ry="56" fill={color} />
      <ellipse cx="34" cy="38" rx="9" ry="16" fill="#fff" opacity="0.32" transform="rotate(-24 34 38)" />
      <path d="M43 114l7 10 7-10z" fill={color} />
    </svg>
  );
}

/** Pop the balloon. Confetti bursts and the party starts. */
export function BalloonRitual({ data, guestName, onOpen, onDone }: RitualProps) {
  const [popped, setPopped] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const balloonRef = useRef<HTMLButtonElement | null>(null);

  const pop = () => {
    if (popped) return;
    setPopped(true);
    onOpen();
    const canvas = canvasRef.current;
    const b = balloonRef.current;
    if (canvas && b) {
      const c = canvas.getBoundingClientRect();
      const r = b.getBoundingClientRect();
      const styles = getComputedStyle(canvas);
      burstConfetti(canvas, r.left - c.left + r.width / 2, r.top - c.top + r.height * 0.32, [
        styles.getPropertyValue("--inv-accent").trim() || "#EE6447",
      ]);
    }
    window.setTimeout(onDone, 1500);
  };

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: "var(--inv-bg)", color: "var(--inv-ink)" }}>
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(circle, color-mix(in srgb, var(--inv-accent) 55%, transparent) 2.500px, transparent 3px), radial-gradient(circle, color-mix(in srgb, var(--inv-ink) 30%, transparent) 2px, transparent 2.500px)",
          backgroundSize: "74px 74px, 112px 112px",
          backgroundPosition: "12px 20px, 50px 70px",
        }}
      />
      <div className="relative z-10 flex h-full flex-col items-center justify-between px-6 pb-[10%] pt-[12%]">
        <CoverTitle data={data} guestName={guestName} />

        <div className="relative flex items-end justify-center" style={{ height: "min(42cqh, 20rem)" }}>
          <BalloonShape
            color="color-mix(in srgb, var(--inv-ink) 75%, var(--inv-bg))"
            className="h-[72%] w-auto animate-float"
            style={{ animationDelay: "-2s", marginRight: "-1.2rem", opacity: popped ? 0 : 0.9, transition: "opacity 0.4s" }}
          />
          <button
            ref={balloonRef}
            type="button"
            onClick={pop}
            aria-label={data.ritualHint || "Pop the balloon"}
            className="relative z-10 h-full outline-none"
            style={{
              transform: popped ? "scale(1.35)" : "scale(1)",
              opacity: popped ? 0 : 1,
              transition: "transform 0.16s ease-out, opacity 0.16s ease-out",
            }}
          >
            <BalloonShape color="var(--inv-accent)" className="h-full w-auto animate-float" />
          </button>
          <BalloonShape
            color="#2BB3A3"
            className="h-[64%] w-auto animate-float"
            style={{ animationDelay: "-4s", marginLeft: "-1.2rem", opacity: popped ? 0 : 0.9, transition: "opacity 0.4s" }}
          />
        </div>

        <Hint text={data.ritualHint || "Pop the balloon"} className={`transition-opacity ${popped ? "opacity-0" : "opacity-80"}`} />
      </div>
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 z-20 h-full w-full" />
      {!popped ? <SkipButton onSkip={pop} /> : null}
    </div>
  );
}
