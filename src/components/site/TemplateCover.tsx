import type { CSSProperties } from "react";
import { Hero } from "@/components/invitation/sections";
import { PhoneFrame } from "@/components/ui/kit";
import { getLabels } from "@/lib/invitation/labels";
import { createFromTemplate } from "@/lib/invitation/templates";
import { themeVars } from "@/lib/invitation/theme";
import type { InvitationData } from "@/lib/invitation/types";

/** Static cover of a template, drawn at true phone size and scaled down. */
export function TemplateCover({
  templateId,
  data,
  width = 240,
  bare = true,
  className = "",
}: {
  templateId?: string;
  data?: InvitationData;
  width?: number;
  bare?: boolean;
  className?: string;
}) {
  const d = data ?? createFromTemplate(templateId ?? "pahana");
  const style = { ...themeVars(d.theme), ["--inv-screen" as string]: "844px" } as CSSProperties;
  return (
    <PhoneFrame width={width} bare={bare} className={className}>
      <div className="inv-shell pointer-events-none absolute inset-0 overflow-hidden" style={style} aria-hidden="true">
        <div className="inv-root h-full">
          <Hero data={d} labels={getLabels("en")} lang="en" phase="before" />
        </div>
      </div>
    </PhoneFrame>
  );
}

/** Cover that scales with its column, so grids work at any width. */
export function FluidCover({ templateId }: { templateId: string }) {
  return (
    <div className="relative w-full overflow-hidden" style={{ aspectRatio: "390 / 844", containerType: "inline-size" }}>
      {/* tan(atan2()) turns the length ratio into a plain number for scale() */}
      <div className="absolute left-0 top-0 origin-top-left" style={{ transform: "scale(tan(atan2(100cqw, 390px)))" }}>
        <TemplateCover templateId={templateId} width={390} />
      </div>
    </div>
  );
}
