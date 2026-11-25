"use client";

import type { InvitationData } from "@/lib/invitation/types";
import { getOccasion } from "@/lib/invitation/occasions";
import { formatLongDate } from "@/lib/invitation/time";

export interface RitualProps {
  data: InvitationData;
  guestName?: string;
  /** Fired on the guest's first gesture. Used to start music. */
  onOpen: () => void;
  /** Fired when the opening animation has finished. */
  onDone: () => void;
}

/** Names and occasion shown on every cover. */
export function CoverTitle({
  data,
  guestName,
  className = "",
  showDate = false,
}: {
  data: InvitationData;
  guestName?: string;
  className?: string;
  showDate?: boolean;
}) {
  const occ = getOccasion(data.occasion);
  const long = (data.name1 + data.name2).length > 22;
  return (
    <div className={`text-center ${className}`}>
      <p className="inv-kicker opacity-80">
        {guestName ? `For ${guestName}` : ["festive", "sports", "career"].includes(data.occasion) && data.kicker ? data.kicker : `${occ.label} invitation`}
      </p>
      <h1 className={`inv-names mt-4 ${long ? "inv-names-long" : ""}`} style={{ fontSize: undefined }}>
        <span className="block" style={{ fontSize: "0.72em" }}>{data.name1}</span>
        {data.name2 ? (
          <>
            <span className="inv-amp" style={{ color: "currentColor", opacity: 0.7, fontSize: "0.36em" }}>&amp;</span>
            <span className="block" style={{ fontSize: "0.72em" }}>{data.name2}</span>
          </>
        ) : null}
      </h1>
      {showDate ? <p className="inv-kicker mt-5 opacity-70" suppressHydrationWarning>{formatLongDate(data.date)}</p> : null}
    </div>
  );
}

export function Hint({ text, className = "" }: { text: string; className?: string }) {
  return (
    <p className={`inv-kicker flex items-center justify-center gap-3 ${className}`}>
      <span className="h-px w-6 bg-current opacity-40" />
      <span className="animate-pulse">{text}</span>
      <span className="h-px w-6 bg-current opacity-40" />
    </p>
  );
}

export function SkipButton({ onSkip, className = "" }: { onSkip: () => void; className?: string }) {
  return (
    <button
      type="button"
      onClick={onSkip}
      className={`absolute bottom-3 right-4 z-30 px-2 py-2 text-[0.62rem] uppercase tracking-[0.2em] opacity-40 transition-opacity hover:opacity-80 ${className}`}
      style={{ fontFamily: "var(--inv-font-heading)" }}
    >
      Skip
    </button>
  );
}
