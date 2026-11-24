"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { ButtonLink } from "@/components/ui/kit";
import { occasions } from "@/lib/invitation/occasions";
import type { OccasionId } from "@/lib/invitation/types";

export interface GalleryItem {
  id: string;
  name: string;
  meaning: string;
  occasion: OccasionId;
  alsoFor: OccasionId[];
  tags: string[];
  opening: string;
  cover: ReactNode;
}

export function TemplateGallery({ items, initial }: { items: GalleryItem[]; initial?: OccasionId }) {
  const router = useRouter();
  const [filter, setFilter] = useState<OccasionId | "all">(initial ?? "all");
  const available = occasions.filter((o) => items.some((i) => i.occasion === o.id || i.alsoFor.includes(o.id)));
  const primary = items.filter((i) => filter === "all" || i.occasion === filter);
  const secondary = filter === "all" ? [] : items.filter((i) => i.occasion !== filter && i.alsoFor.includes(filter));
  const shown = [...primary, ...secondary];

  const choose = (f: OccasionId | "all") => {
    setFilter(f);
    router.replace(f === "all" ? "/templates" : `/templates?occasion=${f}`, { scroll: false });
  };

  return (
    <>
      <div className="no-scrollbar sticky top-16 z-30 -mx-5 flex gap-2 overflow-x-auto border-b border-paper/10 bg-night/80 px-5 py-3 backdrop-blur-xl sm:-mx-8 sm:px-8">
        {[{ id: "all" as const, label: "All designs" }, ...available.map((o) => ({ id: o.id, label: o.plural }))].map((o) => (
          <button
            key={o.id}
            type="button"
            aria-pressed={filter === o.id}
            onClick={() => choose(o.id)}
            className={`h-10 shrink-0 rounded-full border px-4 text-[0.86rem] transition-colors ${
              filter === o.id ? "border-flame bg-flame text-night" : "border-paper/15 text-paper/70 hover:border-paper/40"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>

      <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6 md:grid-cols-3 xl:grid-cols-4">
        {shown.map((item) => {
          const occasionParam = filter !== "all" && item.occasion !== filter ? `&occasion=${filter}` : "";
          return (
            <li key={item.id} className="group flex flex-col">
              <Link href={`/templates/${item.id}`} className="block overflow-hidden rounded-[1.4rem] border border-paper/10 transition-transform duration-500 ease-out-soft group-hover:-translate-y-1.5" aria-label={`${item.name} live demo`}>
                {item.cover}
              </Link>
              <div className="mt-4 flex items-baseline justify-between gap-2">
                <h2 className="font-serif text-[1.6rem] leading-none">{item.name}</h2>
                <span className="label hidden text-paper/40 sm:inline">{item.opening}</span>
              </div>
              <p className="mt-1.5 text-[0.84rem] text-paper/50">{item.meaning}</p>
              <p className="mt-2 hidden flex-wrap gap-1.5 sm:flex">
                {item.tags.map((t) => (
                  <span key={t} className="rounded-full border border-paper/12 px-2.5 py-0.5 text-[0.68rem] text-paper/55">{t}</span>
                ))}
              </p>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <ButtonLink href={`/studio/new?template=${item.id}${occasionParam}`} size="sm">Use this</ButtonLink>
                <ButtonLink href={`/templates/${item.id}`} size="sm" variant="secondary">Live demo</ButtonLink>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
