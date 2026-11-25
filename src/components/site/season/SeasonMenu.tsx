"use client";

import { Palette } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { SeasonPicker } from "./SeasonPicker";

/** Preferences button for the page headers. */
export function SeasonMenu() {
  const [open, setOpen] = useState(false);
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    root.current?.querySelector<HTMLInputElement>("input:checked")?.focus();
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      button.current?.focus();
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={root} className="relative" onBlur={(e) => { if (e.relatedTarget && !e.currentTarget.contains(e.relatedTarget)) setOpen(false); }}>
      <button
        ref={button}
        type="button"
        aria-label="Preferences"
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        onClick={() => setOpen((v) => !v)}
        className="flex h-11 w-11 items-center justify-center rounded-full text-brand outline-none transition-colors hover:bg-fg/8 focus-visible:ring-2 focus-visible:ring-brand"
      >
        <Palette size={21} aria-hidden="true" />
      </button>
      {open ? (
        <div id={id} role="group" aria-labelledby={`${id}-title`} className="absolute right-0 top-[calc(100%+0.9rem)] w-[min(21rem,calc(100vw-1.5rem))] max-h-[calc(100dvh-6rem)] overflow-y-auto rounded-3xl border border-fg/10 bg-page-2 p-5 text-fg shadow-[0_24px_60px_-20px_color-mix(in_srgb,var(--color-fg)_55%,transparent)] max-sm:fixed max-sm:inset-x-3 max-sm:top-20 max-sm:w-auto">
          <p id={`${id}-title`} className="font-serif text-2xl leading-tight">Preferences</p>
          <p className="mb-4 mt-1 text-sm text-fg/85">Pick a season for the site. We remember it on this device.</p>
          <SeasonPicker />
        </div>
      ) : null}
    </div>
  );
}
