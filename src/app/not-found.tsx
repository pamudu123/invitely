import { ButtonLink, Logo } from "@/components/ui/kit";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 px-6 text-center">
      <Logo size={26} />
      <p className="label text-flame">Page not found</p>
      <h1 className="display text-5xl sm:text-7xl">This lamp is not lit.</h1>
      <p className="max-w-sm text-paper/60">The page you are looking for has moved or never existed.</p>
      <ButtonLink href="/">Back to Invitely</ButtonLink>
    </main>
  );
}
