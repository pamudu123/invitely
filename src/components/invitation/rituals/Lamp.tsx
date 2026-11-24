"use client";

import { useState } from "react";
import { CoverTitle, Hint, SkipButton, type RitualProps } from "./shared";

/**
 * Light the lamp. Every Sri Lankan celebration starts by lighting the oil lamp,
 * so the invitation does too. The flame catches, the room warms, the page appears.
 */
export function LampRitual({ data, guestName, onOpen, onDone }: RitualProps) {
  const [lit, setLit] = useState(false);

  const light = () => {
    if (lit) return;
    setLit(true);
    onOpen();
    window.setTimeout(onDone, 2500);
  };

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{ background: "var(--inv-deep)", color: "var(--inv-on-deep)" }}
    >
      {/* Room vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(90% 60% at 50% 62%, color-mix(in srgb, var(--inv-accent) 16%, transparent), transparent 70%), radial-gradient(120% 90% at 50% 50%, transparent 40%, rgba(0,0,0,0.55) 100%)",
        }}
      />

      <div className="relative z-10 flex h-full flex-col items-center justify-between px-6 pb-[14%] pt-[13%]">
        <div
          className="transition-opacity duration-[1400ms]"
          style={{ opacity: lit ? 1 : 0.42 }}
        >
          <CoverTitle data={data} guestName={guestName} />
        </div>

        <button
          type="button"
          onClick={light}
          aria-label={data.ritualHint || "Light the lamp"}
          className="group relative flex flex-col items-center outline-none"
        >
          <span className="relative block">
          {/* Halo */}
          <span
            className="pointer-events-none absolute left-1/2 top-[24%] h-64 w-64 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(255,214,150,0.5) 0%, rgba(255,180,90,0.16) 38%, transparent 68%)",
              opacity: lit ? 1 : 0,
              transform: `translate(-50%, -50%) scale(${lit ? 1.4 : 0.3})`,
              transition: "transform 1.2s ease-out, opacity 0.8s ease-out",
            }}
          />
          <svg viewBox="0 0 200 250" className="relative w-auto" style={{ height: "min(42cqh, 20rem)" }} aria-hidden="true">
            <defs>
              <linearGradient id="lamp-brass" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0" stopColor="#6f5220" />
                <stop offset="0.35" stopColor="#ecd08f" />
                <stop offset="0.6" stopColor="#b8924a" />
                <stop offset="1" stopColor="#5e4519" />
              </linearGradient>
              <radialGradient id="lamp-flame" cx="0.5" cy="0.75" r="0.7">
                <stop offset="0" stopColor="#fffbe8" />
                <stop offset="0.35" stopColor="#ffd98a" />
                <stop offset="0.8" stopColor="#f29a3c" />
                <stop offset="1" stopColor="#e2702a" />
              </radialGradient>
            </defs>

            {/* Flame */}
            <g
              style={{
                transformOrigin: "100px 92px",
                transform: lit ? "scale(1)" : "scale(0)",
                opacity: lit ? 1 : 0,
                transition: "transform 0.7s cubic-bezier(0.22,1,0.36,1), opacity 0.4s",
              }}
            >
              <g className="animate-flicker" style={{ transformOrigin: "100px 92px" }}>
                <path d="M100 26c14 24 20 42 0 66c-20-24-14-42 0-66z" fill="url(#lamp-flame)" />
                <path d="M100 56c6 11 8 20 0 32c-8-12-6-21 0-32z" fill="#fffdf2" opacity="0.9" />
              </g>
            </g>

            {/* Wick */}
            <path d="M100 88v12" stroke="#2a2118" strokeWidth="3" strokeLinecap="round" />
            {!lit ? <circle cx="100" cy="88" r="2.4" fill="#f2a04a" className="animate-pulse" /> : null}

            {/* Dish */}
            <path d="M30 100h140c-7 21-34 32-70 32s-63-11-70-32z" fill="url(#lamp-brass)" />
            <ellipse cx="100" cy="100" rx="70" ry="8" fill="#5a431b" />
            <ellipse cx="100" cy="99" rx="61" ry="5.5" fill="#1c140c" opacity="0.78" />
            <path d="M38 109c16 10 38 15 62 15s46-5 62-15" fill="none" stroke="#fff" strokeOpacity="0.3" strokeWidth="1.2" strokeDasharray="1 5" strokeLinecap="round" />

            {/* Stem with turned knobs */}
            <path d="M93 131h14l2 14h-18z" fill="url(#lamp-brass)" />
            <ellipse cx="100" cy="150" rx="17" ry="7" fill="url(#lamp-brass)" />
            <path d="M94 156h12l1 22h-14z" fill="url(#lamp-brass)" />
            <ellipse cx="100" cy="182" rx="13" ry="5.5" fill="url(#lamp-brass)" />
            <path d="M95 186h10l3 16H92z" fill="url(#lamp-brass)" />

            {/* Stepped base */}
            <path d="M70 212c4-8 16-11 30-11s26 3 30 11z" fill="url(#lamp-brass)" />
            <path d="M48 232c4-14 26-20 52-20s48 6 52 20l4 8H44z" fill="url(#lamp-brass)" />
            <ellipse cx="100" cy="240" rx="56" ry="6" fill="#4f3a16" />
            <path d="M58 228c12-7 26-9 42-9s30 2 42 9" fill="none" stroke="#fff" strokeOpacity="0.22" strokeWidth="1" />
          </svg>
          </span>

          <Hint text={data.ritualHint || "Light the lamp to begin"} className={`mt-6 transition-opacity duration-500 ${lit ? "opacity-0" : "opacity-90"}`} />
        </button>
      </div>

      {/* The room fills with light */}
      <div
        className="pointer-events-none absolute left-1/2 top-[58%] z-20 aspect-square w-[320cqmax] rounded-full"
        style={{
          background:
            "radial-gradient(circle, var(--inv-bg) 0%, var(--inv-bg) 34%, color-mix(in srgb, #ffd590 55%, var(--inv-bg)) 44%, rgba(255,190,110,0.35) 54%, transparent 66%)",
          transform: `translate(-50%, -50%) scale(${lit ? 1 : 0})`,
          transition: "transform 1.7s cubic-bezier(0.6, 0, 0.3, 1) 0.75s",
        }}
      />

      {!lit ? <SkipButton onSkip={light} /> : null}
    </div>
  );
}
