import { revalidatePath } from "next/cache";
import { getPostPath } from "@/lib/blog/paths";

export function revalidateBlogPaths(slug?: string, previousSlug?: string) {
  revalidatePath("/blog");
  revalidatePath("/sitemap.xml");

  if (slug) {
    revalidatePath(getPostPath(slug));
  }
  if (previousSlug && previousSlug !== slug) {
    revalidatePath(getPostPath(previousSlug));
  }
}
