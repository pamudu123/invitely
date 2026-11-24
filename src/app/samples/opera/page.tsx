import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { templates } from "@/lib/invitation/templates";
import { gFeatures, globalCovers, pal } from "../_parts/global";
import { Petals } from "../_parts/Petals";
import { Reveal } from "../_parts/Reveal";
import { Nav, Plans } from "../_parts/Site";
import { Strip } from "../_parts/Strip";
import { Acts, CastList, Chandelier, CurtainHero } from "./scenes";
import "./opera.css";

export const metadata: Metadata = { title: "Sample D, Grand Opera" };

const pals = [
  pal("#1230A8", "#1B40D0", "#FFF6E0", "#F0D49A", "#0A1C6B"),
  pal("#F7C6D0", "#FFE1E7", "#5A0E2A", "#B01745", "#8E1238"),
  pal("#0B6B5C", "#0F8270", "#FFF6E0", "#F0D49A", "#07473D"),
  pal("#C2183A", "#D92A4C", "#FFF6E0", "#FFDFA0", "#7E0D24"),
  pal("#F0D49A", "#FBE9C4", "#3A2408", "#9A1026", "#0A1C6B"),
  pal("#5B2BB5", "#6E3BCB", "#FFF6E0", "#FFD08A", "#34156F"),
];

export default function OperaSample() {
  const covers = globalCovers(220, pals, ["promise", "atelier", "tharu", "cathedral", "golden-year", "piyum"]);
  return (
    <div className="op">
      <Petals colors={["#E5253A", "#F7C6D0", "#F0D49A", "#FF6B8A"]} drift={7} />
      <Nav k="op" />
      <main>
        <CurtainHero />
        <section className="op-strip">
          <Strip mark={<><path d="M0 -26L7 -8L26 0L7 8L0 26L-7 8L-26 0L-7 -8Z" fill="#B01745" /><circle r="6" fill="#FFFAF0" /></>} />
        </section>
        <CastList />

        <section className="op-lives">
          <div className="op-wrap">
            <Reveal><h2>One link, three acts</h2></Reveal>
            <Acts />
          </div>
        </section>

        <section className="op-features">
          <div className="op-wrap">
            <Reveal className="op-center"><h2>The programme</h2></Reveal>
            <dl>
              {gFeatures.map((f) => (
                <div key={f.title}>
                  <dt><f.icon size={26} strokeWidth={1.5} />{f.title}</dt>
                  <dd>{f.text}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="op-gallery">
          <div className="op-wrap op-gallery-head">
            <h2>The portrait gallery</h2>
            <Link href="/templates" className="op-link">See all {templates.length} designs <ArrowRight size={16} /></Link>
          </div>
          <div className="op-salon">
            {covers.map((c) => (
              <Link key={c.id} href={`/templates/${c.id}`} className="op-frame">
                <span>{c.cover}</span>
                <b>{c.name}</b>
              </Link>
            ))}
          </div>
        </section>

        <section id="pricing" className="op-pricing">
          <div className="op-wrap">
            <Reveal className="op-center">
              <h2>Reserve your seats</h2>
              <p>Design free. One payment for each event, with no subscription and no charge per guest.</p>
            </Reveal>
            <Plans k="op" />
          </div>
        </section>

        <section className="op-close">
          <Chandelier className="op-close-ch" />
          <div className="op-wrap op-center">
            <h2>The stage is yours</h2>
            <p>Pick a design and see your names on it in under a minute. No account, no password, no app.</p>
            <Link href="/templates" className="op-btn op-btn-gold">Start designing free <ArrowRight size={18} /></Link>
          </div>
        </section>
      </main>
    </div>
  );
}
