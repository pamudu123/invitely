import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { CheckinBoard } from "@/components/dashboard/CheckinBoard";
import { ButtonLink, Card } from "@/components/ui/kit";
import { getInvitationByToken, listGuests } from "@/lib/server/invitations";

export const metadata: Metadata = { title: "Door check-in" };

type Props = PageProps<"/m/[token]/checkin">;

async function Checkin({ params }: { params: Props["params"] }) {
  await connection();
  const { token } = await params;
  const inv = await getInvitationByToken(token);
  if (!inv) notFound();
  const guests = await listGuests(inv.id);

  return (
    <>
      <Link
        href={`/m/${inv.manageToken}?tab=guests`}
        className="-ml-2 inline-flex min-h-11 items-center gap-2 rounded-full px-2 text-sm text-fg/85 outline-none transition-colors hover:text-fg focus-visible:ring-2 focus-visible:ring-brand/60"
      >
        <ArrowLeft size={16} strokeWidth={1.5} aria-hidden />
        Back to guests
      </Link>
      <p className="label mt-3 text-brand">Door check-in</p>
      <h1 className="display mb-4 mt-3 break-words text-4xl sm:text-5xl">{inv.title}</h1>

      {guests.length ? (
        <CheckinBoard
          invitationId={inv.manageToken}
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
          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-fg/85">
            Add your guest list first. Everyone on it will show up here, ready to be checked in at the door.
          </p>
          <ButtonLink href={`/m/${inv.manageToken}?tab=guests`} className="mt-6">
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
      <div className="mt-3 h-3 w-28 rounded-full bg-fg/10" />
      <div className="mt-4 h-10 w-2/3 rounded-xl bg-fg/8" />
      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="h-20 rounded-2xl border border-fg/10 bg-page-2" />
        <div className="h-20 rounded-2xl border border-fg/10 bg-page-2" />
      </div>
      <div className="mt-4 h-14 rounded-2xl bg-fg/5" />
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="mt-2.5 h-20 rounded-2xl border border-fg/10 bg-page-2" />
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
