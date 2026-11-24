import type { Metadata } from "next";
import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { templates } from "@/lib/invitation/templates";
import { features, plans } from "../_parts/content";
import { Garland } from "../_parts/Garland";
import { Petals } from "../_parts/Petals";
import { Rail } from "../_parts/Rail";
import { Reveal } from "../_parts/Reveal";
import { royalCovers } from "../_parts/royal";
import { ColourOpenings, GateHero, LampField, LotusDay } from "./scenes";
import "./procession.css";

export const metadata: Metadata = { title: "Sample A, Procession" };

function Nav() {
  return (
    <header className="pa-nav">
      <Link href="/" className="pa-logo">Invitely</Link>
      <nav aria-label="Main">
        <Link href="/templates">Designs</Link>
        <a href="#openings">Openings</a>
        <a href="#pricing">Pricing</a>
      </nav>
      <Link href="/templates" className="pa-nav-cta">Create invitation</Link>
    </header>
  );
}

export default function ProcessionSample() {
  return (
    <div className="pa">
      <Petals colors={["#FFA51F", "#E5302A", "#F26CA0", "#FFD25E", "#F7A8C4"]} />
      <Nav />
      <main>
        <GateHero />

        <section className="pa-garland"><Garland /></section>

        <ColourOpenings />
        <LotusDay />

        <section className="pa-features">
          <div className="pa-wrap">
            <Reveal><h2>Made for how we celebrate</h2></Reveal>
            <div className="pa-feature-grid">
              {features.map((f, i) => (
                <Reveal key={f.title} delay={(i % 3) * 90}>
                  <article>
                    <span className="pa-arch"><f.icon size={34} strokeWidth={1.6} /></span>
                    <h3>{f.title}</h3>
                    <p>{f.text}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="pa-gallery">
          <div className="pa-wrap pa-gallery-head">
            <h2>Walk the palace of designs</h2>
            <Link href="/templates" className="pa-link">See all {templates.length} designs <ArrowRight size={16} /></Link>
          </div>
          <Rail className="pa-rail" label="Invitation designs">
            {royalCovers(230).map((t) => (
              <Link key={t.id} href={`/templates/${t.id}`} className="pa-frame">
                <span className="pa-frame-art">{t.cover}</span>
                <b>{t.name}</b>
                <small>{t.meaning}</small>
              </Link>
            ))}
          </Rail>
        </section>

        <section id="pricing" className="pa-pricing">
          <div className="pa-wrap">
            <Reveal className="pa-center">
              <h2>Design free. Pay once.</h2>
              <p>One payment for each event. No subscription, no charge per guest.</p>
            </Reveal>
            <div className="pa-plans">
              {plans.map((p, i) => (
                <Reveal key={p.id} delay={i * 100} className={`pa-plan pa-plan-${p.id}`}>
                  <h3>{p.name}</h3>
                  <p className="pa-price">{p.usd}</p>
                  <p className="pa-tag">{p.tagline}</p>
                  <ul>{p.features.map((f) => <li key={f}><Check size={17} />{f}</li>)}</ul>
                  <Link href="/templates">Choose {p.name}</Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="pa-close">
          <div className="pa-stars pa-stars-on" />
          <div className="pa-wrap pa-center">
            <h2>Light the first lamp</h2>
            <p>Pick a design and see your names on it in under a minute. No account, no password, no app.</p>
            <Link href="/templates" className="pa-btn">Start designing free <ArrowRight size={18} /></Link>
          </div>
          <LampField />
        </section>
      </main>
    </div>
  );
}
