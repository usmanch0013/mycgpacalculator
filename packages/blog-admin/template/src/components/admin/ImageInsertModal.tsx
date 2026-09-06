"use client";

import { useState } from "react";
import { buildImageHtml } from "@/lib/blog/content-blocks";

interface ImageInsertModalProps {
  open: boolean;
  url: string;
  onClose: () => void;
  onInsert: (html: string) => void;
}

export default function ImageInsertModal({
  open,
  url,
  onClose,
  onInsert,
}: ImageInsertModalProps) {
  const [alt, setAlt] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  if (!open) return null;

  function insert() {
    onInsert(
      buildImageHtml(url, alt, "default", {
        title,
        description,
      })
    );
    setAlt("");
    setTitle("");
    setDescription("");
    onClose();
  }

  return (
    <div className="rm-modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="rm-modal"
        role="dialog"
        aria-labelledby="image-insert-title"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="rm-modal__head">
          <h2 id="image-insert-title">Image details</h2>
          <button type="button" className="rm-modal__close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </header>

        <div className="rm-modal__fields">
          {url && <img src={url} alt="" className="image-insert__preview" />}
          <label className="rm-field">
            <span className="rm-field__label">Alt text</span>
            <input
              className="rm-field__input"
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              placeholder="Describe the image for SEO and accessibility"
            />
          </label>
          <label className="rm-field">
            <span className="rm-field__label">Title</span>
            <input
              className="rm-field__input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Optional image title"
            />
          </label>
          <label className="rm-field">
            <span className="rm-field__label">Description</span>
            <textarea
              className="rm-field__textarea"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Caption shown under the image"
            />
          </label>
        </div>

        <footer className="rm-modal__foot">
          <button type="button" className="btn btn--primary btn--sm" onClick={insert} disabled={!url}>
            Insert image
          </button>
        </footer>
      </div>
    </div>
  );
}
