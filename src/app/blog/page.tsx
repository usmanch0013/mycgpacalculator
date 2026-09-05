import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getPostPath } from "@/lib/blog/paths";
import { getCategories, resolvePostCategories } from "@/lib/blog/categories";
import { getPublishedPosts } from "@/lib/blog/storage";
import { BLOG_CONFIG } from "@/lib/blog/config";
import "@/styles/blog-public.css";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Blog — CGPA, GPA & Grading Guides",
  description:
    "Articles on CGPA calculation, GPA conversion, university grading scales, and student tips from CGPA Calculator Pro.",
  alternates: { canonical: `${BLOG_CONFIG.siteUrl}/blog` },
};

export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category: categorySlug } = await searchParams;
  const [posts, catalog] = await Promise.all([getPublishedPosts(), getCategories()]);
  const activeCategory = catalog.find((category) => category.slug === categorySlug) ?? null;
  const visible = activeCategory
    ? posts.filter((post) => (post.categories ?? []).includes(activeCategory.slug))
    : posts;

  return (
    <>
      <Navbar />
      <main id="main-content" className="page-shell">
        <header className="page-hero">
          <div className="container">
            <h1 className="page-hero-title">CGPA &amp; GPA guides</h1>
            <p className="page-hero-subtitle">
              Practical articles on calculating CGPA, converting grades to
              percentage, and understanding university grading systems worldwide.
            </p>
            {catalog.length > 0 && (
              <div className="blog-index__cats">
                <Link
                  href="/blog"
                  className={`blog-cat ${!activeCategory ? "blog-cat--active" : ""}`}
                >
                  All
                </Link>
                {catalog.map((category) => (
                  <Link
                    key={category.slug}
                    href={`/blog?category=${category.slug}`}
                    className={`blog-cat ${activeCategory?.slug === category.slug ? "blog-cat--active" : ""}`}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </header>

        <div className="container page-body">
          {visible.length === 0 ? (
            <p className="blog-index__empty">
              {activeCategory ? `No articles in ${activeCategory.name} yet.` : "New articles coming soon."}
            </p>
          ) : (
            <div className="blog-grid">
              {visible.map((post) => {
                const categories = resolvePostCategories(post.categories, catalog);
                return (
                <article key={post.id} className="blog-card">
                  <Link href={getPostPath(post.slug)} className="blog-card__link">
                    {post.featuredImage && (
                      <div className="blog-card__image">
                        <img src={post.featuredImage} alt={post.featuredImageAlt || post.title} />
                      </div>
                    )}
                    {categories.length > 0 && (
                      <div className="blog-card__cats">
                        {categories.map((category) => (
                          <span key={category.slug} className="blog-cat">
                            {category.name}
                          </span>
                        ))}
                      </div>
                    )}
                    <time
                      className="blog-card__date"
                      dateTime={post.publishedAt}
                    >
                      {new Date(post.publishedAt).toLocaleDateString("en-US", {
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
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
