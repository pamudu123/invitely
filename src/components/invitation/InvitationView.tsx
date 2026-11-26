"use client";

import { Music, VolumeX } from "lucide-react";
import { useCallback, useEffect, useMemo, useState, type CSSProperties, type Ref } from "react";
import { getLabels, languageNames } from "@/lib/invitation/labels";
import { photoBehindCover } from "@/lib/invitation/cover";
import { getPalette, themeVars } from "@/lib/invitation/theme";
import { usesScene } from "@/lib/invitation/scenes";
import { zonedToUtc } from "@/lib/invitation/time";
import type { GuestContext, InvitationData, LanguageId, SectionId, WishItem } from "@/lib/invitation/types";
import { useAmbient } from "./ambient";
import { AmbientEffect } from "./Effects";
import { useNow } from "./hooks";
import { RitualOverlay } from "./rituals";
import { SceneLiveContext } from "./scene3d/useScene";
import { RsvpSection, type PriorRsvp, type RsvpHandler } from "./RsvpForm";
import {
  CountdownSection,
  DetailsSection,
  Footer,
  GallerySection,
  GiftSection,
  Hero,
  MessageSection,
  NekathSection,
  ScheduleSection,
  StorySection,
  VenueSection,
  WishesSection,
  type Phase,
  type SectionProps,
} from "./sections";

export interface InvitationViewProps {
  data: InvitationData;
  /** True when rendered inside a sized frame (studio and template previews) instead of the full page. */
  embedded?: boolean;
  guest?: GuestContext;
  wishes?: WishItem[];
  onRsvp?: RsvpHandler;
  priorRsvp?: PriorRsvp | null;
  /** Skip the opening cover */
  skipRitual?: boolean;
  /** Force a phase, used by the studio to preview the day-of and after views */
  phaseOverride?: Phase;
  /** Hide heavy embeds such as the map */
  lite?: boolean;
  branding?: boolean;
  /** Start with this language */
  initialLanguage?: LanguageId;
  /** The scrolling element, in embedded mode */
  scrollerRef?: Ref<HTMLDivElement>;
  /** Called once the opening is over and the card can be scrolled */
  onEntered?: () => void;
}

const demoRsvp: RsvpHandler = async () => {
  await new Promise((r) => setTimeout(r, 700));
  return { ok: true };
};

export function InvitationView({
  data,
  embedded = false,
  guest,
  wishes = [],
  onRsvp = demoRsvp,
  priorRsvp,
  skipRitual = false,
  phaseOverride,
  lite = false,
  branding = true,
  initialLanguage,
  scrollerRef,
  onEntered,
}: InvitationViewProps) {
  const hasRitual = data.theme.ritual !== "none" && !skipRitual;
  const [opened, setOpened] = useState(!hasRitual);
  const [coverGone, setCoverGone] = useState(!hasRitual);
  const [lang, setLang] = useState<LanguageId>(initialLanguage ?? data.language);
  const music = useAmbient(data.theme.music, data.theme.musicUrl);
  const now = useNow(30_000);

  const activeLang = data.languages.includes(lang) ? lang : data.language;
  const labels = getLabels(activeLang);
  const palette = getPalette(data.theme);

  const phase: Phase = useMemo(() => {
    if (phaseOverride) return phaseOverride;
    if (now === null) return "before";
    const dayStart = zonedToUtc(data.date, "00:00", data.timezone);
    if (Number.isNaN(dayStart) || now < dayStart) return "before";
    if (now < dayStart + 30 * 3600_000) return "today";
    return "after";
  }, [phaseOverride, now, data.date, data.timezone]);

  useEffect(() => {
    if (coverGone) onEntered?.();
  }, [coverGone, onEntered]);

  // Lock page scroll while the cover is up (full page mode only).
  useEffect(() => {
    if (embedded || coverGone) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prev;
    };
  }, [embedded, coverGone]);

  // Match the phone's browser bar to the invitation (full page mode only).
  const barColor = coverGone ? palette.bg : palette.deep;
  useEffect(() => {
    if (embedded) return;
    let meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "theme-color";
      document.head.appendChild(meta);
    }
    const prev = meta.content;
    meta.content = barColor;
    return () => {
      if (meta) meta.content = prev;
    };
  }, [embedded, barColor]);

  const startMusic = music.start;
  const handleOpen = useCallback(() => {
    setOpened(true);
    startMusic();
  }, [startMusic]);

  const vars = themeVars(data.theme) as CSSProperties;
  const shellStyle: CSSProperties = {
    ...vars,
    ["--inv-screen" as string]: embedded ? "100cqh" : "100svh",
  };

  const common: SectionProps = { data, labels, lang: activeLang, guest, phase };

  const sectionBody = (id: SectionId) => {
    switch (id) {
      case "message": return <MessageSection {...common} />;
      case "countdown": return <CountdownSection {...common} />;
      case "nekath": return <NekathSection {...common} />;
      case "schedule": return <ScheduleSection {...common} />;
      case "venue": return <VenueSection {...common} showMap={!lite} />;
      case "story": return <StorySection {...common} />;
      case "gallery": return <GallerySection {...common} fixed={!embedded} />;
      case "details": return <DetailsSection {...common} />;
      case "gift": return <GiftSection {...common} />;
      case "rsvp": return <RsvpSection {...common} onSubmit={onRsvp} prior={priorRsvp} />;
      case "wishes": return <WishesSection {...common} wishes={wishes} />;
      default: return null;
    }
  };

  // Each part sits in a named wrapper, so a review note can say exactly where it points.
  const renderSection = (id: SectionId) => (
    <div key={id} data-section={id} style={{ position: "relative" }}>
      {sectionBody(id)}
    </div>
  );

  // After the day, lead with the thank you note even if the message section was hidden.
  const sections: SectionId[] =
    phase === "after" && !data.sections.includes("message") ? ["message", ...data.sections] : data.sections;

  // The host's photo behind a paper cover, with enough paper colour over it to keep the words readable.
  const behind = photoBehindCover(data);
  const coverVars = (
    behind ? { "--cover-mount": "transparent", "--cover-paper": `color-mix(in srgb, var(--inv-bg) ${data.coverWash}%, transparent)` } : {}
  ) as CSSProperties;

  const content = (
    <div className={`inv-root ${opened ? "" : "inv-waiting"}`} lang={activeLang}>
      <div data-section="cover" style={{ position: "relative", isolation: "isolate", ...coverVars }}>
        {behind ? (
          <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={data.heroPhoto} alt="" className="h-full w-full object-cover" />
            {data.theme.hero === "frame" ? null : <div className="absolute inset-0" style={{ background: "var(--cover-paper)" }} />}
          </div>
        ) : null}
        <SceneLiveContext value={coverGone}>
          <Hero {...common} />
        </SceneLiveContext>
      </div>
      {sections.map(renderSection)}
      <div data-section="footer" style={{ position: "relative" }}>
        <Footer {...common} branding={branding} />
      </div>
    </div>
  );

  const pos = embedded ? "absolute" : "fixed";

  return (
    <div className={`inv-shell ${usesScene(data.theme) ? "inv-3d" : ""} ${embedded ? "absolute inset-0 overflow-hidden" : "relative"}`} style={{ ...shellStyle, background: palette.bg }}>
      {embedded ? (
        <div
          ref={scrollerRef}
          className="no-scrollbar absolute inset-0 overflow-x-hidden"
          style={{ containerType: "size", overflowY: coverGone ? "auto" : "hidden" }}
        >
          {content}
        </div>
      ) : (
        content
      )}

      {coverGone ? <AmbientEffect kind={data.theme.effect} color={data.theme.effect === "snow" && palette.dark ? "#ffffff" : palette.accent} fixed={!embedded} /> : null}

      {!coverGone ? (
        <RitualOverlay
          data={data}
          guestName={guest?.name}
          fixed={!embedded}
          onOpen={handleOpen}
          onFinished={() => setCoverGone(true)}
        />
      ) : null}

      {coverGone ? (
        <div className={`${pos} bottom-4 left-4 z-30 flex items-center gap-2`}>
          {data.languages.length > 1 ? (
            <div
              className="flex overflow-hidden rounded-full border backdrop-blur-md"
              style={{ borderColor: "var(--inv-line)", background: "color-mix(in srgb, var(--inv-bg) 78%, transparent)" }}
              role="group"
              aria-label={labels.language}
            >
              {data.languages.map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLang(l)}
                  aria-pressed={activeLang === l}
                  className="min-h-11 px-3.5 text-[0.8rem] transition-colors"
                  style={{
                    background: activeLang === l ? "var(--inv-accent)" : "transparent",
                    color: activeLang === l ? "var(--inv-bg)" : "var(--inv-ink)",
                  }}
                >
                  {languageNames[l].native}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}

      {coverGone && music.available ? (
        <button
          type="button"
          onClick={music.toggle}
          aria-label={labels.music}
          aria-pressed={music.playing}
          className={`${pos} bottom-4 right-4 z-30 flex h-11 w-11 items-center justify-center rounded-full border backdrop-blur-md transition-transform active:scale-95`}
          style={{
            borderColor: "var(--inv-accent)",
            background: "color-mix(in srgb, var(--inv-bg) 78%, transparent)",
            color: "var(--inv-accent)",
          }}
        >
          {music.playing ? (
            <span className="flex h-4 items-end gap-[3px]" aria-hidden="true">
              {[0, 1, 2, 3].map((i) => (
                <span key={i} className="w-[2.5px] origin-bottom rounded-full bg-current" style={{ height: "100%", animation: `inv-eq 0.9s ease-in-out ${i * 0.16}s infinite alternate` }} />
              ))}
            </span>
          ) : music.playing === false && opened ? (
            <VolumeX size={17} strokeWidth={1.6} />
          ) : (
            <Music size={17} strokeWidth={1.6} />
          )}
        </button>
      ) : null}
    </div>
  );
}
