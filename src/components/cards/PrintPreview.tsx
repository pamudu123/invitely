import { getPrintDesign, printFormat, type PrintDesign } from "@/lib/invitation/cards";
import { shapeSegments, toSvgPath } from "@/lib/invitation/shapes";
import type { InvitationData } from "@/lib/invitation/types";
import { CardFace } from "./CardFace";

/** A printed card design drawn at a fixed scale and cut to its silhouette. Renders on the server. */
export function PrintPreview({
  design,
  data,
  side = "front",
  width,
  link = "https://invitely.app/i/your-card",
}: {
  design: PrintDesign | string;
  data: InvitationData;
  side?: "front" | "back";
  /** Width on screen in pixels */
  width: number;
  link?: string;
}) {
  const d = typeof design === "string" ? getPrintDesign(design) : design;
  const format = printFormat(d.sizes[0]);
  const scale = width / format.width;
  const clip = `path(evenodd, "${toSvgPath(shapeSegments(d.shape, format.width - format.bleed * 2, format.height - format.bleed * 2, format.bleed))}")`;
  return (
    <div style={{ width, height: format.height * scale, flexShrink: 0, position: "relative", filter: "drop-shadow(0 16px 22px rgba(15,28,92,0.32))" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: format.width, height: format.height, transform: `scale(${scale})`, transformOrigin: "top left", clipPath: clip }}>
        <CardFace
          data={data}
          layout={d.face}
          side={side}
          width={format.width}
          height={format.height}
          bleed={format.bleed}
          link={link}
          linkLabel="invitely.app/i/your-card"
          footer="none"
          shape={d.shape}
          tone={d.tone}
          density={d.density}
          scale={d.scale}
        />
      </div>
    </div>
  );
}
