"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ArticleTitleField from "@/components/admin/ArticleTitleField";
import ContentEditor from "@/components/admin/ContentEditor";
import PostSettingsPanel from "@/components/admin/PostSettingsPanel";
import RankMathSeoPanel, { scoreColor, useSeoScore } from "@/components/admin/RankMathSeoPanel";
import SerpPreview from "@/components/admin/SerpPreview";
import SnippetEditorModal from "@/components/admin/SnippetEditorModal";
import { getPostPath } from "@/lib/blog/paths";
import { generateSlug } from "@/lib/blog/utils";
import type { BlogPost, PostStatus } from "@/lib/blog/types";

interface PostEditorProps {
  post?: BlogPost;
  mode: "create" | "edit";
}

const EMPTY = {
  title: "",
  slug: "",
  focusKeyword: "",
  metaDescription: "",
  excerpt: "",
  content: "",
  status: "draft" as PostStatus,
  author: "CGPA Calculator Pro",
  featuredImage: "",
};

export default function PostEditor({ post, mode }: PostEditorProps) {
  const router = useRouter();
  const [form, setForm] = useState({
    title: post?.title ?? EMPTY.title,
    slug: post?.slug ?? EMPTY.slug,
    focusKeyword: post?.focusKeyword ?? EMPTY.focusKeyword,
    metaDescription: post?.metaDescription ?? EMPTY.metaDescription,
    excerpt: post?.excerpt ?? EMPTY.excerpt,
    content: post?.content ?? EMPTY.content,
    status: post?.status ?? EMPTY.status,
    author: post?.author ?? EMPTY.author,
    featuredImage: post?.featuredImage ?? EMPTY.featuredImage,
  });
  const [slugManual, setSlugManual] = useState(Boolean(post?.slug));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [sidebarTab, setSidebarTab] = useState<"post" | "seo">("post");
  const [snippetOpen, setSnippetOpen] = useState(false);

  const seoProps = {
    title: form.title,
    slug: form.slug,
    metaDescription: form.metaDescription,
    focusKeyword: form.focusKeyword,
    content: form.content,
    excerpt: form.excerpt,
    featuredImage: form.featuredImage,
  };
  const seo = useSeoScore(seoProps);
  const seoColor = scoreColor(seo.score);

  function update<K extends keyof typeof form>(key: K, value: typeof form[K]) {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "title" && !slugManual) {
        next.slug = generateSlug(String(value));
      }
      return next;
    });
  }

  async function handleSave(publishNow = false) {
    setSaving(true);
    setError("");
    const payload = {
      ...form,
      status: publishNow ? "published" : form.status,
    } as typeof form;

    try {
      const url =
        mode === "create"
          ? "/api/admin/posts"
          : `/api/admin/posts/${post!.id}`;
      const method = mode === "create" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");

      router.push("/admin");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!post || !confirm("Delete this post permanently?")) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/posts/${post.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      router.push("/admin");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
      setSaving(false);
    }
  }

  return (
    <div className="wp-editor">
      <header className="wp-editor__bar">
        <div className="wp-editor__bar-left">
          <Link href="/admin" className="wp-editor__back" aria-label="Back to dashboard">
            ←
          </Link>
          <span className="wp-editor__bar-title">
            {form.title.trim() || "Untitled"}
          </span>
        </div>

        <div className="wp-editor__bar-center">
          <button
            type="button"
            className="wp-score-pill"
            style={{ borderColor: seoColor, color: seoColor }}
            onClick={() => setSidebarTab("seo")}
          >
            {seo.score}/100
          </button>
        </div>

        <div className="wp-editor__bar-right">
          {mode === "edit" && post?.status === "published" && (
            <Link
              href={getPostPath(form.slug)}
              className="wp-editor__btn wp-editor__btn--ghost"
              target="_blank"
            >
              Preview
            </Link>
          )}
          {mode === "edit" && (
            <button
              type="button"
              className="wp-editor__btn wp-editor__btn--ghost wp-editor__btn--danger"
              onClick={handleDelete}
              disabled={saving}
            >
              Delete
            </button>
          )}
          <button
            type="button"
            className="wp-editor__btn wp-editor__btn--ghost"
            onClick={() => handleSave(false)}
            disabled={saving}
          >
            Save
          </button>
          <button
            type="button"
            className="wp-editor__btn wp-editor__btn--primary"
            onClick={() => handleSave(true)}
            disabled={saving}
          >
            {saving ? "Saving…" : "Publish"}
          </button>
        </div>
      </header>

      {error && <p className="wp-editor__error">{error}</p>}

      <div className="wp-editor__workspace">
        <div className="wp-editor__canvas-wrap">
          <article className="article-write">
            <div className="article-write__inner">
              <ArticleTitleField
                title={form.title}
                slug={form.slug}
                onTitleChange={(v) => update("title", v)}
              />
              <div className="article-write__body">
                <span className="article-write__body-label">Article content</span>
                <ContentEditor
                  value={form.content}
                  onChange={(v) => update("content", v)}
                  variant="canvas"
                  wordCount={seo.wordCount}
                />
              </div>
            </div>
          </article>
        </div>

        <aside className="wp-editor__sidebar">
          <div className="wp-sidebar-tabs">
            <button
              type="button"
              className={`wp-sidebar-tabs__btn ${sidebarTab === "post" ? "wp-sidebar-tabs__btn--active" : ""}`}
              onClick={() => setSidebarTab("post")}
            >
              Post
            </button>
            <button
              type="button"
              className={`wp-sidebar-tabs__btn ${sidebarTab === "seo" ? "wp-sidebar-tabs__btn--active" : ""}`}
              onClick={() => setSidebarTab("seo")}
            >
              SEO
              <span className="wp-sidebar-tabs__score" style={{ color: seoColor }}>
                {seo.score}
              </span>
            </button>
          </div>

          <div className="wp-sidebar-body">
            {sidebarTab === "post" ? (
              <PostSettingsPanel
                status={form.status}
                author={form.author}
                slug={form.slug}
                excerpt={form.excerpt}
                featuredImage={form.featuredImage}
                wordCount={seo.wordCount}
                onStatusChange={(v) => update("status", v)}
                onAuthorChange={(v) => update("author", v)}
                onSlugChange={(v) => update("slug", v)}
                onExcerptChange={(v) => update("excerpt", v)}
                onFeaturedImageChange={(v) => update("featuredImage", v)}
                onSlugManual={() => setSlugManual(true)}
              />
            ) : (
              <div className="wp-seo-tab">
                <label className="wp-side-field">
                  <span>Focus keyword</span>
                  <input
                    value={form.focusKeyword}
                    onChange={(e) => update("focusKeyword", e.target.value)}
                    placeholder="e.g. how to calculate cgpa"
                  />
                </label>

                <div className="wp-snippet-block">
                  <div className="wp-snippet-block__head">
                    <strong>Snippet preview</strong>
                    <button
                      type="button"
                      className="wp-snippet-block__edit"
                      onClick={() => setSnippetOpen(true)}
                    >
                      Edit snippet
                    </button>
                  </div>
                  <SerpPreview
                    title={form.title}
                    slug={form.slug}
                    metaDescription={form.metaDescription}
                  />
                </div>

                <RankMathSeoPanel {...seoProps} />
              </div>
            )}
          </div>
        </aside>
      </div>

      <SnippetEditorModal
        open={snippetOpen}
        onClose={() => setSnippetOpen(false)}
        title={form.title}
        slug={form.slug}
        metaDescription={form.metaDescription}
        onTitleChange={(v) => update("title", v)}
        onSlugChange={(v) => {
          setSlugManual(true);
          update("slug", v);
        }}
        onMetaChange={(v) => update("metaDescription", v)}
      />
    </div>
  );
}
