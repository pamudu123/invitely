import { ButtonLink } from "@/components/ui/kit";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center py-16 text-center">
      <p className="label text-brand">Not found</p>
      <h1 className="display mt-4 text-5xl">This manage link does not work</h1>
      <p className="mt-4 text-sm leading-relaxed text-fg/85">
        The card may have been deleted, or the link was not copied in full. You can find a card again with its
        invitation link and edit PIN.
      </p>
      <ButtonLink href="/my" size="lg" className="mt-8">Find my card</ButtonLink>
    </div>
  );
}
