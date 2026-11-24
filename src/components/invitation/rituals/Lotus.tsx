"use client";

import { useState } from "react";
import { CoverTitle, Hint, SkipButton, type RitualProps } from "./shared";

const PETAL = "M0 0C-24-30-20-74 0-98C20-74 24-30 0 0Z";

const layers = [
  { open: [-78, -39, 0, 39, 78], closed: [-13, -6, 0, 6, 13], scale: 1, delay: 0, tone: 30 },
  { open: [-58, -20, 20, 58], closed: [-9, -3, 3, 9], scale: 0.84, delay: 140, tone: 52 },
  { open: [-96, 96], closed: [-17, 17], scale: 0.78, delay: 260, tone: 16 },
  { open: [-30, 0, 30], closed: [-4, 0, 4], scale: 0.62, delay: 320, tone: 72 },
];

/** Touch the lotus. The bud opens petal by petal and light spills out from its heart. */
export function LotusRitual({ data, guestName, onOpen, onDone }: RitualProps) {
  const [open, setOpen] = useState(false);

  const bloom = () => {
    if (open) return;
    setOpen(true);
    onOpen();
    window.setTimeout(onDone, 2600);
  };

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{
        background:
          "radial-gradient(90% 60% at 50% 70%, color-mix(in srgb, var(--inv-accent) 26%, var(--inv-deep)), var(--inv-deep) 75%)",
        color: "var(--inv-on-deep)",
      }}
    >
      <div className="relative z-10 flex h-full flex-col items-center justify-between px-6 pb-[10%] pt-[13%]">
        <CoverTitle data={data} guestName={guestName} />

        <button type="button" onClick={bloom} aria-label={data.ritualHint || "Touch the lotus"} className="relative flex flex-col items-center outline-none">
          <svg viewBox="-130 -120 260 160" className="w-auto overflow-visible" style={{ height: "min(30cqh, 13rem)" }} aria-hidden="true">
            {/* Water ripples */}
            {[0, 1, 2].map((i) => (
              <ellipse
                key={i}
                cx="0"
                cy="18"
                rx={62 + i * 26}
                ry={7 + i * 3}
                fill="none"
                stroke="currentColor"
                strokeWidth="0.800"
                opacity={open ? 0.32 - i * 0.08 : 0.14}
                style={{ transition: "opacity 1.2s" }}
              />
            ))}
            {/* Heart glow */}
            <circle
              cx="0"
              cy="-28"
              r="30"
              fill="#ffe9b8"
              style={{
                opacity: open ? 0.9 : 0,
                filter: "blur(14px)",
                transition: "opacity 1s 0.5s",
              }}
            />
            {[2, 0, 1, 3].map((li) => {
              const layer = layers[li];
              return layer.open.map((angle, i) => (
                <path
                  key={`${li}-${i}`}
                  d={PETAL}
                  style={{
                    transformOrigin: "0px 0px",
                    transform: `rotate(${open ? angle : layer.closed[i]}deg) scale(${layer.scale})`,
                    transition: `transform 1.5s cubic-bezier(0.22,1,0.36,1) ${layer.delay}ms`,
                    fill: `color-mix(in srgb, var(--inv-accent) ${100 - layer.tone}%, #fff)`,
                    stroke: "color-mix(in srgb, var(--inv-accent) 70%, #000)",
                    strokeWidth: 0.9,
                    strokeOpacity: 0.5,
                  }}
                />
              ));
            })}
          </svg>
          <Hint text={data.ritualHint || "Touch the lotus to open"} className={`mt-8 transition-opacity duration-500 ${open ? "opacity-0" : "opacity-90"}`} />
        </button>
      </div>

      <div
        className="pointer-events-none absolute left-1/2 top-[66%] z-20 aspect-square w-[320cqmax] rounded-full"
        style={{
          background:
            "radial-gradient(circle, var(--inv-bg) 0%, var(--inv-bg) 34%, color-mix(in srgb, #ffe2b0 50%, var(--inv-bg)) 44%, rgba(255,220,170,0.3) 54%, transparent 66%)",
          transform: `translate(-50%, -50%) scale(${open ? 1 : 0})`,
          transition: "transform 1.6s cubic-bezier(0.6, 0, 0.3, 1) 1s",
        }}
      />

      {!open ? <SkipButton onSkip={bloom} /> : null}
    </div>
  );
}
