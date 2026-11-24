import type { Metadata } from "next";
import { Suspense } from "react";
import { ritualInfo } from "@/lib/invitation/rituals";
import { SiteFooter, SiteHeader } from "@/components/site/chrome";
import { FluidCover } from "@/components/site/TemplateCover";
import { TemplateGallery, type GalleryItem } from "@/components/site/TemplateGallery";
import { occasions } from "@/lib/invitation/occasions";
import { templates } from "@/lib/invitation/templates";
import type { OccasionId } from "@/lib/invitation/types";

export const metadata: Metadata = {
  title: "Invitation designs",
  description:
    "Sixteen digital invitation designs for weddings, homecomings, engagements, birthdays and more. Preview each one live on a phone and make it yours.",
};

function items(): GalleryItem[] {
  return templates.map((t) => ({
    id: t.id,
    name: t.name,
    meaning: t.meaning,
    occasion: t.occasion,
    alsoFor: t.alsoFor,
    tags: t.tags,
    opening: ritualInfo[t.theme.ritual].label,
    cover: <FluidCover templateId={t.id} />,
  }));
}

async function Gallery({ searchParams }: { searchParams: PageProps<"/templates">["searchParams"] }) {
  const sp = await searchParams;
  const initial = occasions.find((o) => o.id === sp.occasion)?.id as OccasionId | undefined;
  return <TemplateGallery items={items()} initial={initial} />;
}

export default function TemplatesPage({ searchParams }: PageProps<"/templates">) {
  return (
    <>
      <SiteHeader />
      <main className="px-5 pb-28 pt-28 sm:px-8 lg:pt-36">
        <div className="mx-auto max-w-7xl">
          <p className="label text-flame">The collection</p>
          <h1 className="display mt-5 max-w-4xl text-[clamp(3rem,9vw,6.5rem)]">Find the design that feels like you.</h1>
          <p className="mb-10 mt-6 max-w-xl text-[1.05rem] leading-relaxed text-paper/60">
            Every design is shown exactly as it looks on a phone. Open the live demo, try the opening, then make it yours.
            Colours, lettering, ornaments and wording can all change.
          </p>
          <Suspense fallback={<TemplateGallery items={items()} />}>
            <Gallery searchParams={searchParams} />
          </Suspense>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
