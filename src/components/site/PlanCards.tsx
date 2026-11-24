import { Check } from "lucide-react";
import Link from "next/link";
import { formatPrice, plans, type PlanId } from "@/lib/plans";
import "./frost/frost.css";

export function PlanCards({ show, compact = false }: { show?: PlanId[]; compact?: boolean }) {
  const list = show ? plans.filter((p) => show.includes(p.id)) : plans;
  return (
    <div className={`frost-plans ${list.length >= 4 ? "frost-plans-many" : ""}`}>
      {list.map((plan) => (
        <article key={plan.id} className={`frost-plan frost-plan-${plan.id}`}>
          <h3>{plan.name}</h3>
          <p className="frost-price">{formatPrice(plan)}</p>
          <p className="frost-plan-note">{plan.usd === 0 ? "No payment details needed" : "One payment per card. No subscription."}</p>
          <p className="frost-plan-tag">{plan.tagline}</p>
          <ul>
            {(compact ? plan.features.slice(0, 4) : plan.features).map((f) => (
              <li key={f}><Check size={18} />{f}</li>
            ))}
          </ul>
          <Link href="/templates">{plan.cta}</Link>
        </article>
      ))}
    </div>
  );
}
