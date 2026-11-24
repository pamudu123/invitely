import { TemplateCover } from "@/components/site/TemplateCover";
import { createFromTemplate, templates } from "@/lib/invitation/templates";
import { gallery } from "./content";

type Pal = { bg: string; surface: string; ink: string; accent: string; deep: string; onDeep: string };
const p = (bg: string, surface: string, ink: string, accent: string, deep: string, onDeep = "#FFE9A8"): Pal => ({ bg, surface, ink, accent, deep, onDeep });

/** Proposed saturated palettes, previewed on existing designs. Not in the product yet. */
const royal: Record<string, Pal> = {
  mahanuwara: p("#8E0F2B", "#A3152F", "#FFF1D0", "#F2C85B", "#5A081A"),
  nelum: p("#F7A8C4", "#FFD3E2", "#5A0B36", "#A8124F", "#8E0F4F", "#FFE3EC"),
  maruthani: p("#FFB02E", "#FFD25E", "#4A1436", "#A3155F", "#7A1440"),
  dorakada: p("#00565C", "#006B70", "#FFF1D0", "#F2C85B", "#003B44"),
  tharu: p("#2A0F52", "#3B1160", "#FFF1D0", "#F2C85B", "#1C0740"),
  bulath: p("#0B5A32", "#0E6E3E", "#FFF4DF", "#F2C85B", "#073D22"),
  suriya: p("#F2762A", "#FF934D", "#3A0F05", "#7A0D1C", "#8E0F2B"),
  monara: p("#0D2F73", "#143E90", "#F4F7E8", "#4FD8C4", "#071E4D", "#CFF5EC"),
  noor: p("#0F6B5C", "#148070", "#FFF4DF", "#F2C85B", "#084638"),
  ran: p("#6A1257", "#80186A", "#FFEFD6", "#F2C85B", "#470A3B"),
};

export function royalCovers(width: number) {
  return gallery.map((id) => {
    const t = templates.find((x) => x.id === id)!;
    const d = createFromTemplate(id);
    const data = { ...d, theme: { ...d.theme, custom: royal[id] } };
    return { id, name: t.name, meaning: t.meaning, cover: <TemplateCover data={data} width={width} /> };
  });
}
