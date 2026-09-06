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
  handleVisualEnterKey,
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
  const applyingLocalRef = useRef(false);
  const undoStackRef = useRef<string[]>([]);
  const redoStackRef = useRef<string[]>([]);
  const typingUndoTimer = useRef<number | null>(null);
  const historyLockRef = useRef(false);
  const lastFocusedRef = useRef(false);
  const runHistoryRef = useRef<(action: "undo" | "redo") => boolean>(() => false);
  const [activeFormat, setActiveFormat] = useState<BlockFormat>("paragraph");

  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;

    if (applyingLocalRef.current) {
      applyingLocalRef.current = false;
      lastSourceRef.current = source;
      initializedRef.current = true;
      return;
    }

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

  useEffect(() => {
    function isHistoryShortcut(event: KeyboardEvent, type: "undo" | "redo") {
      if (!(event.ctrlKey || event.metaKey)) return false;
      const z = event.code === "KeyZ" || event.key.toLowerCase() === "z";
      const y = event.code === "KeyY" || event.key.toLowerCase() === "y";
      if (type === "undo") return z && !event.shiftKey;
      return y || (z && event.shiftKey);
    }

    function editorIsActive() {
      const el = editorRef.current;
      if (!el) return false;
      const active = document.activeElement as HTMLElement | null;
      if (active === el || el.contains(active)) return true;
      const node = window.getSelection()?.anchorNode;
      if (node && el.contains(node)) return true;
      if (lastFocusedRef.current) {
        if (
          active &&
          active !== document.body &&
          (active.tagName === "INPUT" ||
            active.tagName === "TEXTAREA" ||
            active.tagName === "SELECT" ||
            active.isContentEditable)
        ) {
          return false;
        }
        return true;
      }
      return false;
    }

    function onDocumentKeyDown(event: KeyboardEvent) {
      if (!editorIsActive()) return;
      if (isHistoryShortcut(event, "undo")) {
        event.preventDefault();
        event.stopPropagation();
        if (!runHistoryRef.current("undo")) document.execCommand("undo");
        return;
      }
      if (isHistoryShortcut(event, "redo")) {
        event.preventDefault();
        event.stopPropagation();
        if (!runHistoryRef.current("redo")) document.execCommand("redo");
      }
    }

    document.addEventListener("keydown", onDocumentKeyDown, true);
    return () => document.removeEventListener("keydown", onDocumentKeyDown, true);
  }, []);

  function currentHtml() {
    return editorRef.current?.innerHTML || "";
  }

  function pushUndo() {
    const html = currentHtml();
    const stack = undoStackRef.current;
    if (stack[stack.length - 1] === html) return;
    stack.push(html);
    if (stack.length > 60) stack.shift();
    redoStackRef.current = [];
  }

  function restoreHtml(html: string) {
    const el = editorRef.current;
    if (!el) return;
    applyingLocalRef.current = true;
    el.innerHTML = html || "<p><br></p>";
    lastSourceRef.current = visualHtmlToSource(el.innerHTML);
    onChange(lastSourceRef.current);
    updateActiveFormat();
  }

  function undoEditor() {
    const stack = undoStackRef.current;
    if (!stack.length) return false;
    const current = currentHtml();
    const previous = stack.pop() || "";
    if (previous === current && stack.length) {
      return undoEditor();
    }
    redoStackRef.current.push(current);
    restoreHtml(previous);
    return true;
  }

  function redoEditor() {
    const stack = redoStackRef.current;
    if (!stack.length) return false;
    undoStackRef.current.push(currentHtml());
    restoreHtml(stack.pop() || "");
    return true;
  }

  function runHistory(action: "undo" | "redo") {
    if (historyLockRef.current) return true;
    historyLockRef.current = true;
    const handled = action === "undo" ? undoEditor() : redoEditor();
    queueMicrotask(() => {
      historyLockRef.current = false;
    });
    return handled;
  }
  runHistoryRef.current = runHistory;

  function isUndoShortcut(event: { key: string; code: string; shiftKey: boolean; ctrlKey: boolean; metaKey: boolean }) {
    if (!(event.ctrlKey || event.metaKey)) return false;
    return (event.code === "KeyZ" || event.key.toLowerCase() === "z") && !event.shiftKey;
  }

  function isRedoShortcut(event: { key: string; code: string; shiftKey: boolean; ctrlKey: boolean; metaKey: boolean }) {
    if (!(event.ctrlKey || event.metaKey)) return false;
    if (event.code === "KeyY" || event.key.toLowerCase() === "y") return true;
    return (event.code === "KeyZ" || event.key.toLowerCase() === "z") && event.shiftKey;
  }

  function syncFromEditor() {
    const el = editorRef.current;
    if (!el) return;
    applyingLocalRef.current = true;
    const next = visualHtmlToSource(el.innerHTML);
    lastSourceRef.current = next;
    onChange(next);
    updateActiveFormat();
  }

  function runCommand(command: VisualCommand) {
    const el = editorRef.current;
    if (!el) return;
    pushUndo();
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
        const url = prompt("Link URL (e.g. /about)", "/");
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
      pushUndo();
      el.focus();
      insertHtmlAtSelection(html);
      syncFromEditor();
    },
    applyFormat: (format: BlockFormat) => {
      const el = editorRef.current;
      if (!el) return;
      pushUndo();
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
    pushUndo();
    insertHtmlAtSelection(converted);
    syncFromEditor();
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (isUndoShortcut(event) || isRedoShortcut(event)) {
      event.preventDefault();
      return;
    }

    if (event.key === "Enter" && !event.shiftKey) {
      const el = editorRef.current;
      if (!el) return;
      event.preventDefault();
      pushUndo();
      if (!handleVisualEnterKey(el)) {
        document.execCommand("insertParagraph");
      }
      syncFromEditor();
    }
  }

  function handleBeforeInput(event: React.FormEvent<HTMLDivElement>) {
    const inputType = (event.nativeEvent as InputEvent).inputType;
    if (inputType === "historyUndo") {
      event.preventDefault();
      if (!runHistory("undo")) document.execCommand("undo");
      return;
    }
    if (inputType === "historyRedo") {
      event.preventDefault();
      if (!runHistory("redo")) document.execCommand("redo");
      return;
    }
    if (inputType?.startsWith("history")) {
      event.preventDefault();
      return;
    }
    if (typingUndoTimer.current) return;
    pushUndo();
    typingUndoTimer.current = window.setTimeout(() => {
      typingUndoTimer.current = null;
    }, 400);
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
      onBeforeInput={handleBeforeInput}
      onPaste={handlePaste}
      onKeyDown={handleKeyDown}
      onFocus={() => {
        lastFocusedRef.current = true;
      }}
      onBlur={() => {
        window.setTimeout(() => {
          if (document.activeElement !== editorRef.current) lastFocusedRef.current = false;
        }, 0);
        syncFromEditor();
      }}
    />
  );
});

export default VisualEditor;
