import type { Metadata } from "next";
import { ritualInfo } from "@/lib/invitation/rituals";
import { SiteFooter, SiteHeader } from "@/components/site/chrome";
import { FluidCover } from "@/components/site/TemplateCover";
import { TemplateGallery, type GalleryItem } from "@/components/site/TemplateGallery";
import { galleryTemplates } from "@/lib/invitation/templates";

export const metadata: Metadata = {
  title: "Invitation designs",
  description:
    "Digital invitation designs for weddings, homecomings, mehendi nights, birthdays, Avurudu, Christmas and more. Preview each one live on a phone and make it yours.",
};

function items(): GalleryItem[] {
  return galleryTemplates().map((t) => ({
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

export default function TemplatesPage() {
  return (
    <>
      <SiteHeader />
      <main className="px-5 pb-28 pt-28 sm:px-8 lg:pt-36">
        <div className="mx-auto max-w-7xl">
          <p className="label text-brand">The collection</p>
          <h1 className="display mt-5 max-w-4xl text-[clamp(3rem,9vw,6.5rem)]">Find the design that feels like you.</h1>
          <p className="mt-6 max-w-xl text-[1.05rem] leading-relaxed text-fg/85">
            Every design is shown exactly as it looks on a phone. Open the live demo, try the opening, then make it yours.
            Colours, lettering, ornaments and wording can all change.
          </p>
          <p className="mb-10 mt-4 max-w-xl text-[1.05rem] leading-relaxed text-fg/85">
            Tap the heart on the ones you love, as many times as you wish. No sign in. A cookie remembers your likes on
            this device.
          </p>
          <TemplateGallery items={items()} />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
