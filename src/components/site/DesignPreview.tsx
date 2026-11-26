"use client";

import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, Pause, Play, RotateCcw, X } from "lucide-react";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { useReducedMotion } from "@/components/invitation/hooks";
import { LikeButton } from "@/components/site/LikeButton";
import { ButtonLink, PhoneFrame } from "@/components/ui/kit";
import { demoWishesFor } from "@/lib/invitation/demo";
import { createFromTemplate } from "@/lib/invitation/templates";
import type { OccasionId } from "@/lib/invitation/types";

function Spinner() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-fg/15 border-t-brand" />
    </div>
  );
}

const InvitationView = dynamic(() => import("@/components/invitation/InvitationView").then((m) => m.InvitationView), {
  ssr: false,
  loading: Spinner,
});

/** Pixels a second, at the phone's own size */
const SPEED = 90;
const FIRST_PAUSE = 1400;
/** How long to leave the card alone after someone scrolls it themselves */
const HANDS_OFF = 2500;

/**
 * Scroll slowly to the end, giving way whenever the visitor scrolls, touches or types.
 * Session is 0 while stopped, and a new number whenever the card was drawn afresh.
 */
function useAutoScroll(scrollerRef: RefObject<HTMLDivElement | null>, session: number, holdRef: RefObject<number>, onEnd: () => void) {
  useEffect(() => {
    const el = scrollerRef.current;
    if (!session || !el) return;
    let frame = 0;
    let last = performance.now();
    let pos = el.scrollTop;
    let pressed = false;
    holdRef.current = Math.max(holdRef.current, last + FIRST_PAUSE);

    const touch = () => {
      holdRef.current = performance.now() + HANDS_OFF;
    };
    const press = () => {
      pressed = true;
      touch();
    };
    const release = () => {
      pressed = false;
      touch();
    };
    const step = (t: number) => {
      const dt = Math.min(64, Math.max(0, t - last));
      last = t;
      const end = el.scrollHeight - el.clientHeight;
      const typing = el.contains(document.activeElement) && document.activeElement?.matches("input, textarea, select");
      if (pressed || typing || t < holdRef.current || end <= 0) {
        pos = el.scrollTop;
      } else {
        // Browsers round scrollTop, so keep the exact place here unless something else moved the card.
        if (Math.abs(el.scrollTop - pos) > 2) pos = el.scrollTop;
        pos = Math.min(end, pos + (dt * SPEED) / 1000);
        el.scrollTop = pos;
        if (pos >= end - 1) {
          onEnd();
          return;
        }
      }
      frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    el.addEventListener("wheel", touch, { passive: true });
    el.addEventListener("keydown", touch);
    el.addEventListener("pointerdown", press);
    el.addEventListener("touchstart", press, { passive: true });
    window.addEventListener("pointerup", release);
    window.addEventListener("touchend", release);
    window.addEventListener("touchcancel", release);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("wheel", touch);
      el.removeEventListener("keydown", touch);
      el.removeEventListener("pointerdown", press);
      el.removeEventListener("touchstart", press);
      window.removeEventListener("pointerup", release);
      window.removeEventListener("touchend", release);
      window.removeEventListener("touchcancel", release);
    };
  }, [scrollerRef, session, holdRef, onEnd]);
}

function Round({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-fg/15 bg-page-2 text-fg/90 transition-colors hover:border-fg/40 hover:text-fg"
    >
      {children}
    </button>
  );
}

export interface DesignPreviewProps {
  id: string;
  name: string;
  meaning: string;
  occasion: OccasionId;
  hasOpening: boolean;
  /** For example "3 of 54" */
  place: string;
  useHref: string;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
}

/** A design in a popup. It scrolls by itself, and visitors can scroll it and move between designs. */
export function DesignPreview(props: DesignPreviewProps) {
  const { onClose, onPrevious, onNext } = props;
  const dialog = useRef<HTMLDialogElement | null>(null);
  const reduced = useReducedMotion();
  // Null until the visitor chooses. Carried from one design to the next.
  const [choice, setChoice] = useState<boolean | null>(null);

  useEffect(() => {
    const el = dialog.current;
    if (el && !el.open) el.showModal();
    const before = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = before;
    };
  }, []);

  return (
    <dialog
      ref={dialog}
      aria-label={`${props.name} preview`}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onKeyDown={(e) => {
        if ((e.target as HTMLElement).matches("input, textarea, select")) return;
        if (e.key === "ArrowLeft") onPrevious();
        else if (e.key === "ArrowRight") onNext();
      }}
      className="m-0 h-dvh max-h-none w-full max-w-none overflow-hidden border-fg/10 bg-page p-0 text-fg backdrop:bg-black/70 backdrop:backdrop-blur-sm sm:m-auto sm:h-[95dvh] sm:max-w-xl sm:rounded-3xl sm:border"
    >
      <Stage key={props.id} {...props} auto={choice ?? !reduced} setAuto={setChoice} />
    </dialog>
  );
}

function Stage({
  id,
  name,
  meaning,
  occasion,
  hasOpening,
  place,
  useHref,
  onClose,
  onPrevious,
  onNext,
  auto,
  setAuto,
}: DesignPreviewProps & { auto: boolean; setAuto: (v: boolean) => void }) {
  const [data] = useState(() => createFromTemplate(id, occasion));
  const [wishes] = useState(() => demoWishesFor(occasion));
  const [run, setRun] = useState(0);
  const [opening, setOpening] = useState(false);
  // How many times a card has been drawn and is past its opening. 0 while the opening is up.
  const [entered, setEntered] = useState(0);
  const [ended, setEnded] = useState(false);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  const stage = useRef<HTMLDivElement | null>(null);
  const scroller = useRef<HTMLDivElement | null>(null);
  const holdRef = useRef(0);

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setSize({ w: Math.round(entry.contentRect.width), h: Math.round(entry.contentRect.height) }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const running = auto && entered > 0 && !ended;
  useAutoScroll(scroller, running ? entered : 0, holdRef, useCallback(() => setEnded(true), []));
  const enter = useCallback(() => setEntered((n) => n + 1), []);

  const move = (by: -1 | 1) => {
    const el = scroller.current;
    if (!el) return;
    holdRef.current = performance.now() + HANDS_OFF;
    if (by < 0) setEnded(false);
    el.scrollBy({ top: by * el.clientHeight * 0.75, behavior: "smooth" });
  };
  const toggle = () => {
    if (running) return setAuto(false);
    if (ended) {
      scroller.current?.scrollTo({ top: 0 });
      setEnded(false);
    }
    setAuto(true);
  };
  const playOpening = () => {
    setEntered(0);
    setEnded(false);
    setOpening(true);
    setRun((r) => r + 1);
  };

  const view = (
    <InvitationView
      key={run}
      data={data}
      embedded
      lite
      wishes={wishes}
      skipRitual={!opening}
      scrollerRef={scroller}
      onEntered={enter}
    />
  );
  const framed = size ? size.w >= 460 : false;

  return (
    <div className="flex h-full flex-col">
      <header className="flex shrink-0 items-center gap-3 border-b border-fg/10 py-2 pl-5 pr-2">
        <div className="min-w-0 flex-1">
          <h2 className="truncate font-serif text-[1.5rem] leading-tight">{name}</h2>
          <p className="truncate text-[0.8rem] text-fg/85">
            {meaning}
            {place ? ` · ${place}` : ""}
          </p>
        </div>
        <LikeButton id={id} name={name} />
        <button type="button" onClick={onClose} aria-label="Close preview" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-fg/90 hover:bg-fg/8 hover:text-fg">
          <X size={20} />
        </button>
      </header>

      <div ref={stage} className="relative min-h-0 flex-1 overflow-hidden">
        {size ? (
          framed ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <PhoneFrame width={Math.max(200, Math.min(390, Math.floor((size.h - 44) * (390 / 844))))}>{view}</PhoneFrame>
            </div>
          ) : (
            <div className="absolute inset-0">{view}</div>
          )
        ) : (
          <Spinner />
        )}
      </div>

      <footer className="grid shrink-0 gap-2 border-t [@media(max-height:520px)]:flex [@media(max-height:520px)]:overflow-x-auto [@media(max-height:520px)]:[&>*]:shrink-0 border-fg/10 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2.5">
        <div className="flex items-center justify-between gap-2">
          <Round label="Previous design" onClick={onPrevious}><ChevronLeft size={19} /></Round>
          <div className="flex items-center gap-2">
            <Round label="Scroll up" onClick={() => move(-1)}><ArrowUp size={18} /></Round>
            <Round label={running ? "Pause scrolling" : ended ? "Scroll again from the top" : "Scroll automatically"} onClick={toggle}>
              {running ? <Pause size={18} /> : ended ? <RotateCcw size={17} /> : <Play size={18} />}
            </Round>
            <Round label="Scroll down" onClick={() => move(1)}><ArrowDown size={18} /></Round>
          </div>
          <Round label="Next design" onClick={onNext}><ChevronRight size={19} /></Round>
        </div>
        <div className="flex gap-2 [&>*]:flex-1">
          {hasOpening ? (
            <button type="button" onClick={playOpening} className="h-11 rounded-full border border-fg/15 px-4 text-[0.86rem] text-fg/90 hover:border-fg/40">
              Play the opening
            </button>
          ) : null}
          <ButtonLink href={useHref}>Use this design</ButtonLink>
        </div>
      </footer>
    </div>
  );
}
