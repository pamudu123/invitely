"use client";

import { useState } from "react";
import { CoverTitle, Hint, SkipButton, type RitualProps } from "./shared";

const LEAF = "M0 0C-46-6-45-74 0-118C45-74 46-6 0 0Z";
const VEINS =
  "M0 0V-104M0-16C-12-28-24-40-22-62M0-16C12-28 24-40 22-62M0-44C-8-54-16-64-14-80M0-44C8-54 16-64 14-80";

const leaves = [
  { open: -74, closed: -10, scale: 0.86, delay: 220, tone: 0 },
  { open: 74, closed: 10, scale: 0.86, delay: 220, tone: 0 },
  { open: -48, closed: -7, scale: 0.94, delay: 140, tone: 1 },
  { open: 48, closed: 7, scale: 0.94, delay: 140, tone: 1 },
  { open: -23, closed: -3, scale: 1, delay: 60, tone: 2 },
  { open: 23, closed: 3, scale: 1, delay: 60, tone: 2 },
  { open: 0, closed: 0, scale: 1.04, delay: 0, tone: 3 },
];

const greens = ["#2f6a34", "#3a7d3c", "#4a9046", "#5aa350"];

/**
 * Accept the betel. In Sri Lanka an invitation is offered with a sheaf of betel leaves.
 * The guest takes it, the leaves fan open, and the invitation is theirs.
 */
export function BetelRitual({ data, guestName, onOpen, onDone }: RitualProps) {
  const [open, setOpen] = useState(false);

  const accept = () => {
    if (open) return;
    setOpen(true);
    onOpen();
    window.setTimeout(onDone, 2500);
  };

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{
        background:
          "radial-gradient(90% 60% at 50% 72%, color-mix(in srgb, var(--inv-accent) 22%, var(--inv-deep)), var(--inv-deep) 75%)",
        color: "var(--inv-on-deep)",
      }}
    >
      <div className="relative z-10 flex h-full flex-col items-center justify-between px-6 pb-[11%] pt-[13%]">
        <CoverTitle data={data} guestName={guestName} />

        <button type="button" onClick={accept} aria-label={data.ritualHint || "Accept the betel leaves"} className="relative flex flex-col items-center outline-none">
          <svg viewBox="-150 -140 300 190" className="w-auto overflow-visible" style={{ height: "min(34cqh, 15rem)" }} aria-hidden="true">
            <defs>
              <linearGradient id="betel-brass" x1="0" x2="1">
                <stop offset="0" stopColor="#6f5220" />
                <stop offset="0.4" stopColor="#ecd08f" />
                <stop offset="1" stopColor="#7a5a22" />
              </linearGradient>
            </defs>
            {/* Brass tray */}
            <ellipse cx="0" cy="30" rx="118" ry="13" fill="#4f3a16" />
            <ellipse cx="0" cy="26" rx="118" ry="13" fill="url(#betel-brass)" />
            <ellipse cx="0" cy="24" rx="100" ry="9" fill="#3d2c10" opacity="0.5" />
            {leaves.map((l, i) => (
              <g
                key={i}
                style={{
                  transformOrigin: "0px 22px",
                  transform: `translate(0px, 22px) rotate(${open ? l.open : l.closed}deg) scale(${l.scale})`,
                  transition: `transform 1.4s cubic-bezier(0.22,1,0.36,1) ${l.delay}ms`,
                }}
              >
                <path d={LEAF} fill={greens[l.tone]} stroke="#1f4a24" strokeWidth="1" />
                <path d={VEINS} fill="none" stroke="#dff0c8" strokeOpacity="0.5" strokeWidth="1" strokeLinecap="round" />
              </g>
            ))}
            {/* Tie */}
            <rect x="-9" y="12" width="18" height="12" rx="3" fill="url(#betel-brass)" />
          </svg>
          <Hint text={data.ritualHint || "Accept the betel leaves"} className={`mt-6 transition-opacity duration-500 ${open ? "opacity-0" : "opacity-90"}`} />
        </button>
      </div>

      <div
        className="pointer-events-none absolute left-1/2 top-[64%] z-20 aspect-square w-[320cqmax] rounded-full"
        style={{
          background:
            "radial-gradient(circle, var(--inv-bg) 0%, var(--inv-bg) 34%, color-mix(in srgb, #f3e3a8 50%, var(--inv-bg)) 44%, rgba(240,225,160,0.3) 54%, transparent 66%)",
          transform: `translate(-50%, -50%) scale(${open ? 1 : 0})`,
          transition: "transform 1.6s cubic-bezier(0.6, 0, 0.3, 1) 0.95s",
        }}
      />

      {!open ? <SkipButton onSkip={accept} /> : null}
    </div>
  );
}
