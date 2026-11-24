"use client";

import { RotateCcw } from "lucide-react";
import { useEffect, useState, type CSSProperties } from "react";
import { InvitationView } from "@/components/invitation/InvitationView";
import { PhoneFrame } from "@/components/ui/kit";
import { ritualInfo } from "@/lib/invitation/rituals";
import { showcaseData, showcaseWishes } from "@/lib/invitation/showcase";
import { OpeningArt, type OpeningArtId } from "./OpeningArt";
import "./frost.css";

const panes: { id: OpeningArtId; template: string; palette: string; bg: string; e1: string; e2: string }[] = [
  { id: "seal", template: "atelier", palette: "frost-royal", bg: "#2F49D9", e1: "#8F7BFF", e2: "#4A34C4" },
  { id: "curtain", template: "pihatu", palette: "amethyst-ice", bg: "#5B3FD6", e1: "#37C6E0", e2: "#11799A" },
  { id: "doors", template: "cathedral", palette: "lagoon-ice", bg: "#0B7A92", e1: "#3E63E8", e2: "#20309C" },
  { id: "gift", template: "mathaka", palette: "aqua-ice", bg: "#7ADCEB", e1: "#5B3FD6", e2: "#35209A" },
  { id: "balloon", template: "pop", palette: "lilac-ice", bg: "#A99BFF", e1: "#2F49D9", e2: "#37C6E0" },
  { id: "scratch", template: "golden-year", palette: "glacier", bg: "#129A88", e1: "#4B6BFF", e2: "#20309C" },
  { id: "clapper", template: "premiere", palette: "aurora", bg: "#163A9E", e1: "#8F7BFF", e2: "#4A34C4" },
];

/** Frosted panes. Choosing one clears the frost and plays that opening on the phone. */
export function FrostOpenings() {
  const [active, setActive] = useState(0);
  const [take, setTake] = useState(0);
  const [width, setWidth] = useState(300);
  const pane = panes[active];
  const data = showcaseData(pane.template, pane.palette);

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
              <span className="frost-pane" style={{ background: p.bg, "--e1": p.e1, "--e2": p.e2 } as CSSProperties}>
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
          <InvitationView key={`${active}-${take}`} data={data} embedded lite wishes={showcaseWishes} />
        </PhoneFrame>
        <button type="button" className="frost-btn frost-btn-deep frost-btn-sm" onClick={() => setTake((n) => n + 1)}>
          <RotateCcw size={16} /> Play it again
        </button>
      </div>
    </div>
  );
}
