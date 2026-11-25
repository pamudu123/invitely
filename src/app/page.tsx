import { ArrowRight, CalendarHeart, Infinity as InfinityIcon, Link2, MailCheck, Music, QrCode } from "lucide-react";
import Link from "next/link";
import { PrintPreview } from "@/components/cards/PrintPreview";
import { Faq } from "@/components/site/Faq";
import { PlanCards } from "@/components/site/PlanCards";
import { SiteFooter, SiteHeader } from "@/components/site/chrome";
import { LikeButton } from "@/components/site/LikeButton";
import { TemplateCover } from "@/components/site/TemplateCover";
import { FrostHero } from "@/components/site/frost/Hero";
import { FrostOpenings } from "@/components/site/frost/Openings";
import { Aurora, OccasionStrip, PalaceView, Snowfall, ThreeGlobes } from "@/components/site/frost/Scenery";
import { ritualInfo } from "@/lib/invitation/rituals";
import { showcase, showcaseData, showcaseName } from "@/lib/invitation/showcase";
import { templates } from "@/lib/invitation/templates";
import { palettes } from "@/lib/invitation/theme";
import "@/components/site/frost/frost.css";

const features = [
  { icon: Link2, title: "A link for every guest", text: "Each family opens an invitation that greets them by name and shows the seats you saved for them." },
  { icon: MailCheck, title: "Replies in one place", text: "See who is coming, how many seats and which meals as replies arrive. Export to a spreadsheet." },
  { icon: CalendarHeart, title: "A live countdown", text: "The days tick down, then the page turns into a guide for the day itself." },
  { icon: Music, title: "Soundscapes built in", text: "Soft bells, slow strings or bright kalimba, played live in the browser. Nothing to upload." },
  { icon: QrCode, title: "Check in at the door", text: "Hand an usher a phone. Search a name, tap once and watch the room fill." },
  { icon: InfinityIcon, title: "A keepsake that stays", text: "Afterwards it becomes a thank you page with photos and wishes. Signature links never expire." },
];

const steps = [
  { title: "Choose a design", text: "Start from a design made for your occasion. Every colour, letter and ornament can change." },
  { title: "Make it yours", text: "Add your names, times, venue and photos. Watch it update on a phone as you type." },
  { title: "Share and relax", text: "Publish, send personal links on WhatsApp and follow the replies as they come in." },
];

const printed = [
  { design: "archway", template: "atelier", palette: "frost-royal", width: 190 },
  { design: "sanda", template: "tharu", palette: "amethyst-ice", width: 200 },
  { design: "deco", template: "promise", palette: "lagoon-ice", width: 190 },
];

const openingCount = Object.keys(ritualInfo).length - 1;

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="overflow-x-clip">
        <FrostHero designs={templates.length} openings={openingCount} />
        <OccasionStrip />

        <section id="openings" className="frost-section scroll-mt-16 bg-[#e6f3ff]">
          <div className="frost-in">
            <h2 className="frost-h2 text-brand">Every invitation begins with a gesture</h2>
            <p className="frost-lede">Choose a pane to clear the frost, then try that opening on the phone.</p>
            <FrostOpenings />
          </div>
        </section>

        <section className="frost-section" style={{ background: "linear-gradient(180deg, #d8d0ff, #cdeaff)" }}>
          <div className="frost-in">
            <div className="frost-center">
              <h2 className="frost-h2">One link, three lives</h2>
              <p className="frost-lede">A printed card says one thing forever. Your link knows what day it is.</p>
            </div>
            <ThreeGlobes />
          </div>
        </section>

        <section id="features" className="frost-section scroll-mt-16 bg-page-3">
          <div className="frost-in">
            <h2 className="frost-h2">Crisp in every detail</h2>
            <div className="frost-tiles">
              {features.map((f) => (
                <article key={f.title} className="frost-tile">
                  <span><f.icon size={32} strokeWidth={1.8} /></span>
                  <h3>{f.title}</h3>
                  <p>{f.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="frost-section" style={{ background: "linear-gradient(180deg, #e3f1ff, #c4f3ea)" }}>
          <div className="frost-in grid grid-cols-1 items-center gap-12 lg:grid-cols-[1fr_auto] [&>*]:min-w-0">
            <div>
              <h2 className="frost-h2">One design. Web, image and paper.</h2>
              <p className="frost-lede">
                Every web card also comes as an image to send on WhatsApp or post as a status. And for the guests who
                should receive something in the hand, add a printed card in a shape that is anything but a rectangle. Its
                back carries a QR code that opens your invitation.
              </p>
              <Link href="/print-cards" className="frost-link mt-6">See the printed cards <ArrowRight size={17} /></Link>
            </div>
            <div className="no-scrollbar -mx-5 flex items-end gap-5 overflow-x-auto px-5 pb-16 pt-2 lg:mx-0 lg:overflow-visible lg:px-0 lg:pb-0">
              {printed.map((x) => (
                <PrintPreview key={x.design} design={x.design} data={showcaseData(x.template, x.palette)} width={x.width} />
              ))}
            </div>
          </div>
        </section>

        <section className="frost-gallery">
          <div className="frost-in frost-gallery-head">
            <h2 className="frost-h2">The ice collection</h2>
            <Link href="/templates" className="frost-link">See all {templates.length} designs <ArrowRight size={17} /></Link>
          </div>
          <div className="frost-rail" role="group" aria-label="Designs" tabIndex={0}>
            {showcase.map((s) => {
              const data = showcaseData(s.id, s.palette, s.a, s.b, s.venue, s.place);
              const colour = palettes.find((p) => p.id === s.palette)?.label ?? "";
              return (
                <div key={s.id} className="frost-card">
                  <Link href={`/studio/new?template=${s.id}&palette=${s.palette}`} aria-label={`Start with ${showcaseName(s.id)} in ${colour}`}>
                    <span><TemplateCover data={data} width={230} /></span>
                    <b>{showcaseName(s.id)}</b>
                    <small>{colour}</small>
                  </Link>
                  <LikeButton id={s.id} name={showcaseName(s.id)} className="absolute right-5 top-5" />
                </div>
              );
            })}
          </div>
        </section>

        <section className="frost-section bg-page">
          <div className="frost-in">
            <h2 className="frost-h2">Ready before the tea goes cold</h2>
            <ol className="frost-steps">
              {steps.map((s, i) => (
                <li key={s.title}>
                  <b>{i + 1}</b>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="frost-section bg-page-2">
          <div className="frost-in">
            <div className="frost-center mb-12">
              <h2 className="frost-h2">Design free. Pay once to publish.</h2>
              <p className="frost-lede">One payment per event. No subscription, no charge per guest.</p>
            </div>
            <PlanCards show={["essential", "signature", "duo"]} compact />
            <p className="mt-8 text-center text-[1.06rem] font-medium">
              Want it designed for you?{" "}
              <Link href="/pricing" className="font-bold text-brand underline underline-offset-4">See Atelier and all plans</Link>
            </p>
          </div>
        </section>

        <section className="frost-section bg-page-3">
          <div className="frost-in grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
            <h2 className="frost-h2">Good to know</h2>
            <Faq />
          </div>
        </section>

        <section className="frost-close">
          <Aurora />
          <Snowfall />
          <PalaceView />
          <div className="frost-in">
            <h2 className="frost-h2">Let it snow</h2>
            <p className="frost-lede mx-auto">Pick a design and see your names on it in under a minute. No account, no password, no app.</p>
            <Link href="/templates" className="frost-btn">Start designing free <ArrowRight size={18} /></Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
