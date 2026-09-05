"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { convertPastedHtmlToContent, getClipboardHtml } from "@/lib/blog/paste-html";
import {
  applyBlockFormat,
  detectBlockFormat,
  handleListEnterKey,
  insertLink,
  insertHtmlAtSelection,
  sourceToVisualHtml,
  toggleHighlight,
  toggleList,
  visualHtmlToSource,
  visualHtmlToStoredSource,
  wrapRangeWithBlockquote,
  type BlockFormat,
} from "@/lib/blog/visual-html";

export type VisualEditorHandle = {
  getHtml: () => string;
  focus: () => void;
  exec: (command: VisualCommand) => void;
  insertHtml: (html: string) => void;
  applyFormat: (format: BlockFormat) => void;
  getActiveFormat: () => BlockFormat;
};

export type VisualCommand =
  | "bold"
  | "italic"
  | "ul"
  | "ol"
  | "link"
  | "hr"
  | "highlight";

interface VisualEditorProps {
  source: string;
  onChange: (source: string) => void;
  onFormatChange?: (format: BlockFormat) => void;
}

const VisualEditor = forwardRef<VisualEditorHandle, VisualEditorProps>(function VisualEditor(
  { source, onChange, onFormatChange },
  ref
) {
  const editorRef = useRef<HTMLDivElement>(null);
  const lastSourceRef = useRef("");
  const initializedRef = useRef(false);
  const [activeFormat, setActiveFormat] = useState<BlockFormat>("paragraph");

  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    if (!initializedRef.current || source !== lastSourceRef.current) {
      el.innerHTML = sourceToVisualHtml(source);
      lastSourceRef.current = source;
      initializedRef.current = true;
    }
  }, [source]);

  function updateActiveFormat() {
    const el = editorRef.current;
    if (!el) return;
    const selection = window.getSelection();
    const format = detectBlockFormat(selection?.anchorNode ?? null, el);
    setActiveFormat(format);
    onFormatChange?.(format);
  }

  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;

    const handleSelection = () => updateActiveFormat();
    document.addEventListener("selectionchange", handleSelection);
    el.addEventListener("keyup", handleSelection);
    el.addEventListener("mouseup", handleSelection);

    return () => {
      document.removeEventListener("selectionchange", handleSelection);
      el.removeEventListener("keyup", handleSelection);
      el.removeEventListener("mouseup", handleSelection);
    };
  }, [onFormatChange]);

  function syncFromEditor() {
    const el = editorRef.current;
    if (!el) return;
    const next = visualHtmlToSource(el.innerHTML);
    lastSourceRef.current = next;
    onChange(next);
    updateActiveFormat();
  }

  function runCommand(command: VisualCommand) {
    const el = editorRef.current;
    if (!el) return;
    el.focus();

    switch (command) {
      case "bold":
        document.execCommand("bold");
        break;
      case "italic":
        document.execCommand("italic");
        break;
      case "ul":
        toggleList(false, el);
        break;
      case "ol":
        toggleList(true, el);
        break;
      case "link": {
        const url = prompt("Link URL (e.g. /calculator/iub)", "/calculator/iub");
        if (!url) return;
        insertLink(url);
        break;
      }
      case "hr":
        insertHtmlAtSelection("<hr />");
        break;
      case "highlight":
        toggleHighlight();
        break;
      default:
        break;
    }

    syncFromEditor();
  }

  useImperativeHandle(ref, () => ({
    getHtml: () => visualHtmlToStoredSource(editorRef.current?.innerHTML || ""),
    focus: () => editorRef.current?.focus(),
    exec: runCommand,
    insertHtml: (html: string) => {
      const el = editorRef.current;
      if (!el) return;
      el.focus();
      insertHtmlAtSelection(html);
      syncFromEditor();
    },
    applyFormat: (format: BlockFormat) => {
      const el = editorRef.current;
      if (!el) return;
      applyBlockFormat(format, el);
      syncFromEditor();
    },
    getActiveFormat: () => activeFormat,
  }));

  function handlePaste(event: React.ClipboardEvent<HTMLDivElement>) {
    const html = getClipboardHtml(event.clipboardData);
    if (!html) return;

    const converted = convertPastedHtmlToContent(html);
    if (!converted) return;

    event.preventDefault();
    insertHtmlAtSelection(converted);
    syncFromEditor();
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Enter" || event.shiftKey) return;

    const el = editorRef.current;
    if (!el) return;

    if (handleListEnterKey(el)) {
      event.preventDefault();
      syncFromEditor();
    }
  }

  return (
    <div
      ref={editorRef}
      className="visual-editor blog-article__prose"
      contentEditable
      suppressContentEditableWarning
      role="textbox"
      aria-multiline="true"
      aria-label="Visual editor"
      onInput={syncFromEditor}
      onPaste={handlePaste}
      onKeyDown={handleKeyDown}
      onBlur={syncFromEditor}
    />
  );
});

export default VisualEditor;
