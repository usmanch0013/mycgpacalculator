import { NextResponse } from "next/server";
import { exportAllPosts, importPosts } from "@/lib/blog/storage";
import { revalidateBlogPaths } from "@/lib/blog/revalidate";
import type { BlogPost } from "@/lib/blog/types";

export async function GET() {
  try {
    const backup = await exportAllPosts();
    const stamp = new Date().toISOString().slice(0, 10);
    return new NextResponse(JSON.stringify(backup, null, 2), {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Disposition": `attachment; filename="cgpa-blog-backup-${stamp}.json"`,
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
      mode?: "merge" | "replace";
    };
    const posts = Array.isArray(body.posts) ? body.posts : [];
    if (!posts.length) {
      return NextResponse.json({ error: "No articles found in backup file." }, { status: 400 });
    }

    const mode = body.mode === "replace" ? "replace" : "merge";
    const count = await importPosts(posts, mode);
    revalidateBlogPaths();

    return NextResponse.json({ ok: true, count });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Import failed" },
      { status: 400 }
    );
  }
}
