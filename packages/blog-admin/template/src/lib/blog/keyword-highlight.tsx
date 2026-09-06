import type { ReactNode } from "react";

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function keywordPattern(keyword: string): RegExp | null {
  const needle = keyword.trim().replace(/\s+/g, " ");
  if (!needle) return null;
  return new RegExp(`(^|[^a-z0-9])(${escapeRegExp(needle).replace(/\s+/g, "\\s+")})(?=[^a-z0-9]|$)`, "gi");
}

export function hasKeyword(text: string, keyword: string): boolean {
  const pattern = keywordPattern(keyword);
  return Boolean(pattern && pattern.test(text));
}

export function highlightKeyword(text: string, keyword: string): ReactNode {
  const pattern = keywordPattern(keyword);
  if (!pattern || !text) return text;

  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let index = 0;

  while ((match = pattern.exec(text)) !== null) {
    const prefix = match[1] ?? "";
    const found = match[2] ?? "";
    const start = match.index + prefix.length;
    const end = start + found.length;

    if (start > lastIndex) nodes.push(text.slice(lastIndex, start));
    nodes.push(
      <strong key={`kw-${index}`} className="serp-preview__kw">
        {text.slice(start, end)}
      </strong>
    );
    lastIndex = end;
    index += 1;
    if (index > 20) break;
  }

  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes.length ? nodes : text;
}
