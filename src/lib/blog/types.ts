export type PostStatus = "draft" | "published";

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  focusKeyword: string;
  metaDescription: string;
  excerpt: string;
  content: string;
  status: PostStatus;
  publishedAt: string;
  updatedAt: string;
  author: string;
  featuredImage?: string;
}

export interface BlogPostInput {
  slug: string;
  title: string;
  focusKeyword: string;
  metaDescription: string;
  excerpt: string;
  content: string;
  status: PostStatus;
  publishedAt?: string;
  author?: string;
  featuredImage?: string;
}

export type SeoCheckStatus = "good" | "ok" | "bad";
export type SeoCheckCategory =
  | "basic"
  | "additional"
  | "title_readability"
  | "content_readability";

export interface SeoCheck {
  id: string;
  label: string;
  status: SeoCheckStatus;
  message: string;
  weight: number;
  category: SeoCheckCategory;
}

export interface SeoScoreResult {
  score: number;
  checks: SeoCheck[];
  wordCount: number;
  goodCount: number;
  okCount: number;
  badCount: number;
}
