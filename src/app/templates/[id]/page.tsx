import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ornamentLabels } from "@/components/invitation/ornaments";
import { ritualInfo } from "@/lib/invitation/rituals";
import { SiteFooter, SiteHeader } from "@/components/site/chrome";
import { TemplateDemo } from "@/components/site/TemplateDemo";
import { getTemplate, templates } from "@/lib/invitation/templates";
import { fontPairs, palettes } from "@/lib/invitation/theme";

export function generateStaticParams() {
  return templates.map((t) => ({ id: t.id }));
}

export async function generateMetadata({ params }: PageProps<"/templates/[id]">): Promise<Metadata> {
  const { id } = await params;
  const tpl = getTemplate(id);
  if (!tpl) return { title: "Design" };
  return { title: `${tpl.name} invitation design`, description: tpl.description };
}

async function Detail({ params }: { params: PageProps<"/templates/[id]">["params"] }) {
  const { id } = await params;
  const tpl = getTemplate(id);
  if (!tpl) notFound();
  const palette = palettes.find((p) => p.id === tpl.theme.paletteId) ?? palettes[0];
  const font = fontPairs.find((f) => f.id === tpl.theme.fontPair) ?? fontPairs[0];
  const facts = [
    ["Opening", ritualInfo[tpl.theme.ritual].label],
    ["Colours", palette.label],
    ["Lettering", font.label],
    ["Ornament", ornamentLabels[tpl.theme.ornament]],
  ];

  return (
    <div className="mx-auto max-w-6xl">
      <Link href="/templates" className="label inline-flex items-center gap-2 text-paper/50 hover:text-paper">
        <ArrowLeft size={14} /> All designs
      </Link>
      <div className="mt-6">
        <TemplateDemo
          templateId={tpl.id}
          occasionIds={[tpl.occasion, ...tpl.alsoFor]}
          initial={tpl.occasion}
          header={
            <header className="max-w-2xl">
              <p className="label text-flame">{tpl.meaning}</p>
              <h1 className="display mt-4 text-[clamp(3.4rem,11vw,7rem)]">{tpl.name}</h1>
              <p className="mt-5 text-[1.08rem] leading-relaxed text-paper/65">{tpl.description}</p>
              <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-paper/10 pt-6 sm:grid-cols-4">
                {facts.map(([k, v]) => (
                  <div key={k}>
                    <dt className="label text-paper/40">{k}</dt>
                    <dd className="mt-1.5 font-serif text-xl">{v}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-6 flex gap-1.5" aria-hidden="true">
                {[palette.bg, palette.accent, palette.deep, palette.ink].map((c, i) => (
                  <span key={i} className="h-7 w-7 rounded-full border border-paper/20" style={{ background: c }} />
                ))}
              </div>
            </header>
          }
        />
      </div>
    </div>
  );
}

export default function TemplatePage({ params }: PageProps<"/templates/[id]">) {
  return (
    <>
      <SiteHeader />
      <main className="px-5 pb-28 pt-24 sm:px-8 lg:pt-32">
        <Suspense fallback={<div className="mx-auto h-[70vh] max-w-6xl animate-pulse rounded-3xl bg-paper/5" />}>
          <Detail params={params} />
        </Suspense>
      </main>
      <SiteFooter />
    </>
  );
}
