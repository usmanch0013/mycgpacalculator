import { NextResponse } from "next/server";
import { deletePost, duplicatePost, updatePost } from "@/lib/blog/storage";

type BulkAction = "delete" | "publish" | "draft" | "duplicate";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { action?: BulkAction; ids?: string[] };
    const ids = Array.isArray(body.ids) ? body.ids.filter(Boolean) : [];
    if (!ids.length) {
      return NextResponse.json({ error: "Select at least one article." }, { status: 400 });
    }

    if (body.action === "delete") {
      for (const id of ids) await deletePost(id);
      return NextResponse.json({ ok: true, count: ids.length });
    }

    if (body.action === "publish" || body.action === "draft") {
      for (const id of ids) await updatePost(id, { status: body.action === "publish" ? "published" : "draft" });
      return NextResponse.json({ ok: true, count: ids.length });
    }

    if (body.action === "duplicate") {
      const created = [];
      for (const id of ids) created.push(await duplicatePost(id));
      return NextResponse.json({ ok: true, count: created.length, posts: created });
    }

    return NextResponse.json({ error: "Unknown action." }, { status: 400 });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Bulk action failed" },
      { status: 400 }
    );
  }
}
