"use client";

import Link from "next/link";
import { PrintPreview } from "@/components/cards/PrintPreview";
import { LikeButton } from "@/components/site/LikeButton";
import { TemplateCover } from "@/components/site/TemplateCover";
import { useSeason } from "@/lib/client/season";
import { showcase, showcaseData, showcaseName } from "@/lib/invitation/showcase";
import { palettes } from "@/lib/invitation/theme";
import type { SeasonId } from "@/lib/season";

/** Designs on the home page, in colours of the season. */
export function ShowcaseRail() {
  const season = useSeason();
  return (
    <div className="frost-rail" role="group" aria-label="Designs" tabIndex={0}>
      {showcase.map((s) => {
        const palette = s.palette[season];
        const data = showcaseData(s.id, palette, s.a, s.b, s.venue, s.place);
        const colour = palettes.find((p) => p.id === palette)?.label ?? "";
        return (
          <div key={s.id} className="frost-card">
            <Link href={`/studio/new?template=${s.id}&palette=${palette}`} aria-label={`Start with ${showcaseName(s.id)} in ${colour}`}>
              <span><TemplateCover data={data} width={230} /></span>
              <b>{showcaseName(s.id)}</b>
              <small>{colour}</small>
            </Link>
            <LikeButton id={s.id} name={showcaseName(s.id)} className="absolute right-5 top-5" />
          </div>
        );
      })}
    </div>
  );
}

const printed: { design: string; template: string; palette: Record<SeasonId, string>; width: number }[] = [
  { design: "archway", template: "atelier", palette: { winter: "frost-royal", spring: "cherry", summer: "sunflower", autumn: "harvest" }, width: 190 },
  { design: "sanda", template: "tharu", palette: { winter: "amethyst-ice", spring: "meadow", summer: "lagoon", autumn: "maple" }, width: 200 },
  { design: "deco", template: "promise", palette: { winter: "lagoon-ice", spring: "wisteria", summer: "coral-reef", autumn: "woodland" }, width: 190 },
];

export function PrintedRow() {
  const season = useSeason();
  return printed.map((x) => (
    <PrintPreview key={x.design} design={x.design} data={showcaseData(x.template, x.palette[season])} width={x.width} />
  ));
}
