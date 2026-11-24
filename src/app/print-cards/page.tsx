import type { Metadata } from "next";
import { PrintPreview } from "@/components/cards/PrintPreview";
import { SiteFooter, SiteHeader } from "@/components/site/chrome";
import { ButtonLink } from "@/components/ui/kit";
import { printDesigns } from "@/lib/invitation/cards";
import { getShape } from "@/lib/invitation/shapes";
import { createFromTemplate } from "@/lib/invitation/templates";

export const metadata: Metadata = {
  title: "Printed invitation cards",
  description:
    "Designs for physical invitation cards that are not plain rectangles: temple arches, a betel leaf, a moonstone, round and scalloped cards. Each carries a QR code that opens your web invitation.",
};

// Each design is shown with the web card it suits best.
const pairing: Record<string, string> = {
  thorana: "mahanuwara",
  "bulath-kole": "bulath",
  archway: "atelier",
  sanda: "tharu",
  sandakada: "pahana",
  araliya: "nelum",
  "nelum-pethi": "piyum",
  ola: "dorakada",
  deco: "monara",
  kavaya: "pihatu",
  journey: "first-class",
  admit: "premiere",
  heirloom: "pahana",
  pahana: "kolam",
  twilight: "noor",
  margin: "gazette",
};

export default function PrintCardsPage() {
  return (
    <>
      <SiteHeader />
      <main className="px-5 pb-28 pt-28 sm:px-8 lg:pt-36">
        <div className="mx-auto max-w-7xl">
          <p className="label text-flame">Printed cards</p>
          <h1 className="display mt-5 max-w-4xl text-[clamp(3rem,9vw,6.5rem)]">A card worth keeping in the hand.</h1>
          <p className="mt-6 max-w-2xl text-[1.05rem] leading-relaxed text-paper/60">
            Some guests should receive something on paper. These are designs for physical cards, and most of them are not
            rectangles. Each one takes the colours and lettering of your web card, and its back carries a QR code that opens
            the map, the live schedule and the RSVP.
          </p>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-paper/45">
            A printed card is an optional add-on to any web card. You download a print-ready PDF with bleed and a cut line,
            and take it to the print shop of your choice.
          </p>

          <ul className="mt-16 grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 xl:grid-cols-3">
            {printDesigns.map((design) => {
              const data = createFromTemplate(pairing[design.id] ?? "pahana");
              const wide = design.sizes[0].w > design.sizes[0].h * 1.3;
              return (
                <li key={design.id} className="flex flex-col">
                  <div className="flex min-h-[23rem] items-center justify-center gap-4 rounded-3xl border border-paper/10 bg-night-2 p-6">
                    {wide ? (
                      <div className="grid justify-items-center gap-4">
                        <PrintPreview design={design} data={data} width={300} />
                        <PrintPreview design={design} data={data} side="back" width={300} />
                      </div>
                    ) : (
                      <>
                        <PrintPreview design={design} data={data} width={168} />
                        <PrintPreview design={design} data={data} side="back" width={168} />
                      </>
                    )}
                  </div>
                  <p className="label mt-5 text-flame">{getShape(design.shape).label}</p>
                  <h2 className="mt-1.5 font-serif text-[1.9rem] leading-none">{design.name}</h2>
                  <p className="mt-1 text-[0.84rem] text-paper/45">{design.meaning} · {design.sizes.map((s) => s.label).join(", ")}</p>
                  <p className="mt-3 text-[0.92rem] leading-relaxed text-paper/60">{design.description}</p>
                </li>
              );
            })}
          </ul>

          <section className="mt-24 rounded-3xl border border-paper/10 bg-night-2 px-6 py-14 text-center">
            <h2 className="display text-4xl sm:text-6xl">Start with the web card.</h2>
            <p className="mx-auto mt-4 max-w-md text-paper/60">
              Design your invitation first. The printed card is made from it in a few taps, whenever you are ready.
            </p>
            <ButtonLink href="/templates" size="lg" className="mt-8">Browse the designs</ButtonLink>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
