"use client";

import { initials } from "@/lib/invitation/templates";
import { dateParts } from "@/lib/invitation/time";
import type { InvitationData, LanguageId } from "@/lib/invitation/types";
import { Crest } from "./ornaments";

export function Names({ data, className = "" }: { data: InvitationData; className?: string }) {
  const long = Math.max(data.name1.length, data.name2.length) > 11 || (!data.name2 && data.name1.length > 14);
  return (
    <h1 className={`inv-names ${long ? "inv-names-long" : ""} ${className}`}>
      <span className="block">{data.name1}</span>
      {data.name2 ? (
        <>
          <span className="inv-amp">&amp;</span>
          <span className="block">{data.name2}</span>
        </>
      ) : null}
    </h1>
  );
}

/** Classic three part date lockup: weekday, day, month and year. */
export function DateLockup({ data, lang, tone = "ink" }: { data: InvitationData; lang: LanguageId; tone?: "ink" | "deep" }) {
  const p = dateParts(data.date, lang);
  const line = tone === "deep" ? "color-mix(in srgb, currentColor 40%, transparent)" : "var(--inv-accent)";
  return (
    <div className="flex items-center justify-center gap-4" suppressHydrationWarning>
      <span className="inv-kicker w-[7.5em] border-y py-2 text-right" style={{ borderColor: line }} suppressHydrationWarning>
        {p.weekday}
      </span>
      <span className="inv-serif leading-none" style={{ fontSize: "clamp(2.6rem, 13cqw, 3.6rem)" }}>
        {p.day}
      </span>
      <span className="inv-kicker w-[7.5em] border-y py-2 text-left" style={{ borderColor: line }} suppressHydrationWarning>
        {p.month}
      </span>
    </div>
  );
}

export function ScrollHint({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center gap-2 opacity-60">
      <span className="inv-kicker" style={{ fontSize: "0.6rem" }}>{label}</span>
      <span className="relative block h-9 w-px overflow-hidden" style={{ background: "var(--inv-line)" }}>
        <span className="absolute inset-x-0 top-0 h-1/2 bg-current" style={{ animation: "inv-scroll-hint 2s ease-in-out infinite" }} />
      </span>
    </div>
  );
}

export function PhotoOrPlaceholder({ data, className = "", scene = false }: { data: InvitationData; className?: string; scene?: boolean }) {
  if (data.heroPhoto) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={data.heroPhoto} alt="" className={`h-full w-full object-cover ${className}`} />;
  }
  if (scene) {
    // Abstract dusk scene, shown until the host adds a cover photo.
    return (
      <div
        className={`relative h-full w-full overflow-hidden ${className}`}
        style={{
          background:
            "linear-gradient(180deg, color-mix(in srgb, var(--inv-deep) 70%, var(--inv-accent)) 0%, color-mix(in srgb, var(--inv-accent) 70%, #f6d9b0) 38%, color-mix(in srgb, var(--inv-deep) 80%, var(--inv-accent)) 58%, var(--inv-deep) 100%)",
        }}
      >
        <div className="absolute left-1/2 top-[30%] h-28 w-28 -translate-x-1/2 rounded-full" style={{ background: "radial-gradient(circle, #fff4dc, #ffd9a0 60%, transparent 72%)", opacity: 0.9 }} />
        <svg className="absolute inset-x-0 top-[40%] h-[30%] w-full" viewBox="0 0 400 200" preserveAspectRatio="none" aria-hidden="true">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <path
              key={i}
              d={`M0 ${20 + i * 30}q25-${10 - i} 50 0t50 0t50 0t50 0t50 0t50 0t50 0t50 0V200H0z`}
              style={{ fill: "var(--inv-deep)" }}
              opacity={0.18 + i * 0.14}
            />
          ))}
        </svg>
      </div>
    );
  }
  return (
    <div
      className={`flex h-full w-full items-center justify-center ${className}`}
      style={{
        background:
          "linear-gradient(160deg, color-mix(in srgb, var(--inv-deep) 82%, var(--inv-accent)), var(--inv-deep))",
        color: "var(--inv-on-deep)",
      }}
    >
      <div className="flex flex-col items-center gap-3 opacity-80">
        <Crest kind={data.theme.ornament} className="w-24" style={{ color: "var(--inv-accent)" }} />
        <span className="inv-names" style={{ fontSize: "2.4rem" }}>{initials(data)}</span>
      </div>
    </div>
  );
}
