import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Studio } from "@/components/studio/Studio";
import { occasions } from "@/lib/invitation/occasions";
import { getTemplate } from "@/lib/invitation/templates";
import { palettes } from "@/lib/invitation/theme";
import type { OccasionId } from "@/lib/invitation/types";

export const metadata: Metadata = { title: "Design studio", robots: { index: false } };

async function NewStudio({ searchParams }: { searchParams: PageProps<"/studio/new">["searchParams"] }) {
  const sp = await searchParams;
  const template = typeof sp.template === "string" && getTemplate(sp.template) ? sp.template : undefined;
  // The studio no longer switches designs, so one has to be chosen first.
  if (!template) redirect("/templates");
  const occasion = occasions.find((o) => o.id === sp.occasion)?.id as OccasionId | undefined;
  const palette = palettes.find((p) => p.id === sp.palette)?.id;
  return <Studio templateId={template} occasion={occasion} paletteId={palette} />;
}

export default function Page({ searchParams }: PageProps<"/studio/new">) {
  return (
    <Suspense fallback={<div className="fixed inset-0 bg-page" />}>
      <NewStudio searchParams={searchParams} />
    </Suspense>
  );
}
