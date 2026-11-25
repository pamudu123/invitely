import { Fragment, type ReactNode } from "react";
import { seasonIds, type SeasonId } from "@/lib/season";

/**
 * Writes all four versions into the page and lets CSS show one, so a static page has the
 * right one from the first paint. Use it for words and small drawings. Inside an <svg>, pass `svg`.
 */
export function BySeason({ svg = false, ...parts }: Record<SeasonId, ReactNode> & { svg?: boolean }) {
  const Tag = svg ? "g" : "span";
  return (
    <>
      {seasonIds.map((s) => (
        <Fragment key={s}>{parts[s] === null ? null : <Tag data-only={s}>{parts[s]}</Tag>}</Fragment>
      ))}
    </>
  );
}
