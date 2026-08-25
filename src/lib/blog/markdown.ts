import { marked } from "marked";

marked.setOptions({
  gfm: true,
  breaks: true,
});

export function renderMarkdown(content: string): string {
  return marked.parse(content) as string;
}

export function estimateReadingTime(wordCount: number): number {
  return Math.max(1, Math.ceil(wordCount / 200));
}
