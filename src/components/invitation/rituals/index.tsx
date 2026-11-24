"use client";

import { useState } from "react";
import type { InvitationData, RitualId } from "@/lib/invitation/types";
import { BalloonRitual } from "./Balloon";
import { CurtainRitual } from "./Curtain";
import { LampRitual } from "./Lamp";
import { LotusRitual } from "./Lotus";
import { ScratchRitual } from "./Scratch";
import { SealRitual } from "./Seal";
import type { RitualProps } from "./shared";

const map: Record<Exclude<RitualId, "none">, (p: RitualProps) => React.ReactElement> = {
  lamp: LampRitual,
  seal: SealRitual,
  curtain: CurtainRitual,
  lotus: LotusRitual,
  scratch: ScratchRitual,
  balloon: BalloonRitual,
};

/** Full-screen cover shown before the invitation. Fades out once the guest completes the gesture. */
export function RitualOverlay({
  data,
  guestName,
  fixed,
  onOpen,
  onFinished,
}: {
  data: InvitationData;
  guestName?: string;
  fixed: boolean;
  onOpen: () => void;
  onFinished: () => void;
}) {
  const [leaving, setLeaving] = useState(false);
  const kind = data.theme.ritual;
  if (kind === "none") return null;
  const Ritual = map[kind];

  const done = () => {
    setLeaving(true);
    window.setTimeout(onFinished, 800);
  };

  return (
    <div
      className={`inv-cover ${fixed ? "fixed" : "absolute"} inset-0 z-40 transition-opacity duration-700`}
      style={{ opacity: leaving ? 0 : 1, pointerEvents: leaving ? "none" : "auto" }}
    >
      <Ritual data={data} guestName={guestName} onOpen={onOpen} onDone={done} />
    </div>
  );
}
