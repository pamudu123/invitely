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
    "Design a living digital invitation in minutes. Guests light the lamp, break the seal or draw the curtains to reveal your day, then RSVP in a tap.",
  openGraph: {
    title: "Invitely · Invitations that open like a ceremony",
    description:
      "Living digital invitations for weddings, homecomings, birthdays and every celebration. Personal guest links, RSVP tracking and auspicious time countdowns.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#060b0b",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${allFontVariables} h-full`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
