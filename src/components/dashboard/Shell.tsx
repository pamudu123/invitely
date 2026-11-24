import { Plus } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { ButtonLink, Logo } from "@/components/ui/kit";

/** Frame for the host pages. There is no sign in: a card is opened with its private link. */
export function ManageShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-page text-fg">
      <header className="sticky top-0 z-40 border-b border-fg/10 bg-page/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <Link href="/" aria-label="Invitely home" className="text-fg">
            <Logo />
          </Link>
          <div className="flex items-center gap-2">
            <ButtonLink href="/my" variant="ghost" size="sm">My cards</ButtonLink>
            <ButtonLink href="/templates" size="sm">
              <Plus size={16} strokeWidth={1.5} aria-hidden /> New
            </ButtonLink>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-24 pt-8 sm:px-6 sm:pt-12">{children}</main>
    </div>
  );
}
