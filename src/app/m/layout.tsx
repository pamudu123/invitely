import type { Metadata } from "next";
import { ManageShell } from "@/components/dashboard/Shell";

// Manage links are secrets: keep them out of search results and out of the Referer header.
export const metadata: Metadata = {
  title: "Manage invitation",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

export default function ManageLayout({ children }: LayoutProps<"/m">) {
  return <ManageShell>{children}</ManageShell>;
}
