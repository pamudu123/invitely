"use client";

import { Heart } from "lucide-react";
import { useState } from "react";
import { forgetLike, like, useLikes } from "@/lib/client/likes";

const compact = new Intl.NumberFormat("en", { notation: "compact" });

/** A heart anyone can tap, as often as they like. */
export function LikeButton({ id, name, className = "" }: { id: string; name: string; className?: string }) {
  const { totals, added, mine } = useLikes();
  const [hearts, setHearts] = useState<number[]>([]);
  const liked = mine.includes(id);
  const count = Math.max(0, (totals?.[id] ?? 0) + (added[id] ?? 0));

  return (
    <span className={`inline-flex ${className}`}>
      <button
        type="button"
        aria-label={`Like ${name}. ${count === 1 ? "1 like" : `${count} likes`}${liked ? ", including yours" : ""}`}
        onClick={() => {
          like(id);
          setHearts((h) => [...h.slice(-7), (h.at(-1) ?? 0) + 1]);
        }}
        className="relative inline-flex h-11 min-w-11 touch-manipulation select-none items-center justify-center gap-1.5 rounded-full border border-fg/15 bg-page-2 px-3 text-[0.86rem] font-bold tabular-nums text-fg shadow-[0_6px_18px_-8px_color-mix(in_srgb,var(--color-fg)_55%,transparent)] outline-none transition-transform duration-200 hover:scale-105 focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 active:scale-90"
      >
        <Heart size={19} strokeWidth={2.2} className="text-[#d0165c]" fill={liked ? "currentColor" : "none"} aria-hidden="true" />
        {count ? compact.format(count) : null}
        {hearts.map((h) => (
          <Heart
            key={h}
            size={20}
            fill="currentColor"
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1 animate-like-rise text-[#d0165c]"
            style={{ ["--drift" as string]: `${((h * 37) % 45) - 22}px` }}
            onAnimationEnd={() => setHearts((all) => all.filter((x) => x !== h))}
          />
        ))}
      </button>
    </span>
  );
}

/** Shown only once the design is liked on this device. */
export function UnlikeButton({ id, name }: { id: string; name: string }) {
  const { mine } = useLikes();
  if (!mine.includes(id)) return null;
  return (
    <button
      type="button"
      aria-label={`Remove ${name} from your likes`}
      onClick={() => forgetLike(id)}
      className="min-h-11 text-[0.82rem] font-semibold text-fg/85 underline underline-offset-4 hover:text-fg"
    >
      Remove from your likes
    </button>
  );
}
