import { randomBytes } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { queueGitUpsert, safeFlushGitSyncQueue } from "@/lib/blog/github-sync";

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);
const MAX_BYTES = 5 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: "Only JPG, PNG, WebP, and GIF images are allowed" },
        { status: 400 }
      );
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: "Image must be smaller than 5 MB" },
        { status: 400 }
      );
    }

    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const safeExt = ["jpg", "jpeg", "png", "webp", "gif"].includes(ext)
      ? ext.replace("jpeg", "jpg")
      : "jpg";
    const filename = `${Date.now()}-${randomBytes(6).toString("hex")}.${safeExt}`;
    const dir = path.join(process.cwd(), "public", "blog-images");

    await mkdir(dir, { recursive: true });
    const buffer = Buffer.from(await file.arrayBuffer());
    const absolutePath = path.join(dir, filename);
    await writeFile(absolutePath, buffer);
    queueGitUpsert(`public/blog-images/${filename}`, absolutePath);
    await safeFlushGitSyncQueue();

    return NextResponse.json({ url: `/blog-images/${filename}` });
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
