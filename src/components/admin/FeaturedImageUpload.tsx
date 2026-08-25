"use client";

import { useRef, useState } from "react";

interface FeaturedImageUploadProps {
  value: string;
  onChange: (url: string) => void;
}

export default function FeaturedImageUpload({
  value,
  onChange,
}: FeaturedImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

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
      onChange(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="admin-image-upload">
      <span className="admin-field__label">Featured image</span>

      {value ? (
        <div className="admin-image-upload__preview">
          <img src={value} alt="Featured image preview" />
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
              onClick={() => onChange("")}
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
