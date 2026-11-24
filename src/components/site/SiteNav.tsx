"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { ButtonLink, Logo } from "@/components/ui/kit";

const links = [
  { href: "/templates", label: "Designs" },
  { href: "/#openings", label: "Openings" },
  { href: "/#features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
];

export function SiteNav({ account }: { account: ReactNode }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5">
        <div className="mx-auto flex h-14 max-w-[82rem] items-center justify-between gap-6 rounded-full border border-fg/10 bg-page-2 pl-5 pr-2 shadow-[0_8px_30px_-12px_rgba(15,28,92,0.4)]">
          <Link href="/" aria-label="Invitely home" className="text-fg" onClick={() => setOpen(false)}>
            <Logo />
          </Link>
          <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="text-[0.95rem] font-semibold text-fg transition-colors hover:text-brand">
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <div className="hidden sm:block">{account}</div>
            <ButtonLink href="/templates" size="md" className="max-sm:hidden">Create invitation</ButtonLink>
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-full text-fg md:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {open ? (
        <div className="fixed inset-0 z-40 flex flex-col bg-page px-6 pb-8 pt-24 md:hidden">
          <nav className="flex flex-col" aria-label="Mobile">
            {links.map((l, i) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="display animate-fade-up border-b border-fg/10 py-5 text-4xl"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto grid gap-3" onClick={() => setOpen(false)}>
            <ButtonLink href="/templates" size="lg">Create invitation</ButtonLink>
            <div className="flex justify-center">{account}</div>
          </div>
        </div>
      ) : null}
    </>
  );
}
