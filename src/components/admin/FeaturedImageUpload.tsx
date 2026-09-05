"use client";

import { useRef, useState } from "react";

export interface FeaturedImageMeta {
  url: string;
  alt: string;
  title: string;
  description: string;
}

interface FeaturedImageUploadProps {
  value: FeaturedImageMeta;
  onChange: (next: FeaturedImageMeta) => void;
}

const EMPTY: FeaturedImageMeta = { url: "", alt: "", title: "", description: "" };

export default function FeaturedImageUpload({
  value,
  onChange,
}: FeaturedImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  function updateMeta<K extends keyof FeaturedImageMeta>(key: K, next: FeaturedImageMeta[K]) {
    onChange({ ...value, [key]: next });
  }

  async function handleFile(file: File) {
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      onChange({
        url: data.url,
        alt: value.alt,
        title: value.title,
        description: value.description,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="admin-image-upload">
      <span className="admin-field__label">Featured image</span>

      {value.url ? (
        <div className="admin-image-upload__preview">
          <img src={value.url} alt={value.alt || "Featured image preview"} />
          <div className="admin-image-upload__preview-actions">
            <button
              type="button"
              className="admin-image-upload__btn"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
            >
              Replace
            </button>
            <button
              type="button"
              className="admin-image-upload__btn admin-image-upload__btn--danger"
              onClick={() => onChange(EMPTY)}
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          className="admin-image-upload__dropzone"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          <span className="admin-image-upload__icon" aria-hidden>📷</span>
          <strong>{uploading ? "Uploading…" : "Upload featured image"}</strong>
          <span>JPG, PNG, WebP · max 5 MB</span>
        </button>
      )}

      {value.url && (
        <div className="admin-image-upload__meta">
          <label className="wp-side-field">
            <span>Alt text</span>
            <input
              value={value.alt}
              onChange={(e) => updateMeta("alt", e.target.value)}
              placeholder="Describe the image for SEO and accessibility"
            />
          </label>
          <label className="wp-side-field">
            <span>Title</span>
            <input
              value={value.title}
              onChange={(e) => updateMeta("title", e.target.value)}
              placeholder="Optional image title"
            />
          </label>
          <label className="wp-side-field">
            <span>Description</span>
            <textarea
              rows={2}
              value={value.description}
              onChange={(e) => updateMeta("description", e.target.value)}
              placeholder="Optional caption or image description"
            />
          </label>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="admin-image-upload__input"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />

      {error && <p className="admin-image-upload__error">{error}</p>}
    </div>
  );
}
