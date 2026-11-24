"use client";

import { CalendarDays, ExternalLink, KeyRound, MailOpen, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { findCardAction, myCardsAction } from "@/app/actions/invitations";
import { formatEventDate } from "@/components/dashboard/format";
import { Badge, Button, ButtonLink, Card, Field, Input, buttonClass } from "@/components/ui/kit";
import { getCardTokens, rememberCard } from "@/lib/client/cards";
import { getOccasion } from "@/lib/invitation/occasions";
import { getTemplate } from "@/lib/invitation/templates";
import { getPalette } from "@/lib/invitation/theme";
import type { OccasionId } from "@/lib/invitation/types";
import type { InvitationSummary } from "@/lib/server/invitations";

function monogram(title: string): string {
  const parts = title.split("&").map((p) => p.trim()).filter(Boolean);
  const letters = parts.length > 1 ? [parts[0], parts[1]] : (parts[0] ?? "").split(/\s+/).slice(0, 2);
  return letters.map((p) => p.charAt(0).toUpperCase()).join("") || "I";
}

function Count({ value, label }: { value: number; label: string }) {
  return (
    <div className="min-w-0 px-1 py-3 text-center">
      <dd className="font-serif text-[1.7rem] leading-none tracking-tight text-fg">{value.toLocaleString("en-GB")}</dd>
      <dt className="label mt-2 truncate !text-[0.75rem] !tracking-[0.14em] text-fg/85">{label}</dt>
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
            style={palette ? { background: palette.deep, color: palette.onDeep, borderColor: palette.accent } : undefined}
          >
            {monogram(inv.title)}
          </span>
          <div className="min-w-0">
            <p className="label truncate text-brand">{occasion.label}</p>
            {template ? <p className="mt-1 truncate text-xs text-fg/85">{template.name} design</p> : null}
          </div>
        </div>
        <Badge tone={live ? "teal" : "neutral"}>
          {live ? <span aria-hidden className="size-1.5 rounded-full bg-aqua" /> : null}
          {live ? "Live" : "Draft"}
        </Badge>
      </div>

      <h2 className="display mt-5 break-words text-[2rem] leading-[1.02] sm:text-4xl">{inv.title}</h2>
      <p className="mt-3 flex items-center gap-2 text-sm text-fg/85">
        <CalendarDays size={16} strokeWidth={1.5} aria-hidden className="shrink-0 text-fg/85" />
        {formatEventDate(inv.date)}
      </p>

      <dl className="mt-5 grid grid-cols-4 divide-x divide-fg/10 rounded-xl border border-fg/10 bg-page-3/40">
        <Count value={inv.attending} label="Attending" />
        <Count value={inv.declined} label="Declined" />
        <Count value={inv.headcount} label="Headcount" />
        <Count value={inv.views} label="Views" />
      </dl>

      <div className="mt-auto flex flex-wrap gap-2 pt-6">
        <ButtonLink href={`/m/${inv.manageToken}`} className="flex-1 !px-4">Manage</ButtonLink>
        <ButtonLink href={`/studio/${inv.manageToken}`} variant="secondary" className="flex-1 !px-4">Edit design</ButtonLink>
        {live ? (
          <a href={`/i/${inv.slug}`} target="_blank" rel="noopener" className={buttonClass("ghost", "md", "flex-1 !px-4")} aria-label={`View ${inv.title} in a new tab`}>
            View <ExternalLink size={15} strokeWidth={1.5} aria-hidden />
          </a>
        ) : null}
      </div>
    </Card>
  );
}

/** Get back into a card from any device with its invitation link and edit PIN. */
function FindCard() {
  const router = useRouter();
  const [link, setLink] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    start(async () => {
      const res = await findCardAction(link, pin);
      if (res.ok) {
        rememberCard(res.token);
        router.push(`/m/${res.token}`);
      } else setError(res.error);
    });
  };

  return (
    <Card className="p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-full border border-brand/30 bg-brand/10 text-brand">
          <KeyRound size={18} strokeWidth={1.5} aria-hidden />
        </span>
        <div>
          <h2 className="font-serif text-2xl leading-tight">Find a card</h2>
          <p className="mt-1 text-sm leading-relaxed text-fg/85">
            On a new phone, or lost your manage link? Enter the invitation link you share with guests and your edit PIN.
          </p>
        </div>
      </div>
      <form onSubmit={submit} className="mt-5 grid gap-3 sm:grid-cols-[1fr_10rem_auto] sm:items-end">
        <Field label="Invitation link">
          <Input value={link} onChange={(e) => setLink(e.target.value)} placeholder="invitely.app/i/amaya-and-dinuka" required autoCapitalize="none" />
        </Field>
        <Field label="Edit PIN">
          <Input value={pin} onChange={(e) => setPin(e.target.value)} inputMode="numeric" autoComplete="off" placeholder="4 to 8 digits" required maxLength={8} />
        </Field>
        <Button type="submit" variant="secondary" disabled={pending}>{pending ? "Checking…" : "Open"}</Button>
      </form>
      {error ? <p role="alert" className="mt-3 text-sm text-red-700">{error}</p> : null}
    </Card>
  );
}

export function MyCards() {
  const [cards, setCards] = useState<InvitationSummary[] | null>(null);

  useEffect(() => {
    let alive = true;
    const tokens = getCardTokens();
    const load = tokens.length ? myCardsAction(tokens) : Promise.resolve([]);
    load.then((list) => alive && setCards(list)).catch(() => alive && setCards([]));
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="grid gap-6">
      {cards === null ? (
        <div className="grid gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-3" aria-hidden>
          {[0, 1].map((i) => (
            <div key={i} className="h-80 animate-pulse rounded-2xl border border-fg/10 bg-page-2" />
          ))}
        </div>
      ) : cards.length ? (
        <ul className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-3">
          {cards.map((inv) => (
            <li key={inv.id} className="grid grid-cols-1">
              <InvitationCard inv={inv} />
            </li>
          ))}
        </ul>
      ) : (
        <Card className="flex flex-col items-center px-6 py-12 text-center">
          <span className="grid size-16 place-items-center rounded-full border border-brand/30 bg-brand/10 text-brand">
            <MailOpen size={26} strokeWidth={1.5} aria-hidden />
          </span>
          <h2 className="display mt-6 text-4xl">No cards on this device yet</h2>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-fg/85">
            Pick a design, add your names and date, and your invitation will be ready to share in a few minutes.
          </p>
          <ButtonLink href="/templates" size="lg" className="mt-8">
            <Plus size={18} strokeWidth={1.5} aria-hidden /> Choose a design
          </ButtonLink>
        </Card>
      )}
      <FindCard />
    </div>
  );
}
