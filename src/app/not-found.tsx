import { BySeason } from "@/components/site/season/BySeason";
import { ButtonLink, Logo } from "@/components/ui/kit";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 px-6 text-center">
      <Logo size={26} />
      <p className="label text-brand">Page not found</p>
      <h1 className="display text-5xl sm:text-7xl"><BySeason winter="Lost in the snow." spring="Lost in the blossom." summer="Lost at sea." autumn="Lost in the leaves." /></h1>
      <p className="max-w-sm text-fg/85">The page you are looking for has moved or never existed.</p>
      <ButtonLink href="/">Back to Invitely</ButtonLink>
    </main>
  );
}
