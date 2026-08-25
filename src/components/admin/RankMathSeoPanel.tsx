"use client";

import { useState } from "react";
import {
  analyzeSeo,
  scoreColor,
  SEO_CATEGORY_LABELS,
} from "@/lib/blog/seo-score";
import type { SeoCheck, SeoCheckCategory } from "@/lib/blog/types";

interface RankMathSeoPanelProps {
  title: string;
  slug: string;
  metaDescription: string;
  focusKeyword: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
}

const CATEGORIES: SeoCheckCategory[] = [
  "basic",
  "additional",
  "title_readability",
  "content_readability",
];

function CheckIcon({ status }: { status: SeoCheck["status"] }) {
  if (status === "good")
    return <span className="rm-check rm-check--good" aria-hidden>✓</span>;
  if (status === "ok")
    return <span className="rm-check rm-check--ok" aria-hidden>!</span>;
  return <span className="rm-check rm-check--bad" aria-hidden>✕</span>;
}

function sectionBadge(checks: SeoCheck[]) {
  const errors = checks.filter((c) => c.status === "bad").length;
  const warnings = checks.filter((c) => c.status === "ok").length;
  if (errors > 0) return { text: `${errors} Error${errors > 1 ? "s" : ""}`, kind: "bad" as const };
  if (warnings > 0) return { text: `${warnings} Warning${warnings > 1 ? "s" : ""}`, kind: "ok" as const };
  return { text: "All Good", kind: "good" as const };
}

function SeoSection({
  category,
  checks,
  defaultOpen,
}: {
  category: SeoCheckCategory;
  checks: SeoCheck[];
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen ?? category === "basic");
  const badge = sectionBadge(checks);

  return (
    <div className={`rm-section ${open ? "rm-section--open" : ""}`}>
      <button
        type="button"
        className="rm-section__head"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className="rm-section__chevron" aria-hidden />
        <span className="rm-section__title">{SEO_CATEGORY_LABELS[category]}</span>
        <span className={`rm-section__badge rm-section__badge--${badge.kind}`}>
          {badge.text}
        </span>
      </button>
      {open && (
        <ul className="rm-section__list">
          {checks.map((check) => (
            <li key={check.id} className="rm-item">
              <CheckIcon status={check.status} />
              <span className="rm-item__text">{check.message}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function RankMathSeoPanel(props: RankMathSeoPanelProps) {
  const result = analyzeSeo(
    props.title,
    props.slug,
    props.metaDescription,
    props.focusKeyword,
    props.content,
    { excerpt: props.excerpt, featuredImage: props.featuredImage }
  );

  return (
    <div className="rm-panel">
      {CATEGORIES.map((cat) => {
        const items = result.checks.filter((c) => c.category === cat);
        if (items.length === 0) return null;
        return (
          <SeoSection
            key={cat}
            category={cat}
            checks={items}
            defaultOpen={cat === "basic"}
          />
        );
      })}
    </div>
  );
}

export function useSeoScore(props: RankMathSeoPanelProps) {
  return analyzeSeo(
    props.title,
    props.slug,
    props.metaDescription,
    props.focusKeyword,
    props.content,
    { excerpt: props.excerpt, featuredImage: props.featuredImage }
  );
}

export { scoreColor };
