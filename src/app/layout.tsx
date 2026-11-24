import type { Metadata, Viewport } from "next";
import { allFontVariables } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Invitely · Invitations that open like a ceremony",
    template: "%s · Invitely",
  },
  description:
    "Design a living digital invitation in minutes. Guests break the seal, draw the curtains or open the doors to reveal your day, then RSVP in a tap.",
  openGraph: {
    title: "Invitely · Invitations that open like a ceremony",
    description:
      "Living digital invitations for weddings, birthdays and every celebration. Personal guest links, RSVP tracking and live countdowns.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#16249a",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${allFontVariables} h-full`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
