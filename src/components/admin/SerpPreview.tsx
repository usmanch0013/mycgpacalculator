"use client";

import { getSiteHost } from "@/lib/blog/paths";

interface SerpPreviewProps {
  title: string;
  slug: string;
  metaDescription: string;
}

export default function SerpPreview({
  title,
  slug,
  metaDescription,
}: SerpPreviewProps) {
  const displayTitle = title.trim() || "Your article title";
  const displayDesc =
    metaDescription.trim() ||
    "Your meta description will appear here. Aim for 120–160 characters with your focus keyword.";
  const url = `${getSiteHost()}/${slug || "your-article-slug"}`;

  return (
    <div className="serp-preview" aria-label="Google search preview">
      <p className="serp-preview__label">Search preview</p>
      <div className="serp-preview__card">
        <p className="serp-preview__url">{url}</p>
        <p className="serp-preview__title">{displayTitle}</p>
        <p className="serp-preview__desc">{displayDesc}</p>
      </div>
    </div>
  );
}
