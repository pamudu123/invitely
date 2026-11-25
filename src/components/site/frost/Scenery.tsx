import Link from "next/link";
import { occasions } from "@/lib/invitation/occasions";
import { AutumnHorizon, AutumnMini, AutumnView } from "@/components/site/season/AutumnArt";
import { BySeason } from "@/components/site/season/BySeason";
import { SpringHorizon, SpringMini, SpringView } from "@/components/site/season/SpringArt";
import { SummerHorizon, SummerMini, SummerView } from "@/components/site/season/SummerArt";
import { Couple, IcePalace, Pine } from "./Globe";
import "./frost.css";

/** Light in the sky: aurora, soft spring haze, sun rays or a harvest moon. */
export function Sky() {
  return (
    <>
      <div className="frost-aurora" aria-hidden="true"><i /><i /><i /></div>
      <div className="frost-stars" aria-hidden="true" />
    </>
  );
}

/** Snow, petals, motes of light or leaves. The season decides how they look and move. */
export function Falling() {
  return (
    <div className="frost-fall" aria-hidden="true">
      {Array.from({ length: 22 }, (_, i) => (
        <i key={i} style={{ left: `${(i * 47 + 9) % 100}%`, animationDuration: `${9 + ((i * 5) % 9)}s`, animationDelay: `${-((i * 37) % 100) / 8}s`, width: `${5 + (i % 4) * 2}px` }} />
      ))}
    </div>
  );
}

function WinterHorizon() {
  return (
    <>
      {/* Mountains stretch with the screen so their tops are never cut off */}
      <svg viewBox="0 0 1600 420" preserveAspectRatio="none">
        <path d="M0 420V250L150 120L260 220L400 60L560 230L700 130L860 260L1010 90L1180 240L1330 110L1460 220L1600 130V420Z" fill="#2D4FD6" />
        <path d="M400 60L470 135L430 125L405 160L372 118L340 130ZM1010 90L1080 152L1040 148L1014 176L980 146L955 156ZM150 120L200 166L168 160L148 184L118 154ZM1330 110L1380 152L1346 150L1328 172L1296 148Z" fill="#E8F6FF" />
        <path d="M0 420V330C200 260 360 320 560 300C780 270 900 330 1120 300C1300 280 1460 320 1600 290V420Z" fill="#BFE6FF" />
        <path d="M0 420V372C260 330 520 380 800 360C1080 340 1340 380 1600 350V420Z" fill="#FFFFFF" />
      </svg>
      <svg viewBox="0 0 1600 420" preserveAspectRatio="xMidYMax slice">
        <Pine x={90} y={362} s={1} />
        <Pine x={170} y={376} s={0.8} />
        <Pine x={250} y={360} s={0.7} c="#2A9AA6" />
        <Pine x={1390} y={360} s={0.9} />
        <Pine x={1470} y={376} s={1.1} />
        <Pine x={1550} y={356} s={0.8} c="#2A9AA6" />
      </svg>
    </>
  );
}

export function Horizon() {
  return (
    <div className="frost-peaks" aria-hidden="true">
      <BySeason winter={<WinterHorizon />} spring={<SpringHorizon />} summer={<SummerHorizon />} autumn={<AutumnHorizon />} />
    </div>
  );
}

function WinterView() {
  return (
    <>
      <path d="M0 460V330C240 250 420 330 700 300C980 270 1240 340 1600 280V460Z" fill="#8FC8FF" />
      <g transform="translate(800 350) scale(1.1)"><IcePalace /></g>
      <path d="M0 460V360C300 310 560 370 800 352C1040 334 1300 370 1600 330V460Z" fill="#FFFFFF" />
      <path d="M0 460V412C300 380 560 430 800 414C1040 398 1300 430 1600 396V460Z" fill="#E4F2FF" />
      <Pine x={470} y={372} s={1} />
      <Pine x={560} y={386} s={0.7} c="#2A9AA6" />
      <Pine x={1050} y={380} s={0.9} />
      <Pine x={1140} y={372} s={1.1} c="#2A9AA6" />
    </>
  );
}

/** The season's place with the couple in front, for the closing section. */
export function PlaceView() {
  return (
    <svg viewBox="0 0 1600 460" preserveAspectRatio="xMidYMax slice" className="frost-view" aria-hidden="true">
      <BySeason svg winter={<WinterView />} spring={<SpringView />} summer={<SummerView />} autumn={<AutumnView />} />
      <g transform="translate(800 436) scale(1)"><Couple /></g>
    </svg>
  );
}

const lives = [
  { tag: "Before", title: "The invitation", text: "Countdown, schedule, map and RSVP. Guests add it to their calendar and reply in a tap." },
  { tag: "On the day", title: "The live guide", text: "The page shows what is happening now and what comes next, with directions one tap away." },
  { tag: "After", title: "The keepsake", text: "Your thank you note, your photos and every wish your guests left, kept on the same link." },
];

function WinterMini({ i }: { i: number }) {
  return (
    <>
      {i === 2 ? (
        <>
          <path d="M-200 -90C-120 -150 -60 -40 20 -96C90 -146 140 -70 200 -110V-40C140 -10 90 -80 20 -34C-60 16 -120 -80 -200 -30Z" fill="#5FF0C8" opacity="0.75" />
          <path d="M-200 -130C-120 -180 -60 -90 20 -136C90 -176 140 -120 200 -150V-112C140 -76 90 -130 20 -90C-60 -46 -120 -126 -200 -86Z" fill="#B79BFF" opacity="0.8" />
        </>
      ) : (
        <circle cx={i ? 60 : -80} cy={i ? -96 : 20} r={i ? 44 : 60} fill={i ? "#FFF6D0" : "#FFE0EE"} />
      )}
      <path d="M-200 100C-120 60 -60 96 0 80C80 62 130 96 200 74V200H-200Z" fill={["#C9B8FF", "#9FDCFF", "#274BC4"][i]} />
      <g transform="translate(0 122) scale(0.86)"><IcePalace /></g>
      <Pine x={-130} y={128} s={0.7} />
      <Pine x={132} y={128} s={0.74} />
      <path d="M-200 126C-100 104 100 104 200 126V200H-200Z" fill={i === 2 ? "#B8D4FF" : "#fff"} />
    </>
  );
}

export function ThreeGlobes() {
  return (
    <div className="frost-three">
      {lives.map((x, i) => (
        <article key={x.tag}>
          <div className={`frost-mini frost-mini-${i}`}>
            <svg viewBox="-200 -200 400 400" aria-hidden="true">
              <BySeason svg winter={<WinterMini i={i} />} spring={<SpringMini i={i} />} summer={<SummerMini i={i} />} autumn={<AutumnMini i={i} />} />
              {i === 1 ? <g transform="translate(0 158)"><Couple /></g> : null}
            </svg>
          </div>
          <p className="frost-tag">{x.tag}</p>
          <h3>{x.title}</h3>
          <p>{x.text}</p>
        </article>
      ))}
    </div>
  );
}

/** Occasions, moving slowly. Pauses on hover and focus. */
export function OccasionStrip() {
  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined}>
      {occasions.map((o) => (
        <li key={o.id}>
          <i className="season-mark text-brand" aria-hidden="true" />
          <Link href={`/templates?occasion=${o.id}`} tabIndex={hidden ? -1 : undefined}>{o.plural}</Link>
        </li>
      ))}
    </ul>
  );
  return (
    <nav aria-label="Occasions" className="frost-strip">
      <div>{row(false)}{row(true)}</div>
    </nav>
  );
}
