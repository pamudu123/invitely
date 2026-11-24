import Link from "next/link";
import { occasions } from "./content";

function Row({ hidden }: { hidden?: boolean }) {
  return (
    <ul aria-hidden={hidden || undefined}>
      {occasions.map((o, i) => (
        <li key={o.id}>
          <svg viewBox="-30 -30 60 60" aria-hidden="true">
            {Array.from({ length: 12 }, (_, k) => (
              <ellipse key={k} cx="0" cy="-17" rx="7.5" ry="11" transform={`rotate(${k * 30})`} fill={i % 2 ? "var(--m1,#FF7A1A)" : "var(--m2,#C81E1E)"} />
            ))}
            {Array.from({ length: 8 }, (_, k) => (
              <ellipse key={k} cx="0" cy="-9" rx="5" ry="8" transform={`rotate(${k * 45 + 14})`} fill="var(--m3,#FFD25E)" />
            ))}
            <circle r="4.5" fill="var(--m4,#8A2A0A)" />
          </svg>
          <Link href={`/templates?occasion=${o.id}`} tabIndex={hidden ? -1 : undefined}>{o.label}</Link>
        </li>
      ))}
    </ul>
  );
}

/** Occasions strung between marigolds, moving slowly. Pauses on hover and focus. */
export function Garland() {
  return (
    <nav aria-label="Occasions" className="s-garland">
      <div>
        <Row />
        <Row hidden />
      </div>
    </nav>
  );
}
