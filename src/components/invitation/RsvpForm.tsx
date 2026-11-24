"use client";

import { Check, Minus, Plus } from "lucide-react";
import { useState } from "react";
import { formatLongDate } from "@/lib/invitation/time";
import { Divider } from "./ornaments";
import { Reveal } from "./Reveal";
import type { SectionProps } from "./sections";

export interface RsvpPayload {
  name: string;
  phone: string;
  attending: boolean;
  partySize: number;
  meal: string;
  answer: string;
  message: string;
}

export type RsvpHandler = (payload: RsvpPayload) => Promise<{ ok: boolean; error?: string }>;

export interface PriorRsvp {
  attending: boolean;
  partySize: number;
}

export function RsvpSection({
  data,
  labels,
  lang,
  guest,
  phase,
  onSubmit,
  prior,
}: SectionProps & { onSubmit: RsvpHandler; prior?: PriorRsvp | null }) {
  const cfg = data.rsvp;
  const maxSeats = Math.max(1, guest?.seats ?? cfg.maxPartySize ?? 1);
  const [name, setName] = useState(guest?.name ?? "");
  const [phone, setPhone] = useState("");
  const [attending, setAttending] = useState<boolean | null>(prior ? prior.attending : null);
  const [partySize, setPartySize] = useState(Math.min(prior?.partySize || 1, maxSeats));
  const [meal, setMeal] = useState(cfg.mealOptions[0] ?? "");
  const [answer, setAnswer] = useState("");
  const [message, setMessage] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done">(prior ? "done" : "idle");
  const [error, setError] = useState("");

  if (!cfg.enabled || phase === "after") return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (attending === null || !name.trim()) {
      setError(attending === null ? "Please choose a reply." : "Please enter your name.");
      return;
    }
    setError("");
    setState("sending");
    try {
      const res = await onSubmit({
        name: name.trim(),
        phone: phone.trim(),
        attending,
        partySize: attending ? partySize : 0,
        meal: attending && cfg.askMeal ? meal : "",
        answer: answer.trim(),
        message: message.trim(),
      });
      if (res.ok) setState("done");
      else {
        setError(res.error || "Something went wrong. Please try again.");
        setState("idle");
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setState("idle");
    }
  };

  const choice = (value: boolean, label: string) => (
    <button
      type="button"
      onClick={() => setAttending(value)}
      aria-pressed={attending === value}
      className="flex min-h-[3.4rem] flex-1 items-center justify-center gap-2 border px-3 text-center transition-colors"
      style={{
        borderColor: attending === value ? "var(--inv-accent)" : "var(--inv-line)",
        background: attending === value ? "var(--inv-accent)" : "transparent",
        color: attending === value ? "var(--inv-bg)" : "var(--inv-ink)",
        fontFamily: "var(--inv-font-heading)",
        fontSize: "1.02rem",
        lineHeight: 1.2,
      }}
    >
      {attending === value ? <Check size={16} /> : null}
      {label}
    </button>
  );

  return (
    <section className="inv-section" id="rsvp">
      <div className="inv-inner">
        <Reveal className="mb-8 text-center">
          <p className="inv-eyebrow mb-3">RSVP</p>
          <h2 className="inv-heading">{labels.rsvp}</h2>
          <Divider kind={data.theme.ornament} className="mx-auto mt-5 w-40" style={{ color: "var(--inv-accent)" }} />
          {cfg.deadline ? (
            <p className="inv-kicker mt-5" style={{ color: "var(--inv-muted)" }} suppressHydrationWarning>
              {labels.replyBy} {formatLongDate(cfg.deadline, lang)}
            </p>
          ) : null}
        </Reveal>

        <Reveal delay={100}>
          {state === "done" ? (
            <div className="inv-card px-6 py-10 text-center">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full" style={{ background: "var(--inv-accent)", color: "var(--inv-bg)" }}>
                <Check size={22} />
              </span>
              <p className="inv-heading mt-5" style={{ fontSize: "2rem" }}>{labels.thanks}</p>
              <p className="mt-2" style={{ color: "var(--inv-muted)" }}>
                {attending === false ? labels.replyDeclined : labels.replyReceived}
              </p>
              <button type="button" className="inv-btn mt-6" onClick={() => setState("idle")}>{labels.changeReply}</button>
            </div>
          ) : (
            <form onSubmit={submit} className="inv-card grid gap-4 px-5 py-6" noValidate>
              <label className="grid gap-1.5">
                <span className="inv-kicker" style={{ fontSize: "0.62rem", color: "var(--inv-muted)" }}>{labels.yourName}</span>
                <input className="inv-input" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" maxLength={80} required />
              </label>

              <div className="flex gap-2.5">
                {choice(true, labels.accept)}
                {choice(false, labels.decline)}
              </div>

              {attending ? (
                <>
                  {maxSeats > 1 ? (
                    <div className="flex items-center justify-between gap-3">
                      <span className="inv-kicker" style={{ fontSize: "0.62rem", color: "var(--inv-muted)" }}>{labels.partySize}</span>
                      <div className="flex items-center gap-1">
                        <button type="button" aria-label="Fewer" className="flex h-11 w-11 items-center justify-center border" style={{ borderColor: "var(--inv-line)" }} onClick={() => setPartySize((n) => Math.max(1, n - 1))}><Minus size={15} /></button>
                        <span className="inv-serif w-10 text-center text-2xl tabular-nums">{partySize}</span>
                        <button type="button" aria-label="More" className="flex h-11 w-11 items-center justify-center border" style={{ borderColor: "var(--inv-line)" }} onClick={() => setPartySize((n) => Math.min(maxSeats, n + 1))}><Plus size={15} /></button>
                      </div>
                    </div>
                  ) : null}
                  {cfg.askMeal && cfg.mealOptions.length ? (
                    <label className="grid gap-1.5">
                      <span className="inv-kicker" style={{ fontSize: "0.62rem", color: "var(--inv-muted)" }}>{labels.meal}</span>
                      <select className="inv-input" value={meal} onChange={(e) => setMeal(e.target.value)}>
                        {cfg.mealOptions.map((m) => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </label>
                  ) : null}
                  {cfg.customQuestion ? (
                    <label className="grid gap-1.5">
                      <span className="inv-kicker" style={{ fontSize: "0.62rem", color: "var(--inv-muted)" }}>{cfg.customQuestion}</span>
                      <input className="inv-input" value={answer} onChange={(e) => setAnswer(e.target.value)} maxLength={200} />
                    </label>
                  ) : null}
                </>
              ) : null}

              <label className="grid gap-1.5">
                <span className="inv-kicker" style={{ fontSize: "0.62rem", color: "var(--inv-muted)" }}>{labels.phone}</span>
                <input className="inv-input" type="tel" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" maxLength={30} />
              </label>

              {cfg.askMessage ? (
                <label className="grid gap-1.5">
                  <span className="inv-kicker" style={{ fontSize: "0.62rem", color: "var(--inv-muted)" }}>{labels.wishLabel}</span>
                  <textarea className="inv-input" rows={3} value={message} onChange={(e) => setMessage(e.target.value)} maxLength={400} style={{ resize: "vertical" }} />
                </label>
              ) : null}

              {error ? <p role="alert" className="text-sm" style={{ color: "#b3261e" }}>{error}</p> : null}

              <button type="submit" className="inv-btn inv-btn-solid w-full" disabled={state === "sending"} style={{ minHeight: "3.2rem" }}>
                {state === "sending" ? `${labels.sending}…` : labels.send}
              </button>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}
