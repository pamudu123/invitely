import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CardStudio } from "@/components/cards/CardStudio";
import { cleanCardDesign } from "@/lib/invitation/cardDesign";
import { getInvitationByToken, listGuests } from "@/lib/server/invitations";

export const metadata: Metadata = { title: "Image card" };

type Props = PageProps<"/m/[token]/image">;

async function Content({ params }: { params: Props["params"] }) {
  const { token } = await params;
  const inv = await getInvitationByToken(token);
  if (!inv) notFound();
  const guests = await listGuests(inv.id);
  return (
    <>
      <Link href={`/m/${inv.manageToken}`} className="inline-flex items-center gap-2 text-sm text-fg/85 hover:text-fg">
        <ArrowLeft size={15} strokeWidth={1.5} aria-hidden /> {inv.title}
      </Link>
      <p className="label mt-7 text-brand">Included with your web card</p>
      <h1 className="display mt-3 text-5xl sm:text-6xl">Send it as a picture.</h1>
      <p className="mb-9 mt-4 max-w-2xl text-sm leading-relaxed text-fg/85">
        Your web card as an image for WhatsApp, a status or a family group. Upload your own pictures, change the colours or the wording, add the name of a guest if you like, then share or download.
      </p>
      <CardStudio
        kind="image"
        token={inv.manageToken}
        saved={inv.data.cards?.image ? cleanCardDesign(inv.data.cards.image, "image") : undefined}
        data={inv.data}
        slug={inv.slug}
        published={inv.status === "published"}
        guests={guests.map((g) => ({ id: g.id, name: g.name, seats: g.seats, token: g.token }))}
      />
    </>
  );
}

export default function Page({ params }: Props) {
  return (
    <Suspense fallback={<div className="h-96 animate-pulse rounded-2xl border border-fg/10 bg-page-2" />}>
      <Content params={params} />
    </Suspense>
  );
}
