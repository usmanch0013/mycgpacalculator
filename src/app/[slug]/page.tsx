import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogArticleView from "@/components/blog/BlogArticleView";
import { getCategories, resolvePostCategories } from "@/lib/blog/categories";
import { getPostBySlug, getPublishedPosts } from "@/lib/blog/storage";
import { renderMarkdown } from "@/lib/blog/markdown";
import { prepareArticleHtml } from "@/lib/blog/toc";
import { BLOG_CONFIG } from "@/lib/blog/config";
import { getPostPath, isReservedSlug } from "@/lib/blog/paths";
import { getPopularCalculatorLinks } from "@/lib/internalLinks";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  if (isReservedSlug(slug)) return { title: "Page" };

  const post = await getPostBySlug(slug);
  if (!post || post.status !== "published") return { title: "Article" };

  const canonical = `${BLOG_CONFIG.siteUrl}${getPostPath(slug)}`;
  const keywords = [post.focusKeyword, ...(post.secondaryKeywords ?? [])]
    .map((keyword) => keyword.trim())
    .filter(Boolean);

  return {
    title: post.title,
    description: post.metaDescription || post.excerpt,
    keywords: keywords.length ? keywords : undefined,
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

  const [allPosts, categories] = await Promise.all([
    getPublishedPosts(),
    getCategories(),
  ]);
  const rendered = renderMarkdown(post.content);
  const { html, toc } = prepareArticleHtml(rendered);
  const resolvedCategories = resolvePostCategories(post.categories, categories);
  const recentPosts = allPosts.filter((item) => item.slug !== slug).slice(0, 5);
  const calculators = getPopularCalculatorLinks(6);

  return (
    <>
      <Navbar />
      <BlogArticleView
        title={post.title}
        slug={post.slug}
        excerpt={post.excerpt}
        author={post.author}
        featuredImage={post.featuredImage}
        featuredImageAlt={post.featuredImageAlt}
        featuredImageTitle={post.featuredImageTitle}
        featuredImageDescription={post.featuredImageDescription}
        html={html}
        content={post.content}
        publishedAt={post.publishedAt}
        categories={resolvedCategories}
        toc={toc}
        recentPosts={recentPosts}
        calculators={calculators}
      />
      <Footer />
    </>
  );
}
