import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getPublishedPosts, getPostBySlug } from "@/lib/blog/storage";
import { renderMarkdown, estimateReadingTime } from "@/lib/blog/markdown";
import { analyzeSeo } from "@/lib/blog/seo-score";
import { BLOG_CONFIG } from "@/lib/blog/config";
import { getPostPath, isReservedSlug } from "@/lib/blog/paths";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  if (isReservedSlug(slug)) return { title: "Page" };

  const post = await getPostBySlug(slug);
  if (!post || post.status !== "published") return { title: "Article" };

  const canonical = `${BLOG_CONFIG.siteUrl}${getPostPath(slug)}`;

  return {
    title: post.title,
    description: post.metaDescription || post.excerpt,
    keywords: post.focusKeyword ? [post.focusKeyword] : undefined,
    alternates: { canonical },
    openGraph: {
      title: post.title,
      description: post.metaDescription || post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      url: canonical,
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  if (isReservedSlug(slug)) notFound();

  const post = await getPostBySlug(slug);
  if (!post || post.status !== "published") notFound();

  const html = renderMarkdown(post.content);
  const seo = analyzeSeo(
    post.title,
    post.slug,
    post.metaDescription,
    post.focusKeyword,
    post.content,
    { excerpt: post.excerpt, featuredImage: post.featuredImage }
  );
  const readingMin = estimateReadingTime(seo.wordCount);

  return (
    <>
      <Navbar />
      <main id="main-content" className="blog-article">
        <div className="container" style={{ paddingTop: "1.5rem" }}>
          <Breadcrumbs
            items={[
              { href: "/", label: "Home" },
              { href: "/blog", label: "Blog" },
              { label: post.title },
            ]}
          />
        </div>

        <header className="blog-article__header">
          <div className="container">
            {post.featuredImage && (
              <div className="blog-article__hero-image">
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  width={1200}
                  height={630}
                />
              </div>
            )}
            <time className="blog-article__date" dateTime={post.publishedAt}>
              {new Date(post.publishedAt).toLocaleDateString("en-US", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </time>
            <h1 className="blog-article__title">{post.title}</h1>
            <p className="blog-article__meta">
              By {post.author} · {readingMin} min read
            </p>
            {post.excerpt && (
              <p className="blog-article__excerpt">{post.excerpt}</p>
            )}
          </div>
        </header>

        <div className="container blog-article__body">
          <div
            className="blog-article__prose"
            dangerouslySetInnerHTML={{ __html: html }}
          />

          <footer className="blog-article__footer">
            <p>
              Use our{" "}
              <Link href="/">free CGPA calculator</Link> or browse{" "}
              <Link href="/universities">university grading guides</Link>.
            </p>
          </footer>
        </div>
      </main>
      <Footer />
    </>
  );
}
