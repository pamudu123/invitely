"use client";

import { useState } from "react";
import { getOccasion } from "@/lib/invitation/occasions";
import { displayNames } from "@/lib/invitation/templates";
import { formatLongDate } from "@/lib/invitation/time";
import { Hint, SkipButton, type RitualProps } from "./shared";

const stripes = "repeating-linear-gradient(115deg, #f4efe4 0 9%, #141414 9% 18%)";

/** Call action. The clapperboard snaps shut and the feature begins. */
export function ClapperRitual({ data, guestName, onOpen, onDone }: RitualProps) {
  const [shut, setShut] = useState(false);
  const occ = getOccasion(data.occasion);

  const clap = () => {
    if (shut) return;
    setShut(true);
    onOpen();
    window.setTimeout(onDone, 1500);
  };

  const row = (label: string, value: string) => (
    <div className="flex items-baseline gap-3 border-b border-white/25 py-2">
      <span className="w-[5.2rem] shrink-0 text-[0.56rem] uppercase tracking-[0.2em] opacity-60">{label}</span>
      <span className="min-w-0 flex-1 truncate" style={{ fontFamily: "var(--inv-font-names)", fontSize: "1.25rem", lineHeight: 1.15 }} suppressHydrationWarning>{value}</span>
    </div>
  );

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: "var(--inv-deep)", color: "var(--inv-on-deep)" }}>
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(70% 45% at 50% 30%, color-mix(in srgb, var(--inv-accent) 22%, transparent), transparent 70%)" }}
      />
      {/* Flash on the clap */}
      <div
        className="pointer-events-none absolute inset-0 z-20 bg-white"
        style={{ opacity: shut ? 0 : 0, animation: shut ? "inv-flash 0.5s ease-out 0.16s both" : undefined }}
      />
      <div className="relative z-10 flex h-full flex-col items-center justify-center gap-[5cqh] px-6">
        <p className="inv-kicker opacity-80">{guestName ? `A private screening for ${guestName}` : `${occ.label} invitation`}</p>

        <button
          type="button"
          onClick={clap}
          aria-label={data.ritualHint || "Tap for action"}
          className="relative mt-8 w-[min(84cqw,21rem)] text-left outline-none"
          style={{
            transform: shut ? "scale(1.04)" : "none",
            opacity: shut ? 0 : 1,
            transition: "transform 0.5s ease-out 0.5s, opacity 0.5s ease-out 0.6s",
          }}
        >
          {/* Hinged arm */}
          <div
            className="h-9 rounded-sm"
            style={{
              background: stripes,
              transformOrigin: "2% 100%",
              transform: shut ? "rotate(0deg)" : "rotate(-17deg)",
              transition: "transform 0.16s cubic-bezier(0.6,0,1,0.6)",
              boxShadow: "0 4px 10px rgba(0,0,0,0.5)",
            }}
          />
          <div className="mt-1 h-7 rounded-sm" style={{ background: stripes }} />
          <div className="rounded-b-md px-5 pb-5 pt-2" style={{ background: "#151515", boxShadow: "0 22px 40px rgba(0,0,0,0.55)", color: "#f4efe4" }}>
            {row("Production", displayNames(data))}
            {row("Scene", occ.label)}
            {row("Date", formatLongDate(data.date))}
            {row("Location", data.venueName)}
          </div>
        </button>

        <Hint text={data.ritualHint || "Tap for action"} className={`transition-opacity duration-300 ${shut ? "opacity-0" : "opacity-90"}`} />
      </div>
      {!shut ? <SkipButton onSkip={clap} /> : null}
    </div>
  );
}
