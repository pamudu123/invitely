"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, type MouseEvent, type ReactNode } from "react";
import { DesignPreview } from "@/components/site/DesignPreview";
import { LikeButton, UnlikeButton } from "@/components/site/LikeButton";
import { Button, ButtonLink } from "@/components/ui/kit";
import { useLikes } from "@/lib/client/likes";
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
  hasOpening: boolean;
  cover: ReactNode;
}

type GalleryFilter = OccasionId | "all" | "liked";

const sorts = [
  { id: "picks", label: "Our picks" },
  { id: "liked", label: "Most liked" },
] as const;

type GallerySort = (typeof sorts)[number]["id"];

/** Filter and sort live in the address, so they survive a reload and can be shared. */
function setParam(key: "show" | "sort", value: string | null) {
  const params = new URLSearchParams(window.location.search);
  if (key === "show") {
    params.delete("occasion");
    params.delete("show");
    if (value && value !== "all") params.set(value === "liked" ? "show" : "occasion", value);
  } else if (value && value !== "picks") params.set(key, value);
  else params.delete(key);
  const query = params.toString();
  window.history.replaceState(null, "", query ? `?${query}` : window.location.pathname);
}

function previewAddress(id: string | null): string {
  const params = new URLSearchParams(window.location.search);
  if (id) params.set("preview", id);
  else params.delete("preview");
  const query = params.toString();
  return query ? `?${query}` : window.location.pathname;
}

export function TemplateGallery({ items }: { items: GalleryItem[] }) {
  return (
    <Suspense fallback={<GalleryView items={items} filter="all" sort="picks" preview={null} />}>
      <GalleryFromAddress items={items} />
    </Suspense>
  );
}

function GalleryFromAddress({ items }: { items: GalleryItem[] }) {
  const params = useSearchParams();
  const occasion = occasions.find((o) => o.id === params.get("occasion"))?.id;
  return (
    <GalleryView
      items={items}
      filter={params.get("show") === "liked" ? "liked" : occasion ?? "all"}
      sort={params.get("sort") === "liked" ? "liked" : "picks"}
      preview={params.get("preview")}
    />
  );
}

function GalleryView({ items, filter, sort, preview }: { items: GalleryItem[]; filter: GalleryFilter; sort: GallerySort; preview: string | null }) {
  const { totals, mine } = useLikes();
  const bar = useRef<HTMLDivElement | null>(null);

  // Arriving on a filtered link, bring the chosen filter into view on the sideways strip.
  useEffect(() => {
    const el = bar.current;
    const chip = el?.querySelector<HTMLElement>('[aria-pressed="true"]');
    if (el && chip) el.scrollLeft = chip.offsetLeft - el.offsetLeft - (el.clientWidth - chip.offsetWidth) / 2;
  }, []);

  const available = occasions.filter((o) => items.some((i) => i.occasion === o.id || i.alsoFor.includes(o.id)));
  const occasion = filter === "all" || filter === "liked" ? null : filter;
  const picked = occasion
    ? [
        ...items.filter((i) => i.occasion === occasion),
        ...items.filter((i) => i.occasion !== occasion && i.alsoFor.includes(occasion)),
      ]
    : items.filter((i) => filter === "all" || mine.includes(i.id));
  const likes = (id: string) => totals?.[id] ?? 0;
  const shown = sort === "liked" ? [...picked].sort((a, b) => likes(b.id) - likes(a.id)) : picked;
  const myCount = items.filter((i) => mine.includes(i.id)).length;
  const myPrinted = mine.filter((id) => id.startsWith("print-")).length;

  const choose = (f: GalleryFilter) => setParam("show", f);

  // The open preview lives in the address too, so a phone's back button closes it.
  const pushed = useRef(false);
  useEffect(() => {
    if (!preview) pushed.current = false;
  }, [preview]);
  const openPreview = (id: string) => (e: MouseEvent) => {
    // Opening in a new tab still works, and goes to the design's own page.
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    pushed.current = true;
    window.history.pushState(null, "", previewAddress(id));
  };
  const closePreview = () => {
    if (pushed.current) window.history.back();
    else window.history.replaceState(null, "", previewAddress(null));
    pushed.current = false;
  };
  const current = preview ? items.find((i) => i.id === preview) : undefined;
  const at = current ? shown.indexOf(current) : -1;
  const step = (by: number) => {
    if (!shown.length) return;
    const next = shown[(Math.max(at, 0) + by + shown.length) % shown.length];
    window.history.replaceState(null, "", previewAddress(next.id));
  };
  const occasionFor = (item: GalleryItem) => (occasion && item.occasion !== occasion && item.alsoFor.includes(occasion) ? occasion : item.occasion);
  const studioHref = (item: GalleryItem) => {
    const o = occasionFor(item);
    return `/studio/new?template=${item.id}${o !== item.occasion ? `&occasion=${o}` : ""}`;
  };

  return (
    <>
      <div ref={bar} className="no-scrollbar sticky top-16 z-30 -mx-5 flex gap-2 overflow-x-auto border-b border-fg/10 bg-page/80 px-5 py-3 backdrop-blur-xl sm:-mx-8 sm:px-8">
        {[
          { id: "all" as const, label: "All designs" },
          { id: "liked" as const, label: myCount ? `Your likes (${myCount})` : "Your likes" },
          ...available.map((o) => ({ id: o.id, label: o.plural })),
        ].map((o) => (
          <button
            key={o.id}
            type="button"
            aria-pressed={filter === o.id}
            onClick={() => choose(o.id)}
            className={`h-10 shrink-0 rounded-full border px-4 text-[0.86rem] transition-colors ${
              filter === o.id ? "border-brand bg-brand text-on-brand" : "border-fg/15 text-fg/90 hover:border-fg/40"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[0.9rem] text-fg/85" aria-live="polite">{shown.length} {shown.length === 1 ? "design" : "designs"}</p>
        <div className="flex gap-2" role="group" aria-label="Sort designs">
          {sorts.map((s) => (
            <button
              key={s.id}
              type="button"
              aria-pressed={sort === s.id}
              onClick={() => setParam("sort", s.id)}
              className={`h-10 rounded-full border px-4 text-[0.86rem] transition-colors ${
                sort === s.id ? "border-brand bg-brand text-on-brand" : "border-fg/15 text-fg/90 hover:border-fg/40"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {filter === "liked" && !shown.length ? (
        <div className="mt-8 rounded-3xl border border-fg/10 bg-page-2 px-6 py-14 text-center">
          <h2 className="display text-4xl">No likes yet</h2>
          <p className="mx-auto mb-7 mt-3 max-w-sm text-fg/85">Tap the heart on any design and it will be kept here for you.</p>
          <Button onClick={() => choose("all")}>See all designs</Button>
        </div>
      ) : null}
      {filter === "liked" && myPrinted > 0 ? (
        <p className="mt-4 text-[0.9rem] text-fg/85">
          You also like {myPrinted} printed {myPrinted === 1 ? "card" : "cards"}.{" "}
          <Link href="/print-cards" className="font-semibold text-brand underline underline-offset-4">See the printed cards</Link>
        </p>
      ) : null}

      <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6 md:grid-cols-3 xl:grid-cols-4">
        {shown.map((item) => {
          return (
            <li key={item.id} className="group flex flex-col">
              <div className="relative transition-transform duration-500 ease-out-soft group-hover:-translate-y-1.5">
                <Link href={`/templates/${item.id}`} prefetch={false} onClick={openPreview(item.id)} className="block overflow-hidden rounded-[1.4rem] border border-fg/10" aria-haspopup="dialog" aria-label={`Preview ${item.name}`}>
                  {item.cover}
                </Link>
                <LikeButton id={item.id} name={item.name} className="absolute bottom-3 right-3" />
              </div>
              <div className="mt-4 flex items-baseline justify-between gap-2">
                <h2 className="font-serif text-[1.6rem] leading-none">{item.name}</h2>
                <span className="label hidden text-fg/85 sm:inline">{item.opening}</span>
              </div>
              <p className="mt-1.5 text-[0.84rem] text-fg/85">{item.meaning}</p>
              <p className="mt-2 hidden flex-wrap gap-1.5 sm:flex">
                {item.tags.map((t) => (
                  <span key={t} className="rounded-full border border-fg/12 px-2.5 py-0.5 text-[0.75rem] text-fg/85">{t}</span>
                ))}
              </p>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <ButtonLink href={studioHref(item)} size="sm">Use this</ButtonLink>
                <ButtonLink href={`/templates/${item.id}`} prefetch={false} onClick={openPreview(item.id)} aria-haspopup="dialog" size="sm" variant="secondary">Preview</ButtonLink>
              </div>
              {filter === "liked" ? <UnlikeButton id={item.id} name={item.name} /> : null}
            </li>
          );
        })}
      </ul>

      {current ? (
        <DesignPreview
          id={current.id}
          name={current.name}
          meaning={current.meaning}
          occasion={occasionFor(current)}
          hasOpening={current.hasOpening}
          place={at >= 0 ? `${at + 1} of ${shown.length}` : ""}
          useHref={studioHref(current)}
          onClose={closePreview}
          onPrevious={() => step(-1)}
          onNext={() => step(1)}
        />
      ) : null}
    </>
  );
}
