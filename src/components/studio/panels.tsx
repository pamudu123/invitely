"use client";

import { Check, ImagePlus, Plus, X } from "lucide-react";
import { useRef, useState } from "react";
import { Crest, Divider, ornamentLabels } from "@/components/invitation/ornaments";
import { ritualInfo } from "@/lib/invitation/rituals";
import { Field, Input, Select, Textarea } from "@/components/ui/kit";
import { compressImage } from "@/lib/client/image";
import { allSections, getOccasion, occasions, sectionLabels } from "@/lib/invitation/occasions";
import { applyTemplateDesign, templates } from "@/lib/invitation/templates";
import { fontPairs, getPalette, palettes } from "@/lib/invitation/theme";
import type {
  EffectId,
  HeroLayout,
  InvitationData,
  MusicId,
  OccasionId,
  OrnamentId,
  Palette,
  RitualId,
  SectionId,
  ThemeConfig,
} from "@/lib/invitation/types";
import { Group, IconButton, PhotoPicker, RowActions, Tile, Toggle, moveItem } from "./controls";

export interface PanelProps {
  data: InvitationData;
  set: (patch: Partial<InvitationData>) => void;
  setTheme: (patch: Partial<ThemeConfig>) => void;
  replace: (next: InvitationData) => void;
  /** Replay the opening in the preview */
  replay: () => void;
}

const newId = () => Math.random().toString(36).slice(2, 9);

/* ------------------------------ Design ------------------------------ */

const heroOptions: { id: HeroLayout; label: string; hint: string }[] = [
  { id: "classic", label: "Classic", hint: "Ornament frame" },
  { id: "arch", label: "Arch", hint: "Photo in an arch" },
  { id: "photo", label: "Full photo", hint: "Photo fills the cover" },
  { id: "monogram", label: "Monogram", hint: "Your initials" },
  { id: "frame", label: "Framed card", hint: "Formal card on a dark mount" },
  { id: "poster", label: "Poster", hint: "Big bold type" },
  { id: "ticket", label: "Ticket", hint: "Boarding pass with a stub" },
  { id: "gazette", label: "Front page", hint: "Newspaper headline" },
  { id: "polaroid", label: "Polaroid", hint: "Instant photos" },
];

const musicOptions: { id: MusicId; label: string; hint: string }[] = [
  { id: "none", label: "Silent", hint: "No music" },
  { id: "serene", label: "Serene", hint: "Soft bells" },
  { id: "warm", label: "Warm", hint: "Slow strings" },
  { id: "joyful", label: "Joyful", hint: "Bright kalimba" },
  { id: "custom", label: "Your song", hint: "Link to an MP3" },
];

const effectOptions: { id: EffectId; label: string }[] = [
  { id: "none", label: "None" },
  { id: "petals", label: "Petals" },
  { id: "sparkles", label: "Sparkles" },
  { id: "confetti", label: "Confetti" },
  { id: "snow", label: "Snow" },
];

const customKeys: { key: keyof Palette; label: string }[] = [
  { key: "bg", label: "Paper" },
  { key: "ink", label: "Text" },
  { key: "accent", label: "Accent" },
  { key: "deep", label: "Deep tone" },
];

export function DesignPanel({ data, setTheme, replace, set, replay }: PanelProps) {
  const theme = data.theme;
  const palette = getPalette(theme);
  const [showAllTemplates, setShowAllTemplates] = useState(false);
  const matching = templates.filter((t) => t.occasion === data.occasion || t.alsoFor.includes(data.occasion));
  const shown = showAllTemplates ? templates : matching.length ? matching : templates;

  return (
    <>
      <Group title="Template" hint="Switching keeps everything you have written.">
        <div className="no-scrollbar -mx-5 flex snap-x gap-2.5 overflow-x-auto px-5 pb-1">
          {shown.map((tpl) => {
            const p = palettes.find((x) => x.id === tpl.theme.paletteId) ?? palettes[0];
            return (
              <Tile
                key={tpl.id}
                active={data.templateId === tpl.id}
                onClick={() => {
                  replace(applyTemplateDesign(data, tpl.id));
                  replay();
                }}
                className="w-[6.6rem] shrink-0 snap-start"
              >
                <span className="flex h-24 flex-col items-center justify-center gap-1" style={{ background: p.bg, color: p.ink }}>
                  <Crest kind={tpl.theme.ornament} className="w-12" style={{ color: p.accent }} />
                  <span className="h-1 w-8 rounded-full" style={{ background: p.deep }} />
                </span>
                <span className="block px-2.5 py-2">
                  <span className="block truncate text-[0.82rem] text-fg">{tpl.name}</span>
                  <span className="block truncate text-[0.75rem] text-fg/85">{tpl.meaning}</span>
                </span>
              </Tile>
            );
          })}
        </div>
        {matching.length && matching.length < templates.length ? (
          <button type="button" className="justify-self-start text-[0.8rem] text-brand underline-offset-4 hover:underline" onClick={() => setShowAllTemplates((v) => !v)}>
            {showAllTemplates ? "Show designs for this occasion" : `Show all ${templates.length} designs`}
          </button>
        ) : null}
      </Group>

      <Group title="Colours">
        <div className="grid grid-cols-4 gap-2">
          {palettes.map((p) => (
            <Tile
              key={p.id}
              label={p.label}
              active={theme.paletteId === p.id && !theme.custom}
              onClick={() => setTheme({ paletteId: p.id, custom: undefined })}
              className="p-0"
            >
              <span className="flex h-12" style={{ background: p.bg }}>
                <span className="mt-auto flex h-4 w-full">
                  <span className="flex-1" style={{ background: p.accent }} />
                  <span className="flex-1" style={{ background: p.deep }} />
                  <span className="flex-1" style={{ background: p.ink }} />
                </span>
              </span>
              <span className="block truncate px-1.5 py-1.5 text-center text-[0.75rem] text-fg/90">{p.label}</span>
            </Tile>
          ))}
        </div>
        <div className="grid grid-cols-4 gap-2">
          {customKeys.map(({ key, label }) => (
            <label key={key} className="grid gap-1 text-center">
              <span className="relative block h-10 overflow-hidden rounded-xl border border-fg/15">
                <input
                  type="color"
                  value={palette[key]}
                  onChange={(e) => setTheme({ custom: { ...(theme.custom ?? {}), [key]: e.target.value } })}
                  className="absolute -inset-2 h-[160%] w-[160%] cursor-pointer"
                  aria-label={`${label} colour`}
                />
              </span>
              <span className="text-[0.75rem] text-fg/85">{label}</span>
            </label>
          ))}
        </div>
        {theme.custom ? (
          <button type="button" className="justify-self-start text-[0.8rem] text-fg/85 hover:text-fg" onClick={() => setTheme({ custom: undefined })}>
            Reset to the palette colours
          </button>
        ) : null}
      </Group>

      <Group title="Lettering">
        <div className="grid grid-cols-3 gap-2">
          {fontPairs.map((f) => (
            <Tile key={f.id} active={theme.fontPair === f.id} onClick={() => setTheme({ fontPair: f.id })} className="px-2 py-3 text-center">
              <span
                className="block text-fg"
                style={{
                  fontFamily: f.names,
                  fontWeight: f.namesWeight,
                  fontStyle: f.namesItalic ? "italic" : "normal",
                  textTransform: f.namesUpper ? "uppercase" : "none",
                  fontSize: f.id === "heirloom" ? "1.7rem" : "1.45rem",
                  lineHeight: 1.1,
                }}
              >
                Aa
              </span>
              <span className="mt-1.5 block text-[0.75rem] text-fg/90">{f.label}</span>
            </Tile>
          ))}
        </div>
      </Group>

      <Group title="Ornament">
        <div className="grid grid-cols-2 gap-2">
          {(Object.keys(ornamentLabels) as OrnamentId[]).map((o) => (
            <Tile key={o} active={theme.ornament === o} onClick={() => setTheme({ ornament: o })} className="px-2.5 py-2.5 text-center">
              <Divider kind={o} className="mx-auto h-6 w-full text-brand" />
              <span className="mt-1 block text-[0.75rem] text-fg/90">{ornamentLabels[o]}</span>
            </Tile>
          ))}
        </div>
      </Group>

      <Group title="Cover layout">
        <div className="grid grid-cols-2 gap-2">
          {heroOptions.map((h) => (
            <Tile key={h.id} active={theme.hero === h.id} onClick={() => setTheme({ hero: h.id })} className="px-3 py-2.5">
              <span className="block text-[0.86rem] text-fg">{h.label}</span>
              <span className="block text-[0.75rem] text-fg/85">{h.hint}</span>
            </Tile>
          ))}
        </div>
        {["arch", "photo", "gazette", "polaroid"].includes(theme.hero) ? (
          <PhotoPicker label="Cover photo" value={data.heroPhoto} onChange={(v) => set({ heroPhoto: v })} />
        ) : null}
      </Group>

      <Group title="Opening" hint="The first thing guests do. It also lets music start on phones.">
        <div className="grid grid-cols-2 gap-2">
          {(Object.keys(ritualInfo) as RitualId[]).map((r) => (
            <Tile
              key={r}
              active={theme.ritual === r}
              onClick={() => {
                setTheme({ ritual: r });
                set({ ritualHint: ritualInfo[r].verb });
                replay();
              }}
              className="px-3 py-2.5"
            >
              <span className="block text-[0.86rem] text-fg">{ritualInfo[r].label}</span>
              <span className="mt-0.5 block text-[0.75rem] leading-snug text-fg/85">{ritualInfo[r].description}</span>
            </Tile>
          ))}
        </div>
        {theme.ritual !== "none" ? (
          <Field label="Words on the cover">
            <Input value={data.ritualHint} maxLength={60} onChange={(e) => set({ ritualHint: e.target.value })} />
          </Field>
        ) : null}
      </Group>

      <Group title="Sound" hint="Soundscapes are generated live in the browser, so there is nothing to license.">
        <div className="grid grid-cols-3 gap-2">
          {musicOptions.map((m) => (
            <Tile key={m.id} active={theme.music === m.id} onClick={() => setTheme({ music: m.id })} className="px-2.5 py-2.5">
              <span className="block text-[0.84rem] text-fg">{m.label}</span>
              <span className="block text-[0.75rem] text-fg/85">{m.hint}</span>
            </Tile>
          ))}
        </div>
        {theme.music === "custom" ? (
          <Field label="Link to your song" hint="A direct https link to an MP3 file you have the rights to use.">
            <Input type="url" inputMode="url" placeholder="https://…/song.mp3" value={theme.musicUrl ?? ""} onChange={(e) => setTheme({ musicUrl: e.target.value })} />
          </Field>
        ) : null}
      </Group>

      <Group title="Floating effect">
        <div className="grid grid-cols-5 gap-2">
          {effectOptions.map((e) => (
            <Tile key={e.id} active={theme.effect === e.id} onClick={() => setTheme({ effect: e.id })} className="px-1 py-2.5 text-center">
              <span className="text-[0.78rem] text-fg">{e.label}</span>
            </Tile>
          ))}
        </div>
      </Group>
    </>
  );
}

/* ------------------------------ Details ------------------------------ */

const timezones = [
  "Asia/Colombo", "Asia/Kolkata", "Asia/Dubai", "Asia/Singapore", "Asia/Kuala_Lumpur", "Asia/Tokyo",
  "Australia/Sydney", "Australia/Melbourne", "Pacific/Auckland", "Europe/London", "Europe/Paris",
  "Europe/Berlin", "Europe/Rome", "America/New_York", "America/Chicago", "America/Los_Angeles", "America/Toronto",
];

export function DetailsPanel({ data, set }: PanelProps) {
  const occ = getOccasion(data.occasion);

  const changeOccasion = (id: OccasionId) => {
    const next = getOccasion(id);
    // Swap the stock wording only where the host has not written their own.
    const patch: Partial<InvitationData> = { occasion: id };
    if (data.kicker === occ.kicker) patch.kicker = next.kicker;
    if (data.subline === occ.subline) patch.subline = next.subline;
    if (data.message === occ.message) patch.message = next.message;
    if (next.hosts === "single" && occ.hosts === "couple") patch.name2 = "";
    set(patch);
  };

  return (
    <>
      <Group title="Occasion">
        <Select value={data.occasion} onChange={(e) => changeOccasion(e.target.value as OccasionId)} aria-label="Occasion">
          {occasions.map((o) => (
            <option key={o.id} value={o.id}>{o.label}</option>
          ))}
        </Select>
      </Group>

      <Group title="Names">
        <Field label={occ.name1Label}>
          <Input value={data.name1} maxLength={60} onChange={(e) => set({ name1: e.target.value })} />
        </Field>
        <Field label={occ.name2Label ?? "Second name (optional)"}>
          <Input value={data.name2} maxLength={60} onChange={(e) => set({ name2: e.target.value })} />
        </Field>
      </Group>

      <Group title="Wording">
        <Field label="Line above the names">
          <Input value={data.kicker} maxLength={160} onChange={(e) => set({ kicker: e.target.value })} />
        </Field>
        <Field label="Line below the names">
          <Input value={data.subline} maxLength={160} onChange={(e) => set({ subline: e.target.value })} />
        </Field>
        <Field label="Invitation message">
          <Textarea rows={4} value={data.message} maxLength={900} onChange={(e) => set({ message: e.target.value })} />
        </Field>
        <Field label="Hosts line" hint="For example the parents' names.">
          <Input value={data.hostsLine} maxLength={200} onChange={(e) => set({ hostsLine: e.target.value })} />
        </Field>
        <Field label="Hashtag (optional)">
          <Input value={data.hashtag} maxLength={60} onChange={(e) => set({ hashtag: e.target.value })} />
        </Field>
      </Group>

      <Group title="When">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Date">
            <Input type="date" value={data.date} onChange={(e) => e.target.value && set({ date: e.target.value })} />
          </Field>
          <Field label="Main time">
            <Input type="time" value={data.time} onChange={(e) => e.target.value && set({ time: e.target.value })} />
          </Field>
        </div>
        <Field label="Time zone" hint="Countdowns stay correct for guests abroad.">
          <Select value={data.timezone} onChange={(e) => set({ timezone: e.target.value })}>
            {(timezones.includes(data.timezone) ? timezones : [data.timezone, ...timezones]).map((z) => (
              <option key={z} value={z}>{z.replace(/_/g, " ")}</option>
            ))}
          </Select>
        </Field>
      </Group>

      <Group title="Where">
        <Field label="Venue name">
          <Input value={data.venueName} maxLength={120} onChange={(e) => set({ venueName: e.target.value })} />
        </Field>
        <Field label="Address">
          <Input value={data.venueAddress} maxLength={200} onChange={(e) => set({ venueAddress: e.target.value })} />
        </Field>
        <Field label="Map search or Google Maps link" hint="What guests should see when they tap Open in Maps.">
          <Input value={data.mapQuery} maxLength={400} onChange={(e) => set({ mapQuery: e.target.value })} />
        </Field>
      </Group>
    </>
  );
}

/* ----------------------------- Schedule ----------------------------- */

export function SchedulePanel({ data, set }: PanelProps) {
  const occ = getOccasion(data.occasion);
  const events = data.events;
  const nekath = data.nekath;

  const patchEvent = (i: number, patch: Partial<InvitationData["events"][number]>) =>
    set({ events: events.map((e, idx) => (idx === i ? { ...e, ...patch } : e)) });
  const patchNekath = (i: number, patch: Partial<InvitationData["nekath"][number]>) =>
    set({ nekath: nekath.map((n, idx) => (idx === i ? { ...n, ...patch } : n)) });

  const showNekath = data.sections.includes("nekath");

  return (
    <>
      <Group title="Order of the day">
        {events.map((e, i) => (
          <div key={e.id} className="grid gap-2 rounded-xl border border-fg/10 bg-page-3/40 p-3">
            <div className="flex items-center gap-2">
              <Input type="time" value={e.time} onChange={(ev) => ev.target.value && patchEvent(i, { time: ev.target.value })} className="!w-[7.2rem] shrink-0" aria-label="Time" />
              <Input value={e.title} placeholder="What happens" maxLength={100} onChange={(ev) => patchEvent(i, { title: ev.target.value })} aria-label="Title" />
            </div>
            <Input value={e.note ?? ""} placeholder="Note (optional)" maxLength={200} onChange={(ev) => patchEvent(i, { note: ev.target.value })} aria-label="Note" />
            <div className="flex items-center justify-between gap-2">
              <Input value={e.place ?? ""} placeholder="Place (optional)" maxLength={120} onChange={(ev) => patchEvent(i, { place: ev.target.value })} aria-label="Place" />
              <RowActions index={i} count={events.length} onMove={(a, b) => set({ events: moveItem(events, a, b) })} onRemove={() => set({ events: events.filter((_, idx) => idx !== i) })} />
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => set({ events: [...events, { id: newId(), title: "", time: "18:00" }] })}
          className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-dashed border-fg/20 text-[0.86rem] text-fg/90 hover:border-brand/60 hover:text-brand"
        >
          <Plus size={16} /> Add a moment
        </button>
      </Group>

      <Group
        title="Auspicious times"
        hint={
          occ.nekath
            ? "Key times in the ceremony. Each one gets its own live countdown on the invitation."
            : "Optional. Add key ceremony times if your celebration has them."
        }
      >
        <Toggle
          checked={showNekath}
          onChange={(v) => {
            if (v) {
              const at = Math.max(0, data.sections.indexOf("schedule"));
              const next = [...data.sections];
              next.splice(at, 0, "nekath");
              set({ sections: next, nekath: nekath.length ? nekath : [{ id: newId(), title: "", time: "09:00" }] });
            } else set({ sections: data.sections.filter((s) => s !== "nekath") });
          }}
          label="Show auspicious times"
        />
        {showNekath ? (
          <>
            {nekath.map((n, i) => (
              <div key={n.id} className="grid gap-2 rounded-xl border border-fg/10 bg-page-3/40 p-3">
                <div className="flex items-center gap-2">
                  <Input type="time" value={n.time} onChange={(ev) => ev.target.value && patchNekath(i, { time: ev.target.value })} className="!w-[7.2rem] shrink-0" aria-label="Time" />
                  <Input value={n.title} placeholder="Ritual" maxLength={100} onChange={(ev) => patchNekath(i, { title: ev.target.value })} aria-label="Ritual" />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <Input value={n.note ?? ""} placeholder="Note, for example At the main door" maxLength={200} onChange={(ev) => patchNekath(i, { note: ev.target.value })} aria-label="Note" />
                  <RowActions index={i} count={nekath.length} onMove={(a, b) => set({ nekath: moveItem(nekath, a, b) })} onRemove={() => set({ nekath: nekath.filter((_, idx) => idx !== i) })} />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => set({ nekath: [...nekath, { id: newId(), title: "", time: "09:00" }] })}
              className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-dashed border-fg/20 text-[0.86rem] text-fg/90 hover:border-brand/60 hover:text-brand"
            >
              <Plus size={16} /> Add an auspicious time
            </button>
          </>
        ) : null}
      </Group>
    </>
  );
}

/* ----------------------------- Sections ----------------------------- */

function GalleryEditor({ data, set }: Pick<PanelProps, "data" | "set">) {
  const input = useRef<HTMLInputElement | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const max = 12;

  const add = async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy(true);
    setError("");
    const next = [...data.gallery];
    try {
      for (const file of Array.from(files)) {
        if (next.length >= max) break;
        next.push(await compressImage(file, 1400, 380_000));
      }
      set({ gallery: next });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not add that photo.");
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  };

  return (
    <div className="grid gap-2">
      <div className="grid grid-cols-4 gap-2">
        {data.gallery.map((src, i) => (
          <div key={`${i}-${src.slice(-12)}`} className="group relative aspect-square overflow-hidden rounded-lg border border-fg/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              aria-label="Remove photo"
              onClick={() => set({ gallery: data.gallery.filter((_, idx) => idx !== i) })}
              className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-on-brand"
            >
              <X size={14} />
            </button>
          </div>
        ))}
        {data.gallery.length < max ? (
          <button
            type="button"
            onClick={() => input.current?.click()}
            className="flex aspect-square items-center justify-center rounded-lg border border-dashed border-fg/25 text-fg/85 hover:border-brand/60 hover:text-brand"
            aria-label="Add photos"
          >
            <ImagePlus size={20} strokeWidth={1.4} />
          </button>
        ) : null}
      </div>
      <p className="text-[0.76rem] text-fg/85">{busy ? "Adding photos…" : `${data.gallery.length} of ${max} photos. They are resized on your phone before upload.`}</p>
      {error ? <p className="text-[0.8rem] text-red-700">{error}</p> : null}
      <input ref={input} type="file" accept="image/*" multiple className="hidden" onChange={(e) => void add(e.target.files)} />
    </div>
  );
}

function SectionBody({ id, data, set }: { id: SectionId } & Pick<PanelProps, "data" | "set">) {
  if (id === "gallery") return <GalleryEditor data={data} set={set} />;
  if (id === "gift") {
    return <Textarea rows={3} value={data.giftNote} maxLength={600} onChange={(e) => set({ giftNote: e.target.value })} aria-label="Gift note" />;
  }
  if (id === "details") {
    return (
      <div className="grid gap-3">
        <Field label="Dress code">
          <Input value={data.dressCode} maxLength={160} onChange={(e) => set({ dressCode: e.target.value })} />
        </Field>
        <Field label="Notes for guests">
          <Textarea rows={3} value={data.notes} maxLength={600} onChange={(e) => set({ notes: e.target.value })} />
        </Field>
        <div className="grid gap-2">
          <span className="text-[0.78rem] font-medium text-fg/90">Contacts</span>
          {data.contacts.map((c, i) => (
            <div key={c.id} className="flex items-center gap-2">
              <Input value={c.name} placeholder="Name" maxLength={60} onChange={(e) => set({ contacts: data.contacts.map((x, idx) => (idx === i ? { ...x, name: e.target.value } : x)) })} aria-label="Contact name" />
              <Input value={c.phone} placeholder="Phone" type="tel" maxLength={30} onChange={(e) => set({ contacts: data.contacts.map((x, idx) => (idx === i ? { ...x, phone: e.target.value } : x)) })} aria-label="Contact phone" />
              <IconButton label="Remove contact" tone="danger" onClick={() => set({ contacts: data.contacts.filter((_, idx) => idx !== i) })}><X size={15} /></IconButton>
            </div>
          ))}
          {data.contacts.length < 6 ? (
            <button type="button" className="justify-self-start text-[0.82rem] text-brand hover:underline" onClick={() => set({ contacts: [...data.contacts, { id: newId(), name: "", phone: "" }] })}>
              Add a contact
            </button>
          ) : null}
        </div>
      </div>
    );
  }
  if (id === "story") {
    return (
      <div className="grid gap-3">
        {data.story.map((s, i) => (
          <div key={s.id} className="grid gap-2 rounded-xl border border-fg/10 bg-page-3/40 p-3">
            <div className="flex gap-2">
              <Input value={s.when ?? ""} placeholder="Year" maxLength={40} className="!w-24 shrink-0" onChange={(e) => set({ story: data.story.map((x, idx) => (idx === i ? { ...x, when: e.target.value } : x)) })} aria-label="When" />
              <Input value={s.title} placeholder="Title" maxLength={100} onChange={(e) => set({ story: data.story.map((x, idx) => (idx === i ? { ...x, title: e.target.value } : x)) })} aria-label="Title" />
            </div>
            <Textarea rows={2} value={s.text} placeholder="A sentence or two" maxLength={600} onChange={(e) => set({ story: data.story.map((x, idx) => (idx === i ? { ...x, text: e.target.value } : x)) })} aria-label="Story" />
            <div className="flex items-end justify-between gap-2">
              <PhotoPicker label="Photo (optional)" aspect="1 / 1" value={s.photo} onChange={(v) => set({ story: data.story.map((x, idx) => (idx === i ? { ...x, photo: v } : x)) })} />
              <RowActions index={i} count={data.story.length} onMove={(a, b) => set({ story: moveItem(data.story, a, b) })} onRemove={() => set({ story: data.story.filter((_, idx) => idx !== i) })} />
            </div>
          </div>
        ))}
        {data.story.length < 6 ? (
          <button type="button" className="justify-self-start text-[0.82rem] text-brand hover:underline" onClick={() => set({ story: [...data.story, { id: newId(), title: "", when: "", text: "" }] })}>
            Add a chapter
          </button>
        ) : null}
      </div>
    );
  }
  return null;
}

const editable: SectionId[] = ["story", "gallery", "details", "gift"];

export function SectionsPanel({ data, set }: PanelProps) {
  const [open, setOpen] = useState<SectionId | null>(null);
  const hidden = allSections.filter((s) => !data.sections.includes(s));

  const row = (id: SectionId, on: boolean, index: number) => (
    <div key={id} className={`rounded-xl border ${on ? "border-fg/12 bg-page-3/40" : "border-fg/8"}`}>
      <div className="flex items-center gap-2 px-3 py-2">
        <button
          type="button"
          role="switch"
          aria-checked={on}
          aria-label={`${on ? "Hide" : "Show"} ${sectionLabels[id].label}`}
          onClick={() => set({ sections: on ? data.sections.filter((s) => s !== id) : [...data.sections, id] })}
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md border transition-colors ${on ? "border-brand bg-brand text-on-brand" : "border-fg/25 text-transparent"}`}
        >
          <Check size={15} strokeWidth={2.4} />
        </button>
        <button
          type="button"
          className="min-w-0 flex-1 py-1.5 text-left"
          onClick={() => editable.includes(id) && setOpen(open === id ? null : id)}
        >
          <span className={`block text-[0.9rem] ${on ? "text-fg" : "text-fg/85"}`}>{sectionLabels[id].label}</span>
          <span className="block truncate text-[0.75rem] text-fg/85">
            {editable.includes(id) ? (open === id ? "Tap to close" : "Tap to edit") : sectionLabels[id].hint}
          </span>
        </button>
        {on ? (
          <div className="flex gap-1.5">
            <IconButton label="Move up" disabled={index === 0} onClick={() => set({ sections: moveItem(data.sections, index, index - 1) })}>↑</IconButton>
            <IconButton label="Move down" disabled={index === data.sections.length - 1} onClick={() => set({ sections: moveItem(data.sections, index, index + 1) })}>↓</IconButton>
          </div>
        ) : null}
      </div>
      {open === id && editable.includes(id) ? (
        <div className="border-t border-fg/8 p-3">
          <SectionBody id={id} data={data} set={set} />
        </div>
      ) : null}
    </div>
  );

  return (
    <Group title="Sections" hint="Tick what you want to show and put it in your order.">
      {data.sections.map((id, i) => row(id, true, i))}
      {hidden.length ? <p className="label mt-2 text-fg/85">Hidden</p> : null}
      {hidden.map((id) => row(id, false, -1))}
    </Group>
  );
}

/* ------------------------------- RSVP ------------------------------- */

export function RsvpPanel({ data, set }: PanelProps) {
  const rsvp = data.rsvp;
  const patch = (p: Partial<InvitationData["rsvp"]>) => set({ rsvp: { ...rsvp, ...p } });
  const on = data.sections.includes("rsvp") && rsvp.enabled;

  return (
    <>
      <Group title="Replies">
        <Toggle
          checked={on}
          onChange={(v) => {
            patch({ enabled: v });
            if (v && !data.sections.includes("rsvp")) set({ sections: [...data.sections, "rsvp"], rsvp: { ...rsvp, enabled: true } });
          }}
          label="Collect RSVPs"
          hint="Replies arrive on your manage page the moment guests send them."
        />
        {on ? (
          <>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Reply by">
                <Input type="date" value={rsvp.deadline ?? ""} onChange={(e) => patch({ deadline: e.target.value || undefined })} />
              </Field>
              <Field label="Largest party">
                <Input type="number" min={1} max={20} value={rsvp.maxPartySize} onChange={(e) => patch({ maxPartySize: Math.min(20, Math.max(1, Number(e.target.value) || 1)) })} />
              </Field>
            </div>
            <p className="text-[0.76rem] leading-snug text-fg/85">
              Guests with a personal link can only bring the seats you reserved for them.
            </p>
            <Toggle checked={rsvp.askMeal} onChange={(v) => patch({ askMeal: v })} label="Ask for a meal preference" />
            {rsvp.askMeal ? (
              <Field label="Meal choices" hint="Separate with commas.">
                <Input
                  value={rsvp.mealOptions.join(", ")}
                  onChange={(e) => patch({ mealOptions: e.target.value.split(",").map((s) => s.trimStart()).slice(0, 8) })}
                  onBlur={() => patch({ mealOptions: rsvp.mealOptions.map((s) => s.trim()).filter(Boolean) })}
                />
              </Field>
            ) : null}
            <Toggle checked={rsvp.askMessage} onChange={(v) => patch({ askMessage: v })} label="Let guests leave a wish" hint="Shown on the wishes wall. You can hide any message." />
            <Field label="Your own question (optional)" hint="For example: Which song gets you dancing?">
              <Input value={rsvp.customQuestion ?? ""} maxLength={120} onChange={(e) => patch({ customQuestion: e.target.value })} />
            </Field>
          </>
        ) : null}
      </Group>
      <Group title="After the day" hint="Once the date has passed, the invitation turns into a thank you page.">
        <Field label="Thank you note">
          <Textarea rows={3} value={data.thankYou} maxLength={600} onChange={(e) => set({ thankYou: e.target.value })} />
        </Field>
      </Group>
    </>
  );
}
