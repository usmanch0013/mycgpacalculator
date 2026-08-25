"use client";

import { useRef, useState, useCallback, useEffect } from "react";

interface ContentEditorProps {
  value: string;
  onChange: (value: string) => void;
  variant?: "default" | "canvas";
  wordCount?: number;
}

type ToolId =
  | "bold"
  | "italic"
  | "h2"
  | "h3"
  | "quote"
  | "pullquote"
  | "callout"
  | "ul"
  | "ol"
  | "link"
  | "image"
  | "hr"
  | "code";

interface ToolDef {
  id: ToolId;
  title: string;
  icon: React.ReactNode;
}

const ICON = {
  bold: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M8 11h4.5a2.5 2.5 0 0 0 0-5H8v5zm10 4.5a4.5 4.5 0 0 1-4.5 4.5H6V4h6.5a4.5 4.5 0 0 1 3.256 7.606A4.498 4.498 0 0 1 18 15.5zM8 13v5h5.5a2.5 2.5 0 0 0 0-5H8z" />
    </svg>
  ),
  italic: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M10 4v3h2.21l-3.42 14H6v3h8v-3h-2.21l3.42-14H18V4h-8z" />
    </svg>
  ),
  h2: <span className="ce-icon-text">H2</span>,
  h3: <span className="ce-icon-text">H3</span>,
  quote: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 0 1-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 0 1-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
    </svg>
  ),
  pullquote: <span className="ce-icon-text">PQ</span>,
  callout: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
    </svg>
  ),
  ul: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z" />
    </svg>
  ),
  ol: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M2 17h2v.5H3v1h1v1.5H3v1h2v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v2h14V5H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z" />
    </svg>
  ),
  link: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" />
    </svg>
  ),
  image: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
    </svg>
  ),
  hr: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M4 11h16v2H4z" />
    </svg>
  ),
  code: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M9.4 16.6 4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0 4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" />
    </svg>
  ),
};

const TOOL_GROUPS: { label: string; tools: ToolDef[] }[] = [
  {
    label: "Text",
    tools: [
      { id: "bold", title: "Bold", icon: ICON.bold },
      { id: "italic", title: "Italic", icon: ICON.italic },
      { id: "link", title: "Insert link", icon: ICON.link },
    ],
  },
  {
    label: "Headings",
    tools: [
      { id: "h2", title: "Heading 2", icon: ICON.h2 },
      { id: "h3", title: "Heading 3", icon: ICON.h3 },
    ],
  },
  {
    label: "Blocks",
    tools: [
      { id: "quote", title: "Block quote", icon: ICON.quote },
      { id: "pullquote", title: "Pull quote", icon: ICON.pullquote },
      { id: "callout", title: "Important callout", icon: ICON.callout },
      { id: "ul", title: "Bullet list", icon: ICON.ul },
      { id: "ol", title: "Numbered list", icon: ICON.ol },
      { id: "hr", title: "Divider", icon: ICON.hr },
      { id: "code", title: "Code block", icon: ICON.code },
    ],
  },
  {
    label: "Media",
    tools: [{ id: "image", title: "Upload image", icon: ICON.image }],
  },
];

function wrapSelection(
  textarea: HTMLTextAreaElement,
  before: string,
  after: string,
  placeholder = "text"
) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selected = textarea.value.slice(start, end) || placeholder;
  const next =
    textarea.value.slice(0, start) + before + selected + after + textarea.value.slice(end);
  const cursor = start + before.length + selected.length + after.length;
  return { next, cursor };
}

function prefixLines(
  textarea: HTMLTextAreaElement,
  prefix: string,
  placeholder = "List item"
) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const block = textarea.value.slice(start, end) || placeholder;
  const lines = block.split("\n").map((line) => `${prefix}${line}`);
  const inserted = lines.join("\n");
  const next = textarea.value.slice(0, start) + inserted + textarea.value.slice(end);
  return { next, cursor: start + inserted.length };
}

export default function ContentEditor({
  value,
  onChange,
  variant = "default",
  wordCount = 0,
}: ContentEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const autoResize = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.max(el.scrollHeight, variant === "canvas" ? 360 : 480)}px`;
  }, [variant]);

  useEffect(() => {
    autoResize();
  }, [value, autoResize]);

  function applyEdit(result: { next: string; cursor: number }) {
    onChange(result.next);
    requestAnimationFrame(() => {
      const el = textareaRef.current;
      if (!el) return;
      el.focus();
      el.setSelectionRange(result.cursor, result.cursor);
      autoResize();
    });
  }

  function insertAtCursor(text: string) {
    const el = textareaRef.current;
    if (!el) {
      onChange(value + text);
      return;
    }
    const start = el.selectionStart;
    const next = value.slice(0, start) + text + value.slice(el.selectionEnd);
    applyEdit({ next, cursor: start + text.length });
  }

  function handleTool(id: ToolId) {
    const el = textareaRef.current;
    if (!el) return;

    switch (id) {
      case "bold":
        applyEdit(wrapSelection(el, "**", "**", "bold text"));
        break;
      case "italic":
        applyEdit(wrapSelection(el, "*", "*", "italic text"));
        break;
      case "h2":
        applyEdit(prefixLines(el, "## ", "Section heading"));
        break;
      case "h3":
        applyEdit(prefixLines(el, "### ", "Subheading"));
        break;
      case "quote":
        applyEdit(prefixLines(el, "> ", "Quote text"));
        break;
      case "pullquote":
        applyEdit(
          wrapSelection(
            el,
            '<blockquote class="pull-quote">\n\n',
            "\n\n</blockquote>",
            "Pull quote — key takeaway"
          )
        );
        break;
      case "callout":
        applyEdit(
          wrapSelection(
            el,
            '<blockquote class="callout">\n\n<strong>Important:</strong> ',
            "\n\n</blockquote>",
            "key information"
          )
        );
        break;
      case "ul":
        applyEdit(prefixLines(el, "- ", "List item"));
        break;
      case "ol":
        applyEdit(prefixLines(el, "1. ", "List item"));
        break;
      case "link": {
        const url = prompt("Link URL (e.g. /calculators)", "/calculators");
        if (!url) return;
        applyEdit(wrapSelection(el, "[", `](${url})`, "link text"));
        break;
      }
      case "image":
        imageInputRef.current?.click();
        break;
      case "hr":
        insertAtCursor("\n\n---\n\n");
        break;
      case "code":
        applyEdit(wrapSelection(el, "```\n", "\n```", "code"));
        break;
    }
  }

  async function handleImageUpload(file: File) {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      const alt = prompt("Image description (alt text)", "Illustration") || "Image";
      insertAtCursor(`\n\n![${alt}](${data.url})\n\n`);
    } catch {
      alert("Image upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  }

  const isCanvas = variant === "canvas";

  return (
    <div className={`content-editor ${isCanvas ? "content-editor--canvas" : ""}`}>
      <div className="content-editor__toolbar" role="toolbar" aria-label="Formatting">
        {TOOL_GROUPS.map((group, gi) => (
          <div key={group.label} className="content-editor__group">
            {gi > 0 && <span className="content-editor__divider" aria-hidden />}
            {group.tools.map((tool) => (
              <button
                key={tool.id}
                type="button"
                className="content-editor__tool"
                title={tool.title}
                aria-label={tool.title}
                onClick={() => handleTool(tool.id)}
                disabled={uploading && tool.id === "image"}
              >
                {tool.icon}
              </button>
            ))}
          </div>
        ))}
      </div>

      <textarea
        ref={textareaRef}
        className="content-editor__area"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          autoResize();
        }}
        placeholder={
          isCanvas
            ? "Tell your story…"
            : "Start writing… Use the toolbar for headings, quotes, lists, and images."
        }
        rows={1}
      />

      {isCanvas && (
        <footer className="content-editor__footer">
          <span>{wordCount} words</span>
          {uploading && <span>Uploading image…</span>}
        </footer>
      )}

      <input
        ref={imageInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="admin-image-upload__input"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleImageUpload(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}
