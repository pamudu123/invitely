import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ReviewBoard } from "@/components/review/ReviewBoard";
import { requireAdmin } from "@/lib/server/admin";
import { db } from "@/lib/server/db";
import { getInvitationByToken } from "@/lib/server/invitations";
import { listReviews } from "@/lib/server/reviews";

type Props = PageProps<"/admin/cards/[id]">;

async function Content({ params }: { params: Props["params"] }) {
  await requireAdmin();
  const { id } = await params;
  const c = await db();
  const row = await c.execute({ sql: "SELECT manage_token FROM invitations WHERE id = ?", args: [id] });
  const inv = row.rows[0] ? await getInvitationByToken(String(row.rows[0].manage_token)) : null;
  if (!inv) notFound();
  const rounds = await listReviews(inv.id);
  return (
    <>
      <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-fg/85 hover:text-fg">
        <ArrowLeft size={15} strokeWidth={1.5} aria-hidden /> Review queue
      </Link>
      <h1 className="display mt-6 text-5xl">{inv.title}</h1>
      <p className="mt-2 text-sm text-fg/85">
        /i/{inv.slug}{inv.ownerName ? ` · ${inv.ownerName}` : ""}{inv.ownerContact ? ` · ${inv.ownerContact}` : ""}
      </p>
      <div className="mb-8 mt-5 rounded-2xl border border-fg/10 bg-page-2 p-4 text-sm leading-relaxed text-fg/90">
        <p className="label text-brand">Edit this card with Claude Code</p>
        <p className="mt-2">
          In the project folder, run <code className="rounded bg-page-3 px-1.5 py-0.5 font-mono text-[0.8rem] text-fg">/revise-card {inv.slug}</code> in
          Claude Code. It downloads only this card with the host&apos;s notes, makes the changes and sends it back.
        </p>
      </div>
      <ReviewBoard
        mode="team"
        data={inv.data}
        status={inv.reviewStatus}
        rounds={rounds.map((r) => ({ id: r.id, round: r.round, status: r.status, note: r.note, pins: r.pins, reply: r.reply }))}
        studioHref={`/studio/${inv.manageToken}`}
      />
    </>
  );
}

export default function AdminCardPage({ params }: Props) {
  return (
    <Suspense fallback={<div className="h-96 animate-pulse rounded-2xl border border-fg/10 bg-page-2" />}>
      <Content params={params} />
    </Suspense>
  );
}
