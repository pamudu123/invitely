"use client";

import { useState } from "react";
import { initials } from "@/lib/invitation/templates";
import { CoverTitle, Hint, SkipButton, type RitualProps } from "./shared";

/** Draw the curtains. Two velvet drapes part to reveal the invitation behind them. */
export function CurtainRitual({ data, guestName, onOpen, onDone }: RitualProps) {
  const [open, setOpen] = useState(false);

  const draw = () => {
    if (open) return;
    setOpen(true);
    onOpen();
    window.setTimeout(onDone, 2000);
  };

  const dark = "color-mix(in srgb, var(--inv-deep) 62%, #000)";
  const light = "color-mix(in srgb, var(--inv-deep) 84%, #fff)";
  const folds = `repeating-linear-gradient(90deg, ${dark} 0%, var(--inv-deep) 5%, ${light} 9%, var(--inv-deep) 13%, ${dark} 18%)`;

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ color: "var(--inv-on-deep)" }}>
      {[0, 1].map((side) => (
        <div
          key={side}
          className="absolute top-0 h-full w-[52%]"
          style={{
            [side === 0 ? "left" : "right"]: 0,
            background: folds,
            transformOrigin: side === 0 ? "left center" : "right center",
            transform: open
              ? `translateX(${side === 0 ? "-96%" : "96%"}) scaleX(0.55) skewY(${side === 0 ? 3 : -3}deg)`
              : "none",
            transition: "transform 1.9s cubic-bezier(0.65,0,0.2,1)",
            boxShadow: side === 0 ? "inset -18px 0 30px rgba(0,0,0,0.35)" : "inset 18px 0 30px rgba(0,0,0,0.35)",
          }}
        >
          <div
            className="absolute inset-y-0 w-2"
            style={{
              [side === 0 ? "right" : "left"]: 0,
              background: "linear-gradient(180deg, color-mix(in srgb, var(--inv-accent) 80%, #fff), var(--inv-accent))",
              opacity: 0.75,
            }}
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.4), transparent 22%, transparent 70%, rgba(0,0,0,0.45))" }} />
        </div>
      ))}

      {/* Pelmet */}
      <div
        className="absolute inset-x-0 top-0 h-[9%] min-h-12"
        style={{
          background: `linear-gradient(180deg, ${dark}, var(--inv-deep))`,
          boxShadow: "0 8px 20px rgba(0,0,0,0.4)",
          transform: open ? "translateY(-110%)" : "none",
          transition: "transform 1.2s cubic-bezier(0.65,0,0.2,1) 0.5s",
        }}
      >
        <div
          className="absolute inset-x-0 -bottom-3 h-3"
          style={{
            backgroundImage: "radial-gradient(circle at 50% 0, var(--inv-accent) 0 6px, transparent 6.5px)",
            backgroundSize: "18px 12px",
            opacity: 0.85,
          }}
        />
      </div>

      <div
        className="relative z-10 flex h-full flex-col items-center justify-center px-8 transition-opacity duration-500"
        style={{ opacity: open ? 0 : 1, textShadow: "0 2px 14px rgba(0,0,0,0.5)" }}
      >
        <CoverTitle data={data} guestName={guestName} />
        <button
          type="button"
          onClick={draw}
          aria-label={data.ritualHint || "Draw the curtains"}
          className="relative mt-10 flex h-24 w-24 items-center justify-center rounded-full outline-none"
          style={{
            background: "radial-gradient(circle at 35% 30%, color-mix(in srgb, var(--inv-accent) 70%, #fff), var(--inv-accent) 55%, color-mix(in srgb, var(--inv-accent) 60%, #000))",
            boxShadow: "0 10px 26px rgba(0,0,0,0.45)",
            color: "var(--inv-deep)",
            textShadow: "none",
          }}
        >
          <span className="absolute inset-0 rounded-full border border-current opacity-60 animate-pulse-ring" style={{ color: "var(--inv-accent)" }} />
          <span className="absolute inset-1.5 rounded-full border" style={{ borderColor: "color-mix(in srgb, var(--inv-deep) 45%, transparent)" }} />
          <span style={{ fontFamily: "var(--inv-font-heading)", fontSize: "1.5rem", letterSpacing: "0.05em" }}>{initials(data)}</span>
        </button>
        <Hint text={data.ritualHint || "Draw the curtains"} className="mt-7 opacity-90" />
      </div>

      {!open ? <SkipButton onSkip={draw} /> : null}
    </div>
  );
}
