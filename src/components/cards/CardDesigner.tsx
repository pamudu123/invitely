"use client";

import { ImagePlus, Trash2 } from "lucide-react";
import { useRef, useState, type ReactNode } from "react";
import { Crest, ornamentLabels } from "@/components/invitation/ornaments";
import { IconButton, Slider, Tile, Toggle } from "@/components/studio/controls";
import { Field, Input, Select, Textarea } from "@/components/ui/kit";
import { measureImage, prepareCardImage } from "@/lib/client/image";
import {
  MAX_STICKERS,
  NAMES_RANGE,
  TEXT_RANGE,
  applyCardDesign,
  canFlip,
  coverDpi,
  hasEmblem,
  stickerDpi,
  straightFronts,
  wordLimits,
  type CardDesign,
  type CardKind,
  type CardPart,
  type CardPatch,
  type CardPicture,
  type CardSide,
  type CardSticker,
  type CardWord,
  type PicturePlacement,
} from "@/lib/invitation/cardDesign";
import type { CardFormat, CardLayoutId } from "@/lib/invitation/cards";
import type { ShapeId } from "@/lib/invitation/shapes";
import { contrast, fontPairs, getPalette, palettes } from "@/lib/invitation/theme";
import type { InvitationData, OrnamentId, Palette } from "@/lib/invitation/types";

export type DesignTab = "colours" | "lettering" | "pictures" | "wording" | "parts";

const tabs: { id: DesignTab; label: string }[] = [
  { id: "colours", label: "Colours" },
  { id: "lettering", label: "Lettering" },
  { id: "pictures", label: "Pictures" },
  { id: "wording", label: "Wording" },
  { id: "parts", label: "Show and hide" },
];

export interface DesignerProps {
  kind: CardKind;
  /** The web card, without any changes */
  data: InvitationData;
  design: CardDesign;
  change: (patch: CardPatch) => void;
  layout: CardLayoutId;
  shape?: ShapeId;
  format: CardFormat;
  tab: DesignTab;
  setTab: (tab: DesignTab) => void;
  selected: string;
  select: (stickerId: string) => void;
  /** Store a picture and answer with its address */
  upload: (dataUrl: string) => Promise<string>;
}

type Stored = Pick<CardPicture, "src" | "px" | "ratio">;

const heading = (text: string) => <p className="text-[0.82rem] font-semibold text-fg">{text}</p>;
const linkButton = "justify-self-start text-[0.8rem] text-brand underline-offset-4 hover:underline";

/* ------------------------------- colours ------------------------------- */

const colourKeys: { key: keyof Palette; label: string }[] = [
  { key: "bg", label: "Paper" },
  { key: "ink", label: "Text" },
  { key: "accent", label: "Accent" },
  { key: "deep", label: "Deep" },
  { key: "onDeep", label: "On deep" },
];

function ColoursTab({ data, design, change, layout }: DesignerProps) {
  const t = design.theme;
  const palette = getPalette(applyCardDesign(data, design).theme);
  const hard = Math.min(contrast(palette.ink, palette.bg), contrast(palette.onDeep, palette.deep)) < 3;
  return (
    <>
      <button type="button" className={linkButton} onClick={() => change({ theme: { ...t, paletteId: undefined, custom: undefined } })} disabled={!t.paletteId && !t.custom}>
        {t.paletteId || t.custom ? "Use the web card's colours" : "Using the web card's colours"}
      </button>
      <div className="grid max-h-60 grid-cols-4 gap-2 overflow-y-auto pr-1">
        {palettes.map((p) => (
          <Tile key={p.id} label={p.label} active={t.paletteId === p.id && !t.custom} onClick={() => change({ theme: { ...t, paletteId: p.id, custom: undefined } })}>
            <span className="flex h-10" style={{ background: p.bg }}>
              <span className="mt-auto flex h-4 w-full">
                <span className="flex-1" style={{ background: p.accent }} />
                <span className="flex-1" style={{ background: p.deep }} />
                <span className="flex-1" style={{ background: p.ink }} />
              </span>
            </span>
            <span className="block truncate px-1 py-1 text-center text-[0.72rem] text-fg/90">{p.label}</span>
          </Tile>
        ))}
      </div>
      <div className="grid grid-cols-5 gap-2">
        {colourKeys.map(({ key, label }) => (
          <label key={key} className="grid gap-1 text-center">
            <span className="relative block h-10 overflow-hidden rounded-xl border border-fg/25">
              <input
                type="color"
                value={palette[key]}
                onChange={(e) => change({ theme: { ...t, custom: { ...t.custom, [key]: e.target.value } } })}
                className="absolute -inset-2 h-[160%] w-[160%] cursor-pointer"
                aria-label={`${label} colour`}
              />
            </span>
            <span className="text-[0.72rem] text-fg/85">{label}</span>
          </label>
        ))}
      </div>
      {hard ? <p role="status" className="text-[0.8rem] text-red-700">These colours are close together, so the words may be hard to read.</p> : null}
      {canFlip(layout) ? (
        <Toggle checked={design.flip} onChange={(flip) => change({ flip })} label="Swap light and dark" hint="Trades the paper colour and the deep colour." />
      ) : null}
    </>
  );
}

/* ------------------------------ lettering ------------------------------ */

function LetteringTab({ data, design, change }: DesignerProps) {
  const t = design.theme;
  return (
    <>
      <div className="grid grid-cols-3 gap-2">
        <Tile active={!t.fontPair} onClick={() => change({ theme: { ...t, fontPair: undefined } })} className="flex items-center justify-center px-2 py-3 text-center text-[0.75rem] text-fg/90">
          Same as web card
        </Tile>
        {fontPairs.map((f) => (
          <Tile key={f.id} active={t.fontPair === f.id} onClick={() => change({ theme: { ...t, fontPair: f.id } })} className="px-2 py-2.5 text-center">
            <span className="block truncate text-[1.25rem] leading-tight text-fg" style={{ fontFamily: f.names, fontWeight: f.namesWeight, fontStyle: f.namesItalic ? "italic" : "normal", textTransform: f.namesUpper ? "uppercase" : "none" }}>
              {data.name1.slice(0, 6) || "Aa"}
            </span>
            <span className="mt-1 block text-[0.72rem] text-fg/90">{f.label}</span>
          </Tile>
        ))}
      </div>
      <Slider label="Size of the names" value={design.names} min={NAMES_RANGE[0]} max={NAMES_RANGE[1]} onChange={(names) => change({ names })} />
      <Slider label="Size of the other words" value={design.text} min={TEXT_RANGE[0]} max={TEXT_RANGE[1]} onChange={(text) => change({ text })} />
    </>
  );
}

/* ------------------------------- pictures ------------------------------- */

function usePicturePicker(upload: DesignerProps["upload"]) {
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const run = async (key: string, job: () => Promise<void>) => {
    setBusy(key);
    setError("");
    try {
      await job();
    } catch (e) {
      setError(e instanceof Error && e.message ? e.message : "Could not add that picture. Please try again.");
    } finally {
      setBusy("");
    }
  };
  const fromFile = (key: string, file: File | undefined, use: (s: Stored) => void) => {
    if (!file) return;
    void run(key, async () => {
      const made = await prepareCardImage(file);
      use({ src: await upload(made.dataUrl), px: made.width, ratio: made.width / made.height });
    });
  };
  const fromWeb = (key: string, src: string, use: (s: Stored) => void) =>
    void run(key, async () => {
      const size = await measureImage(src);
      use({ src, px: size.width, ratio: size.width / size.height });
    });
  return { busy, error, fromFile, fromWeb };
}

function UploadButton({ label, busy, disabled, onFile }: { label: string; busy: boolean; disabled?: boolean; onFile: (file?: File) => void }) {
  const input = useRef<HTMLInputElement | null>(null);
  return (
    <>
      <button
        type="button"
        onClick={() => input.current?.click()}
        disabled={busy || disabled}
        className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-dashed border-fg/50 bg-page-2 px-3 py-2.5 text-[0.85rem] text-fg transition-colors hover:border-brand hover:text-brand disabled:opacity-50"
      >
        <ImagePlus size={17} strokeWidth={1.6} aria-hidden /> {busy ? "Adding…" : label}
      </button>
      <input
        ref={input}
        type="file"
        accept="image/*"
        className="hidden"
        aria-label={label}
        onChange={(e) => {
          onFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
    </>
  );
}

/** Photos already on the web card, offered so nobody uploads them twice. */
function WebPhotos({ photos, onPick, disabled }: { photos: string[]; onPick: (src: string) => void; disabled: boolean }) {
  if (!photos.length) return null;
  return (
    <div className="grid gap-1.5">
      <p className="text-[0.78rem] text-fg/85">Or use a photo from your web card</p>
      <div className="no-scrollbar flex gap-2 overflow-x-auto">
        {photos.map((src, i) => (
          <button key={src} type="button" disabled={disabled} onClick={() => onPick(src)} aria-label={`Use web card photo ${i + 1}`} className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-fg/25 hover:border-brand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}

function SoftWarning({ dpi }: { dpi: number }) {
  if (dpi >= 150) return null;
  return <p role="status" className="text-[0.8rem] text-red-700">This picture has about {Math.round(dpi)} dots per inch here, so it may look soft in print. Use a larger file or a smaller size.</p>;
}

function PicturesTab({ kind, data, design, change, layout, shape, format, selected, select, upload }: DesignerProps) {
  const { busy, error, fromFile, fromWeb } = usePicturePicker(upload);
  const [side, setSide] = useState<CardSide>("front");
  const picture = design[side];
  const photoFace = side === "front" && layout === "photo";
  const emblem = side === "front" && hasEmblem(layout, shape);
  const stickers = design.stickers.filter((s) => s.side === side);
  const sticker = stickers.find((s) => s.id === selected);
  const inches = { w: format.width / 100, h: format.height / 100 };
  const webPhotos = Array.from(
    new Set([data.heroPhoto, ...data.gallery, ...data.story.map((s) => s.photo)].filter((s): s is string => Boolean(s?.startsWith("/api/media/")))),
  );

  const setPicture = (patch: Partial<CardPicture>) => {
    if (picture) change({ [side]: { ...picture, ...patch } });
  };
  const usePicture = (stored: Stored) =>
    change((d) => {
      const { placement = "background", wash = 70 } = d[side] ?? {};
      return { [side]: { placement, wash, x: 50, y: 50, zoom: 1, ...stored } };
    });
  const setSticker = (id: string, patch: Partial<CardSticker>) =>
    change((d) => ({ stickers: d.stickers.map((s) => (s.id === id ? { ...s, ...patch } : s)) }));
  const addSticker = (stored: Stored) => {
    const id = Math.random().toString(36).slice(2, 10);
    change((d) => ({ stickers: [...d.stickers, { id, side, ...stored, x: 50, y: 12, w: 20, rotate: 0, shape: "none" as const }].slice(0, MAX_STICKERS) }));
    select(id);
  };

  const placements: { id: PicturePlacement; label: string }[] = photoFace
    ? [{ id: "background", label: "In the photo space" }, { id: "full", label: "Whole card" }]
    : [
        { id: "background", label: "Behind the words" },
        ...(emblem ? [{ id: "emblem" as const, label: "Round, above the names" }] : []),
        { id: "full", label: kind === "print" ? `Whole ${side}` : "Whole card" },
      ];
  const placement = placements.some((p) => p.id === picture?.placement) ? picture?.placement : "background";

  return (
    <>
      {kind === "print" ? (
        <div className="grid grid-cols-2 gap-2" role="group" aria-label="Side of the card">
          {(["front", "back"] as const).map((s) => (
            <Tile key={s} active={side === s} onClick={() => { setSide(s); select(""); }} className="px-2 py-2 text-[0.82rem] text-fg">
              <span className="block text-center">{s === "front" ? "Front" : "Back"}</span>
            </Tile>
          ))}
        </div>
      ) : null}

      {heading("Main picture")}
      {picture ? (
        <>
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={picture.src} alt="" className="h-16 w-16 shrink-0 rounded-lg border border-fg/20 object-cover" />
            <div className="grid flex-1 gap-2">
              <UploadButton label="Replace picture" busy={busy === "main"} disabled={Boolean(busy)} onFile={(f) => fromFile("main", f, usePicture)} />
            </div>
            <IconButton label="Remove picture" tone="danger" onClick={() => change({ [side]: undefined })}><Trash2 size={15} /></IconButton>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {placements.map((p) => (
              <Tile key={p.id} active={placement === p.id} onClick={() => setPicture({ placement: p.id })} className="px-3 py-2 text-[0.82rem] text-fg">{p.label}</Tile>
            ))}
          </div>
          {placement === "full" ? (
            <p className="text-[0.8rem] leading-snug text-fg/85">
              Your picture replaces the design, for example artwork you made elsewhere.
              {kind === "print" && side === "back" ? " The QR code stays on top. Switch it off under Show and hide if your artwork has its own." : ""}
            </p>
          ) : null}
          {placement === "background" && !photoFace ? (
            <Slider label="Fade, so the words stay easy to read" value={picture.wash} min={0} max={95} onChange={(wash) => setPicture({ wash })} />
          ) : null}
          <Slider label="Zoom" value={picture.zoom * 100} min={100} max={300} onChange={(v) => setPicture({ zoom: v / 100 })} />
          <Slider label="Move left and right" value={picture.x} min={0} max={100} onChange={(x) => setPicture({ x })} />
          <Slider label="Move up and down" value={picture.y} min={0} max={100} onChange={(y) => setPicture({ y })} />
          {kind === "print" && placement !== "emblem" ? <SoftWarning dpi={coverDpi(picture, inches.w, inches.h)} /> : null}
        </>
      ) : (
        <>
          <UploadButton label="Upload a picture" busy={busy === "main"} disabled={Boolean(busy)} onFile={(f) => fromFile("main", f, usePicture)} />
          <WebPhotos photos={webPhotos} disabled={Boolean(busy)} onPick={(src) => fromWeb("main", src, usePicture)} />
        </>
      )}

      <div className="mt-1 grid gap-1 border-t border-fg/15 pt-4">
        {heading("Logos and small pictures")}
        <p className="text-[0.8rem] leading-snug text-fg/85">Drag them on the preview, or move them with the arrow keys. PNG logos keep their clear background.</p>
      </div>
      {stickers.length ? (
        <div className="flex flex-wrap gap-2">
          {stickers.map((s, i) => (
            <button key={s.id} type="button" onClick={() => select(s.id)} aria-pressed={s.id === selected} aria-label={`Edit picture ${i + 1}`} className={`h-14 w-14 overflow-hidden rounded-lg border bg-page-3 p-1 ${s.id === selected ? "border-brand shadow-[0_0_0_1px_var(--color-brand)]" : "border-fg/25"}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.src} alt="" className="h-full w-full object-contain" />
            </button>
          ))}
        </div>
      ) : null}
      {sticker ? (
        <div className="grid gap-3 rounded-xl border border-fg/20 p-3">
          <Slider label="Size" value={sticker.w} min={3} max={100} onChange={(w) => setSticker(sticker.id, { w })} />
          <Slider label="Turn" value={sticker.rotate} min={-180} max={180} unit="°" onChange={(rotate) => setSticker(sticker.id, { rotate })} />
          <Field label="Shape">
            <Select value={sticker.shape} onChange={(e) => setSticker(sticker.id, { shape: e.target.value as CardSticker["shape"] })}>
              <option value="none">As it is</option>
              <option value="rounded">Rounded corners</option>
              <option value="circle">Circle</option>
            </Select>
          </Field>
          {kind === "print" ? <SoftWarning dpi={stickerDpi(sticker, inches.w)} /> : null}
          <button type="button" className="justify-self-start text-[0.82rem] text-red-700 hover:underline" onClick={() => { change({ stickers: design.stickers.filter((s) => s.id !== sticker.id) }); select(""); }}>
            Remove this picture
          </button>
        </div>
      ) : null}
      {design.stickers.length < MAX_STICKERS ? (
        <>
          <UploadButton label="Add a logo or picture" busy={busy === "sticker"} disabled={Boolean(busy)} onFile={(f) => fromFile("sticker", f, addSticker)} />
          {!stickers.length ? <WebPhotos photos={webPhotos} disabled={Boolean(busy)} onPick={(src) => fromWeb("sticker", src, addSticker)} /> : null}
        </>
      ) : (
        <p className="text-[0.8rem] text-fg/85">You have added {MAX_STICKERS}, which is the most a card can hold.</p>
      )}
      {error ? <p role="alert" className="text-[0.8rem] text-red-700">{error}</p> : null}
    </>
  );
}

/* -------------------------------- wording ------------------------------- */

const wordFields: { key: CardWord; label: string; print?: boolean; long?: boolean }[] = [
  { key: "name1", label: "First name" },
  { key: "name2", label: "Second name" },
  { key: "kicker", label: "Line above the names" },
  { key: "subline", label: "Line below the names" },
  { key: "venueName", label: "Venue" },
  { key: "venueAddress", label: "Address" },
  { key: "hostsLine", label: "Hosts" },
  { key: "message", label: "Message on the back", print: true, long: true },
];

function WordingTab({ kind, data, design, change }: DesignerProps) {
  const set = (key: CardWord, value: string) => {
    const words = { ...design.words };
    if (value) words[key] = value;
    else delete words[key];
    change({ words });
  };
  return (
    <>
      <p className="text-[0.8rem] leading-snug text-fg/85">Leave a box empty to use the words of your web card. The date and time always follow it.</p>
      {wordFields
        .filter((f) => (kind === "print" || !f.print) && (f.key !== "name2" || data.name2))
        .map((f) => {
          const props = { value: design.words[f.key] ?? "", placeholder: data[f.key], maxLength: wordLimits[f.key] };
          return (
            <Field key={f.key} label={f.label}>
              {f.long ? (
                <Textarea {...props} rows={4} onChange={(e) => set(f.key, e.target.value)} />
              ) : (
                <Input {...props} onChange={(e) => set(f.key, e.target.value)} />
              )}
            </Field>
          );
        })}
    </>
  );
}

/* ---------------------------- show and hide ---------------------------- */

const partList: { id: CardPart; label: string; hint?: string; print?: boolean }[] = [
  { id: "border", label: "Border and corners" },
  { id: "crest", label: "Crest" },
  { id: "divider", label: "Divider" },
  { id: "kicker", label: "Line above the names" },
  { id: "subline", label: "Line below the names" },
  { id: "address", label: "Address" },
  { id: "message", label: "Message", print: true },
  { id: "hosts", label: "Hosts" },
  { id: "schedule", label: "Order of the day", print: true },
  { id: "nekath", label: "Auspicious times", print: true },
  { id: "notes", label: "Dress code and reply date", print: true },
  { id: "qr", label: "QR code and link", hint: "Guests scan it to open your web card.", print: true },
];

function PartsTab({ kind, data, design, change }: DesignerProps) {
  const t = design.theme;
  return (
    <>
      <Field label="Ornament">
        <Select value={t.ornament ?? ""} onChange={(e) => change({ theme: { ...t, ornament: (e.target.value || undefined) as OrnamentId | undefined } })}>
          <option value="">Same as web card ({ornamentLabels[data.theme.ornament]})</option>
          {(Object.keys(ornamentLabels) as OrnamentId[]).map((o) => (
            <option key={o} value={o}>{ornamentLabels[o]}</option>
          ))}
        </Select>
      </Field>
      <Crest kind={t.ornament ?? data.theme.ornament} className="mx-auto h-12 w-24 text-brand" />
      <div className="grid">
        {partList
          .filter((p) => kind === "print" || !p.print)
          .map((p) => (
            <Toggle
              key={p.id}
              label={p.label}
              hint={p.hint}
              checked={!design.hide.includes(p.id)}
              onChange={(on) => change({ hide: on ? design.hide.filter((x) => x !== p.id) : [...design.hide, p.id] })}
            />
          ))}
      </div>
    </>
  );
}

/* --------------------------------- panel -------------------------------- */

const bodies: Record<DesignTab, (p: DesignerProps) => ReactNode> = {
  colours: ColoursTab,
  lettering: LetteringTab,
  pictures: PicturesTab,
  wording: WordingTab,
  parts: PartsTab,
};

/** Everything a host can change on an image card or a printed card. */
export function CardDesigner(props: DesignerProps) {
  const { tab, setTab, kind, shape, design, change, layout } = props;
  const Body = bodies[tab];
  return (
    <div className="grid grid-cols-1 gap-4 [&>*]:min-w-0">
      {kind === "print" && shape === "rect" ? (
        <Field label="Front layout">
          <Select value={layout} onChange={(e) => change({ layout: e.target.value as CardLayoutId })}>
            {straightFronts.map((l) => (
              <option key={l.id} value={l.id}>{l.name}</option>
            ))}
          </Select>
        </Field>
      ) : null}
      <div className="flex flex-wrap gap-1.5" role="group" aria-label="What to change">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            aria-pressed={tab === t.id}
            className={`min-h-9 rounded-full border px-3 text-[0.8rem] transition-colors ${tab === t.id ? "border-brand bg-brand text-on-brand" : "border-fg/40 bg-page-2 text-fg/90 hover:border-fg/70"}`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-3.5 [&>*]:min-w-0">
        <Body key={`${tab}-${design.base ?? ""}`} {...props} />
      </div>
    </div>
  );
}
