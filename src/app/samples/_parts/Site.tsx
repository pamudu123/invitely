import { Check } from "lucide-react";
import Link from "next/link";
import { plans } from "./content";

/** Same plans and prices. These two lines swap regional wording for other real features of the same plan. */
const wording: Record<string, { tagline?: string; features: string[] }> = {
  signature: { features: ["Everything in Essential", "Personal link for every guest or family", "QR check-in at the door", "Link never expires"] },
  duo: { tagline: "Two events, two invitations, one price.", features: ["Two Signature invitations", "Separate guest lists and RSVPs", "Matching or different designs"] },
};

/** Plain markup for the pieces every sample needs. Each page styles them through its own prefix. */
export function Nav({ k }: { k: string }) {
  return (
    <header className={`${k}-nav`}>
      <Link href="/" className={`${k}-logo`}>Invitely</Link>
      <nav aria-label="Main">
        <Link href="/templates">Designs</Link>
        <a href="#openings">Openings</a>
        <a href="#pricing">Pricing</a>
      </nav>
      <Link href="/templates" className={`${k}-nav-cta`}>Create invitation</Link>
    </header>
  );
}

export function Plans({ k }: { k: string }) {
  return (
    <div className={`${k}-plans`}>
      {plans.map((p) => (
        <article key={p.id} className={`${k}-plan ${k}-plan-${p.id}`}>
          <div className={`${k}-plan-in`}>
            <h3>{p.name}</h3>
            <p className={`${k}-price`}>{p.usd}</p>
            <p className={`${k}-tagline`}>{wording[p.id]?.tagline ?? p.tagline}</p>
            <ul>
              {(wording[p.id]?.features ?? p.features).map((f) => (
                <li key={f}><Check size={17} />{f}</li>
              ))}
            </ul>
            <Link href="/templates">Choose {p.name}</Link>
          </div>
        </article>
      ))}
    </div>
  );
}
