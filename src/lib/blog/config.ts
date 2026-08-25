/**
 * Blog admin configuration for CGPA Calculator Pro.
 */
export const BLOG_CONFIG = {
  /** Full site URL, no trailing slash */
  siteUrl:
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://cgpacalculatorpro.com",
  siteName: "CGPA Calculator Pro",
};

/** Top-level routes that must NOT be used as article slugs */
export const RESERVED_SLUGS = [
  "about",
  "admin",
  "api",
  "blog",
  "calculator",
  "contact",
  "cookies",
  "privacy",
  "terms",
  "universities",
  "sitemap.xml",
  "robots.txt",
  "manifest.webmanifest",
  "_next",
  "favicon.ico",
  "icon.svg",
  "file.svg",
  "logo.svg",
  "vercel.svg",
  "window.svg",
] as const;
