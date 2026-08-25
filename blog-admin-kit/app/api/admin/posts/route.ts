import { NextResponse } from "next/server";
import { createPost, getAllPosts } from "@/lib/blog/storage";
import type { BlogPostInput } from "@/lib/blog/types";

export async function GET() {
  try {
    const posts = await getAllPosts();
    return NextResponse.json(posts);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to load posts" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as BlogPostInput;
    const post = await createPost(body);
    return NextResponse.json(post, { status: 201 });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to create post" },
      { status: 400 }
    );
  }
}
