export interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

function stripTags(value: string): string {
  return value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 64);
}

function headingText(inner: string): string {
  const withoutNumber = inner.replace(
    /<span[^>]*class=["'][^"']*blog-section-heading__num[^"']*["'][^>]*>[\s\S]*?<\/span>/gi,
    ""
  );
  return stripTags(withoutNumber);
}

export function prepareArticleHtml(html: string): { html: string; toc: TocItem[] } {
  const toc: TocItem[] = [];
  const usedIds = new Set<string>();

  const withIds = html.replace(
    /<h([23])(\s[^>]*)?>([\s\S]*?)<\/h\1>/gi,
    (match, level: string, attrs = "", inner: string) => {
      const text = headingText(inner);
      if (!text) return match;

      const headingLevel = Number(level) as 2 | 3;
      let id = "";

      const existing = attrs.match(/\sid=["']([^"']+)["']/i);
      if (existing?.[1]) {
        id = existing[1];
      } else {
        const base = slugifyHeading(text) || `section-${toc.length + 1}`;
        id = base;
        let suffix = 2;
        while (usedIds.has(id)) {
          id = `${base}-${suffix}`;
          suffix += 1;
        }
        attrs = `${attrs} id="${id}"`;
      }

      usedIds.add(id);
      toc.push({ id, text, level: headingLevel });
      return `<h${level}${attrs}>${inner}</h${level}>`;
    }
  );

  return { html: withIds, toc };
}
