"use client";

import { RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { InvitationView } from "@/components/invitation/InvitationView";
import { PhoneFrame } from "@/components/ui/kit";
import { ritualInfo } from "@/lib/invitation/rituals";
import { useSeason } from "@/lib/client/season";
import { showcaseData, showcaseWishes } from "@/lib/invitation/showcase";
import type { SeasonId } from "@/lib/season";
import { OpeningArt, type OpeningArtId } from "./OpeningArt";
import "./frost.css";

/** The colours of the panes themselves are in frost.css and seasons.css. */
const panes: { id: OpeningArtId; template: string; palette: Record<SeasonId, string> }[] = [
  { id: "seal", template: "atelier", palette: { winter: "frost-royal", spring: "cherry", summer: "sandbar", autumn: "harvest" } },
  { id: "curtain", template: "pihatu", palette: { winter: "amethyst-ice", spring: "wisteria", summer: "coral-reef", autumn: "maple" } },
  { id: "doors", template: "cathedral", palette: { winter: "lagoon-ice", spring: "meadow", summer: "lagoon", autumn: "woodland" } },
  { id: "gift", template: "mathaka", palette: { winter: "aqua-ice", spring: "primrose", summer: "sunflower", autumn: "cider" } },
  { id: "balloon", template: "pop", palette: { winter: "lilac-ice", spring: "cherry", summer: "coral-reef", autumn: "maple" } },
  { id: "scratch", template: "golden-year", palette: { winter: "glacier", spring: "primrose", summer: "sunflower", autumn: "cider" } },
  { id: "clapper", template: "premiere", palette: { winter: "aurora", spring: "meadow", summer: "lagoon", autumn: "harvest" } },
];

/** Misted panes. Choosing one clears the mist and plays that opening on the phone. */
export function FrostOpenings() {
  const [active, setActive] = useState(0);
  const [take, setTake] = useState(0);
  const [width, setWidth] = useState(300);
  const season = useSeason();
  const pane = panes[active];
  const data = showcaseData(pane.template, pane.palette[season]);

  useEffect(() => {
    const fit = () => setWidth(Math.round(Math.max(236, Math.min(310, window.innerWidth * 0.72, (window.innerHeight - 170) * (390 / 844)))));
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  const choose = (i: number) => {
    setActive(i);
    setTake((n) => n + 1);
  };

  return (
    <div className="frost-openings-grid">
      <ul className="frost-panes">
        {panes.map((p, i) => (
          <li key={p.id}>
            <button type="button" aria-pressed={active === i} onClick={() => choose(i)}>
              <span className="frost-pane">
                <OpeningArt id={p.id} />
                <span className="frost-glass" />
              </span>
              <span className="frost-pane-name">{ritualInfo[p.id].label}</span>
            </button>
          </li>
        ))}
        <li className="frost-panes-note">
          <p>{ritualInfo[pane.id].description}</p>
        </li>
      </ul>
      <div className="frost-phone">
        <PhoneFrame width={width}>
          <InvitationView key={`${season}-${active}-${take}`} data={data} embedded lite wishes={showcaseWishes} />
        </PhoneFrame>
        <button type="button" className="frost-btn frost-btn-deep frost-btn-sm" onClick={() => setTake((n) => n + 1)}>
          <RotateCcw size={16} /> Play it again
        </button>
      </div>
    </div>
  );
}
