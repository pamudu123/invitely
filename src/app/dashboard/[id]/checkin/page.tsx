import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { CheckinBoard } from "@/components/dashboard/CheckinBoard";
import { ButtonLink, Card } from "@/components/ui/kit";
import { requireUser } from "@/lib/server/auth";
import { getInvitation, listGuests } from "@/lib/server/invitations";

export const metadata: Metadata = { title: "Door check-in" };

type Props = PageProps<"/dashboard/[id]/checkin">;

async function Checkin({ params }: { params: Props["params"] }) {
  await connection();
  const { id } = await params;
  const user = await requireUser(`/dashboard/${id}/checkin`);
  const inv = await getInvitation(id, user.id);
  if (!inv) notFound();
  const guests = await listGuests(inv.id);

  return (
    <>
      <Link
        href={`/dashboard/${inv.id}?tab=guests`}
        className="-ml-2 inline-flex min-h-11 items-center gap-2 rounded-full px-2 text-sm text-paper/60 outline-none transition-colors hover:text-paper focus-visible:ring-2 focus-visible:ring-flame/60"
      >
        <ArrowLeft size={16} strokeWidth={1.5} aria-hidden />
        Back to guests
      </Link>
      <p className="label mt-3 text-flame">Door check-in</p>
      <h1 className="display mb-4 mt-3 break-words text-4xl sm:text-5xl">{inv.title}</h1>

      {guests.length ? (
        <CheckinBoard
          invitationId={inv.id}
          guests={guests.map((g) => ({
            id: g.id,
            name: g.name,
            seats: g.seats,
            table: g.table,
            checkedIn: g.checkedInAt !== null,
          }))}
        />
      ) : (
        <Card className="mt-6 px-6 py-12 text-center">
          <h2 className="display text-3xl">No guests to check in yet</h2>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-paper/60">
            Add your guest list first. Everyone on it will show up here, ready to be checked in at the door.
          </p>
          <ButtonLink href={`/dashboard/${inv.id}?tab=guests`} className="mt-6">
            Add guests
          </ButtonLink>
        </Card>
      )}
    </>
  );
}

function CheckinFallback() {
  return (
    <div aria-hidden className="animate-pulse">
      <div className="h-11" />
      <div className="mt-3 h-3 w-28 rounded-full bg-paper/10" />
      <div className="mt-4 h-10 w-2/3 rounded-xl bg-paper/8" />
      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="h-20 rounded-2xl border border-paper/10 bg-night-2" />
        <div className="h-20 rounded-2xl border border-paper/10 bg-night-2" />
      </div>
      <div className="mt-4 h-14 rounded-2xl bg-paper/5" />
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="mt-2.5 h-20 rounded-2xl border border-paper/10 bg-night-2" />
      ))}
    </div>
  );
}

export default function CheckinPage({ params }: Props) {
  return (
    <div className="mx-auto -mt-4 max-w-2xl sm:-mt-6">
      <Suspense fallback={<CheckinFallback />}>
        <Checkin params={params} />
      </Suspense>
    </div>
  );
}
