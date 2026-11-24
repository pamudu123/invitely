import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { templates } from "@/lib/invitation/templates";
import { gFeatures, globalCovers, pal } from "../_parts/global";
import { Petals } from "../_parts/Petals";
import { Reveal } from "../_parts/Reveal";
import { Nav, Plans } from "../_parts/Site";
import { Strip } from "../_parts/Strip";
import { Lemon, Postcards, ShutterHero, TileWall } from "./scenes";
import "./riviera.css";

export const metadata: Metadata = { title: "Sample E, Riviera" };

const pals = [
  pal("#1456D8", "#2468EC", "#FFFFFF", "#FFD51F", "#0B3C9C"),
  pal("#FFD84A", "#FFE680", "#14328A", "#C22F2F", "#1456D8"),
  pal("#FF6F59", "#FF8A77", "#4A0E12", "#8A1020", "#C2352B"),
  pal("#FFFFFF", "#F2FAFF", "#14328A", "#E0218A", "#1456D8"),
  pal("#1E8E4E", "#28A35C", "#FFFFFF", "#FFD51F", "#0F5A30"),
  pal("#E0218A", "#EE47A1", "#FFFFFF", "#FFE680", "#9A0F5C"),
];

export default function RivieraSample() {
  const covers = globalCovers(190, pals, ["promise", "atelier", "cathedral", "verala", "piyum", "mathaka"]);
  return (
    <div className="rv">
      <Petals colors={["#E0218A", "#FF4FA0", "#FF7AB8", "#FFD51F"]} drift={8} />
      <Nav k="rv" />
      <main>
        <ShutterHero />
        <section className="rv-strip"><Strip mark={<Lemon s={0.72} r={-16} />} /></section>

        <section id="openings" className="rv-openings">
          <div className="rv-wrap">
            <Reveal><h2>Every invitation begins with a gesture</h2></Reveal>
            <TileWall />
          </div>
        </section>

        <section className="rv-lives">
          <div className="rv-wrap rv-lives-grid">
            <Reveal>
              <h2>One link, three lives</h2>
              <p>Tap a postcard to bring it to the front.</p>
            </Reveal>
            <Postcards />
          </div>
        </section>

        <section className="rv-features">
          <div className="rv-awning" />
          <div className="rv-wrap">
            <Reveal><h2>Everything on the table</h2></Reveal>
            <div className="rv-feature-grid">
              {gFeatures.map((f) => (
                <article key={f.title}>
                  <f.icon size={34} strokeWidth={1.7} />
                  <div>
                    <h3>{f.title}</h3>
                    <p>{f.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="rv-gallery">
          <div className="rv-wrap rv-gallery-head">
            <h2>Hung out in the sun</h2>
            <Link href="/templates" className="rv-link">See all {templates.length} designs <ArrowRight size={16} /></Link>
          </div>
          <div className="rv-line" tabIndex={0} role="group" aria-label="Invitation designs">
            {covers.map((c) => (
              <Link key={c.id} href={`/templates/${c.id}`} className="rv-peg">
                <span>{c.cover}</span>
                <b>{c.name}</b>
              </Link>
            ))}
          </div>
        </section>

        <section id="pricing" className="rv-pricing">
          <div className="rv-wrap">
            <Reveal className="rv-center">
              <h2>Design free. Pay once.</h2>
              <p>One payment for each event. No subscription, no charge per guest.</p>
            </Reveal>
            <Plans k="rv" />
          </div>
        </section>

        <section className="rv-close">
          <div className="rv-close-sun" />
          <div className="rv-wrap rv-center">
            <h2>Let the sun in</h2>
            <p>Pick a design and see your names on it in under a minute. No account, no password, no app.</p>
            <Link href="/templates" className="rv-btn">Start designing free <ArrowRight size={18} /></Link>
          </div>
          <svg viewBox="0 0 1600 300" preserveAspectRatio="xMidYMax slice" className="rv-close-sea" aria-hidden="true">
            <path d="M0 110h1600v190H0z" fill="#1456D8" />
            <path d="M0 110C100 20 220 50 300 90C360 40 460 60 520 110Z" fill="#8A2A78" />
            <path d="M1100 110C1180 40 1280 60 1340 90C1420 20 1520 50 1600 80V110Z" fill="#8A2A78" />
            {[220, 620, 1010, 1380].map((x, i) => (
              <g key={x} className="rv-boat" transform={`translate(${x} ${150 + (i % 2) * 46}) scale(${0.8 + (i % 3) * 0.2})`}>
                <path d="M-44 0h88c-6 20-20 28-44 28s-38-8-44-28z" fill={["#E5383B", "#FFD51F", "#FFFFFF", "#E0218A"][i]} />
                <path d="M2 -4V-96c32 26 42 56 42 92zM-4 -80c-22 22-32 48-34 76h34z" fill={["#FFFFFF", "#FFFFFF", "#FF6F59", "#FFD51F"][i]} />
              </g>
            ))}
            <g stroke="#FFC9A0" strokeWidth="4" strokeLinecap="round" opacity="0.8"><path d="M700 140h200M640 176h320M720 214h170M580 250h420" /></g>
          </svg>
        </section>
      </main>
    </div>
  );
}
