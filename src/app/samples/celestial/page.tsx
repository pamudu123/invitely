import type { Metadata } from "next";
import { CoolBottom } from "../_parts/CoolBottom";
import { globalCovers, pal } from "../_parts/global";
import { Petals } from "../_parts/Petals";
import { Reveal } from "../_parts/Reveal";
import { Nav } from "../_parts/Site";
import { Strip } from "../_parts/Strip";
import { Moon, Orbit, Phases, SkyHero, Stars } from "./scenes";
import "./celestial.css";

export const metadata: Metadata = { title: "Sample J, Celestial" };

const pals = [
  pal("#2B2FC4", "#3A3FDA", "#FFFFFF", "#BFF3FF", "#171A80"),
  pal("#E6EAFF", "#F6F8FF", "#1C1F8A", "#4A3FD6", "#2B2FC4"),
  pal("#6A4FF0", "#7B62FA", "#FFFFFF", "#D9F7FF", "#3A25A8"),
  pal("#1F6FE0", "#2E80F2", "#FFFFFF", "#FFF3C9", "#0F4299"),
  pal("#C9BFFF", "#DCD5FF", "#241A80", "#2B2FC4", "#4A3FD6"),
  pal("#141A78", "#1E2594", "#EEF2FF", "#9FB0FF", "#0B0F52"),
  pal("#8FE3F2", "#B4EEF8", "#122A7A", "#3B2FC0", "#1F6FE0"),
];

export default function CelestialSample() {
  return (
    <div className="cl ce">
      <Petals colors={["#FFFFFF", "#BFF3FF", "#D6CCFF"]} drift={0} shape="confetti" />
      <Nav k="cl" />
      <main>
        <SkyHero />
        <section className="cl-strip">
          <Strip mark={<><path d="M0 -28Q0 0 28 0Q0 0 0 28Q0 0 -28 0Q0 0 0 -28Z" fill="#4A3FD6" /><circle r="5" fill="#fff" /></>} />
        </section>
        <section id="openings" className="ce-openings">
          <div className="cl-wrap">
            <Reveal className="cl-center"><h2>Every invitation begins with a gesture</h2></Reveal>
            <Orbit />
          </div>
        </section>
        <section className="ce-lives">
          <Stars className="ce-stars" n={60} />
          <div className="cl-wrap">
            <Reveal className="cl-center"><h2>One link, three phases</h2></Reveal>
            <Phases />
          </div>
        </section>
        <CoolBottom
          featuresTitle="Written in the stars"
          galleryTitle="A galaxy of designs"
          closeTitle="Name your star"
          covers={globalCovers(230, pals, ["promise", "atelier", "tharu", "cathedral", "golden-year", "verala", "laurel"])}
          art={
            <>
              <Stars className="ce-stars" n={110} />
              <div className="ce-close-moon"><Moon /></div>
            </>
          }
        />
      </main>
    </div>
  );
}
