"use client";

import { createContext, useContext, useEffect, useRef, useState, type CSSProperties, type RefObject } from "react";
import { sceneInfo } from "@/lib/invitation/scenes";
import type { SceneId } from "@/lib/invitation/types";
import type { SceneHandle } from "./engine";

/** True once the opening is over and the cover is on show. Thumbnails leave it false and draw the still. */
export const SceneLiveContext = createContext(false);

export function useSceneLive(): boolean {
  return useContext(SceneLiveContext);
}

/** Guests who asked for less motion or less data get the still picture. */
function wantsStill(): boolean {
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches || connection?.saveData === true;
}

function scrollParent(el: HTMLElement): HTMLElement | null {
  for (let p = el.parentElement; p; p = p.parentElement) {
    if (/(auto|scroll)/.test(getComputedStyle(p).overflowY)) return p === document.body || p === document.documentElement ? null : p;
  }
  return null;
}

export type SceneState = "still" | "loading" | "ready";

export interface SceneApi {
  layerRef: RefObject<HTMLDivElement | null>;
  frameRef: RefObject<HTMLDivElement | null>;
  handle: RefObject<SceneHandle | null>;
  state: SceneState;
}

/** Runs a 3D scene in layerRef, framed on frameRef. three.js is only fetched when this is live. */
export function useScene({ scene, live, pose, interactive = false, followScroll = false }: {
  scene: SceneId;
  live: boolean;
  pose: number;
  interactive?: boolean;
  followScroll?: boolean;
}): SceneApi {
  const layerRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const handle = useRef<SceneHandle | null>(null);
  const [state, setState] = useState<SceneState>("loading");

  useEffect(() => {
    const layer = layerRef.current;
    const frame = frameRef.current;
    if (!live || !layer || !frame) return;
    const abort = new AbortController();
    // A fresh canvas every time, because a released one cannot be drawn to again.
    const canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    canvas.style.cssText = `position:absolute;inset:0;width:100%;height:100%;touch-action:pan-y;outline:none;${interactive ? "cursor:grab;" : "pointer-events:none;"}`;

    const start = async () => {
      if (wantsStill()) {
        setState("still");
        return;
      }
      setState("loading");
      try {
        const { mountScene } = await import("./engine");
        if (abort.signal.aborted) return;
        layer.appendChild(canvas);
        const h = await mountScene({
          canvas, frame, scene, pose, interactive,
          onReady: () => setState("ready"),
          onLost: () => {
            handle.current?.dispose();
            handle.current = null;
            canvas.remove();
            setState("still");
          },
        }, abort.signal);
        if (abort.signal.aborted) {
          h?.dispose();
          return;
        }
        handle.current = h;
      } catch {
        // No WebGL on this phone. The still picture stays in place.
        canvas.remove();
        if (!abort.signal.aborted) setState("still");
      }
    };
    void start();

    let queued = 0;
    const onScroll = () => {
      if (queued) return;
      queued = requestAnimationFrame(() => {
        queued = 0;
        const parent = scrollParent(layer);
        const r = layer.getBoundingClientRect();
        const top = parent ? parent.getBoundingClientRect().top : 0;
        handle.current?.setScroll(r.height ? Math.min(1, Math.max(0, (top - r.top) / r.height)) : 0);
      });
    };
    if (followScroll) document.addEventListener("scroll", onScroll, { capture: true, passive: true });

    return () => {
      abort.abort();
      cancelAnimationFrame(queued);
      document.removeEventListener("scroll", onScroll, { capture: true });
      handle.current?.dispose();
      handle.current = null;
      canvas.remove();
    };
  }, [scene, live, pose, interactive, followScroll]);

  return { layerRef, frameRef, handle, state: live ? state : "still" };
}

/** Picture of the scene at rest. Same framing as the live scene, so the swap is not noticeable. */
export function SceneStill({ scene, hidden = false, className = "", style }: { scene: SceneId; hidden?: boolean; className?: string; style?: CSSProperties }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/scenes/${scene}.webp`}
      alt={sceneInfo[scene].alt}
      width={760}
      height={760}
      draggable={false}
      decoding="async"
      className={`pointer-events-none block h-full w-full select-none ${className}`}
      style={{ ...style, opacity: hidden ? 0 : 1, transition: hidden ? "opacity 0.2s linear 0.1s" : undefined }}
    />
  );
}
