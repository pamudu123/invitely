"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** Horizontal rail that writes --d (about -1 to 1, distance from centre) on each item. */
export function Rail({ children, className = "", label }: { children: ReactNode; className?: string; label: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const half = el.clientWidth / 2;
      for (const c of Array.from(el.children) as HTMLElement[]) {
        // offsetLeft ignores transforms, so the curve never feeds back into itself.
        const x = c.offsetLeft - el.scrollLeft + c.offsetWidth / 2;
        const d = Math.max(-1.3, Math.min(1.3, (x - half) / half));
        c.style.setProperty("--d", d.toFixed(3));
        c.style.setProperty("--ad", Math.abs(d).toFixed(3));
      }
    };
    const queue = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
    update();
    el.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("scroll", queue);
      window.removeEventListener("resize", queue);
    };
  }, []);
  return (
    <div ref={ref} className={className} style={{ position: "relative" }} role="group" aria-label={label} tabIndex={0}>
      {children}
    </div>
  );
}
