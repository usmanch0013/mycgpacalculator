/**
 * Edit this file when adding the admin panel to a new project.
 */
export const BLOG_CONFIG = {
  /** Full site URL, no trailing slash */
  siteUrl: "https://yourdomain.com",
  siteName: "My Site",
};

/** Add every top-level route from your app that must NOT be used as article slugs */
export const RESERVED_SLUGS = [
  "about",
  "admin",
  "api",
  "blog",
  "calculators",
  "contact",
  "disclaimer",
  "faq",
  "hourly",
  "manifest.webmanifest",
  "privacy-policy",
  "robots.txt",
  "salary",
  "sitemap.xml",
  "terms-of-use",
  "_next",
  "favicon.ico",
  "icon.svg",
] as const;
