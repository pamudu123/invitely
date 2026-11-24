"use client";

import { ExternalLink, Rocket } from "lucide-react";
import { useState, useTransition } from "react";
import { publishAction, unpublishAction } from "@/app/actions/invitations";
import { Badge, Button, Card, buttonClass } from "@/components/ui/kit";
import { LinkField } from "./LinkField";

export function PublishPanel({ id, slug, published }: { id: string; slug: string; published: boolean }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<"payment" | string | null>(null);

  const publish = () => {
    setError(null);
    startTransition(async () => {
      try {
        const res = await publishAction(id);
        if (!res.ok) setError(res.error ?? "Something went wrong. Please try again.");
      } catch {
        setError("Something went wrong. Please try again.");
      }
    });
  };

  const unpublish = () => {
    setError(null);
    startTransition(async () => {
      try {
        await unpublishAction(id);
      } catch {
        setError("Something went wrong. Please try again.");
      }
    });
  };

  if (published) {
    return (
      <Card className="p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <p className="label text-paper/50">Publishing</p>
          <Badge tone="teal">
            <span aria-hidden className="size-1.5 rounded-full bg-teal" />
            Live
          </Badge>
        </div>
        <h2 className="display mt-4 text-3xl">Your invitation is live</h2>
        <p className="mt-3 text-sm leading-relaxed text-paper/60">Anyone with this link can open it and reply.</p>
        <LinkField slug={slug} className="mt-5" />
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <a href={`/i/${slug}`} target="_blank" rel="noopener" className={buttonClass("secondary", "md")}>
            Open invitation
            <ExternalLink size={15} strokeWidth={1.5} aria-hidden />
          </a>
          <Button type="button" variant="ghost" onClick={unpublish} disabled={pending}>
            {pending ? "One moment…" : "Unpublish"}
          </Button>
        </div>
        {error ? (
          <p role="alert" className="mt-4 rounded-xl border border-red-400/30 bg-red-400/10 px-3.5 py-2.5 text-sm text-red-200">
            {error}
          </p>
        ) : null}
      </Card>
    );
  }

  return (
    <Card className="border-flame/25 p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <p className="label text-flame">Publishing</p>
        <Badge>Draft</Badge>
      </div>
      <h2 className="display mt-4 text-3xl">Ready when you are</h2>
      <p className="mt-3 text-sm leading-relaxed text-paper/60">
        This invitation is a draft, so only you can see it. Publish it to switch on the public link, personal guest links and replies.
      </p>
      <Button type="button" size="lg" onClick={publish} disabled={pending} className="mt-6 w-full sm:w-auto">
        <Rocket size={18} strokeWidth={1.5} aria-hidden />
        {pending ? "Publishing…" : "Publish invitation"}
      </Button>
      {error === "payment" ? (
        <p role="alert" className="mt-4 rounded-xl border border-flame/30 bg-flame/10 px-3.5 py-3 text-sm leading-relaxed text-paper/85">
          We need to confirm your payment before this invitation can go live. Please contact support and we will get it published for you.
        </p>
      ) : error ? (
        <p role="alert" className="mt-4 rounded-xl border border-red-400/30 bg-red-400/10 px-3.5 py-2.5 text-sm text-red-200">
          {error}
        </p>
      ) : null}
    </Card>
  );
}
