import { ImageResponse } from "next/og";
import { getOccasion } from "@/lib/invitation/occasions";
import { getPalette } from "@/lib/invitation/theme";
import { formatLongDate } from "@/lib/invitation/time";
import { getInvitationBySlug } from "@/lib/server/invitations";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Invitation";

/** Preview card shown when an invitation link is shared on WhatsApp and other apps. */
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const inv = await getInvitationBySlug(slug);
  const live = inv && inv.status === "published" ? inv : null;
  const p = live ? getPalette(live.data.theme) : { bg: "#060b0b", ink: "#f4eddf", accent: "#e8b565", deep: "#060b0b", onDeep: "#f4eddf" };
  const names = live ? [live.data.name1, live.data.name2].filter(Boolean) : ["Invitely"];
  const label = live ? `${getOccasion(live.data.occasion).label} invitation` : "Digital invitations";
  const footer = live ? `${formatLongDate(live.data.date)}  ·  ${live.data.venueName}` : "Invitations that open like a ceremony";
  // The built-in font covers Latin only, so other scripts fall back to the label alone.
  const latin = names.every((n) => /^[\u0000-ɏ\s]*$/.test(n));
  const big = names.join(" & ").length > 22 ? 84 : 112;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: p.deep,
          padding: 28,
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            border: `2px solid ${p.accent}`,
            color: p.onDeep,
            textAlign: "center",
            padding: 48,
          }}
        >
          <div style={{ display: "flex", fontSize: 26, letterSpacing: 10, textTransform: "uppercase", color: p.accent }}>{label}</div>
          {latin ? (
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "baseline", marginTop: 34, fontSize: big, lineHeight: 1.05 }}>
              <span>{names[0]}</span>
              {names[1] ? <span style={{ color: p.accent, margin: "0 28px", fontSize: big * 0.6 }}>&amp;</span> : null}
              {names[1] ? <span>{names[1]}</span> : null}
            </div>
          ) : null}
          <div style={{ display: "flex", width: 120, height: 2, background: p.accent, marginTop: 40 }} />
          <div style={{ display: "flex", fontSize: 30, marginTop: 34, opacity: 0.85 }}>{footer}</div>
          <div style={{ display: "flex", fontSize: 20, letterSpacing: 6, textTransform: "uppercase", marginTop: 40, opacity: 0.5 }}>Tap to open</div>
        </div>
      </div>
    ),
    size,
  );
}
