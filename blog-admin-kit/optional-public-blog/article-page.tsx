import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublishedPosts, getPostBySlug } from "@/lib/blog/storage";
import { renderMarkdown, estimateReadingTime } from "@/lib/blog/markdown";
import { analyzeSeo } from "@/lib/blog/seo-score";
import { SITE } from "@/lib/content";
import { getPostPath } from "@/lib/blog/paths";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post || post.status !== "published") return { title: "Article" };

  const canonical = `${SITE.url}${getPostPath(slug)}`;

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
    <article className="blog-article">
      <nav className="breadcrumb breadcrumb--tool" aria-label="Breadcrumb">
        <div className="site-container">
          <ol className="breadcrumb__list">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/blog">Blog</Link></li>
            <li aria-current="page">{post.title}</li>
          </ol>
        </div>
      </nav>

      <header className="blog-article__header">
        <div className="site-container">
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
            {new Date(post.publishedAt).toLocaleDateString("en-AU", {
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

      <div className="site-container blog-article__body">
        <div
          className="blog-article__prose"
          dangerouslySetInnerHTML={{ __html: html }}
        />

        <footer className="blog-article__footer">
          <p>
            Use our{" "}
            <Link href="/">salary after tax calculator</Link> or browse{" "}
            <Link href="/calculators">all free tools</Link>.
          </p>
        </footer>
      </div>
    </article>
  );
}
