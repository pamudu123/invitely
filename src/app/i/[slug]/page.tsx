import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { after } from "next/server";
import { Suspense } from "react";
import { submitRsvpAction } from "@/app/actions/rsvp";
import { InvitationView } from "@/components/invitation/InvitationView";
import { getOccasion } from "@/lib/invitation/occasions";
import { displayNames } from "@/lib/invitation/templates";
import { formatLongDate } from "@/lib/invitation/time";
import {
  getGuestByToken,
  getInvitationBySlug,
  getRsvpForGuest,
  listWishes,
  markGuestOpened,
  recordView,
} from "@/lib/server/invitations";

type Props = PageProps<"/i/[slug]">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const inv = await getInvitationBySlug(slug);
  if (!inv || inv.status !== "published") return { title: "Invitation", robots: { index: false } };
  const names = displayNames(inv.data);
  const occ = getOccasion(inv.data.occasion);
  const description = `${formatLongDate(inv.data.date)} · ${inv.data.venueName}. Tap to open your invitation.`;
  return {
    title: { absolute: `${names} · ${occ.label} invitation` },
    description,
    robots: { index: false },
    openGraph: { title: `${names} · ${occ.label} invitation`, description, type: "website" },
  };
}

async function Invitation({ params, searchParams }: Props) {
  const [{ slug }, sp] = await Promise.all([params, searchParams]);
  const inv = await getInvitationBySlug(slug);
  if (!inv) notFound();

  // A draft can only be previewed with the card's manage token in the link.
  const isDraft = inv.status !== "published";
  if (isDraft && (typeof sp.k !== "string" || sp.k !== inv.manageToken)) notFound();

  const token = typeof sp.g === "string" ? sp.g : "";
  const guest = token ? await getGuestByToken(inv.id, token) : null;
  const [prior, wishes] = await Promise.all([
    guest ? getRsvpForGuest(guest.id) : null,
    inv.data.sections.includes("wishes") ? listWishes(inv.id) : [],
  ]);

  if (!isDraft) {
    after(async () => {
      await recordView(inv.id);
      if (guest) await markGuestOpened(guest.id);
    });
  }

  return (
    <>
      {isDraft ? (
        <div className="fixed inset-x-0 top-0 z-[60] flex items-center justify-center gap-3 bg-flame px-4 py-2 text-center text-[0.78rem] text-night">
          <span>Preview. Only you can see this until you publish.</span>
          <Link href={`/m/${inv.manageToken}`} className="font-semibold underline underline-offset-2">Manage</Link>
        </div>
      ) : null}
      <InvitationView
        data={inv.data}
        guest={guest ? { name: guest.name, seats: guest.seats, token: guest.token, table: guest.table || undefined } : undefined}
        wishes={wishes}
        priorRsvp={prior ? { attending: prior.attending, partySize: prior.partySize } : null}
        onRsvp={submitRsvpAction.bind(null, inv.slug, guest?.token ?? null)}
      />
    </>
  );
}

function Loading() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-night">
      <svg width="34" height="34" viewBox="0 0 24 24" className="animate-flicker" aria-label="Loading">
        <path d="M12 1.5c4 5.2 6.5 8.7 6.5 12.4a6.5 6.5 0 0 1-13 0c0-3.700 2.500-7.200 6.500-12.400z" fill="#e8b565" />
      </svg>
    </div>
  );
}

export default function Page(props: Props) {
  return (
    <Suspense fallback={<Loading />}>
      <Invitation {...props} />
    </Suspense>
  );
}
