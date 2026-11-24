import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-300 ease-out-soft outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] whitespace-nowrap select-none";

const variants: Record<Variant, string> = {
  primary: "bg-brand text-on-brand hover:bg-brand-hot",
  secondary: "border border-fg/50 bg-page-2 text-fg hover:border-fg hover:bg-page-3",
  ghost: "text-fg/90 hover:text-fg hover:bg-fg/5",
  danger: "border border-red-600/50 text-red-700 hover:bg-red-600/8",
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
  "w-full min-h-11 rounded-xl border border-fg/55 bg-page-2 px-3.5 py-2.5 text-[0.95rem] text-fg placeholder:text-fg/65 outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/30";

export function Input({ className = "", ...props }: ComponentProps<"input">) {
  return <input {...props} className={`${fieldClass} ${className}`} />;
}

export function Textarea({ className = "", ...props }: ComponentProps<"textarea">) {
  return <textarea {...props} className={`${fieldClass} resize-y ${className}`} />;
}

export function Select({ className = "", children, ...props }: ComponentProps<"select">) {
  return (
    <select {...props} className={`${fieldClass} appearance-none bg-[length:1rem] bg-[right_0.8rem_center] bg-no-repeat pr-9 ${className}`} style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230f1c5c' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")", ...props.style }}>
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
      <span className="text-[0.78rem] font-medium text-fg/90">{label}</span>
      {children}
      {hint ? <span className="text-[0.75rem] leading-snug text-fg/85">{hint}</span> : null}
    </label>
  );
}

export function Card({ className = "", ...props }: ComponentProps<"div">) {
  return <div {...props} className={`rounded-2xl border border-fg/15 bg-page-2 ${className}`} />;
}

export function Badge({ tone = "neutral", children }: { tone?: "neutral" | "flame" | "teal" | "red"; children: ReactNode }) {
  const tones = {
    neutral: "border-fg/15 text-fg/85",
    flame: "border-brand/40 text-brand bg-brand/10",
    teal: "border-aqua/40 text-aqua bg-aqua/10",
    red: "border-red-600/50 text-red-700 bg-red-600/8",
  };
  return (
    <span className={`label inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 !text-[0.75rem] ${tones[tone]}`}>
      {children}
    </span>
  );
}

/** Ice crystal mark and wordmark. */
export function Logo({ className = "", size = 24 }: { className?: string; size?: number }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg width={size} height={size} viewBox="-12 -12 24 24" aria-hidden="true" className="text-brand">
        {[0, 60, 120].map((a) => (
          <path key={a} d="M0 -11V11M-3.200 -8L0 -4.800L3.200 -8M-3.200 8L0 4.800L3.200 8" transform={`rotate(${a})`} fill="none" stroke="currentColor" strokeWidth="1.800" strokeLinecap="round" strokeLinejoin="round" />
        ))}
      </svg>
      <span className="font-serif text-[1.6rem] leading-none">Invitely</span>
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
        background: bare ? "transparent" : "linear-gradient(160deg, #dfe9ff, #8ea2e0 40%, #f4f8ff 60%, #7388cc)",
        boxShadow: bare ? undefined : "0 0 0 1px rgba(15,28,92,0.16), 0 36px 70px -30px rgba(15,28,92,0.55)",
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
