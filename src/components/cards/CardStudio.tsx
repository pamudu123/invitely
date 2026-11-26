"use client";

import { Download, FileDown, RotateCcw, Scissors, Share2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { saveCardDesignAction, uploadCardImageAction } from "@/app/actions/invitations";
import { bareHost, useOrigin } from "@/components/dashboard/links";
import { Button, Card, Field, Select } from "@/components/ui/kit";
import { buildPdf, dataUrlToBlob, dataUrlToBytes, downloadBlob, renderFace, shareImage } from "@/lib/client/cardExport";
import { emptyCardDesign, type CardDesign, type CardKind, type CardPatch, type CardSide, type CardSticker } from "@/lib/invitation/cardDesign";
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
import { CardDesigner, type DesignTab } from "./CardDesigner";
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
  overlay,
}: {
  format: CardFormat;
  max: number;
  shape?: ShapeId;
  children: React.ReactNode;
  refTo?: React.Ref<HTMLDivElement>;
  /** Drawn over the preview and left out of the export */
  overlay?: React.ReactNode;
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
        {overlay}
      </div>
    </div>
  );
}

const clamp = (v: number) => Math.min(100, Math.max(0, v));

/** Handles for moving the host's small pictures on the preview. */
function StickerHandles({
  stickers,
  selected,
  onSelect,
  onMove,
}: {
  stickers: CardSticker[];
  selected: string;
  onSelect: (id: string) => void;
  onMove: (id: string, x: number, y: number) => void;
}) {
  const drag = useRef<{ id: string; px: number; py: number; x: number; y: number; w: number; h: number } | null>(null);
  return stickers.map((s, i) => (
    <button
      key={s.id}
      type="button"
      aria-label={`Move picture ${i + 1}. Drag it or use the arrow keys.`}
      aria-pressed={s.id === selected}
      className={`absolute min-h-6 min-w-6 cursor-move touch-none rounded-sm outline-2 outline-offset-2 ${s.id === selected ? "outline-dashed outline-brand" : "outline-dashed outline-transparent hover:outline-brand/60"} focus-visible:outline-brand`}
      style={{
        left: `${s.x}%`,
        top: `${s.y}%`,
        width: `${s.w}%`,
        aspectRatio: s.shape === "circle" ? "1" : String(s.ratio),
        transform: `translate(-50%, -50%) rotate(${s.rotate}deg)`,
      }}
      onClick={() => onSelect(s.id)}
      onPointerDown={(e) => {
        const box = e.currentTarget.parentElement?.getBoundingClientRect();
        if (!box || e.button !== 0) return;
        e.currentTarget.setPointerCapture(e.pointerId);
        drag.current = { id: s.id, px: e.clientX, py: e.clientY, x: s.x, y: s.y, w: box.width, h: box.height };
        onSelect(s.id);
      }}
      onPointerMove={(e) => {
        const d = drag.current;
        if (!d || d.id !== s.id) return;
        onMove(s.id, clamp(d.x + ((e.clientX - d.px) / d.w) * 100), clamp(d.y + ((e.clientY - d.py) / d.h) * 100));
      }}
      onPointerUp={() => { drag.current = null; }}
      onPointerCancel={() => { drag.current = null; }}
      onKeyDown={(e) => {
        const step = e.shiftKey ? 5 : 1;
        const by = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[e.key];
        if (!by) return;
        e.preventDefault();
        onSelect(s.id);
        onMove(s.id, clamp(s.x + by[0]), clamp(s.y + by[1]));
      }}
    />
  ));
}

type SaveState = "idle" | "saving" | "saved" | "error";

/** Keeps the design on screen and saves it shortly after each change, one request at a time. */
function useSavedDesign(token: string, kind: CardKind, initial: CardDesign) {
  const [design, setDesign] = useState(initial);
  const [state, setState] = useState<SaveState>("idle");
  const latest = useRef(initial);
  const dirty = useRef(false);
  const sending = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const flush = useCallback(async () => {
    clearTimeout(timer.current);
    if (sending.current) return;
    sending.current = true;
    let ok = true;
    while (ok && dirty.current) {
      dirty.current = false;
      ok = await saveCardDesignAction(token, kind, latest.current).then((r) => r.ok, () => false);
      if (!ok) dirty.current = true;
    }
    sending.current = false;
    setState(ok ? "saved" : "error");
  }, [token, kind]);

  const change = useCallback(
    (patch: CardPatch) => {
      latest.current = { ...latest.current, ...(typeof patch === "function" ? patch(latest.current) : patch) };
      dirty.current = true;
      setDesign(latest.current);
      setState("saving");
      clearTimeout(timer.current);
      timer.current = setTimeout(() => void flush(), 700);
    },
    [flush],
  );

  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (dirty.current || sending.current) e.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => {
      window.removeEventListener("beforeunload", warn);
      // Leaving for another page in the app: send what is waiting.
      if (dirty.current) void flush();
    };
  }, [flush]);

  return { design, change, state, retry: flush };
}

const chip = (active: boolean) =>
  `rounded-xl border px-2 py-2.5 text-center text-[0.8rem] transition-colors ${
    active ? "border-brand bg-brand/10 text-fg shadow-[0_0_0_1px_var(--color-brand)]" : "border-fg/40 bg-page-2 text-fg/90 hover:border-fg/70"
  }`;

export function CardStudio({
  kind,
  token,
  saved,
  data,
  slug,
  published,
  guests,
}: {
  kind: CardKind;
  /** The card's manage token */
  token: string;
  /** Changes saved earlier */
  saved?: CardDesign;
  data: InvitationData;
  slug: string;
  published: boolean;
  guests: CardGuest[];
}) {
  const origin = useOrigin();
  const isPrint = kind === "print";

  const { design: mine, change, state, retry } = useSavedDesign(token, kind, useState(() => saved ?? emptyCardDesign())[0]);
  const [tab, setTab] = useState<DesignTab>(isPrint ? "colours" : "pictures");
  const [selected, setSelected] = useState("");
  const [resetting, setResetting] = useState(false);

  // Image card: a layout that follows the web design. Print card: a design from its own collection.
  const design = getPrintDesign((isPrint && mine.base) || printDesigns[0].id);
  const imageLayout = !isPrint && mine.base ? (mine.base as CardLayoutId) : defaultCardLayout(data);
  // A straight edged printed card can take another front, which brings its own tone.
  const ownFront = isPrint && design.shape === "rect" && mine.layout ? getCardLayout(mine.layout) : undefined;
  const layout = isPrint ? (ownFront?.id ?? design.face) : imageLayout;
  const tone = ownFront ? (ownFront.darkBack ? "deep" : "paper") : design.tone;
  const orientation = getCardLayout(imageLayout).orientation;

  const formats = useMemo(
    () => (isPrint ? design.sizes.map(printFormat) : formatsFor(orientation)),
    [isPrint, design, orientation],
  );
  const format = formats.find((f) => f.id === mine.format) ?? formats[0];
  const footer = mine.footer ?? "link";

  const [guestId, setGuestId] = useState("");
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
    design: mine,
    layout,
    width: format.width,
    height: format.height,
    bleed: format.bleed,
    link,
    linkLabel,
    guest: guest ? { name: guest.name, seats: guest.seats } : undefined,
    ...(isPrint ? { shape: design.shape, tone, density: design.density, scale: design.scale } : {}),
  };

  const upload = async (dataUrl: string) => {
    const res = await uploadCardImageAction(token, dataUrl);
    if (!res.ok) throw new Error("Could not upload that picture. Please try again.");
    return res.url;
  };

  const handles = (side: CardSide) =>
    tab === "pictures" ? (
      <StickerHandles
        stickers={mine.stickers.filter((x) => x.side === side)}
        selected={selected}
        onSelect={setSelected}
        onMove={(id, x, y) => change((d) => ({ stickers: d.stickers.map((q) => (q.id === id ? { ...q, x, y } : q)) }))}
      />
    ) : null;

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
    <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[23rem_1fr] lg:grid-rows-[auto_1fr] lg:gap-x-8 [&>*]:min-w-0">
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
                <button key={d.id} type="button" onClick={() => change({ base: d.id, layout: undefined, format: undefined })} aria-pressed={design.id === d.id} className={`${chip(design.id === d.id)} w-36 shrink-0 !px-3 !text-left lg:w-auto`}>
                  <span className="block text-fg">{d.name}</span>
                  <span className="block text-[0.75rem] text-fg/85">{getShape(d.shape).label}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="no-scrollbar -mx-4 mt-3 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:grid lg:grid-cols-3 lg:px-0">
              {cardLayouts.map((l) => (
                <button key={l.id} type="button" onClick={() => change({ base: l.id, format: undefined })} aria-pressed={imageLayout === l.id} title={l.description} className={`${chip(imageLayout === l.id)} w-28 shrink-0 lg:w-auto`}>
                  {l.name}
                </button>
              ))}
            </div>
          )}
          <p className="mt-2.5 text-[0.82rem] leading-snug text-fg/85">
            {isPrint ? `${design.meaning}. ${design.description}` : getCardLayout(imageLayout).description}
          </p>
        </div>
      </div>

      {/* Changes, options and downloads */}
      <div className="order-last grid grid-cols-1 content-start gap-5 lg:order-none lg:col-start-1 lg:row-start-2 [&>*]:min-w-0">
        <section className="rounded-2xl border border-fg/15 bg-page-2 p-4" aria-label="Make it yours">
          <div className="mb-3.5 flex min-h-6 items-center justify-between gap-3">
            <p className="label text-brand">Make it yours</p>
            <p role="status" className="text-[0.78rem] text-fg/85">
              {state === "saving" ? "Saving…" : state === "saved" ? "Saved" : null}
              {state === "error" ? (
                <button type="button" onClick={() => void retry()} className="text-red-700 underline underline-offset-2">Not saved. Try again</button>
              ) : null}
            </p>
          </div>
          <CardDesigner
            kind={kind}
            data={data}
            design={mine}
            change={change}
            layout={layout}
            shape={shape}
            format={format}
            tab={tab}
            setTab={(next) => { setTab(next); setSelected(""); }}
            selected={selected}
            select={setSelected}
            upload={upload}
          />
          <div className="mt-4 border-t border-fg/15 pt-3">
            {resetting ? (
              <div className="flex flex-wrap items-center gap-2 text-[0.82rem]">
                <span>Remove all your changes to this card?</span>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => {
                    change({ ...emptyCardDesign(), layout: undefined, footer: undefined, front: undefined, back: undefined });
                    setSelected("");
                    setResetting(false);
                  }}
                >
                  Remove
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setResetting(false)}>Keep</Button>
              </div>
            ) : (
              <button type="button" onClick={() => setResetting(true)} className="inline-flex min-h-8 items-center gap-1.5 text-[0.8rem] text-fg/85 hover:text-fg">
                <RotateCcw size={14} strokeWidth={1.6} aria-hidden /> Match the web card again
              </button>
            )}
          </div>
        </section>

        {formats.length > 1 ? (
          <Field label={isPrint ? "Finished size" : "Shape"}>
            <Select value={format.id} onChange={(e) => change({ format: e.target.value })}>
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
            <Select value={footer} onChange={(e) => change({ footer: e.target.value as typeof footer })}>
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

      {/* Preview. Stays in view while the changes scroll past, where it leaves enough room. */}
      <div className={`grid content-start justify-items-center gap-6 lg:sticky lg:top-24 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-start [&>*]:min-w-0 ${isPrint && !wide ? "grid-cols-2 max-lg:sticky max-lg:top-16 max-lg:z-20 max-lg:-mx-4 max-lg:bg-page max-lg:px-4 max-lg:py-3 sm:max-lg:static" : "grid-cols-1"}`}>
        <div className="grid w-full grid-cols-1 justify-items-center gap-3 [&>*]:min-w-0">
          {isPrint ? <p className="label text-fg/85">Front</p> : null}
          <Scaled format={format} max={wide ? 640 : 360} shape={shape} refTo={frontRef} overlay={handles("front")}>
            <CardFace {...face} side="front" footer={isPrint ? "none" : footer} />
          </Scaled>
        </div>
        {isPrint ? (
          <div className="grid w-full grid-cols-1 justify-items-center gap-3 [&>*]:min-w-0">
            <p className="label text-fg/85">Back</p>
            <Scaled format={format} max={wide ? 640 : 360} shape={shape} refTo={backRef} overlay={handles("back")}>
              <CardFace {...face} side="back" />
            </Scaled>
          </div>
        ) : null}
      </div>
    </div>
  );
}
