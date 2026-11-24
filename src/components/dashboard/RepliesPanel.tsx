"use client";

import { Download, Eye, EyeOff, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { deleteRsvpAction, hideWishAction } from "@/app/actions/guests";
import { Badge, Button, Card, buttonClass } from "@/components/ui/kit";
import { ConfirmDialog } from "./Dialog";
import { formatWhen, plural } from "./format";

export interface ReplyRow {
  id: string;
  name: string;
  phone: string;
  attending: boolean;
  partySize: number;
  meal: string;
  answer: string;
  message: string;
  hidden: boolean;
  updatedAt: number;
}

type Filter = "all" | "yes" | "no";

function WishToggle({ invitationId, reply }: { invitationId: string; reply: ReplyRow }) {
  const [pending, startTransition] = useTransition();
  const toggle = () =>
    startTransition(async () => {
      try {
        await hideWishAction(invitationId, reply.id, !reply.hidden);
      } catch {
        // The list simply stays as it was.
      }
    });
  return (
    <Button type="button" variant="secondary" onClick={toggle} disabled={pending} aria-pressed={reply.hidden} className="!px-4">
      {reply.hidden ? <Eye size={16} strokeWidth={1.5} aria-hidden /> : <EyeOff size={16} strokeWidth={1.5} aria-hidden />}
      {pending ? "One moment…" : reply.hidden ? "Show on wishes wall" : "Hide from wishes wall"}
    </Button>
  );
}

export function RepliesPanel({
  invitationId,
  replies,
  timeZone,
  question,
}: {
  invitationId: string;
  replies: ReplyRow[];
  timeZone: string;
  /** The host's extra question, shown as the label for each answer */
  question: string;
}) {
  const [filter, setFilter] = useState<Filter>("all");
  const [removing, setRemoving] = useState<ReplyRow | null>(null);
  const [deleting, startDelete] = useTransition();

  const yes = replies.filter((r) => r.attending).length;
  const filters: { id: Filter; label: string; count: number }[] = [
    { id: "all", label: "All", count: replies.length },
    { id: "yes", label: "Attending", count: yes },
    { id: "no", label: "Declined", count: replies.length - yes },
  ];
  const shown = replies.filter((r) => (filter === "all" ? true : filter === "yes" ? r.attending : !r.attending));

  const confirmDelete = () => {
    if (!removing) return;
    const target = removing;
    startDelete(async () => {
      try {
        await deleteRsvpAction(invitationId, target.id);
      } finally {
        setRemoving(null);
      }
    });
  };

  if (!replies.length) {
    return (
      <Card className="px-6 py-14 text-center">
        <h2 className="display text-3xl">No replies yet</h2>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-paper/60">
          Replies appear here the moment a guest responds. Share your link to get things started.
        </p>
      </Card>
    );
  }

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div role="group" aria-label="Filter replies" className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          {filters.map((f) => {
            const on = filter === f.id;
            return (
              <button
                key={f.id}
                type="button"
                aria-pressed={on}
                onClick={() => setFilter(f.id)}
                className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border px-4 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-flame/60 ${
                  on ? "border-flame/50 bg-flame/10 text-flame" : "border-paper/15 text-paper/65 hover:border-paper/35 hover:text-paper"
                }`}
              >
                {f.label}
                <span className="font-mono text-[0.72rem] opacity-70">{f.count}</span>
              </button>
            );
          })}
        </div>
        <a href={`/api/invitations/${invitationId}/export`} download className={buttonClass("secondary", "md", "shrink-0")}>
          <Download size={16} strokeWidth={1.5} aria-hidden />
          Export CSV
        </a>
      </div>

      {shown.length ? (
        <ul className="grid grid-cols-1 gap-3">
          {shown.map((r) => (
            <li key={r.id}>
              <Card className="p-4 sm:p-5">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 py-1">
                    <p className="break-words text-[1.02rem] font-medium text-paper">{r.name}</p>
                    <ul className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-[0.82rem] text-paper/55 [&>li]:whitespace-nowrap">
                      {r.attending ? <li>{plural(r.partySize, "guest", "guests")}</li> : null}
                      {r.attending && r.meal ? <li className="!whitespace-normal">{r.meal}</li> : null}
                      {r.phone ? <li>{r.phone}</li> : null}
                      <li>
                        <time dateTime={new Date(r.updatedAt).toISOString()}>{formatWhen(r.updatedAt, timeZone)}</time>
                      </li>
                    </ul>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <Badge tone={r.attending ? "teal" : "red"}>{r.attending ? "Attending" : "Declined"}</Badge>
                    <button
                      type="button"
                      onClick={() => setRemoving(r)}
                      aria-label={`Delete reply from ${r.name}`}
                      title="Delete reply"
                      className="-mr-2 grid size-11 place-items-center rounded-full text-paper/50 outline-none transition-colors hover:bg-red-400/10 hover:text-red-300 focus-visible:ring-2 focus-visible:ring-flame/60"
                    >
                      <Trash2 size={17} strokeWidth={1.5} aria-hidden />
                    </button>
                  </div>
                </div>

                {r.answer ? (
                  <p className="mt-3 break-words text-sm leading-relaxed text-paper/80 [overflow-wrap:anywhere]">
                    <span className="text-paper/45">{question || "Answer"}: </span>
                    {r.answer}
                  </p>
                ) : null}

                {r.message ? (
                  <blockquote
                    className={`mt-3 whitespace-pre-line break-words border-l-2 [overflow-wrap:anywhere] pl-3.5 font-serif text-[1.15rem] leading-snug ${
                      r.hidden ? "border-paper/15 text-paper/40" : "border-flame/50 text-paper/90"
                    }`}
                  >
                    {r.message}
                  </blockquote>
                ) : null}

                {r.message ? (
                  <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
                    <WishToggle invitationId={invitationId} reply={r} />
                    <span className="text-xs text-paper/45">{r.hidden ? "Hidden from guests" : "Showing on the wishes wall"}</span>
                  </div>
                ) : null}
              </Card>
            </li>
          ))}
        </ul>
      ) : (
        <Card className="px-6 py-10 text-center text-sm text-paper/55">No replies in this view yet.</Card>
      )}

      <ConfirmDialog
        open={removing !== null}
        onClose={() => setRemoving(null)}
        onConfirm={confirmDelete}
        pending={deleting}
        title="Delete this reply?"
        confirmLabel="Delete reply"
        body={
          <>
            The reply from <span className="text-paper">{removing?.name}</span> will be removed for good, along with any message on the
            wishes wall. This cannot be undone.
          </>
        }
      />
    </div>
  );
}
