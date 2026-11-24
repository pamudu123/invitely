import { ArrowLeft, ArrowRight, CalendarDays, ExternalLink, MapPin, PenLine } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { daysUntil, formatEventDate, formatWhen, plural } from "@/components/dashboard/format";
import { GuestsPanel, type GuestRow } from "@/components/dashboard/GuestsPanel";
import { PublishPanel } from "@/components/dashboard/PublishPanel";
import { RepliesPanel } from "@/components/dashboard/RepliesPanel";
import { SettingsPanel } from "@/components/dashboard/SettingsPanel";
import { SharePanel } from "@/components/dashboard/SharePanel";
import { TabBar, type TabItem } from "@/components/dashboard/TabBar";
import { InvitationView } from "@/components/invitation/InvitationView";
import { Badge, ButtonLink, Card, PhoneFrame, buttonClass } from "@/components/ui/kit";
import { getOccasion } from "@/lib/invitation/occasions";
import { formatTime } from "@/lib/invitation/time";
import { requireUser } from "@/lib/server/auth";
import {
  getInvitation,
  listGuests,
  listRsvps,
  type GuestRecord,
  type InvitationRecord,
  type RsvpRecord,
} from "@/lib/server/invitations";

export const metadata: Metadata = { title: "Manage invitation" };

const tabIds = ["overview", "guests", "replies", "share", "settings"] as const;
type TabId = (typeof tabIds)[number];

type Props = PageProps<"/dashboard/[id]">;

/* ------------------------------ Overview ------------------------------ */

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <Card className="min-h-32 p-4 sm:p-5">
      <dt className="label truncate !text-[0.6rem] !tracking-[0.14em] text-paper/50 sm:!text-[0.68rem] sm:!tracking-[0.2em]">{label}</dt>
      <dd className="mt-4">
        <span className="display block text-[2.6rem] sm:text-5xl">{value}</span>
        {hint ? <span className="mt-2 block text-xs leading-snug text-paper/45">{hint}</span> : null}
      </dd>
    </Card>
  );
}

function MealBreakdown({ rsvps }: { rsvps: RsvpRecord[] }) {
  const byMeal = new Map<string, { guests: number; replies: number }>();
  for (const r of rsvps) {
    if (!r.attending || !r.meal) continue;
    const row = byMeal.get(r.meal) ?? { guests: 0, replies: 0 };
    row.guests += r.partySize;
    row.replies += 1;
    byMeal.set(r.meal, row);
  }
  if (!byMeal.size) return null;
  const rows = [...byMeal.entries()].sort((a, b) => b[1].guests - a[1].guests);
  const max = Math.max(...rows.map(([, v]) => v.guests));

  return (
    <Card className="p-5 sm:p-6">
      <p className="label text-paper/50">Meal preferences</p>
      <p className="mt-2 text-xs text-paper/45">Counted by guests in attending parties.</p>
      <ul className="mt-5 grid gap-4">
        {rows.map(([meal, v]) => (
          <li key={meal}>
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <span className="min-w-0 truncate text-paper/85">{meal}</span>
              <span className="shrink-0 text-paper/55">
                <span className="font-medium text-paper">{v.guests}</span> {v.guests === 1 ? "guest" : "guests"}
                <span className="text-paper/40"> · {plural(v.replies, "reply", "replies")}</span>
              </span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-paper/8" aria-hidden>
              <div className="h-full rounded-full bg-flame" style={{ width: `${Math.max(3, (v.guests / max) * 100)}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function LatestReplies({ inv, rsvps }: { inv: InvitationRecord; rsvps: RsvpRecord[] }) {
  const latest = rsvps.slice(0, 5);
  return (
    <Card className="p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <p className="label text-paper/50">Latest replies</p>
        {rsvps.length ? (
          <Link
            href={`/dashboard/${inv.id}?tab=replies`}
            scroll={false}
            className="-my-3 inline-flex min-h-11 items-center gap-1.5 text-sm text-flame underline-offset-4 hover:underline"
          >
            See all
            <ArrowRight size={15} strokeWidth={1.5} aria-hidden />
          </Link>
        ) : null}
      </div>
      {latest.length ? (
        <ul className="mt-3 divide-y divide-paper/10">
          {latest.map((r) => (
            <li key={r.id} className="flex items-center justify-between gap-3 py-3.5 last:pb-0">
              <div className="min-w-0">
                <p className="truncate text-[0.95rem] font-medium text-paper">{r.name}</p>
                <p className="mt-0.5 truncate text-xs text-paper/50">
                  {r.attending ? `${plural(r.partySize, "guest", "guests")} · ` : ""}
                  {formatWhen(r.updatedAt, inv.data.timezone)}
                </p>
              </div>
              <Badge tone={r.attending ? "teal" : "red"}>{r.attending ? "Attending" : "Declined"}</Badge>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm leading-relaxed text-paper/55">
          No replies yet. They will appear here as soon as your guests respond.
        </p>
      )}
    </Card>
  );
}

function Overview({ inv, guests, rsvps, now }: { inv: InvitationRecord; guests: GuestRecord[]; rsvps: RsvpRecord[]; now: number }) {
  const attending = rsvps.filter((r) => r.attending);
  const headcount = attending.reduce((sum, r) => sum + r.partySize, 0);
  const declined = rsvps.length - attending.length;
  const replied = new Set(rsvps.map((r) => r.guestId).filter(Boolean));
  const awaiting = guests.filter((g) => !replied.has(g.id)).length;
  const days = daysUntil(inv.data.date, inv.data.timezone, now);
  const published = inv.status === "published";

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto]">
      <div className="grid min-w-0 content-start gap-5">
        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
          <Stat label="Attending parties" value={String(attending.length)} hint={plural(rsvps.length, "reply so far", "replies so far")} />
          <Stat label="Total headcount" value={String(headcount)} hint="Guests in attending parties" />
          <Stat label="Declined" value={String(declined)} />
          <Stat
            label="Awaiting reply"
            value={String(awaiting)}
            hint={guests.length ? `Of ${plural(guests.length, "invited guest", "invited guests")}` : "Add guests to track this"}
          />
          <Stat label="Views" value={inv.views.toLocaleString("en-GB")} />
          <Stat
            label={days !== null && days < 0 ? "Days since" : "Days to go"}
            value={days === null ? "?" : days === 0 ? "Today" : String(Math.abs(days))}
            hint={formatEventDate(inv.data.date)}
          />
        </dl>

        <PublishPanel id={inv.id} slug={inv.slug} published={published} />
        <MealBreakdown rsvps={rsvps} />
        <LatestReplies inv={inv} rsvps={rsvps} />
      </div>

      <aside className="hidden lg:block" aria-label="Preview">
        <div className="sticky top-24 flex flex-col items-center">
          <PhoneFrame width={248}>
            <InvitationView data={inv.data} embedded skipRitual lite />
          </PhoneFrame>
          <ButtonLink href={`/studio/${inv.id}`} variant="ghost" className="mt-4">
            <PenLine size={16} strokeWidth={1.5} aria-hidden />
            Edit design
          </ButtonLink>
        </div>
      </aside>
    </div>
  );
}

/* -------------------------------- Page -------------------------------- */

/** Everything the page needs, read at request time, with the clock read alongside the data. */
async function load(id: string, userId: string) {
  const inv = await getInvitation(id, userId);
  if (!inv) return null;
  const [guests, rsvps] = await Promise.all([listGuests(inv.id), listRsvps(inv.id)]);
  return { inv, guests, rsvps, now: Date.now() };
}

async function Manage({ params, searchParams }: Props) {
  await connection();
  const [{ id }, sp] = await Promise.all([params, searchParams]);
  const user = await requireUser(`/dashboard/${id}`);
  const loaded = await load(id, user.id);
  if (!loaded) notFound();
  const { inv, guests, rsvps, now } = loaded;

  const tab: TabId = tabIds.find((t) => t === sp.tab) ?? "overview";

  const published = inv.status === "published";
  const occasion = getOccasion(inv.data.occasion);
  const base = `/dashboard/${inv.id}`;
  const tabs: TabItem[] = [
    { id: "overview", label: "Overview", href: `${base}?tab=overview` },
    { id: "guests", label: "Guests", href: `${base}?tab=guests`, count: guests.length },
    { id: "replies", label: "Replies", href: `${base}?tab=replies`, count: rsvps.length },
    { id: "share", label: "Share", href: `${base}?tab=share` },
    { id: "settings", label: "Settings", href: `${base}?tab=settings` },
  ];

  let panel;
  if (tab === "guests") {
    // Replies are newest first, so the first one found for a guest is their latest.
    const replyByGuest = new Map<string, "yes" | "no">();
    for (const r of rsvps) {
      if (r.guestId && !replyByGuest.has(r.guestId)) replyByGuest.set(r.guestId, r.attending ? "yes" : "no");
    }
    const rows: GuestRow[] = guests.map((g) => ({
      id: g.id,
      name: g.name,
      seats: g.seats,
      token: g.token,
      table: g.table,
      phone: g.phone,
      opened: g.openedAt !== null,
      checkedIn: g.checkedInAt !== null,
      reply: replyByGuest.get(g.id) ?? null,
    }));
    panel = <GuestsPanel invitationId={inv.id} slug={inv.slug} published={published} guests={rows} />;
  } else if (tab === "replies") {
    panel = (
      <RepliesPanel
        invitationId={inv.id}
        timeZone={inv.data.timezone}
        question={inv.data.rsvp.customQuestion ?? ""}
        replies={rsvps.map((r) => ({
          id: r.id,
          name: r.name,
          phone: r.phone,
          attending: r.attending,
          partySize: r.partySize,
          meal: r.meal,
          answer: r.answer,
          message: r.message,
          hidden: r.hidden,
          updatedAt: r.updatedAt,
        }))}
      />
    );
  } else if (tab === "share") {
    panel = <SharePanel invitationId={inv.id} slug={inv.slug} title={inv.title} published={published} />;
  } else if (tab === "settings") {
    panel = <SettingsPanel id={inv.id} slug={inv.slug} title={inv.title} />;
  } else {
    panel = <Overview inv={inv} guests={guests} rsvps={rsvps} now={now} />;
  }

  return (
    <>
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <p className="label text-flame">{occasion.label}</p>
            <Badge tone={published ? "teal" : "neutral"}>
              {published ? <span aria-hidden className="size-1.5 rounded-full bg-teal" /> : null}
              {published ? "Live" : "Draft"}
            </Badge>
          </div>
          <h1 className="display mt-4 break-words text-5xl sm:text-6xl">{inv.title}</h1>
          <p className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-paper/60">
            <span className="inline-flex items-center gap-2">
              <CalendarDays size={16} strokeWidth={1.5} aria-hidden className="text-paper/40" />
              {formatEventDate(inv.data.date)}
              {inv.data.time ? `, ${formatTime(inv.data.time)}` : ""}
            </span>
            {inv.data.venueName ? (
              <span className="inline-flex min-w-0 items-center gap-2">
                <MapPin size={16} strokeWidth={1.5} aria-hidden className="shrink-0 text-paper/40" />
                <span className="truncate">{inv.data.venueName}</span>
              </span>
            ) : null}
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <ButtonLink href={`/studio/${inv.id}`} variant="secondary" className="flex-1 sm:flex-none">
            <PenLine size={16} strokeWidth={1.5} aria-hidden />
            Edit design
          </ButtonLink>
          {published ? (
            <a href={`/i/${inv.slug}`} target="_blank" rel="noopener" className={buttonClass("secondary", "md", "flex-1 sm:flex-none")}>
              View
              <ExternalLink size={15} strokeWidth={1.5} aria-hidden />
            </a>
          ) : null}
        </div>
      </div>

      <div className="mt-8">
        <TabBar tabs={tabs} active={tab} />
      </div>
      <div className="mt-6 sm:mt-8">{panel}</div>
    </>
  );
}

function ManageFallback() {
  return (
    <div aria-hidden className="animate-pulse">
      <div className="h-3 w-24 rounded-full bg-paper/10" />
      <div className="mt-5 h-12 w-3/4 max-w-md rounded-xl bg-paper/8" />
      <div className="mt-5 h-4 w-48 rounded-full bg-paper/8" />
      <div className="mt-9 h-12 border-b border-paper/10" />
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-32 rounded-2xl border border-paper/10 bg-night-2" />
        ))}
      </div>
    </div>
  );
}

export default function ManagePage({ params, searchParams }: Props) {
  return (
    <>
      <Link
        href="/dashboard"
        className="-ml-2 mb-6 inline-flex min-h-11 items-center gap-2 rounded-full px-2 text-sm text-paper/60 outline-none transition-colors hover:text-paper focus-visible:ring-2 focus-visible:ring-flame/60"
      >
        <ArrowLeft size={16} strokeWidth={1.5} aria-hidden />
        All invitations
      </Link>
      <Suspense fallback={<ManageFallback />}>
        <Manage params={params} searchParams={searchParams} />
      </Suspense>
    </>
  );
}
