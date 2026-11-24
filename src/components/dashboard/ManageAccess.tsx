"use client";

import { KeyRound, MessageCircle, ShieldCheck } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { setPinAction } from "@/app/actions/invitations";
import { CopyButton } from "@/components/dashboard/CopyButton";
import { useOrigin, whatsappUrl } from "@/components/dashboard/links";
import { Button, Card, Input, buttonClass } from "@/components/ui/kit";
import { rememberCard } from "@/lib/client/cards";

/** Remembers this card on the device, so it shows under My cards next time. */
export function RememberCard({ token }: { token: string }) {
  useEffect(() => {
    rememberCard(token);
  }, [token]);
  return null;
}

/**
 * The host's way back in. There is no account, so this card explains the private
 * manage link and lets the host set an edit PIN for other devices.
 */
export function ManageAccess({
  token,
  slug,
  title,
  hasPin,
  highlight = false,
}: {
  token: string;
  slug: string;
  title: string;
  hasPin: boolean;
  highlight?: boolean;
}) {
  const origin = useOrigin();
  const link = `${origin}/m/${token}`;
  const [pin, setPin] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(!hasPin);
  const [pending, start] = useTransition();

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    start(async () => {
      const res = await setPinAction(token, pin);
      if (res.ok) {
        setPin("");
        setEditing(false);
        setMessage("PIN saved.");
      } else setError(res.error ?? "Could not save the PIN.");
    });
  };

  return (
    <Card className={`p-5 sm:p-6 ${highlight ? "!border-brand/50 bg-gradient-to-b from-brand/10 to-transparent" : ""}`}>
      <div className="flex items-start gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-full border border-brand/30 bg-brand/10 text-brand">
          <ShieldCheck size={19} strokeWidth={1.5} aria-hidden />
        </span>
        <div className="min-w-0">
          <p className="label text-brand">{highlight ? "Save this first" : "Your way back in"}</p>
          <h2 className="mt-1.5 font-serif text-2xl leading-tight">Your private manage link</h2>
          <p className="mt-2 text-sm leading-relaxed text-fg/85">
            There is no account or password. This link is the key to your card, so keep it to yourself. Anyone who has it can
            edit the card and see your guest list.
          </p>
        </div>
      </div>

      <div className="mt-5 truncate rounded-xl border border-fg/10 bg-page-3/60 px-3.5 py-3 font-mono text-[0.78rem] text-fg/90" suppressHydrationWarning>
        {link}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <CopyButton text={link} label="Copy manage link" className="flex-1 sm:flex-none" />
        <a
          href={whatsappUrl("", `My Invitely manage link for ${title}. Keep private: ${link}`)}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClass("secondary", "md", "flex-1 sm:flex-none")}
        >
          <MessageCircle size={16} strokeWidth={1.5} aria-hidden /> Send to my WhatsApp
        </a>
      </div>

      <div className="mt-6 border-t border-fg/10 pt-5">
        <div className="flex items-center gap-2 text-sm text-fg/90">
          <KeyRound size={16} strokeWidth={1.5} aria-hidden className="text-brand" />
          {hasPin ? "Edit PIN is set" : "No edit PIN yet"}
        </div>
        <p className="mt-1.5 text-sm leading-relaxed text-fg/85">
          With the PIN you can open this card on any phone from My cards, using your invitation link
          <span className="whitespace-nowrap font-mono text-[0.78rem] text-fg/90"> /i/{slug}</span>.
        </p>
        {editing ? (
          <form onSubmit={save} className="mt-3 flex gap-2">
            <Input
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              inputMode="numeric"
              autoComplete="off"
              maxLength={8}
              placeholder="4 to 8 digits"
              aria-label="Edit PIN"
              className="max-w-44"
              required
            />
            <Button type="submit" variant="secondary" disabled={pending}>{pending ? "Saving…" : "Save PIN"}</Button>
          </form>
        ) : (
          <button type="button" onClick={() => setEditing(true)} className="mt-3 text-sm text-brand underline-offset-4 hover:underline">
            Change PIN
          </button>
        )}
        {message ? <p className="mt-2 text-sm text-aqua">{message}</p> : null}
        {error ? <p role="alert" className="mt-2 text-sm text-red-700">{error}</p> : null}
      </div>
    </Card>
  );
}
