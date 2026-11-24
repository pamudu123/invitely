"use client";

import { Check, Search, X } from "lucide-react";
import { useOptimistic, useState, useTransition } from "react";
import { checkInAction } from "@/app/actions/guests";
import { fieldClass } from "@/components/ui/kit";
import { plural } from "./format";

export interface CheckinGuest {
  id: string;
  name: string;
  seats: number;
  table: string;
  checkedIn: boolean;
}

export function CheckinBoard({ invitationId, guests }: { invitationId: string; guests: CheckinGuest[] }) {
  const [query, setQuery] = useState("");
  const [failed, setFailed] = useState(false);
  const [, startTransition] = useTransition();
  // Flip the row straight away. The saved list replaces it when the server answers.
  const [list, flip] = useOptimistic(guests, (current, change: { id: string; checkedIn: boolean }) =>
    current.map((g) => (g.id === change.id ? { ...g, checkedIn: change.checkedIn } : g)),
  );

  const toggle = (g: CheckinGuest) => {
    const next = !g.checkedIn;
    setFailed(false);
    startTransition(async () => {
      flip({ id: g.id, checkedIn: next });
      try {
        await checkInAction(invitationId, g.id, next);
      } catch {
        setFailed(true);
      }
    });
  };

  const arrived = list.filter((g) => g.checkedIn);
  const seatsIn = arrived.reduce((sum, g) => sum + g.seats, 0);
  const seatsAll = list.reduce((sum, g) => sum + g.seats, 0);
  const progress = list.length ? (arrived.length / list.length) * 100 : 0;

  const q = query.trim().toLowerCase();
  const shown = q ? list.filter((g) => `${g.name} ${g.table}`.toLowerCase().includes(q)) : list;

  return (
    <div>
      <div className="sticky top-16 z-30 -mx-4 border-b border-fg/10 bg-page/90 px-4 pb-4 pt-3 backdrop-blur-md sm:-mx-6 sm:px-6">
        <dl className="grid grid-cols-2 gap-3" aria-live="polite">
          <div className="rounded-2xl border border-fg/10 bg-page-2 px-4 py-3">
            <dt className="label text-fg/85">Parties in</dt>
            <dd className="mt-2 font-serif text-4xl leading-none tracking-tight">
              {arrived.length}
              <span className="font-sans text-base tracking-normal text-fg/85"> of {list.length}</span>
            </dd>
          </div>
          <div className="rounded-2xl border border-fg/10 bg-page-2 px-4 py-3">
            <dt className="label text-fg/85">Seats filled</dt>
            <dd className="mt-2 font-serif text-4xl leading-none tracking-tight">
              {seatsIn}
              <span className="font-sans text-base tracking-normal text-fg/85"> of {seatsAll}</span>
            </dd>
          </div>
        </dl>
        <div className="mt-3 h-1 overflow-hidden rounded-full bg-fg/8" aria-hidden>
          <div className="h-full rounded-full bg-brand transition-[width] duration-500 ease-out-soft" style={{ width: `${progress}%` }} />
        </div>
        <label className="relative mt-3 block">
          <span className="sr-only">Search guests</span>
          <Search size={20} strokeWidth={1.5} aria-hidden className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-fg/85" />
          <input
            type="search"
            inputMode="search"
            enterKeyHint="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name or table"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            className={`${fieldClass} !min-h-14 !rounded-2xl !pl-12 !pr-12 !text-lg [&::-webkit-search-cancel-button]:hidden`}
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-1.5 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full text-fg/85 hover:text-fg"
            >
              <X size={19} strokeWidth={1.5} aria-hidden />
            </button>
          ) : null}
        </label>
      </div>

      {failed ? (
        <p role="alert" className="mt-4 rounded-xl border border-red-600/50 bg-red-600/8 px-3.5 py-3 text-sm text-red-700">
          That check-in was not saved. Check your connection and tap again.
        </p>
      ) : null}

      {shown.length ? (
        <ul className="mt-4 grid gap-2.5">
          {shown.map((g) => (
            <li
              key={g.id}
              className={`flex items-center gap-3 rounded-2xl border p-3 pl-4 transition-colors duration-300 ${
                g.checkedIn ? "border-aqua/30 bg-aqua/5" : "border-fg/10 bg-page-2"
              }`}
            >
              <div className="min-w-0 flex-1">
                <p className="break-words text-[1.08rem] font-medium leading-snug text-fg">{g.name}</p>
                <p className="mt-1 text-sm text-fg/85">
                  {plural(g.seats, "seat", "seats")}
                  {g.table ? ` · ${g.table}` : ""}
                </p>
              </div>
              <button
                type="button"
                onClick={() => toggle(g)}
                aria-pressed={g.checkedIn}
                aria-label={g.checkedIn ? `Undo check-in for ${g.name}` : `Check in ${g.name}`}
                className={`inline-flex min-h-14 w-[8.25rem] shrink-0 items-center justify-center gap-2 rounded-full text-[0.95rem] font-medium outline-none transition-all duration-300 ease-out-soft focus-visible:ring-2 focus-visible:ring-brand/60 active:scale-[0.97] ${
                  g.checkedIn ? "border border-aqua/50 bg-aqua/15 text-aqua" : "bg-brand text-on-brand hover:bg-brand-hot"
                }`}
              >
                {g.checkedIn ? (
                  <>
                    <Check size={18} strokeWidth={2} aria-hidden />
                    Checked in
                  </>
                ) : (
                  "Check in"
                )}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-10 text-center text-fg/85">No guests match &ldquo;{query.trim()}&rdquo;.</p>
      )}
      <p className="mt-6 text-center text-xs text-fg/85">Tap a checked in guest again to undo.</p>
    </div>
  );
}
