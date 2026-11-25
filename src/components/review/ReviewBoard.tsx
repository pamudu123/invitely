"use client";

import { Check, MapPin, Trash2 } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { createPortal } from "react-dom";
import { confirmCardAction, pinDoneAction, reviewReadyAction, sendReviewAction } from "@/app/actions/reviews";
import { InvitationView } from "@/components/invitation/InvitationView";
import { Button, Card, PhoneFrame, Textarea } from "@/components/ui/kit";
import { sectionLabels } from "@/lib/invitation/occasions";
import type { InvitationData, SectionId } from "@/lib/invitation/types";

export interface PinView {
  id: string;
  section: string;
  x: number;
  y: number;
  context: string;
  comment: string;
  done: boolean;
}

export interface RoundView {
  id: string;
  round: number;
  status: "open" | "ready" | "closed";
  note: string;
  pins: PinView[];
  reply: string;
}

export function sectionName(id: string): string {
  if (id === "cover") return "Cover";
  if (id === "footer") return "Footer";
  return sectionLabels[id as SectionId]?.label ?? id;
}

/** Pin colours: new notes are royal blue, sent ones lilac, finished ones mint. */
function pinTone(p: PinView, kind: "new" | "sent") {
  if (p.done) return { background: "#a9fbe4", color: "#0f1c5c" };
  return kind === "sent" ? { background: "#d6ccff", color: "#0f1c5c" } : { background: "#2740c9", color: "#ffffff" };
}

function usePhoneWidth() {
  const [w, setW] = useState(320);
  useEffect(() => {
    const update = () => setW(Math.round(Math.max(250, Math.min(360, window.innerWidth - 48, (window.innerHeight - 190) * (390 / 844)))));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return w;
}

/**
 * The card in a phone, with numbered pins on it.
 * Host mode: tap anywhere to drop a pin and say what should change, then send the list to the team.
 * Team mode: see the host's pins, tick them off and tell the host the card is ready.
 */
export function ReviewBoard({
  mode,
  data,
  token = "",
  status,
  rounds,
  studioHref,
}: {
  mode: "host" | "team";
  data: InvitationData;
  token?: string;
  status: "none" | "requested" | "ready" | "confirmed";
  rounds: RoundView[];
  studioHref?: string;
}) {
  const width = usePhoneWidth();
  const [root, setRoot] = useState<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(0);
  const [pins, setPins] = useState<PinView[]>([]);
  const [active, setActive] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [reply, setReply] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  const open = rounds.find((r) => r.status === "open");
  const ready = rounds.find((r) => r.status === "ready");
  const confirmed = status === "confirmed";
  const canPin = mode === "host" && !confirmed;
  // Pins already sent are shown too, so the host does not mark the same thing twice.
  const sent = mode === "team" ? (open ?? rounds[0])?.pins ?? [] : open?.pins ?? [];
  const teamRound = mode === "team" ? open ?? rounds[0] : undefined;

  // The card's sections exist only after it has rendered, so pins are placed on a second pass.
  useEffect(() => {
    if (!root) return;
    const t = window.setTimeout(() => setMounted((n) => n + 1), 60);
    return () => window.clearTimeout(t);
  }, [root, data]);

  const place = (e: React.MouseEvent) => {
    if (!canPin) return;
    e.preventDefault();
    e.stopPropagation();
    const target = e.target as HTMLElement;
    if (target.closest("[data-pin]")) return;
    const section = target.closest<HTMLElement>("[data-section]");
    if (!section) return;
    const rect = section.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const id = Math.random().toString(36).slice(2, 10);
    const context = (target.innerText || target.getAttribute("alt") || "").replace(/\s+/g, " ").trim().slice(0, 120);
    setPins((list) => [
      ...list,
      { id, section: section.dataset.section ?? "cover", x: (e.clientX - rect.left) / rect.width, y: (e.clientY - rect.top) / rect.height, context, comment: "", done: false },
    ]);
    setActive(id);
    setMessage("");
  };

  const update = (id: string, comment: string) => setPins((list) => list.map((p) => (p.id === id ? { ...p, comment } : p)));
  const remove = (id: string) => {
    setPins((list) => list.filter((p) => p.id !== id));
    setActive(null);
  };

  const send = () => {
    setError("");
    const filled = pins.filter((p) => p.comment.trim());
    start(async () => {
      const res = await sendReviewAction(token, note, filled);
      if (res.ok) {
        setPins([]);
        setNote("");
        setActive(null);
        setMessage("Sent. We will make the changes and let you know here when your card is ready to check.");
      } else setError(res.error ?? "Could not send. Please try again.");
    });
  };

  const marker = (p: PinView, n: number, kind: "new" | "sent") => {
    const host = root?.querySelector<HTMLElement>(`[data-section="${p.section}"]`);
    if (!host) return null;
    const on = active === p.id;
    return createPortal(
      <button
        key={p.id}
        type="button"
        data-pin={p.id}
        onClick={(e) => {
          e.stopPropagation();
          if (kind === "new") setActive(p.id);
        }}
        aria-label={`Note ${n}`}
        style={{
          position: "absolute",
          left: `${p.x * 100}%`,
          top: `${p.y * 100}%`,
          transform: "translate(-50%, -50%)",
          width: 34,
          height: 34,
          borderRadius: "50%",
          zIndex: 28,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          font: "600 15px/1 system-ui, sans-serif",
          ...pinTone(p, kind),
          border: on ? "3px solid #a9fbe4" : `2px solid ${kind === "new" && !p.done ? "#ffffff" : "#0f1c5c"}`,
          boxShadow: "0 0 0 1px rgba(15,28,92,0.5), 0 4px 14px rgba(15,28,92,0.45)",
          cursor: "pointer",
        }}
      >
        {p.done ? "✓" : n}
      </button>,
      host,
      p.id,
    );
  };

  const activePin = pins.find((p) => p.id === active);
  const editor = activePin ? (
    <div className="grid grid-cols-1 gap-2">
      <p className="label text-brand">
        Note {sent.length + pins.indexOf(activePin) + 1} · {sectionName(activePin.section)}
      </p>
      {activePin.context ? <p className="truncate text-[0.8rem] italic text-fg/85">“{activePin.context}”</p> : null}
      <Textarea
        rows={3}
        autoFocus
        value={activePin.comment}
        maxLength={600}
        placeholder="What should change here?"
        onChange={(e) => update(activePin.id, e.target.value)}
      />
      <div className="flex gap-2">
        <Button size="sm" onClick={() => setActive(null)} className="flex-1">Done</Button>
        <Button size="sm" variant="danger" onClick={() => remove(activePin.id)} aria-label="Remove this note">
          <Trash2 size={15} />
        </Button>
      </div>
    </div>
  ) : null;

  const pinRow = (p: PinView, n: number, kind: "new" | "sent") => (
    <li key={p.id} className="flex gap-3 rounded-xl border border-fg/10 bg-page-3/40 p-3">
      <span
        className="grid size-7 shrink-0 place-items-center rounded-full text-[0.8rem] font-semibold"
        style={pinTone(p, kind)}
      >
        {p.done ? "✓" : n}
      </span>
      <div className="min-w-0 flex-1">
        <p className="label !text-[0.75rem] text-fg/85">{sectionName(p.section)}</p>
        {p.context ? <p className="truncate text-[0.76rem] italic text-fg/85">“{p.context}”</p> : null}
        <p className="mt-0.5 whitespace-pre-wrap text-[0.9rem] leading-snug text-fg/90">{p.comment || "Tap to write what should change"}</p>
      </div>
      {kind === "new" ? (
        <button type="button" onClick={() => setActive(p.id)} className="shrink-0 self-start text-[0.78rem] text-brand hover:underline">Edit</button>
      ) : mode === "team" && teamRound ? (
        <button
          type="button"
          aria-label={p.done ? "Mark as not done" : "Mark as done"}
          onClick={() => start(() => pinDoneAction(teamRound.id, p.id, !p.done))}
          className={`grid size-8 shrink-0 place-items-center self-start rounded-lg border ${p.done ? "border-aqua bg-aqua/15 text-aqua" : "border-fg/50 text-fg/85"}`}
        >
          <Check size={15} />
        </button>
      ) : null}
    </li>
  );

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[auto_1fr] [&>*]:min-w-0">
      {/* The card */}
      <div className="flex flex-col items-center">
        {canPin ? (
          <p className="mb-4 flex items-center gap-2 text-sm text-fg/85">
            <MapPin size={15} className="text-brand" /> Tap anywhere on your card to mark a change
          </p>
        ) : null}
        <div ref={setRoot} onClickCapture={place} style={{ cursor: canPin ? "crosshair" : "default" }}>
          <PhoneFrame width={width}>
            <InvitationView data={data} embedded skipRitual lite />
          </PhoneFrame>
        </div>
        {mounted ? sent.map((p, i) => marker(p, i + 1, "sent")) : null}
        {mounted ? pins.map((p, i) => marker(p, sent.length + i + 1, "new")) : null}
      </div>

      {/* Notes */}
      <div className="grid grid-cols-1 content-start gap-5">
        {mode === "host" && ready ? (
          <Card className="!border-aqua/40 bg-aqua/5 p-5">
            <p className="label text-aqua">Ready for you to check</p>
            <h2 className="mt-2 font-serif text-2xl">We have made your changes.</h2>
            {ready.reply ? <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-fg/90">{ready.reply}</p> : null}
            <p className="mt-3 text-sm text-fg/85">Look through the card on the left. If something is still not right, mark it and send it again.</p>
            <Button className="mt-4 w-full" disabled={pending} onClick={() => start(async () => { await confirmCardAction(token); })}>
              <Check size={16} /> It is perfect, confirm my card
            </Button>
          </Card>
        ) : null}

        {mode === "host" && confirmed ? (
          <Card className="!border-aqua/40 bg-aqua/5 p-5">
            <p className="label text-aqua">Confirmed</p>
            <h2 className="mt-2 font-serif text-2xl">Your card is final.</h2>
            <p className="mt-2 text-sm leading-relaxed text-fg/85">You confirmed this card, so review requests are closed. You can still edit it yourself in the studio.</p>
          </Card>
        ) : null}

        {mode === "host" && status === "requested" && !pins.length ? (
          <Card className="p-5">
            <p className="label text-brand">With our team</p>
            <p className="mt-2 text-sm leading-relaxed text-fg/90">Your notes are with us. You can add more below, and they will join the same list.</p>
          </Card>
        ) : null}

        {editor ? <Card className="hidden p-4 lg:block">{editor}</Card> : null}

        {canPin ? (
          <Card className="grid grid-cols-1 gap-4 p-5">
            <div>
              <p className="label text-brand">Your notes</p>
              <p className="mt-1.5 text-sm text-fg/85">
                {pins.length ? "Check your notes, then send them to our team." : "Nothing marked yet. Tap the card where you want something changed."}
              </p>
            </div>
            {pins.length ? <ul className="grid grid-cols-1 gap-2">{pins.map((p, i) => pinRow(p, sent.length + i + 1, "new"))}</ul> : null}
            <Textarea rows={3} value={note} maxLength={1500} onChange={(e) => setNote(e.target.value)} placeholder="Anything else? For example: please make the whole card feel more traditional." aria-label="General note" />
            {error ? <p role="alert" className="text-sm text-red-700">{error}</p> : null}
            {message ? <p role="status" className="text-sm text-aqua">{message}</p> : null}
            <Button onClick={send} disabled={pending || (!pins.some((p) => p.comment.trim()) && !note.trim())}>
              {pending ? "Sending…" : "Send for review"}
            </Button>
            <p className="text-[0.78rem] leading-snug text-fg/85">You can send for review as many times as you need until you confirm the card.</p>
          </Card>
        ) : null}

        {mode === "team" && teamRound ? (
          <Card className="grid grid-cols-1 gap-4 p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="label text-brand">Round {teamRound.round} · {teamRound.status === "open" ? "to do" : teamRound.status}</p>
              {studioHref ? <a href={studioHref} target="_blank" rel="noopener" className="text-sm text-brand underline-offset-4 hover:underline">Open in studio</a> : null}
            </div>
            {teamRound.note ? <p className="whitespace-pre-wrap rounded-xl border border-fg/10 bg-page-3/40 p-3 text-sm text-fg/90">{teamRound.note}</p> : null}
            {teamRound.pins.length ? <ul className="grid grid-cols-1 gap-2">{teamRound.pins.map((p, i) => pinRow(p, i + 1, "sent"))}</ul> : <p className="text-sm text-fg/85">No pins in this round.</p>}
            {teamRound.status === "open" ? (
              <>
                <Textarea rows={3} value={reply} maxLength={1500} onChange={(e) => setReply(e.target.value)} placeholder="Message to the host, for example: All done. We also aligned the schedule times." aria-label="Reply to the host" />
                <Button disabled={pending} onClick={() => start(async () => { await reviewReadyAction(teamRound.id, reply); setReply(""); })}>
                  Changes made, ask the host to check
                </Button>
              </>
            ) : teamRound.reply ? (
              <p className="text-sm text-fg/85">Your reply: {teamRound.reply}</p>
            ) : null}
          </Card>
        ) : null}

        {mode === "team" && !teamRound ? <Card className="p-5 text-sm text-fg/85">This card has no review requests.</Card> : null}

        {mode === "host" && open && open.pins.length ? (
          <Card className="grid grid-cols-1 gap-3 p-5">
            <p className="label text-fg/85">Already sent</p>
            <ul className="grid grid-cols-1 gap-2">{open.pins.map((p, i) => pinRow(p, i + 1, "sent"))}</ul>
          </Card>
        ) : null}

        {rounds.filter((r) => r.status === "closed").length ? (
          <details className="rounded-2xl border border-fg/10 bg-page-2 p-5">
            <summary className="label cursor-pointer text-fg/85">Earlier rounds</summary>
            <ul className="mt-3 grid gap-3">
              {rounds.filter((r) => r.status === "closed").map((r) => (
                <li key={r.id} className="text-sm text-fg/85">
                  <span className="text-fg/90">Round {r.round}</span>: {r.pins.length} notes{r.reply ? `. Reply: ${r.reply}` : ""}
                </li>
              ))}
            </ul>
          </details>
        ) : null}
      </div>

      {/* Phone: the comment box rises from the bottom when a pin is dropped */}
      {editor ? (
        <div className="fixed inset-x-0 bottom-0 z-[70] rounded-t-3xl border-t border-fg/15 bg-page-2 p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] shadow-[0_-20px_60px_color-mix(in_srgb,var(--color-fg)_35%,transparent)] lg:hidden">
          {editor}
        </div>
      ) : null}
    </div>
  );
}
