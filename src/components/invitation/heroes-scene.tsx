"use client";

import type { CSSProperties, ReactNode, RefObject } from "react";
import type { Labels } from "@/lib/invitation/labels";
import { sceneInfo, themeScene, type SceneHero } from "@/lib/invitation/scenes";
import { dateParts, formatTime } from "@/lib/invitation/time";
import { getFontPair } from "@/lib/invitation/theme";
import type { InvitationData, LanguageId, SceneId } from "@/lib/invitation/types";
import { SceneBackdrop } from "./scene3d/backdrops";
import { SceneStill, useScene, useSceneLive } from "./scene3d/useScene";
import { ScrollHint } from "./hero-parts";

interface Props {
  data: InvitationData;
  labels: Labels;
  lang: LanguageId;
  kicker: string;
}

const rise = (i: number) => ({ ["--rise-delay" as string]: `${150 + i * 120}ms` });

/** Type size that fits the title to the cover: no word is wider than the screen, and all lines share a set height. */
function nameSize(data: InvitationData, opts: { width: number; height: number; max: string; lineHeight: number }): CSSProperties {
  const words = `${data.name1} ${data.name2 ? `& ${data.name2}` : ""}`.split(/\s+/).filter(Boolean);
  const { glyph } = getFontPair(data.theme.fontPair);
  // Try every number of lines, and keep the one that lets the type be largest on a phone.
  let best = { size: 0, chars: 4, lines: 1 };
  for (let lines = 1; lines <= Math.min(4, words.length); lines++) {
    let chars = Math.max(3, ...words.map((w) => w.length));
    const fits = (limit: number) => {
      let count = 1;
      let used = 0;
      for (const w of words) {
        const next = used ? used + 1 + w.length : w.length;
        if (next > limit) {
          count++;
          used = w.length;
        } else used = next;
      }
      return count <= lines;
    };
    while (!fits(chars)) chars++;
    const size = Math.min(opts.width / (chars * glyph), (opts.height * 216) / (lines * opts.lineHeight));
    if (size > best.size) best = { size, chars, lines };
  }
  const fit = opts.width / (best.chars * glyph);
  const tall = opts.height / (best.lines * opts.lineHeight);
  return { fontSize: `min(${fit.toFixed(2)}cqw, calc(var(--inv-screen) * ${tall.toFixed(4)}), ${opts.max})`, lineHeight: opts.lineHeight, overflowWrap: "normal" };
}

function Title({ data, style, className = "" }: { data: InvitationData; style: CSSProperties; className?: string }) {
  return (
    <h1 className={`inv-names ${className}`} style={style}>
      <span className="block">{data.name1}</span>
      {data.name2 ? <span className="block"><span style={{ color: "var(--inv-accent)" }}>&amp; </span>{data.name2}</span> : null}
    </h1>
  );
}

/** Space left between the title and the details. The object is fitted to it, so it never covers the words on a short phone. */
function ObjectArea({ scene, frameRef, live, fill, children }: {
  scene: SceneId;
  frameRef: RefObject<HTMLDivElement | null>;
  live: boolean;
  /** Share of the space the framed square takes. The object is four fifths of the square. */
  fill: [width: number, height: number];
  children?: ReactNode;
}) {
  return (
    <div className="relative min-h-[8.5rem] flex-1">
      <div className="absolute inset-0" style={{ containerType: "size" }}>
        {children}
      <div
        ref={frameRef}
        className="pointer-events-none absolute left-1/2 top-1/2"
        style={{ width: `min(${fill[0]}cqw, ${fill[1]}cqh)`, aspectRatio: "1", transform: "translate(-50%, -50%)" }}
      >
        <SceneStill scene={scene} hidden={live} />
      </div>
      </div>
    </div>
  );
}

function Shell({ children, style, layerRef, live, scene, plane }: {
  children: ReactNode;
  style?: CSSProperties;
  layerRef: RefObject<HTMLDivElement | null>;
  live: boolean;
  scene: SceneId;
  plane: "wall" | "floor";
}) {
  return (
    <header className="relative isolate flex flex-col overflow-hidden" style={{ minHeight: "max(var(--inv-screen), 35rem)", background: "var(--inv-bg)", ...style }}>
      <SceneBackdrop scene={scene} plane={plane} />
        {children}
      {/* Live scene. Sits over the title and under the details. */}
      <div ref={layerRef} className="absolute inset-0 z-10" style={{ pointerEvents: live ? "auto" : "none" }} />
    </header>
  );
}

/** One object on a lit stage, with the title set huge behind it. */
function StageHero({ data, lang, kicker, labels }: Props) {
  const scene = themeScene(data.theme);
  const { layerRef, frameRef, state } = useScene({ scene, live: useSceneLive(), pose: sceneInfo[scene].rest, interactive: true, followScroll: true });
  const p = dateParts(data.date, lang);
  return (
    <Shell layerRef={layerRef} live={state === "ready"} scene={scene} plane="wall">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{ background: "radial-gradient(78% 46% at 50% 56%, color-mix(in srgb, var(--inv-accent) 34%, var(--inv-bg)), transparent 72%)" }}
      />
      <div className="inv-rise flex items-start justify-between gap-6 px-6 pt-7" style={rise(0)}>
        <p className="inv-kicker max-w-[66%]">{kicker}</p>
        <p className="inv-kicker" style={{ color: "var(--inv-accent)" }}>{p.year}</p>
      </div>
      <div className="inv-rise px-4 pt-5 text-center" style={rise(1)}>
        <Title data={data} style={nameSize(data, { width: 88, height: 0.25, max: "9rem", lineHeight: 0.95 })} />
      </div>
      <ObjectArea scene={scene} frameRef={frameRef} live={state === "ready"} fill={[110, 128]} />
      <div className="pointer-events-none relative z-20 -mt-8 px-6 pb-20 pt-12" style={{ background: "linear-gradient(180deg, transparent, color-mix(in srgb, var(--inv-bg) 88%, transparent) 34%, var(--inv-bg) 70%)" }}>
        <p className="inv-kicker inv-rise mx-auto max-w-[21rem] text-center" style={rise(2)}>{data.subline}</p>
        <div className="inv-rise mx-auto mt-4 grid max-w-[30rem] grid-cols-[1fr_auto_1.3fr] items-center gap-4 border-t pt-4" style={{ ...rise(3), borderColor: "var(--inv-line)" }}>
          <p className="inv-kicker" suppressHydrationWarning>{p.weekday}<br />{formatTime(data.time)}</p>
          <p className="inv-names" style={{ fontSize: "clamp(2.8rem, 15cqw, 4rem)", lineHeight: 1, whiteSpace: "nowrap", color: "var(--inv-accent)" }}>{Number(p.day)}</p>
          <p className="inv-kicker text-right" suppressHydrationWarning>{p.month}<br />{data.venueName}</p>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-3 z-20 flex justify-center"><ScrollHint label={labels.scroll} compact /></div>
    </Shell>
  );
}

/** The object like a product shot, then the facts set out as a spec sheet. */
function SpecHero({ data, labels, lang, kicker }: Props) {
  const scene = themeScene(data.theme);
  const { layerRef, frameRef, state } = useScene({ scene, live: useSceneLive(), pose: sceneInfo[scene].rest, interactive: true, followScroll: true });
  const p = dateParts(data.date, lang);
  const rows = [
    [labels.dateLabel, `${p.weekday}, ${Number(p.day)} ${p.month} ${p.year}`],
    [labels.timeLabel, formatTime(data.time)],
    [labels.placeLabel, data.venueName],
  ];
  return (
    <Shell layerRef={layerRef} live={state === "ready"} scene={scene} plane="wall">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 h-[62%]"
        style={{ background: "radial-gradient(90% 80% at 50% 40%, var(--inv-surface), transparent 75%)" }}
      />
      <ObjectArea scene={scene} frameRef={frameRef} live={state === "ready"} fill={[104, 122]}>
        <p
          aria-hidden="true"
          className="inv-names inv-rise absolute left-5 top-5 select-none"
          style={{
            ...rise(0), fontSize: "min(44cqw, 52cqh)", lineHeight: 0.85, whiteSpace: "nowrap", fontStyle: "normal",
            color: "color-mix(in srgb, var(--inv-accent) 24%, var(--inv-bg))",
          }}
        >
          {p.day}
        </p>
        <p className="inv-kicker inv-rise absolute right-6 top-7 text-right" style={{ ...rise(0), color: "var(--inv-accent)" }} suppressHydrationWarning>{p.month}<br />{p.year}</p>
      </ObjectArea>
      <div className="pointer-events-none relative z-20 -mt-8 px-6 pb-20 pt-10" style={{ background: "linear-gradient(180deg, transparent, color-mix(in srgb, var(--inv-bg) 90%, transparent) 22%, var(--inv-bg) 60%)" }}>
        <p className="inv-kicker inv-rise" style={{ ...rise(1), color: "var(--inv-accent)" }}>{kicker}</p>
        <div className="inv-rise mt-2" style={rise(2)}>
          <Title data={data} style={nameSize(data, { width: 86, height: 0.13, max: "clamp(2.7rem, 12cqw, 5rem)", lineHeight: 1 })} />
        </div>
        <p className="inv-rise mt-2 max-w-[24rem]" style={{ ...rise(3), color: "var(--inv-muted)", lineHeight: 1.4 }}>{data.subline}</p>
        <dl className="inv-rise m-0 mt-4 border-t" style={{ ...rise(4), borderColor: "var(--inv-ink)" }}>
          {rows.map(([k, v]) => (
            <div key={k} className="grid grid-cols-[6.5rem_1fr] gap-3 border-b py-1.5" style={{ borderColor: "var(--inv-line)" }}>
              <dt className="inv-kicker" style={{ fontSize: "0.62rem", color: "var(--inv-muted)", paddingTop: "0.2em" }}>{k}</dt>
              <dd className="m-0 text-[0.95rem] leading-snug" suppressHydrationWarning>{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Shell>
  );
}

/** A small world standing on the ground, with the title in the sky above it. */
function DioramaHero({ data, labels, lang, kicker }: Props) {
  const scene = themeScene(data.theme);
  const { layerRef, frameRef, state } = useScene({ scene, live: useSceneLive(), pose: sceneInfo[scene].rest, interactive: true, followScroll: true });
  const p = dateParts(data.date, lang);
  return (
    <Shell layerRef={layerRef} live={state === "ready"} scene={scene} plane="floor" style={{ background: "linear-gradient(180deg, var(--inv-bg) 0%, var(--inv-bg) 34%, color-mix(in srgb, var(--inv-bg) 72%, var(--inv-accent)) 62%, color-mix(in srgb, var(--inv-deep) 70%, var(--inv-bg)) 100%)" }}>
      <div className="px-6 pt-10 text-center">
        <p className="inv-kicker inv-rise mx-auto max-w-[19rem]" style={{ ...rise(0), color: "var(--inv-accent)" }}>{kicker}</p>
        <div className="inv-rise mt-4" style={rise(1)}>
          <Title data={data} style={nameSize(data, { width: 84, height: 0.19, max: "8rem", lineHeight: 0.98 })} />
        </div>
        <p className="inv-kicker inv-rise mx-auto mt-4 max-w-[20rem]" style={{ ...rise(2), color: "var(--inv-muted)" }}>{data.subline}</p>
      </div>
      <ObjectArea scene={scene} frameRef={frameRef} live={state === "ready"} fill={[114, 122]} />
      <div
        className="pointer-events-none relative z-20 px-6 pb-20 pt-10"
        style={{ color: "var(--inv-on-deep)", background: "linear-gradient(180deg, transparent, color-mix(in srgb, var(--inv-deep) 82%, transparent) 38%, var(--inv-deep))" }}
      >
        <div className="inv-rise flex items-end justify-between gap-6" style={rise(3)}>
          <p className="flex shrink-0 items-end gap-3" suppressHydrationWarning>
            <span className="inv-names" style={{ fontSize: "clamp(3.4rem, 18cqw, 5rem)", lineHeight: 0.85, whiteSpace: "nowrap" }}>{Number(p.day)}</span>
            <span className="inv-kicker whitespace-nowrap" suppressHydrationWarning>{p.month}<br />{p.year}</span>
          </p>
          <p className="inv-kicker min-w-0 text-right" suppressHydrationWarning>{p.weekday}, {formatTime(data.time)}<br />{data.venueName}</p>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-3 z-20 flex justify-center" style={{ color: "var(--inv-on-deep)" }}><ScrollHint label={labels.scroll} compact /></div>
    </Shell>
  );
}

export function SceneHeroView({ layout, ...props }: Props & { layout: SceneHero }) {
  switch (layout) {
    case "stage": return <StageHero {...props} />;
    case "spec": return <SpecHero {...props} />;
    default: return <DioramaHero {...props} />;
  }
}
