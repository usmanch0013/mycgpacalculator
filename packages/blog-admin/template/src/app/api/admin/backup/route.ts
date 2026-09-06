import { NextResponse } from "next/server";
import { BLOG_CONFIG } from "@/lib/blog/config";
import { importCategories } from "@/lib/blog/categories";
import { exportAllPosts, importPosts } from "@/lib/blog/storage";
import { safeFlushGitSyncQueue } from "@/lib/blog/github-sync";
import { revalidateBlogPaths } from "@/lib/blog/revalidate";
import type { BlogCategory, BlogPost } from "@/lib/blog/types";

export async function GET() {
  try {
    const backup = await exportAllPosts();
    const stamp = new Date().toISOString().slice(0, 10);
    return new NextResponse(JSON.stringify(backup, null, 2), {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Disposition": `attachment; filename="${BLOG_CONFIG.backupFilenamePrefix}-${stamp}.json"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Export failed" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      posts?: BlogPost[];
      categories?: BlogCategory[];
      mode?: "merge" | "replace";
    };
    const posts = Array.isArray(body.posts) ? body.posts : [];
    if (!posts.length) {
      return NextResponse.json({ error: "No articles found in backup file." }, { status: 400 });
    }

    const mode = body.mode === "replace" ? "replace" : "merge";
    if (Array.isArray(body.categories) && body.categories.length) {
      await importCategories(body.categories);
    }
    const count = await importPosts(posts, mode);
    const syncWarning = await safeFlushGitSyncQueue();
    revalidateBlogPaths();

    return NextResponse.json({ ok: true, count, syncWarning });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Import failed" },
      { status: 400 }
    );
  }
}
