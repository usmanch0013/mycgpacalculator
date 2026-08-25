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
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]+`/g, " ")
    .replace(/#{1,6}\s/g, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .trim();
}

function keywordInText(text: string, keyword: string): boolean {
  if (!keyword.trim()) return false;
  return text.toLowerCase().includes(keyword.trim().toLowerCase());
}

function keywordAtStart(text: string, keyword: string): boolean {
  if (!keyword.trim()) return false;
  const plain = text.trim().toLowerCase();
  const kw = keyword.trim().toLowerCase();
  return plain.startsWith(kw) || plain.slice(0, 40).includes(kw);
}

function keywordDensity(text: string, keyword: string): number {
  const words = countWords(text);
  if (words === 0 || !keyword.trim()) return 0;
  const kw = keyword.trim().toLowerCase();
  const plain = stripMarkdown(text).toLowerCase();
  const matches = plain.split(kw).length - 1;
  const kwWordCount = kw.split(/\s+/).length;
  return (matches * kwWordCount / words) * 100;
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

export function analyzeSeo(
  title: string,
  slug: string,
  metaDescription: string,
  focusKeyword: string,
  content: string,
  options?: { excerpt?: string; featuredImage?: string }
): SeoScoreResult {
  const plain = stripMarkdown(content);
  const wordCount = countWords(content);
  const excerpt = options?.excerpt ?? "";
  const featuredImage = options?.featuredImage ?? "";
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
      "Focus keyword appears in the title.",
      "Add your focus keyword to the title.",
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
      "Focus keyword appears in the meta description.",
      "Add the focus keyword to your meta description.",
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

  const firstChunk = plain.slice(0, Math.max(plain.length * 0.1, 200));
  checks.push(
    check(
      "intro-keyword",
      "Keyword in introduction",
      keywordInText(firstChunk, focusKeyword),
      false,
      "Focus keyword appears early in the content.",
      "Use the focus keyword in the first paragraph or two.",
      8,
      "basic"
    )
  );

  const h2Matches = content.match(/^##\s+.+$/gm) ?? [];
  const h2HasKw = h2Matches.some((h) => keywordInText(h, focusKeyword));
  checks.push(
    check(
      "heading-keyword",
      "Keyword in subheading (H2)",
      h2HasKw,
      h2Matches.length > 0,
      "Focus keyword appears in a subheading (H2).",
      h2Matches.length === 0
        ? "Add H2 subheadings using the toolbar."
        : "Add the focus keyword to at least one H2 heading.",
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

  const density = keywordDensity(content, focusKeyword);
  checks.push(
    check(
      "keyword-density",
      "Keyword density",
      density >= 0.5 && density <= 2.5,
      density > 0 && density < 3.5,
      `Keyword density is ${density.toFixed(2)}% — healthy range.`,
      density === 0
        ? "Focus keyword not found in content body."
        : `Density ${density.toFixed(2)}% — aim for 0.5–2.5%.`,
      6,
      "additional"
    )
  );

  const hasInternal = /\[([^\]]+)\]\(\/(blog|calculators|salary|hourly|faq|contact)/.test(
    content
  );
  checks.push(
    check(
      "internal-links",
      "Internal links",
      hasInternal,
      /\[([^\]]+)\]\(\//.test(content),
      "Content includes internal links to your site.",
      "Add links to calculators or other pages on your site.",
      6,
      "additional"
    )
  );

  const hasExternal = /\[([^\]]+)\]\(https?:\/\//.test(content);
  checks.push(
    check(
      "external-links",
      "Outbound links",
      hasExternal,
      false,
      "Article links to external sources — builds trust.",
      "Consider citing an official source (ATO, Fair Work, etc.).",
      4,
      "additional"
    )
  );

  const hasImages = /!\[([^\]]*)\]\(/.test(content);
  const imagesMissingAlt = /!\[\s*\]\(/.test(content);
  checks.push(
    check(
      "images",
      "Images with alt text",
      hasImages && !imagesMissingAlt,
      hasImages,
      "Images include alt text for accessibility and SEO.",
      hasImages
        ? "Some images are missing alt text."
        : "Add at least one image with descriptive alt text.",
      5,
      "additional"
    )
  );

  const hasH2 = /^##\s/m.test(content);
  checks.push(
    check(
      "structure",
      "Heading structure",
      hasH2 && /^#\s/m.test(content) === false,
      hasH2,
      "Good heading structure with H2 sections.",
      "Break content into sections with H2 headings (page title is H1).",
      5,
      "content_readability"
    )
  );

  const paragraphs = plain.split(/\n\n+/).filter((p) => p.trim().length > 0);
  const longParagraphs = paragraphs.filter((p) => p.split(/\s+/).length > 150);
  checks.push(
    check(
      "paragraph-length",
      "Short paragraphs",
      longParagraphs.length === 0 && paragraphs.length >= 3,
      longParagraphs.length === 0,
      "Paragraphs are readable length.",
      longParagraphs.length > 0
        ? "Some paragraphs are very long — split them for readability."
        : "Add more content sections with short paragraphs.",
      4,
      "content_readability"
    )
  );

  const hasLists = /^[-*]\s/m.test(content) || /^\d+\.\s/m.test(content);
  checks.push(
    check(
      "lists",
      "Lists for scanability",
      hasLists,
      false,
      "Content uses bullet or numbered lists.",
      "Add a bullet list to make key points easy to scan.",
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
