"use client";

import { forwardRef, useImperativeHandle, useRef, useState, useCallback, useEffect } from "react";
import BlockInserterModal from "@/components/admin/BlockInserterModal";
import ImageInsertModal from "@/components/admin/ImageInsertModal";
import VisualEditor, { type VisualCommand, type VisualEditorHandle } from "@/components/admin/VisualEditor";
import { convertPastedHtmlToContent, getClipboardHtml } from "@/lib/blog/paste-html";
import { BLOCK_FORMAT_LABELS, type BlockFormat } from "@/lib/blog/visual-html";

interface ContentEditorProps {
  value: string;
  onChange: (value: string) => void;
  variant?: "default" | "canvas";
  wordCount?: number;
}

export type ContentEditorHandle = {
  flushValue: () => string;
};

type EditorMode = "visual" | "text";

type ToolId =
  | VisualCommand
  | "image"
  | "table"
  | "faq"
  | "html"
  | "blocks"
  | "code";

const FORMAT_OPTIONS: BlockFormat[] = [
  "paragraph",
  "h2",
  "h3",
  "quote",
  "pullquote",
  "callout",
];

interface ToolDef {
  id: ToolId;
  title: string;
  icon: React.ReactNode;
  wide?: boolean;
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
  highlight: <span className="ce-icon-text">HL</span>,
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
  table: <span className="ce-icon-text">Tbl</span>,
  faq: <span className="ce-icon-text">FAQ</span>,
  html: <span className="ce-icon-text">HTML</span>,
  blocks: <span className="ce-icon-text">+</span>,
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
    label: "Insert",
    tools: [
      { id: "blocks", title: "Insert block", icon: ICON.blocks, wide: true },
      { id: "table", title: "Insert table", icon: ICON.table },
      { id: "faq", title: "Insert FAQ accordion", icon: ICON.faq },
      { id: "html", title: "Insert custom HTML", icon: ICON.html },
      { id: "image", title: "Upload image", icon: ICON.image },
    ],
  },
  {
    label: "Text",
    tools: [
      { id: "bold", title: "Bold", icon: ICON.bold },
      { id: "italic", title: "Italic", icon: ICON.italic },
      { id: "link", title: "Insert link", icon: ICON.link },
      { id: "highlight", title: "Highlight text", icon: ICON.highlight },
    ],
  },
  {
    label: "Blocks",
    tools: [
      { id: "ul", title: "Bullet list", icon: ICON.ul },
      { id: "ol", title: "Numbered list", icon: ICON.ol },
      { id: "hr", title: "Divider", icon: ICON.hr },
      { id: "code", title: "Code block", icon: ICON.code },
    ],
  },
];

const VISUAL_COMMANDS = new Set<ToolId>([
  "bold",
  "italic",
  "highlight",
  "ul",
  "ol",
  "link",
  "hr",
]);

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
  const value = textarea.value;

  const applyPrefix = (block: string) =>
    block
      .split("\n")
      .map((line, index) => {
        const trimmed = line.trim();
        if (!trimmed) return line;
        if (prefix.startsWith("1.")) {
          if (/^\d+\.\s+/.test(trimmed)) return line;
          return line.replace(/^\s*/, (spaces) => `${spaces}${index + 1}. `);
        }
        if (/^-\s+/.test(trimmed)) return line;
        return line.replace(/^\s*/, (spaces) => `${spaces}- `);
      })
      .join("\n");

  if (start !== end) {
    const block = value.slice(start, end);
    const inserted = applyPrefix(block);
    const next = value.slice(0, start) + inserted + value.slice(end);
    return { next, cursor: start + inserted.length };
  }

  const lineStart = value.lastIndexOf("\n", start - 1) + 1;
  let lineEnd = value.indexOf("\n", start);
  if (lineEnd === -1) lineEnd = value.length;
  const currentLine = value.slice(lineStart, lineEnd) || placeholder;
  const inserted = applyPrefix(currentLine);
  const next = value.slice(0, lineStart) + inserted + value.slice(lineEnd);
  return { next, cursor: lineStart + inserted.length };
}

export default forwardRef<ContentEditorHandle, ContentEditorProps>(function ContentEditor(
  {
  value,
  onChange,
  variant = "default",
  wordCount = 0,
}: ContentEditorProps,
  ref
) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const visualRef = useRef<VisualEditorHandle>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [blockModalOpen, setBlockModalOpen] = useState(false);
  const [blockModalTab, setBlockModalTab] = useState<"table" | "faq" | "image" | "html" | null>(null);
  const [editorMode, setEditorMode] = useState<EditorMode>("visual");
  const [blockFormat, setBlockFormat] = useState<BlockFormat>("paragraph");
  const [pendingImageUrl, setPendingImageUrl] = useState("");

  useImperativeHandle(ref, () => ({
    flushValue: () => {
      if (editorMode === "visual") {
        const html = visualRef.current?.getHtml() ?? value;
        onChange(html);
        return html;
      }
      return value;
    },
  }));

  const autoResize = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.max(el.scrollHeight, variant === "canvas" ? 360 : 480)}px`;
  }, [variant]);

  useEffect(() => {
    if (editorMode === "text") autoResize();
  }, [value, editorMode, autoResize]);

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
    if (editorMode === "visual") {
      visualRef.current?.insertHtml(text);
      return;
    }

    const el = textareaRef.current;
    if (!el) {
      onChange(value + text);
      return;
    }
    const start = el.selectionStart;
    const next = value.slice(0, start) + text + value.slice(el.selectionEnd);
    applyEdit({ next, cursor: start + text.length });
  }

  async function uploadImageFile(file: File): Promise<string | null> {
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
      return data.url as string;
    } catch {
      alert("Image upload failed. Try again.");
      return null;
    } finally {
      setUploading(false);
    }
  }

  function switchMode(next: EditorMode) {
    if (next === editorMode) return;

    if (editorMode === "visual") {
      const html = visualRef.current?.getHtml();
      if (html !== undefined) onChange(html);
    }

    setEditorMode(next);

    if (next === "visual") {
      requestAnimationFrame(() => visualRef.current?.focus());
    } else {
      requestAnimationFrame(() => textareaRef.current?.focus());
    }
  }

  function applyTextFormat(format: BlockFormat) {
    const el = textareaRef.current;
    if (!el) return;

    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = el.value.slice(start, end) || "Your text here";
    let wrapped = selected;

    switch (format) {
      case "paragraph":
        wrapped = selected
          .replace(/^#{1,6}\s+/gm, "")
          .replace(/^>\s+/gm, "")
          .replace(/<\/?blockquote[^>]*>/gi, "")
          .replace(/<\/?mark[^>]*>/gi, "");
        break;
      case "h2":
        wrapped = `## ${selected.replace(/^#{1,6}\s+/gm, "")}`;
        break;
      case "h3":
        wrapped = `### ${selected.replace(/^#{1,6}\s+/gm, "")}`;
        break;
      case "quote":
        wrapped = `<blockquote class="blog-quote">\n\n${selected}\n\n</blockquote>`;
        break;
      case "pullquote":
        wrapped = `<blockquote class="pull-quote">\n\n${selected}\n\n</blockquote>`;
        break;
      case "callout":
        wrapped = `<blockquote class="callout">\n\n<strong>Important:</strong> ${selected}\n\n</blockquote>`;
        break;
      default:
        break;
    }

    applyEdit({ next: el.value.slice(0, start) + wrapped + el.value.slice(end), cursor: start + wrapped.length });
  }

  function handleFormatChange(format: BlockFormat) {
    setBlockFormat(format);
    if (editorMode === "visual") {
      visualRef.current?.applyFormat(format);
      return;
    }
    applyTextFormat(format);
  }

  function handleTool(id: ToolId) {
    switch (id) {
      case "blocks":
        setBlockModalTab(null);
        setBlockModalOpen(true);
        return;
      case "table":
        setBlockModalTab("table");
        setBlockModalOpen(true);
        return;
      case "faq":
        setBlockModalTab("faq");
        setBlockModalOpen(true);
        return;
      case "html":
        setBlockModalTab("html");
        setBlockModalOpen(true);
        return;
      case "image":
        imageInputRef.current?.click();
        return;
      default:
        break;
    }

    if (editorMode === "visual" && VISUAL_COMMANDS.has(id)) {
      visualRef.current?.exec(id as VisualCommand);
      return;
    }

    const el = textareaRef.current;
    if (!el) return;

    switch (id) {
      case "bold":
        applyEdit(wrapSelection(el, "**", "**", "bold text"));
        break;
      case "italic":
        applyEdit(wrapSelection(el, "*", "*", "italic text"));
        break;
      case "highlight": {
        const start = el.selectionStart;
        const end = el.selectionEnd;
        const selected = el.value.slice(start, end) || "highlighted text";
        const hasMark = /<mark[\s>]/i.test(selected);
        const replacement = hasMark
          ? selected.replace(/<mark[^>]*>/gi, "").replace(/<\/mark>/gi, "")
          : `<mark class="blog-highlight">${selected}</mark>`;
        const next = el.value.slice(0, start) + replacement + el.value.slice(end);
        applyEdit({ next, cursor: start + replacement.length });
        break;
      }
      case "ul":
        applyEdit(prefixLines(el, "- ", "List item"));
        break;
      case "ol":
        applyEdit(prefixLines(el, "1. ", "List item"));
        break;
      case "link": {
        const url = prompt("Link URL (e.g. /blog)", "/");
        if (!url) return;
        applyEdit(wrapSelection(el, "[", `](${url})`, "link text"));
        break;
      }
      case "hr":
        insertAtCursor("\n\n---\n\n");
        break;
      case "code":
        applyEdit(wrapSelection(el, "```\n", "\n```", "code"));
        break;
    }
  }

  async function handleImageUpload(file: File) {
    const url = await uploadImageFile(file);
    if (!url) return;
    setPendingImageUrl(url);
  }

  function handleQuickInsert(html: string) {
    insertAtCursor(`\n\n${html.trim()}\n\n`);
  }

  function handleTextPaste(event: React.ClipboardEvent<HTMLTextAreaElement>) {
    const html = getClipboardHtml(event.clipboardData);
    if (!html) return;

    const converted = convertPastedHtmlToContent(html);
    if (!converted) return;

    event.preventDefault();
    const el = textareaRef.current;
    if (!el) {
      onChange(value ? `${value}\n\n${converted}` : converted);
      return;
    }

    const start = el.selectionStart;
    const end = el.selectionEnd;
    const before = value.slice(0, start);
    const after = value.slice(end);
    const spacerBefore = before && !before.endsWith("\n\n") ? "\n\n" : "";
    const spacerAfter = after && !after.startsWith("\n") ? "\n\n" : "";
    const insert = `${spacerBefore}${converted}${spacerAfter}`;
    applyEdit({ next: before + insert + after, cursor: before.length + insert.length });
  }

  const isCanvas = variant === "canvas";

  return (
    <div className={`content-editor ${isCanvas ? "content-editor--canvas" : ""}`}>
      <div className="content-editor__mode-bar">
        <div className="content-editor__mode-tabs" role="tablist" aria-label="Editor mode">
          <button
            type="button"
            role="tab"
            aria-selected={editorMode === "visual"}
            className={`content-editor__mode-tab ${editorMode === "visual" ? "content-editor__mode-tab--active" : ""}`}
            onClick={() => switchMode("visual")}
          >
            Visual
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={editorMode === "text"}
            className={`content-editor__mode-tab ${editorMode === "text" ? "content-editor__mode-tab--active" : ""}`}
            onClick={() => switchMode("text")}
          >
            Text
          </button>
        </div>
        <p className="content-editor__mode-hint">
          {editorMode === "visual"
            ? "Select text → use Format dropdown for Paragraph, Heading, Quote."
            : "HTML / markdown source code."}
        </p>
      </div>

      <div className="content-editor__toolbar" role="toolbar" aria-label="Formatting">
        <div className="content-editor__group content-editor__group--format">
          <label className="content-editor__format-label" htmlFor="editor-format-select">
            Format
          </label>
          <select
            id="editor-format-select"
            className="content-editor__format-select"
            value={blockFormat}
            onChange={(e) => handleFormatChange(e.target.value as BlockFormat)}
            title="Change block type — Paragraph, Heading, Quote, etc."
          >
            {FORMAT_OPTIONS.map((format) => (
              <option key={format} value={format}>
                {BLOCK_FORMAT_LABELS[format]}
              </option>
            ))}
          </select>
        </div>
        <span className="content-editor__divider" aria-hidden />
        {TOOL_GROUPS.map((group, gi) => (
          <div key={group.label} className="content-editor__group">
            {gi > 0 && <span className="content-editor__divider" aria-hidden />}
            {group.tools.map((tool) => (
              <button
                key={tool.id}
                type="button"
                className={`content-editor__tool ${tool.wide ? "content-editor__tool--wide" : ""} ${
                  tool.id === "blocks" ? "content-editor__tool--primary" : ""
                }`}
                title={tool.title}
                aria-label={tool.title}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => handleTool(tool.id)}
                disabled={uploading && tool.id === "image"}
              >
                {tool.icon}
              </button>
            ))}
          </div>
        ))}
      </div>

      <div className="content-editor__workspace">
        {editorMode === "visual" ? (
          <VisualEditor
            ref={visualRef}
            source={value}
            onChange={onChange}
            onFormatChange={setBlockFormat}
          />
        ) : (
          <textarea
            ref={textareaRef}
            className="content-editor__area content-editor__area--text"
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              autoResize();
            }}
            onPaste={handleTextPaste}
            placeholder="HTML / markdown source — switch to Visual to see formatted content."
            rows={1}
            spellCheck={false}
          />
        )}
      </div>

      {isCanvas && (
        <footer className="content-editor__footer">
          <span>{wordCount} words</span>
          <span>{editorMode === "visual" ? "Visual editor" : "Text editor"}</span>
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

      <ImageInsertModal
        open={Boolean(pendingImageUrl)}
        url={pendingImageUrl}
        onClose={() => setPendingImageUrl("")}
        onInsert={(html) => {
          if (editorMode === "visual") {
            visualRef.current?.insertHtml(html);
            return;
          }
          insertAtCursor(`\n\n${html}\n\n`);
        }}
      />

      <BlockInserterModal
        open={blockModalOpen}
        initialTab={blockModalTab ?? "table"}
        onClose={() => {
          setBlockModalOpen(false);
          setBlockModalTab(null);
        }}
        onInsert={handleQuickInsert}
        onUploadImage={uploadImageFile}
      />
    </div>
  );
});
