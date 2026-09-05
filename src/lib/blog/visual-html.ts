import { renderMarkdown } from "@/lib/blog/markdown";
import { normalizeArticleHtml } from "@/lib/blog/article-html";

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

export function visualHtmlToStoredSource(html: string): string {
  const cleaned = visualHtmlToSource(html);
  if (!cleaned) return "";
  return normalizeArticleHtml(cleaned);
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

function isIntroParagraph(el: HTMLElement): boolean {
  const text = (el.textContent || "").trim();
  return text.endsWith(":") && text.length <= 160;
}

function isListCandidateBlock(el: HTMLElement, root: HTMLElement): boolean {
  if (el.tagName === "LI") return true;
  if (el.parentElement !== root) return false;
  return el.tagName === "P" || el.tagName === "DIV";
}

function splitBlockIntoListItemParts(block: HTMLElement): string[] {
  if (block.tagName === "LI") {
    return [block.innerHTML.trim() || "<br>"];
  }

  if (block.tagName === "UL" || block.tagName === "OL") {
    return Array.from(block.querySelectorAll(":scope > li")).map(
      (li) => (li as HTMLElement).innerHTML.trim() || "<br>"
    );
  }

  const inner = block.innerHTML.trim() || "<br>";
  const brParts = inner
    .split(/<br\s*\/?>/i)
    .map((part) => part.trim())
    .filter(Boolean);

  if (brParts.length >= 2) return brParts;

  const childBlocks = Array.from(block.children).filter((child) => {
    const tag = child.tagName;
    return tag === "DIV" || tag === "P";
  }) as HTMLElement[];

  if (childBlocks.length >= 2) {
    return childBlocks.map((child) => child.innerHTML.trim()).filter(Boolean);
  }

  return [inner];
}

function findParagraphRun(block: HTMLElement, root: HTMLElement): HTMLElement[] {
  if (block.tagName === "LI") {
    const list = block.parentElement;
    if (list && (list.tagName === "UL" || list.tagName === "OL")) {
      return Array.from(list.children).filter((child) => child.tagName === "LI") as HTMLElement[];
    }
    return [block];
  }

  if (block.parentElement !== root || !isListCandidateBlock(block, root)) {
    return [block];
  }

  let first = block;
  while (first.previousElementSibling) {
    const prev = first.previousElementSibling as HTMLElement;
    if (!isListCandidateBlock(prev, root)) break;
    const text = (prev.textContent || "").trim();
    if (!text) break;
    if (isIntroParagraph(prev)) break;
    first = prev;
  }

  const run: HTMLElement[] = [];
  let current: Element | null = first;
  while (current && current.parentElement === root && isListCandidateBlock(current as HTMLElement, root)) {
    const el = current as HTMLElement;
    const text = (el.textContent || "").trim();
    if (!text) break;
    if (run.length > 0 && isIntroParagraph(el)) break;
    run.push(el);
    current = current.nextElementSibling;
  }

  if (run.length > 1 && isIntroParagraph(run[0])) {
    return run.slice(1);
  }

  return run.length ? run : [block];
}

function gatherBlocksForListConversion(selection: Selection, root: HTMLElement): HTMLElement[] {
  const selected = getTopLevelBlocksInSelection(selection, root).filter(
    (block) => block.tagName !== "UL" && block.tagName !== "OL"
  );

  if (selected.length > 1) return selected;

  const anchorBlock = selected[0] || getBlockElement(selection.anchorNode, root);
  if (!anchorBlock) return [];

  if (anchorBlock.parentElement === root && isIntroParagraph(anchorBlock)) {
    const following: HTMLElement[] = [];
    let next = anchorBlock.nextElementSibling;
    while (next && next.parentElement === root && isListCandidateBlock(next as HTMLElement, root)) {
      const text = (next.textContent || "").trim();
      if (!text) break;
      if (isIntroParagraph(next as HTMLElement)) break;
      following.push(next as HTMLElement);
      next = next.nextElementSibling;
    }
    return following.length ? following : [anchorBlock];
  }

  return findParagraphRun(anchorBlock, root);
}

function normalizeNativeLists(root: HTMLElement, ordered: boolean) {
  root.querySelectorAll("ul, ol").forEach((listEl) => {
    listEl.classList.add("blog-list");
    if (ordered || listEl.tagName === "OL") {
      listEl.classList.add("blog-list--ordered");
    } else {
      listEl.classList.remove("blog-list--ordered");
    }
  });
}

export function handleListEnterKey(editorRoot: HTMLElement): boolean {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return false;

  const block = getBlockElement(selection.anchorNode, editorRoot);
  if (!block || block.tagName !== "LI") return false;

  const list = block.parentElement;
  if (!list || (list.tagName !== "UL" && list.tagName !== "OL")) return false;

  const range = selection.getRangeAt(0);
  const afterRange = document.createRange();
  afterRange.setStart(range.startContainer, range.startOffset);
  afterRange.setEndAfter(block.lastChild || block);

  const afterFragment = afterRange.extractContents();
  const newLi = document.createElement("li");
  newLi.appendChild(afterFragment);
  if (!newLi.innerHTML.trim()) newLi.innerHTML = "<br>";

  if (block.nextSibling) {
    list.insertBefore(newLi, block.nextSibling);
  } else {
    list.appendChild(newLi);
  }

  if (!block.innerHTML.trim()) block.innerHTML = "<br>";

  selection.removeAllRanges();
  const newRange = document.createRange();
  newRange.selectNodeContents(newLi);
  newRange.collapse(true);
  selection.addRange(newRange);

  return true;
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

  const blocks = gatherBlocksForListConversion(selection, editorRoot);
  if (!blocks.length) {
    document.execCommand(ordered ? "insertOrderedList" : "insertUnorderedList");
    normalizeNativeLists(editorRoot, ordered);
    return;
  }

  const list = document.createElement(ordered ? "ol" : "ul");
  list.className = ordered ? "blog-list blog-list--ordered" : "blog-list";
  const firstBlock = blocks[0];
  const parent = editorRoot;

  blocks.forEach((block) => {
    splitBlockIntoListItemParts(block).forEach((part) => {
      const item = document.createElement("li");
      item.innerHTML = part || "<br>";
      list.appendChild(item);
    });
  });

  parent.insertBefore(list, firstBlock);
  blocks.forEach((block) => block.remove());
}
