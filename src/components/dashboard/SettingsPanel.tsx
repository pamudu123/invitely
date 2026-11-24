"use client";

import { Trash2 } from "lucide-react";
import { useState, useTransition, type FormEvent } from "react";
import { changeSlugAction, deleteInvitationAction } from "@/app/actions/invitations";
import { Button, Card, Input } from "@/components/ui/kit";
import { bareHost, useOrigin } from "./links";

function SlugForm({ id, slug }: { id: string; slug: string }) {
  const origin = useOrigin();
  const [value, setValue] = useState(slug);
  const [note, setNote] = useState<{ tone: "ok" | "error"; text: string } | null>(null);
  const [pending, startTransition] = useTransition();

  const unchanged = value.trim() === slug;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setNote(null);
    startTransition(async () => {
      try {
        const res = await changeSlugAction(id, value);
        if (res.ok) {
          setValue(res.slug ?? value);
          setNote({ tone: "ok", text: "Link updated." });
        } else {
          setNote({ tone: "error", text: res.error ?? "That link could not be saved." });
        }
      } catch {
        setNote({ tone: "error", text: "Something went wrong. Please try again." });
      }
    });
  };

  return (
    <Card className="p-5 sm:p-6">
      <p className="label text-paper/50">Invitation link</p>
      <h2 className="display mt-3 text-3xl">Choose your link</h2>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-paper/60">
        Use lowercase letters, numbers and hyphens. If you have already shared the old link, it will stop working once you change it.
      </p>
      <form onSubmit={submit} className="mt-5 grid gap-3 sm:max-w-xl">
        <label className="grid gap-1.5">
          <span className="text-[0.78rem] font-medium text-paper/70">Link name</span>
          <span className="flex min-h-11 items-stretch overflow-hidden rounded-xl border border-paper/12 bg-night-3/70 transition-colors focus-within:border-flame/70">
            <span className="flex shrink-0 items-center border-r border-paper/10 px-3 font-mono text-[0.8rem] text-paper/45">
              <span className="hidden sm:inline">{origin ? bareHost(origin) : ""}</span>/i/
            </span>
            <Input
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                setNote(null);
              }}
              name="slug"
              maxLength={48}
              required
              autoComplete="off"
              autoCapitalize="none"
              spellCheck={false}
              aria-invalid={note?.tone === "error" ? true : undefined}
              className="!rounded-none !border-0 !bg-transparent font-mono !text-[0.88rem]"
            />
          </span>
        </label>
        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" disabled={pending || unchanged || !value.trim()}>
            {pending ? "Saving…" : "Save link"}
          </Button>
          <p role={note?.tone === "error" ? "alert" : "status"} className={`text-sm ${note?.tone === "error" ? "text-red-300" : "text-teal"}`}>
            {note?.text}
          </p>
        </div>
      </form>
    </Card>
  );
}

function DangerZone({ id, title }: { id: string; title: string }) {
  const [armed, setArmed] = useState(false);
  const [typed, setTyped] = useState("");
  const [failed, setFailed] = useState(false);
  const [pending, startTransition] = useTransition();
  const ready = typed.trim().toLowerCase() === "delete";

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!ready) return;
    setFailed(false);
    startTransition(async () => {
      try {
        await deleteInvitationAction(id);
      } catch (err) {
        // A redirect is reported as a thrown value. Anything else is a real failure.
        if (err && typeof err === "object" && "digest" in err && String(err.digest).startsWith("NEXT_REDIRECT")) throw err;
        setFailed(true);
      }
    });
  };

  return (
    <Card className="border-red-400/25 p-5 sm:p-6">
      <p className="label text-red-300">Danger zone</p>
      <h2 className="display mt-3 text-3xl">Delete this invitation</h2>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-paper/60">
        This removes <span className="text-paper">{title}</span>, its guest list and every reply for good. The link stops working straight
        away and none of it can be brought back.
      </p>
      {armed ? (
        <form onSubmit={submit} className="mt-5 grid gap-3 sm:max-w-md">
          <label className="grid gap-1.5">
            <span className="text-[0.78rem] font-medium text-paper/70">
              Type <span className="font-mono text-red-300">delete</span> to confirm
            </span>
            <Input
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              autoComplete="off"
              autoCapitalize="none"
              spellCheck={false}
              autoFocus
              className="focus:!border-red-400/60"
            />
          </label>
          <div className="flex flex-col-reverse gap-2.5 sm:flex-row">
            <Button
              type="button"
              variant="ghost"
              disabled={pending}
              onClick={() => {
                setArmed(false);
                setTyped("");
              }}
            >
              Keep invitation
            </Button>
            <Button type="submit" variant="danger" disabled={!ready || pending}>
              <Trash2 size={16} strokeWidth={1.5} aria-hidden />
              {pending ? "Deleting…" : "Delete for good"}
            </Button>
          </div>
          {failed ? (
            <p role="alert" className="text-sm text-red-300">
              Something went wrong. Please try again.
            </p>
          ) : null}
        </form>
      ) : (
        <Button type="button" variant="danger" onClick={() => setArmed(true)} className="mt-5">
          <Trash2 size={16} strokeWidth={1.5} aria-hidden />
          Delete invitation
        </Button>
      )}
    </Card>
  );
}

export function SettingsPanel({ id, slug, title }: { id: string; slug: string; title: string }) {
  return (
    <div className="grid grid-cols-1 gap-5">
      <SlugForm id={id} slug={slug} />
      <DangerZone id={id} title={title} />
    </div>
  );
}
