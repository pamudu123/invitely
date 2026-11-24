"use client";

import { RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { InvitationView } from "@/components/invitation/InvitationView";
import { ritualInfo } from "@/lib/invitation/rituals";
import { PhoneFrame } from "@/components/ui/kit";
import { demoWishes } from "@/lib/invitation/demo";
import { createFromTemplate } from "@/lib/invitation/templates";
import type { RitualId } from "@/lib/invitation/types";

/** Phone width that follows the viewport so the demo never overflows on small screens. */
function useFluidWidth(min: number, max: number, vwShare: number) {
  const [w, setW] = useState(max);
  useEffect(() => {
    const update = () => setW(Math.round(Math.max(min, Math.min(max, window.innerWidth * vwShare, (window.innerHeight - 150) * (390 / 844)))));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [min, max, vwShare]);
  return w;
}

/** The live, tappable invitation in the landing hero. */
export function HeroPhone() {
  const width = useFluidWidth(250, 340, 0.72);
  const [key, setKey] = useState(0);
  const data = createFromTemplate("pahana");
  return (
    <div className="relative flex flex-col items-center">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[130%] w-[150%] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: "radial-gradient(closest-side, rgba(232,181,101,0.24), rgba(232,181,101,0.06) 55%, transparent 75%)" }}
      />
      <PhoneFrame width={width}>
        <InvitationView key={key} data={data} embedded wishes={demoWishes} />
      </PhoneFrame>
      <div className="relative mt-5 flex items-center gap-4">
        <p className="label text-flame">Go on. Light the lamp.</p>
        <button
          type="button"
          onClick={() => setKey((k) => k + 1)}
          className="flex h-9 items-center gap-1.5 rounded-full border border-paper/15 px-3 text-[0.76rem] text-paper/70 hover:border-paper/40 hover:text-paper"
        >
          <RotateCcw size={13} /> Replay
        </button>
      </div>
    </div>
  );
}

const showcase: { ritual: Exclude<RitualId, "none">; template: string; best: string }[] = [
  { ritual: "lamp", template: "pahana", best: "Weddings, housewarmings, almsgivings" },
  { ritual: "seal", template: "atelier", best: "Church weddings, engagements, formal dinners" },
  { ritual: "curtain", template: "mahanuwara", best: "Poruwa ceremonies, homecomings, galas" },
  { ritual: "lotus", template: "nelum", best: "Weddings, coming of age, anniversaries" },
  { ritual: "scratch", template: "tharu", best: "Save the dates, milestone birthdays" },
  { ritual: "balloon", template: "pop", best: "Birthdays, baby showers" },
];

/** Pick an opening and try it in the phone. */
export function RitualShowcase() {
  const [active, setActive] = useState(0);
  const [key, setKey] = useState(0);
  const width = useFluidWidth(240, 320, 0.7);
  const item = showcase[active];
  const data = createFromTemplate(item.template);
  const rail = useRef<HTMLDivElement | null>(null);

  const select = (i: number) => {
    setActive(i);
    setKey((k) => k + 1);
  };

  return (
    <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_auto] lg:gap-20 [&>*]:min-w-0">
      <div>
        {/* Mobile: chips */}
        <div ref={rail} className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 lg:hidden">
          {showcase.map((s, i) => (
            <button
              key={s.ritual}
              type="button"
              onClick={() => select(i)}
              aria-pressed={active === i}
              className={`h-11 shrink-0 rounded-full border px-4 text-[0.86rem] transition-colors ${
                active === i ? "border-flame bg-flame text-night" : "border-paper/15 text-paper/70"
              }`}
            >
              {ritualInfo[s.ritual].label}
            </button>
          ))}
        </div>
        <p className="mt-5 text-paper/60 lg:hidden">{ritualInfo[item.ritual].description}</p>

        {/* Desktop: list */}
        <ol className="hidden lg:block">
          {showcase.map((s, i) => (
            <li key={s.ritual}>
              <button
                type="button"
                onClick={() => select(i)}
                aria-pressed={active === i}
                className="group flex w-full items-baseline gap-6 border-b border-paper/10 py-5 text-left"
              >
                <span className={`label w-8 transition-colors ${active === i ? "text-flame" : "text-paper/30"}`}>0{i + 1}</span>
                <span className="flex-1">
                  <span className={`display block text-[2.6rem] transition-colors ${active === i ? "text-paper" : "text-paper/35 group-hover:text-paper/70"}`}>
                    {ritualInfo[s.ritual].label}
                  </span>
                  <span
                    className="grid transition-all duration-500 ease-out-soft"
                    style={{ gridTemplateRows: active === i ? "1fr" : "0fr", opacity: active === i ? 1 : 0 }}
                  >
                    <span className="overflow-hidden">
                      <span className="mt-2 block max-w-md text-paper/60">{ritualInfo[s.ritual].description}</span>
                      <span className="label mt-3 block text-paper/40">Lovely for: {s.best}</span>
                    </span>
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ol>
      </div>

      <div className="flex flex-col items-center">
        <PhoneFrame width={width}>
          <InvitationView key={key} data={data} embedded lite wishes={demoWishes} />
        </PhoneFrame>
        <button
          type="button"
          onClick={() => setKey((k) => k + 1)}
          className="mt-5 flex h-9 items-center gap-1.5 rounded-full border border-paper/15 px-3.5 text-[0.78rem] text-paper/70 hover:border-paper/40 hover:text-paper"
        >
          <RotateCcw size={13} /> Play it again
        </button>
      </div>
    </div>
  );
}
