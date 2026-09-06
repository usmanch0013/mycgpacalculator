import Link from "next/link";
import BlogBackupPanel from "@/components/admin/BlogBackupPanel";
import PostsTable from "@/components/admin/PostsTable";
import { BLOG_CONFIG } from "@/lib/blog/config";
import { getAllPosts } from "@/lib/blog/storage";

export default async function AdminDashboardPage() {
  const posts = await getAllPosts();
  const published = posts.filter((p) => p.status === "published").length;
  const drafts = posts.filter((p) => p.status === "draft").length;

  return (
    <div className="admin-dashboard">
      <section className="admin-hero">
        <div className="admin-hero__content">
          <p className="admin-hero__eyebrow">Welcome back</p>
          <h1 className="admin-hero__title">Your content dashboard</h1>
          <p className="admin-hero__desc">{BLOG_CONFIG.dashboardTagline}</p>
          <div className="admin-hero__actions">
            <Link href="/admin/posts/new" className="admin-btn admin-btn--primary">
              + New article
            </Link>
            <Link href="/blog" className="admin-btn admin-btn--ghost" target="_blank">
              View blog
            </Link>
          </div>
        </div>
        <div className="admin-hero__tips">
          <p className="admin-hero__tips-title">Quick tips</p>
          <ul>
            <li>Set a focus keyword before writing</li>
            <li>Upload a featured image for every post</li>
            <li>Articles and images save automatically to GitHub</li>
            <li>Download a JSON backup anytime for extra safety</li>
          </ul>
        </div>
      </section>

      <div className="admin-stats">
        <div className="admin-stat admin-stat--total">
          <span className="admin-stat__icon" aria-hidden>📄</span>
          <div>
            <strong>{posts.length}</strong>
            <span>Total articles</span>
          </div>
        </div>
        <div className="admin-stat admin-stat--published">
          <span className="admin-stat__icon" aria-hidden>✓</span>
          <div>
            <strong>{published}</strong>
            <span>Published</span>
          </div>
        </div>
        <div className="admin-stat admin-stat--draft">
          <span className="admin-stat__icon" aria-hidden>✎</span>
          <div>
            <strong>{drafts}</strong>
            <span>Drafts</span>
          </div>
        </div>
      </div>

      <BlogBackupPanel />

      <section className="admin-panel">
        <header className="admin-panel__head">
          <div>
            <h2 className="admin-panel__title">All articles</h2>
            <p className="admin-panel__desc">
              {posts.length === 0
                ? "No posts yet — start your first article below."
                : `${posts.length} article${posts.length === 1 ? "" : "s"} in your library`}
            </p>
          </div>
          {posts.length > 0 && (
            <Link href="/admin/posts/new" className="admin-btn admin-btn--outline admin-btn--sm">
              + Add new
            </Link>
          )}
        </header>

        {posts.length === 0 ? (
          <div className="admin-empty">
            <div className="admin-empty__icon" aria-hidden>📝</div>
            <h3>Start your first article</h3>
            <p>
              Add a title, set your focus keyword, write content with quotes and images,
              then hit Publish.
            </p>
            <ol className="admin-empty__steps">
              <li><span>1</span> Write a clear title with your keyword</li>
              <li><span>2</span> Fill SEO sidebar — meta description &amp; image</li>
              <li><span>3</span> Publish — live at {BLOG_CONFIG.siteUrl.replace(/^https?:\/\//, "")}/your-slug</li>
            </ol>
            <Link href="/admin/posts/new" className="admin-btn admin-btn--primary admin-btn--lg">
              Write first article
            </Link>
          </div>
        ) : (
          <PostsTable posts={posts} />
        )}
      </section>
    </div>
  );
}
