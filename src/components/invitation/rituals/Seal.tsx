"use client";

import { useState } from "react";
import { initials } from "@/lib/invitation/templates";
import { CoverTitle, Hint, SkipButton, type RitualProps } from "./shared";

/** Break the wax seal. The flap lifts and the envelope falls away. */
export function SealRitual({ data, guestName, onOpen, onDone }: RitualProps) {
  const [open, setOpen] = useState(false);
  const mono = initials(data);

  const breakSeal = () => {
    if (open) return;
    setOpen(true);
    onOpen();
    window.setTimeout(onDone, 1900);
  };

  const paper = "color-mix(in srgb, var(--inv-bg) 90%, var(--inv-ink))";
  const paperDark = "color-mix(in srgb, var(--inv-bg) 82%, var(--inv-ink))";
  const wax = "color-mix(in srgb, var(--inv-accent) 82%, #3a0d0d)";

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ perspective: "1400px", color: "var(--inv-ink)" }}>
      {/* Envelope body */}
      <div
        className="absolute inset-0"
        style={{
          background: paper,
          transform: open ? "translateY(110%)" : "none",
          transition: "transform 1.1s cubic-bezier(0.6,0,0.3,1) 0.8s",
        }}
      >
        {/* Side folds */}
        <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100" aria-hidden="true">
          <path d="M0 100L50 52L100 100" fill="none" style={{ stroke: "var(--inv-line)" }} strokeWidth="0.25" vectorEffect="non-scaling-stroke" />
          <path d="M0 100L50 52L100 100Z" style={{ fill: paperDark }} opacity="0.35" />
        </svg>
        <div className="absolute inset-x-0 bottom-[9%] px-8">
          <CoverTitle data={data} guestName={guestName} />
          <Hint text={data.ritualHint || "Break the seal"} className={`mt-9 transition-opacity ${open ? "opacity-0" : "opacity-80"}`} />
        </div>
      </div>

      {/* Flap */}
      <div
        className="absolute inset-x-0 top-0 h-[47%]"
        style={{
          transformOrigin: "top center",
          transform: open ? "rotateX(178deg)" : "rotateX(0deg)",
          transition: "transform 1s cubic-bezier(0.6,0,0.3,1) 0.25s, opacity 0.5s 1s",
          opacity: open ? 0 : 1,
          filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.16))",
        }}
      >
        <div
          className="h-full w-full"
          style={{
            clipPath: "polygon(0 0, 100% 0, 50% 100%)",
            background: `linear-gradient(180deg, ${paperDark}, ${paper})`,
          }}
        />
      </div>

      {/* Wax seal */}
      <button
        type="button"
        onClick={breakSeal}
        aria-label={data.ritualHint || "Break the seal"}
        className="absolute left-1/2 top-[45%] z-10 h-28 w-28 -translate-x-1/2 -translate-y-1/2 outline-none"
      >
        {!open ? <span className="absolute inset-2 rounded-full border animate-pulse-ring" style={{ borderColor: wax }} /> : null}
        <span
          className="absolute inset-1 rounded-full transition-opacity duration-300"
          style={{ boxShadow: "0 10px 22px rgba(0,0,0,0.32)", opacity: open ? 0 : 1 }}
        />
        {[0, 1].map((half) => (
          <span
            key={half}
            className="absolute inset-0"
            style={{
              clipPath: half === 0 ? "polygon(-10% -10%, 52.4% -10%, 46.4% 110%, -10% 110%)" : "polygon(52% -10%, 110% -10%, 110% 110%, 46% 110%)",
              transform: open
                ? `translate(${half === 0 ? "-46px" : "46px"}, 70px) rotate(${half === 0 ? -38 : 38}deg)`
                : "none",
              opacity: open ? 0 : 1,
              transition: "transform 0.8s cubic-bezier(0.5,0,0.8,0.6), opacity 0.6s 0.25s",
            }}
          >
            <span
              className="absolute inset-0 flex items-center justify-center"
              style={{
                borderRadius: "47% 53% 50% 50% / 52% 47% 53% 48%",
                background: `radial-gradient(circle at 35% 30%, color-mix(in srgb, ${wax} 70%, #fff) 0%, ${wax} 45%, color-mix(in srgb, ${wax} 70%, #000) 100%)`,
                boxShadow: "inset 0 -3px 6px rgba(0,0,0,0.25), inset 0 2px 3px rgba(255,255,255,0.2)",
              }}
            >
              <span
                className="flex h-[70%] w-[70%] items-center justify-center rounded-full"
                style={{
                  boxShadow: "inset 0 2px 5px rgba(0,0,0,0.35), 0 1px 0 rgba(255,255,255,0.18)",
                  fontFamily: "var(--inv-font-heading)",
                  fontSize: mono.length > 1 ? "1.55rem" : "2rem",
                  letterSpacing: "0.04em",
                  color: "rgba(255,255,255,0.86)",
                  textShadow: "0 1px 1px rgba(0,0,0,0.4)",
                }}
              >
                {mono}
              </span>
            </span>
          </span>
        ))}
      </button>

      {!open ? <SkipButton onSkip={breakSeal} /> : null}
    </div>
  );
}
