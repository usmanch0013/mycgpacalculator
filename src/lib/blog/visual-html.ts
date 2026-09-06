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

function createListElement(ordered: boolean): HTMLElement {
  const list = document.createElement(ordered ? "ol" : "ul");
  list.className = ordered ? "blog-list blog-list--ordered" : "blog-list";
  return list;
}

function blockToListItem(block: HTMLElement): HTMLElement {
  const item = document.createElement("li");
  item.innerHTML = block.innerHTML.trim() || "<br>";
  return item;
}

function unwrapListItems(list: HTMLElement, items: HTMLElement[]) {
  rewriteListChildren(list, items, (child, fragment) => {
    const paragraph = document.createElement("p");
    paragraph.innerHTML = child.innerHTML.trim() || "<br>";
    fragment.appendChild(paragraph);
  });
}

function retargetListItems(list: HTMLElement, items: HTMLElement[], ordered: boolean) {
  rewriteListChildren(list, items, (child, fragment, state) => {
    if (!state.otherList) {
      state.otherList = createListElement(ordered);
      fragment.appendChild(state.otherList);
    }
    state.otherList.appendChild(child.cloneNode(true));
  });
}

function rewriteListChildren(
  list: HTMLElement,
  items: HTMLElement[],
  handleSelected: (
    child: HTMLElement,
    fragment: DocumentFragment,
    state: { otherList: HTMLElement | null }
  ) => void
) {
  const itemSet = new Set(items);
  const children = Array.from(list.children) as HTMLElement[];
  const fragment = document.createDocumentFragment();
  const state = { otherList: null as HTMLElement | null };
  let currentList: HTMLElement | null = null;

  children.forEach((child) => {
    if (child.tagName !== "LI") return;
    if (itemSet.has(child)) {
      currentList = null;
      handleSelected(child, fragment, state);
      return;
    }

    state.otherList = null;
    if (!currentList) {
      currentList = document.createElement(list.tagName);
      currentList.className = list.className;
      fragment.appendChild(currentList);
    }
    currentList.appendChild(child.cloneNode(true));
  });

  list.replaceWith(fragment);
}

function isBreakNode(node: Node): boolean {
  return node.nodeType === Node.ELEMENT_NODE && (node as HTMLElement).tagName === "BR";
}

function isNestedBlock(node: Node): node is HTMLElement {
  if (node.nodeType !== Node.ELEMENT_NODE) return false;
  return ["P", "DIV", "H2", "H3", "BLOCKQUOTE", "UL", "OL"].includes((node as HTMLElement).tagName);
}

function splitBlockChildLines(block: HTMLElement): Node[][] {
  const lines: Node[][] = [[]];
  Array.from(block.childNodes).forEach((node) => {
    if (isBreakNode(node)) {
      lines.push([]);
      return;
    }
    if (isNestedBlock(node)) {
      if (lines[lines.length - 1].length) lines.push([]);
      lines[lines.length - 1].push(node);
      lines.push([]);
      return;
    }
    lines[lines.length - 1].push(node);
  });
  while (lines.length > 1 && lines[lines.length - 1].length === 0) {
    lines.pop();
  }
  return lines;
}

function lineContainsNode(nodes: Node[], target: Node | null): boolean {
  if (!target) return false;
  return nodes.some((node) => node === target || (node.nodeType === Node.ELEMENT_NODE && node.contains(target)));
}

function createParagraphFromNodes(nodes: Node[]): HTMLElement {
  const paragraph = document.createElement("p");
  nodes.forEach((node) => {
    if (isNestedBlock(node) && node.tagName === "P") {
      while (node.firstChild) paragraph.appendChild(node.firstChild);
      return;
    }
    paragraph.appendChild(node);
  });
  if (!paragraph.innerHTML.trim()) paragraph.innerHTML = "<br>";
  return paragraph;
}

function extractCaretLineAsBlock(block: HTMLElement, selection: Selection): HTMLElement {
  const lines = splitBlockChildLines(block);
  if (lines.length <= 1) return block;

  const range = selection.getRangeAt(0);
  let lineIndex = lines.findIndex((nodes) => lineContainsNode(nodes, range.startContainer));
  if (lineIndex < 0 && range.startContainer === block) {
    let childOffset = 0;
    lineIndex = 0;
    for (let i = 0; i < lines.length; i += 1) {
      const endOffset = childOffset + lines[i].length;
      if (range.startOffset <= endOffset) {
        lineIndex = i;
        break;
      }
      childOffset = endOffset + 1;
      lineIndex = i;
    }
  } else if (lineIndex < 0) {
    lineIndex = 0;
  }

  const parent = block.parentNode;
  if (!parent) return block;

  const created = lines.map((nodes) => createParagraphFromNodes(nodes));
  created.forEach((paragraph) => parent.insertBefore(paragraph, block));
  block.remove();

  const current = created[lineIndex];
  placeCursorAtEnd(current);
  return current;
}

function gatherBlocksForListConversion(selection: Selection, root: HTMLElement): HTMLElement[] {
  if (!selection.rangeCount) return [];

  const range = selection.getRangeAt(0);
  const caretBlock = getBlockElement(selection.anchorNode, root);

  if (range.collapsed) {
    if (!caretBlock || caretBlock.tagName === "UL" || caretBlock.tagName === "OL") return [];
    if (caretBlock.tagName === "LI") return [caretBlock];
    return [extractCaretLineAsBlock(caretBlock, selection)];
  }

  const selected = getTopLevelBlocksInSelection(selection, root).flatMap((block) => {
    if (block.tagName === "DIV" && block.parentElement === root) {
      const inner = getBlockElement(selection.anchorNode, block) || caretBlock;
      return inner && inner !== block ? [inner] : [];
    }
    return [block];
  }).filter((block) => block.tagName !== "UL" && block.tagName !== "OL");

  if (selected.length) return selected;
  if (!caretBlock || caretBlock.tagName === "UL" || caretBlock.tagName === "OL") return [];
  return [caretBlock];
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

function placeCursorAtStart(el: HTMLElement) {
  const selection = window.getSelection();
  if (!selection) return;
  const range = document.createRange();
  range.selectNodeContents(el);
  range.collapse(true);
  selection.removeAllRanges();
  selection.addRange(range);
}

function splitBlockAtCaret(block: HTMLElement, nextTag: string): HTMLElement | null {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return null;

  if (!block.lastChild) block.innerHTML = "<br>";

  const range = selection.getRangeAt(0);
  const afterRange = document.createRange();
  afterRange.setStart(range.startContainer, range.startOffset);
  afterRange.setEnd(block, block.childNodes.length);

  const next = document.createElement(nextTag);
  next.appendChild(afterRange.extractContents());
  if (!next.innerHTML.trim()) next.innerHTML = "<br>";
  if (!block.innerHTML.trim()) block.innerHTML = "<br>";

  const parent = block.parentNode;
  if (!parent) return null;
  parent.insertBefore(next, block.nextSibling);
  placeCursorAtStart(next);
  return next;
}

export function handleListEnterKey(editorRoot: HTMLElement): boolean {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return false;

  const block = getBlockElement(selection.anchorNode, editorRoot);
  if (!block || block.tagName !== "LI") return false;

  const list = block.parentElement;
  if (!list || (list.tagName !== "UL" && list.tagName !== "OL")) return false;

  if (!block.textContent?.trim()) {
    const paragraph = document.createElement("p");
    paragraph.innerHTML = "<br>";
    list.parentNode?.insertBefore(paragraph, list.nextSibling);
    if (block.previousElementSibling) {
      block.remove();
    }
    if (!list.querySelector("li")) list.remove();
    placeCursorAtStart(paragraph);
    return true;
  }

  return Boolean(splitBlockAtCaret(block, "li"));
}

export function handleVisualEnterKey(editorRoot: HTMLElement): boolean {
  if (handleListEnterKey(editorRoot)) return true;

  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return false;

  const block = getBlockElement(selection.anchorNode, editorRoot);
  if (!block || block.tagName === "PRE") return false;

  return Boolean(splitBlockAtCaret(block, "p"));
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

function isMatchingList(el: HTMLElement | null, ordered: boolean): el is HTMLElement {
  return Boolean(el && el.tagName === (ordered ? "OL" : "UL"));
}

export function toggleList(ordered: boolean, editorRoot: HTMLElement) {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;

  const saved = selection.getRangeAt(0).cloneRange();
  editorRoot.focus();
  selection.removeAllRanges();
  selection.addRange(saved);

  const blocks = gatherBlocksForListConversion(selection, editorRoot);
  const listItems = blocks.filter((block) => block.tagName === "LI");

  if (listItems.length) {
    const list = findParentList(listItems[0], editorRoot);
    if (!list) return;
    const isOrdered = list.tagName === "OL";
    if (ordered === isOrdered) {
      unwrapListItems(list, listItems);
      return;
    }
    retargetListItems(list, listItems, ordered);
    return;
  }

  if (!blocks.length) {
    document.execCommand(ordered ? "insertOrderedList" : "insertUnorderedList");
    normalizeNativeLists(editorRoot, ordered);
    return;
  }

  const list = createListElement(ordered);
  const firstBlock = blocks[0];
  const lastBlock = blocks[blocks.length - 1];
  blocks.forEach((block) => list.appendChild(blockToListItem(block)));

  const prev = firstBlock.previousElementSibling as HTMLElement | null;
  const next = lastBlock.nextElementSibling as HTMLElement | null;

  if (isMatchingList(prev, ordered)) {
    while (list.firstChild) prev.appendChild(list.firstChild);
    blocks.forEach((block) => block.remove());
    if (isMatchingList(next, ordered)) {
      while (next.firstChild) prev.appendChild(next.firstChild);
      next.remove();
    }
    placeCursorAtEnd(prev.querySelector("li:last-child") || prev);
    return;
  }

  editorRoot.insertBefore(list, firstBlock);
  blocks.forEach((block) => block.remove());

  if (isMatchingList(next, ordered)) {
    while (next.firstChild) list.appendChild(next.firstChild);
    next.remove();
  }

  placeCursorAtEnd(list.querySelector("li") || list);
}
