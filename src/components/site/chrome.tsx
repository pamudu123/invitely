import Link from "next/link";
import { ButtonLink, Logo } from "@/components/ui/kit";
import { occasions } from "@/lib/invitation/occasions";
import { SiteNav } from "./SiteNav";

export function SiteHeader() {
  return <SiteNav account={<ButtonLink href="/my" variant="ghost" size="sm">My cards</ButtonLink>} />;
}

export function SiteFooter() {
  return (
    <footer className="on-deep relative px-5 pb-10 pt-16 sm:px-8">
      <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo size={24} />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-fg/85">
            Living digital invitations that open like a ceremony. Made for celebrations everywhere.
          </p>
        </div>
        <div>
          <p className="label text-fg/85">Product</p>
          <ul className="mt-4 grid gap-2.5 text-sm text-fg/90">
            <li><Link href="/templates" className="hover:text-fg">Designs</Link></li>
            <li><Link href="/print-cards" className="hover:text-fg">Printed cards</Link></li>
            <li><Link href="/#openings" className="hover:text-fg">Openings</Link></li>
            <li><Link href="/#features" className="hover:text-fg">Features</Link></li>
            <li><Link href="/pricing" className="hover:text-fg">Pricing</Link></li>
          </ul>
        </div>
        <div>
          <p className="label text-fg/85">Occasions</p>
          <ul className="mt-4 grid gap-2.5 text-sm text-fg/90">
            {occasions.slice(0, 6).map((o) => (
              <li key={o.id}><Link href={`/templates?occasion=${o.id}`} className="hover:text-fg">{o.plural}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <p className="label text-fg/85">Your cards</p>
          <ul className="mt-4 grid gap-2.5 text-sm text-fg/90">
            <li><Link href="/my" className="hover:text-fg">My cards</Link></li>
            <li><Link href="/my" className="hover:text-fg">Find a card with a PIN</Link></li>
            <li><Link href="/templates" className="hover:text-fg">Create a card</Link></li>
          </ul>
        </div>
      </div>
      <div className="mx-auto mt-14 flex max-w-7xl flex-wrap items-center justify-between gap-3 border-t border-fg/10 pt-6">
        <p className="label text-fg/85">© Invitely. All rights reserved.</p>
        <p className="label text-fg/85">Shake the globe. Begin.</p>
      </div>
    </footer>
  );
}
