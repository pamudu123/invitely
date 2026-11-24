import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { templates } from "@/lib/invitation/templates";
import { gFeatures, globalCovers, pal } from "../_parts/global";
import { Petals } from "../_parts/Petals";
import { Rail } from "../_parts/Rail";
import { Reveal } from "../_parts/Reveal";
import { Nav, Plans } from "../_parts/Site";
import { Strip } from "../_parts/Strip";
import { BloomHero, Garden, Season, Stripes } from "./scenes";
import "./bloom.css";

export const metadata: Metadata = { title: "Sample F, Bloom" };

const pals = [
  pal("#FF6A3D", "#FF8459", "#3A0A05", "#7A0B22", "#A8005E"),
  pal("#FFB8DB", "#FFD3E8", "#4A0030", "#A8005E", "#A8005E"),
  pal("#5B21B6", "#6C31CB", "#FFF3FF", "#FFC653", "#3B1280"),
  pal("#FFC653", "#FFD67E", "#4A2A00", "#A3221B", "#C8102E"),
  pal("#0E4B3A", "#125C48", "#FFF5DA", "#FF8CC4", "#062B20"),
  pal("#2C66F5", "#4478FA", "#FFFFFF", "#FFE0A8", "#0B2FA8"),
  pal("#C8102E", "#DB2541", "#FFF0E6", "#FFC653", "#7A0B22"),
];

export default function BloomSample() {
  const covers = globalCovers(232, pals, ["promise", "atelier", "tharu", "cathedral", "verala", "piyum", "mathaka"]);
  return (
    <div className="bl">
      <Petals colors={["#FF6A3D", "#EE2F93", "#C49DFF", "#FFC653", "#80AAFF"]} drift={9} />
      <Nav k="bl" />
      <main>
        <BloomHero />
        <section className="bl-strip">
          <Strip
            mark={
              <>
                {Array.from({ length: 8 }, (_, k) => <ellipse key={k} cy="-16" rx="7" ry="12" transform={`rotate(${k * 45})`} fill={k % 2 ? "#FF8CC4" : "#FF6A3D"} />)}
                <circle r="7" fill="#FFC653" />
              </>
            }
          />
        </section>

        <section id="openings" className="bl-openings">
          <div className="bl-wrap"><Reveal><h2>Every invitation begins with a gesture</h2></Reveal></div>
          <Stripes />
        </section>

        <section className="bl-lives">
          <div className="bl-wrap">
            <Reveal><h2>Bud, bloom, keepsake</h2></Reveal>
            <Season />
          </div>
        </section>

        <section className="bl-features">
          <div className="bl-wrap">
            <Reveal><h2>All the little things</h2></Reveal>
            <div className="bl-bento">
              {gFeatures.map((f) => (
                <article key={f.title}>
                  <f.icon size={44} strokeWidth={1.5} />
                  <div>
                    <h3>{f.title}</h3>
                    <p>{f.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bl-gallery">
          <div className="bl-wrap bl-gallery-head">
            <h2>Pick your bouquet</h2>
            <Link href="/templates" className="bl-link">See all {templates.length} designs <ArrowRight size={16} /></Link>
          </div>
          <Rail className="bl-rail" label="Invitation designs">
            {covers.map((c) => (
              <Link key={c.id} href={`/templates/${c.id}`} className="bl-card">
                <span>{c.cover}</span>
                <b>{c.name}</b>
              </Link>
            ))}
          </Rail>
        </section>

        <section id="pricing" className="bl-pricing">
          <div className="bl-wrap">
            <Reveal className="bl-center">
              <h2>Design free. Pay once.</h2>
              <p>One payment for each event. No subscription, no charge per guest.</p>
            </Reveal>
            <Plans k="bl" />
          </div>
        </section>

        <section className="bl-close">
          <div className="bl-wrap bl-center">
            <h2>Plant the date</h2>
            <p>Pick a design and see your names on it in under a minute. No account, no password, no app.</p>
            <Link href="/templates" className="bl-btn">Start designing free <ArrowRight size={18} /></Link>
          </div>
          <Garden />
        </section>
      </main>
    </div>
  );
}
