import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import { estimateReadingTime } from "@/lib/blog/markdown";
import { analyzeSeo } from "@/lib/blog/seo-score";
import "@/styles/blog-public.css";

interface BlogArticleViewProps {
  title: string;
  slug: string;
  excerpt?: string;
  author: string;
  featuredImage?: string;
  html: string;
  content: string;
  publishedAt: string;
}

export default function BlogArticleView({
  title,
  slug,
  excerpt = "",
  author,
  featuredImage = "",
  html,
  content,
  publishedAt,
}: BlogArticleViewProps) {
  const seo = analyzeSeo(title, slug, excerpt, "", content, {
    excerpt,
    featuredImage,
  });
  const readingMin = estimateReadingTime(seo.wordCount);
  const displayTitle = title.trim() || "Untitled article";

  return (
    <main id="main-content" className="blog-article">
      <div className="container" style={{ paddingTop: "1.5rem" }}>
        <Breadcrumbs
          items={[
            { href: "/", label: "Home" },
            { href: "/blog", label: "Blog" },
            { label: displayTitle },
          ]}
        />
      </div>

      <header className="blog-article__header">
        <div className="container">
          {featuredImage && (
            <div className="blog-article__hero-image">
              <img src={featuredImage} alt={displayTitle} width={1200} height={630} />
            </div>
          )}
          <time className="blog-article__date" dateTime={publishedAt}>
            {new Date(publishedAt).toLocaleDateString("en-US", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </time>
          <h1 className="blog-article__title">{displayTitle}</h1>
          <p className="blog-article__meta">
            By {author || "CGPA Calculator Pro"} · {readingMin} min read
          </p>
          {excerpt.trim() && <p className="blog-article__excerpt">{excerpt}</p>}
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

          <footer className="blog-article__footer">
            <p>
              Use our <Link href="/">free CGPA calculator</Link> or browse{" "}
              <Link href="/universities">university grading guides</Link>.
            </p>
          </footer>
        </article>
      </div>
    </main>
  );
}
