"use client";

import {
  ArrowLeft,
  Clock,
  LayoutList,
  MailCheck,
  Monitor,
  Palette,
  PenLine,
  RotateCcw,
  Smartphone,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { saveInvitationAction, type OwnerInput } from "@/app/actions/invitations";
import { InvitationView } from "@/components/invitation/InvitationView";
import type { Phase } from "@/components/invitation/sections";
import { Button, Field, Input, PhoneFrame } from "@/components/ui/kit";
import { rememberCard } from "@/lib/client/cards";
import { demoWishes } from "@/lib/invitation/demo";
import {
  applyTemplateDesign,
  createFromTemplate,
  displayNames,
  getTemplate,
  normalizeInvitation,
} from "@/lib/invitation/templates";
import { todayPlus } from "@/lib/invitation/time";
import type { InvitationData, OccasionId, ThemeConfig } from "@/lib/invitation/types";
import {
  DesignPanel,
  DetailsPanel,
  RsvpPanel,
  SchedulePanel,
  SectionsPanel,
  type PanelProps,
} from "./panels";

const DRAFT_KEY = "invitely:draft:v1";

type TabId = "design" | "details" | "schedule" | "sections" | "rsvp";

const tabs: { id: TabId; label: string; icon: typeof Palette; Panel: (p: PanelProps) => React.ReactElement }[] = [
  { id: "design", label: "Design", icon: Palette, Panel: DesignPanel },
  { id: "details", label: "Details", icon: PenLine, Panel: DetailsPanel },
  { id: "schedule", label: "Schedule", icon: Clock, Panel: SchedulePanel },
  { id: "sections", label: "Sections", icon: LayoutList, Panel: SectionsPanel },
  { id: "rsvp", label: "RSVP", icon: MailCheck, Panel: RsvpPanel },
];

type SaveState = "idle" | "dirty" | "saving" | "saved" | "local" | "error";

export interface StudioProps {
  /** Saved card being edited, or undefined for a new draft. `id` is the card's manage token. */
  saved?: { id: string; slug: string; status: "draft" | "published"; data: InvitationData };
  templateId?: string;
  occasion?: OccasionId;
  /** Start in this colour, for example from a design card on the home page */
  paletteId?: string;
}

/** Swap inline images for the stored URLs returned by the server, without touching anything typed since. */
function adoptStoredImages(current: InvitationData, stored: InvitationData): InvitationData {
  const isInline = (v?: string) => Boolean(v && v.startsWith("data:"));
  let changed = false;
  const next = { ...current };
  if (isInline(current.heroPhoto) && stored.heroPhoto) {
    next.heroPhoto = stored.heroPhoto;
    changed = true;
  }
  if (current.gallery.some(isInline) && stored.gallery.length === current.gallery.length) {
    next.gallery = current.gallery.map((g, i) => (isInline(g) ? stored.gallery[i] : g));
    changed = true;
  }
  if (current.story.some((s) => isInline(s.photo)) && stored.story.length === current.story.length) {
    next.story = current.story.map((s, i) => (isInline(s.photo) ? { ...s, photo: stored.story[i].photo } : s));
    changed = true;
  }
  return changed ? next : current;
}

export function Studio({ saved, templateId, occasion, paletteId }: StudioProps) {
  const router = useRouter();
  const [id, setId] = useState<string | null>(saved?.id ?? null);
  const [data, setData] = useState<InvitationData>(() => saved?.data ?? createFromTemplate(templateId ?? "pahana", occasion));
  const [ready, setReady] = useState(Boolean(saved));
  const [tab, setTab] = useState<TabId | null>(null);
  const [desktopTab, setDesktopTab] = useState<TabId>("design");
  const [saveState, setSaveState] = useState<SaveState>(saved ? "saved" : "idle");
  const [previewKey, setPreviewKey] = useState(0);
  const [skipRitual, setSkipRitual] = useState(false);
  const [phase, setPhase] = useState<Phase>("before");
  const [device, setDevice] = useState<"phone" | "wide">("phone");
  const [stage, setStage] = useState<{ w: number; h: number } | null>(null);
  const [asking, setAsking] = useState(false);
  const [owner, setOwner] = useState<OwnerInput>({ name: "", contact: "", pin: "" });
  const [ownerError, setOwnerError] = useState("");
  const stageRef = useRef<HTMLDivElement | null>(null);
  const dataRef = useRef(data);
  const idRef = useRef(id);
  const dirty = useRef(false);
  const saving = useRef(false);

  useEffect(() => {
    dataRef.current = data;
  }, [data]);
  useEffect(() => {
    idRef.current = id;
  }, [id]);

  // New drafts: pick up where the visitor left off, or start fresh from the chosen template.
  useEffect(() => {
    if (saved) return;
    let draft: InvitationData | null = null;
    try {
      const raw = window.localStorage.getItem(DRAFT_KEY);
      if (raw) draft = normalizeInvitation(JSON.parse(raw));
    } catch {
      draft = null;
    }
    const tpl = templateId ? getTemplate(templateId) : undefined;
    const wanted = occasion ?? tpl?.occasion;
    let next: InvitationData;
    if (draft && (!tpl || draft.occasion === wanted)) {
      next = tpl && draft.templateId !== tpl.id ? applyTemplateDesign(draft, tpl.id) : draft;
    } else {
      // Sample hashtags belong to the sample names, so a fresh draft starts without one.
      next = { ...createFromTemplate(tpl?.id ?? "pahana", occasion, todayPlus(0)), hashtag: "" };
    }
    if (paletteId) next = { ...next, theme: { ...next.theme, paletteId, custom: undefined } };
    // The site is English only, so an older draft drops its other languages.
    next = { ...next, language: "en", languages: ["en"], translations: {} };
    // The draft lives in localStorage, so it can only be read after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setData(next);
    setReady(true);
  }, [saved, templateId, occasion, paletteId]);

  // Measure the preview stage so the phone always fits.
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const r = entry.contentRect;
      setStage({ w: Math.round(r.width), h: Math.round(r.height) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const persist = useCallback(async (newOwner?: OwnerInput): Promise<"ok" | "busy" | "error"> => {
    if (saving.current) return "ok";
    saving.current = true;
    setSaveState("saving");
    const snapshot = dataRef.current;
    try {
      const res = await saveInvitationAction(idRef.current, snapshot, newOwner);
      if (res.ok) {
        if (dataRef.current === snapshot) dirty.current = false;
        setData((cur) => adoptStoredImages(cur, res.data));
        setId(res.id);
        idRef.current = res.id;
        setSaveState("saved");
        return "ok";
      }
      setSaveState("error");
      return res.error === "busy" ? "busy" : "error";
    } catch {
      setSaveState("error");
      return "error";
    } finally {
      saving.current = false;
    }
  }, []);

  const saveLocal = useCallback(() => {
    try {
      window.localStorage.setItem(DRAFT_KEY, JSON.stringify(dataRef.current));
      setSaveState("local");
    } catch {
      // Storage full, usually from many photos. The draft stays in memory.
      setSaveState("error");
    }
  }, []);

  // Autosave: to the account when one exists, otherwise to this device.
  useEffect(() => {
    if (!ready || !dirty.current) return;
    const t = window.setTimeout(() => {
      if (idRef.current) void persist();
      else saveLocal();
    }, 1400);
    return () => window.clearTimeout(t);
  }, [data, ready, persist, saveLocal]);

  const change = useCallback((updater: (d: InvitationData) => InvitationData) => {
    dirty.current = true;
    setSaveState("dirty");
    setData(updater);
  }, []);

  const panelProps: PanelProps = {
    data,
    set: (patch) => change((d) => ({ ...d, ...patch })),
    setTheme: (patch: Partial<ThemeConfig>) => change((d) => ({ ...d, theme: { ...d.theme, ...patch } })),
    replace: (next) => change(() => next),
    replay: () => {
      setSkipRitual(false);
      setPreviewKey((k) => k + 1);
    },
  };

  const finish = async () => {
    if (idRef.current) {
      if (dirty.current) await persist();
      router.push(`/m/${idRef.current}`);
      return;
    }
    // First save: there is no account, so ask how the host wants to get back in.
    saveLocal();
    setOwnerError("");
    setAsking(true);
  };

  const createCard = async (e: React.FormEvent) => {
    e.preventDefault();
    const pin = owner.pin.replace(/\D/g, "");
    if (owner.pin && (pin.length < 4 || pin.length > 8)) {
      setOwnerError("Use 4 to 8 digits for the PIN, or leave it empty.");
      return;
    }
    setOwnerError("");
    const res = await persist({ ...owner, pin });
    if (res === "ok" && idRef.current) {
      rememberCard(idRef.current);
      window.localStorage.removeItem(DRAFT_KEY);
      router.push(`/m/${idRef.current}?new=1`);
    } else {
      setOwnerError(res === "busy" ? "Too many cards were created from this network. Please try again in an hour." : "Could not save. Please check your connection and try again.");
    }
  };

  const status =
    saveState === "saving" ? "Saving…"
    : saveState === "saved" ? "Saved"
    : saveState === "local" ? "Saved on this device"
    : saveState === "error" ? "Could not save"
    : saveState === "dirty" ? "Unsaved changes" : "";

  const isWideStage = stage ? stage.w >= 640 : false;
  const phoneWidth = stage ? Math.max(240, Math.min(390, Math.floor((stage.h - 40) * (390 / 844)), stage.w - 48)) : 320;

  const preview = (
    <InvitationView
      key={`${previewKey}-${phase}`}
      data={data}
      embedded
      skipRitual={skipRitual}
      phaseOverride={phase}
      wishes={demoWishes}
      guest={undefined}
    />
  );

  const ActivePanel = tabs.find((t) => t.id === desktopTab)!.Panel;
  const SheetPanel = tab ? tabs.find((t) => t.id === tab)!.Panel : null;

  const previewTools = (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <button
        type="button"
        onClick={panelProps.replay}
        className="flex h-9 items-center gap-1.5 rounded-full border border-fg/15 bg-page-2/80 px-3.5 text-[0.78rem] text-fg/90 backdrop-blur hover:border-fg/40"
      >
        <RotateCcw size={13} /> Replay opening
      </button>
      <div className="flex h-9 items-center rounded-full border border-fg/15 bg-page-2/80 p-0.5 backdrop-blur" role="group" aria-label="Preview moment">
        {(["before", "today", "after"] as Phase[]).map((p) => (
          <button
            key={p}
            type="button"
            aria-pressed={phase === p}
            onClick={() => {
              setSkipRitual(true);
              setPhase(p);
            }}
            className={`h-8 rounded-full px-3 text-[0.76rem] transition-colors ${phase === p ? "bg-brand text-on-brand" : "text-fg/90 hover:text-fg"}`}
          >
            {p === "before" ? "Before" : p === "today" ? "On the day" : "After"}
          </button>
        ))}
      </div>
      <div className="hidden h-9 items-center rounded-full border border-fg/15 bg-page-2/80 p-0.5 backdrop-blur lg:flex" role="group" aria-label="Preview size">
        <button type="button" aria-label="Phone preview" aria-pressed={device === "phone"} onClick={() => setDevice("phone")} className={`flex h-8 w-9 items-center justify-center rounded-full ${device === "phone" ? "bg-brand text-on-brand" : "text-fg/90"}`}>
          <Smartphone size={15} />
        </button>
        <button type="button" aria-label="Wide preview" aria-pressed={device === "wide"} onClick={() => setDevice("wide")} className={`flex h-8 w-9 items-center justify-center rounded-full ${device === "wide" ? "bg-brand text-on-brand" : "text-fg/90"}`}>
          <Monitor size={15} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 flex flex-col bg-page text-fg">
      {/* Top bar */}
      <header className="flex h-14 shrink-0 items-center gap-3 border-b border-fg/10 px-3 sm:px-4">
        <Link
          href={id ? `/m/${id}` : "/templates"}
          aria-label="Back"
          className="flex h-10 w-10 items-center justify-center rounded-full text-fg/90 hover:bg-fg/8 hover:text-fg"
        >
          <ArrowLeft size={18} />
        </Link>
        <div className="min-w-0 flex-1">
          <p className="truncate font-serif text-[1.15rem] leading-tight">{displayNames(data)}</p>
          <p className="truncate text-[0.75rem] text-fg/85" aria-live="polite">{status || "Design studio"}</p>
        </div>
        <Button size="sm" onClick={() => void finish()} disabled={saveState === "saving"}>
          {id ? "Done" : "Save & continue"}
        </Button>
      </header>

      <div className="flex min-h-0 flex-1">
        {/* Desktop editor */}
        <aside className="hidden w-[27rem] shrink-0 border-r border-fg/10 lg:flex">
          <nav className="flex w-[4.6rem] shrink-0 flex-col gap-1 border-r border-fg/10 p-2" aria-label="Editor sections">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setDesktopTab(t.id)}
                aria-pressed={desktopTab === t.id}
                className={`flex flex-col items-center gap-1 rounded-xl py-2.5 text-[0.75rem] transition-colors ${
                  desktopTab === t.id ? "bg-brand/12 text-brand" : "text-fg/85 hover:bg-fg/5 hover:text-fg"
                }`}
              >
                <t.icon size={19} strokeWidth={1.5} />
                {t.label}
              </button>
            ))}
          </nav>
          <div className="thin-scrollbar min-w-0 flex-1 overflow-y-auto">
            <ActivePanel {...panelProps} />
          </div>
        </aside>

        {/* Preview */}
        <main className="relative flex min-w-0 flex-1 flex-col">
          <div
            className="pointer-events-none absolute inset-0 hidden lg:block"
            style={{ background: "radial-gradient(60% 50% at 50% 40%, color-mix(in srgb, var(--color-brand) 10%, transparent), transparent 70%)" }}
          />
          <div ref={stageRef} className="relative min-h-0 flex-1">
            {stage && ready ? (
              isWideStage ? (
                <div className="absolute inset-0 flex items-center justify-center p-4">
                  {device === "phone" ? (
                    <PhoneFrame width={phoneWidth}>{preview}</PhoneFrame>
                  ) : (
                    <div className="relative h-full w-full max-w-5xl overflow-hidden rounded-2xl border border-fg/10">{preview}</div>
                  )}
                </div>
              ) : (
                <div className="absolute inset-0">{preview}</div>
              )
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="h-8 w-8 animate-spin rounded-full border-2 border-fg/15 border-t-brand" />
              </div>
            )}
          </div>
          {/* Preview tools */}
          <div className={`relative z-10 shrink-0 px-3 py-2.5 ${tab ? "hidden lg:block" : ""}`}>{previewTools}</div>
        </main>
      </div>

      {/* First save: no account, just a way back in */}
      {asking ? (
        <div className="fixed inset-0 z-[70] flex items-end justify-center bg-fg/60 p-0 backdrop-blur-sm sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-labelledby="owner-title">
          <form onSubmit={createCard} className="w-full max-w-md rounded-t-3xl border border-fg/15 bg-page-2 p-6 sm:rounded-3xl sm:p-8">
            <p className="label text-brand">Save your card</p>
            <h2 id="owner-title" className="display mt-3 text-4xl">No account needed.</h2>
            <p className="mt-3 text-sm leading-relaxed text-fg/85">
              Your card gets a private manage link. Keep it safe, because anyone with it can edit the card. Add a PIN so you
              can get back in from any phone.
            </p>
            <div className="mt-6 grid gap-4">
              <Field label="Your name (optional)">
                <Input value={owner.name} maxLength={80} autoComplete="name" onChange={(e) => setOwner({ ...owner, name: e.target.value })} />
              </Field>
              <Field label="WhatsApp number or email (optional)" hint="Only used to help you if you lose your link.">
                <Input value={owner.contact} maxLength={120} onChange={(e) => setOwner({ ...owner, contact: e.target.value })} />
              </Field>
              <Field label="Edit PIN (recommended)" hint="4 to 8 digits. With your invitation link, this opens the card on any device.">
                <Input value={owner.pin} inputMode="numeric" maxLength={8} autoComplete="off" placeholder="For example 4827" onChange={(e) => setOwner({ ...owner, pin: e.target.value })} />
              </Field>
            </div>
            {ownerError ? <p role="alert" className="mt-4 text-sm text-red-700">{ownerError}</p> : null}
            <div className="mt-6 flex gap-2">
              <Button type="button" variant="secondary" onClick={() => setAsking(false)} className="flex-1">Keep editing</Button>
              <Button type="submit" disabled={saveState === "saving"} className="flex-1">{saveState === "saving" ? "Saving…" : "Create my card"}</Button>
            </div>
          </form>
        </div>
      ) : null}

      {/* Mobile editor: bottom tabs with a sheet */}
      <div className="shrink-0 lg:hidden">
        {tab && SheetPanel ? (
          <div className="fixed inset-x-0 bottom-[4.25rem] z-40 flex max-h-[58dvh] flex-col rounded-t-3xl border-t border-fg/15 bg-page-2 shadow-[0_-20px_60px_color-mix(in_srgb,var(--color-fg)_25%,transparent)]">
            <div className="flex shrink-0 items-center justify-between px-5 pb-1 pt-3">
              <p className="font-serif text-xl">{tabs.find((t) => t.id === tab)!.label}</p>
              <button type="button" aria-label="Close editor" onClick={() => setTab(null)} className="flex h-10 w-10 items-center justify-center rounded-full bg-fg/8 text-fg/90">
                <X size={18} />
              </button>
            </div>
            <div className="thin-scrollbar min-h-0 flex-1 overflow-y-auto overscroll-contain pb-4">
              <SheetPanel {...panelProps} />
            </div>
          </div>
        ) : null}
        <nav className="relative z-50 grid h-[4.25rem] grid-cols-5 border-t border-fg/10 bg-page-2 pb-[env(safe-area-inset-bottom)]" aria-label="Editor sections">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(tab === t.id ? null : t.id)}
              aria-pressed={tab === t.id}
              className={`flex flex-col items-center justify-center gap-1 text-[0.75rem] ${tab === t.id ? "text-brand" : "text-fg/85"}`}
            >
              <t.icon size={20} strokeWidth={1.5} />
              {t.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
