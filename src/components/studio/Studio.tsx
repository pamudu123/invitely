"use client";

import {
  ArrowLeft,
  Clock,
  Languages,
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
import { saveInvitationAction } from "@/app/actions/invitations";
import { InvitationView } from "@/components/invitation/InvitationView";
import type { Phase } from "@/components/invitation/sections";
import { Button, PhoneFrame } from "@/components/ui/kit";
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
  LanguagePanel,
  RsvpPanel,
  SchedulePanel,
  SectionsPanel,
  type PanelProps,
} from "./panels";

const DRAFT_KEY = "invitely:draft:v1";

type TabId = "design" | "details" | "schedule" | "sections" | "rsvp" | "languages";

const tabs: { id: TabId; label: string; icon: typeof Palette; Panel: (p: PanelProps) => React.ReactElement }[] = [
  { id: "design", label: "Design", icon: Palette, Panel: DesignPanel },
  { id: "details", label: "Details", icon: PenLine, Panel: DetailsPanel },
  { id: "schedule", label: "Schedule", icon: Clock, Panel: SchedulePanel },
  { id: "sections", label: "Sections", icon: LayoutList, Panel: SectionsPanel },
  { id: "rsvp", label: "RSVP", icon: MailCheck, Panel: RsvpPanel },
  { id: "languages", label: "Language", icon: Languages, Panel: LanguagePanel },
];

type SaveState = "idle" | "dirty" | "saving" | "saved" | "local" | "error";

export interface StudioProps {
  /** Saved invitation being edited, or undefined for a new draft */
  saved?: { id: string; slug: string; status: "draft" | "published"; data: InvitationData };
  templateId?: string;
  occasion?: OccasionId;
  /** Came back from sign up with a local draft waiting to be saved */
  resume?: boolean;
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

export function Studio({ saved, templateId, occasion, resume }: StudioProps) {
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
    if (draft && (resume || !tpl || draft.occasion === wanted)) {
      next = tpl && draft.templateId !== tpl.id && !resume ? applyTemplateDesign(draft, tpl.id) : draft;
    } else {
      // Sample hashtags belong to the sample names, so a fresh draft starts without one.
      next = { ...createFromTemplate(tpl?.id ?? "pahana", occasion, todayPlus(0)), hashtag: "" };
    }
    // The draft lives in localStorage, so it can only be read after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setData(next);
    setReady(true);
  }, [saved, templateId, occasion, resume]);

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

  const persist = useCallback(async (): Promise<"ok" | "auth" | "error"> => {
    if (saving.current) return "ok";
    saving.current = true;
    setSaveState("saving");
    const snapshot = dataRef.current;
    try {
      const res = await saveInvitationAction(idRef.current, snapshot);
      if (res.ok) {
        if (dataRef.current === snapshot) dirty.current = false;
        setData((cur) => adoptStoredImages(cur, res.data));
        setId(res.id);
        idRef.current = res.id;
        setSaveState("saved");
        return "ok";
      }
      setSaveState(res.error === "auth" ? "local" : "error");
      return res.error === "auth" ? "auth" : "error";
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

  // Returning from sign up: store the waiting draft in the new account.
  const resumed = useRef(false);
  useEffect(() => {
    if (!resume || !ready || saved || resumed.current) return;
    resumed.current = true;
    void (async () => {
      const res = await persist();
      if (res === "ok" && idRef.current) {
        window.localStorage.removeItem(DRAFT_KEY);
        router.replace(`/studio/${idRef.current}`);
      }
    })();
  }, [resume, ready, saved, persist, router]);

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
      router.push(`/dashboard/${idRef.current}`);
      return;
    }
    saveLocal();
    const res = await persist();
    if (res === "ok" && idRef.current) {
      window.localStorage.removeItem(DRAFT_KEY);
      router.push(`/dashboard/${idRef.current}`);
    } else if (res === "auth") {
      router.push(`/signup?next=${encodeURIComponent("/studio/new?resume=1")}`);
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
        className="flex h-9 items-center gap-1.5 rounded-full border border-paper/15 bg-night-2/80 px-3.5 text-[0.78rem] text-paper/80 backdrop-blur hover:border-paper/40"
      >
        <RotateCcw size={13} /> Replay opening
      </button>
      <div className="flex h-9 items-center rounded-full border border-paper/15 bg-night-2/80 p-0.5 backdrop-blur" role="group" aria-label="Preview moment">
        {(["before", "today", "after"] as Phase[]).map((p) => (
          <button
            key={p}
            type="button"
            aria-pressed={phase === p}
            onClick={() => {
              setSkipRitual(true);
              setPhase(p);
            }}
            className={`h-8 rounded-full px-3 text-[0.76rem] transition-colors ${phase === p ? "bg-flame text-night" : "text-paper/65 hover:text-paper"}`}
          >
            {p === "before" ? "Before" : p === "today" ? "On the day" : "After"}
          </button>
        ))}
      </div>
      <div className="hidden h-9 items-center rounded-full border border-paper/15 bg-night-2/80 p-0.5 backdrop-blur lg:flex" role="group" aria-label="Preview size">
        <button type="button" aria-label="Phone preview" aria-pressed={device === "phone"} onClick={() => setDevice("phone")} className={`flex h-8 w-9 items-center justify-center rounded-full ${device === "phone" ? "bg-flame text-night" : "text-paper/65"}`}>
          <Smartphone size={15} />
        </button>
        <button type="button" aria-label="Wide preview" aria-pressed={device === "wide"} onClick={() => setDevice("wide")} className={`flex h-8 w-9 items-center justify-center rounded-full ${device === "wide" ? "bg-flame text-night" : "text-paper/65"}`}>
          <Monitor size={15} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 flex flex-col bg-night text-paper">
      {/* Top bar */}
      <header className="flex h-14 shrink-0 items-center gap-3 border-b border-paper/10 px-3 sm:px-4">
        <Link
          href={id ? `/dashboard/${id}` : "/templates"}
          aria-label="Back"
          className="flex h-10 w-10 items-center justify-center rounded-full text-paper/70 hover:bg-paper/8 hover:text-paper"
        >
          <ArrowLeft size={18} />
        </Link>
        <div className="min-w-0 flex-1">
          <p className="truncate font-serif text-[1.15rem] leading-tight">{displayNames(data)}</p>
          <p className="truncate text-[0.7rem] text-paper/45" aria-live="polite">{status || "Design studio"}</p>
        </div>
        <Button size="sm" onClick={() => void finish()} disabled={saveState === "saving"}>
          {id ? "Done" : "Save & continue"}
        </Button>
      </header>

      <div className="flex min-h-0 flex-1">
        {/* Desktop editor */}
        <aside className="hidden w-[27rem] shrink-0 border-r border-paper/10 lg:flex">
          <nav className="flex w-[4.6rem] shrink-0 flex-col gap-1 border-r border-paper/10 p-2" aria-label="Editor sections">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setDesktopTab(t.id)}
                aria-pressed={desktopTab === t.id}
                className={`flex flex-col items-center gap-1 rounded-xl py-2.5 text-[0.64rem] transition-colors ${
                  desktopTab === t.id ? "bg-flame/12 text-flame" : "text-paper/55 hover:bg-paper/5 hover:text-paper"
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
            style={{ background: "radial-gradient(60% 50% at 50% 40%, rgba(232,181,101,0.09), transparent 70%)" }}
          />
          <div ref={stageRef} className="relative min-h-0 flex-1">
            {stage && ready ? (
              isWideStage ? (
                <div className="absolute inset-0 flex items-center justify-center p-4">
                  {device === "phone" ? (
                    <PhoneFrame width={phoneWidth}>{preview}</PhoneFrame>
                  ) : (
                    <div className="relative h-full w-full max-w-5xl overflow-hidden rounded-2xl border border-paper/10">{preview}</div>
                  )}
                </div>
              ) : (
                <div className="absolute inset-0">{preview}</div>
              )
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="h-8 w-8 animate-spin rounded-full border-2 border-paper/15 border-t-flame" />
              </div>
            )}
          </div>
          {/* Preview tools */}
          <div className={`relative z-10 shrink-0 px-3 py-2.5 ${tab ? "hidden lg:block" : ""}`}>{previewTools}</div>
        </main>
      </div>

      {/* Mobile editor: bottom tabs with a sheet */}
      <div className="shrink-0 lg:hidden">
        {tab && SheetPanel ? (
          <div className="fixed inset-x-0 bottom-[4.25rem] z-40 flex max-h-[58dvh] flex-col rounded-t-3xl border-t border-paper/15 bg-night-2 shadow-[0_-20px_60px_rgba(0,0,0,0.6)]">
            <div className="flex shrink-0 items-center justify-between px-5 pb-1 pt-3">
              <p className="font-serif text-xl">{tabs.find((t) => t.id === tab)!.label}</p>
              <button type="button" aria-label="Close editor" onClick={() => setTab(null)} className="flex h-10 w-10 items-center justify-center rounded-full bg-paper/8 text-paper/80">
                <X size={18} />
              </button>
            </div>
            <div className="thin-scrollbar min-h-0 flex-1 overflow-y-auto overscroll-contain pb-4">
              <SheetPanel {...panelProps} />
            </div>
          </div>
        ) : null}
        <nav className="relative z-50 grid h-[4.25rem] grid-cols-6 border-t border-paper/10 bg-night-2 pb-[env(safe-area-inset-bottom)]" aria-label="Editor sections">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(tab === t.id ? null : t.id)}
              aria-pressed={tab === t.id}
              className={`flex flex-col items-center justify-center gap-1 text-[0.62rem] ${tab === t.id ? "text-flame" : "text-paper/60"}`}
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
