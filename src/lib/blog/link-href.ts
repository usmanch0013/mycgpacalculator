import { BLOG_CONFIG } from "./config";

const EXTERNAL_PROTOCOL_RE = /^https?:\/\//i;
const PROTOCOL_RELATIVE_RE = /^\/\//;
const MAILTO_TEL_RE = /^(mailto:|tel:)/i;
const BARE_DOMAIN_RE =
  /^(?:[a-z0-9](?:[-a-z0-9]*[a-z0-9])?\.)+[a-z]{2,}(?:[/?#].*)?$/i;

function resolveSiteOrigin(siteOrigin?: string): string {
  if (siteOrigin) return siteOrigin;
  if (typeof window !== "undefined") return window.location.origin;
  return BLOG_CONFIG.siteUrl.replace(/\/$/, "");
}

/** Fix mistaken leading slashes before absolute URLs, e.g. /https://example.com */
export function fixMalformedLinkHref(href: string): string {
  const trimmed = href.trim();
  if (!trimmed) return "";
  return trimmed.replace(/^\/+(?=https?:\/\/)/i, "");
}

export function normalizeArticleLinkHref(
  raw: string,
  options?: { siteOrigin?: string }
): string {
  let href = fixMalformedLinkHref(raw);
  if (!href) return "";

  if (href.startsWith("#") || MAILTO_TEL_RE.test(href)) return href;

  if (EXTERNAL_PROTOCOL_RE.test(href)) {
    try {
      return new URL(href).href;
    } catch {
      return href;
    }
  }

  if (PROTOCOL_RELATIVE_RE.test(href)) {
    try {
      return new URL(`https:${href}`).href;
    } catch {
      return `https:${href}`;
    }
  }

  if (href.startsWith("/")) return href;

  if (BARE_DOMAIN_RE.test(href)) {
    try {
      return new URL(`https://${href.replace(/^\/+/, "")}`).href;
    } catch {
      return `https://${href.replace(/^\/+/, "")}`;
    }
  }

  const siteOrigin = resolveSiteOrigin(options?.siteOrigin);
  try {
    const parsed = new URL(href, siteOrigin);
    const site = new URL(siteOrigin);
    if (parsed.origin === site.origin) {
      return `${parsed.pathname}${parsed.search}${parsed.hash}`;
    }
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return parsed.href;
    }
  } catch {
    // fall through to internal path
  }

  return `/${href.replace(/^\/+/, "")}`;
}

/** Repair saved HTML where external URLs were stored as /https://... */
export function repairArticleLinkHrefs(html: string): string {
  return html.replace(
    /<a\b([^>]*?)\bhref\s*=\s*(["'])\s*\/+(https?:\/\/[^"']*)\2/gi,
    (_match, attrs, quote, url) => `<a${attrs}href=${quote}${url}${quote}`
  );
}

export function isExternalArticleLink(href: string): boolean {
  const normalized = normalizeArticleLinkHref(href);
  return EXTERNAL_PROTOCOL_RE.test(normalized);
}
