"use client";

import { Button, Logo } from "@/components/ui/kit";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 px-6 text-center">
      <Logo size={26} />
      <h1 className="display text-5xl">Something went wrong.</h1>
      <p className="max-w-sm text-fg/85">Please try again. If it keeps happening, your work in the studio is still saved.</p>
      <Button onClick={reset}>Try again</Button>
    </main>
  );
}
