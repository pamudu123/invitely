import type { Metadata } from "next";
import { ManageShell } from "@/components/dashboard/Shell";

export const metadata: Metadata = { title: "My cards", robots: { index: false } };

export default function MyLayout({ children }: LayoutProps<"/my">) {
  return <ManageShell>{children}</ManageShell>;
}
