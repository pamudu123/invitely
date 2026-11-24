"use client";

import { X } from "lucide-react";
import { useEffect, useId, useRef, type ReactNode } from "react";
import { Button } from "@/components/ui/kit";

/**
 * Modal built on the native dialog element. It slides up as a sheet on phones
 * and sits in the middle of the screen on larger displays.
 */
export function Dialog({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="m-0 mt-auto w-full max-w-full rounded-t-3xl border border-paper/10 bg-night-2 p-0 text-paper backdrop:bg-black/70 backdrop:backdrop-blur-sm sm:m-auto sm:max-w-md sm:rounded-2xl"
    >
      {open ? (
        <div className="p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:p-6">
          <div className="mb-4 flex items-start justify-between gap-4">
            <h2 id={titleId} className="display text-2xl leading-tight">
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="-mr-2 -mt-2 grid size-11 shrink-0 place-items-center rounded-full text-paper/60 transition-colors hover:bg-paper/5 hover:text-paper"
            >
              <X size={18} strokeWidth={1.5} aria-hidden />
            </button>
          </div>
          {children}
        </div>
      ) : null}
    </dialog>
  );
}

/** Small "are you sure" dialog for destructive actions. */
export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  body,
  confirmLabel,
  pending = false,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  body: ReactNode;
  confirmLabel: string;
  pending?: boolean;
}) {
  return (
    <Dialog open={open} onClose={onClose} title={title}>
      <div className="text-sm leading-relaxed text-paper/65">{body}</div>
      <div className="mt-6 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
        <Button type="button" variant="ghost" onClick={onClose} disabled={pending}>
          Cancel
        </Button>
        <Button type="button" variant="danger" onClick={onConfirm} disabled={pending}>
          {pending ? "One moment…" : confirmLabel}
        </Button>
      </div>
    </Dialog>
  );
}
