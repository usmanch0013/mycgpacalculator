import { repairArticleLinkHrefs } from "./link-href";

const BULLET_PREFIX =
  /^(?:&nbsp;|\u00a0|\s)*[\u2022\u2023\u25E6\u2043\u2219•●○◦\-–—]\s+/;
const ORDERED_PREFIX = /^(?:&nbsp;|\u00a0|\s)*(\d+)[.)]\s+/;
const DASH_PREFIX = /^(?:&nbsp;|\u00a0|\s)*-\s+/;

function decodeEntities(value: string): string {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function stripTags(value: string): string {
  return decodeEntities(value.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
}

function stripListPrefixFromHtml(html: string): string {
  const text = stripTags(html);
  if (!BULLET_PREFIX.test(text) && !ORDERED_PREFIX.test(text) && !DASH_PREFIX.test(text)) {
    return html.trim();
  }

  return html
    .replace(/^(<(?:strong|b|em|i)>)?\s*(?:&nbsp;|\u00a0|\s)*[\u2022\u2023\u25E6\u2043\u2219•●○◦\-–—]\s+/i, "$1")
    .replace(/^(<(?:strong|b|em|i)>)?\s*(?:&nbsp;|\u00a0|\s)*\d+[.)]\s+/i, "$1")
    .replace(/^(<(?:strong|b|em|i)>)?\s*(?:&nbsp;|\u00a0|\s)*-\s+/i, "$1")
    .replace(/^(?:&nbsp;|\u00a0|\s)*[\u2022\u2023\u25E6\u2043\u2219•●○◦\-–—]\s+/, "")
    .replace(/^(?:&nbsp;|\u00a0|\s)*\d+[.)]\s+/, "")
    .replace(/^(?:&nbsp;|\u00a0|\s)*-\s+/, "")
    .trim();
}

function stripListPrefix(value: string): string {
  return stripListPrefixFromHtml(value);
}

function isBulletLine(value: string): boolean {
  const text = stripTags(value);
  return BULLET_PREFIX.test(text) || DASH_PREFIX.test(text);
}

function isOrderedLine(value: string): boolean {
  return ORDERED_PREFIX.test(stripTags(value));
}

function paragraphInner(html: string): string | null {
  const match = html.match(/^<p[^>]*>([\s\S]*?)<\/p>$/i);
  return match ? match[1] : null;
}

function getParagraphIndent(html: string): number {
  const styleMatch = html.match(/^<p[^>]*style=["']([^"']*)["'][^>]*>/i);
  if (!styleMatch) return 0;

  const margin = styleMatch[1].match(/margin-left:\s*([\d.]+)(pt|px|rem|em)/i);
  if (!margin) return 0;

  const value = Number(margin[1]);
  if (margin[2] === "pt") return value;
  if (margin[2] === "px") return value * 0.75;
  if (margin[2] === "rem" || margin[2] === "em") return value * 12;
  return 0;
}

function isIndentedListParagraph(html: string): boolean {
  if (/MsoListParagraph|docs-internal|list-style-type/i.test(html)) return true;
  return getParagraphIndent(html) >= 18;
}

function isNumberedSectionHeading(html: string): boolean {
  const inner = paragraphInner(html);
  if (!inner) return false;

  const text = stripTags(inner);
  if (!ORDERED_PREFIX.test(text)) return false;

  const title = stripListPrefix(text);
  if (title.length < 12 || title.length > 130) return false;

  const words = title.split(/\s+/).length;
  return words <= 16;
}

function isShortOrderedStep(html: string): boolean {
  const inner = paragraphInner(html);
  if (!inner) return false;

  const text = stripTags(inner);
  if (!ORDERED_PREFIX.test(text)) return false;

  const step = stripListPrefix(text);
  return step.length > 0 && step.length < 85;
}

function promoteNumberedParagraphToH2(html: string): string {
  const inner = paragraphInner(html);
  if (!inner) return html;

  const text = stripTags(inner);
  const number = text.match(ORDERED_PREFIX)?.[1] || "";
  const title = stripListPrefix(text);
  const cleaned = stripListPrefixFromHtml(inner);

  return `<h2 class="blog-section-heading"><span class="blog-section-heading__num">${number}</span><span>${title || cleaned}</span></h2>`;
}

function paragraphToListItem(html: string): string {
  const inner = paragraphInner(html);
  if (!inner) return "";
  return `<li>${stripListPrefixFromHtml(inner)}</li>`;
}

function convertIndentedParagraph(html: string): string {
  const inner = paragraphInner(html);
  if (!inner) return html;
  return `<li>${stripListPrefixFromHtml(inner)}</li>`;
}

function convertBrListParagraph(html: string): string {
  const inner = paragraphInner(html);
  if (!inner || !/<br\s*\/?>/i.test(inner)) return html;

  const parts = inner
    .split(/<br\s*\/?>/i)
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length < 2) return html;

  if (parts.every((part) => isBulletLine(part))) {
    return `<ul class="blog-list">${parts.map((part) => `<li>${stripListPrefixFromHtml(part)}</li>`).join("")}</ul>`;
  }

  if (parts.every((part) => isOrderedLine(part))) {
    return `<ol class="blog-list blog-list--ordered">${parts.map((part) => `<li>${stripListPrefixFromHtml(part)}</li>`).join("")}</ol>`;
  }

  return html;
}

function wrapBareTables(html: string): string {
  const placeholders: string[] = [];
  let protectedHtml = html.replace(
    /<div class="blog-table-wrap">[\s\S]*?<\/div>/gi,
    (match) => {
      placeholders.push(match);
      return `__TABLE_WRAP_${placeholders.length - 1}__`;
    }
  );

  protectedHtml = protectedHtml.replace(
    /<table(\s[^>]*)?>([\s\S]*?)<\/table>/gi,
    (tableHtml) => {
      const inner = tableHtml.replace(/^<table[^>]*>/i, "").replace(/<\/table>$/i, "");
      const hasClass = /class=["'][^"']*blog-table/.test(tableHtml);
      const openTag = hasClass
        ? tableHtml.match(/^<table[^>]*>/i)?.[0] || '<table class="blog-table">'
        : '<table class="blog-table">';
      return `<div class="blog-table-wrap">${openTag}${inner}</table></div>`;
    }
  );

  return placeholders.reduce(
    (result, block, index) => result.replace(`__TABLE_WRAP_${index}__`, block),
    protectedHtml
  );
}

function protectEditorBlocks(html: string): { html: string; blocks: string[] } {
  const blocks: string[] = [];
  let protectedHtml = html;

  const protect = (pattern: RegExp) => {
    protectedHtml = protectedHtml.replace(pattern, (match) => {
      const token = `<!--EDITOR_BLOCK_${blocks.length}-->`;
      blocks.push(match);
      return token;
    });
  };

  protect(
    /<div class="blog-faq">\s*(?:<details class="blog-faq__item">[\s\S]*?<\/details>\s*)*<\/div>/gi
  );
  protect(/<div class="blog-table-wrap">[\s\S]*?<\/div>/gi);
  protect(/<figure class="blog-image[^"]*">[\s\S]*?<\/figure>/gi);
  protect(/<ul class="blog-list"[^>]*>[\s\S]*?<\/ul>/gi);
  protect(/<ol class="blog-list[^"]*"[^>]*>[\s\S]*?<\/ol>/gi);

  return { html: protectedHtml, blocks };
}

function restoreEditorBlocks(html: string, blocks: string[]): string {
  return blocks.reduce(
    (result, block, index) => result.replace(`<!--EDITOR_BLOCK_${index}-->`, block),
    html
  );
}

function splitBlocks(html: string): string[] {
  const blocks: string[] = [];
  const pattern =
    /<(?:p|h[1-6]|ul|ol|table|blockquote|figure|details|div|hr)\b[^>]*>[\s\S]*?<\/(?:p|h[1-6]|ul|ol|table|blockquote|figure|details|div)>|<hr\s*\/?>/gi;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(html)) !== null) {
    if (match.index > lastIndex) {
      const gap = html.slice(lastIndex, match.index).trim();
      if (gap) blocks.push(gap);
    }
    blocks.push(match[0]);
    lastIndex = pattern.lastIndex;
  }

  const tail = html.slice(lastIndex).trim();
  if (tail) blocks.push(tail);

  return blocks.length ? blocks : [html];
}

function groupListParagraphs(blocks: string[]): string[] {
  const output: string[] = [];
  let index = 0;

  while (index < blocks.length) {
    const block = blocks[index];
    const inner = paragraphInner(block);

    if (!inner) {
      output.push(block);
      index += 1;
      continue;
    }

    if (isIndentedListParagraph(block)) {
      const items: string[] = [convertIndentedParagraph(block)];
      index += 1;

      while (index < blocks.length) {
        const next = blocks[index];
        const nextInner = paragraphInner(next);
        if (!nextInner) break;
        if (!isIndentedListParagraph(next) && !isBulletLine(nextInner)) break;
        items.push(convertIndentedParagraph(next));
        index += 1;
      }

      output.push(`<ul class="blog-list">${items.join("")}</ul>`);
      continue;
    }

    if (isNumberedSectionHeading(block)) {
      const upcoming: string[] = [];
      let cursor = index + 1;
      while (cursor < blocks.length) {
        const nextInner = paragraphInner(blocks[cursor]);
        if (!nextInner || !isShortOrderedStep(blocks[cursor])) break;
        upcoming.push(blocks[cursor]);
        cursor += 1;
      }

      if (upcoming.length >= 2) {
        const items = [block, ...upcoming].map(paragraphToListItem).join("");
        output.push(`<ol class="blog-list blog-list--ordered">${items}</ol>`);
        index += upcoming.length + 1;
        continue;
      }

      output.push(promoteNumberedParagraphToH2(block));
      index += 1;
      continue;
    }

    if (!isBulletLine(inner) && !isOrderedLine(inner)) {
      output.push(convertBrListParagraph(block));
      index += 1;
      continue;
    }

    const ordered = isOrderedLine(inner);
    const items: string[] = [];

    while (index < blocks.length) {
      const current = blocks[index];
      const currentInner = paragraphInner(current);
      if (!currentInner) break;
      if (ordered ? !isOrderedLine(currentInner) : !isBulletLine(currentInner)) break;
      items.push(paragraphToListItem(current));
      index += 1;
    }

    output.push(
      ordered
        ? `<ol class="blog-list blog-list--ordered">${items.join("")}</ol>`
        : `<ul class="blog-list">${items.join("")}</ul>`
    );
  }

  return output;
}

export function prepareMarkdownSource(content: string): string {
  return content
    .split("\n")
    .map((line) => {
      const trimmed = line.trim();
      if (BULLET_PREFIX.test(trimmed)) {
        return `- ${stripListPrefix(trimmed)}`;
      }
      if (ORDERED_PREFIX.test(trimmed)) {
        return `${trimmed.match(ORDERED_PREFIX)?.[1]}. ${stripListPrefix(trimmed)}`;
      }
      return line;
    })
    .join("\n");
}

function cleanStyleAttribute(style: string): string {
  return style
    .split(";")
    .map((part) => part.trim())
    .filter((part) => {
      if (!part) return false;
      const key = part.split(":")[0]?.trim().toLowerCase();
      if (!key) return false;
      if (key === "color") return false;
      if (key === "background" || key === "background-color") return false;
      return true;
    })
    .join("; ");
}

/** Remove pasted Word/Docs inline colors — use HL (highlight) for emphasis instead. */
export function stripInlineColors(html: string): string {
  return html
    .replace(/style="([^"]*)"/gi, (_match, style: string) => {
      const cleaned = cleanStyleAttribute(style);
      return cleaned ? `style="${cleaned}"` : "";
    })
    .replace(/style='([^']*)'/gi, (_match, style: string) => {
      const cleaned = cleanStyleAttribute(style);
      return cleaned ? `style='${cleaned}'` : "";
    })
    .replace(/\s*style=["']\s*["']/gi, "")
    .replace(/<font\b[^>]*>/gi, "")
    .replace(/<\/font>/gi, "");
}

function lightNormalizeEditorBlocks(blocks: string[]): string[] {
  return blocks.map((block) => {
    const inner = paragraphInner(block);
    if (!inner) return block;
    return convertBrListParagraph(block);
  });
}

/** Aggressive list grouping for pasted Word/Docs HTML — not used on live editor saves. */
export function normalizePastedArticleHtml(html: string): string {
  if (!html.trim()) return html;

  const normalized = html
    .replace(/\u00a0/g, " ")
    .replace(/<br class="Apple-interchange-newline">/gi, "<br>")
    .trim();

  const { html: protectedHtml, blocks } = protectEditorBlocks(normalized);
  const processed = groupListParagraphs(splitBlocks(protectedHtml));
  const restored = restoreEditorBlocks(processed.join("\n"), blocks);
  return wrapBareTables(restored);
}

/** Ensure inline article links get a consistent class for editor + public styling. */
export function stampArticleLinks(html: string): string {
  return html.replace(/<a(\s[^>]*)?>/gi, (match) => {
    if (/blog-image__link|blog-toc__link/.test(match)) return match;
    if (/blog-link/.test(match)) return match;
    if (/class="/i.test(match)) {
      return match.replace(/class="/i, 'class="blog-link ');
    }
    if (/class='/i.test(match)) {
      return match.replace(/class='/i, "class='blog-link ");
    }
    return match.replace("<a", '<a class="blog-link"');
  });
}

export function normalizeArticleHtml(html: string): string {
  if (!html.trim()) return html;

  const normalized = stripInlineColors(
    html
      .replace(/\u00a0/g, " ")
      .replace(/<br class="Apple-interchange-newline">/gi, "<br>")
      .trim()
  );

  const { html: protectedHtml, blocks } = protectEditorBlocks(normalized);
  const processed = lightNormalizeEditorBlocks(splitBlocks(protectedHtml));
  const restored = restoreEditorBlocks(processed.join("\n"), blocks);
  return stampArticleLinks(repairArticleLinkHrefs(wrapBareTables(restored)));
}
