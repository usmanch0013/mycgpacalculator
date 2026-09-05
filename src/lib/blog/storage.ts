import { promises as fs } from "fs";
import path from "path";
import { generateSlug } from "./utils";
import { validatePostSlug } from "./paths";
import { blogRelativePath, queueGitDelete, queueGitUpsert } from "./github-sync";
import { getCategories, normalizeCategorySlugs } from "./categories";
import type { BlogCategory, BlogPost, BlogPostInput } from "./types";

const BLOG_DIR = path.join(process.cwd(), "content/blog");

function postPath(slug: string): string {
  return path.join(BLOG_DIR, `${slug}.json`);
}

async function ensureDir(): Promise<void> {
  await fs.mkdir(BLOG_DIR, { recursive: true });
}

export async function getAllPosts(): Promise<BlogPost[]> {
  await ensureDir();
  const files = await fs.readdir(BLOG_DIR);
  const posts: BlogPost[] = [];

  for (const file of files) {
    if (!file.endsWith(".json")) continue;
    try {
      const raw = await fs.readFile(path.join(BLOG_DIR, file), "utf8");
      posts.push(JSON.parse(raw) as BlogPost);
    } catch {
      /* skip invalid */
    }
  }

  return posts.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export async function getPublishedPosts(): Promise<BlogPost[]> {
  const all = await getAllPosts();
  return all.filter((p) => p.status === "published");
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const raw = await fs.readFile(postPath(slug), "utf8");
    return JSON.parse(raw) as BlogPost;
  } catch {
    return null;
  }
}

export async function getPostById(id: string): Promise<BlogPost | null> {
  const all = await getAllPosts();
  return all.find((p) => p.id === id) ?? null;
}

const MAX_SECONDARY_KEYWORDS = 6;

export function normalizeSecondaryKeywords(
  keywords: unknown,
  primary = ""
): string[] {
  if (!Array.isArray(keywords)) return [];

  const seen = new Set<string>();
  const primaryKey = primary.trim().toLowerCase();
  const cleaned: string[] = [];

  for (const item of keywords) {
    if (typeof item !== "string") continue;
    const value = item.trim().replace(/\s+/g, " ");
    if (!value) continue;
    const key = value.toLowerCase();
    if (key === primaryKey || seen.has(key)) continue;
    seen.add(key);
    cleaned.push(value);
    if (cleaned.length >= MAX_SECONDARY_KEYWORDS) break;
  }

  return cleaned;
}

async function uniqueDraftSlug(preferred: string): Promise<string> {
  const base = preferred.trim() || `draft-${Date.now().toString(36)}`;
  let slug = base;
  let n = 2;
  while (await getPostBySlug(slug)) {
    slug = `${base}-${n}`;
    n += 1;
  }
  return slug;
}

export async function createPost(input: BlogPostInput): Promise<BlogPost> {
  await ensureDir();
  const slug = await uniqueDraftSlug(input.slug.trim() || generateSlug(input.title));
  const slugError = validatePostSlug(slug);
  if (slugError) throw new Error(slugError);
  const existing = await getPostBySlug(slug);
  if (existing) {
    throw new Error("A post with this slug already exists.");
  }

  const now = new Date().toISOString();
  const post: BlogPost = {
    id: crypto.randomUUID(),
    slug,
    title: input.title.trim(),
    focusKeyword: input.focusKeyword.trim(),
    secondaryKeywords: normalizeSecondaryKeywords(input.secondaryKeywords, input.focusKeyword),
    metaDescription: input.metaDescription.trim(),
    excerpt: input.excerpt.trim(),
    content: input.content,
    status: input.status,
    publishedAt: input.publishedAt ?? now,
    updatedAt: now,
    author: input.author?.trim() || "CGPA Calculator Pro",
    featuredImage: input.featuredImage?.trim() || undefined,
    featuredImageAlt: input.featuredImageAlt?.trim() || undefined,
    featuredImageTitle: input.featuredImageTitle?.trim() || undefined,
    featuredImageDescription: input.featuredImageDescription?.trim() || undefined,
    categories: normalizeCategorySlugs(input.categories),
  };

  await fs.writeFile(postPath(slug), JSON.stringify(post, null, 2), "utf8");
  queueGitUpsert(blogRelativePath(postPath(slug)), postPath(slug));
  return post;
}

export async function updatePost(
  id: string,
  input: Partial<BlogPostInput>
): Promise<BlogPost> {
  const existing = await getPostById(id);
  if (!existing) throw new Error("Post not found.");

  const newSlug = input.slug?.trim() || existing.slug;
  const slugError = validatePostSlug(newSlug);
  if (slugError) throw new Error(slugError);
  if (newSlug !== existing.slug) {
    const clash = await getPostBySlug(newSlug);
    if (clash && clash.id !== id) throw new Error("Slug already in use.");
    try {
      await fs.unlink(postPath(existing.slug));
      queueGitDelete(blogRelativePath(postPath(existing.slug)));
    } catch {
      /* ok */
    }
  }

  const post: BlogPost = {
    ...existing,
    slug: newSlug,
    title: input.title !== undefined ? input.title.trim() : existing.title,
    focusKeyword:
      input.focusKeyword !== undefined ? input.focusKeyword.trim() : existing.focusKeyword,
    secondaryKeywords:
      input.secondaryKeywords !== undefined
        ? normalizeSecondaryKeywords(
            input.secondaryKeywords,
            input.focusKeyword !== undefined ? input.focusKeyword : existing.focusKeyword
          )
        : normalizeSecondaryKeywords(existing.secondaryKeywords, existing.focusKeyword),
    metaDescription:
      input.metaDescription !== undefined ? input.metaDescription.trim() : existing.metaDescription,
    excerpt: input.excerpt !== undefined ? input.excerpt.trim() : existing.excerpt,
    content: input.content !== undefined ? input.content : existing.content,
    status: input.status !== undefined ? input.status : existing.status,
    publishedAt: input.publishedAt !== undefined ? input.publishedAt : existing.publishedAt,
    updatedAt: new Date().toISOString(),
    author: input.author !== undefined ? input.author.trim() : existing.author,
    featuredImage:
      input.featuredImage !== undefined
        ? input.featuredImage.trim() || undefined
        : existing.featuredImage,
    featuredImageAlt:
      input.featuredImageAlt !== undefined
        ? input.featuredImageAlt.trim() || undefined
        : existing.featuredImageAlt,
    featuredImageTitle:
      input.featuredImageTitle !== undefined
        ? input.featuredImageTitle.trim() || undefined
        : existing.featuredImageTitle,
    featuredImageDescription:
      input.featuredImageDescription !== undefined
        ? input.featuredImageDescription.trim() || undefined
        : existing.featuredImageDescription,
    categories:
      input.categories !== undefined
        ? normalizeCategorySlugs(input.categories)
        : normalizeCategorySlugs(existing.categories),
  };

  await fs.writeFile(postPath(newSlug), JSON.stringify(post, null, 2), "utf8");
  queueGitUpsert(blogRelativePath(postPath(newSlug)), postPath(newSlug));
  return post;
}

export async function deletePost(id: string): Promise<void> {
  const post = await getPostById(id);
  if (!post) throw new Error("Post not found.");
  await fs.unlink(postPath(post.slug));
  queueGitDelete(blogRelativePath(postPath(post.slug)));
}

export async function duplicatePost(id: string): Promise<BlogPost> {
  const existing = await getPostById(id);
  if (!existing) throw new Error("Post not found.");
  return createPost({
    title: existing.title.trim() ? `${existing.title} (Copy)` : "Untitled (Copy)",
    slug: `${existing.slug}-copy`,
    focusKeyword: existing.focusKeyword,
    secondaryKeywords: existing.secondaryKeywords,
    metaDescription: existing.metaDescription,
    excerpt: existing.excerpt,
    content: existing.content,
    status: "draft",
    author: existing.author,
    featuredImage: existing.featuredImage,
    featuredImageAlt: existing.featuredImageAlt,
    featuredImageTitle: existing.featuredImageTitle,
    featuredImageDescription: existing.featuredImageDescription,
    categories: existing.categories,
  });
}

export interface BlogBackupPayload {
  version: 1;
  exportedAt: string;
  posts: BlogPost[];
  categories?: BlogCategory[];
}

export async function exportAllPosts(): Promise<BlogBackupPayload> {
  const [posts, categories] = await Promise.all([getAllPosts(), getCategories()]);
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    posts,
    categories,
  };
}

export async function importPosts(
  posts: BlogPost[],
  mode: "merge" | "replace" = "merge"
): Promise<number> {
  await ensureDir();

  if (mode === "replace") {
    const existing = await getAllPosts();
    for (const post of existing) {
      try {
        await fs.unlink(postPath(post.slug));
        queueGitDelete(blogRelativePath(postPath(post.slug)));
      } catch {
        /* ok */
      }
    }
  }

  let imported = 0;
  for (const raw of posts) {
    if (!raw?.id || !raw?.slug || typeof raw.content !== "string") continue;

    const slugError = validatePostSlug(raw.slug.trim().toLowerCase());
    if (slugError) continue;

    const post: BlogPost = {
      id: raw.id,
      slug: raw.slug.trim().toLowerCase(),
      title: raw.title?.trim() ?? "",
      focusKeyword: raw.focusKeyword?.trim() ?? "",
      secondaryKeywords: normalizeSecondaryKeywords(raw.secondaryKeywords, raw.focusKeyword),
      metaDescription: raw.metaDescription?.trim() ?? "",
      excerpt: raw.excerpt?.trim() ?? "",
      content: raw.content,
      status: raw.status === "published" ? "published" : "draft",
      publishedAt: raw.publishedAt || new Date().toISOString(),
      updatedAt: raw.updatedAt || new Date().toISOString(),
      author: raw.author?.trim() || "CGPA Calculator Pro",
      featuredImage: raw.featuredImage?.trim() || undefined,
      featuredImageAlt: raw.featuredImageAlt?.trim() || undefined,
      featuredImageTitle: raw.featuredImageTitle?.trim() || undefined,
      featuredImageDescription: raw.featuredImageDescription?.trim() || undefined,
      categories: normalizeCategorySlugs(raw.categories),
    };

    if (mode === "merge") {
      const byId = await getPostById(post.id);
      if (byId && byId.slug !== post.slug) {
        try {
          await fs.unlink(postPath(byId.slug));
          queueGitDelete(blogRelativePath(postPath(byId.slug)));
        } catch {
          /* ok */
        }
      }
    }

    await fs.writeFile(postPath(post.slug), JSON.stringify(post, null, 2), "utf8");
    queueGitUpsert(blogRelativePath(postPath(post.slug)), postPath(post.slug));
    imported += 1;
  }

  return imported;
}
