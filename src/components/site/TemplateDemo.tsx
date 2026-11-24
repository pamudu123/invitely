"use client";

import { RotateCcw } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { InvitationView } from "@/components/invitation/InvitationView";
import { ButtonLink, PhoneFrame } from "@/components/ui/kit";
import { demoWishes } from "@/lib/invitation/demo";
import { getOccasion } from "@/lib/invitation/occasions";
import { createFromTemplate } from "@/lib/invitation/templates";
import type { OccasionId } from "@/lib/invitation/types";

/** Live demo of one design with an occasion switch. */
export function TemplateDemo({ templateId, occasionIds, initial, header }: { templateId: string; occasionIds: OccasionId[]; initial: OccasionId; header: ReactNode }) {
  const [occasion, setOccasion] = useState<OccasionId>(initial);
  const [key, setKey] = useState(0);
  const [width, setWidth] = useState(320);
  const data = createFromTemplate(templateId, occasion);

  useEffect(() => {
    const update = () => setWidth(Math.round(Math.max(250, Math.min(350, window.innerWidth - 64, (window.innerHeight - 170) * (390 / 844)))));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[auto_1fr] lg:gap-x-20 lg:gap-y-10 [&>*]:min-w-0">
      <div className="lg:col-start-2 lg:row-start-1">{header}</div>
      <div className="flex flex-col items-center lg:sticky lg:top-24 lg:col-start-1 lg:row-span-2 lg:row-start-1">
        <PhoneFrame width={width}>
          <InvitationView key={`${occasion}-${key}`} data={data} embedded wishes={demoWishes} />
        </PhoneFrame>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setKey((k) => k + 1)}
            className="flex h-10 items-center gap-1.5 rounded-full border border-fg/15 px-4 text-[0.8rem] text-fg/90 hover:border-fg/40"
          >
            <RotateCcw size={13} /> Replay opening
          </button>
          <ButtonLink href={`/demo/${templateId}`} target="_blank" variant="ghost" size="sm">Open full screen</ButtonLink>
        </div>
      </div>

      <div className="lg:col-start-2 lg:row-start-2">
        <div>
          <p className="label text-fg/85">Start it as</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {occasionIds.map((o) => (
              <button
                key={o}
                type="button"
                aria-pressed={occasion === o}
                onClick={() => setOccasion(o)}
                className={`h-10 rounded-full border px-4 text-[0.86rem] transition-colors ${
                  occasion === o ? "border-brand bg-brand text-on-brand" : "border-fg/15 text-fg/90 hover:border-fg/40"
                }`}
              >
                {getOccasion(o).label}
              </button>
            ))}
          </div>
          <ButtonLink href={`/studio/new?template=${templateId}&occasion=${occasion}`} size="lg" className="mt-7 w-full sm:w-auto">
            Customise this design
          </ButtonLink>
          <p className="mt-3 text-[0.82rem] text-fg/85">Free to design. No account or password, ever.</p>
        </div>
      </div>
    </div>
  );
}
