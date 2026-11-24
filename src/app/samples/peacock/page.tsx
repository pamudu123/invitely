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
import { ClosingFan, Dial, PeacockHero, Windows } from "./scenes";
import "./peacock.css";

export const metadata: Metadata = { title: "Sample B, Peacock throne" };

export default function PeacockSample() {
  return (
    <div className="pb">
      <Petals colors={["#E0447F", "#F2C85B", "#35C9C0", "#C2185B"]} drift={6} />
      <header className="pb-nav">
        <Link href="/" className="pb-logo">Invitely</Link>
        <nav aria-label="Main">
          <Link href="/templates">Designs</Link>
          <a href="#openings">Openings</a>
          <a href="#pricing">Pricing</a>
        </nav>
        <Link href="/templates" className="pb-nav-cta">Create invitation</Link>
      </header>
      <main>
        <PeacockHero />

        <section className="pb-garland"><Garland /></section>

        <section id="openings" className="pb-openings">
          <div className="pb-wrap">
            <Reveal className="pb-head">
              <h2>Every invitation begins with a gesture</h2>
              <p>Eight windows, eight ways to begin. Step up to any of them and try it.</p>
            </Reveal>
            <Windows />
          </div>
        </section>

        <section className="pb-lives">
          <div className="pb-wrap">
            <Reveal><h2>One link, three lives</h2></Reveal>
            <Dial />
          </div>
        </section>

        <section className="pb-features">
          <div className="pb-wrap pb-feature-grid">
            <h2>Made for how we celebrate</h2>
            <ul>
              {features.map((f) => (
                <li key={f.title}>
                  <span className="pb-eye"><i><f.icon size={24} strokeWidth={1.7} /></i></span>
                  <div>
                    <h3>{f.title}</h3>
                    <p>{f.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="pb-gallery">
          <div className="pb-wrap pb-gallery-head">
            <h2>The royal collection</h2>
            <Link href="/templates" className="pb-link">See all {templates.length} designs <ArrowRight size={16} /></Link>
          </div>
          <Rail className="pb-rail" label="Invitation designs">
            {royalCovers(236).map((t) => (
              <Link key={t.id} href={`/templates/${t.id}`} className="pb-card">
                <span className="pb-card-art">{t.cover}</span>
                <b>{t.name}</b>
                <small>{t.meaning}</small>
              </Link>
            ))}
          </Rail>
        </section>

        <section id="pricing" className="pb-pricing">
          <div className="pb-wrap">
            <Reveal className="pb-head pb-head-c">
              <h2>Design free. Pay once.</h2>
              <p>One payment for each event. No subscription, no charge per guest.</p>
            </Reveal>
            <div className="pb-plans">
              {plans.map((p) => (
                <article key={p.id} className={`pb-plan pb-plan-${p.id}`}>
                  <div>
                    <h3>{p.name}</h3>
                    <p className="pb-price">{p.usd}</p>
                    <p>{p.tagline}</p>
                    <ul>{p.features.map((f) => <li key={f}><Check size={17} />{f}</li>)}</ul>
                    <Link href="/templates">Choose {p.name}</Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="pb-close">
          <div className="pb-wrap">
            <h2>Open your own ceremony</h2>
            <p>Pick a design and see your names on it in under a minute. No account, no password, no app.</p>
            <Link href="/templates" className="pb-btn">Start designing free <ArrowRight size={18} /></Link>
          </div>
          <ClosingFan />
        </section>
      </main>
    </div>
  );
}
