"use server";

import { refresh } from "next/cache";
import { requireUser } from "@/lib/server/auth";
import {
  addGuests,
  deleteGuest,
  deleteRsvp,
  getInvitation,
  setGuestCheckedIn,
  setRsvpHidden,
  updateGuest,
} from "@/lib/server/invitations";

async function owned(invitationId: string) {
  const user = await requireUser();
  const inv = await getInvitation(invitationId, user.id);
  if (!inv) throw new Error("Invitation not found");
  return inv;
}

/**
 * Add guests from pasted text. One guest per line.
 * Optional seat count and phone after commas: "Uncle Sunil & family, 4, 0771234567"
 */
export async function addGuestsAction(invitationId: string, text: string): Promise<{ ok: boolean; added: number }> {
  await owned(invitationId);
  const list = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split(/[,\t]/).map((p) => p.trim());
      const seats = Number(parts[1]);
      return {
        name: parts[0],
        seats: Number.isFinite(seats) && seats > 0 ? seats : 1,
        phone: parts[2] ?? "",
        table: parts[3] ?? "",
      };
    });
  const added = await addGuests(invitationId, list);
  refresh();
  return { ok: true, added };
}

export async function updateGuestAction(
  invitationId: string,
  guestId: string,
  patch: { name: string; seats: number; phone: string; table: string },
): Promise<void> {
  await owned(invitationId);
  await updateGuest(invitationId, guestId, patch);
  refresh();
}

export async function deleteGuestAction(invitationId: string, guestId: string): Promise<void> {
  await owned(invitationId);
  await deleteGuest(invitationId, guestId);
  refresh();
}

export async function checkInAction(invitationId: string, guestId: string, checkedIn: boolean): Promise<void> {
  await owned(invitationId);
  await setGuestCheckedIn(invitationId, guestId, checkedIn);
  refresh();
}

export async function hideWishAction(invitationId: string, rsvpId: string, hidden: boolean): Promise<void> {
  await owned(invitationId);
  await setRsvpHidden(invitationId, rsvpId, hidden);
  refresh();
}

export async function deleteRsvpAction(invitationId: string, rsvpId: string): Promise<void> {
  await owned(invitationId);
  await deleteRsvp(invitationId, rsvpId);
  refresh();
}
