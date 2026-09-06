/**
 * Blog admin branding + paths — driven by environment variables.
 * Set NEXT_PUBLIC_SITE_URL per domain; name/email/initials are derived automatically.
 */

const DEFAULT_RESERVED_SLUGS = [
  "about",
  "admin",
  "api",
  "blog",
  "contact",
  "cookies",
  "privacy",
  "terms",
  "sitemap.xml",
  "robots.txt",
  "manifest.webmanifest",
  "ads.txt",
  "_next",
  "favicon.ico",
  "icon.svg",
  "file.svg",
  "logo.svg",
  "vercel.svg",
  "window.svg",
] as const;

function trimTrailingSlash(url: string): string {
  return url.replace(/\/$/, "");
}

function resolveSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv) return trimTrailingSlash(fromEnv);

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return `https://${vercel.replace(/^https?:\/\//, "")}`;

  return "http://localhost:3000";
}

function hostnameFromUrl(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./i, "");
  } catch {
    return "localhost";
  }
}

function slugifyHost(hostname: string): string {
  const base = hostname.split(".")[0] || "site";
  return base.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "site";
}

/** Turn `my-cool-site.com` → `My Cool Site` */
export function deriveSiteNameFromUrl(url: string): string {
  const host = hostnameFromUrl(url);
  const base = host.split(".")[0] || host;
  return base
    .replace(/[-_]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function deriveBrandInitials(siteName: string): string {
  const words = siteName.split(/\s+/).filter(Boolean);
  if (words.length >= 2) {
    return words
      .slice(0, 2)
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase();
  }
  const compact = siteName.replace(/\s+/g, "");
  return (compact.slice(0, 2) || "BL").toUpperCase();
}

function parseExtraReservedSlugs(): string[] {
  const raw = process.env.BLOG_RESERVED_SLUGS?.trim();
  if (!raw) return [];
  return raw
    .split(",")
    .map((slug) => slug.trim().toLowerCase())
    .filter(Boolean);
}

export function getBlogAdminConfig() {
  const siteUrl = resolveSiteUrl();
  const hostname = hostnameFromUrl(siteUrl);
  const siteName =
    process.env.NEXT_PUBLIC_SITE_NAME?.trim() || deriveSiteNameFromUrl(siteUrl);
  const siteEmail =
    process.env.SITE_EMAIL?.trim() || `hello@${hostname}`;
  const storagePrefix =
    process.env.BLOG_STORAGE_PREFIX?.trim().toLowerCase() ||
    slugifyHost(hostname);
  const brandInitials =
    process.env.BLOG_BRAND_INITIALS?.trim().toUpperCase() ||
    deriveBrandInitials(siteName);
  const adminTitle =
    process.env.BLOG_ADMIN_TITLE?.trim() || `${siteName} Blog`;
  const defaultAuthor =
    process.env.BLOG_DEFAULT_AUTHOR?.trim() || siteName;

  const reservedSlugs = Array.from(
    new Set([...DEFAULT_RESERVED_SLUGS, ...parseExtraReservedSlugs()])
  );

  return {
    siteUrl,
    hostname,
    siteName,
    siteEmail,
    storagePrefix,
    brandInitials,
    adminTitle,
    defaultAuthor,
    previewStorageKey: `${storagePrefix}-blog-article-preview`,
    backupFilenamePrefix: `${storagePrefix}-blog-backup`,
    reservedSlugs,
    loginTagline:
      process.env.BLOG_LOGIN_TAGLINE?.trim() || "Blog & content admin",
    dashboardTagline:
      process.env.BLOG_DASHBOARD_TAGLINE?.trim() ||
      `Write and publish articles for ${siteName}.`,
  };
}

export type BlogAdminConfig = ReturnType<typeof getBlogAdminConfig>;

/** Cached singleton for server + client (env is fixed at build time). */
let cached: BlogAdminConfig | null = null;

export function blogAdminConfig(): BlogAdminConfig {
  if (!cached) cached = getBlogAdminConfig();
  return cached;
}
