import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Studio } from "@/components/studio/Studio";
import { getInvitationByToken } from "@/lib/server/invitations";

export const metadata: Metadata = {
  title: "Design studio",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

async function SavedStudio({ params }: { params: PageProps<"/studio/[token]">["params"] }) {
  const { token } = await params;
  const inv = await getInvitationByToken(token);
  if (!inv) notFound();
  return <Studio saved={{ id: inv.manageToken, slug: inv.slug, status: inv.status, data: inv.data }} />;
}

export default function Page({ params }: PageProps<"/studio/[token]">) {
  return (
    <Suspense fallback={<div className="fixed inset-0 bg-page" />}>
      <SavedStudio params={params} />
    </Suspense>
  );
}
