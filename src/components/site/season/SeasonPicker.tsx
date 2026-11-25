"use client";

import { useId } from "react";
import { setSeason, useSeason } from "@/lib/client/season";
import { seasonIds, seasons } from "@/lib/season";

/** Four seasons to choose from. The page changes at once. */
export function SeasonPicker({ className = "" }: { className?: string }) {
  const season = useSeason();
  const name = useId();
  return (
    <fieldset className={`season-picker ${className}`}>
      <legend className="sr-only">Site theme</legend>
      {seasonIds.map((s) => (
        <label key={s} className={`season-option season-option-${s}`}>
          <input type="radio" name={name} value={s} checked={season === s} onChange={() => setSeason(s)} className="sr-only" />
          <span className="season-swatch" aria-hidden="true"><i className="season-mark" /></span>
          <span>
            <b>{seasons[s].label}</b>
            <small>{seasons[s].note}</small>
          </span>
        </label>
      ))}
    </fieldset>
  );
}
