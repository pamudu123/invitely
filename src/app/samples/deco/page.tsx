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
import { Clock, Lift, TowerHero } from "./scenes";
import "./deco.css";

export const metadata: Metadata = { title: "Sample G, Deco" };

const pals = [
  pal("#0A5E50", "#0C6C5B", "#FFF6E0", "#F0D084", "#063D34"),
  pal("#FF9C7E", "#FFB49C", "#4A120C", "#8C1A22", "#B5452F"),
  pal("#4B3FB5", "#5A4EC7", "#FFF6E0", "#FFC94A", "#2E2680"),
  pal("#F0D084", "#F7E3B0", "#3A2408", "#8C1A22", "#0A5E50"),
  pal("#B52D6A", "#C73E7C", "#FFF6E0", "#FFD98A", "#7A1545"),
  pal("#0E8FA3", "#149FB4", "#FFFFFF", "#FFE2A0", "#075563"),
  pal("#D93A3A", "#E54F4F", "#FFF6E0", "#FFD98A", "#8C1A22"),
];

export default function DecoSample() {
  const covers = globalCovers(230, pals, ["promise", "tharu", "golden-year", "cathedral", "laurel", "verala", "piyum"]);
  return (
    <div className="dc">
      <Petals colors={["#FFE2A0", "#FFF6E0", "#FFC94A"]} drift={26} shape="bubble" />
      <Nav k="dc" />
      <main>
        <TowerHero />
        <section className="dc-strip">
          <Strip
            mark={
              <>
                {[-60, -30, 0, 30, 60].map((a, k) => <path key={a} d="M0 22L-7 -22Q0 -30 7 -22Z" transform={`rotate(${a} 0 22)`} fill={k % 2 ? "#F0D084" : "#0A5E50"} />)}
                <circle cy="22" r="5" fill="#8C1A22" />
              </>
            }
          />
        </section>

        <section id="openings" className="dc-openings">
          <div className="dc-wrap"><Lift /></div>
        </section>

        <section className="dc-lives">
          <div className="dc-wrap">
            <Reveal><h2>One link, all night long</h2></Reveal>
            <Clock />
          </div>
        </section>

        <section className="dc-features">
          <div className="dc-wrap">
            <Reveal className="dc-center"><h2>The house specials</h2></Reveal>
            <div className="dc-feature-grid">
              {gFeatures.map((f) => (
                <article key={f.title}>
                  <span><f.icon size={30} strokeWidth={1.6} /></span>
                  <h3>{f.title}</h3>
                  <p>{f.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="dc-gallery">
          <div className="dc-wrap dc-gallery-head">
            <h2>Now showing</h2>
            <Link href="/templates" className="dc-link">See all {templates.length} designs <ArrowRight size={16} /></Link>
          </div>
          <Rail className="dc-rail" label="Invitation designs">
            {covers.map((c) => (
              <Link key={c.id} href={`/templates/${c.id}`} className="dc-card">
                <span>{c.cover}</span>
                <b>{c.name}</b>
              </Link>
            ))}
          </Rail>
        </section>

        <section id="pricing" className="dc-pricing">
          <div className="dc-wrap">
            <Reveal className="dc-center">
              <h2>Design free. Pay once.</h2>
              <p>One payment for each event. No subscription, no charge per guest.</p>
            </Reveal>
            <Plans k="dc" />
          </div>
        </section>

        <section className="dc-close">
          <div className="dc-rays" />
          <div className="dc-wrap dc-center">
            <h2>Raise a glass</h2>
            <p>Pick a design and see your names on it in under a minute. No account, no password, no app.</p>
            <Link href="/templates" className="dc-btn">Start designing free <ArrowRight size={18} /></Link>
          </div>
        </section>
      </main>
    </div>
  );
}
