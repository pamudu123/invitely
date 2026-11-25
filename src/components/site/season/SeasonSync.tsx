"use client";

import { useLayoutEffect } from "react";
import { applySeason, readSeason, useSeason } from "@/lib/client/season";
import { seasonScript } from "@/lib/season";

/** Sets the saved season while the HTML is parsed. React does not run it again in the browser, hence the second type. */
export function SeasonScript() {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: seasonScript }}
    />
  );
}

/** Keeps <html> on the saved season. React resets its attributes when it remounts in development. */
export function SeasonSync() {
  const season = useSeason();
  useLayoutEffect(() => applySeason(readSeason()), [season]);
  return null;
}
