"use client";

import { useEffect, useRef, type ReactNode } from "react";

const NAV_OFFSET = 88;
const MOBILE_MAX = 860;

interface BlogStickyColumnProps {
  children: ReactNode;
  className?: string;
  "aria-label"?: string;
}

export default function BlogStickyColumn({
  children,
  className = "",
  "aria-label": ariaLabel,
}: BlogStickyColumnProps) {
  const colRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const col = colRef.current;
    const rail = railRef.current;
    if (!col || !rail) return;

    let frame = 0;

    const resetStyles = () => {
      rail.style.position = "";
      rail.style.top = "";
      rail.style.left = "";
      rail.style.width = "";
      rail.style.bottom = "";
      rail.style.maxHeight = "";
      rail.style.overflowY = "";
    };

    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (window.innerWidth <= MOBILE_MAX || col.offsetParent === null) {
          resetStyles();
          return;
        }

        const colRect = col.getBoundingClientRect();
        const railHeight = rail.offsetHeight;
        const available = window.innerHeight - NAV_OFFSET;

        if (colRect.top >= NAV_OFFSET) {
          resetStyles();
          return;
        }

        if (colRect.bottom <= NAV_OFFSET + Math.min(railHeight, available)) {
          rail.style.position = "absolute";
          rail.style.top = "auto";
          rail.style.bottom = "0";
          rail.style.left = "0";
          rail.style.width = "100%";
          rail.style.maxHeight = "";
          rail.style.overflowY = "";
          return;
        }

        rail.style.position = "fixed";
        rail.style.top = `${NAV_OFFSET}px`;
        rail.style.left = `${colRect.left}px`;
        rail.style.width = `${colRect.width}px`;
        rail.style.bottom = "auto";
        rail.style.maxHeight = `${available}px`;
        rail.style.overflowY = railHeight > available ? "auto" : "";
      });
    };

    col.style.position = "relative";

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    const observer = new ResizeObserver(update);
    observer.observe(col);
    observer.observe(rail);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      observer.disconnect();
      resetStyles();
    };
  }, []);

  return (
    <div ref={colRef} className="blog-article__sidebar-col">
      <aside ref={railRef} className={className} aria-label={ariaLabel}>
        {children}
      </aside>
    </div>
  );
}
