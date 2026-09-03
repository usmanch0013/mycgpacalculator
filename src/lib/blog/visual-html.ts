import { renderMarkdown } from "@/lib/blog/markdown";

export function sourceToVisualHtml(source: string): string {
  if (!source.trim()) return "<p><br></p>";
  return renderMarkdown(source);
}

export function visualHtmlToSource(html: string): string {
  return html
    .replace(/\u00a0/g, " ")
    .replace(/<div><br><\/div>/gi, "")
    .replace(/<p><br><\/p>/gi, "")
    .replace(/<br class="Apple-interchange-newline">/gi, "")
    .trim();
}

export type BlockFormat = "paragraph" | "h2" | "h3" | "quote" | "pullquote" | "callout";

export const BLOCK_FORMAT_LABELS: Record<BlockFormat, string> = {
  paragraph: "Paragraph",
  h2: "Heading 2",
  h3: "Heading 3",
  quote: "Quote",
  pullquote: "Pull quote",
  callout: "Callout",
};

function getBlockElement(node: Node | null, root: HTMLElement): HTMLElement | null {
  let current: Node | null = node;
  while (current && current !== root) {
    if (current.nodeType === Node.ELEMENT_NODE) {
      const el = current as HTMLElement;
      const tag = el.tagName.toLowerCase();
      if (["p", "h1", "h2", "h3", "h4", "h5", "h6", "blockquote", "li", "pre"].includes(tag)) {
        return el;
      }
      if (tag === "div" && el.parentElement === root) {
        return el;
      }
    }
    current = current.parentNode;
  }
  return null;
}

function renameBlock(el: HTMLElement, tag: string, className = ""): HTMLElement {
  const newEl = document.createElement(tag);
  if (className) newEl.className = className;
  while (el.firstChild) newEl.appendChild(el.firstChild);
  if (!newEl.innerHTML.trim()) newEl.innerHTML = "<br>";
  el.replaceWith(newEl);
  return newEl;
}

function placeCursorAtEnd(el: HTMLElement) {
  const selection = window.getSelection();
  if (!selection) return;
  const range = document.createRange();
  range.selectNodeContents(el);
  range.collapse(false);
  selection.removeAllRanges();
  selection.addRange(range);
}

export function detectBlockFormat(node: Node | null, root: HTMLElement): BlockFormat {
  const block = getBlockElement(node, root);
  if (!block) return "paragraph";
  if (block.tagName === "H2") return "h2";
  if (block.tagName === "H3") return "h3";
  if (block.tagName === "BLOCKQUOTE") {
    if (block.classList.contains("pull-quote")) return "pullquote";
    if (block.classList.contains("callout")) return "callout";
    return "quote";
  }
  return "paragraph";
}

export function applyBlockFormat(format: BlockFormat, editorRoot: HTMLElement) {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;

  editorRoot.focus();

  let block = getBlockElement(selection.anchorNode, editorRoot);
  if (!block) {
    const p = document.createElement("p");
    p.innerHTML = "<br>";
    editorRoot.appendChild(p);
    block = p;
  }

  let newEl: HTMLElement;
  switch (format) {
    case "paragraph":
      newEl = renameBlock(block, "p");
      break;
    case "h2":
      newEl = renameBlock(block, "h2");
      break;
    case "h3":
      newEl = renameBlock(block, "h3");
      break;
    case "quote":
      newEl = renameBlock(block, "blockquote", "blog-quote");
      break;
    case "pullquote":
      newEl = renameBlock(block, "blockquote", "pull-quote");
      break;
    case "callout":
      newEl = renameBlock(block, "blockquote", "callout");
      break;
    default:
      newEl = block;
  }

  placeCursorAtEnd(newEl);
}

function unwrapElement(el: HTMLElement) {
  const parent = el.parentNode;
  if (!parent) return;
  while (el.firstChild) {
    parent.insertBefore(el.firstChild, el);
  }
  parent.removeChild(el);
}

function findHighlightMark(node: Node | null): HTMLElement | null {
  let current: Node | null = node;
  while (current) {
    if (current.nodeType === Node.ELEMENT_NODE) {
      const el = current as HTMLElement;
      if (el.tagName === "MARK" || el.classList.contains("blog-highlight")) {
        return el;
      }
    }
    current = current.parentNode;
  }
  return null;
}

function getMarksInRange(range: Range): HTMLElement[] {
  const marks = new Set<HTMLElement>();

  const startMark = findHighlightMark(range.startContainer);
  const endMark = findHighlightMark(range.endContainer);
  if (startMark) marks.add(startMark);
  if (endMark) marks.add(endMark);

  const ancestor =
    range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE
      ? (range.commonAncestorContainer as HTMLElement)
      : range.commonAncestorContainer.parentElement;

  if (ancestor) {
    ancestor.querySelectorAll("mark, .blog-highlight").forEach((mark) => {
      if (range.intersectsNode(mark)) {
        marks.add(mark as HTMLElement);
      }
    });
  }

  return Array.from(marks);
}

export function toggleHighlight() {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;

  const range = selection.getRangeAt(0);
  if (range.collapsed) return;

  const marks = getMarksInRange(range);
  if (marks.length > 0) {
    marks.forEach(unwrapElement);
    return;
  }

  wrapRangeWithTag("mark", "blog-highlight");
}

export function wrapRangeWithTag(tagName: string, className?: string) {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;

  const range = selection.getRangeAt(0);
  if (range.collapsed) return;

  const wrapper = document.createElement(tagName);
  if (className) wrapper.className = className;

  try {
    range.surroundContents(wrapper);
  } catch {
    const fragment = range.extractContents();
    wrapper.appendChild(fragment);
    range.insertNode(wrapper);
  }

  selection.removeAllRanges();
  const newRange = document.createRange();
  newRange.selectNodeContents(wrapper);
  newRange.collapse(false);
  selection.addRange(newRange);
}

export function wrapRangeWithBlockquote(className: string, placeholder = "Quote text") {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;

  const range = selection.getRangeAt(0);
  const blockquote = document.createElement("blockquote");
  blockquote.className = className;

  if (range.collapsed) {
    blockquote.textContent = placeholder;
  } else {
    try {
      range.surroundContents(blockquote);
    } catch {
      const fragment = range.extractContents();
      blockquote.appendChild(fragment);
      range.insertNode(blockquote);
    }
  }

  selection.removeAllRanges();
  const newRange = document.createRange();
  newRange.selectNodeContents(blockquote);
  newRange.collapse(false);
  selection.addRange(newRange);
}

function normalizeLinkHref(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";

  if (/^(\/|#|mailto:|tel:)/i.test(trimmed)) return trimmed;

  try {
    const parsed = new URL(trimmed, window.location.origin);
    if (parsed.origin === window.location.origin) {
      return `${parsed.pathname}${parsed.search}${parsed.hash}`;
    }
    return parsed.href;
  } catch {
    return trimmed.startsWith("http") ? trimmed : `/${trimmed.replace(/^\/+/, "")}`;
  }
}

export function insertLink(rawUrl: string) {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;

  const href = normalizeLinkHref(rawUrl);
  if (!href) return;

  const range = selection.getRangeAt(0);
  const anchor = document.createElement("a");
  anchor.href = href;
  if (/^https?:\/\//i.test(href)) {
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
  }

  if (range.collapsed) {
    const label = prompt("Link text", href) || href;
    anchor.textContent = label;
    range.insertNode(anchor);
  } else {
    try {
      anchor.appendChild(range.extractContents());
      range.insertNode(anchor);
    } catch {
      document.execCommand("createLink", false, href);
      return;
    }
  }

  selection.removeAllRanges();
  const newRange = document.createRange();
  newRange.selectNodeContents(anchor);
  newRange.collapse(false);
  selection.addRange(newRange);
}

export function insertHtmlAtSelection(html: string) {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;

  const range = selection.getRangeAt(0);
  range.deleteContents();

  const template = document.createElement("template");
  template.innerHTML = html;
  const node = template.content;
  const lastNode = node.lastChild;
  range.insertNode(node);

  if (lastNode) {
    selection.removeAllRanges();
    const newRange = document.createRange();
    newRange.setStartAfter(lastNode);
    newRange.collapse(true);
    selection.addRange(newRange);
  }
}

function findParentList(node: Node | null, root: HTMLElement): HTMLElement | null {
  let current: Node | null = node;
  while (current && current !== root) {
    if (current.nodeType === Node.ELEMENT_NODE) {
      const tag = (current as HTMLElement).tagName;
      if (tag === "UL" || tag === "OL") return current as HTMLElement;
    }
    current = current.parentNode;
  }
  return null;
}

function unwrapList(list: HTMLElement) {
  const parent = list.parentNode;
  if (!parent) return;

  const items = Array.from(list.children).filter((child) => child.tagName === "LI");
  items.forEach((item) => {
    const paragraph = document.createElement("p");
    paragraph.innerHTML = (item as HTMLElement).innerHTML.trim() || "<br>";
    parent.insertBefore(paragraph, list);
  });
  list.remove();
}

function getTopLevelBlocksInSelection(selection: Selection, root: HTMLElement): HTMLElement[] {
  const range = selection.getRangeAt(0);
  const blocks: HTMLElement[] = [];

  Array.from(root.children).forEach((child) => {
    if (child.nodeType !== Node.ELEMENT_NODE) return;
    const el = child as HTMLElement;
    const tag = el.tagName;

    if (tag === "UL" || tag === "OL") {
      if (!range.intersectsNode(el)) return;
      const selectedItems = Array.from(el.children).filter(
        (item) => item.tagName === "LI" && range.intersectsNode(item)
      ) as HTMLElement[];
      if (selectedItems.length) {
        blocks.push(...selectedItems);
        return;
      }
      blocks.push(el);
      return;
    }

    if (range.intersectsNode(el)) {
      blocks.push(el);
    }
  });

  if (!blocks.length) {
    const block = getBlockElement(selection.anchorNode, root);
    if (!block) return blocks;
    if (block.parentElement === root) {
      blocks.push(block);
    } else if (block.tagName === "LI") {
      blocks.push(block);
    }
  }

  return blocks;
}

export function toggleList(ordered: boolean, editorRoot: HTMLElement) {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;

  editorRoot.focus();

  const anchorList = findParentList(selection.anchorNode, editorRoot);
  const focusList = findParentList(selection.focusNode, editorRoot);
  const activeList = anchorList && anchorList === focusList ? anchorList : anchorList || focusList;

  if (activeList) {
    const isOrdered = activeList.tagName === "OL";
    if (ordered === isOrdered) {
      unwrapList(activeList);
      return;
    }
    const replacement = document.createElement(ordered ? "ol" : "ul");
    replacement.className = ordered ? "blog-list blog-list--ordered" : "blog-list";
    replacement.innerHTML = activeList.innerHTML;
    activeList.replaceWith(replacement);
    return;
  }

  const blocks = getTopLevelBlocksInSelection(selection, editorRoot);
  if (!blocks.length) {
    document.execCommand(ordered ? "insertOrderedList" : "insertUnorderedList");
    return;
  }

  const list = document.createElement(ordered ? "ol" : "ul");
  list.className = ordered ? "blog-list blog-list--ordered" : "blog-list";
  const firstBlock = blocks[0];
  const parent = editorRoot;

  blocks.forEach((block) => {
    const item = document.createElement("li");
    if (block.tagName === "LI") {
      item.innerHTML = block.innerHTML;
    } else if (block.tagName === "UL" || block.tagName === "OL") {
      item.innerHTML = Array.from(block.querySelectorAll(":scope > li"))
        .map((li) => (li as HTMLElement).innerHTML)
        .join("") || block.innerHTML;
    } else {
      item.innerHTML = block.innerHTML.trim() || "<br>";
    }
    list.appendChild(item);
  });

  parent.insertBefore(list, firstBlock);
  blocks.forEach((block) => block.remove());
}
