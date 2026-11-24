import type { Metadata } from "next";
import { CoolBottom } from "../_parts/CoolBottom";
import { globalCovers, pal } from "../_parts/global";
import { Petals } from "../_parts/Petals";
import { Nav } from "../_parts/Site";
import { Strip } from "../_parts/Strip";
import { Bubbles, Depths, Reef, Shell, ShellHero } from "./scenes";
import "./pearl.css";

export const metadata: Metadata = { title: "Sample I, Pearl" };

const pals = [
  pal("#0B6FB0", "#1583C9", "#FFFFFF", "#A8FFE9", "#063F6E"),
  pal("#D8F7F2", "#EEFFFC", "#06405E", "#4A3FC4", "#0E9AA8"),
  pal("#5B4FE0", "#6C60F0", "#FFFFFF", "#A8FFE9", "#2E2699"),
  pal("#0A7A80", "#0E8F96", "#FFFFFF", "#FFEFC2", "#064C50"),
  pal("#D9CCFF", "#EAE2FF", "#2A1A7A", "#0B6FB0", "#5B4FE0"),
  pal("#06315E", "#0B4480", "#E9FFFC", "#7FE9E0", "#031D3C"),
  pal("#7FE9E0", "#A6F3EC", "#063F52", "#3B2FB0", "#0A7A80"),
];

export default function PearlSample() {
  return (
    <div className="cl pl">
      <Petals colors={["#FFFFFF", "#D6FFF8", "#E4D6FF"]} drift={30} shape="bubble" />
      <Nav k="cl" />
      <main>
        <ShellHero />
        <section className="cl-strip">
          <Strip mark={<><path d="M-7 24L-27 -2Q-24 -22 -9 -18Q0 -30 9 -18Q24 -22 27 -2L7 24Z" fill="#7FE9E0" /><path d="M0 22V-20M-4 22L-18 -8M4 22L18 -8" stroke="#0B6FB0" strokeWidth="3" /><circle cy="20" r="6" fill="#FFFFFF" /></>} />
        </section>
        <section id="openings" className="pl-openings"><div className="cl-wrap"><Bubbles /></div></section>
        <Depths />
        <CoolBottom
          featuresTitle="Treasures in every one"
          galleryTitle="Washed ashore"
          closeTitle="Find your pearl"
          covers={globalCovers(230, pals, ["promise", "atelier", "tharu", "cathedral", "verala", "piyum", "mathaka"])}
          art={
            <>
              <div className="pl-rays"><i /><i /><i /><i /></div>
              <div className="pl-close-shell"><Shell open id="plc" /></div>
              <Reef className="pl-reef" />
            </>
          }
        />
      </main>
    </div>
  );
}
