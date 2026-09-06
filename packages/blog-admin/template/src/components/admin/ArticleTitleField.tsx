"use client";

import { useCallback, useEffect, useRef } from "react";
import { getSiteHost } from "@/lib/blog/paths";

interface ArticleTitleFieldProps {
  title: string;
  slug: string;
  onTitleChange: (value: string) => void;
}

export default function ArticleTitleField({
  title,
  slug,
  onTitleChange,
}: ArticleTitleFieldProps) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const host = getSiteHost();

  const resize = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, []);

  useEffect(() => {
    resize();
  }, [title, resize]);

  return (
    <header className="article-write__head">
      <label className="article-write__field-label" htmlFor="article-title">
        Title
      </label>
      <textarea
        ref={ref}
        id="article-title"
        className="article-write__title"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        onInput={resize}
        placeholder="Add title"
        rows={1}
        aria-label="Article title"
      />
      <span className="article-write__field-label">Permalink</span>
      <p className="article-write__permalink" aria-live="polite">
        <span className="article-write__permalink-host">{host}/</span>
        <span className="article-write__permalink-slug">
          {slug || "your-article-slug"}
        </span>
      </p>
    </header>
  );
}
