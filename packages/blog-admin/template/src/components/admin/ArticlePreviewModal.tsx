"use client";

import { renderMarkdown, estimateReadingTime } from "@/lib/blog/markdown";
import { getPostPath } from "@/lib/blog/paths";
import { BLOG_CONFIG } from "@/lib/blog/config";
import { analyzeSeo } from "@/lib/blog/seo-score";

interface ArticlePreviewModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  featuredImage: string;
}

export default function ArticlePreviewModal({
  open,
  onClose,
  title,
  slug,
  content,
  excerpt,
  author,
  featuredImage,
}: ArticlePreviewModalProps) {
  if (!open) return null;

  const html = renderMarkdown(content);
  const seo = analyzeSeo(title, slug, excerpt, "", content, { excerpt, featuredImage });
  const readingMin = estimateReadingTime(seo.wordCount);
  const displayTitle = title.trim() || "Untitled article";
  const path = slug.trim() ? getPostPath(slug) : "/your-article-slug";

  return (
    <div className="article-preview-backdrop" onClick={onClose} role="presentation">
      <div
        className="article-preview"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="article-preview-title"
      >
        <header className="article-preview__chrome">
          <div>
            <p className="article-preview__label">Article preview</p>
            <p className="article-preview__url">{path}</p>
          </div>
          <button type="button" className="article-preview__close" onClick={onClose}>
            Close preview
          </button>
        </header>

        <div className="article-preview__page">
          <article className="blog-article article-preview__article">
            <header className="blog-article__header article-preview__header">
              {featuredImage && (
                <div className="blog-article__hero-image">
                  <img src={featuredImage} alt={displayTitle} />
                </div>
              )}
              <time className="blog-article__date" dateTime={new Date().toISOString()}>
                {new Date().toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </time>
              <h1 id="article-preview-title" className="blog-article__title">
                {displayTitle}
              </h1>
              <p className="blog-article__meta">
                By {author || BLOG_CONFIG.defaultAuthor} · {readingMin} min read
              </p>
              {excerpt.trim() && <p className="blog-article__excerpt">{excerpt}</p>}
            </header>

            <div className="blog-article__body article-preview__body">
              <div
                className="blog-article__prose"
                dangerouslySetInnerHTML={{ __html: html || "<p>Start writing to see your article preview.</p>" }}
              />
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
