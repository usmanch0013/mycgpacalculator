"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import AdminLogoutButton from "@/components/admin/AdminLogoutButton";
import { BLOG_CONFIG } from "@/lib/blog/config";

const NAV = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/posts/new", label: "New article", exact: false },
  { href: "/blog", label: "View blog", external: true },
  { href: "/", label: "View site", external: true },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isBarePage = pathname === "/admin/login" || pathname === "/admin/preview";

  if (isBarePage) {
    return <>{children}</>;
  }

  return (
    <div className="admin-shell">
      <header className="admin-shell__header">
        <div className="admin-shell__brand">
          <Link href="/admin" className="admin-shell__logo">
            <span className="admin-shell__logo-mark" aria-hidden>{BLOG_CONFIG.brandInitials}</span>
            <span className="admin-shell__logo-text">
              <strong>{BLOG_CONFIG.adminTitle}</strong>
              <small>Content admin</small>
            </span>
          </Link>
        </div>
        <nav className="admin-shell__nav" aria-label="Admin">
          {NAV.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
            const isPosts = item.href === "/admin/posts/new" && pathname.includes("/admin/posts");
            const linkActive = active || isPosts;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`admin-shell__nav-link ${linkActive ? "admin-shell__nav-link--active" : ""}`}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="admin-shell__actions">
          <Link href="/admin/posts/new" className="admin-shell__cta">
            + Write
          </Link>
          <AdminLogoutButton />
        </div>
      </header>
      <main className="admin-shell__main">{children}</main>
    </div>
  );
}
