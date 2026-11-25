import type { ReactElement } from "react";
import { sceneIds, sceneInfo } from "@/lib/invitation/scenes";
import type { SceneId } from "@/lib/invitation/types";

/* Third collection of ornament sets, one for each sport and profession. Every set
   is made from a single line icon, drawn around 0,0 about 22 units across. */

const stroke = { fill: "none", stroke: "currentColor", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

const icons: Record<SceneId, ReactElement> = {
  chess: <><circle cx="0" cy="-5" r="3.600" /><path d="M-3.500-1h7M-2.400-1c0 4-2.300 6-2.600 10M2.400-1c0 4 2.300 6 2.600 10M-7 12v-3H7v3z" /></>,
  cricket: <path d="M-5-7V11M0-7V11M5-7V11M-6.500-9.500h5.500M1-9.500h5.500" />,
  tennis: <><circle cx="0" cy="0" r="10" /><path d="M-7-7q6.500 7 0 14M7-7q-6.500 7 0 14" /></>,
  football: <><circle cx="0" cy="0" r="10" /><path d="M0-4.500l4.300 3.100-1.600 5h-5.400l-1.600-5zM0-4.500V-10M4.300-1.400l5.200-1.700M2.700 3.600l3.200 4.400M-2.700 3.600L-5.900 8M-4.300-1.400l-5.200-1.700" /></>,
  basketball: <><circle cx="0" cy="0" r="10" /><path d="M-10 0h20M0-10v20M-7-7q6.500 7 0 14M7-7q-6.500 7 0 14" /></>,
  badminton: <path d="M-3.500 6a3.500 3.500 0 0 0 7 0zM-3.500 6L-8-9M3.500 6L8-9M0 6V-10M-8-9q8-3 16 0M-5.700-1h11.400" />,
  rugby: <g transform="rotate(-32)"><ellipse cx="0" cy="0" rx="12" ry="7" /><path d="M-5 0H5M-3-1.600v3.200M0-1.600v3.200M3-1.600v3.200M-9-4.500q2 4.500 0 9M9-4.500q-2 4.500 0 9" /></g>,
  golf: <><path d="M-2 10V-11l10 4-10 4" /><ellipse cx="-2" cy="10" rx="8" ry="2" /><circle cx="6" cy="8" r="1.300" /></>,
  tabletennis: <><circle cx="-2" cy="-3" r="7.500" /><path d="M1.500 4l5.500 6.500 2.500-2L4 1.500M-7.500 2.500L4.500-.5" /><circle cx="9" cy="-8" r="2" /></>,
  trophy: <path d="M-6-10H6v7a6 6 0 0 1-12 0zM-6-8h-4.500c0 5 2 6.500 4.700 6.700M6-8h4.500c0 5-2 6.500-4.700 6.700M0 3v5M-5 11H5M-3 8h6l1 3h-8z" />,
  doctor: <path d="M0 9.500C-12 2-11-8.500-5-8.500c3 0 4 2 5 4c1-2 2-4 5-4C11-8.500 12 2 0 9.500zM-8.600 0h4.600l2-4 3 7.500 2-3.500h5.600" />,
  lawyer: <path d="M0-11V10M-5 10.500H5M-9-6.500H9M-9-6.500l-3 8a3.200 3.200 0 0 0 6 0zM9-6.500l-3 8a3.200 3.200 0 0 0 6 0z" />,
  architect: <path d="M-11 0L0-9.500 11 0M-7.500-2.500V10h15V-2.500M-2.500 10V3h5v7" />,
  chef: <><path d="M-10.500 4.500a10.500 10.500 0 0 1 21 0zM-12 8h24M-6.500 1a6.500 6.500 0 0 1 4-4" /><circle cx="0" cy="-8" r="1.700" /></>,
  developer: <path d="M-5-6.500L-11.500 0-5 6.500M5-6.500L11.500 0 5 6.500M2.500-9l-5 18" />,
  pilot: <path d="M0-11.500c1.600 0 2.200 3 2.200 6.500l9.300 6v2.200L2.200 0v5.500l3 2.500v1.800L0 8.300l-5.200 1.500V8l3-2.500V0l-9.300 3.200V1l9.300-6c0-3.500.6-6.500 2.200-6.500z" />,
  photographer: <><path d="M-11-5h5.500l2-3.500h7l2 3.500H11V9h-22z" /><circle cx="0" cy="1.700" r="4.600" /></>,
  teacher: <path d="M0-6c-4-3-8-3-11.500-2V8C-8 7-4 7 0 10c4-3 8-3 11.500-2V-8C8-9 4-9 0-6zM0-6V10" />,
  musician: <><path d="M-4 8V-8L8-10.500V5.500M-4-3.500L8-6" /><ellipse cx="-6.800" cy="8" rx="2.900" ry="2.300" /><ellipse cx="5.200" cy="5.500" rx="2.900" ry="2.300" /></>,
  engineer: <><circle cx="0" cy="0" r="7.500" /><circle cx="0" cy="0" r="3" />{Array.from({ length: 8 }, (_, i) => <path key={i} d="M-1.700-7.300v-3.400h3.400v3.400" transform={`rotate(${i * 45})`} />)}</>,
};

function Icon({ id, x, y, s }: { id: SceneId; x: number; y: number; s: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`} {...stroke} strokeWidth={1.2 / s}>{icons[id]}</g>;
}

type Set = Record<string, () => ReactElement>;

const each = (draw: (id: SceneId) => ReactElement): Set => Object.fromEntries(sceneIds.map((id) => [id, () => draw(id)]));

export const sceneDividers: Set = each((id) => (
  <>
    <path d="M8 14H98M142 14H232" {...stroke} strokeWidth={1.1} />
    <path d="M92 10.500V17.500M148 10.500V17.500" {...stroke} strokeWidth={1.1} />
    <Icon id={id} x={120} y={14} s={1.05} />
  </>
));

export const sceneCrests: Set = each((id) => (
  <>
    <Icon id={id} x={80} y={45} s={3} />
    <path d="M4 45H34M126 45H156M34 41v8M126 41v8" {...stroke} strokeWidth={1.1} />
  </>
));

export const sceneCorners: Set = each((id) => (
  <>
    <path d="M4 60V4H60M4 72V78M72 4H78" {...stroke} strokeWidth={1.1} />
    <Icon id={id} x={28} y={28} s={1.25} />
  </>
));

export const sceneOrnamentLabels: Record<string, string> = Object.fromEntries(sceneIds.map((id) => [id, sceneInfo[id].label]));
