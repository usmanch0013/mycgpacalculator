"use client";

import { useEffect, useState } from "react";
import type { TocItem } from "@/lib/blog/toc";

interface BlogTableOfContentsProps {
  items: TocItem[];
}

export default function BlogTableOfContents({ items }: BlogTableOfContentsProps) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");

  useEffect(() => {
    if (!items.length) return;

    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter(Boolean) as HTMLElement[];

    if (!headings.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: [0, 0.2, 0.5, 1] }
    );

    headings.forEach((heading) => observer.observe(heading));
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav className="blog-toc" aria-label="Table of contents">
      <p className="blog-toc__title">Table of contents</p>
      {items.length ? (
        <ol className="blog-toc__list">
          {items.map((item) => (
            <li
              key={item.id}
              className={`blog-toc__item blog-toc__item--h${item.level}${
                activeId === item.id ? " blog-toc__item--active" : ""
              }`}
            >
              <a href={`#${item.id}`} className="blog-toc__link">
                {item.text}
              </a>
            </li>
          ))}
        </ol>
      ) : (
        <p className="blog-toc__empty">Headings will appear here as you add H2 and H3 sections.</p>
      )}
    </nav>
  );
}
