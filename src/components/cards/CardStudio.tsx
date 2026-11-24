"use client";

import { Download, FileDown, Scissors, Share2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { bareHost, useOrigin } from "@/components/dashboard/links";
import { Button, Card, Field, Select } from "@/components/ui/kit";
import { buildPdf, dataUrlToBlob, dataUrlToBytes, downloadBlob, renderFace, shareImage } from "@/lib/client/cardExport";
import {
  cardLayouts,
  defaultCardLayout,
  formatsFor,
  getCardLayout,
  getPrintDesign,
  printDesigns,
  printFormat,
  type CardFormat,
  type CardLayoutId,
} from "@/lib/invitation/cards";
import { getShape, shapeSegments, toPdfPath, toSvgPath, type ShapeId } from "@/lib/invitation/shapes";
import { displayNames } from "@/lib/invitation/templates";
import type { InvitationData } from "@/lib/invitation/types";
import { CardFace } from "./CardFace";

export interface CardGuest {
  id: string;
  name: string;
  seats: number;
  token: string;
}

/** Shows a card face at its real size, scaled to fit, and cut to its silhouette when it has one. */
function Scaled({
  format,
  max,
  shape,
  children,
  refTo,
}: {
  format: CardFormat;
  max: number;
  shape?: ShapeId;
  children: React.ReactNode;
  refTo?: React.Ref<HTMLDivElement>;
}) {
  const box = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(max);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(Math.min(max, entry.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, [max]);
  const scale = width / format.width;
  // The preview is cut on the trim line. The exported artwork keeps its bleed.
  const clip = shape
    ? `path(evenodd, "${toSvgPath(shapeSegments(shape, format.width - format.bleed * 2, format.height - format.bleed * 2, format.bleed))}")`
    : undefined;
  return (
    <div ref={box} className="w-full" style={{ maxWidth: max }}>
      <div className="relative" style={{ width, height: format.height * scale, filter: "drop-shadow(0 20px 28px rgba(15,28,92,0.34))" }}>
        <div
          ref={refTo}
          className="absolute left-0 top-0 origin-top-left"
          style={{ width: format.width, height: format.height, transform: `scale(${scale})`, clipPath: clip }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

const chip = (active: boolean) =>
  `rounded-xl border px-2 py-2.5 text-center text-[0.8rem] transition-colors ${
    active ? "border-brand bg-brand/10 text-fg shadow-[0_0_0_1px_var(--color-brand)]" : "border-fg/40 bg-page-2 text-fg/90 hover:border-fg/70"
  }`;

export function CardStudio({
  kind,
  data,
  slug,
  published,
  guests,
}: {
  kind: "image" | "print";
  data: InvitationData;
  slug: string;
  published: boolean;
  guests: CardGuest[];
}) {
  const origin = useOrigin();
  const isPrint = kind === "print";

  // Image card: a layout that follows the web design. Print card: a design from its own collection.
  const [layout, setLayout] = useState<CardLayoutId>(() => {
    const d = defaultCardLayout(data);
    return d;
  });
  const [designId, setDesignId] = useState(printDesigns[0].id);
  const design = getPrintDesign(designId);
  const orientation = getCardLayout(layout).orientation;

  const formats = useMemo(
    () => (isPrint ? design.sizes.map(printFormat) : formatsFor(orientation)),
    [isPrint, design, orientation],
  );
  const [formatId, setFormatId] = useState("");
  const format = formats.find((f) => f.id === formatId) ?? formats[0];

  const [guestId, setGuestId] = useState("");
  const [footer, setFooter] = useState<"link" | "qr" | "none">("link");
  const [busy, setBusy] = useState("");
  const [note, setNote] = useState("");
  const frontRef = useRef<HTMLDivElement | null>(null);
  const backRef = useRef<HTMLDivElement | null>(null);

  const guest = guests.find((g) => g.id === guestId);
  const link = `${origin}/i/${slug}${guest ? `?g=${guest.token}` : ""}`;
  const linkLabel = `${bareHost(origin)}/i/${slug}`;
  const base = `${slug}${guest ? `-${guest.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 24)}` : ""}`;
  const shape = isPrint ? design.shape : undefined;
  const face = {
    data,
    layout: isPrint ? design.face : layout,
    width: format.width,
    height: format.height,
    bleed: format.bleed,
    link,
    linkLabel,
    guest: guest ? { name: guest.name, seats: guest.seats } : undefined,
    ...(isPrint ? { shape: design.shape, tone: design.tone, density: design.density, scale: design.scale } : {}),
  };

  const run = async (label: string, job: () => Promise<void>) => {
    setBusy(label);
    setNote("");
    try {
      await job();
    } catch {
      setNote("Could not create the file. Please try again.");
    } finally {
      setBusy("");
    }
  };

  const node = (ref: React.RefObject<HTMLDivElement | null>) => {
    const el = ref.current?.firstElementChild as HTMLElement | null;
    if (!el) throw new Error("Card is not ready");
    return el;
  };

  const downloadPng = (ref: React.RefObject<HTMLDivElement | null>, name: string) =>
    run(name, async () => {
      const url = await renderFace(node(ref), format, "png");
      downloadBlob(dataUrlToBlob(url), `${base}-${isPrint ? `${design.id}-` : ""}${name}.png`);
    });

  const share = () =>
    run("share", async () => {
      const url = await renderFace(node(frontRef), format, "png");
      const blob = dataUrlToBlob(url);
      const ok = await shareImage(blob, `${base}.png`, `${displayNames(data)}: ${link}`);
      if (!ok) {
        downloadBlob(blob, `${base}-${format.id}.png`);
        setNote("This device cannot share pictures directly, so the image was downloaded.");
      }
    });

  const trimPx = { w: format.width - format.bleed * 2, h: format.height - format.bleed * 2 };

  const downloadPdf = () =>
    run("pdf", async () => {
      const [w, h] = format.trimPt ?? [360, 504];
      const bleedPt = (format.bleed / 100) * 72;
      const widthPt = w + bleedPt * 2;
      const heightPt = h + bleedPt * 2;
      const pages = [];
      for (const ref of [frontRef, backRef]) {
        const url = await renderFace(node(ref), format, "jpeg");
        pages.push({
          jpeg: dataUrlToBytes(url),
          pixelWidth: format.width * format.pixelRatio,
          pixelHeight: format.height * format.pixelRatio,
          widthPt,
          heightPt,
          bleedPt,
        });
      }
      const segments = shapeSegments(design.shape, trimPx.w, trimPx.h, format.bleed);
      const cut = {
        path: toPdfPath(segments, 0.72, heightPt),
        label: `CUT LINE. ${design.name}, ${format.label}. Pages 1 and 2 are the front and back with 3 mm bleed.`,
      };
      downloadBlob(buildPdf(pages, cut), `${base}-${design.id}-${format.id}.pdf`);
    });

  const downloadCutLine = () =>
    run("cut", async () => {
      const d = toSvgPath(shapeSegments(design.shape, trimPx.w, trimPx.h, format.bleed));
      const inches = (px: number) => (px / 100).toFixed(3);
      const svg = `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="${inches(format.width)}in" height="${inches(format.height)}in" viewBox="0 0 ${format.width} ${format.height}">\n  <path d="${d}" fill="none" stroke="#ff00ff" stroke-width="0.5"/>\n</svg>\n`;
      downloadBlob(new Blob([svg], { type: "image/svg+xml" }), `${base}-${design.id}-${format.id}-cut-line.svg`);
    });

  const wide = format.orientation === "landscape";

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[23rem_1fr] lg:grid-rows-[auto_1fr] lg:gap-x-8 [&>*]:min-w-0">
      {/* Choose a design. On a phone this sits above the preview as a swipeable row. */}
      <div className="grid grid-cols-1 content-start gap-5 lg:col-start-1 lg:row-start-1 [&>*]:min-w-0">
        {!published ? (
          <p className="rounded-xl border border-brand/40 bg-brand/10 px-4 py-3 text-sm leading-relaxed text-fg/90">
            Your web card is still a draft. Publish it before you {isPrint ? "print this, so the QR code" : "send this, so the link"} will open.
          </p>
        ) : null}

        <div>
          <p className="label text-brand">{isPrint ? "Card design" : "Design"}</p>
          {isPrint ? (
            <div className="no-scrollbar -mx-4 mt-3 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:grid lg:grid-cols-2 lg:px-0">
              {printDesigns.map((d) => (
                <button key={d.id} type="button" onClick={() => { setDesignId(d.id); setFormatId(""); }} aria-pressed={designId === d.id} className={`${chip(designId === d.id)} w-36 shrink-0 !px-3 !text-left lg:w-auto`}>
                  <span className="block text-fg">{d.name}</span>
                  <span className="block text-[0.75rem] text-fg/85">{getShape(d.shape).label}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="no-scrollbar -mx-4 mt-3 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:grid lg:grid-cols-3 lg:px-0">
              {cardLayouts.map((l) => (
                <button key={l.id} type="button" onClick={() => { setLayout(l.id); setFormatId(""); }} aria-pressed={layout === l.id} title={l.description} className={`${chip(layout === l.id)} w-28 shrink-0 lg:w-auto`}>
                  {l.name}
                </button>
              ))}
            </div>
          )}
          <p className="mt-2.5 text-[0.82rem] leading-snug text-fg/85">
            {isPrint ? `${design.meaning}. ${design.description}` : getCardLayout(layout).description}
          </p>
        </div>
      </div>

      {/* Options and downloads */}
      <div className="order-last grid grid-cols-1 content-start gap-5 lg:order-none lg:col-start-1 lg:row-start-2 [&>*]:min-w-0">

        {formats.length > 1 ? (
          <Field label={isPrint ? "Finished size" : "Shape"}>
            <Select value={format.id} onChange={(e) => setFormatId(e.target.value)}>
              {formats.map((f) => (
                <option key={f.id} value={f.id}>{f.label}{f.hint ? `: ${f.hint}` : ""}</option>
              ))}
            </Select>
          </Field>
        ) : isPrint ? (
          <p className="text-[0.82rem] text-fg/85">Finished size: {format.label}</p>
        ) : null}

        {!isPrint ? (
          <Field label="At the bottom">
            <Select value={footer} onChange={(e) => setFooter(e.target.value as typeof footer)}>
              <option value="link">Show the invitation link</option>
              <option value="qr">Show a QR code</option>
              <option value="none">Nothing</option>
            </Select>
          </Field>
        ) : null}

        {guests.length ? (
          <Field label="Personalise for a guest" hint={isPrint ? "Adds their name, and the QR code opens their personal link." : "Adds their name to the card."}>
            <Select value={guestId} onChange={(e) => setGuestId(e.target.value)}>
              <option value="">Everyone (no name)</option>
              {guests.map((g) => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </Select>
          </Field>
        ) : null}

        <Card className="grid gap-2.5 p-4">
          {isPrint ? (
            <>
              <Button onClick={() => void downloadPdf()} disabled={Boolean(busy)}>
                <FileDown size={16} strokeWidth={1.6} aria-hidden /> {busy === "pdf" ? "Preparing…" : "Download print PDF"}
              </Button>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="secondary" size="sm" onClick={() => void downloadPng(frontRef, "front")} disabled={Boolean(busy)}>
                  {busy === "front" ? "Preparing…" : "Front PNG"}
                </Button>
                <Button variant="secondary" size="sm" onClick={() => void downloadPng(backRef, "back")} disabled={Boolean(busy)}>
                  {busy === "back" ? "Preparing…" : "Back PNG"}
                </Button>
              </div>
              {design.shape !== "rect" ? (
                <Button variant="ghost" size="sm" onClick={() => void downloadCutLine()} disabled={Boolean(busy)}>
                  <Scissors size={15} strokeWidth={1.6} aria-hidden /> Cut line (SVG)
                </Button>
              ) : null}
              <p className="text-[0.78rem] leading-snug text-fg/85">
                The PDF has the front and back at 300 dpi with a 3 mm bleed, then a page with the cut line as a vector outline.
                {design.shape !== "rect" ? " Shaped cards need die or laser cutting, so ask your print shop before you order." : ""}
              </p>
            </>
          ) : (
            <>
              <Button onClick={() => void share()} disabled={Boolean(busy)}>
                <Share2 size={16} strokeWidth={1.6} aria-hidden /> {busy === "share" ? "Preparing…" : "Share image"}
              </Button>
              <Button variant="secondary" onClick={() => void downloadPng(frontRef, format.id)} disabled={Boolean(busy)}>
                <Download size={16} strokeWidth={1.6} aria-hidden /> {busy === format.id ? "Preparing…" : "Download PNG"}
              </Button>
              <p className="text-[0.78rem] leading-snug text-fg/85">
                A picture cannot be tapped, so send the invitation link in the same message.
              </p>
            </>
          )}
          {note ? <p role="status" className="text-[0.8rem] text-brand">{note}</p> : null}
        </Card>
      </div>

      {/* Preview */}
      <div className={`grid content-start justify-items-center gap-6 lg:col-start-2 lg:row-span-2 lg:row-start-1 [&>*]:min-w-0 ${isPrint && !wide ? "grid-cols-2" : "grid-cols-1"}`}>
        <div className="grid w-full grid-cols-1 justify-items-center gap-3 [&>*]:min-w-0">
          {isPrint ? <p className="label text-fg/85">Front</p> : null}
          <Scaled format={format} max={wide ? 640 : 360} shape={shape} refTo={frontRef}>
            <CardFace {...face} side="front" footer={isPrint ? "none" : footer} />
          </Scaled>
        </div>
        {isPrint ? (
          <div className="grid w-full grid-cols-1 justify-items-center gap-3 [&>*]:min-w-0">
            <p className="label text-fg/85">Back</p>
            <Scaled format={format} max={wide ? 640 : 360} shape={shape} refTo={backRef}>
              <CardFace {...face} side="back" />
            </Scaled>
          </div>
        ) : null}
      </div>
    </div>
  );
}
