"use server";

import { refresh } from "next/cache";
import {
  addGuests,
  deleteGuest,
  deleteRsvp,
  getInvitationByToken,
  setGuestCheckedIn,
  setRsvpHidden,
  updateGuest,
} from "@/lib/server/invitations";

/** Every action takes the card's manage token and resolves the real invitation from it. */
async function owned(token: string) {
  const inv = await getInvitationByToken(token);
  if (!inv) throw new Error("Invitation not found");
  return inv;
}

/**
 * Add guests from pasted text. One guest per line.
 * Optional seat count and phone after commas: "Uncle Sunil & family, 4, 0771234567"
 */
export async function addGuestsAction(token: string, text: string): Promise<{ ok: boolean; added: number }> {
  const invitationId = (await owned(token)).id;
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
  token: string,
  guestId: string,
  patch: { name: string; seats: number; phone: string; table: string },
): Promise<void> {
  const invitationId = (await owned(token)).id;
  await updateGuest(invitationId, guestId, patch);
  refresh();
}

export async function deleteGuestAction(token: string, guestId: string): Promise<void> {
  const invitationId = (await owned(token)).id;
  await deleteGuest(invitationId, guestId);
  refresh();
}

export async function checkInAction(token: string, guestId: string, checkedIn: boolean): Promise<void> {
  const invitationId = (await owned(token)).id;
  await setGuestCheckedIn(invitationId, guestId, checkedIn);
  refresh();
}

export async function hideWishAction(token: string, rsvpId: string, hidden: boolean): Promise<void> {
  const invitationId = (await owned(token)).id;
  await setRsvpHidden(invitationId, rsvpId, hidden);
  refresh();
}

export async function deleteRsvpAction(token: string, rsvpId: string): Promise<void> {
  const invitationId = (await owned(token)).id;
  await deleteRsvp(invitationId, rsvpId);
  refresh();
}
