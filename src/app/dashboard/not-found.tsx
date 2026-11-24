import { ButtonLink, Card } from "@/components/ui/kit";

export default function DashboardNotFound() {
  return (
    <Card className="mx-auto mt-6 flex max-w-xl flex-col items-center px-6 py-14 text-center sm:py-20">
      <p className="label text-flame">Not found</p>
      <h1 className="display mt-4 text-4xl sm:text-5xl">We could not find that invitation</h1>
      <p className="mt-4 max-w-sm text-sm leading-relaxed text-paper/60">
        It may have been deleted, or it belongs to a different account. Your other invitations are safe on the dashboard.
      </p>
      <ButtonLink href="/dashboard" size="lg" className="mt-8">
        Back to your invitations
      </ButtonLink>
    </Card>
  );
}
