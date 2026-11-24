import type { Metadata } from "next";
import { Faq, type FaqItem } from "@/components/site/Faq";
import { PlanCards } from "@/components/site/PlanCards";
import { SiteFooter, SiteHeader } from "@/components/site/chrome";
import { ButtonLink } from "@/components/ui/kit";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Design your invitation free. Pay once per event to publish. No subscription and no charge per guest.",
};

const pricingFaq: FaqItem[] = [
  {
    q: "Is it really one payment?",
    a: "Yes. You pay once for each event you publish. There is no monthly fee and no charge per guest, however many people you invite.",
  },
  {
    q: "How do I pay?",
    a: "You can pay by card or by bank transfer. Your invitation goes live as soon as the payment is confirmed.",
  },
  {
    q: "Can I upgrade later?",
    a: "Yes. Start on Essential and move to Signature when you want personal guest links. You only pay the difference.",
  },
  {
    q: "What if my date changes?",
    a: "Change it in the studio as often as you need. Your link stays the same and every guest sees the new details.",
  },
  {
    q: "Do you offer refunds?",
    a: "If you have not shared your published link with guests yet, write to us within 7 days and we will refund you in full.",
  },
];

export default function PricingPage() {
  return (
    <>
      <SiteHeader />
      <main className="px-5 pb-28 pt-28 sm:px-8 lg:pt-36">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="label text-brand">Pricing</p>
            <h1 className="display mt-5 text-[clamp(3rem,9vw,6.5rem)]">Design free. Pay once to publish.</h1>
            <p className="mx-auto mb-12 mt-6 max-w-xl text-[1.05rem] leading-relaxed text-fg/85">
              Build your whole invitation and preview it on your phone before you spend anything. One payment per event,
              with unlimited guests.
            </p>
          </div>
          <PlanCards />
          <section className="mx-auto mt-28 grid max-w-6xl gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="label text-brand">Questions</p>
              <h2 className="display mt-5 text-5xl sm:text-6xl">About paying.</h2>
            </div>
            <Faq items={pricingFaq} />
          </section>
          <section className="mt-24 rounded-3xl border border-fg/10 bg-page-2 px-6 py-14 text-center">
            <h2 className="display text-4xl sm:text-6xl">See your names on it first.</h2>
            <p className="mx-auto mt-4 max-w-md text-fg/85">Choose a design and start customising. It takes less than a minute to see your own invitation.</p>
            <ButtonLink href="/templates" size="lg" className="mt-8">Browse the designs</ButtonLink>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
