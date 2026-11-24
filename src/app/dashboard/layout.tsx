import { LogOut, Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import { logoutAction } from "@/app/actions/auth";
import { ButtonLink, Logo } from "@/components/ui/kit";
import { requireUser } from "@/lib/server/auth";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false },
};

async function UserMenu() {
  // The session check reads the clock, so it has to wait for a real request.
  await connection();
  const user = await requireUser("/dashboard");
  const initial = user.name.trim().charAt(0).toUpperCase() || "?";
  return (
    <>
      <span className="flex min-w-0 items-center gap-2.5" title={user.email}>
        <span
          aria-hidden
          className="grid size-9 shrink-0 place-items-center rounded-full border border-paper/15 bg-night-3 font-serif text-lg leading-none text-flame"
        >
          {initial}
        </span>
        <span className="sr-only sm:not-sr-only sm:max-w-40 sm:truncate sm:text-sm sm:text-paper/75">{user.name}</span>
      </span>
      <form action={logoutAction}>
        <button
          type="submit"
          aria-label="Sign out"
          className="inline-flex h-11 min-w-11 items-center justify-center gap-2 rounded-full px-0 text-sm text-paper/60 outline-none transition-colors hover:bg-paper/5 hover:text-paper focus-visible:ring-2 focus-visible:ring-flame/60 sm:px-4"
        >
          <LogOut size={17} strokeWidth={1.5} aria-hidden />
          <span className="hidden sm:inline">Sign out</span>
        </button>
      </form>
    </>
  );
}

function UserMenuFallback() {
  return (
    <>
      <span className="size-9 shrink-0 animate-pulse rounded-full bg-paper/5" />
      <span className="h-11 w-11 sm:w-24" />
    </>
  );
}

export default function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
  return (
    <div className="flex min-h-dvh flex-col bg-night text-paper">
      <header className="sticky top-0 z-40 border-b border-paper/10 bg-night/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <Link
            href="/"
            aria-label="Invitely home"
            className="-ml-1 flex min-h-11 items-center rounded-full px-1 outline-none focus-visible:ring-2 focus-visible:ring-flame/60"
          >
            <Logo />
          </Link>
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <ButtonLink href="/templates" className="!px-4 sm:!px-5">
              <Plus size={17} strokeWidth={1.5} aria-hidden />
              <span>
                New<span className="hidden sm:inline"> invitation</span>
              </span>
            </ButtonLink>
            <Suspense fallback={<UserMenuFallback />}>
              <UserMenu />
            </Suspense>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-24 pt-8 sm:px-6 sm:pt-12">{children}</main>
    </div>
  );
}
