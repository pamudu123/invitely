"use client";

import { Check } from "lucide-react";
import { useState } from "react";
import { ButtonLink } from "@/components/ui/kit";
import { formatPrice, plans, type PlanId } from "@/lib/plans";

export function PlanCards({ show, compact = false }: { show?: PlanId[]; compact?: boolean }) {
  const [currency, setCurrency] = useState<"LKR" | "USD">("LKR");
  const list = show ? plans.filter((p) => show.includes(p.id)) : plans;

  return (
    <div>
      <div className="mb-8 flex justify-center">
        <div className="flex rounded-full border border-paper/15 p-1" role="group" aria-label="Currency">
          {(["LKR", "USD"] as const).map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={currency === c}
              onClick={() => setCurrency(c)}
              className={`h-9 rounded-full px-5 text-[0.82rem] transition-colors ${currency === c ? "bg-flame text-night" : "text-paper/60 hover:text-paper"}`}
            >
              {c === "LKR" ? "Sri Lanka (LKR)" : "International (USD)"}
            </button>
          ))}
        </div>
      </div>
      <div className={`grid gap-4 ${list.length >= 4 ? "md:grid-cols-2 xl:grid-cols-5" : "md:grid-cols-3"}`}>
        {list.map((plan) => (
          <div
            key={plan.id}
            className={`relative flex flex-col rounded-3xl border p-6 ${
              plan.highlight ? "border-flame/60 bg-gradient-to-b from-flame/12 to-transparent" : "border-paper/10 bg-night-2"
            }`}
          >
            {plan.highlight ? <span className="label absolute -top-3 left-6 rounded-full bg-flame px-3 py-1 !text-[0.58rem] text-night">Most loved</span> : null}
            <p className="label text-paper/50">{plan.name}</p>
            <p className="display mt-4 text-[2.6rem]">{formatPrice(plan, currency)}</p>
            <p className="mt-1 text-[0.78rem] text-paper/40">{plan.lkr === 0 ? "No card needed" : "One payment per event. No subscription."}</p>
            <p className="mt-4 text-[0.92rem] leading-snug text-paper/70">{plan.tagline}</p>
            <ul className={`mt-5 grid gap-2.5 text-[0.88rem] text-paper/75 ${compact ? "" : "flex-1 content-start"}`}>
              {(compact ? plan.features.slice(0, 4) : plan.features).map((f) => (
                <li key={f} className="flex gap-2.5">
                  <Check size={15} className="mt-0.5 shrink-0 text-flame" />
                  {f}
                </li>
              ))}
            </ul>
            <ButtonLink href="/templates" variant={plan.highlight ? "primary" : "secondary"} className="mt-7 w-full">
              {plan.cta}
            </ButtonLink>
          </div>
        ))}
      </div>
    </div>
  );
}
