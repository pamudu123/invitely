import {
  ArrowRight,
  ArrowUpRight,
  Clock,
  Infinity as InfinityIcon,
  Languages,
  Link2,
  MessageCircle,
  Music,
  QrCode,
  Table2,
} from "lucide-react";
import Link from "next/link";
import { Faq } from "@/components/site/Faq";
import { HeroPhone, RitualShowcase } from "@/components/site/LiveDemos";
import { PrintPreview } from "@/components/cards/PrintPreview";
import { PlanCards } from "@/components/site/PlanCards";
import { SiteFooter, SiteHeader } from "@/components/site/chrome";
import { TemplateCover } from "@/components/site/TemplateCover";
import { ButtonLink } from "@/components/ui/kit";
import { occasions } from "@/lib/invitation/occasions";
import { ritualInfo } from "@/lib/invitation/rituals";
import { createFromTemplate, templates } from "@/lib/invitation/templates";

const features = [
  {
    icon: Link2,
    title: "A link for every guest",
    text: "Each family opens an invitation that greets them by name and shows the seats you saved for them. Their reply lands on the right row of your list.",
  },
  {
    icon: Clock,
    title: "Auspicious times, counted down",
    text: "Set out each nekath or muhurtham as its own moment with a live countdown, so nobody has to ask what time the poruwa ceremony begins.",
  },
  {
    icon: Languages,
    title: "Sinhala, Tamil and English",
    text: "Write in the language of your family and offer the others too. Guests switch with one tap and every label and date follows.",
  },
  {
    icon: MessageCircle,
    title: "Made for WhatsApp",
    text: "Send each personal link from your manage page in one tap, with a message ready to go. The preview card looks right in every chat.",
  },
  {
    icon: Table2,
    title: "Replies in one place",
    text: "See who is coming, how many seats and which meals as replies arrive. Export to a spreadsheet for your planner or caterer.",
  },
  {
    icon: QrCode,
    title: "Check in at the door",
    text: "Hand an usher a phone. Search a name, tap once and watch the room fill. No clipboard, no printed lists.",
  },
  {
    icon: Music,
    title: "Soundscapes built in",
    text: "Soft bells, slow strings or bright kalimba, generated live in the browser. Nothing to license and nothing to upload.",
  },
  {
    icon: InfinityIcon,
    title: "A keepsake that stays",
    text: "After the day your invitation becomes a thank you page with photos and wishes. Signature links never expire.",
  },
];

const steps = [
  { n: "01", title: "Choose a design", text: "Start from a design made for your occasion. Every colour, letter and ornament can change." },
  { n: "02", title: "Make it yours", text: "Add your names, times, venue and photos. Watch it update on a phone as you type." },
  { n: "03", title: "Share and relax", text: "Publish, send personal links on WhatsApp and follow the replies as they come in." },
];

const showcaseTemplates = ["pahana", "bulath", "gazette", "dorakada", "first-class", "nelum", "premiere", "kolam", "mathaka", "tharu", "suriya", "noor", "nattal", "pop"];
const openingCount = Object.keys(ritualInfo).length - 1;

function SectionHeading({ label, title, children }: { label: string; title: React.ReactNode; children?: React.ReactNode }) {
  return (
    <div className="max-w-3xl">
      <p className="label text-flame">{label}</p>
      <h2 className="display mt-5 text-[clamp(2.6rem,7vw,5.2rem)]">{title}</h2>
      {children ? <p className="mt-6 max-w-xl text-[1.05rem] leading-relaxed text-paper/60">{children}</p> : null}
    </div>
  );
}

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="overflow-x-clip">
        {/* Hero */}
        <section className="grain relative px-5 pb-20 pt-28 sm:px-8 lg:min-h-dvh lg:pb-24 lg:pt-36">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(70% 55% at 78% 48%, rgba(232,181,101,0.13), transparent 70%), radial-gradient(50% 40% at 10% 0%, rgba(99,199,182,0.07), transparent 70%)",
            }}
          />
          <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10 [&>*]:min-w-0">
            <div>
              <p className="label animate-fade-up text-flame">Living digital invitations</p>
              <h1 className="display animate-fade-up mt-6 text-[clamp(3.3rem,10.5vw,8rem)]" style={{ animationDelay: "80ms" }}>
                Invitations that open like a <em className="text-flame">ceremony</em>.
              </h1>
              <p className="animate-fade-up mt-7 max-w-xl text-[1.08rem] leading-relaxed text-paper/65" style={{ animationDelay: "160ms" }}>
                Your guests light the lamp, break the seal or draw the curtains, and your day unfolds on their phone.
                Design it yourself in minutes, send a personal link to every family and watch the replies arrive.
              </p>
              <div className="animate-fade-up mt-9 flex flex-wrap gap-3" style={{ animationDelay: "240ms" }}>
                <ButtonLink href="/templates" size="lg">
                  Start designing free <ArrowRight size={17} />
                </ButtonLink>
                <ButtonLink href="/demo/pahana" variant="secondary" size="lg" target="_blank">
                  Open a live invitation
                </ButtonLink>
              </div>
              <dl className="animate-fade-up mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-paper/10 pt-6" style={{ animationDelay: "320ms" }}>
                {[
                  [String(templates.length), "designs"],
                  [String(openingCount), "openings"],
                  ["3", "languages"],
                ].map(([n, l]) => (
                  <div key={l}>
                    <dt className="display text-4xl sm:text-5xl">{n}</dt>
                    <dd className="label mt-2 text-paper/45">{l}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="animate-fade-up" style={{ animationDelay: "200ms" }}>
              <HeroPhone />
            </div>
          </div>
        </section>

        {/* Occasion strip */}
        <section aria-label="Occasions" className="border-y border-paper/10 py-5">
          <div className="no-scrollbar mx-auto flex max-w-6xl gap-x-10 gap-y-3 overflow-x-auto px-5 sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-8">
            {occasions.map((o) => (
              <Link key={o.id} href={`/templates?occasion=${o.id}`} className="shrink-0 font-serif text-xl italic text-paper/50 transition-colors hover:text-flame">
                {o.plural}
              </Link>
            ))}
          </div>
        </section>

        {/* Openings */}
        <section id="openings" className="scroll-mt-20 px-5 py-24 sm:px-8 lg:py-36">
          <div className="mx-auto max-w-7xl">
            <SectionHeading label="The signature" title={<>Every invitation begins with a <em className="text-flame">gesture</em>.</>}>
              Every celebration here starts by lighting the oil lamp, and every invitation with a sheaf of betel. So does
              yours. Choose the opening that suits your day and try each one below.
            </SectionHeading>
            <div className="mt-14">
              <RitualShowcase />
            </div>
          </div>
        </section>

        {/* Three lives */}
        <section className="relative border-y border-paper/10 bg-night-2 px-5 py-24 sm:px-8 lg:py-32">
          <div className="mx-auto max-w-7xl">
            <SectionHeading label="One link, three lives" title="It changes as your day does.">
              A printed card says one thing forever. Your Invitely link knows what day it is.
            </SectionHeading>
            <div className="mt-14 grid gap-4 md:grid-cols-3">
              {[
                {
                  tag: "Before",
                  title: "The invitation",
                  text: "Countdown, schedule, map and RSVP. Guests add it to their calendar and reply in a tap.",
                  body: (
                    <div className="text-center">
                      <p className="label text-[#a47b3c]">Counting down</p>
                      <p className="mt-2 font-serif text-5xl text-[#2a2620]">142 : 18 : 03</p>
                      <p className="label mt-2 text-[#2a2620]/50">days · hours · minutes</p>
                    </div>
                  ),
                },
                {
                  tag: "On the day",
                  title: "The live guide",
                  text: "The page shows what is happening now and what comes next, with directions one tap away.",
                  body: (
                    <div className="grid gap-2 text-left">
                      <div className="border border-[#a47b3c] px-4 py-3">
                        <p className="label flex items-center gap-2 text-[#a47b3c]"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" /> Happening now</p>
                        <p className="font-serif text-2xl text-[#2a2620]">Poruwa ceremony</p>
                      </div>
                      <div className="border border-[#2a2620]/15 px-4 py-3">
                        <p className="label text-[#2a2620]/50">Up next · 12:30</p>
                        <p className="font-serif text-2xl text-[#2a2620]">Lunch is served</p>
                      </div>
                    </div>
                  ),
                },
                {
                  tag: "After",
                  title: "The keepsake",
                  text: "Your thank you note, your photos and every wish your guests left, kept together on the same link.",
                  body: (
                    <div className="text-center">
                      <p className="font-serif text-4xl italic text-[#2a2620]">Thank you</p>
                      <p className="mx-auto mt-2 max-w-[15rem] font-serif text-lg leading-snug text-[#2a2620]/70">for being part of our day. Your blessings mean more than we can say.</p>
                    </div>
                  ),
                },
              ].map((c) => (
                <article key={c.tag} className="flex flex-col rounded-3xl border border-paper/10 bg-night p-5">
                  <div className="flex min-h-48 items-center justify-center rounded-2xl bg-[#f7f1e5] p-6">
                    <div className="w-full">{c.body}</div>
                  </div>
                  <p className="label mt-6 text-flame">{c.tag}</p>
                  <h3 className="display mt-2 text-3xl">{c.title}</h3>
                  <p className="mt-3 leading-relaxed text-paper/60">{c.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="scroll-mt-20 px-5 py-24 sm:px-8 lg:py-36">
          <div className="mx-auto max-w-7xl">
            <SectionHeading label="What you get" title={<>Made for how we <em className="text-flame">celebrate</em>.</>}>
              Built around real Sri Lankan celebrations, from the first nekath to the last guest through the door. Ready for
              family anywhere in the world.
            </SectionHeading>
            <div className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-paper/10 bg-paper/10 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((f) => (
                <article key={f.title} className="bg-night p-7 transition-colors hover:bg-night-2">
                  <f.icon size={24} strokeWidth={1.3} className="text-flame" />
                  <h3 className="mt-6 font-serif text-[1.55rem] leading-tight">{f.title}</h3>
                  <p className="mt-3 text-[0.92rem] leading-relaxed text-paper/55">{f.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Image and print */}
        <section className="border-t border-paper/10 px-5 py-24 sm:px-8 lg:py-32">
          <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 lg:grid-cols-[1fr_auto] [&>*]:min-w-0">
            <div>
              <SectionHeading label="Beyond the screen" title={<>One design. Web, image and <em className="text-flame">paper</em>.</>}>
                Every web card also comes as an image to send on WhatsApp or post as a status. And for the guests who
                should receive something in the hand, add a printed card in a shape that is anything but a rectangle. Its
                back carries a QR code that opens your invitation.
              </SectionHeading>
              <ButtonLink href="/print-cards" variant="secondary" className="mt-9">
                See the printed cards <ArrowUpRight size={16} />
              </ButtonLink>
            </div>
            <div className="no-scrollbar -mx-5 flex items-end gap-5 overflow-x-auto px-5 pb-6 lg:mx-0 lg:px-0">
              <PrintPreview design="thorana" data={createFromTemplate("mahanuwara")} width={190} />
              <PrintPreview design="bulath-kole" data={createFromTemplate("bulath")} width={190} />
              <PrintPreview design="araliya" data={createFromTemplate("nelum")} width={170} />
            </div>
          </div>
        </section>

        {/* Designs rail */}
        <section className="border-y border-paper/10 bg-night-2 py-24 lg:py-32">
          <div className="mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-6 px-5 sm:px-8">
            <SectionHeading label="The collection" title={`${templates.length} designs. Endlessly yours.`}>
              Named for the things they are drawn from. Every one can change colour, lettering, ornament and opening.
            </SectionHeading>
            <ButtonLink href="/templates" variant="secondary">
              See every design <ArrowUpRight size={16} />
            </ButtonLink>
          </div>
          <div className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 sm:px-8 lg:px-[max(2rem,calc((100vw_-_80rem)_/_2_+_2rem))]">
            {showcaseTemplates.map((id) => {
              const tpl = templates.find((t) => t.id === id)!;
              return (
                <Link key={id} href={`/templates/${id}`} className="group shrink-0 snap-start">
                  <div className="overflow-hidden rounded-[1.6rem] border border-paper/10 transition-transform duration-500 ease-out-soft group-hover:-translate-y-2">
                    <TemplateCover templateId={id} width={236} />
                  </div>
                  <p className="mt-4 font-serif text-2xl">{tpl.name}</p>
                  <p className="label mt-1 text-paper/45">{tpl.meaning}</p>
                </Link>
              );
            })}
          </div>
        </section>

        {/* How it works */}
        <section className="px-5 py-24 sm:px-8 lg:py-36">
          <div className="mx-auto max-w-7xl">
            <SectionHeading label="How it works" title="Ready before the tea goes cold." />
            <ol className="mt-14 grid gap-10 md:grid-cols-3">
              {steps.map((s) => (
                <li key={s.n} className="border-t border-paper/15 pt-6">
                  <p className="label text-flame">{s.n}</p>
                  <h3 className="display mt-4 text-4xl">{s.title}</h3>
                  <p className="mt-4 max-w-sm leading-relaxed text-paper/60">{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Pricing */}
        <section className="border-y border-paper/10 bg-night-2 px-5 py-24 sm:px-8 lg:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <p className="label text-flame">Pricing</p>
              <h2 className="display mt-5 text-[clamp(2.6rem,7vw,4.6rem)]">Design free. Pay once to publish.</h2>
              <p className="mt-5 text-paper/60">One payment per event. No subscription, no charge per guest.</p>
            </div>
            <PlanCards show={["essential", "signature", "duo"]} compact />
            <p className="mt-8 text-center text-sm text-paper/50">
              Want it designed for you?{" "}
              <Link href="/pricing" className="text-flame underline-offset-4 hover:underline">See Atelier and all plans</Link>
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="px-5 py-24 sm:px-8 lg:py-36">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <SectionHeading label="Questions" title="Good to know." />
            <Faq />
          </div>
        </section>

        {/* Closing */}
        <section className="grain relative overflow-hidden px-5 py-28 text-center sm:px-8 lg:py-44">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-full h-[120vmin] w-[120vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(255,214,150,0.4), rgba(232,181,101,0.14) 35%, transparent 65%)" }}
          />
          <div className="relative mx-auto max-w-4xl">
            <p className="label text-flame">Your turn</p>
            <h2 className="display mt-6 text-[clamp(3rem,10vw,7.5rem)]">Light the first lamp.</h2>
            <p className="mx-auto mt-6 max-w-lg text-[1.05rem] text-paper/65">
              Pick a design and see your names on it in under a minute. No account, no password, no app.
            </p>
            <ButtonLink href="/templates" size="lg" className="mt-10">
              Start designing free <ArrowRight size={17} />
            </ButtonLink>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
