import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import BlogArticleSidebar from "@/components/blog/BlogArticleSidebar";
import BlogStickyColumn from "@/components/blog/BlogStickyColumn";
import BlogTableOfContents from "@/components/blog/BlogTableOfContents";
import { getPostPath } from "@/lib/blog/paths";
import type { TocItem } from "@/lib/blog/toc";
import type { BlogPost } from "@/lib/blog/types";
import "@/styles/blog-public.css";

interface SidebarLink {
  href: string;
  label: string;
}

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
  toc?: TocItem[];
  recentPosts?: BlogPost[];
  calculators?: SidebarLink[];
}

export default function BlogArticleView({
  title,
  slug,
  excerpt = "",
  featuredImage = "",
  featuredImageAlt = "",
  featuredImageDescription = "",
  html,
  categories = [],
  toc = [],
  recentPosts = [],
  calculators = [],
}: BlogArticleViewProps) {
  const displayTitle = title.trim() || "Untitled article";
  const imageCaption = featuredImageDescription.trim();

  return (
    <main id="main-content" className="blog-article">
      <header className="blog-article__banner">
        <div className="blog-article__shell">
          <div className="blog-article__topbar-inner">
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

          {excerpt.trim() && <p className="blog-article__excerpt">{excerpt}</p>}
        </div>
      </header>

      <div className="blog-article__shell blog-article__layout">
        <BlogStickyColumn className="blog-article__sidebar-left" aria-label="Table of contents">
          <BlogTableOfContents items={toc} />
        </BlogStickyColumn>

        <article className="blog-article__main">
          {featuredImage && (
            <figure className="blog-article__lead-media">
              <img
                src={featuredImage}
                alt={featuredImageAlt || displayTitle}
                loading="eager"
              />
              {imageCaption && (
                <figcaption className="blog-article__lead-media-caption">{imageCaption}</figcaption>
              )}
            </figure>
          )}

          <div
            className="blog-article__prose"
            dangerouslySetInnerHTML={{
              __html: html || "<p>Start writing to see your article preview.</p>",
            }}
          />

          <footer className="blog-article__footer">
            <Link href="/blog" className="blog-article__footer-link">
              ← Back to all articles
            </Link>
            {slug ? (
              <Link href={getPostPath(slug)} className="blog-article__footer-share">
                Share this guide
              </Link>
            ) : null}
          </footer>
        </article>

        <BlogStickyColumn className="blog-article__sidebar-right" aria-label="Related links">
          <BlogArticleSidebar recentPosts={recentPosts} calculators={calculators} />
        </BlogStickyColumn>
      </div>
    </main>
  );
}
