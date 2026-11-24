import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/ui/kit";

export const metadata: Metadata = { title: "Team", robots: { index: false, follow: false }, referrer: "no-referrer" };

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="flex min-h-dvh flex-col bg-night text-paper">
      <header className="border-b border-paper/10">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/admin" className="flex items-center gap-3 text-paper">
            <Logo />
            <span className="label text-flame">Team</span>
          </Link>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-24 pt-8 sm:px-6 sm:pt-12">{children}</main>
    </div>
  );
}
