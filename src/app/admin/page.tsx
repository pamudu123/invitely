import Link from "next/link";
import { Suspense } from "react";
import { adminLogoutAction } from "@/app/actions/reviews";
import { Badge, Button, buttonClass } from "@/components/ui/kit";
import { requireAdmin } from "@/lib/server/admin";
import { listAdminCards } from "@/lib/server/reviews";

const tone = { requested: "flame", ready: "teal", confirmed: "teal", none: "neutral" } as const;
const label = { requested: "Needs changes", ready: "With the host", confirmed: "Confirmed", none: "No review" } as const;

async function Cards() {
  await requireAdmin();
  const cards = await listAdminCards();
  const waiting = cards.filter((c) => c.reviewStatus === "requested").length;
  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label text-brand">Review queue</p>
          <h1 className="display mt-3 text-5xl sm:text-6xl">{waiting ? `${waiting} waiting for you` : "Nothing waiting"}</h1>
        </div>
        <form action={adminLogoutAction}>
          <Button type="submit" variant="ghost" size="sm">Sign out</Button>
        </form>
      </div>
      <ul className="mt-9 grid gap-3">
        {cards.map((c) => {
          const key = (c.reviewStatus in label ? c.reviewStatus : "none") as keyof typeof label;
          return (
            <li key={c.id} className="flex flex-col gap-3 rounded-2xl border border-fg/10 bg-page-2 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone={tone[key]}>{label[key]}</Badge>
                  <Badge>{c.status === "published" ? "Live" : "Draft"}</Badge>
                  {c.openPins ? <span className="text-xs text-fg/85">{c.openPins} open notes · round {c.round}</span> : null}
                </div>
                <p className="mt-2 truncate font-serif text-2xl">{c.title}</p>
                <p className="truncate text-xs text-fg/85">
                  /i/{c.slug}{c.ownerName ? ` · ${c.ownerName}` : ""}{c.ownerContact ? ` · ${c.ownerContact}` : ""}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Link href={`/admin/cards/${c.id}`} className={buttonClass(c.reviewStatus === "requested" ? "primary" : "secondary", "sm")}>Review</Link>
                <a href={`/studio/${c.manageToken}`} target="_blank" rel="noopener" className={buttonClass("secondary", "sm")}>Studio</a>
                <a href={`/m/${c.manageToken}`} target="_blank" rel="noopener" className={buttonClass("ghost", "sm")}>Manage</a>
              </div>
            </li>
          );
        })}
        {!cards.length ? <li className="rounded-2xl border border-fg/10 p-6 text-sm text-fg/85">No cards yet.</li> : null}
      </ul>
    </>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={<div className="h-80 animate-pulse rounded-2xl border border-fg/10 bg-page-2" />}>
      <Cards />
    </Suspense>
  );
}
