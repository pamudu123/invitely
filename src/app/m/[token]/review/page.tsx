import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ReviewBoard } from "@/components/review/ReviewBoard";
import { getInvitationByToken } from "@/lib/server/invitations";
import { listReviews } from "@/lib/server/reviews";

export const metadata: Metadata = { title: "Send for review" };

type Props = PageProps<"/m/[token]/review">;

async function Content({ params }: { params: Props["params"] }) {
  const { token } = await params;
  const inv = await getInvitationByToken(token);
  if (!inv) notFound();
  const rounds = await listReviews(inv.id);
  return (
    <>
      <Link href={`/m/${inv.manageToken}`} className="inline-flex items-center gap-2 text-sm text-fg/85 hover:text-fg">
        <ArrowLeft size={15} strokeWidth={1.5} aria-hidden /> {inv.title}
      </Link>
      <p className="label mt-7 text-brand">Review</p>
      <h1 className="display mt-3 text-5xl sm:text-6xl">Point at it. We will fix it.</h1>
      <p className="mb-9 mt-4 max-w-2xl text-sm leading-relaxed text-fg/85">
        Finished editing but something is still not right? Tap the spot on your card, say what should change and send it
        to our team. You can do this as often as you like until you confirm the card.
      </p>
      <ReviewBoard
        mode="host"
        data={inv.data}
        token={inv.manageToken}
        status={inv.reviewStatus}
        rounds={rounds.map((r) => ({ id: r.id, round: r.round, status: r.status, note: r.note, pins: r.pins, reply: r.reply }))}
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
