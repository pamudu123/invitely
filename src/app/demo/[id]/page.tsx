import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { InvitationView } from "@/components/invitation/InvitationView";
import { demoWishes } from "@/lib/invitation/demo";
import { createFromTemplate, getTemplate, templates } from "@/lib/invitation/templates";

export function generateStaticParams() {
  return templates.map((t) => ({ id: t.id }));
}

export async function generateMetadata({ params }: PageProps<"/demo/[id]">): Promise<Metadata> {
  const { id } = await params;
  const tpl = getTemplate(id);
  return { title: tpl ? `${tpl.name} demo` : "Demo", robots: { index: false } };
}

async function Demo({ params }: { params: PageProps<"/demo/[id]">["params"] }) {
  const { id } = await params;
  const tpl = getTemplate(id);
  if (!tpl) notFound();
  const data = createFromTemplate(tpl.id);
  return <InvitationView data={data} wishes={demoWishes} />;
}

export default function DemoPage({ params }: PageProps<"/demo/[id]">) {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-night" />}>
      <Demo params={params} />
    </Suspense>
  );
}
