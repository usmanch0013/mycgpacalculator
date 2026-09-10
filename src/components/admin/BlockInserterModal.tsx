"use client";

import { useEffect, useState } from "react";
import {
  buildFaqHtml,
  buildImageHtml,
  buildTableHtml,
  type FaqItem,
} from "@/lib/blog/content-blocks";

type BlockTab = "table" | "faq" | "image" | "html";

interface BlockInserterModalProps {
  open: boolean;
  initialTab?: BlockTab;
  onClose: () => void;
  onInsert: (html: string) => void;
  onUploadImage?: (file: File) => Promise<string | null>;
}

const DEFAULT_FAQ: FaqItem[] = [
  { question: "What is semester GPA?", answer: "Semester GPA is the average grade points for one term only." },
  { question: "How is CGPA different from SGPA?", answer: "CGPA is cumulative across all semesters; SGPA covers a single semester." },
];

const HTML_EXAMPLE = `<div class="blog-table-wrap">
<table class="blog-table">
<thead>
<tr><th>Grade</th><th>Points</th></tr>
</thead>
<tbody>
<tr><td>A+</td><td>4.00</td></tr>
<tr><td>A</td><td>3.75</td></tr>
</tbody>
</table>
</div>`;

export default function BlockInserterModal({
  open,
  initialTab = "table",
  onClose,
  onInsert,
  onUploadImage,
}: BlockInserterModalProps) {
  const [tab, setTab] = useState<BlockTab>(initialTab);
  const [rows, setRows] = useState(4);
  const [cols, setCols] = useState(3);
  const [withHeader, setWithHeader] = useState(true);
  const [faqItems, setFaqItems] = useState<FaqItem[]>(DEFAULT_FAQ);
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [imageTitle, setImageTitle] = useState("");
  const [imageDescription, setImageDescription] = useState("");
  const [imageLink, setImageLink] = useState("");
  const [imageAlign, setImageAlign] = useState<"default" | "wide" | "center">("default");
  const [customHtml, setCustomHtml] = useState(HTML_EXAMPLE);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (open) setTab(initialTab);
  }, [open, initialTab]);

  if (!open) return null;

  function insertAndClose(html: string) {
    onInsert(`\n\n${html.trim()}\n\n`);
    onClose();
  }

  function updateFaq(index: number, key: keyof FaqItem, value: string) {
    setFaqItems((prev) => prev.map((item, i) => (i === index ? { ...item, [key]: value } : item)));
  }

  async function handleImageUpload(file: File) {
    if (!onUploadImage) return;
    setUploading(true);
    try {
      const url = await onUploadImage(file);
      if (url) setImageUrl(url);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="block-modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="block-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="block-modal-title"
      >
        <header className="block-modal__head">
          <div>
            <h2 id="block-modal-title">Insert block</h2>
            <p>Add tables, FAQ accordions, images, or custom HTML like WordPress.</p>
          </div>
          <button type="button" className="block-modal__close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </header>

        <div className="block-modal__tabs">
          {(["table", "faq", "image", "html"] as BlockTab[]).map((item) => (
            <button
              key={item}
              type="button"
              className={`block-modal__tab ${tab === item ? "block-modal__tab--active" : ""}`}
              onClick={() => setTab(item)}
            >
              {item === "table" && "Table"}
              {item === "faq" && "FAQ accordion"}
              {item === "image" && "Image"}
              {item === "html" && "Custom HTML"}
            </button>
          ))}
        </div>

        <div className="block-modal__body">
          {tab === "table" && (
            <div className="block-modal__panel">
              <div className="block-modal__grid">
                <label className="block-modal__field">
                  <span>Rows</span>
                  <input type="number" min={2} max={12} value={rows} onChange={(e) => setRows(Number(e.target.value))} />
                </label>
                <label className="block-modal__field">
                  <span>Columns</span>
                  <input type="number" min={2} max={8} value={cols} onChange={(e) => setCols(Number(e.target.value))} />
                </label>
              </div>
              <label className="block-modal__check">
                <input type="checkbox" checked={withHeader} onChange={(e) => setWithHeader(e.target.checked)} />
                Include header row
              </label>
              <p className="block-modal__hint">
                Inserts a responsive HTML table. Edit cell text directly in the editor after inserting.
              </p>
              <button
                type="button"
                className="admin-btn admin-btn--primary"
                onClick={() => insertAndClose(buildTableHtml(rows, cols, withHeader))}
              >
                Insert table
              </button>
            </div>
          )}

          {tab === "faq" && (
            <div className="block-modal__panel">
              {faqItems.map((item, index) => (
                <div key={index} className="block-modal__faq-item">
                  <div className="block-modal__faq-head">
                    <strong>FAQ {index + 1}</strong>
                    {faqItems.length > 1 && (
                      <button
                        type="button"
                        className="block-modal__link-btn"
                        onClick={() => setFaqItems((prev) => prev.filter((_, i) => i !== index))}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <label className="block-modal__field">
                    <span>Question</span>
                    <input
                      value={item.question}
                      onChange={(e) => updateFaq(index, "question", e.target.value)}
                      placeholder="How to calculate semester GPA?"
                    />
                  </label>
                  <label className="block-modal__field">
                    <span>Answer</span>
                    <textarea
                      rows={3}
                      value={item.answer}
                      onChange={(e) => updateFaq(index, "answer", e.target.value)}
                      placeholder="Write a clear answer for students."
                    />
                  </label>
                </div>
              ))}
              <button
                type="button"
                className="block-modal__link-btn"
                onClick={() => setFaqItems((prev) => [...prev, { question: "", answer: "" }])}
              >
                + Add another question
              </button>
              <button
                type="button"
                className="admin-btn admin-btn--primary"
                onClick={() => insertAndClose(buildFaqHtml(faqItems))}
              >
                Insert FAQ accordion
              </button>
            </div>
          )}

          {tab === "image" && (
            <div className="block-modal__panel">
              <label className="block-modal__field">
                <span>Image URL</span>
                <input
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="/blog-images/your-image.webp"
                />
              </label>
              {onUploadImage && (
                <label className="block-modal__upload">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file);
                      e.target.value = "";
                    }}
                  />
                  <span>{uploading ? "Uploading…" : "Upload from computer"}</span>
                </label>
              )}
              <label className="block-modal__field">
                <span>Alt text</span>
                <input
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  placeholder="CGPA grading scale chart"
                />
              </label>
              <label className="block-modal__field">
                <span>Title</span>
                <input
                  value={imageTitle}
                  onChange={(e) => setImageTitle(e.target.value)}
                  placeholder="Optional image title"
                />
              </label>
              <label className="block-modal__field">
                <span>Description</span>
                <textarea
                  rows={3}
                  value={imageDescription}
                  onChange={(e) => setImageDescription(e.target.value)}
                  placeholder="Caption shown under the image"
                />
              </label>
              <label className="block-modal__field">
                <span>Link URL</span>
                <input
                  value={imageLink}
                  onChange={(e) => setImageLink(e.target.value)}
                  placeholder="e.g. /calculator or https://example.com"
                />
              </label>
              <label className="block-modal__field">
                <span>Alignment</span>
                <select
                  value={imageAlign}
                  onChange={(e) => setImageAlign(e.target.value as typeof imageAlign)}
                >
                  <option value="default">Default</option>
                  <option value="center">Center</option>
                  <option value="wide">Full width</option>
                </select>
              </label>
              <button
                type="button"
                className="admin-btn admin-btn--primary"
                disabled={!imageUrl.trim()}
                onClick={() =>
                  insertAndClose(
                    buildImageHtml(imageUrl, imageAlt, imageAlign, {
                      title: imageTitle,
                      description: imageDescription,
                      link: imageLink,
                    })
                  )
                }
              >
                Insert image
              </button>
            </div>
          )}

          {tab === "html" && (
            <div className="block-modal__panel">
              <label className="block-modal__field">
                <span>Custom HTML</span>
                <textarea
                  className="block-modal__code"
                  rows={12}
                  value={customHtml}
                  onChange={(e) => setCustomHtml(e.target.value)}
                  spellCheck={false}
                />
              </label>
              <p className="block-modal__hint">
                Paste any HTML block — tables, accordions, embeds, or styled sections. It renders on the live article page.
              </p>
              <button
                type="button"
                className="admin-btn admin-btn--primary"
                disabled={!customHtml.trim()}
                onClick={() => insertAndClose(customHtml)}
              >
                Insert HTML block
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
