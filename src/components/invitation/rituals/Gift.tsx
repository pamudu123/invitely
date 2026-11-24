"use client";

import { useRef, useState } from "react";
import { burstConfetti } from "../Effects";
import { CoverTitle, Hint, SkipButton, type RitualProps } from "./shared";

/** Open the gift. The lid lifts away and sparkle bursts out of the box. */
export function GiftRitual({ data, guestName, onOpen, onDone }: RitualProps) {
  const [open, setOpen] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const boxRef = useRef<HTMLButtonElement | null>(null);

  const lift = () => {
    if (open) return;
    setOpen(true);
    onOpen();
    window.setTimeout(() => {
      const canvas = canvasRef.current;
      const b = boxRef.current;
      if (canvas && b) {
        const c = canvas.getBoundingClientRect();
        const r = b.getBoundingClientRect();
        const accent = getComputedStyle(canvas).getPropertyValue("--inv-accent").trim() || "#D9B45C";
        burstConfetti(canvas, r.left - c.left + r.width / 2, r.top - c.top + r.height * 0.35, [accent, "#ffffff", accent]);
      }
    }, 260);
    window.setTimeout(onDone, 1700);
  };

  const ribbon = "linear-gradient(90deg, color-mix(in srgb, var(--inv-accent) 70%, #000), var(--inv-accent) 40%, color-mix(in srgb, var(--inv-accent) 70%, #fff) 60%, color-mix(in srgb, var(--inv-accent) 75%, #000))";
  const wrap = "color-mix(in srgb, var(--inv-deep) 70%, var(--inv-accent))";

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: "var(--inv-deep)", color: "var(--inv-on-deep)" }}>
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(80% 50% at 50% 68%, color-mix(in srgb, var(--inv-accent) 24%, transparent), transparent 70%)" }}
      />
      <div className="relative z-10 flex h-full flex-col items-center justify-between px-6 pb-[11%] pt-[13%]">
        <CoverTitle data={data} guestName={guestName} />

        <div className="flex flex-col items-center">
          <button
            ref={boxRef}
            type="button"
            onClick={lift}
            aria-label={data.ritualHint || "Open the gift"}
            className="relative outline-none"
            style={{ width: "min(54cqw, 13rem)", aspectRatio: "1 / 1.05" }}
          >
            {/* Glow from inside */}
            <span
              className="absolute left-1/2 top-[30%] h-[120%] w-[120%] rounded-full"
              style={{
                background: "radial-gradient(circle, rgba(255,236,180,0.85), rgba(255,220,150,0.2) 45%, transparent 68%)",
                transform: `translate(-50%, -50%) scale(${open ? 1.2 : 0.2})`,
                opacity: open ? 1 : 0,
                transition: "transform 0.9s ease-out 0.2s, opacity 0.5s ease-out 0.2s",
              }}
            />
            {/* Box */}
            <span className="absolute inset-x-[6%] bottom-0 top-[30%] rounded-md" style={{ background: `linear-gradient(180deg, ${wrap}, color-mix(in srgb, ${wrap} 75%, #000))`, boxShadow: "0 18px 30px rgba(0,0,0,0.45)" }}>
              <span className="absolute inset-y-0 left-1/2 w-[16%] -translate-x-1/2" style={{ background: ribbon }} />
            </span>
            {/* Lid */}
            <span
              className="absolute inset-x-0 top-[18%] h-[17%] rounded-md"
              style={{
                background: `linear-gradient(180deg, color-mix(in srgb, ${wrap} 85%, #fff), ${wrap})`,
                boxShadow: "0 6px 12px rgba(0,0,0,0.35)",
                transform: open ? "translate(34%, -150%) rotate(28deg)" : "none",
                opacity: open ? 0 : 1,
                transition: "transform 0.9s cubic-bezier(0.22,1,0.36,1), opacity 0.5s ease-out 0.5s",
              }}
            >
              <span className="absolute inset-y-0 left-1/2 w-[15%] -translate-x-1/2" style={{ background: ribbon }} />
              {/* Bow */}
              <span className="absolute bottom-full left-1/2 flex -translate-x-1/2 items-end">
                <span className="block h-9 w-11 rounded-[60%_60%_10%_60%] border-[5px]" style={{ borderColor: "var(--inv-accent)", transform: "rotate(-12deg)" }} />
                <span className="block h-9 w-11 rounded-[60%_60%_60%_10%] border-[5px]" style={{ borderColor: "var(--inv-accent)", transform: "rotate(12deg)" }} />
              </span>
            </span>
            {!open ? <span className="absolute left-1/2 top-[26%] h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full border animate-pulse-ring" style={{ borderColor: "var(--inv-accent)" }} /> : null}
          </button>
          <Hint text={data.ritualHint || "Open the gift"} className={`mt-8 transition-opacity ${open ? "opacity-0" : "opacity-90"}`} />
        </div>
      </div>
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 z-20 h-full w-full" />
      {!open ? <SkipButton onSkip={lift} /> : null}
    </div>
  );
}
