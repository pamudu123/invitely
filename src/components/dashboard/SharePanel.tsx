"use client";

import { Download, MessageCircle, Users } from "lucide-react";
import Link from "next/link";
import { create, toDataURL } from "qrcode";
import { useMemo, useState } from "react";
import { Button, ButtonLink, Card, buttonClass } from "@/components/ui/kit";
import { LinkField } from "./LinkField";
import { publicLink, useOrigin } from "./links";

const QUIET = 3;

/** Draws the code as one SVG path, so it stays sharp at any size. */
function QrCode({ value, label }: { value: string; label: string }) {
  const qr = useMemo(() => {
    try {
      const { modules } = create(value, { errorCorrectionLevel: "M" });
      let d = "";
      for (let y = 0; y < modules.size; y++) {
        for (let x = 0; x < modules.size; x++) {
          if (modules.get(y, x)) d += `M${x + QUIET} ${y + QUIET}h1v1h-1z`;
        }
      }
      return { d, size: modules.size + QUIET * 2 };
    } catch {
      return null;
    }
  }, [value]);

  if (!qr) return <p className="p-6 text-center text-sm text-ink-2">This link is too long for a QR code.</p>;
  return (
    <svg viewBox={`0 0 ${qr.size} ${qr.size}`} role="img" aria-label={label} shapeRendering="crispEdges" className="block size-full">
      <path d={qr.d} fill="#060b0b" />
    </svg>
  );
}

export function SharePanel({
  invitationId,
  slug,
  title,
  published,
}: {
  invitationId: string;
  slug: string;
  title: string;
  published: boolean;
}) {
  const origin = useOrigin();
  const link = origin ? publicLink(origin, slug) : "";
  const [downloadError, setDownloadError] = useState(false);

  const download = async () => {
    if (!link) return;
    setDownloadError(false);
    try {
      const url = await toDataURL(link, {
        width: 1024,
        margin: QUIET,
        errorCorrectionLevel: "M",
        color: { dark: "#060b0bff", light: "#ffffffff" },
      });
      const a = document.createElement("a");
      a.href = url;
      a.download = `${slug}-qr.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch {
      setDownloadError(true);
    }
  };

  const message = `You are invited to celebrate with ${title}. Open the invitation here: ${link}`;

  return (
    <div className="grid grid-cols-1 gap-5">
      {!published ? (
        <Card className="flex flex-col gap-4 border-flame/25 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <p className="label text-flame">Still a draft</p>
            <p className="mt-2.5 text-sm leading-relaxed text-paper/70">
              Guests cannot open this link yet. Publish the invitation first, then come back here to share it.
            </p>
          </div>
          <ButtonLink href={`/dashboard/${invitationId}?tab=overview`} className="shrink-0">
            Go to publishing
          </ButtonLink>
        </Card>
      ) : null}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="grid min-w-0 grid-cols-1 content-start gap-5">
          <Card className="p-5 sm:p-6">
            <p className="label text-paper/50">Public link</p>
            <h2 className="display mt-3 text-3xl">One link for everyone</h2>
            <p className="mt-3 text-sm leading-relaxed text-paper/60">
              Post it in a family group or add it to your social profiles. Anyone who opens it can view the invitation and reply.
            </p>
            <LinkField slug={slug} className="mt-5" />
            <a
              href={link ? `https://wa.me/?text=${encodeURIComponent(message)}` : undefined}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClass("secondary", "md", "mt-3 w-full sm:w-auto")}
            >
              <MessageCircle size={17} strokeWidth={1.5} aria-hidden />
              Share on WhatsApp
            </a>
          </Card>

          <Card className="flex items-start gap-4 p-5 sm:p-6">
            <span className="grid size-11 shrink-0 place-items-center rounded-full border border-paper/15 text-flame">
              <Users size={19} strokeWidth={1.5} aria-hidden />
            </span>
            <div>
              <p className="text-[0.95rem] font-medium text-paper">Looking for personal links?</p>
              <p className="mt-1.5 text-sm leading-relaxed text-paper/60">
                Links that greet each guest by name and reserve their seats live in the{" "}
                <Link href={`/dashboard/${invitationId}?tab=guests`} className="text-flame underline-offset-4 hover:underline">
                  Guests tab
                </Link>
                .
              </p>
            </div>
          </Card>
        </div>

        <Card className="p-5 sm:p-6">
          <p className="label text-paper/50">QR code</p>
          <div className="mx-auto mt-5 aspect-square w-full max-w-64 overflow-hidden rounded-2xl bg-white">
            {link ? <QrCode value={link} label={`QR code for ${title}`} /> : <div className="size-full animate-pulse bg-paper-2" />}
          </div>
          <p className="mt-5 text-sm leading-relaxed text-paper/60">
            Print it on a card or show it on a screen at the venue. Scanning it opens the public link.
          </p>
          <Button type="button" variant="secondary" onClick={download} disabled={!link} className="mt-4 w-full">
            <Download size={16} strokeWidth={1.5} aria-hidden />
            Download QR
          </Button>
          {downloadError ? (
            <p role="alert" className="mt-3 text-sm text-red-300">
              We could not create the image. Please try again.
            </p>
          ) : null}
        </Card>
      </div>
    </div>
  );
}
