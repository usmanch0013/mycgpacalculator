export function buildTableHtml(rows: number, cols: number, withHeader = true): string {
  const safeRows = Math.min(Math.max(rows, 2), 12);
  const safeCols = Math.min(Math.max(cols, 2), 8);

  const headerCells = Array.from({ length: safeCols }, (_, i) => `<th>Header ${i + 1}</th>`).join("");
  const bodyRow = `<tr>${Array.from({ length: safeCols }, () => "<td>Cell</td>").join("")}</tr>`;
  const bodyRows = Array.from({ length: withHeader ? safeRows - 1 : safeRows }, () => bodyRow).join("\n");

  return `<div class="blog-table-wrap">
<table class="blog-table">
${withHeader ? `<thead>\n<tr>${headerCells}</tr>\n</thead>` : ""}
<tbody>
${bodyRows}
</tbody>
</table>
</div>`;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export function buildFaqHtml(items: FaqItem[]): string {
  const blocks = items
    .filter((item) => item.question.trim() || item.answer.trim())
    .map(
      (item) => `<details class="blog-faq__item">
<summary class="blog-faq__question">${escapeHtml(item.question.trim() || "Your question")}</summary>
<div class="blog-faq__answer">
<p>${escapeHtml(item.answer.trim() || "Your answer goes here.")}</p>
</div>
</details>`
    )
    .join("\n");

  return `<div class="blog-faq">\n${blocks}\n</div>`;
}

export function buildImageHtml(url: string, alt: string, align: "default" | "wide" | "center" = "default"): string {
  const cleanUrl = url.trim();
  const cleanAlt = alt.trim() || "Image";
  const alignClass =
    align === "wide" ? " blog-image--wide" : align === "center" ? " blog-image--center" : "";

  return `<figure class="blog-image${alignClass}">
<img src="${cleanUrl}" alt="${escapeHtml(cleanAlt)}" loading="lazy" />
<figcaption>${escapeHtml(cleanAlt)}</figcaption>
</figure>`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
