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
import { BalloonDay, ColourOpenings, GateHero, SkyLanterns } from "./scenes";
import "./procession-global.css";

export const metadata: Metadata = { title: "Sample A2, Global procession" };

const pals = [
  pal("#C2275F", "#D63A73", "#FFF6E6", "#FFCF70", "#7A1250"),
  pal("#FFB7C9", "#FFD0DC", "#4A0A36", "#A01A50", "#C2275F"),
  pal("#3B1160", "#4C1A7A", "#FFF6E6", "#FFCF70", "#22083D"),
  pal("#0B6B5C", "#0F8270", "#FFF6E6", "#FFCF70", "#06463C"),
  pal("#FFCF70", "#FFDF9A", "#3A0A2E", "#A01A50", "#C2275F"),
  pal("#1F4FB8", "#2C60D2", "#FFFFFF", "#FFCF70", "#123580"),
  pal("#FF8A5C", "#FFA47F", "#3A0A1E", "#7A1250", "#C2275F"),
  pal("#FFF6E6", "#FFFFFF", "#3B1160", "#C2275F", "#3B1160"),
  pal("#8A3FD1", "#9C55E0", "#FFF6E6", "#FFE0A0", "#5A1E9E"),
];

export default function GlobalProcessionSample() {
  return (
    <div className="pg">
      <Petals colors={["#F2658F", "#FFB7C9", "#FF8A6B", "#FFE3D6", "#FFCF70"]} />
      <Nav k="pg" />
      <main>
        <GateHero />

        <section className="pg-garland">
          <Strip
            mark={
              <>
                <path d="M-22 8C-34 2 -34 20 -16 16ZM22 8C34 2 34 20 16 16Z" fill="#0B6B5C" />
                <circle r="19" fill="#A01A50" />
                <path d="M-19 0A19 19 0 0 1 13 -14C3 -10 -8 -2 -10 12A19 19 0 0 1 -19 0Z" fill="#E8447A" />
                <path d="M19 1A19 19 0 0 1 -8 18C3 15 12 5 12 -9A19 19 0 0 1 19 1Z" fill="#E8447A" />
                <circle r="9" fill="#F2658F" />
              </>
            }
          />
        </section>

        <ColourOpenings />
        <BalloonDay />

        <section className="pg-features">
          <div className="pg-wrap">
            <Reveal><h2>Made for the way you celebrate</h2></Reveal>
            <div className="pg-feature-grid">
              {gFeatures.map((f, i) => (
                <Reveal key={f.title} delay={(i % 3) * 90}>
                  <article>
                    <span className="pg-arch"><f.icon size={34} strokeWidth={1.6} /></span>
                    <h3>{f.title}</h3>
                    <p>{f.text}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="pg-gallery">
          <div className="pg-wrap pg-gallery-head">
            <h2>Walk the grand gallery</h2>
            <Link href="/templates" className="pg-link">See all {templates.length} designs <ArrowRight size={16} /></Link>
          </div>
          <Rail className="pg-rail" label="Invitation designs">
            {globalCovers(230, pals).map((t) => (
              <Link key={t.id} href={`/templates/${t.id}`} className="pg-frame">
                <span className="pg-frame-art">{t.cover}</span>
                <b>{t.name}</b>
              </Link>
            ))}
          </Rail>
        </section>

        <section id="pricing" className="pg-pricing">
          <div className="pg-wrap">
            <Reveal className="pg-center">
              <h2>Design free. Pay once.</h2>
              <p>One payment for each event. No subscription, no charge per guest.</p>
            </Reveal>
            <Plans k="pg" />
          </div>
        </section>

        <section className="pg-close">
          <div className="pg-stars" />
          <SkyLanterns />
          <div className="pg-wrap pg-center">
            <h2>Light the first lantern</h2>
            <p>Pick a design and see your names on it in under a minute. No account, no password, no app.</p>
            <Link href="/templates" className="pg-btn">Start designing free <ArrowRight size={18} /></Link>
          </div>
        </section>
      </main>
    </div>
  );
}
