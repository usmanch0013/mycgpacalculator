"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getPostPath } from "@/lib/blog/paths";
import { saveArticlePreview } from "@/lib/blog/preview";
import { BLOG_CONFIG } from "@/lib/blog/config";
import { analyzeSeo, scoreColor } from "@/lib/blog/seo-score";
import type { BlogPost, PostStatus } from "@/lib/blog/types";

type Filter = "all" | "published" | "draft";
type BulkAction = "delete" | "publish" | "draft" | "duplicate";

function SeoBadge({ score }: { score: number }) {
  const color = scoreColor(score);
  return (
    <span className="admin-seo-badge" style={{ borderColor: color, color }}>
      {score}
      <small>/100</small>
    </span>
  );
}

export default function PostsTable({ posts }: { posts: BlogPost[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState<BulkAction>("delete");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [bulkBusy, setBulkBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [quickEditId, setQuickEditId] = useState<string | null>(null);
  const [quickForm, setQuickForm] = useState({
    title: "",
    slug: "",
    status: "draft" as PostStatus,
    author: "",
  });

  const publishedCount = posts.filter((p) => p.status === "published").length;
  const draftCount = posts.filter((p) => p.status === "draft").length;

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((post) => {
      if (filter !== "all" && post.status !== filter) return false;
      if (!q) return true;
      return (
        post.title.toLowerCase().includes(q) ||
        post.slug.toLowerCase().includes(q) ||
        post.author.toLowerCase().includes(q)
      );
    });
  }, [posts, filter, query]);

  const allVisibleSelected = visible.length > 0 && visible.every((p) => selected.includes(p.id));

  function toggleAll() {
    if (allVisibleSelected) {
      setSelected((prev) => prev.filter((id) => !visible.some((p) => p.id === id)));
      return;
    }
    setSelected((prev) => Array.from(new Set([...prev, ...visible.map((p) => p.id)])));
  }

  function toggleOne(id: string) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function openQuickEdit(post: BlogPost) {
    setQuickEditId(post.id);
    setQuickForm({
      title: post.title,
      slug: post.slug,
      status: post.status,
      author: post.author,
    });
  }

  function previewPost(post: BlogPost) {
    saveArticlePreview({
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt,
      author: post.author,
      featuredImage: post.featuredImage || "",
    });
    window.open("/admin/preview", "_blank", "noopener,noreferrer");
  }

  async function runAction(id: string, action: "delete" | "publish" | "draft" | "duplicate") {
    if (action === "delete" && !confirm("Move this article to trash? This cannot be undone.")) return;
    setBusyId(id);
    setError("");
    setNotice("");
    try {
      if (action === "duplicate") {
        const res = await fetch(`/api/admin/posts/${id}/duplicate`, { method: "POST" });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Duplicate failed");
        setNotice("Duplicate created as a draft.");
        setFilter("draft");
      } else if (action === "delete") {
        const res = await fetch(`/api/admin/posts/${id}`, { method: "DELETE" });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || "Delete failed");
        setSelected((prev) => prev.filter((x) => x !== id));
        setNotice("Article deleted.");
      } else {
        const res = await fetch(`/api/admin/posts/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: action === "publish" ? "published" : "draft",
            syncGit: true,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Update failed");
        if (action === "draft") {
          setFilter("draft");
          setNotice("Saved as draft — article is still here under Drafts.");
        } else {
          setFilter("published");
          setNotice("Article published.");
        }
      }
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Action failed");
    } finally {
      setBusyId(null);
    }
  }

  async function saveQuickEdit(id: string) {
    setBusyId(id);
    setError("");
    setNotice("");
    try {
      const res = await fetch(`/api/admin/posts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...quickForm, syncGit: true }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Quick edit failed");
      setQuickEditId(null);
      setNotice("Article updated.");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Quick edit failed");
    } finally {
      setBusyId(null);
    }
  }

  async function applyBulk() {
    if (!selected.length) return;
    if (bulkAction === "delete" && !confirm(`Delete ${selected.length} selected article${selected.length === 1 ? "" : "s"}? This cannot be undone.`)) {
      return;
    }
    setBulkBusy(true);
    setError("");
    setNotice("");
    try {
      const res = await fetch("/api/admin/posts/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: bulkAction, ids: selected }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Bulk action failed");
      setSelected([]);
      if (bulkAction === "draft") setFilter("draft");
      if (bulkAction === "publish") setFilter("published");
      if (bulkAction === "duplicate") setFilter("draft");
      setNotice("Bulk action completed.");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Bulk action failed");
    } finally {
      setBulkBusy(false);
    }
  }

  return (
    <div className="posts-table">
      <div className="posts-table__filters">
        <div className="posts-table__views" role="tablist" aria-label="Filter articles">
          <button
            type="button"
            className={filter === "all" ? "is-active" : ""}
            onClick={() => setFilter("all")}
          >
            All <span>({posts.length})</span>
          </button>
          <button
            type="button"
            className={filter === "published" ? "is-active" : ""}
            onClick={() => setFilter("published")}
          >
            Published <span>({publishedCount})</span>
          </button>
          <button
            type="button"
            className={filter === "draft" ? "is-active" : ""}
            onClick={() => setFilter("draft")}
          >
            Drafts <span>({draftCount})</span>
          </button>
        </div>
        <label className="posts-table__search">
          <span className="sr-only">Search articles</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles…"
          />
        </label>
      </div>

      <div className="posts-table__bulk">
        <select
          value={bulkAction}
          onChange={(e) => setBulkAction(e.target.value as BulkAction)}
          aria-label="Bulk actions"
        >
          <option value="delete">Move to Trash</option>
          <option value="publish">Publish</option>
          <option value="draft">Switch to Draft</option>
          <option value="duplicate">Duplicate</option>
        </select>
        <button
          type="button"
          className="admin-btn admin-btn--outline admin-btn--sm"
          onClick={applyBulk}
          disabled={!selected.length || bulkBusy}
        >
          {bulkBusy ? "Applying…" : "Apply"}
        </button>
        {selected.length > 0 && (
          <span className="posts-table__selected">{selected.length} selected</span>
        )}
      </div>

      {error && <p className="posts-table__error">{error}</p>}
      {notice && <p className="posts-table__notice">{notice}</p>}

      {visible.length === 0 ? (
        <p className="posts-table__empty">No articles match this filter.</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th className="posts-table__check">
                  <input
                    type="checkbox"
                    checked={allVisibleSelected}
                    onChange={toggleAll}
                    aria-label="Select all articles"
                  />
                </th>
                <th>Title</th>
                <th>Author</th>
                <th>Status</th>
                <th>SEO</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((post) => {
                const seo = analyzeSeo(
                  post.title,
                  post.slug,
                  post.metaDescription,
                  post.focusKeyword,
                  post.content,
                  {
                    excerpt: post.excerpt,
                    featuredImage: post.featuredImage,
                    secondaryKeywords: post.secondaryKeywords,
                    currentPostId: post.id,
                    existingFocusKeywords: posts.map((item) => ({
                      id: item.id,
                      keyword: item.focusKeyword,
                      title: item.title,
                      status: item.status,
                    })),
                  }
                );
                const busy = busyId === post.id;
                const isQuick = quickEditId === post.id;

                return (
                  <tr key={post.id} className={selected.includes(post.id) ? "is-selected" : ""}>
                    <td className="posts-table__check">
                      <input
                        type="checkbox"
                        checked={selected.includes(post.id)}
                        onChange={() => toggleOne(post.id)}
                        aria-label={`Select ${post.title || "untitled article"}`}
                      />
                    </td>
                    <td>
                      {isQuick ? (
                        <div className="quick-edit">
                          <label>
                            Title
                            <input
                              value={quickForm.title}
                              onChange={(e) => setQuickForm((prev) => ({ ...prev, title: e.target.value }))}
                            />
                          </label>
                          <label>
                            Slug
                            <input
                              value={quickForm.slug}
                              onChange={(e) => setQuickForm((prev) => ({ ...prev, slug: e.target.value }))}
                            />
                          </label>
                          <div className="quick-edit__row">
                            <label>
                              Status
                              <select
                                value={quickForm.status}
                                onChange={(e) =>
                                  setQuickForm((prev) => ({ ...prev, status: e.target.value as PostStatus }))
                                }
                              >
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                              </select>
                            </label>
                            <label>
                              Author
                              <input
                                value={quickForm.author}
                                onChange={(e) => setQuickForm((prev) => ({ ...prev, author: e.target.value }))}
                              />
                            </label>
                          </div>
                          <div className="quick-edit__actions">
                            <button
                              type="button"
                              className="admin-btn admin-btn--primary admin-btn--sm"
                              onClick={() => saveQuickEdit(post.id)}
                              disabled={busy}
                            >
                              {busy ? "Saving…" : "Update"}
                            </button>
                            <button
                              type="button"
                              className="admin-btn admin-btn--ghost admin-btn--sm"
                              onClick={() => setQuickEditId(null)}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="admin-table__title-cell">
                          {post.featuredImage && (
                            <img src={post.featuredImage} alt="" className="admin-table__thumb" />
                          )}
                          <div>
                            <Link href={`/admin/posts/${post.id}/edit`} className="admin-table__title-link">
                              {post.title.trim() || "Untitled"}
                            </Link>
                            <span className="admin-table__slug">{getPostPath(post.slug)}</span>
                            <div className="row-actions">
                              <Link href={`/admin/posts/${post.id}/edit`}>Edit</Link>
                              <button type="button" onClick={() => openQuickEdit(post)} disabled={busy}>
                                Quick Edit
                              </button>
                              <button type="button" onClick={() => runAction(post.id, "duplicate")} disabled={busy}>
                                Duplicate
                              </button>
                              <button type="button" onClick={() => previewPost(post)} disabled={busy}>
                                Preview
                              </button>
                              {post.status === "published" ? (
                                <>
                                  <Link href={getPostPath(post.slug)} target="_blank" rel="noreferrer">
                                    View
                                  </Link>
                                  <button type="button" onClick={() => runAction(post.id, "draft")} disabled={busy}>
                                    Switch to Draft
                                  </button>
                                </>
                              ) : (
                                <button type="button" onClick={() => runAction(post.id, "publish")} disabled={busy}>
                                  Publish
                                </button>
                              )}
                              <button
                                type="button"
                                className="row-actions__trash"
                                onClick={() => runAction(post.id, "delete")}
                                disabled={busy}
                              >
                                {busy ? "Working…" : "Delete"}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </td>
                    <td>{post.author || BLOG_CONFIG.defaultAuthor}</td>
                    <td>
                      <span className={`admin-badge admin-badge--${post.status}`}>{post.status}</span>
                    </td>
                    <td>
                      <SeoBadge score={seo.score} />
                    </td>
                    <td className="admin-table__date">
                      {new Date(post.updatedAt || post.publishedAt).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
