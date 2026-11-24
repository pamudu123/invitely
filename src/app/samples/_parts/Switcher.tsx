"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const items = [
  { href: "/samples/procession", key: "A", name: "Procession" },
  { href: "/samples/procession-global", key: "A2", name: "Global procession" },
  { href: "/samples/peacock", key: "B", name: "Peacock throne" },
  { href: "/samples/morning", key: "C", name: "Golden morning" },
  { href: "/samples/opera", key: "D", name: "Grand Opera" },
  { href: "/samples/riviera", key: "E", name: "Riviera" },
  { href: "/samples/bloom", key: "F", name: "Bloom" },
  { href: "/samples/deco", key: "G", name: "Deco" },
  { href: "/samples/frost", key: "H", name: "Frost" },
  { href: "/samples/pearl", key: "I", name: "Pearl" },
  { href: "/samples/celestial", key: "J", name: "Celestial" },
  { href: "/samples/wisteria", key: "K", name: "Wisteria" },
];

export function Switcher() {
  const path = usePathname();
  const ref = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const nav = ref.current;
    const now = nav?.querySelector<HTMLElement>("[aria-current]");
    if (nav && now) nav.scrollLeft = now.offsetLeft - nav.clientWidth / 2 + now.offsetWidth / 2;
  }, [path]);
  return (
    <nav ref={ref} aria-label="Sample designs" className="s-switch">
      {items.map((i) => (
        <Link key={i.key} href={i.href} aria-current={path === i.href ? "page" : undefined} aria-label={`Sample ${i.key}, ${i.name}`} title={i.name}>
          <b>{i.key}</b>
          {path === i.href ? <span>{i.name}</span> : null}
        </Link>
      ))}
    </nav>
  );
}
