import Link from "next/link";
import { getPostPath } from "@/lib/blog/paths";
import { getAllPosts } from "@/lib/blog/storage";
import { analyzeSeo, scoreColor } from "@/lib/blog/seo-score";

function SeoBadge({ score }: { score: number }) {
  const color = scoreColor(score);
  return (
    <span className="admin-seo-badge" style={{ borderColor: color, color }}>
      {score}
      <small>/100</small>
    </span>
  );
}

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
          <p className="admin-hero__desc">
            Write CGPA, GPA, and grading guides, track Rank Math style SEO scores, and publish
            straight to CGPA Calculator Pro.
          </p>
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
            <li>Target 600+ words for better SEO</li>
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
              <li><span>3</span> Publish — live at cgpacalculatorpro.com/your-slug</li>
            </ol>
            <Link href="/admin/posts/new" className="admin-btn admin-btn--primary admin-btn--lg">
              Write first article
            </Link>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Article</th>
                  <th>Status</th>
                  <th>SEO</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => {
                  const seo = analyzeSeo(
                    post.title,
                    post.slug,
                    post.metaDescription,
                    post.focusKeyword,
                    post.content,
                    {
                      excerpt: post.excerpt,
                      featuredImage: post.featuredImage,
                    }
                  );
                  return (
                    <tr key={post.id}>
                      <td>
                        <div className="admin-table__title-cell">
                          {post.featuredImage && (
                            <img
                              src={post.featuredImage}
                              alt=""
                              className="admin-table__thumb"
                            />
                          )}
                          <div>
                            <strong>{post.title}</strong>
                            <span className="admin-table__slug">{getPostPath(post.slug)}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`admin-badge admin-badge--${post.status}`}>
                          {post.status}
                        </span>
                      </td>
                      <td>
                        <SeoBadge score={seo.score} />
                      </td>
                      <td className="admin-table__date">
                        {new Date(post.publishedAt).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td>
                        <div className="admin-table__actions">
                          <Link
                            href={`/admin/posts/${post.id}/edit`}
                            className="admin-table__action"
                          >
                            Edit
                          </Link>
                          {post.status === "published" && (
                            <Link
                              href={getPostPath(post.slug)}
                              className="admin-table__action"
                              target="_blank"
                            >
                              View
                            </Link>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
