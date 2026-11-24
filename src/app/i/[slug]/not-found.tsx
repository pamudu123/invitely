import { ButtonLink, Logo } from "@/components/ui/kit";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 px-6 text-center">
      <Logo size={26} />
      <h1 className="display text-5xl">This invitation is not available</h1>
      <p className="max-w-sm text-paper/60">
        The link may be mistyped, or the host has not published it yet. Please check with the person who sent it to you.
      </p>
      <ButtonLink href="/" variant="secondary">Go to Invitely</ButtonLink>
    </main>
  );
}
