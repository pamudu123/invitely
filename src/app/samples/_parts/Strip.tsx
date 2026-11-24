import Link from "next/link";
import type { ReactNode } from "react";
import { gOccasions } from "./global";

/** The moving occasions strip, with a different ornament for each sample. */
export function Strip({ mark }: { mark: ReactNode }) {
  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined}>
      {gOccasions.map((o) => (
        <li key={o.id}>
          <svg viewBox="-30 -30 60 60" aria-hidden="true">{mark}</svg>
          <Link href={`/templates?occasion=${o.id}`} tabIndex={hidden ? -1 : undefined}>{o.label}</Link>
        </li>
      ))}
    </ul>
  );
  return (
    <nav aria-label="Occasions" className="s-garland">
      <div>{row(false)}{row(true)}</div>
    </nav>
  );
}
