import { BLOG_CONFIG } from "./config";
import type { SeoCheck, SeoCheckCategory, SeoCheckStatus, SeoScoreResult } from "./types";

function countWords(text: string): number {
  return text
    .replace(/[#*_`\[\]()]/g, " ")
    .replace(/<[^>]+>/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 0).length;
}

function stripMarkdown(md: string): string {
  return md
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]+`/g, " ")
    .replace(/#{1,6}\s/g, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function keywordInText(text: string, keyword: string): boolean {
  const needle = keyword.trim().toLowerCase().replace(/\s+/g, " ");
  if (!needle) return false;
  const hay = text.toLowerCase().replace(/\s+/g, " ");
  const pattern = new RegExp(
    `(^|[^a-z0-9])${escapeRegExp(needle).replace(/\s+/g, "\\s+")}([^a-z0-9]|$)`,
    "i"
  );
  return pattern.test(hay);
}

function getIntroText(plain: string): string {
  const words = plain.split(/\s+/).filter(Boolean);
  if (words.length === 0) return "";
  const introCount = Math.max(1, Math.ceil(words.length * 0.1));
  return words.slice(0, introCount).join(" ");
}

const TITLE_POWER_WORDS = [
  "amazing",
  "best",
  "complete",
  "easy",
  "essential",
  "exclusive",
  "free",
  "incredible",
  "instant",
  "instantly",
  "latest",
  "powerful",
  "proven",
  "quick",
  "quickly",
  "secret",
  "simple",
  "step-by-step",
  "ultimate",
  "useful",
];

const TITLE_POSITIVE_WORDS = [
  "amazing",
  "best",
  "better",
  "easy",
  "effective",
  "excellent",
  "free",
  "great",
  "helpful",
  "perfect",
  "powerful",
  "proven",
  "simple",
  "success",
  "useful",
  "win",
];

const TITLE_NEGATIVE_WORDS = [
  "avoid",
  "danger",
  "don't",
  "fail",
  "lose",
  "mistake",
  "never",
  "problem",
  "stop",
  "warning",
  "without",
  "worst",
];

function findTitleWords(title: string, dictionary: string[]): string[] {
  const hay = title.toLowerCase();
  return dictionary.filter((word) => {
    const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, "i").test(hay);
  });
}

function keywordAtStart(text: string, keyword: string): boolean {
  if (!keyword.trim()) return false;
  const plain = text.trim().toLowerCase();
  const kw = keyword.trim().toLowerCase();
  return plain.startsWith(kw) || plain.slice(0, 40).includes(kw);
}

function extractHeadingTexts(content: string, levels: Array<2 | 3> = [2, 3]): string[] {
  const headings: string[] = [];

  for (const level of levels) {
    const htmlRe = new RegExp(`<h${level}\\b[^>]*>([\\s\\S]*?)<\\/h${level}>`, "gi");
    let match: RegExpExecArray | null;
    while ((match = htmlRe.exec(content)) !== null) {
      const text = stripMarkdown(match[1]).replace(/\s+/g, " ").trim();
      if (text) headings.push(text);
    }

    const mdRe = new RegExp(`^#{${level}}\\s+(.+)$`, "gm");
    while ((match = mdRe.exec(content)) !== null) {
      const text = stripMarkdown(match[1]).replace(/\s+/g, " ").trim();
      if (text) headings.push(text);
    }
  }

  if (levels.includes(2)) {
    const sectionRe = /<(?:p|div|h2)\b[^>]*class=["'][^"']*blog-section-heading[^"']*["'][^>]*>([\s\S]*?)<\/(?:p|div|h2)>/gi;
    let match: RegExpExecArray | null;
    while ((match = sectionRe.exec(content)) !== null) {
      const text = stripMarkdown(match[1]).replace(/\s+/g, " ").trim();
      if (text && !headings.includes(text)) headings.push(text);
    }
  }

  return headings;
}

function extractParagraphs(content: string): string[] {
  const paragraphs: string[] = [];
  const pRe = /<p\b[^>]*>([\s\S]*?)<\/p>/gi;
  let match: RegExpExecArray | null;

  while ((match = pRe.exec(content)) !== null) {
    if (/blog-section-heading/i.test(match[0])) continue;
    const chunks = match[1].split(/<br\s*\/?>\s*(?:<br\s*\/?>)+/i);
    for (const chunk of chunks) {
      const text = stripMarkdown(chunk).replace(/\s+/g, " ").trim();
      if (text.split(/\s+/).filter(Boolean).length >= 6) paragraphs.push(text);
    }
  }

  if (paragraphs.length) return paragraphs;

  return stripMarkdown(content)
    .split(/\n{2,}/)
    .map((part) => part.replace(/\s+/g, " ").trim())
    .filter((part) => part.split(/\s+/).length >= 6);
}

function countRealListItems(content: string): number {
  const listBlocks: string[] = content.match(/<(?:ul|ol)\b[^>]*>[\s\S]*?<\/(?:ul|ol)>/gi) ?? [];
  let htmlItems = 0;
  for (const block of listBlocks) {
    htmlItems += block.match(/<li\b/gi)?.length ?? 0;
  }
  if (htmlItems >= 2) return htmlItems;

  const lines = content.split(/\n/);
  let run = 0;
  let best = 0;
  for (const line of lines) {
    const trimmed = line.trim();
    if (/^[-*•]\s+\S/.test(trimmed) || /^\d+[.)]\s+\S/.test(trimmed)) {
      run += 1;
      best = Math.max(best, run);
    } else if (trimmed) {
      run = 0;
    }
  }
  return best;
}

function countRichMedia(content: string, featuredImage = ""): number {
  const htmlImages = content.match(/<img\b/gi)?.length ?? 0;
  const markdownImages = content.match(/!\[[^\]]*]\([^)]+\)/g)?.length ?? 0;
  const videos =
    (content.match(/<video\b/gi)?.length ?? 0) +
    (content.match(/<iframe\b[^>]*(youtube|youtu\.be|vimeo)/gi)?.length ?? 0);
  const featured = featuredImage.trim() ? 1 : 0;
  return htmlImages + markdownImages + videos + featured;
}

function collectHrefs(content: string): string[] {
  const withoutImages = content.replace(/!\[[^\]]*]\([^)]+\)/g, " ");
  const hrefs: string[] = [];

  const quoted = /<a\b[^>]*\bhref\s*=\s*(["'])(.*?)\1/gi;
  let match: RegExpExecArray | null;
  while ((match = quoted.exec(withoutImages)) !== null) {
    hrefs.push(match[2]);
  }

  const markdown = /\[([^\]]+)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
  while ((match = markdown.exec(withoutImages)) !== null) {
    hrefs.push(match[2]);
  }

  return hrefs;
}

function classifyHref(href: string): "internal" | "external" | "ignore" {
  const raw = href.trim().replace(/&amp;/g, "&");
  if (!raw || raw.startsWith("#") || /^(mailto:|tel:|javascript:)/i.test(raw)) {
    return "ignore";
  }

  if (raw.startsWith("/")) return "internal";

  try {
    const parsed = new URL(raw, `${BLOG_CONFIG.siteUrl}/`);
    const siteHost = new URL(BLOG_CONFIG.siteUrl).hostname.replace(/^www\./, "");
    const host = parsed.hostname.replace(/^www\./, "");
    if (host === siteHost || host === "localhost") return "internal";
    if (parsed.protocol === "http:" || parsed.protocol === "https:") return "external";
  } catch {
    if (!raw.includes("://") && !raw.includes(" ")) return "internal";
  }

  return "ignore";
}

function countLinks(content: string): { internal: number; external: number } {
  const uniqueInternal = new Set<string>();
  const uniqueExternal = new Set<string>();

  for (const href of collectHrefs(content)) {
    const kind = classifyHref(href);
    if (kind === "internal") uniqueInternal.add(href.split("#")[0].toLowerCase());
    if (kind === "external") uniqueExternal.add(href.split("#")[0].toLowerCase());
  }

  return { internal: uniqueInternal.size, external: uniqueExternal.size };
}

function hasImage(content: string): boolean {
  return /<img\b/i.test(content) || /!\[([^\]]*)\]\(/.test(content);
}

function hasImageMissingAlt(content: string): boolean {
  const htmlMissingAlt = /<img\b(?![^>]*\balt=)[^>]*>/i.test(content);
  const htmlEmptyAlt = /<img\b[^>]*\balt=["']\s*["'][^>]*>/i.test(content);
  return htmlMissingAlt || htmlEmptyAlt || /!\[\s*\]\(/.test(content);
}

function uniqueKeywords(...groups: Array<string | string[] | undefined>): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const group of groups) {
    const values = Array.isArray(group) ? group : group ? [group] : [];
    for (const value of values) {
      const keyword = value.trim().replace(/\s+/g, " ");
      if (!keyword) continue;
      const key = keyword.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      result.push(keyword);
    }
  }

  return result;
}

function keywordDensity(text: string, keywords: string[]): number {
  const words = countWords(text);
  const unique = uniqueKeywords(keywords);
  if (words === 0 || unique.length === 0) return 0;
  const plain = stripMarkdown(text).toLowerCase();
  let weighted = 0;
  for (const keyword of unique) {
    const kw = keyword.toLowerCase();
    const matches = plain.split(kw).length - 1;
    weighted += matches * kw.split(/\s+/).length;
  }
  return (weighted / words) * 100;
}

function check(
  id: string,
  label: string,
  passed: boolean,
  partial: boolean,
  goodMsg: string,
  badMsg: string,
  weight: number,
  category: SeoCheckCategory
): SeoCheck {
  let status: SeoCheckStatus = "bad";
  let message = badMsg;
  if (passed) {
    status = "good";
    message = goodMsg;
  } else if (partial) {
    status = "ok";
    message = badMsg;
  }
  return { id, label, status, message, weight, category };
}

export interface ExistingFocusKeyword {
  id?: string;
  keyword: string;
  title?: string;
  status?: "draft" | "published";
}

function normalizeFocusKeyword(keyword: string): string {
  return keyword.trim().toLowerCase().replace(/\s+/g, " ");
}

function findDuplicateKeywords(
  focusKeyword: string,
  existing: ExistingFocusKeyword[] | undefined,
  currentPostId?: string
): ExistingFocusKeyword[] {
  const current = normalizeFocusKeyword(focusKeyword);
  if (!current || !existing?.length) return [];

  return existing.filter((item) => {
    if (currentPostId && item.id && item.id === currentPostId) return false;
    return normalizeFocusKeyword(item.keyword) === current;
  });
}

export function analyzeSeo(
  title: string,
  slug: string,
  metaDescription: string,
  focusKeyword: string,
  content: string,
  options?: {
    excerpt?: string;
    featuredImage?: string;
    featuredImageAlt?: string;
    secondaryKeywords?: string[];
    currentPostId?: string;
    existingFocusKeywords?: ExistingFocusKeyword[];
  }
): SeoScoreResult {
  const plain = stripMarkdown(content);
  const wordCount = countWords(content);
  const excerpt = options?.excerpt ?? "";
  const featuredImage = options?.featuredImage ?? "";
  const featuredImageAlt = options?.featuredImageAlt ?? "";
  const densityKeywords = uniqueKeywords(focusKeyword, options?.secondaryKeywords);
  const linkCounts = countLinks(content);
  const checks: SeoCheck[] = [];

  const titleLen = title.trim().length;
  checks.push(
    check(
      "title-length",
      "SEO title length",
      titleLen >= 30 && titleLen <= 60,
      titleLen >= 20 && titleLen <= 70,
      `${titleLen} characters — ideal range (30–60).`,
      `${titleLen} characters — aim for 30–60.`,
      8,
      "title_readability"
    )
  );

  checks.push(
    check(
      "title-keyword",
      "Focus keyword in title",
      keywordInText(title, focusKeyword),
      false,
      "Primary keyword appears in the SEO title (Google preview).",
      "Add the primary keyword to the SEO title so it can appear in Google preview.",
      10,
      "basic"
    )
  );

  checks.push(
    check(
      "title-keyword-start",
      "Keyword near title start",
      keywordAtStart(title, focusKeyword),
      keywordInText(title, focusKeyword),
      "Focus keyword appears early in the title — great for SEO.",
      "Move the focus keyword closer to the start of the title.",
      6,
      "title_readability"
    )
  );

  const titleHasNumber = /\d/.test(title);
  checks.push(
    check(
      "title-number",
      "Number in title",
      titleHasNumber,
      false,
      "Title contains a number — this often improves click-through.",
      "Add a number to the title (e.g. 5 steps, 2026, or 4.0 scale).",
      4,
      "title_readability"
    )
  );

  const powerWords = findTitleWords(title, TITLE_POWER_WORDS);
  checks.push(
    check(
      "title-power-words",
      "Power words in title",
      powerWords.length > 0,
      false,
      `Title uses a power word (${powerWords.slice(0, 3).join(", ")}).`,
      "Add a power word to the title (easy, best, simple, complete, proven, etc.).",
      4,
      "title_readability"
    )
  );

  const positiveWords = findTitleWords(title, TITLE_POSITIVE_WORDS);
  const negativeWords = findTitleWords(title, TITLE_NEGATIVE_WORDS);
  const sentimentWords = [...positiveWords, ...negativeWords];
  const sentimentLabel = positiveWords.length
    ? "positive"
    : negativeWords.length
      ? "negative"
      : "";
  checks.push(
    check(
      "title-sentiment",
      "Title sentiment",
      sentimentWords.length > 0,
      false,
      `Title has ${sentimentLabel} sentiment (${sentimentWords.slice(0, 3).join(", ")}).`,
      "Add positive or negative sentiment to the title (easy, best, avoid, mistakes, etc.).",
      3,
      "title_readability"
    )
  );

  const metaLen = metaDescription.trim().length;
  checks.push(
    check(
      "meta-length",
      "Meta description length",
      metaLen >= 120 && metaLen <= 160,
      metaLen >= 90 && metaLen <= 170,
      `${metaLen} characters — ideal (120–160).`,
      `${metaLen} characters — aim for 120–160.`,
      8,
      "basic"
    )
  );

  checks.push(
    check(
      "meta-keyword",
      "Focus keyword in meta description",
      keywordInText(metaDescription, focusKeyword),
      false,
      "Primary keyword appears in the meta description (Google preview).",
      "Add the primary keyword to the meta description so it can appear in Google preview.",
      8,
      "basic"
    )
  );

  const slugKw = slug.replace(/-/g, " ");
  checks.push(
    check(
      "slug-keyword",
      "Focus keyword in URL",
      keywordInText(slugKw, focusKeyword) ||
        keywordInText(slug, focusKeyword.replace(/\s+/g, "-")),
      slug.includes(focusKeyword.split(/\s+/)[0]?.toLowerCase() ?? ""),
      "URL slug relates to your focus keyword.",
      "Include the focus keyword (or part of it) in the URL slug.",
      6,
      "basic"
    )
  );

  checks.push(
    check(
      "url-length",
      "URL length",
      slug.length >= 8 && slug.length <= 60,
      slug.length <= 75,
      "URL slug length is good for sharing and SEO.",
      slug.length > 75
        ? "URL slug is too long — shorten it."
        : "URL slug is very short — add descriptive words.",
      4,
      "additional"
    )
  );

  checks.push(
    check(
      "featured-image",
      "Featured image",
      Boolean(featuredImage.trim()),
      false,
      "Featured image is set — good for social and listings.",
      "Upload a featured image for this article.",
      6,
      "additional"
    )
  );

  const keywordDupes = findDuplicateKeywords(
    focusKeyword,
    options?.existingFocusKeywords,
    options?.currentPostId
  );
  const publishedDupes = keywordDupes.filter((item) => item.status === "published");
  const otherDupes = publishedDupes.length ? publishedDupes : keywordDupes;
  const dupeTitle = otherDupes[0]?.title?.trim() || "another article";
  checks.push(
    check(
      "keyword-unique",
      "Primary keyword unused elsewhere",
      Boolean(focusKeyword.trim()) && keywordDupes.length === 0,
      !focusKeyword.trim() || (keywordDupes.length > 0 && publishedDupes.length === 0),
      "Primary keyword is unique — not used on another article.",
      !focusKeyword.trim()
        ? "Set a primary keyword to check if it is already used on another article."
        : publishedDupes.length
          ? `Primary keyword is already used on “${dupeTitle}”. Choose a different focus keyword.`
          : `Primary keyword is already used on the draft “${dupeTitle}”.`,
      6,
      "additional"
    )
  );

  const introText = getIntroText(plain);
  checks.push(
    check(
      "intro-keyword",
      "Keyword in introduction",
      keywordInText(introText, focusKeyword),
      false,
      "Focus keyword appears in the first 10% of the content.",
      "Add the focus keyword in the first 10% of the article (usually the opening paragraph).",
      8,
      "basic"
    )
  );

  const h2Texts = extractHeadingTexts(content, [2]);
  const h3Texts = extractHeadingTexts(content, [3]);
  const headingTexts = [...h2Texts, ...h3Texts];
  const headingHasKw = headingTexts.some((heading) => keywordInText(heading, focusKeyword));
  checks.push(
    check(
      "heading-keyword",
      "Keyword in subheading (H2)",
      headingHasKw,
      h2Texts.length > 0 || h3Texts.length > 0,
      "Focus keyword appears in a subheading (H2/H3).",
      headingTexts.length === 0
        ? "Add H2 subheadings using the toolbar."
        : "Add the focus keyword to at least one H2 or H3 heading.",
      6,
      "additional"
    )
  );

  checks.push(
    check(
      "content-length",
      "Content length",
      wordCount >= 1000,
      wordCount >= 600,
      `${wordCount} words — excellent depth for rankings.`,
      wordCount >= 300
        ? `${wordCount} words — OK, but 600+ is better.`
        : `Only ${wordCount} words — write at least 300.`,
      10,
      "basic"
    )
  );

  const density = keywordDensity(content, densityKeywords);
  const extraCount = Math.max(0, densityKeywords.length - (focusKeyword.trim() ? 1 : 0));
  const densityHint =
    extraCount > 0 ? ` (primary + ${extraCount} secondary)` : "";
  const densityPct = density.toFixed(2);
  const densityPassed = density >= 1 && density <= 3;
  const densityPartial =
    (density > 0 && density < 1) || (density > 3 && density < 4.5);
  const densityBadMsg =
    density === 0
      ? "Focus keyword not found in content body. Add it, or use secondary keywords to cover related phrases."
      : density < 1
        ? `Density ${densityPct}%${densityHint} — below 1%. Add the primary keyword more often, or use secondary keywords.`
        : density >= 4.5
          ? `Density ${densityPct}%${densityHint} — too high (over 4.5%). Reduce keyword repetition to avoid stuffing.`
          : `Density ${densityPct}%${densityHint} — slightly above ideal (1–3%). Use synonyms or related phrases instead of repeating the keyword.`;
  checks.push(
    check(
      "keyword-density",
      "Keyword density",
      densityPassed,
      densityPartial,
      `Keyword density is ${densityPct}%${densityHint} — healthy range (1–3%).`,
      densityBadMsg,
      6,
      "additional"
    )
  );

  const minInternalLinks = 4;
  checks.push(
    check(
      "internal-links",
      "Internal links",
      linkCounts.internal >= minInternalLinks,
      linkCounts.internal >= 1,
      `${linkCounts.internal} internal links — good for site navigation.`,
      linkCounts.internal === 0
        ? "Add at least 4 internal links to calculators or other pages on your site."
        : `${linkCounts.internal} internal link${linkCounts.internal === 1 ? "" : "s"} found — add ${minInternalLinks - linkCounts.internal} more to reach 4.`,
      6,
      "additional"
    )
  );

  checks.push(
    check(
      "external-links",
      "Outbound links",
      linkCounts.external >= 1,
      false,
      "Article cites an official or external reference.",
      "Add at least one official source or reference link (university site, UGC, etc.).",
      4,
      "additional"
    )
  );

  const hasContentImages = hasImage(content);
  const imagesMissingAlt = hasImageMissingAlt(content);
  const featuredHasAlt = Boolean(featuredImage.trim() && featuredImageAlt.trim());
  const imagesPassed =
    (hasContentImages && !imagesMissingAlt) || (!hasContentImages && featuredHasAlt);
  checks.push(
    check(
      "images",
      "Images with alt text",
      imagesPassed,
      hasContentImages || Boolean(featuredImage.trim()),
      "Images include alt text for accessibility and SEO.",
      hasContentImages && imagesMissingAlt
        ? "Some article images are missing alt text."
        : featuredImage.trim() && !featuredImageAlt.trim()
          ? "Add alt text for the featured image."
          : "Add at least one image with descriptive alt text.",
      5,
      "additional"
    )
  );

  const hasH2 = h2Texts.length > 0;
  checks.push(
    check(
      "structure",
      "Heading structure",
      h2Texts.length >= 1,
      h3Texts.length > 0,
      `Good heading structure — ${h2Texts.length} H2 section${h2Texts.length === 1 ? "" : "s"}.`,
      h3Texts.length > 0
        ? "H3 headings found — add H2 subheadings from the toolbar to structure the article."
        : "Break content into sections with H2 headings (page title is H1).",
      5,
      "content_readability"
    )
  );

  const paragraphs = extractParagraphs(content);
  const longParagraphs = paragraphs.filter((p) => p.split(/\s+/).length > 120);
  checks.push(
    check(
      "paragraph-length",
      "Short paragraphs",
      longParagraphs.length === 0 && paragraphs.length >= 2,
      longParagraphs.length === 0 || paragraphs.length >= 2,
      "Paragraphs are a readable length.",
      longParagraphs.length > 0
        ? `${longParagraphs.length} paragraph${longParagraphs.length === 1 ? "" : "s"} still over 120 words — split them for readability.`
        : "Add more short paragraphs so the article is easier to scan.",
      4,
      "content_readability"
    )
  );

  const listItems = countRealListItems(content);
  checks.push(
    check(
      "lists",
      "Lists for scanability",
      listItems >= 2,
      false,
      "Content uses bullet or numbered lists.",
      "Add a bullet or numbered list to make key points easy to scan.",
      4,
      "content_readability"
    )
  );

  const richMediaCount = countRichMedia(content, featuredImage);
  const minRichMedia = 3;
  checks.push(
    check(
      "rich-media",
      "Rich media",
      richMediaCount >= minRichMedia,
      richMediaCount >= 1,
      `${richMediaCount} images/videos in the article — good use of rich media.`,
      richMediaCount === 0
        ? "Add at least 3 images or videos in the article."
        : `${richMediaCount} image${richMediaCount === 1 ? "" : "s"} found — add ${minRichMedia - richMediaCount} more (minimum 3).`,
      4,
      "content_readability"
    )
  );

  const hasQuote =
    /^>\s/m.test(content) || /<blockquote/i.test(content);
  checks.push(
    check(
      "rich-blocks",
      "Quotes or callouts",
      hasQuote,
      false,
      "Content uses quotes or pull quotes for emphasis.",
      "Use block quotes or pull quotes to highlight key points.",
      3,
      "content_readability"
    )
  );

  checks.push(
    check(
      "excerpt",
      "Excerpt / summary",
      excerpt.trim().length >= 50,
      excerpt.trim().length >= 20,
      "Excerpt is set for the blog listing page.",
      "Write a short excerpt (50+ characters) for the blog index.",
      4,
      "basic"
    )
  );

  let earned = 0;
  let total = 0;
  let goodCount = 0;
  let okCount = 0;
  let badCount = 0;

  for (const c of checks) {
    total += c.weight;
    if (c.status === "good") {
      earned += c.weight;
      goodCount++;
    } else if (c.status === "ok") {
      earned += c.weight * 0.5;
      okCount++;
    } else {
      badCount++;
    }
  }

  const score = total > 0 ? Math.round((earned / total) * 100) : 0;

  return { score, checks, wordCount, goodCount, okCount, badCount };
}

export function scoreColor(score: number): string {
  if (score >= 80) return "var(--forest-600)";
  if (score >= 50) return "var(--amber-500)";
  return "var(--rose-600)";
}

export function scoreLabel(score: number): string {
  if (score >= 80) return "Good";
  if (score >= 50) return "Needs work";
  return "Poor";
}

export const SEO_CATEGORY_LABELS: Record<SeoCheckCategory, string> = {
  basic: "Basic SEO",
  additional: "Additional",
  title_readability: "Title Readability",
  content_readability: "Content Readability",
};
