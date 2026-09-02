import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getPostPath } from "@/lib/blog/paths";
import { getPublishedPosts } from "@/lib/blog/storage";
import { BLOG_CONFIG } from "@/lib/blog/config";
import "@/styles/blog-public.css";

export const metadata: Metadata = {
  title: "Blog — CGPA, GPA & Grading Guides",
  description:
    "Articles on CGPA calculation, GPA conversion, university grading scales, and student tips from CGPA Calculator Pro.",
  alternates: { canonical: `${BLOG_CONFIG.siteUrl}/blog` },
};

export default async function BlogIndexPage() {
  const posts = await getPublishedPosts();

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
          </div>
        </header>

        <div className="container page-body">
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
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
