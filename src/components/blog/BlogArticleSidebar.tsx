import Link from "next/link";
import { getPostPath } from "@/lib/blog/paths";
import type { BlogPost } from "@/lib/blog/types";

interface SidebarLink {
  href: string;
  label: string;
}

interface BlogArticleSidebarProps {
  recentPosts: BlogPost[];
  calculators: SidebarLink[];
}

const QUICK_LINKS = [
  { href: "/", label: "CGPA Calculator" },
  { href: "/universities", label: "All universities" },
  { href: "/blog", label: "Blog guides" },
  { href: "/about", label: "About us" },
];

export default function BlogArticleSidebar({
  recentPosts,
  calculators,
}: BlogArticleSidebarProps) {
  return (
    <>
      {calculators.length > 0 && (
        <section className="blog-sidebar-card">
          <h2 className="blog-sidebar-card__title">Popular calculators</h2>
          <ul className="blog-sidebar-tools">
            {calculators.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="blog-sidebar-tools__link">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/universities" className="blog-sidebar-card__more">
            Browse all universities →
          </Link>
        </section>
      )}

      {recentPosts.length > 0 && (
        <section className="blog-sidebar-card">
          <h2 className="blog-sidebar-card__title">Latest articles</h2>
          <ul className="blog-sidebar-list">
            {recentPosts.map((post) => (
              <li key={post.id} className="blog-sidebar-list__item">
                <Link href={getPostPath(post.slug)} className="blog-sidebar-list__link">
                  {post.featuredImage && (
                    <span className="blog-sidebar-list__thumb">
                      <img src={post.featuredImage} alt="" loading="lazy" />
                    </span>
                  )}
                  <span className="blog-sidebar-list__text">{post.title}</span>
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/blog" className="blog-sidebar-card__more">View all articles →</Link>
        </section>
      )}

      <section className="blog-sidebar-card">
        <h2 className="blog-sidebar-card__title">Quick links</h2>
        <ul className="blog-sidebar-tools">
          {QUICK_LINKS.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="blog-sidebar-tools__link">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="blog-sidebar-card blog-sidebar-card--accent">
        <h2 className="blog-sidebar-card__title">Free CGPA tool</h2>
        <p className="blog-sidebar-card__text">
          Calculate semester GPA, cumulative CGPA, and percentage in seconds.
        </p>
        <Link href="/" className="blog-sidebar-card__cta">Open calculator</Link>
      </section>
    </>
  );
}
