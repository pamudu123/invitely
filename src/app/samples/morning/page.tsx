import type { Metadata } from "next";
import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import type { CSSProperties } from "react";
import { templates } from "@/lib/invitation/templates";
import { features, plans } from "../_parts/content";
import { Garland } from "../_parts/Garland";
import { Petals } from "../_parts/Petals";
import { Reveal } from "../_parts/Reveal";
import { royalCovers } from "../_parts/royal";
import { EveningPond, PetalWheel, PondHero, ThreeSkies } from "./scenes";
import "./morning.css";

export const metadata: Metadata = { title: "Sample C, Golden morning" };

const fan = ["nelum", "maruthani", "bulath", "mahanuwara", "suriya", "monara", "ran"];

export default function MorningSample() {
  const covers = royalCovers(220);
  const hand = fan.map((id) => covers.find((c) => c.id === id)!);
  return (
    <div className="pc">
      <Petals colors={["#F08BB2", "#FFC6DA", "#FFB53A", "#E0447F"]} drift={14} />
      <header className="pc-nav">
        <Link href="/" className="pc-logo">Invitely</Link>
        <nav aria-label="Main">
          <Link href="/templates">Designs</Link>
          <a href="#openings">Openings</a>
          <a href="#pricing">Pricing</a>
        </nav>
        <Link href="/templates" className="pc-nav-cta">Create invitation</Link>
      </header>
      <main>
        <PondHero />

        <section className="pc-garland"><Garland /></section>

        <section id="openings" className="pc-openings">
          <div className="pc-wrap pc-openings-grid">
            <Reveal>
              <p className="pc-script">touch a petal</p>
              <h2>Every invitation begins with a gesture</h2>
            </Reveal>
            <PetalWheel />
          </div>
        </section>

        <section className="pc-lives">
          <div className="pc-wrap">
            <Reveal className="pc-center">
              <p className="pc-script">from dawn to starlight</p>
              <h2>One link, three lives</h2>
            </Reveal>
            <ThreeSkies />
          </div>
        </section>

        <section className="pc-features">
          <div className="pc-wrap">
            <Reveal className="pc-center">
              <p className="pc-script">with love</p>
              <h2>Made for how we celebrate</h2>
            </Reveal>
            <div className="pc-feature-grid">
              {features.map((f, i) => (
                <Reveal key={f.title} delay={(i % 3) * 90} className={`pc-tile pc-tile-${i}`}>
                  <f.icon size={40} strokeWidth={1.5} />
                  <h3>{f.title}</h3>
                  <p>{f.text}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="pc-gallery">
          <div className="pc-wrap pc-center">
            <h2>Pick a card, any colour</h2>
          </div>
          <div className="pc-hand">
            {hand.map((t, i) => (
              <Link key={t.id} href={`/templates/${t.id}`} style={{ "--k": i - 3 } as CSSProperties} aria-label={`${t.name}, ${t.meaning}`}>
                {t.cover}
              </Link>
            ))}
          </div>
          <div className="pc-center">
            <Link href="/templates" className="pc-btn">See all {templates.length} designs <ArrowRight size={18} /></Link>
          </div>
        </section>

        <section id="pricing" className="pc-pricing">
          <div className="pc-wrap">
            <Reveal className="pc-center">
              <h2>Design free. Pay once.</h2>
              <p>One payment for each event. No subscription, no charge per guest.</p>
            </Reveal>
            <div className="pc-plans">
              {plans.map((p, i) => (
                <Reveal key={p.id} delay={i * 100} className={`pc-plan pc-plan-${p.id}`}>
                  <h3>{p.name}</h3>
                  <p className="pc-price">{p.usd}</p>
                  <p>{p.tagline}</p>
                  <ul>{p.features.map((f) => <li key={f}><Check size={17} />{f}</li>)}</ul>
                  <Link href="/templates">Choose {p.name}</Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="pc-close">
          <div className="pc-wrap pc-center">
            <p className="pc-script">your turn</p>
            <h2>Let the day begin</h2>
            <p>Pick a design and see your names on it in under a minute. No account, no password, no app.</p>
            <Link href="/templates" className="pc-btn">Start designing free <ArrowRight size={18} /></Link>
          </div>
          <EveningPond />
        </section>
      </main>
    </div>
  );
}
