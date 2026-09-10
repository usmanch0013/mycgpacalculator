import { renderMarkdown } from "@/lib/blog/markdown";
import { normalizeArticleHtml, stripInlineColors } from "@/lib/blog/article-html";
import { isExternalArticleLink, normalizeArticleLinkHref } from "@/lib/blog/link-href";

export function sourceToVisualHtml(source: string): string {
  if (!source.trim()) return "<p><br></p>";
  return renderMarkdown(source);
}

export function visualHtmlToSource(html: string): string {
  return stripInlineColors(
    html
      .replace(/\u00a0/g, " ")
      .replace(/<div><br><\/div>/gi, "")
      .replace(/<p><br><\/p>/gi, "")
      .replace(/<br class="Apple-interchange-newline">/gi, "")
      .trim()
  );
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

function stampLinkElement(anchor: HTMLAnchorElement) {
  anchor.classList.add("blog-link");
}

function findLinkFromNode(node: Node | null): HTMLAnchorElement | null {
  if (!node) return null;
  if (node.nodeType === Node.ELEMENT_NODE) {
    const el = node as HTMLElement;
    return el.tagName === "A" ? (el as HTMLAnchorElement) : el.closest("a");
  }
  return node.parentElement?.closest("a") ?? null;
}

export function insertLink(rawUrl: string) {
  restoreEditorSelection();

  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;

  const href = normalizeArticleLinkHref(rawUrl);
  if (!href) return;

  const range = selection.getRangeAt(0);
  const anchor = document.createElement("a");
  anchor.href = href;
  stampLinkElement(anchor);
  if (isExternalArticleLink(href)) {
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
      const created = findLinkFromNode(selection.anchorNode);
      if (created) {
        created.href = href;
        stampLinkElement(created);
        if (isExternalArticleLink(href)) {
          created.target = "_blank";
          created.rel = "noopener noreferrer";
        }
      }
      clearSavedEditorSelection();
      return;
    }
  }

  clearSavedEditorSelection();
  selection.removeAllRanges();
  const newRange = document.createRange();
  newRange.selectNodeContents(anchor);
  newRange.collapse(false);
  selection.addRange(newRange);
}

type EditorCaretBookmark = {
  blockIndex: number;
  offset: number;
  atEnd: boolean;
};

let pendingSelection: Range | null = null;
let pendingCaret: EditorCaretBookmark | null = null;

export function saveEditorSelection(editorRoot?: HTMLElement) {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;

  const range = selection.getRangeAt(0).cloneRange();
  pendingSelection = range;
  pendingCaret = null;

  if (!editorRoot) return;

  const block = getBlockElement(range.startContainer, editorRoot);
  if (!block || block.parentElement !== editorRoot) return;

  const blockIndex = Array.from(editorRoot.children).indexOf(block);
  if (blockIndex < 0) return;

  const pre = document.createRange();
  pre.selectNodeContents(block);
  pre.setEnd(range.startContainer, range.startOffset);

  pendingCaret = {
    blockIndex,
    offset: pre.toString().length,
    atEnd: isRangeAtBlockEnd(range, block),
  };
}

export function restoreEditorSelection(): boolean {
  const selection = window.getSelection();
  if (!selection || !pendingSelection) return false;

  try {
    selection.removeAllRanges();
    selection.addRange(pendingSelection);
    return true;
  } catch {
    pendingSelection = null;
    pendingCaret = null;
    return false;
  }
}

export function clearSavedEditorSelection() {
  pendingSelection = null;
  pendingCaret = null;
}

function isBlockLevelHtml(html: string): boolean {
  const trimmed = html.trim();
  return /^<(figure|div|table|blockquote|h[1-6]|ul|ol|hr)\b/i.test(trimmed);
}

function isRangeAtBlockEnd(range: Range, block: HTMLElement): boolean {
  const tail = document.createRange();
  tail.selectNodeContents(block);
  tail.setStart(range.endContainer, range.endOffset);
  const fragment = tail.cloneContents();
  const text = (fragment.textContent || "").replace(/\u00a0/g, " ").trim();
  if (text) return false;
  return !fragment.querySelector("img,video,iframe,figure,table");
}

function placeCursorAfter(node: Node) {
  const selection = window.getSelection();
  if (!selection) return;
  const newRange = document.createRange();
  newRange.setStartAfter(node);
  newRange.collapse(true);
  selection.removeAllRanges();
  selection.addRange(newRange);
}

function appendBlockHtml(html: string, editorRoot: HTMLElement) {
  const template = document.createElement("template");
  template.innerHTML = html.trim();
  const elements = Array.from(template.content.children) as HTMLElement[];
  if (!elements.length) return;

  elements.forEach((el) => editorRoot.appendChild(el));
  const trailing = document.createElement("p");
  trailing.innerHTML = "<br>";
  editorRoot.appendChild(trailing);
  placeCursorAtStart(trailing);
}

function splitBlockAtTextOffset(block: HTMLElement, offset: number): HTMLElement | null {
  if (offset <= 0) return block;

  const walker = document.createTreeWalker(block, NodeFilter.SHOW_TEXT);
  let remaining = offset;
  let textNode: Text | null = null;
  let splitAt = 0;

  while ((textNode = walker.nextNode() as Text | null)) {
    const len = textNode.length;
    if (remaining <= len) {
      splitAt = remaining;
      break;
    }
    remaining -= len;
  }

  if (!textNode) return null;

  const range = document.createRange();
  range.setStart(textNode, splitAt);
  range.setEnd(block, block.childNodes.length);

  const tag = block.tagName === "PRE" ? "pre" : "p";
  const after = document.createElement(tag);
  after.appendChild(range.extractContents());
  if (!after.innerHTML.trim()) after.innerHTML = "<br>";

  if (!block.innerHTML.trim()) block.innerHTML = "<br>";
  block.parentNode?.insertBefore(after, block.nextSibling);
  return after;
}

function insertBlockAtBookmark(html: string, editorRoot: HTMLElement) {
  const template = document.createElement("template");
  template.innerHTML = html.trim();
  const elements = Array.from(template.content.children) as HTMLElement[];
  if (!elements.length) return;

  if (!pendingCaret) {
    appendBlockHtml(html, editorRoot);
    return;
  }

  const blocks = Array.from(editorRoot.children) as HTMLElement[];
  const block = blocks[pendingCaret.blockIndex];
  if (!block) {
    appendBlockHtml(html, editorRoot);
    return;
  }

  let insertBefore: Node | null = null;

  if (pendingCaret.atEnd) {
    insertBefore = block.nextSibling;
  } else if (pendingCaret.offset === 0) {
    insertBefore = block;
  } else {
    const afterPart = splitBlockAtTextOffset(block, pendingCaret.offset);
    insertBefore = afterPart;
  }

  elements.forEach((el) => {
    editorRoot.insertBefore(el, insertBefore);
  });

  const trailing = document.createElement("p");
  trailing.innerHTML = "<br>";
  const lastInserted = elements[elements.length - 1];
  editorRoot.insertBefore(trailing, lastInserted.nextSibling);
  placeCursorAtStart(trailing);
}

function insertBlockHtmlAtCaret(html: string, editorRoot: HTMLElement) {
  const selection = window.getSelection();
  if (!selection) return;

  const template = document.createElement("template");
  template.innerHTML = html.trim();
  const elements = Array.from(template.content.children) as HTMLElement[];
  if (!elements.length) return;

  if (!selection.rangeCount) {
    appendBlockHtml(html, editorRoot);
    return;
  }

  const range = selection.getRangeAt(0);
  let block = getBlockElement(range.startContainer, editorRoot);

  if (!block || block.parentElement !== editorRoot) {
    appendBlockHtml(html, editorRoot);
    return;
  }

  let insertAfter: HTMLElement = block;

  if (!isRangeAtBlockEnd(range, block)) {
    const afterPart = splitBlockAtCaret(block, block.tagName === "PRE" ? "pre" : "p");
    insertAfter = (afterPart?.previousElementSibling as HTMLElement) || block;
  }

  let lastInserted: HTMLElement | null = null;
  elements.forEach((el) => {
    insertAfter.parentNode?.insertBefore(el, insertAfter.nextSibling);
    lastInserted = el;
  });

  const trailing = document.createElement("p");
  trailing.innerHTML = "<br>";
  lastInserted?.parentNode?.insertBefore(trailing, lastInserted.nextSibling);
  placeCursorAtStart(trailing);
}

export function insertHtmlAtSelection(html: string, editorRoot?: HTMLElement) {
  const selection = window.getSelection();
  if (!selection) return;

  if (editorRoot && isBlockLevelHtml(html)) {
    if (!pendingCaret && selection.rangeCount === 0) {
      restoreEditorSelection();
    }

    if (pendingCaret) {
      insertBlockAtBookmark(html, editorRoot);
    } else {
      editorRoot.focus();
      insertBlockHtmlAtCaret(html, editorRoot);
    }
    clearSavedEditorSelection();
    return;
  }

  if (selection.rangeCount === 0) {
    restoreEditorSelection();
  }

  if (!selection.rangeCount) {
    if (editorRoot) appendBlockHtml(html, editorRoot);
    clearSavedEditorSelection();
    return;
  }

  const range = selection.getRangeAt(0);
  range.deleteContents();

  const template = document.createElement("template");
  template.innerHTML = html;
  const node = template.content;
  const lastNode = node.lastChild;
  range.insertNode(node);

  if (lastNode) {
    placeCursorAfter(lastNode);
  }

  clearSavedEditorSelection();
}

export function applyBlockAlignment(
  align: "left" | "center" | "right",
  editorRoot: HTMLElement
) {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;

  const block = getBlockElement(selection.anchorNode, editorRoot);
  if (!block) return;

  if (block.classList.contains("blog-image")) {
    block.classList.remove("blog-image--center");
    if (align === "center") block.classList.add("blog-image--center");
    block.style.textAlign = "";
    return;
  }

  block.style.textAlign = align === "left" ? "" : align;
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

function stripLeadingListMarker(html: string): string {
  return html
    .replace(/^(?:&nbsp;|\u00a0|\s)*[\u2022\u2023\u25E6\u2043\u2219•●○◦\-–—]\s+/i, "")
    .replace(/^(?:&nbsp;|\u00a0|\s)*\d+[.)]\s+/, "")
    .replace(/^(?:&nbsp;|\u00a0|\s)*-\s+/, "")
    .trim();
}

function blockToListItem(block: HTMLElement): HTMLElement {
  const item = document.createElement("li");
  const inner = block.innerHTML.trim() || "<br>";
  item.innerHTML = stripLeadingListMarker(inner) || "<br>";
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

function lineIntersectsRange(nodes: Node[], range: Range): boolean {
  return nodes.some((node) => range.intersectsNode(node));
}

function rangeIntersectsBlock(range: Range, block: HTMLElement): boolean {
  try {
    const blockRange = document.createRange();
    blockRange.selectNodeContents(block);
    return (
      range.compareBoundaryPoints(Range.END_TO_START, blockRange) <= 0 &&
      range.compareBoundaryPoints(Range.START_TO_END, blockRange) >= 0
    );
  } catch {
    return range.intersectsNode(block);
  }
}

function splitBlockIntoLineParagraphs(block: HTMLElement): HTMLElement[] {
  const lines = splitBlockChildLines(block);
  if (lines.length <= 1) return [block];

  const parent = block.parentNode;
  if (!parent) return [block];

  const paragraphs = lines.map((nodes) => createParagraphFromNodes(nodes));
  paragraphs.forEach((paragraph) => parent.insertBefore(paragraph, block));
  block.remove();
  return paragraphs;
}

function expandBlocksForListConversion(blocks: HTMLElement[], range: Range): HTMLElement[] {
  const expanded: HTMLElement[] = [];

  blocks.forEach((block) => {
    if (block.tagName === "LI") {
      expanded.push(block);
      return;
    }

    if (!rangeIntersectsBlock(range, block)) {
      return;
    }

    const lines = splitBlockChildLines(block);
    if (lines.length <= 1) {
      expanded.push(block);
      return;
    }

    const selectedIndexes = lines
      .map((nodes, index) => (lineIntersectsRange(nodes, range) ? index : -1))
      .filter((index) => index >= 0);

    if (selectedIndexes.length <= 1) {
      if (selectedIndexes.length === 1) {
        const paragraphs = splitBlockIntoLineParagraphs(block);
        const paragraph = paragraphs[selectedIndexes[0]];
        if (paragraph) expanded.push(paragraph);
        return;
      }
      expanded.push(block);
      return;
    }

    const paragraphs = splitBlockIntoLineParagraphs(block);
    selectedIndexes.forEach((index) => {
      const paragraph = paragraphs[index];
      if (paragraph) expanded.push(paragraph);
    });
  });

  return expanded.length ? expanded : blocks;
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

  let selected = getTopLevelBlocksInSelection(selection, root)
    .flatMap((block) => {
      if (block.tagName === "DIV" && block.parentElement === root) {
        const inner = getBlockElement(selection.anchorNode, block) || caretBlock;
        return inner && inner !== block ? [inner] : [block];
      }
      return [block];
    })
    .filter((block) => block.tagName !== "UL" && block.tagName !== "OL");

  if (!selected.length) {
    if (!caretBlock || caretBlock.tagName === "UL" || caretBlock.tagName === "OL") return [];
    selected = [caretBlock];
  }

  selected = selected.filter((block) => rangeIntersectsBlock(range, block));

  return expandBlocksForListConversion(selected, range);
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

export type ListStyle = "card" | "simple";

function getListFromSelection(editorRoot: HTMLElement): HTMLElement | null {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return null;

  const block = getBlockElement(selection.anchorNode, editorRoot);
  if (!block) return null;

  if (block.tagName === "LI") {
    const parent = block.parentElement;
    return parent && (parent.tagName === "UL" || parent.tagName === "OL") ? parent : null;
  }

  if (block.tagName === "UL" || block.tagName === "OL") {
    return block;
  }

  return findParentList(selection.anchorNode, editorRoot);
}

export function getActiveListStyle(editorRoot: HTMLElement): ListStyle | null {
  const list = getListFromSelection(editorRoot);
  if (!list || !list.classList.contains("blog-list")) return null;
  return list.classList.contains("blog-list--simple") ? "simple" : "card";
}

export function setListStyle(style: ListStyle, editorRoot: HTMLElement) {
  const list = getListFromSelection(editorRoot);
  if (!list || !list.classList.contains("blog-list")) return;

  if (style === "simple") {
    list.classList.add("blog-list--simple");
  } else {
    list.classList.remove("blog-list--simple");
  }
}

export function toggleList(ordered: boolean, editorRoot: HTMLElement) {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;

  const saved = selection.getRangeAt(0).cloneRange();
  editorRoot.focus();
  selection.removeAllRanges();
  selection.addRange(saved);

  let blocks = gatherBlocksForListConversion(selection, editorRoot);
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
    const caretBlock = getBlockElement(selection.anchorNode, editorRoot);
    if (
      !caretBlock ||
      caretBlock.parentElement !== editorRoot ||
      caretBlock.tagName === "UL" ||
      caretBlock.tagName === "OL"
    ) {
      return;
    }
    blocks = expandBlocksForListConversion([caretBlock], selection.getRangeAt(0));
    if (!blocks.length) blocks = [caretBlock];
  }

  const list = createListElement(ordered);
  const firstBlock = blocks[0];
  blocks.forEach((block) => list.appendChild(blockToListItem(block)));

  editorRoot.insertBefore(list, firstBlock);
  blocks.forEach((block) => block.remove());

  placeCursorAtEnd(list.querySelector("li") || list);
}
