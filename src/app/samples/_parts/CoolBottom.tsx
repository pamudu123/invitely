import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { templates } from "@/lib/invitation/templates";
import { gFeatures } from "./global";
import { Rail } from "./Rail";
import { Reveal } from "./Reveal";
import { Plans } from "./Site";
import "./cool.css";

/** Features, designs, pricing and closing for the cool-colour samples. Each theme shapes them in CSS. */
export function CoolBottom({
  featuresTitle,
  galleryTitle,
  closeTitle,
  covers,
  art,
}: {
  featuresTitle: string;
  galleryTitle: string;
  closeTitle: string;
  covers: { id: string; name: string; cover: ReactNode }[];
  art: ReactNode;
}) {
  return (
    <>
      <section className="cl-features">
        <div className="cl-wrap">
          <Reveal><h2>{featuresTitle}</h2></Reveal>
          <div className="cl-grid">
            {gFeatures.map((f, i) => (
              <Reveal key={f.title} delay={(i % 3) * 80} className="cl-item">
                <span className="cl-icon"><f.icon size={32} strokeWidth={1.6} /></span>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="cl-gallery">
        <div className="cl-wrap cl-gallery-head">
          <h2>{galleryTitle}</h2>
          <Link href="/templates" className="cl-link">See all {templates.length} designs <ArrowRight size={16} /></Link>
        </div>
        <Rail className="cl-rail" label="Invitation designs">
          {covers.map((c) => (
            <Link key={c.id} href={`/templates/${c.id}`} className="cl-card">
              <span>{c.cover}</span>
              <b>{c.name}</b>
            </Link>
          ))}
        </Rail>
      </section>

      <section id="pricing" className="cl-pricing">
        <div className="cl-wrap">
          <Reveal className="cl-center">
            <h2>Design free. Pay once.</h2>
            <p>One payment for each event. No subscription, no charge per guest.</p>
          </Reveal>
          <Plans k="cl" />
        </div>
      </section>

      <section className="cl-close">
        {art}
        <div className="cl-wrap cl-center">
          <h2>{closeTitle}</h2>
          <p>Pick a design and see your names on it in under a minute. No account, no password, no app.</p>
          <Link href="/templates" className="cl-btn">Start designing free <ArrowRight size={18} /></Link>
        </div>
      </section>
    </>
  );
}
