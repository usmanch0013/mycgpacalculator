import { BLOG_CONFIG, RESERVED_SLUGS } from "./config";

const RESERVED = new Set<string>(RESERVED_SLUGS);

export function getPostPath(slug: string): string {
  const clean = slug.trim().replace(/^\/+|\/+$/g, "");
  return clean ? `/${clean}` : "/";
}

export function getPostUrl(slug: string): string {
  return `${BLOG_CONFIG.siteUrl}${getPostPath(slug)}`;
}

export function getSiteHost(): string {
  return BLOG_CONFIG.siteUrl.replace(/^https?:\/\//, "");
}

export function isReservedSlug(slug: string): boolean {
  return RESERVED.has(slug.trim().toLowerCase());
}

export function validatePostSlug(slug: string): string | null {
  const normalized = slug.trim().toLowerCase();
  if (!normalized) return "URL slug is required.";
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(normalized)) {
    return "Use lowercase letters, numbers, and hyphens only.";
  }
  if (isReservedSlug(normalized)) {
    return "This URL is reserved — choose a different slug.";
  }
  return null;
}
