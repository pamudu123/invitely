"use client";

import Link, { useLinkStatus } from "next/link";
import { useEffect, useRef } from "react";

export interface TabItem {
  id: string;
  label: string;
  href: string;
  count?: number;
}

function Pending() {
  const { pending } = useLinkStatus();
  return (
    <span
      aria-hidden
      className={`absolute right-1 top-2.5 size-1.5 rounded-full bg-brand transition-opacity duration-300 ${pending ? "animate-pulse opacity-100" : "opacity-0"}`}
    />
  );
}

/** Tabs are plain links, so they work without JavaScript and can be bookmarked. */
export function TabBar({ tabs, active }: { tabs: TabItem[]; active: string }) {
  const navRef = useRef<HTMLElement>(null);
  const currentRef = useRef<HTMLLIElement>(null);

  // On a phone the bar scrolls sideways, so bring the open tab into view.
  useEffect(() => {
    const nav = navRef.current;
    const item = currentRef.current;
    if (!nav || !item || nav.scrollWidth <= nav.clientWidth) return;
    nav.scrollTo({ left: item.offsetLeft - (nav.clientWidth - item.offsetWidth) / 2 });
  }, [active]);

  return (
    <nav ref={navRef} aria-label="Invitation sections" className="no-scrollbar relative -mx-4 overflow-x-auto border-b border-fg/10 px-4 sm:mx-0 sm:px-0">
      <ul className="flex w-max min-w-full gap-1 sm:gap-2">
        {tabs.map((tab) => {
          const current = tab.id === active;
          return (
            <li key={tab.id} ref={current ? currentRef : undefined}>
              <Link
                href={tab.href}
                scroll={false}
                aria-current={current ? "page" : undefined}
                className={`relative flex min-h-12 items-center gap-2 whitespace-nowrap px-3.5 text-[0.92rem] outline-none transition-colors focus-visible:bg-fg/5 ${
                  current ? "text-fg" : "text-fg/85 hover:text-fg"
                }`}
              >
                {tab.label}
                {typeof tab.count === "number" ? (
                  <span
                    className={`rounded-full px-1.5 py-0.5 font-mono text-[0.75rem] leading-none ${
                      current ? "bg-brand/15 text-brand" : "bg-fg/8 text-fg/85"
                    }`}
                  >
                    {tab.count}
                  </span>
                ) : null}
                <Pending />
                <span
                  aria-hidden
                  className={`absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-brand transition-opacity ${current ? "opacity-100" : "opacity-0"}`}
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
