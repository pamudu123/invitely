import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Studio } from "@/components/studio/Studio";
import { requireUser } from "@/lib/server/auth";
import { getInvitation } from "@/lib/server/invitations";

export const metadata: Metadata = { title: "Design studio", robots: { index: false } };

async function SavedStudio({ params }: { params: PageProps<"/studio/[id]">["params"] }) {
  const { id } = await params;
  const user = await requireUser(`/studio/${id}`);
  const inv = await getInvitation(id, user.id);
  if (!inv) notFound();
  return <Studio saved={{ id: inv.id, slug: inv.slug, status: inv.status, data: inv.data }} />;
}

export default function Page({ params }: PageProps<"/studio/[id]">) {
  return (
    <Suspense fallback={<div className="fixed inset-0 bg-night" />}>
      <SavedStudio params={params} />
    </Suspense>
  );
}
