"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { buttonClass } from "@/components/ui/kit";

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Older browsers and non secure pages: fall back to a hidden field.
    try {
      const area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      const ok = document.execCommand("copy");
      area.remove();
      return ok;
    } catch {
      return false;
    }
  }
}

export function CopyButton({
  text,
  label = "Copy link",
  copiedLabel = "Copied",
  variant = "secondary",
  size = "md",
  className = "",
  iconOnly = false,
}: {
  text: string;
  label?: string;
  copiedLabel?: string;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  iconOnly?: boolean;
}) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const onClick = async () => {
    const ok = await copyText(text);
    setState(ok ? "copied" : "failed");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setState("idle"), 2200);
  };

  const shown = state === "copied" ? copiedLabel : state === "failed" ? "Could not copy" : label;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!text}
      aria-label={iconOnly ? shown : undefined}
      title={iconOnly ? shown : undefined}
      className={buttonClass(variant, size, `${iconOnly ? "!w-11 !px-0" : ""} ${className}`)}
    >
      {state === "copied" ? (
        <Check size={16} strokeWidth={1.5} className="text-teal" aria-hidden />
      ) : (
        <Copy size={16} strokeWidth={1.5} aria-hidden />
      )}
      {iconOnly ? null : <span>{shown}</span>}
      <span className="sr-only" aria-live="polite">
        {state === "copied" ? "Link copied" : ""}
      </span>
    </button>
  );
}
