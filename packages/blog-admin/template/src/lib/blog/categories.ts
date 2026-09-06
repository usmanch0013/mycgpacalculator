import { promises as fs } from "fs";
import path from "path";
import { generateSlug } from "./utils";
import { blogRelativePath, queueGitUpsert } from "./github-sync";
import type { BlogCategory } from "./types";

const CATEGORIES_PATH = path.join(process.cwd(), "content/categories.json");
const MAX_CATEGORIES = 40;

function normalizeName(name: string): string {
  return name.trim().replace(/\s+/g, " ");
}

export function normalizeCategorySlugs(slugs: unknown): string[] {
  if (!Array.isArray(slugs)) return [];

  const seen = new Set<string>();
  const cleaned: string[] = [];

  for (const item of slugs) {
    if (typeof item !== "string") continue;
    const slug = generateSlug(item);
    if (!slug || seen.has(slug)) continue;
    seen.add(slug);
    cleaned.push(slug);
    if (cleaned.length >= 12) break;
  }

  return cleaned;
}

async function ensureFile(): Promise<void> {
  await fs.mkdir(path.dirname(CATEGORIES_PATH), { recursive: true });
  try {
    await fs.access(CATEGORIES_PATH);
  } catch {
    await fs.writeFile(CATEGORIES_PATH, "[]\n", "utf8");
  }
}

export async function getCategories(): Promise<BlogCategory[]> {
  await ensureFile();
  try {
    const raw = await fs.readFile(CATEGORIES_PATH, "utf8");
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];

    const seen = new Set<string>();
    const categories: BlogCategory[] = [];

    for (const item of parsed) {
      if (!item || typeof item !== "object") continue;
      const name = normalizeName(String((item as BlogCategory).name ?? ""));
      const slug = generateSlug(String((item as BlogCategory).slug || name));
      if (!name || !slug || seen.has(slug)) continue;
      seen.add(slug);
      categories.push({ slug, name });
    }

    return categories.sort((a, b) => a.name.localeCompare(b.name));
  } catch {
    return [];
  }
}

async function saveCategories(categories: BlogCategory[]): Promise<BlogCategory[]> {
  const sorted = [...categories].sort((a, b) => a.name.localeCompare(b.name));
  await fs.writeFile(CATEGORIES_PATH, `${JSON.stringify(sorted, null, 2)}\n`, "utf8");
  queueGitUpsert(blogRelativePath(CATEGORIES_PATH), CATEGORIES_PATH);
  return sorted;
}

export async function createCategory(name: string): Promise<BlogCategory> {
  const cleaned = normalizeName(name);
  if (!cleaned) throw new Error("Category name is required.");
  if (cleaned.length > 48) throw new Error("Category name is too long.");

  const categories = await getCategories();
  if (categories.length >= MAX_CATEGORIES) {
    throw new Error("Category limit reached.");
  }

  const existing = categories.find(
    (category) => category.name.toLowerCase() === cleaned.toLowerCase()
  );
  if (existing) return existing;

  let slug = generateSlug(cleaned);
  if (!slug) throw new Error("Enter a valid category name.");

  let n = 2;
  while (categories.some((category) => category.slug === slug)) {
    slug = `${generateSlug(cleaned)}-${n}`;
    n += 1;
  }

  const next = [...categories, { slug, name: cleaned }];
  await saveCategories(next);
  return { slug, name: cleaned };
}

export async function importCategories(incoming: BlogCategory[]): Promise<number> {
  const current = await getCategories();
  const bySlug = new Map(current.map((category) => [category.slug, category]));

  for (const item of incoming) {
    const name = normalizeName(item?.name ?? "");
    const slug = generateSlug(item?.slug || name);
    if (!name || !slug) continue;
    bySlug.set(slug, { slug, name });
  }

  const next = Array.from(bySlug.values());
  await saveCategories(next);
  return next.length;
}

export async function getCategoryBySlug(slug: string): Promise<BlogCategory | null> {
  const categories = await getCategories();
  return categories.find((category) => category.slug === slug) ?? null;
}

export function resolvePostCategories(
  slugs: string[] | undefined,
  catalog: BlogCategory[]
): BlogCategory[] {
  if (!slugs?.length) return [];
  const bySlug = new Map(catalog.map((category) => [category.slug, category]));
  return slugs
    .map((slug) => bySlug.get(slug))
    .filter((category): category is BlogCategory => Boolean(category));
}
