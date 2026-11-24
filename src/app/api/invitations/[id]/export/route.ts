import { connection } from "next/server";
import { getUser } from "@/lib/server/auth";
import { getInvitation, listRsvps } from "@/lib/server/invitations";

/**
 * One CSV cell. Values that a spreadsheet would run as a formula get a leading
 * single quote, and every cell is quoted with inner quotes doubled.
 */
function cell(value: string | number): string {
  let text = String(value);
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}

export async function GET(_req: Request, ctx: RouteContext<"/api/invitations/[id]/export">) {
  await connection();
  const { id } = await ctx.params;
  const user = await getUser();
  if (!user) return new Response("Please sign in to export replies.", { status: 401 });
  const inv = await getInvitation(id, user.id);
  if (!inv) return new Response("Not found", { status: 404 });

  const rsvps = await listRsvps(inv.id);
  const header = ["Name", "Attending", "Party size", "Meal", "Answer", "Message", "Phone", "Replied at"];
  const rows = rsvps.map((r) => [
    r.name,
    r.attending ? "Yes" : "No",
    r.partySize,
    r.meal,
    r.answer,
    r.message,
    r.phone,
    new Date(r.updatedAt).toISOString(),
  ]);
  // The byte order mark lets Excel read Sinhala and Tamil names correctly.
  const csv = `﻿${[header, ...rows].map((row) => row.map(cell).join(",")).join("\r\n")}\r\n`;
  const filename = `${inv.slug.replace(/[^a-z0-9-]/g, "") || "invitation"}-replies.csv`;

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
