import type { Metadata } from "next";
import Link from "next/link";
import { getPostPath } from "@/lib/blog/paths";
import { getPublishedPosts } from "@/lib/blog/storage";
import { SITE } from "@/lib/content";

export const metadata: Metadata = {
  title: "Blog — Salary, Tax & Pay Tips for Australia",
  description:
    "Articles on Australian salary after tax, PAYG, HECS, super and everyday pay questions — from AU Salary After Tax.",
  alternates: { canonical: `${SITE.url}/blog` },
};

export default async function BlogIndexPage() {
  const posts = await getPublishedPosts();

  return (
    <div className="blog-index">
      <section className="page-hero-bar">
        <div className="site-container page-hero-bar__inner">
          <div className="page-hero-bar__content">
            <span className="page-hero-bar__badge">Blog</span>
            <h1 className="page-hero-bar__title">Salary &amp; tax articles</h1>
            <p className="page-hero-bar__subtitle">
              Practical guides on take-home pay, tax brackets, HECS and super —
              written for Aussie workers.
            </p>
          </div>
        </div>
      </section>

      <section className="site-section">
        <div className="site-container">
          {posts.length === 0 ? (
            <p className="blog-index__empty">New articles coming soon.</p>
          ) : (
            <div className="blog-grid">
              {posts.map((post) => (
                <article key={post.id} className="blog-card">
                  <Link href={getPostPath(post.slug)} className="blog-card__link">
                    {post.featuredImage && (
                      <div className="blog-card__image">
                        <img src={post.featuredImage} alt="" />
                      </div>
                    )}
                    <time
                      className="blog-card__date"
                      dateTime={post.publishedAt}
                    >
                      {new Date(post.publishedAt).toLocaleDateString("en-AU", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </time>
                    <h2 className="blog-card__title">{post.title}</h2>
                    <p className="blog-card__excerpt">{post.excerpt}</p>
                    <span className="blog-card__cta">Read article →</span>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
