"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import ArticleTitleField from "@/components/admin/ArticleTitleField";
import ContentEditor, { type ContentEditorHandle } from "@/components/admin/ContentEditor";
import PostSettingsPanel from "@/components/admin/PostSettingsPanel";
import RankMathSeoPanel, { scoreColor, useSeoScore } from "@/components/admin/RankMathSeoPanel";
import SerpPreview from "@/components/admin/SerpPreview";
import SnippetEditorModal from "@/components/admin/SnippetEditorModal";
import { getPostPath } from "@/lib/blog/paths";
import { saveArticlePreview } from "@/lib/blog/preview";
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

type SaveStatus = "idle" | "saving" | "saved" | "error";

function hasDraftContent(form: typeof EMPTY) {
  return Boolean(
    form.title.trim() ||
      form.content.replace(/<[^>]*>/g, "").trim() ||
      form.excerpt.trim() ||
      form.featuredImage.trim() ||
      form.focusKeyword.trim() ||
      form.metaDescription.trim()
  );
}

export default function PostEditor({ post, mode }: PostEditorProps) {
  const router = useRouter();
  const contentEditorRef = useRef<ContentEditorHandle>(null);
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
  const [postId, setPostId] = useState(post?.id ?? null);
  const [slugManual, setSlugManual] = useState(Boolean(post?.slug));
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [error, setError] = useState("");
  const [sidebarTab, setSidebarTab] = useState<"post" | "seo">("post");
  const [snippetOpen, setSnippetOpen] = useState(false);
  const formRef = useRef(form);
  const postIdRef = useRef(postId);
  const savingRef = useRef(false);
  const autosaveTimer = useRef<number | null>(null);
  const lastSavedPayload = useRef(
    JSON.stringify({
      title: post?.title ?? EMPTY.title,
      slug: post?.slug ?? EMPTY.slug,
      focusKeyword: post?.focusKeyword ?? EMPTY.focusKeyword,
      metaDescription: post?.metaDescription ?? EMPTY.metaDescription,
      excerpt: post?.excerpt ?? EMPTY.excerpt,
      content: post?.content ?? EMPTY.content,
      status: post?.status ?? EMPTY.status,
      author: post?.author ?? EMPTY.author,
      featuredImage: post?.featuredImage ?? EMPTY.featuredImage,
    })
  );

  formRef.current = form;
  postIdRef.current = postId;

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

  const persistDraft = useCallback(async (opts?: { silent?: boolean; publish?: boolean; syncGit?: boolean }) => {
    while (savingRef.current) {
      await new Promise((resolve) => window.setTimeout(resolve, 40));
    }

    const latestContent = contentEditorRef.current?.flushValue() ?? formRef.current.content;
    const payload = {
      ...formRef.current,
      content: latestContent,
      status: (opts?.publish ? "published" : formRef.current.status) as PostStatus,
    };

    if (!postIdRef.current && !hasDraftContent(payload) && !opts?.publish) {
      return null;
    }

    const serialized = JSON.stringify(payload);
    if (serialized === lastSavedPayload.current && postIdRef.current && !opts?.publish) {
      return { id: postIdRef.current } as BlogPost;
    }

    savingRef.current = true;
    if (!opts?.silent) setSaving(true);
    setSaveStatus("saving");
    setError("");

    try {
      const existingId = postIdRef.current;
      const url = existingId ? `/api/admin/posts/${existingId}` : "/api/admin/posts";
      const method = existingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          syncGit: opts?.syncGit ?? Boolean(opts?.publish || !opts?.silent),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");

      setPostId(data.id);
      lastSavedPayload.current = JSON.stringify({ ...payload, slug: data.slug, status: data.status });
      if (data.slug && data.slug !== formRef.current.slug) {
        setForm((prev) => ({ ...prev, slug: data.slug, content: latestContent }));
      } else if (latestContent !== formRef.current.content) {
        setForm((prev) => ({ ...prev, content: latestContent }));
      }
      if (opts?.publish) {
        setForm((prev) => ({ ...prev, status: "published" }));
      }

      setSaveStatus("saved");
      if (!existingId) {
        window.history.replaceState(null, "", `/admin/posts/${data.id}/edit`);
      }
      return data as BlogPost;
    } catch (e) {
      const message = e instanceof Error ? e.message : "Save failed";
      setError(message);
      setSaveStatus("error");
      return null;
    } finally {
      savingRef.current = false;
      if (!opts?.silent) setSaving(false);
    }
  }, []);

  useEffect(() => {
    if (autosaveTimer.current) window.clearTimeout(autosaveTimer.current);
    autosaveTimer.current = window.setTimeout(() => {
      void persistDraft({ silent: true });
    }, 1400);
    return () => {
      if (autosaveTimer.current) window.clearTimeout(autosaveTimer.current);
    };
  }, [form, persistDraft]);

  async function handleSave(publishNow = false) {
    const saved = await persistDraft({ publish: publishNow });
    if (!saved) return;
    if (publishNow) {
      router.push("/admin");
      router.refresh();
    }
  }

  async function goBack() {
    await persistDraft({ silent: true, syncGit: true });
    router.push("/admin");
    router.refresh();
  }

  function openPreview() {
    const latestContent = contentEditorRef.current?.flushValue() ?? form.content;
    if (latestContent !== form.content) {
      update("content", latestContent);
    }

    saveArticlePreview({
      title: form.title,
      slug: form.slug,
      content: latestContent,
      excerpt: form.excerpt,
      author: form.author,
      featuredImage: form.featuredImage,
    });

    window.open("/admin/preview", "_blank", "noopener,noreferrer");
  }

  async function handleDelete() {
    if (!postId || !confirm("Delete this post permanently?")) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/posts/${postId}`, { method: "DELETE" });
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
          <button
            type="button"
            className="wp-editor__back"
            aria-label="Back to dashboard"
            onClick={goBack}
          >
            ←
          </button>
          <span className="wp-editor__bar-title">
            {form.title.trim() || "Untitled"}
          </span>
          {saveStatus !== "idle" && (
            <span
              className={`wp-editor__save-status${saveStatus === "error" ? " wp-editor__save-status--error" : ""}`}
            >
              {saveStatus === "saving" && "Saving…"}
              {saveStatus === "saved" && (form.status === "published" ? "Saved" : "Draft saved")}
              {saveStatus === "error" && "Save failed"}
            </span>
          )}
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
          <button
            type="button"
            className="wp-editor__btn wp-editor__btn--ghost"
            onClick={openPreview}
          >
            Preview
          </button>
          {form.status === "published" && form.slug && (
            <Link
              href={getPostPath(form.slug)}
              className="wp-editor__btn wp-editor__btn--ghost"
              target="_blank"
            >
              View live
            </Link>
          )}
          {postId && (
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
            {saving && saveStatus === "saving" && form.status === "published" ? "Saving…" : "Publish"}
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
                  ref={contentEditorRef}
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
