"use client";

import { ArrowDown, ArrowUp, ImagePlus, Trash2 } from "lucide-react";
import { useRef, useState, type ReactNode } from "react";
import { compressImage } from "@/lib/client/image";

export function Group({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <section className="border-b border-fg/8 px-5 py-5 last:border-b-0">
      <h3 className="label text-brand">{title}</h3>
      {hint ? <p className="mt-1.5 text-[0.8rem] leading-snug text-fg/85">{hint}</p> : null}
      <div className="mt-3.5 grid grid-cols-1 gap-3.5 [&>*]:min-w-0">{children}</div>
    </section>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
  hint,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  hint?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex min-h-11 w-full items-center justify-between gap-4 text-left"
    >
      <span>
        <span className="block text-[0.92rem] text-fg">{label}</span>
        {hint ? <span className="block text-[0.76rem] text-fg/85">{hint}</span> : null}
      </span>
      <span className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? "bg-brand" : "bg-fg/55"}`}>
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${checked ? "left-[1.4rem]" : "left-0.5"}`} />
      </span>
    </button>
  );
}

/** Selectable tile used for palettes, fonts, ornaments and openings. */
export function Tile({
  active,
  onClick,
  children,
  className = "",
  label,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
  className?: string;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={label}
      className={`relative overflow-hidden rounded-xl border text-left transition-all ${
        active ? "border-brand bg-brand/10 shadow-[0_0_0_1px_var(--color-brand)]" : "border-fg/12 bg-page-3/50 hover:border-fg/35"
      } ${className}`}
    >
      {children}
    </button>
  );
}

export function IconButton({
  onClick,
  label,
  children,
  disabled,
  tone = "neutral",
}: {
  onClick: () => void;
  label: string;
  children: ReactNode;
  disabled?: boolean;
  tone?: "neutral" | "danger";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      disabled={disabled}
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-fg/10 transition-colors disabled:opacity-25 ${
        tone === "danger" ? "text-red-700 hover:bg-red-600/8" : "text-fg/85 hover:bg-fg/8 hover:text-fg"
      }`}
    >
      {children}
    </button>
  );
}

export function RowActions({
  index,
  count,
  onMove,
  onRemove,
}: {
  index: number;
  count: number;
  onMove: (from: number, to: number) => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex gap-1.5">
      <IconButton label="Move up" disabled={index === 0} onClick={() => onMove(index, index - 1)}><ArrowUp size={15} /></IconButton>
      <IconButton label="Move down" disabled={index === count - 1} onClick={() => onMove(index, index + 1)}><ArrowDown size={15} /></IconButton>
      <IconButton label="Remove" tone="danger" onClick={onRemove}><Trash2 size={15} /></IconButton>
    </div>
  );
}

export function PhotoPicker({
  value,
  onChange,
  label,
  aspect = "3 / 4",
}: {
  value?: string;
  onChange: (v: string | undefined) => void;
  label: string;
  aspect?: string;
}) {
  const input = useRef<HTMLInputElement | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const pick = async (file?: File) => {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      onChange(await compressImage(file));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not add that photo.");
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  };

  return (
    <div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => input.current?.click()}
          className="relative flex w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-dashed border-fg/25 bg-page-3/60 text-fg/85 transition-colors hover:border-brand/60 hover:text-brand"
          style={{ aspectRatio: aspect }}
          aria-label={label}
        >
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <ImagePlus size={22} strokeWidth={1.4} />
          )}
        </button>
        <div className="grid gap-2">
          <p className="text-[0.9rem] text-fg">{label}</p>
          <div className="flex gap-2">
            <button type="button" onClick={() => input.current?.click()} className="rounded-full border border-fg/20 px-3.5 py-1.5 text-[0.8rem] text-fg/90 hover:border-fg/50">
              {busy ? "Adding…" : value ? "Replace" : "Choose photo"}
            </button>
            {value ? (
              <button type="button" onClick={() => onChange(undefined)} className="rounded-full px-3 py-1.5 text-[0.8rem] text-fg/85 hover:text-red-700">
                Remove
              </button>
            ) : null}
          </div>
        </div>
      </div>
      {error ? <p className="mt-2 text-[0.8rem] text-red-700">{error}</p> : null}
      <input ref={input} type="file" accept="image/*" className="hidden" onChange={(e) => void pick(e.target.files?.[0])} />
    </div>
  );
}

export function moveItem<T>(list: T[], from: number, to: number): T[] {
  if (to < 0 || to >= list.length) return list;
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}
