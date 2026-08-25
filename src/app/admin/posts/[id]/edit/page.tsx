import { notFound } from "next/navigation";
import PostEditor from "@/components/admin/PostEditor";
import { getPostById } from "@/lib/blog/storage";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: PageProps) {
  const { id } = await params;
  const post = await getPostById(id);
  if (!post) notFound();
  return <PostEditor mode="edit" post={post} />;
}
