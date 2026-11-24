import { toJpeg, toPng } from "html-to-image";
import type { CardFormat } from "@/lib/invitation/cards";

/** Turn a card face in the page into a picture at its final pixel size. */
export async function renderFace(node: HTMLElement, format: CardFormat, type: "png" | "jpeg" = "png"): Promise<string> {
  await document.fonts.ready;
  const options = {
    pixelRatio: format.pixelRatio,
    width: format.width,
    height: format.height,
    cacheBust: false,
    quality: 0.95,
    backgroundColor: type === "jpeg" ? "#ffffff" : undefined,
    // The node sits inside a scaled preview. Export it at its natural size.
    style: { transform: "none", margin: "0" },
  };
  const draw = type === "jpeg" ? toJpeg : toPng;
  // Safari often paints fonts and images only on a later pass, so draw twice and keep the last.
  await draw(node, options).catch(() => undefined);
  return draw(node, options);
}

export function dataUrlToBytes(dataUrl: string): Uint8Array {
  const base64 = dataUrl.slice(dataUrl.indexOf(",") + 1);
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

export function dataUrlToBlob(dataUrl: string): Blob {
  const mime = dataUrl.slice(5, dataUrl.indexOf(";"));
  return new Blob([dataUrlToBytes(dataUrl) as BlobPart], { type: mime });
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

/** Open the phone's share sheet with the picture attached. Returns false when the device cannot share files. */
export async function shareImage(blob: Blob, filename: string, text: string): Promise<boolean> {
  const file = new File([blob], filename, { type: blob.type });
  if (!navigator.canShare || !navigator.canShare({ files: [file] })) return false;
  try {
    await navigator.share({ files: [file], text });
    return true;
  } catch (e) {
    // The person closed the share sheet. That is not a failure.
    return (e as DOMException)?.name === "AbortError";
  }
}

export interface PdfPage {
  jpeg: Uint8Array;
  pixelWidth: number;
  pixelHeight: number;
  /** Page size in points, bleed included */
  widthPt: number;
  heightPt: number;
  /** Bleed on each side, in points */
  bleedPt: number;
}

export interface PdfCutLine {
  /** PDF path operators for the outline, already in page coordinates */
  path: string;
  label: string;
}

/**
 * Write a print PDF: one full page picture per side, each with a TrimBox and
 * BleedBox, then an optional last page with the cut line as a vector outline.
 */
export function buildPdf(pages: PdfPage[], cut?: PdfCutLine): Blob {
  const enc = new TextEncoder();
  const objects: (string | Uint8Array)[][] = [];
  const add = (...parts: (string | Uint8Array)[]) => objects.push(parts);
  const n = (v: number) => v.toFixed(2);
  const first = pages[0];
  const box = `[0 0 ${n(first.widthPt)} ${n(first.heightPt)}]`;
  const trim = `[${n(first.bleedPt)} ${n(first.bleedPt)} ${n(first.widthPt - first.bleedPt)} ${n(first.heightPt - first.bleedPt)}]`;

  // Object 1 is the catalog and 2 the page tree. Ids below are positions in `objects` plus one.
  add("<< /Type /Catalog /Pages 2 0 R >>");
  add(""); // filled in once the page ids are known
  const kids: number[] = [];

  for (const p of pages) {
    const pageId = objects.length + 1;
    kids.push(pageId);
    add(`<< /Type /Page /Parent 2 0 R /MediaBox ${box} /BleedBox ${box} /TrimBox ${trim} /Resources << /XObject << /Im0 ${pageId + 1} 0 R >> >> /Contents ${pageId + 2} 0 R >>`);
    add(
      `<< /Type /XObject /Subtype /Image /Width ${p.pixelWidth} /Height ${p.pixelHeight} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${p.jpeg.length} >>\nstream\n`,
      p.jpeg,
      "\nendstream",
    );
    const draw = `q ${n(p.widthPt)} 0 0 ${n(p.heightPt)} 0 0 cm /Im0 Do Q`;
    add(`<< /Length ${draw.length} >>\nstream\n${draw}\nendstream`);
  }

  if (cut) {
    const pageId = objects.length + 1;
    kids.push(pageId);
    add(`<< /Type /Page /Parent 2 0 R /MediaBox ${box} /BleedBox ${box} /TrimBox ${trim} /Resources << /Font << /F1 ${pageId + 2} 0 R >> >> /Contents ${pageId + 1} 0 R >>`);
    // Magenta hairline is the usual way to mark a cut line for a print shop.
    const safeLabel = cut.label.replace(/[^\x20-\x7e]/g, "").replace(/([()\\])/g, "\\$1");
    const draw = `1 0 1 RG 0.5 w ${cut.path} S BT /F1 6 Tf 0.4 g ${n(first.bleedPt + 4)} ${n(first.heightPt / 2)} Td (${safeLabel}) Tj ET`;
    add(`<< /Length ${draw.length} >>\nstream\n${draw}\nendstream`);
    add("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
  }

  objects[1] = [`<< /Type /Pages /Kids [${kids.map((k) => `${k} 0 R`).join(" ")}] /Count ${kids.length} >>`];

  const chunks: Uint8Array[] = [];
  const offsets: number[] = [];
  let length = 0;
  const push = (part: string | Uint8Array) => {
    const bytes = typeof part === "string" ? enc.encode(part) : part;
    chunks.push(bytes);
    length += bytes.length;
  };
  push("%PDF-1.4\n");
  objects.forEach((parts, i) => {
    offsets[i] = length;
    push(`${i + 1} 0 obj\n`);
    parts.forEach(push);
    push("\nendobj\n");
  });
  const xref = length;
  push(`xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`);
  for (const off of offsets) push(`${String(off).padStart(10, "0")} 00000 n \n`);
  push(`trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`);
  return new Blob(chunks as BlobPart[], { type: "application/pdf" });
}
