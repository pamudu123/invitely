import Link from "next/link";
import { Suspense } from "react";
import { ButtonLink, Logo } from "@/components/ui/kit";
import { occasions } from "@/lib/invitation/occasions";
import { getUser } from "@/lib/server/auth";
import { SiteNav } from "./SiteNav";

async function Account() {
  const user = await getUser();
  return user ? (
    <ButtonLink href="/dashboard" variant="ghost" size="sm">Dashboard</ButtonLink>
  ) : (
    <ButtonLink href="/login" variant="ghost" size="sm">Sign in</ButtonLink>
  );
}

export function SiteHeader() {
  return (
    <SiteNav
      account={
        <Suspense fallback={<span className="inline-block h-9 w-20" />}>
          <Account />
        </Suspense>
      }
    />
  );
}

export function SiteFooter() {
  return (
    <footer className="relative border-t border-paper/10 px-5 pb-10 pt-16 sm:px-8">
      <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo size={24} />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-paper/55">
            Living digital invitations that open like a ceremony. Made in Sri Lanka for celebrations everywhere.
          </p>
        </div>
        <div>
          <p className="label text-paper/40">Product</p>
          <ul className="mt-4 grid gap-2.5 text-sm text-paper/70">
            <li><Link href="/templates" className="hover:text-paper">Designs</Link></li>
            <li><Link href="/#openings" className="hover:text-paper">Openings</Link></li>
            <li><Link href="/#features" className="hover:text-paper">Features</Link></li>
            <li><Link href="/pricing" className="hover:text-paper">Pricing</Link></li>
          </ul>
        </div>
        <div>
          <p className="label text-paper/40">Occasions</p>
          <ul className="mt-4 grid gap-2.5 text-sm text-paper/70">
            {occasions.slice(0, 6).map((o) => (
              <li key={o.id}><Link href={`/templates?occasion=${o.id}`} className="hover:text-paper">{o.plural}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <p className="label text-paper/40">Account</p>
          <ul className="mt-4 grid gap-2.5 text-sm text-paper/70">
            <li><Link href="/login" className="hover:text-paper">Sign in</Link></li>
            <li><Link href="/signup" className="hover:text-paper">Create account</Link></li>
            <li><Link href="/dashboard" className="hover:text-paper">Dashboard</Link></li>
          </ul>
        </div>
      </div>
      <div className="mx-auto mt-14 flex max-w-7xl flex-wrap items-center justify-between gap-3 border-t border-paper/10 pt-6">
        <p className="label text-paper/35">© Invitely. All rights reserved.</p>
        <p className="label text-paper/35">Light the lamp. Begin.</p>
      </div>
    </footer>
  );
}
