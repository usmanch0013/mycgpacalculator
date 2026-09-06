import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import { estimateReadingTime } from "@/lib/blog/markdown";
import { analyzeSeo } from "@/lib/blog/seo-score";
import { getPostPath } from "@/lib/blog/paths";
import { BLOG_CONFIG } from "@/lib/blog/config";
import "@/styles/blog-public.css";

interface BlogArticleViewProps {
  title: string;
  slug: string;
  excerpt?: string;
  author: string;
  featuredImage?: string;
  featuredImageAlt?: string;
  featuredImageTitle?: string;
  featuredImageDescription?: string;
  html: string;
  content: string;
  publishedAt: string;
  categories?: Array<{ slug: string; name: string }>;
}

function authorInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "CP";
  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export default function BlogArticleView({
  title,
  slug,
  excerpt = "",
  author,
  featuredImage = "",
  featuredImageAlt = "",
  featuredImageTitle = "",
  featuredImageDescription = "",
  html,
  content,
  publishedAt,
  categories = [],
}: BlogArticleViewProps) {
  const seo = analyzeSeo(title, slug, excerpt, "", content, {
    excerpt,
    featuredImage,
    featuredImageAlt,
  });
  const readingMin = estimateReadingTime(seo.wordCount);
  const displayTitle = title.trim() || "Untitled article";
  const displayAuthor = author.trim() || BLOG_CONFIG.defaultAuthor;
  const formattedDate = new Date(publishedAt).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <main id="main-content" className="blog-article">
      <div className="blog-article__topbar">
        <div className="container blog-article__topbar-inner">
          <Breadcrumbs
            items={[
              { href: "/", label: "Home" },
              { href: "/blog", label: "Blog" },
              { label: displayTitle },
            ]}
          />
          <Link href="/blog" className="blog-article__back">
            ← All articles
          </Link>
        </div>
      </div>

      <header className={`blog-article__hero${featuredImage ? " blog-article__hero--image" : ""}`}>
        {featuredImage && (
          <div className="blog-article__hero-media">
            <img
              src={featuredImage}
              alt={featuredImageAlt || displayTitle}
              title={featuredImageTitle || undefined}
            />
            <span className="blog-article__hero-overlay" />
          </div>
        )}

        <div className="container blog-article__hero-content">
          <span className="blog-article__kicker">
            {categories[0]?.name || "CGPA & GPA Guide"}
          </span>
          {categories.length > 0 && (
            <div className="blog-article__cats">
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/blog?category=${category.slug}`}
                  className="blog-cat"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          )}
          <h1 className="blog-article__title">{displayTitle}</h1>
          {featuredImageDescription.trim() && (
            <p className="blog-article__image-desc">{featuredImageDescription}</p>
          )}

          {excerpt.trim() && <p className="blog-article__excerpt">{excerpt}</p>}

          <div className="blog-article__meta-bar">
            <div className="blog-article__author">
              <span className="blog-article__avatar" aria-hidden="true">
                {authorInitials(displayAuthor)}
              </span>
              <div>
                <strong>{displayAuthor}</strong>
                <time dateTime={publishedAt}>{formattedDate}</time>
              </div>
            </div>

            <div className="blog-article__stats">
              <span className="blog-article__stat">
                <strong>{readingMin}</strong> min read
              </span>
              <span className="blog-article__stat">
                <strong>{seo.wordCount.toLocaleString()}</strong> words
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="container blog-article__body">
        <article className="blog-article__card">
          <div
            className="blog-article__prose"
            dangerouslySetInnerHTML={{
              __html: html || "<p>Start writing to see your article preview.</p>",
            }}
          />
        </article>

        <aside className="blog-article__cta-grid" aria-label="Helpful tools">
          <Link href="/" className="blog-article__cta-card blog-article__cta-card--primary">
            <span className="blog-article__cta-label">Free tool</span>
            <strong>Calculate your CGPA</strong>
            <span className="blog-article__cta-arrow">Open calculator →</span>
          </Link>
          <Link href="/universities" className="blog-article__cta-card">
            <span className="blog-article__cta-label">60+ scales</span>
            <strong>University grading guides</strong>
            <span className="blog-article__cta-arrow">Browse universities →</span>
          </Link>
          <Link href="/universities/bangladesh" className="blog-article__cta-card">
            <span className="blog-article__cta-label">Regional</span>
            <strong>Bangladesh university guides</strong>
            <span className="blog-article__cta-arrow">Browse guides →</span>
          </Link>
        </aside>

        <footer className="blog-article__footer">
          <p>
            Published on <time dateTime={publishedAt}>{formattedDate}</time>
            {slug ? (
              <>
                {" "}
                · Permalink:{" "}
                <Link href={getPostPath(slug)}>{getPostPath(slug)}</Link>
              </>
            ) : null}
          </p>
          <Link href="/blog" className="blog-article__footer-link">
            ← Back to all articles
          </Link>
        </footer>
      </div>
    </main>
  );
}
