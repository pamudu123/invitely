"use client";

import { useRef, useState } from "react";
import { sceneInfo, themeScene } from "@/lib/invitation/scenes";
import { SceneBackdrop } from "../scene3d/backdrops";
import { SceneStill, useScene } from "../scene3d/useScene";
import { CoverTitle, Hint, SkipButton, type RitualProps } from "./shared";

/** Plays the scene's own action: the ball hits the stumps, the gavel falls, the laptop opens. */
export function PlayRitual({ data, guestName, onOpen, onDone }: RitualProps) {
  const scene = themeScene(data.theme);
  const info = sceneInfo[scene];
  const { layerRef, frameRef, handle, state } = useScene({ scene, live: true, pose: 0 });
  const [started, setStarted] = useState(false);
  const finished = useRef(false);

  const finish = () => {
    if (finished.current) return;
    finished.current = true;
    onDone();
  };
  const start = async () => {
    if (started) return;
    setStarted(true);
    onOpen();
    // On a slow connection, wait a moment for the scene and then go on without it.
    for (let i = 0; i < 12 && !handle.current && state === "loading"; i++) await new Promise((r) => setTimeout(r, 100));
    if (!handle.current) {
      window.setTimeout(finish, 350);
      return;
    }
    // Never leave a guest waiting, even if the phone stalls part way.
    const guard = window.setTimeout(finish, 4500);
    await handle.current.play();
    window.setTimeout(() => {
      window.clearTimeout(guard);
      finish();
    }, 320);
  };

  // Before the action the still only matches scenes that rest in their first pose.
  const showStill = state === "still" || (state === "loading" && info.rest === 0);

  return (
    <div className="absolute inset-0 isolate overflow-hidden" style={{ background: "var(--inv-deep)", color: "var(--inv-on-deep)", ["--inv-ink" as string]: "var(--inv-on-deep)", ["--inv-screen" as string]: "100cqh" }}>
      <div
        className="absolute inset-0 -z-10"
        style={{ background: "radial-gradient(85% 48% at 50% 60%, color-mix(in srgb, var(--inv-accent) 42%, var(--inv-deep)), transparent 74%)" }}
      />
      <SceneBackdrop scene={scene} plane="wall" />
      <div className="flex h-full flex-col items-center px-6 pb-[16%] pt-[13%]">
        <div className={`transition-opacity duration-500 ${started ? "opacity-40" : ""}`}><CoverTitle data={data} guestName={guestName} /></div>
        <div className="flex min-h-0 w-full flex-1 items-center justify-center">
          <div ref={frameRef} className="pointer-events-none shrink-0" style={{ width: "min(112cqw, 58cqh)", aspectRatio: "1", margin: "-6% -20%" }}>
            <SceneStill scene={scene} hidden={!showStill} />
          </div>
        </div>
      </div>
      <div ref={layerRef} className="pointer-events-none absolute inset-0 z-10" />
      <button type="button" onClick={() => void start()} disabled={started} aria-label={data.ritualHint || info.verb} className="absolute inset-0 z-20 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-current" />
      <div className={`pointer-events-none absolute inset-x-0 bottom-[8%] z-20 transition-opacity ${started ? "opacity-0" : "opacity-95"}`}>
        <Hint text={data.ritualHint || info.verb} />
      </div>
      {!started ? (
        <SkipButton
          onSkip={() => {
            setStarted(true);
            onOpen();
            finish();
          }}
        />
      ) : null}
    </div>
  );
}
