import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-300 ease-out-soft outline-none focus-visible:ring-2 focus-visible:ring-flame/60 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] whitespace-nowrap select-none";

const variants: Record<Variant, string> = {
  primary: "bg-flame text-night hover:bg-flame-hot shadow-[0_0_0_0_rgba(232,181,101,0.5)] hover:shadow-[0_0_32px_-4px_rgba(232,181,101,0.55)]",
  secondary: "border border-paper/20 text-paper hover:border-paper/50 hover:bg-paper/5",
  ghost: "text-paper/70 hover:text-paper hover:bg-paper/5",
  danger: "border border-red-400/40 text-red-300 hover:bg-red-400/10",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-[0.82rem]",
  md: "h-11 px-5 text-[0.9rem]",
  lg: "h-13 px-7 text-[0.98rem] min-h-[3.25rem]",
};

export function buttonClass(variant: Variant = "primary", size: Size = "md", extra = ""): string {
  return `${base} ${variants[variant]} ${sizes[size]} ${extra}`;
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ComponentProps<"button"> & { variant?: Variant; size?: Size }) {
  return <button {...props} className={buttonClass(variant, size, className)} />;
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant; size?: Size }) {
  return <Link {...props} className={buttonClass(variant, size, className)} />;
}

export const fieldClass =
  "w-full min-h-11 rounded-xl border border-paper/12 bg-night-3/70 px-3.5 py-2.5 text-[0.95rem] text-paper placeholder:text-paper/30 outline-none transition-colors focus:border-flame/70 focus:bg-night-3";

export function Input({ className = "", ...props }: ComponentProps<"input">) {
  return <input {...props} className={`${fieldClass} ${className}`} />;
}

export function Textarea({ className = "", ...props }: ComponentProps<"textarea">) {
  return <textarea {...props} className={`${fieldClass} resize-y ${className}`} />;
}

export function Select({ className = "", children, ...props }: ComponentProps<"select">) {
  return (
    <select {...props} className={`${fieldClass} appearance-none bg-[length:1rem] bg-[right_0.8rem_center] bg-no-repeat pr-9 ${className}`} style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23f4eddf' stroke-opacity='.6' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")", ...props.style }}>
      {children}
    </select>
  );
}

export function Field({
  label,
  hint,
  children,
  className = "",
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={`grid gap-1.5 ${className}`}>
      <span className="text-[0.78rem] font-medium text-paper/70">{label}</span>
      {children}
      {hint ? <span className="text-[0.74rem] leading-snug text-paper/40">{hint}</span> : null}
    </label>
  );
}

export function Card({ className = "", ...props }: ComponentProps<"div">) {
  return <div {...props} className={`rounded-2xl border border-paper/10 bg-night-2 ${className}`} />;
}

export function Badge({ tone = "neutral", children }: { tone?: "neutral" | "flame" | "teal" | "red"; children: ReactNode }) {
  const tones = {
    neutral: "border-paper/15 text-paper/60",
    flame: "border-flame/40 text-flame bg-flame/10",
    teal: "border-teal/40 text-teal bg-teal/10",
    red: "border-red-400/40 text-red-300 bg-red-400/10",
  };
  return (
    <span className={`label inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 !text-[0.6rem] ${tones[tone]}`}>
      {children}
    </span>
  );
}

/** Flame mark and wordmark. */
export function Logo({ className = "", size = 22 }: { className?: string; size?: number }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
        <defs>
          <linearGradient id="logo-flame" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffdca6" />
            <stop offset="1" stopColor="#e09a45" />
          </linearGradient>
        </defs>
        <path d="M12 1.500c4 5.200 6.500 8.700 6.500 12.400a6.500 6.500 0 0 1-13 0c0-3.700 2.500-7.200 6.500-12.400z" fill="url(#logo-flame)" />
        <path d="M12 10c1.900 2.400 2.800 3.900 2.800 5.300a2.800 2.800 0 0 1-5.600 0c0-1.400.9-2.900 2.800-5.300z" fill="#060b0b" opacity="0.850" />
        <path d="M5 22.500h14" stroke="#e8b565" strokeWidth="1.300" strokeLinecap="round" />
      </svg>
      <span className="font-serif text-[1.45rem] leading-none tracking-[-0.02em]">Invitely</span>
    </span>
  );
}

/**
 * Phone shaped frame. Children are laid out in a 390 by 844 box and scaled to fit,
 * so previews always look exactly as they will on a real phone.
 */
export function PhoneFrame({
  children,
  width = 300,
  className = "",
  bare = false,
}: {
  children: ReactNode;
  width?: number;
  className?: string;
  bare?: boolean;
}) {
  const scale = width / 390;
  const height = 844 * scale;
  const bezel = bare ? 0 : Math.max(6, width * 0.028);
  return (
    <div
      className={`relative shrink-0 ${className}`}
      style={{
        width: width + bezel * 2,
        height: height + bezel * 2,
        padding: bezel,
        borderRadius: (bare ? 30 : 46) * scale + bezel,
        background: bare ? "transparent" : "linear-gradient(160deg, #2a3432, #0c1211 40%, #1c2624)",
        boxShadow: bare ? undefined : "0 0 0 1px rgba(244,237,223,0.08), 0 40px 80px -30px rgba(0,0,0,0.9), 0 0 120px -40px rgba(232,181,101,0.25)",
      }}
    >
      <div className="relative overflow-hidden bg-black" style={{ width, height, borderRadius: (bare ? 30 : 46) * scale }}>
        <div
          className="absolute left-0 top-0 origin-top-left"
          style={{ width: 390, height: 844, transform: `scale(${scale})` }}
        >
          {children}
        </div>
        {!bare ? (
          <div
            className="pointer-events-none absolute left-1/2 z-50 -translate-x-1/2 rounded-full bg-black"
            style={{ top: 9 * scale, width: 92 * scale, height: 24 * scale }}
          />
        ) : null}
      </div>
    </div>
  );
}
