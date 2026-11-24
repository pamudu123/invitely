"use client";

import { useState } from "react";
import { initials } from "@/lib/invitation/templates";
import { CoverTitle, Hint, SkipButton, type RitualProps } from "./shared";

function Panel({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative ${className}`}
      style={{
        border: "1px solid rgba(0,0,0,0.45)",
        boxShadow: "inset 0 0 0 5px rgba(255,255,255,0.035), inset 0 0 0 6px rgba(0,0,0,0.35), inset 0 10px 24px rgba(0,0,0,0.35)",
      }}
    >
      <div
        className="absolute inset-3"
        style={{ border: "1px solid color-mix(in srgb, var(--inv-accent) 55%, transparent)", opacity: 0.6 }}
      />
    </div>
  );
}

/** Open the doors. Two carved doors swing inward and light spills through. */
export function DoorsRitual({ data, guestName, onOpen, onDone }: RitualProps) {
  const [open, setOpen] = useState(false);
  const mono = initials(data);

  const push = () => {
    if (open) return;
    setOpen(true);
    onOpen();
    window.setTimeout(onDone, 2100);
  };

  const wood = "color-mix(in srgb, var(--inv-deep) 78%, #5b3a1c)";
  const grain = `repeating-linear-gradient(90deg, rgba(0,0,0,0.16) 0 1px, transparent 1px 7px, rgba(255,255,255,0.03) 7px 8px, transparent 8px 17px), linear-gradient(180deg, color-mix(in srgb, ${wood} 88%, #fff), ${wood} 30%, color-mix(in srgb, ${wood} 80%, #000))`;

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ perspective: "1500px", color: "var(--inv-on-deep)" }}>
      {/* Light behind the doors */}
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{ background: "radial-gradient(circle at 50% 55%, #fff6dc, var(--inv-bg) 60%)", opacity: open ? 0 : 1, transitionDelay: open ? "1.2s" : "0s" }}
      />
      {[0, 1].map((side) => (
        <div
          key={side}
          className="absolute top-0 flex h-full w-1/2 flex-col gap-[3%] p-[5%]"
          style={{
            [side === 0 ? "left" : "right"]: 0,
            background: grain,
            transformOrigin: side === 0 ? "left center" : "right center",
            transform: open ? `rotateY(${side === 0 ? -104 : 104}deg)` : "rotateY(0deg)",
            transition: "transform 2s cubic-bezier(0.6,0,0.2,1)",
            boxShadow: side === 0 ? "inset -10px 0 22px rgba(0,0,0,0.45)" : "inset 10px 0 22px rgba(0,0,0,0.45)",
            backfaceVisibility: "hidden",
          }}
        >
          <Panel className="flex-[2]" />
          <Panel className="flex-[3]" />
          <Panel className="flex-[2]" />
          {/* Studs */}
          {[40, 50, 60].map((top) => (
            <span
              key={top}
              className="absolute h-2.5 w-2.5 rounded-full"
              style={{
                top: `${top}%`,
                [side === 0 ? "right" : "left"]: "7%",
                background: "radial-gradient(circle at 35% 30%, #f5dc9a, #9b7a34 70%)",
                boxShadow: "0 1px 2px rgba(0,0,0,0.5)",
              }}
            />
          ))}
        </div>
      ))}

      <div
        className="relative z-10 flex h-full flex-col items-center justify-between px-8 pb-[12%] pt-[14%] transition-opacity duration-500"
        style={{ opacity: open ? 0 : 1, textShadow: "0 2px 12px rgba(0,0,0,0.6)" }}
      >
        <CoverTitle data={data} guestName={guestName} />
        <div className="flex flex-col items-center">
          <button
            type="button"
            onClick={push}
            aria-label={data.ritualHint || "Open the doors"}
            className="relative flex h-28 w-28 items-center justify-center rounded-full outline-none"
            style={{
              background: "radial-gradient(circle at 35% 30%, #f7e2a6, #b8924a 55%, #6f5220)",
              boxShadow: "0 10px 26px rgba(0,0,0,0.5), inset 0 -4px 8px rgba(0,0,0,0.3)",
              color: "#3a2a0e",
              textShadow: "0 1px 0 rgba(255,255,255,0.3)",
            }}
          >
            <span className="absolute inset-0 rounded-full border animate-pulse-ring" style={{ borderColor: "#e8c97f" }} />
            <span className="absolute inset-2 rounded-full border" style={{ borderColor: "rgba(58,42,14,0.5)" }} />
            <span className="absolute inset-4 rounded-full border border-dashed" style={{ borderColor: "rgba(58,42,14,0.4)" }} />
            <span style={{ fontFamily: "var(--inv-font-heading)", fontSize: "1.55rem", letterSpacing: "0.05em" }}>{mono}</span>
          </button>
          <Hint text={data.ritualHint || "Open the doors"} className="mt-7 opacity-90" />
        </div>
      </div>

      {!open ? <SkipButton onSkip={push} /> : null}
    </div>
  );
}
