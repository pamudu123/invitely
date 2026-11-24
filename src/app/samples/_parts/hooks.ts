"use client";

import { useEffect, type RefObject } from "react";

/** Writes --p (0 to 1) on a tall section as its sticky stage is scrolled through. */
export function useScrollVar(ref: RefObject<HTMLElement | null>, onChange?: (p: number) => void) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const span = Math.max(1, r.height - window.innerHeight);
      const p = Math.min(1, Math.max(0, -r.top / span));
      el.style.setProperty("--p", p.toFixed(4));
      onChange?.(p);
    };
    const queue = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", queue);
    };
  }, [ref, onChange]);
}

export function burst(x: number, y: number, count = 46) {
  window.dispatchEvent(new CustomEvent("sample-petals", { detail: { x, y, count } }));
}

/** Petals from the middle of whatever was pressed. */
export function burstFrom(el: Element, count = 46) {
  const r = el.getBoundingClientRect();
  burst(r.left + r.width / 2, r.top + r.height / 2, count);
}
