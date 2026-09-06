function normalizeText(value: string): string {
  return value.replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
}

const BULLET_PREFIX = /^[\u2022\u2023\u25E6\u2043\u2219•●○◦\-–—]\s+/;
const ORDERED_PREFIX = /^\d+[\.\)]\s+/;

function stripListPrefix(text: string): string {
  return text.replace(BULLET_PREFIX, "").replace(ORDERED_PREFIX, "").trim();
}

function isBulletParagraphText(text: string): boolean {
  return BULLET_PREFIX.test(text.trim());
}

function isOrderedParagraphText(text: string): boolean {
  return ORDERED_PREFIX.test(text.trim());
}

function groupBulletParagraphBlocks(blocks: string[]): string[] {
  const grouped: string[] = [];
  let index = 0;

  while (index < blocks.length) {
    const block = blocks[index];
    const textMatch = block.match(/^<p>([\s\S]*)<\/p>$/i);
    if (!textMatch) {
      grouped.push(block);
      index += 1;
      continue;
    }

    const rawText = textMatch[1].replace(/<[^>]+>/g, "").trim();
    const ordered = isOrderedParagraphText(rawText);
    const bulleted = isBulletParagraphText(rawText);

    if (!ordered && !bulleted) {
      grouped.push(block);
      index += 1;
      continue;
    }

    const items: string[] = [];
    while (index < blocks.length) {
      const nextBlock = blocks[index];
      const nextMatch = nextBlock.match(/^<p>([\s\S]*)<\/p>$/i);
      if (!nextMatch) break;

      const nextText = nextMatch[1].replace(/<[^>]+>/g, "").trim();
      const nextOrdered = isOrderedParagraphText(nextText);
      const nextBulleted = isBulletParagraphText(nextText);
      if (ordered ? !nextOrdered : !nextBulleted) break;

      items.push(stripListPrefix(nextText));
      index += 1;
    }

    if (ordered) {
      grouped.push(items.map((item, itemIndex) => `${itemIndex + 1}. ${item}`).join("\n"));
    } else {
      grouped.push(items.map((item) => `- ${item}`).join("\n"));
    }
  }

  return grouped;
}

function parseFontSizePt(style: string): number | null {
  const match = style.match(/font-size:\s*([\d.]+)pt/i);
  return match ? Number(match[1]) : null;
}

function isBoldStyle(style: string, element: Element): boolean {
  if (/font-weight:\s*(700|bold)/i.test(style)) return true;
  return element.querySelector("b, strong") !== null;
}

function detectHeadingLevel(element: Element): 1 | 2 | 3 | 4 | null {
  const tag = element.tagName.toLowerCase();
  if (tag === "h1") return 1;
  if (tag === "h2") return 2;
  if (tag === "h3") return 3;
  if (tag === "h4") return 4;

  const ariaLevel = element.getAttribute("aria-level");
  if (ariaLevel) {
    const level = Number(ariaLevel);
    if (level >= 1 && level <= 4) return level as 1 | 2 | 3 | 4;
  }

  const role = element.getAttribute("role");
  if (role === "heading") {
    const level = Number(ariaLevel || "2");
    if (level >= 1 && level <= 4) return level as 1 | 2 | 3 | 4;
  }

  const style = element.getAttribute("style") || "";
  const span = element.querySelector("span[style]") as HTMLElement | null;
  const spanStyle = span?.getAttribute("style") || "";
  const combined = `${style} ${spanStyle}`;
  const fontSize = parseFontSizePt(combined);
  const bold = isBoldStyle(combined, element);

  if (fontSize && fontSize >= 24) return 1;
  if (fontSize && fontSize >= 18) return 2;
  if (fontSize && fontSize >= 14 && bold) return 3;
  if (fontSize && fontSize >= 12 && bold) return 4;
  if (bold && normalizeText(element.textContent || "").length < 90) return 3;

  return null;
}

function inlineHtml(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) {
    return (node.textContent || "").replace(/\u00a0/g, " ");
  }

  if (node.nodeType !== Node.ELEMENT_NODE) return "";

  const el = node as HTMLElement;
  const tag = el.tagName.toLowerCase();
  const children = Array.from(el.childNodes).map(inlineHtml).join("");

  switch (tag) {
    case "br":
      return "\n";
    case "strong":
    case "b":
      return children.trim() ? `<strong>${children}</strong>` : "";
    case "em":
    case "i":
      return children.trim() ? `<em>${children}</em>` : "";
    case "a":
      return children.trim()
        ? `<a href="${el.getAttribute("href") || "#"}">${children}</a>`
        : "";
    case "span":
    case "font":
      return children;
    default:
      return children;
  }
}

function blockText(element: Element): string {
  return normalizeText(
    Array.from(element.childNodes)
      .map((node) => inlineHtml(node))
      .join("")
  );
}

function convertTable(table: HTMLTableElement): string {
  const rows = Array.from(table.querySelectorAll("tr"));
  if (!rows.length) return "";

  const firstRowCells = Array.from(rows[0].querySelectorAll("th, td"));
  const hasHeader =
    rows[0].querySelector("th") !== null ||
    firstRowCells.every((cell) => isBoldStyle(cell.getAttribute("style") || "", cell));

  const bodyRows = hasHeader ? rows.slice(1) : rows;

  const headerHtml = hasHeader
    ? `<thead>\n<tr>${firstRowCells
        .map((cell) => `<th>${blockText(cell)}</th>`)
        .join("")}</tr>\n</thead>`
    : "";

  const bodyHtml = bodyRows
    .map((row) => {
      const cells = Array.from(row.querySelectorAll("th, td"));
      if (!cells.length) return "";
      return `<tr>${cells.map((cell) => `<td>${blockText(cell)}</td>`).join("")}</tr>`;
    })
    .filter(Boolean)
    .join("\n");

  return `<div class="blog-table-wrap">
<table class="blog-table">
${headerHtml}
<tbody>
${bodyHtml}
</tbody>
</table>
</div>`;
}

function convertList(list: HTMLElement, ordered: boolean): string {
  const items = Array.from(list.children).filter((child) => child.tagName.toLowerCase() === "li");
  if (!items.length) return "";

  const getItemText = (item: Element) => {
    const paragraph = item.querySelector("p");
    return blockText(paragraph || item);
  };

  if (ordered) {
    return items
      .map((item, index) => `${index + 1}. ${getItemText(item)}`)
      .join("\n");
  }

  return items.map((item) => `- ${getItemText(item)}`).join("\n");
}

function convertBlock(element: Element): string {
  const tag = element.tagName.toLowerCase();

  if (tag === "table") {
    return convertTable(element as HTMLTableElement);
  }

  if (tag === "ul") {
    return convertList(element as HTMLElement, false);
  }

  if (tag === "ol") {
    return convertList(element as HTMLElement, true);
  }

  if (tag === "blockquote") {
    const text = blockText(element);
    return text ? `> ${text}` : "";
  }

  const headingLevel = detectHeadingLevel(element);
  const text = blockText(element);
  if (!text) return "";

  if (headingLevel) {
    return `<h${headingLevel}>${text}</h${headingLevel}>`;
  }

  if (tag === "p" || tag === "div") {
    return `<p>${Array.from(element.childNodes).map(inlineHtml).join("").trim()}</p>`;
  }

  return `<p>${text}</p>`;
}

function collectBlocks(root: ParentNode): string[] {
  const blocks: string[] = [];

  root.childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = normalizeText(node.textContent || "");
      if (text) blocks.push(`<p>${text}</p>`);
      return;
    }

    if (node.nodeType !== Node.ELEMENT_NODE) return;

    const el = node as HTMLElement;
    const tag = el.tagName.toLowerCase();

    if (["meta", "style", "script", "link", "colgroup", "col"].includes(tag)) {
      return;
    }

    if (tag === "table") {
      const table = convertTable(el as HTMLTableElement);
      if (table) blocks.push(table);
      return;
    }

    if (tag === "ul" || tag === "ol") {
      const list = convertList(el, tag === "ol");
      if (list) blocks.push(list);
      return;
    }

    if (tag === "div") {
      const blockChildren = Array.from(el.children).some((child) =>
        ["p", "h1", "h2", "h3", "h4", "h5", "h6", "ul", "ol", "table", "blockquote", "div"].includes(
          child.tagName.toLowerCase()
        )
      );
      if (blockChildren) {
        blocks.push(...collectBlocks(el));
        return;
      }
    }

    if (["h1", "h2", "h3", "h4", "h5", "h6", "p", "blockquote", "div"].includes(tag)) {
      const block = convertBlock(el);
      if (block) blocks.push(block);
      return;
    }

    if (tag === "b" && el.id.startsWith("docs-internal-guid")) {
      blocks.push(...collectBlocks(el));
      return;
    }

    blocks.push(...collectBlocks(el));
  });

  return blocks;
}

export function convertPastedHtmlToContent(html: string): string | null {
  if (!html.trim()) return null;

  const doc = new DOMParser().parseFromString(html, "text/html");
  const blocks = groupBulletParagraphBlocks(collectBlocks(doc.body));
  const content = blocks.join("\n\n").trim();

  return content || null;
}

export function getClipboardHtml(data: DataTransfer | null): string {
  if (!data) return "";
  return data.getData("text/html") || "";
}
