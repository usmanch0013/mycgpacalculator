"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogArticleView from "@/components/blog/BlogArticleView";
import { renderMarkdown } from "@/lib/blog/markdown";
import { getPostPath } from "@/lib/blog/paths";
import { ARTICLE_PREVIEW_STORAGE_KEY, loadArticlePreview, type ArticlePreviewPayload } from "@/lib/blog/preview";

export default function AdminArticlePreviewPage() {
  const [data, setData] = useState<ArticlePreviewPayload | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    function readPreview() {
      setData(loadArticlePreview());
      setReady(true);
    }

    readPreview();

    function onStorage(event: StorageEvent) {
      if (event.key !== ARTICLE_PREVIEW_STORAGE_KEY || !event.newValue) return;
      try {
        setData(JSON.parse(event.newValue) as ArticlePreviewPayload);
      } catch {
        setData(null);
      }
    }

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const html = useMemo(() => (data ? renderMarkdown(data.content) : ""), [data]);
  const path = data?.slug.trim() ? getPostPath(data.slug) : "/your-article-slug";

  if (!ready) {
    return null;
  }

  if (!data) {
    return (
      <>
        <Navbar />
        <main className="container" style={{ padding: "4rem 1rem", minHeight: "50vh" }}>
          <h1 style={{ marginBottom: "0.75rem" }}>No preview available</h1>
          <p style={{ marginBottom: "1.25rem", color: "var(--stone-600)" }}>
            Open the editor and click Preview to view your article as a full page.
          </p>
          <Link href="/admin">Back to admin</Link>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <div className="admin-article-preview-banner" role="status">
        <div className="admin-article-preview-banner__inner container">
          <div>
            <strong>Article preview</strong>
            <span className="admin-article-preview-banner__url">{path}</span>
          </div>
          <div className="admin-article-preview-banner__actions">
            <button type="button" className="admin-article-preview-banner__btn" onClick={() => window.close()}>
              Close tab
            </button>
            <Link href="/admin" className="admin-article-preview-banner__btn admin-article-preview-banner__btn--ghost">
              Back to editor
            </Link>
          </div>
        </div>
      </div>

      <Navbar />
      <BlogArticleView
        title={data.title}
        slug={data.slug}
        excerpt={data.excerpt}
        author={data.author}
        featuredImage={data.featuredImage}
        featuredImageAlt={data.featuredImageAlt}
        featuredImageTitle={data.featuredImageTitle}
        featuredImageDescription={data.featuredImageDescription}
        html={html}
        content={data.content}
        publishedAt={new Date().toISOString()}
        categories={(data.categories ?? []).map((slug) => ({
          slug,
          name: slug.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase()),
        }))}
      />
      <Footer />
    </>
  );
}
