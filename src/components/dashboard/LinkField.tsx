"use client";

import { CopyButton } from "./CopyButton";
import { bareHost, publicLink, useOrigin } from "./links";

/** Read only public link with a copy button beside it. */
export function LinkField({ slug, className = "" }: { slug: string; className?: string }) {
  const origin = useOrigin();
  const link = origin ? publicLink(origin, slug) : "";
  return (
    <div className={`flex flex-col gap-2.5 sm:flex-row sm:items-center ${className}`}>
      <div
        className="flex min-h-11 min-w-0 flex-1 items-center rounded-xl border border-fg/12 bg-page-3/70 px-3.5 font-mono text-[0.82rem] text-fg/85"
        title={link}
      >
        <span className="truncate">
          <span className="text-fg/85">{origin ? `${bareHost(origin)}/i/` : "/i/"}</span>
          {slug}
        </span>
      </div>
      <CopyButton text={link} className="shrink-0" />
    </div>
  );
}
