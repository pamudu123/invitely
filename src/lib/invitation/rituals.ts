import type { RitualId } from "./types";

export const ritualInfo: Record<RitualId, { label: string; verb: string; description: string }> = {
  lamp: { label: "Light the lamp", verb: "Light the lamp to begin", description: "Guests light a brass oil lamp and its glow fills the screen." },
  seal: { label: "Break the seal", verb: "Break the seal", description: "A wax seal with your initials cracks and the envelope opens." },
  curtain: { label: "Draw the curtains", verb: "Draw the curtains", description: "Velvet drapes part like the start of a ceremony." },
  lotus: { label: "Open the lotus", verb: "Touch the lotus to open", description: "A lotus bud opens petal by petal." },
  scratch: { label: "Scratch the foil", verb: "Scratch to reveal the date", description: "Guests scratch gold foil to uncover your date." },
  balloon: { label: "Pop the balloon", verb: "Pop the balloon", description: "A balloon pops into a burst of confetti." },
  betel: { label: "Accept the betel", verb: "Accept the betel leaves", description: "A sheaf of betel leaves is offered, the way families have always invited each other." },
  doors: { label: "Open the doors", verb: "Open the doors", description: "Carved wooden doors swing open onto your invitation." },
  clapper: { label: "Call action", verb: "Tap for action", description: "A film clapperboard snaps shut and the show begins." },
  gift: { label: "Open the gift", verb: "Open the gift", description: "The lid lifts off a wrapped box in a burst of sparkle." },
  none: { label: "No opening", verb: "", description: "Go straight to the invitation." },
};
