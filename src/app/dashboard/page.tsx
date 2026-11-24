import { CalendarDays, ExternalLink, MailOpen, Plus } from "lucide-react";
import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import { formatEventDate } from "@/components/dashboard/format";
import { Badge, ButtonLink, Card, buttonClass } from "@/components/ui/kit";
import { getOccasion } from "@/lib/invitation/occasions";
import { getTemplate } from "@/lib/invitation/templates";
import { getPalette } from "@/lib/invitation/theme";
import type { OccasionId } from "@/lib/invitation/types";
import { requireUser } from "@/lib/server/auth";
import { listInvitations, type InvitationSummary } from "@/lib/server/invitations";

export const metadata: Metadata = { title: "Your invitations" };

function monogram(title: string): string {
  const parts = title.split("&").map((p) => p.trim()).filter(Boolean);
  const letters = parts.length > 1 ? [parts[0], parts[1]] : (parts[0] ?? "").split(/\s+/).slice(0, 2);
  return letters.map((p) => p.charAt(0).toUpperCase()).join("") || "I";
}

function Count({ value, label }: { value: number; label: string }) {
  return (
    <div className="min-w-0 px-1 py-3 text-center">
      <dd className="font-serif text-[1.7rem] leading-none tracking-tight text-paper">{value.toLocaleString("en-GB")}</dd>
      <dt className="label mt-2 truncate !text-[0.56rem] !tracking-[0.14em] text-paper/45">{label}</dt>
    </div>
  );
}

function InvitationCard({ inv }: { inv: InvitationSummary }) {
  const live = inv.status === "published";
  const occasion = getOccasion(inv.occasion as OccasionId);
  const template = getTemplate(inv.templateId);
  const palette = template ? getPalette(template.theme) : null;

  return (
    <Card className="flex flex-col p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span
            aria-hidden
            className="grid size-12 shrink-0 place-items-center rounded-full border font-serif text-lg leading-none"
            style={
              palette
                ? { background: palette.deep, color: palette.onDeep, borderColor: palette.accent }
                : undefined
            }
          >
            {monogram(inv.title)}
          </span>
          <div className="min-w-0">
            <p className="label truncate text-flame">{occasion.label}</p>
            {template ? <p className="mt-1 truncate text-xs text-paper/45">{template.name} design</p> : null}
          </div>
        </div>
        <Badge tone={live ? "teal" : "neutral"}>
          {live ? <span aria-hidden className="size-1.5 rounded-full bg-teal" /> : null}
          {live ? "Live" : "Draft"}
        </Badge>
      </div>

      <h2 className="display mt-5 break-words text-[2rem] leading-[1.02] sm:text-4xl">{inv.title}</h2>
      <p className="mt-3 flex items-center gap-2 text-sm text-paper/60">
        <CalendarDays size={16} strokeWidth={1.5} aria-hidden className="shrink-0 text-paper/40" />
        {formatEventDate(inv.date)}
      </p>

      <dl className="mt-5 grid grid-cols-4 divide-x divide-paper/10 rounded-xl border border-paper/10 bg-night-3/40">
        <Count value={inv.attending} label="Attending" />
        <Count value={inv.declined} label="Declined" />
        <Count value={inv.headcount} label="Headcount" />
        <Count value={inv.views} label="Views" />
      </dl>

      <div className="mt-5 flex flex-wrap gap-2 pt-1">
        <ButtonLink href={`/dashboard/${inv.id}`} className="flex-1 !px-4">
          Manage
        </ButtonLink>
        <ButtonLink href={`/studio/${inv.id}`} variant="secondary" className="flex-1 !px-4">
          Edit design
        </ButtonLink>
        {live ? (
          <a
            href={`/i/${inv.slug}`}
            target="_blank"
            rel="noopener"
            className={buttonClass("ghost", "md", "flex-1 !px-4")}
            aria-label={`View ${inv.title} in a new tab`}
          >
            View
            <ExternalLink size={15} strokeWidth={1.5} aria-hidden />
          </a>
        ) : null}
      </div>
    </Card>
  );
}

function EmptyState() {
  return (
    <Card className="mx-auto mt-4 flex max-w-xl flex-col items-center px-6 py-14 text-center sm:py-20">
      <span className="grid size-16 place-items-center rounded-full border border-flame/30 bg-flame/10 text-flame">
        <MailOpen size={26} strokeWidth={1.5} aria-hidden />
      </span>
      <h2 className="display mt-6 text-4xl">Nothing here yet</h2>
      <p className="mt-4 max-w-sm text-sm leading-relaxed text-paper/60">
        Pick a design, add your names and date, and your first invitation will be ready to share in a few minutes.
      </p>
      <ButtonLink href="/templates" size="lg" className="mt-8">
        <Plus size={18} strokeWidth={1.5} aria-hidden />
        Choose a template
      </ButtonLink>
    </Card>
  );
}

async function Invitations() {
  await connection();
  const user = await requireUser("/dashboard");
  const list = await listInvitations(user.id);
  if (!list.length) return <EmptyState />;
  return (
    <ul className="grid gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-3">
      {list.map((inv) => (
        <li key={inv.id} className="grid">
          <InvitationCard inv={inv} />
        </li>
      ))}
    </ul>
  );
}

function ListFallback() {
  return (
    <div className="grid gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-3" aria-hidden>
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-80 animate-pulse rounded-2xl border border-paper/10 bg-night-2" />
      ))}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <>
      <p className="label text-flame">Dashboard</p>
      <h1 className="display mt-3 text-5xl sm:text-6xl">Your invitations</h1>
      <p className="mb-8 mt-4 max-w-xl text-sm leading-relaxed text-paper/60 sm:mb-10">
        Follow replies, manage your guest list and share each invitation from here.
      </p>
      <Suspense fallback={<ListFallback />}>
        <Invitations />
      </Suspense>
    </>
  );
}
