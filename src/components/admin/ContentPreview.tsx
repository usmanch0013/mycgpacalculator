"use client";

import { renderMarkdown } from "@/lib/blog/markdown";

interface ContentPreviewProps {
  content: string;
}

export default function ContentPreview({ content }: ContentPreviewProps) {
  const html = renderMarkdown(content || "");

  return (
    <div className="content-editor__preview">
      <p className="content-editor__preview-label">Live preview</p>
      <div
        className="content-editor__preview-body blog-article__prose"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
