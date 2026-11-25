import type { HeroLayout, SceneId, ThemeConfig } from "./types";

export interface SceneInfo {
  label: string;
  group: "Sports" | "Professions";
  /** Words on the opening cover */
  verb: string;
  /** Read out by screen readers in place of the picture */
  alt: string;
  /** Pose the cover rests in: 0 before the action, 1 after it */
  rest: 0 | 1;
}

export const sceneInfo: Record<SceneId, SceneInfo> = {
  chess: { label: "Chess", group: "Sports", verb: "Make the winning move", alt: "Chess pieces on a board", rest: 0 },
  cricket: { label: "Cricket", group: "Sports", verb: "Bowl the first ball", alt: "A cricket ball in front of the stumps", rest: 0 },
  tennis: { label: "Tennis", group: "Sports", verb: "Serve", alt: "A tennis racket and ball", rest: 0 },
  football: { label: "Football", group: "Sports", verb: "Take the shot", alt: "A football in front of the goal", rest: 0 },
  basketball: { label: "Basketball", group: "Sports", verb: "Shoot for the hoop", alt: "A basketball under the hoop", rest: 0 },
  badminton: { label: "Badminton", group: "Sports", verb: "Smash it", alt: "A badminton racket and shuttlecock", rest: 0 },
  rugby: { label: "Rugby", group: "Sports", verb: "Kick the conversion", alt: "A rugby ball in front of the posts", rest: 0 },
  golf: { label: "Golf", group: "Sports", verb: "Sink the putt", alt: "A golf green with a flag and ball", rest: 0 },
  tabletennis: { label: "Table tennis", group: "Sports", verb: "Start the rally", alt: "A table tennis bat and ball", rest: 0 },
  trophy: { label: "Trophy", group: "Sports", verb: "Lift the trophy", alt: "A gold trophy cup", rest: 0 },
  doctor: { label: "Medicine", group: "Professions", verb: "Listen to the heartbeat", alt: "A stethoscope around a red heart", rest: 0 },
  lawyer: { label: "Law", group: "Professions", verb: "Bring down the gavel", alt: "A judge's gavel and block", rest: 0 },
  architect: { label: "Architecture", group: "Professions", verb: "Build the house", alt: "A model of a modern house", rest: 1 },
  chef: { label: "Kitchen", group: "Professions", verb: "Lift the cloche", alt: "A plated dish under a silver cloche", rest: 1 },
  developer: { label: "Software", group: "Professions", verb: "Open the laptop", alt: "A laptop showing code", rest: 1 },
  pilot: { label: "Aviation", group: "Professions", verb: "Cleared for take off", alt: "An aeroplane above the clouds", rest: 0 },
  photographer: { label: "Photography", group: "Professions", verb: "Press the shutter", alt: "A camera", rest: 0 },
  teacher: { label: "Teaching", group: "Professions", verb: "Stack the books", alt: "A stack of books with an apple on top", rest: 1 },
  musician: { label: "Music", group: "Professions", verb: "Drop the needle", alt: "A record on a turntable", rest: 1 },
  engineer: { label: "Engineering", group: "Professions", verb: "Set the gears turning", alt: "Interlocking metal gears", rest: 1 },
};

export const sceneIds = Object.keys(sceneInfo) as SceneId[];

export const sceneHeroes = ["stage", "spec", "diorama"] as const;
export type SceneHero = (typeof sceneHeroes)[number];

export function isSceneHero(layout: HeroLayout): layout is SceneHero {
  return (sceneHeroes as readonly string[]).includes(layout);
}

/** Whether any part of the design draws a 3D scene. */
export function usesScene(theme: ThemeConfig): boolean {
  return isSceneHero(theme.hero) || theme.ritual === "play";
}

export function themeScene(theme: ThemeConfig): SceneId {
  return theme.scene && theme.scene in sceneInfo ? theme.scene : "trophy";
}
