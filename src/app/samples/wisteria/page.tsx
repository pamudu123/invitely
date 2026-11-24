import type { Metadata } from "next";
import { CoolBottom } from "../_parts/CoolBottom";
import { globalCovers, pal } from "../_parts/global";
import { Petals } from "../_parts/Petals";
import { Reveal } from "../_parts/Reveal";
import { Nav } from "../_parts/Site";
import { Strip } from "../_parts/Strip";
import { ClosingVeil, Glasshouse, Pavilion, Seasons, VeilHero } from "./scenes";
import "./wisteria.css";

export const metadata: Metadata = { title: "Sample K, Wisteria" };

const pals = [
  pal("#6A4FE0", "#7B62F0", "#FFFFFF", "#D9F7EC", "#3A25A0"),
  pal("#E9E2FF", "#F6F2FF", "#2A1470", "#6A4FE0", "#1E8A72"),
  pal("#1E8A72", "#269C83", "#FFFFFF", "#E3D6FF", "#0E5A4A"),
  pal("#8FE0D0", "#B0EDE0", "#0A3F3A", "#5B3FD0", "#1E8A72"),
  pal("#C4A6FF", "#D8C3FF", "#2A1470", "#1E6A8A", "#6A4FE0"),
  pal("#3F5FE0", "#5273F0", "#FFFFFF", "#D9F7EC", "#22379E"),
  pal("#BFE4FF", "#DBF1FF", "#0A2F6E", "#6A4FE0", "#2F7BE8"),
];

export default function WisteriaSample() {
  return (
    <div className="cl wi">
      <Petals colors={["#B79BFF", "#D9E0FF", "#CBA8FF", "#97A6FF"]} drift={14} />
      <Nav k="cl" />
      <main>
        <VeilHero />
        <section className="cl-strip">
          <Strip mark={<>{[[0, -18], [-12, -8], [12, -8], [-7, 5], [7, 5], [0, 17]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={10 - i * 0.9} fill={["#8FE0D0", "#CBA8FF", "#97A6FF"][i % 3]} />)}</>} />
        </section>
        <section id="openings" className="wi-openings">
          <div className="cl-wrap">
            <Reveal><h2>Every invitation begins with a gesture</h2></Reveal>
            <Glasshouse />
          </div>
        </section>
        <section className="wi-lives">
          <div className="cl-wrap">
            <Reveal className="cl-center"><h2>Bud, bloom, keepsake</h2></Reveal>
            <Seasons />
          </div>
        </section>
        <CoolBottom
          featuresTitle="Tended with care"
          galleryTitle="Cut from the garden"
          closeTitle="Step into the garden"
          covers={globalCovers(230, pals, ["promise", "atelier", "tharu", "cathedral", "verala", "piyum", "mathaka"])}
          art={
            <>
              <ClosingVeil />
              <svg viewBox="0 0 1600 300" preserveAspectRatio="xMidYMax slice" className="wi-close-land" aria-hidden="true">
                <path d="M0 60C260 0 520 80 800 50C1080 20 1340 80 1600 40V300H0Z" fill="#7FD3C4" />
                <path d="M0 130C300 100 560 150 800 134C1080 116 1340 150 1600 120V300H0Z" fill="#4FB8E0" />
              </svg>
              <Pavilion className="wi-close-pav" />
            </>
          }
        />
      </main>
    </div>
  );
}
