"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { SnowGlobe } from "./Globe";
import { Aurora, Peaks, Snowfall } from "./Scenery";
import "./frost.css";

export function FrostHero({ designs, openings }: { designs: number; openings: number }) {
  const [nudge, setNudge] = useState(0);
  return (
    <section className="frost-hero">
      <Aurora />
      <Snowfall />
      <Peaks />
      <div className="frost-copy">
        <h1>Invitations that open like a <em>ceremony</em></h1>
        <p>
          Your guests break the seal, draw the curtains or open the doors, and your day comes alive on their phone. Design it
          yourself in minutes.
        </p>
        <div className="frost-actions">
          <Link href="/templates" className="frost-btn">Start designing free <ArrowRight size={18} /></Link>
          <button type="button" className="frost-btn frost-btn-deep" onClick={() => setNudge((n) => n + 1)}>Shake the globe</button>
        </div>
        <p className="frost-facts">{designs} designs, {openings} openings, one payment per event.</p>
      </div>
      <div className="frost-globe-wrap"><SnowGlobe nudge={nudge} /></div>
    </section>
  );
}
