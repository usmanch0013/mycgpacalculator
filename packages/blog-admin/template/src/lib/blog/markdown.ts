import { marked } from "marked";
import { normalizeArticleHtml, prepareMarkdownSource } from "@/lib/blog/article-html";

marked.setOptions({
  gfm: true,
  breaks: true,
});

function isHtmlContent(source: string): boolean {
  return /<\s*(p|ul|ol|li|h[1-6]|blockquote|table|div|mark|strong|em|hr|figure|details|thead|tbody|tr|td|th)\b/i.test(
    source
  );
}

export function renderMarkdown(content: string): string {
  if (!content.trim()) return "";

  if (isHtmlContent(content)) {
    return normalizeArticleHtml(
      content
        .replace(/\u00a0/g, " ")
        .replace(/<br class="Apple-interchange-newline">/gi, "")
        .trim()
    );
  }

  const parsed = marked.parse(prepareMarkdownSource(content), { async: false }) as string;
  return normalizeArticleHtml(parsed);
}

export function estimateReadingTime(wordCount: number): number {
  return Math.max(1, Math.ceil(wordCount / 200));
}
