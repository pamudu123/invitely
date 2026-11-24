"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { ButtonLink, Logo } from "@/components/ui/kit";

const links = [
  { href: "/templates", label: "Designs" },
  { href: "/print-cards", label: "Printed cards" },
  { href: "/#openings", label: "Openings" },
  { href: "/#features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
];

export function SiteNav({ account }: { account: ReactNode }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled || open ? "border-b border-paper/10 bg-night/75 backdrop-blur-xl" : "border-b border-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-[84rem] items-center justify-between gap-6 px-5 sm:px-8">
          <Link href="/" aria-label="Invitely home" className="text-paper" onClick={() => setOpen(false)}>
            <Logo />
          </Link>
          <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="text-[0.88rem] text-paper/65 transition-colors hover:text-paper">
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <div className="hidden sm:block">{account}</div>
            <ButtonLink href="/templates" size="sm" className="hidden sm:inline-flex">Create invitation</ButtonLink>
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-full text-paper md:hidden"
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
        <div className="fixed inset-0 z-40 flex flex-col bg-night px-6 pb-8 pt-24 md:hidden">
          <nav className="flex flex-col" aria-label="Mobile">
            {links.map((l, i) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="display animate-fade-up border-b border-paper/10 py-5 text-4xl"
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
