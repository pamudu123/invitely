/** Puffy cloud, about 120 wide and centred on x. */
export function Cloud({ x, y, s = 1, c = "#FFFFFF", o = 0.9 }: { x: number; y: number; s?: number; c?: string; o?: number }) {
  return <path d="M-56 0C-70 -2 -68 -24 -48 -22C-46 -42 -18 -46 -8 -32C2 -48 34 -42 34 -22C54 -26 64 -4 50 0Z" transform={`translate(${x} ${y}) scale(${s})`} fill={c} opacity={o} />;
}

/** `v` picks one of the tree's colours. */
export interface TreeProps { x: number; y: number; s: number; v?: number }
