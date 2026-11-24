import type { Metadata } from "next";
import { Suspense } from "react";
import { Studio } from "@/components/studio/Studio";
import { occasions } from "@/lib/invitation/occasions";
import { getTemplate } from "@/lib/invitation/templates";
import type { OccasionId } from "@/lib/invitation/types";

export const metadata: Metadata = { title: "Design studio", robots: { index: false } };

async function NewStudio({ searchParams }: { searchParams: PageProps<"/studio/new">["searchParams"] }) {
  const sp = await searchParams;
  const template = typeof sp.template === "string" && getTemplate(sp.template) ? sp.template : undefined;
  const occasion = occasions.find((o) => o.id === sp.occasion)?.id as OccasionId | undefined;
  return <Studio templateId={template} occasion={occasion} />;
}

export default function Page({ searchParams }: PageProps<"/studio/new">) {
  return (
    <Suspense fallback={<div className="fixed inset-0 bg-night" />}>
      <NewStudio searchParams={searchParams} />
    </Suspense>
  );
}
