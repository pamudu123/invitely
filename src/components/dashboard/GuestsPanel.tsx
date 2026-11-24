"use client";

import { ClipboardCheck, MessageCircle, Pencil, Search, Trash2, UserPlus } from "lucide-react";
import Link from "next/link";
import { useState, useTransition, type FormEvent } from "react";
import { addGuestsAction, deleteGuestAction, updateGuestAction } from "@/app/actions/guests";
import { Badge, Button, Card, Field, Input, Textarea, buttonClass } from "@/components/ui/kit";
import { CopyButton } from "./CopyButton";
import { ConfirmDialog, Dialog } from "./Dialog";
import { plural } from "./format";
import { guestMessage, personalLink, useOrigin, whatsappUrl } from "./links";

export interface GuestRow {
  id: string;
  name: string;
  seats: number;
  token: string;
  table: string;
  phone: string;
  opened: boolean;
  checkedIn: boolean;
  /** Latest reply from this guest, if any */
  reply: "yes" | "no" | null;
}

const iconButton =
  "grid size-11 shrink-0 place-items-center rounded-full text-paper/55 outline-none transition-colors hover:bg-paper/5 hover:text-paper focus-visible:ring-2 focus-visible:ring-flame/60";

function AddGuests({ invitationId }: { invitationId: string }) {
  const [text, setText] = useState("");
  const [note, setNote] = useState<{ tone: "ok" | "error"; text: string } | null>(null);
  const [pending, startTransition] = useTransition();

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setNote(null);
    startTransition(async () => {
      try {
        const res = await addGuestsAction(invitationId, text);
        if (res.added > 0) {
          setText("");
          setNote({ tone: "ok", text: `${plural(res.added, "guest", "guests")} added.` });
        } else {
          setNote({ tone: "error", text: "We could not find any names in that list." });
        }
      } catch {
        setNote({ tone: "error", text: "Something went wrong. Please try again." });
      }
    });
  };

  return (
    <Card className="p-5 sm:p-6">
      <p className="label text-flame">Add guests</p>
      <form onSubmit={submit} className="mt-4 grid gap-3">
        <Field
          label="One guest or family per line"
          hint="After the name you can add seats, phone and table, separated by commas. Only the name is needed."
        >
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={5}
            spellCheck={false}
            placeholder={"Uncle Sunil & family, 4, 0771234567, Table 3\nNimali Perera, 2\nMr & Mrs Fernando"}
            className="font-mono !text-[0.85rem] leading-relaxed"
          />
        </Field>
        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" disabled={pending || !text.trim()}>
            <UserPlus size={17} strokeWidth={1.5} aria-hidden />
            {pending ? "Adding…" : "Add guests"}
          </Button>
          <p role="status" className={`text-sm ${note?.tone === "error" ? "text-red-300" : "text-teal"}`}>
            {note?.text}
          </p>
        </div>
      </form>
    </Card>
  );
}

function EditGuest({ invitationId, guest, onDone }: { invitationId: string; guest: GuestRow; onDone: () => void }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    if (!name) {
      setError("Please enter a name.");
      return;
    }
    setError("");
    startTransition(async () => {
      try {
        await updateGuestAction(invitationId, guest.id, {
          name,
          seats: Number(form.get("seats")) || 1,
          phone: String(form.get("phone") ?? "").trim(),
          table: String(form.get("table") ?? "").trim(),
        });
        onDone();
      } catch {
        setError("Something went wrong. Please try again.");
      }
    });
  };

  return (
    <form onSubmit={submit} className="grid gap-4">
      <Field label="Name">
        <Input name="name" defaultValue={guest.name} maxLength={80} required autoComplete="off" />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Seats">
          <Input name="seats" type="number" inputMode="numeric" min={1} max={20} defaultValue={guest.seats} required />
        </Field>
        <Field label="Table">
          <Input name="table" defaultValue={guest.table} maxLength={40} autoComplete="off" placeholder="Optional" />
        </Field>
      </div>
      <Field label="Phone" hint="Used for sharing on WhatsApp.">
        <Input name="phone" type="tel" defaultValue={guest.phone} maxLength={30} autoComplete="off" placeholder="0771234567" />
      </Field>
      {error ? (
        <p role="alert" className="text-sm text-red-300">
          {error}
        </p>
      ) : null}
      <div className="mt-2 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
        <Button type="button" variant="ghost" onClick={onDone} disabled={pending}>
          Cancel
        </Button>
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </form>
  );
}

export function GuestsPanel({
  invitationId,
  slug,
  published,
  guests,
}: {
  invitationId: string;
  slug: string;
  published: boolean;
  guests: GuestRow[];
}) {
  const origin = useOrigin();
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<GuestRow | null>(null);
  const [removing, setRemoving] = useState<GuestRow | null>(null);
  const [deleting, startDelete] = useTransition();

  const q = query.trim().toLowerCase();
  const shown = q
    ? guests.filter((g) => `${g.name} ${g.table} ${g.phone}`.toLowerCase().includes(q))
    : guests;
  const seats = guests.reduce((sum, g) => sum + g.seats, 0);

  const confirmDelete = () => {
    if (!removing) return;
    const target = removing;
    startDelete(async () => {
      try {
        await deleteGuestAction(invitationId, target.id);
      } finally {
        setRemoving(null);
      }
    });
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
        <div>
          <p className="label text-paper/50">Guest list</p>
          <h2 className="display mt-3 text-4xl">A link for every guest</h2>
          <p className="mt-4 text-sm leading-relaxed text-paper/60">
            Each guest or family gets a personal link. It greets them by name and reserves their seats, so replies land against the right
            people without anyone typing a thing.
          </p>
          {!published ? (
            <p className="mt-4 rounded-xl border border-flame/25 bg-flame/5 px-3.5 py-3 text-sm leading-relaxed text-paper/75">
              Personal links start working once you publish the invitation. You can build your list in the meantime.
            </p>
          ) : null}
          <Link href={`/m/${invitationId}/checkin`} className={buttonClass("secondary", "md", "mt-6")}>
            <ClipboardCheck size={17} strokeWidth={1.5} aria-hidden />
            Open door check-in
          </Link>
        </div>
        <AddGuests invitationId={invitationId} />
      </div>

      {guests.length ? (
        <section aria-label="Guests">
          <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-paper/60">
              {plural(guests.length, "guest", "guests")} · {plural(seats, "seat", "seats")}
              {q ? <span className="text-paper/40"> · showing {shown.length}</span> : null}
            </p>
            <label className="relative block sm:w-72">
              <span className="sr-only">Search guests</span>
              <Search size={16} strokeWidth={1.5} aria-hidden className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-paper/40" />
              <Input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, table or phone"
                className="!pl-10"
              />
            </label>
          </div>

          <Card className="overflow-hidden">
            {shown.length ? (
              <ul className="divide-y divide-paper/10">
                {shown.map((g) => {
                  const link = origin ? personalLink(origin, slug, g.token) : "";
                  return (
                    <li
                      key={g.id}
                      className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-2 gap-y-3 p-4 sm:px-5 md:grid-cols-[minmax(0,1fr)_auto_auto] md:items-center"
                    >
                      <div className="min-w-0 self-center">
                        <p className="break-words text-[0.98rem] font-medium text-paper">{g.name}</p>
                        <p className="mt-1 text-[0.82rem] text-paper/55">
                          {plural(g.seats, "seat", "seats")}
                          {g.table ? ` · ${g.table}` : ""}
                          {g.phone ? ` · ${g.phone}` : ""}
                        </p>
                        {g.opened || g.reply || g.checkedIn ? (
                          <div className="mt-2.5 flex flex-wrap gap-1.5">
                            {g.opened ? <Badge>Opened</Badge> : null}
                            {g.reply === "yes" ? <Badge tone="teal">Replied yes</Badge> : null}
                            {g.reply === "no" ? <Badge tone="red">Replied no</Badge> : null}
                            {g.checkedIn ? <Badge tone="flame">Checked in</Badge> : null}
                          </div>
                        ) : null}
                      </div>

                      <div className="flex items-start md:order-3 md:items-center">
                        <button type="button" className={iconButton} onClick={() => setEditing(g)} aria-label={`Edit ${g.name}`} title="Edit">
                          <Pencil size={17} strokeWidth={1.5} aria-hidden />
                        </button>
                        <button
                          type="button"
                          className={`${iconButton} hover:!text-red-300`}
                          onClick={() => setRemoving(g)}
                          aria-label={`Delete ${g.name}`}
                          title="Delete"
                        >
                          <Trash2 size={17} strokeWidth={1.5} aria-hidden />
                        </button>
                      </div>

                      <div className="col-span-2 flex gap-2 md:order-2 md:col-span-1">
                        <CopyButton text={link} className="flex-1 !px-4 md:flex-none" />
                        <a
                          href={link ? whatsappUrl(g.phone, guestMessage(g.name, link)) : undefined}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-disabled={link ? undefined : true}
                          aria-label={`Share with ${g.name} on WhatsApp`}
                          className={buttonClass("secondary", "md", "flex-1 !px-4 md:flex-none")}
                        >
                          <MessageCircle size={16} strokeWidth={1.5} aria-hidden />
                          WhatsApp
                        </a>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="px-5 py-10 text-center text-sm text-paper/55">No guests match that search.</p>
            )}
          </Card>
        </section>
      ) : (
        <Card className="px-6 py-12 text-center">
          <h3 className="display text-3xl">No guests yet</h3>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-paper/60">
            Paste your list above and every guest gets a personal link you can copy or send on WhatsApp.
          </p>
        </Card>
      )}

      <Dialog open={editing !== null} onClose={() => setEditing(null)} title="Edit guest">
        {editing ? <EditGuest key={editing.id} invitationId={invitationId} guest={editing} onDone={() => setEditing(null)} /> : null}
      </Dialog>

      <ConfirmDialog
        open={removing !== null}
        onClose={() => setRemoving(null)}
        onConfirm={confirmDelete}
        pending={deleting}
        title="Remove this guest?"
        confirmLabel="Remove guest"
        body={
          <>
            <span className="text-paper">{removing?.name}</span> will be removed from your list and their personal link will stop working. A
            reply they already sent stays in your replies.
          </>
        }
      />
    </div>
  );
}
