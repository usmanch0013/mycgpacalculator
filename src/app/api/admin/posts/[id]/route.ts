import { NextResponse } from "next/server";
import { deletePost, getPostById, updatePost } from "@/lib/blog/storage";
import { safeFlushGitSyncQueue } from "@/lib/blog/github-sync";
import { revalidateBlogPaths } from "@/lib/blog/revalidate";
import type { BlogPostInput } from "@/lib/blog/types";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const post = await getPostById(id);
    if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(post);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to load post" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const existing = await getPostById(id);
    const body = (await request.json()) as Partial<BlogPostInput> & { syncGit?: boolean };
    const { syncGit, ...input } = body;
    const post = await updatePost(id, input);
    const syncWarning = syncGit ? await safeFlushGitSyncQueue() : null;
    revalidateBlogPaths(post.slug, existing?.slug);
    return NextResponse.json(syncWarning ? { ...post, syncWarning } : post);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to update post" },
      { status: 400 }
    );
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const existing = await getPostById(id);
    await deletePost(id);
    const syncWarning = await safeFlushGitSyncQueue();
    revalidateBlogPaths(existing?.slug);
    return NextResponse.json({ ok: true, syncWarning });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to delete post" },
      { status: 400 }
    );
  }
}
