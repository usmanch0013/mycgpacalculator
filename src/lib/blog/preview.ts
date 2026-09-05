export const ARTICLE_PREVIEW_STORAGE_KEY = "cgpa-blog-article-preview";

export interface ArticlePreviewPayload {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  featuredImage: string;
  featuredImageAlt?: string;
  featuredImageTitle?: string;
  featuredImageDescription?: string;
  categories?: string[];
}

export function saveArticlePreview(payload: ArticlePreviewPayload) {
  if (typeof window === "undefined") return;
  localStorage.setItem(ARTICLE_PREVIEW_STORAGE_KEY, JSON.stringify(payload));
}

export function loadArticlePreview(): ArticlePreviewPayload | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(ARTICLE_PREVIEW_STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as ArticlePreviewPayload;
  } catch {
    return null;
  }
}
