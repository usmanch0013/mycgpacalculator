import { NextResponse } from "next/server";
import { createCategory, getCategories } from "@/lib/blog/categories";
import { safeFlushGitSyncQueue } from "@/lib/blog/github-sync";

export async function GET() {
  try {
    const categories = await getCategories();
    return NextResponse.json(categories);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to load categories" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { name?: string; syncGit?: boolean };
    const category = await createCategory(body.name ?? "");
    const syncWarning = body.syncGit ? await safeFlushGitSyncQueue() : null;
    return NextResponse.json(syncWarning ? { ...category, syncWarning } : category, { status: 201 });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to create category" },
      { status: 400 }
    );
  }
}
