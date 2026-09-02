import { NextResponse } from "next/server";
import { duplicatePost } from "@/lib/blog/storage";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const post = await duplicatePost(id);
    return NextResponse.json(post, { status: 201 });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to duplicate post" },
      { status: 400 }
    );
  }
}
