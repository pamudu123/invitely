import type { Metadata } from "next";
import { Abhaya_Libre, Elsie, Figtree, Forum, Gloock, Limelight, Prata, Rozha_One, Yeseva_One, Young_Serif } from "next/font/google";
import { Switcher } from "./_parts/Switcher";
import "./samples.css";

const rozha = Rozha_One({ weight: "400", subsets: ["latin"], variable: "--f-rozha", display: "swap", preload: false });
const gloock = Gloock({ weight: "400", subsets: ["latin"], variable: "--f-gloock", display: "swap", preload: false });
const yeseva = Yeseva_One({ weight: "400", subsets: ["latin"], variable: "--f-yeseva", display: "swap", preload: false });
const young = Young_Serif({ weight: "400", subsets: ["latin"], variable: "--f-young", display: "swap", preload: false });
const limelight = Limelight({ weight: "400", subsets: ["latin"], variable: "--f-limelight", display: "swap", preload: false });
const figtree = Figtree({ subsets: ["latin"], variable: "--f-figtree", display: "swap", preload: false });
const forum = Forum({ weight: "400", subsets: ["latin"], variable: "--f-forum", display: "swap", preload: false });
const prata = Prata({ weight: "400", subsets: ["latin"], variable: "--f-prata", display: "swap", preload: false });
const elsie = Elsie({ weight: ["400", "900"], subsets: ["latin"], variable: "--f-elsie", display: "swap", preload: false });
const abhaya = Abhaya_Libre({ weight: ["500", "700"], subsets: ["latin", "sinhala"], variable: "--f-abhaya", display: "swap", preload: false });

export const metadata: Metadata = {
  title: "Design samples",
  robots: { index: false, follow: false },
};

export default function SamplesLayout({ children }: LayoutProps<"/samples">) {
  return (
    <div className={`s-root ${rozha.variable} ${gloock.variable} ${yeseva.variable} ${abhaya.variable} ${young.variable} ${limelight.variable} ${figtree.variable} ${forum.variable} ${prata.variable} ${elsie.variable}`}>
      {children}
      <Switcher />
    </div>
  );
}
