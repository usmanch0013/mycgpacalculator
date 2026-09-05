"use client";

import { hasKeyword, highlightKeyword } from "@/lib/blog/keyword-highlight";
import { getSiteHost } from "@/lib/blog/paths";

interface SnippetEditorModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  slug: string;
  metaDescription: string;
  focusKeyword?: string;
  onTitleChange: (v: string) => void;
  onSlugChange: (v: string) => void;
  onMetaChange: (v: string) => void;
}

function barClass(len: number, idealMin: number, idealMax: number): string {
  if (len >= idealMin && len <= idealMax) return "rm-bar__fill--good";
  if (len >= idealMin - 20 && len <= idealMax + 20) return "rm-bar__fill--ok";
  return "rm-bar__fill--bad";
}

export default function SnippetEditorModal({
  open,
  onClose,
  title,
  slug,
  metaDescription,
  focusKeyword = "",
  onTitleChange,
  onSlugChange,
  onMetaChange,
}: SnippetEditorModalProps) {
  if (!open) return null;

  const siteHost = getSiteHost();
  const titleLen = title.length;
  const metaLen = metaDescription.length;
  const slugLen = slug.length;
  const displaySlug = slug || "your-article-slug";
  const titleHasKw = hasKeyword(title, focusKeyword);
  const metaHasKw = hasKeyword(metaDescription, focusKeyword);

  return (
    <div className="rm-modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="rm-modal"
        role="dialog"
        aria-labelledby="snippet-editor-title"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="rm-modal__head">
          <h2 id="snippet-editor-title">Preview Snippet Editor</h2>
          <button type="button" className="rm-modal__close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </header>

        <div className="rm-modal__preview">
          <p className="rm-modal__preview-label">Google preview</p>
          <div className="serp-preview__card">
            <p className="serp-preview__url">{siteHost}/{displaySlug}</p>
            <p className="serp-preview__title">
              {highlightKeyword(title || "Your SEO title", focusKeyword)}
            </p>
            <p className="serp-preview__desc">
              {highlightKeyword(metaDescription || "Your meta description appears here.", focusKeyword)}
            </p>
          </div>
        </div>

        <div className="rm-modal__fields">
          <label className="rm-field">
            <span className="rm-field__label">SEO title</span>
            <input
              className="rm-field__input"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
            />
            <div className="rm-bar">
              <div className="rm-bar__track">
                <div
                  className={`rm-bar__fill ${barClass(titleLen, 30, 60)}`}
                  style={{ width: `${Math.min(100, (titleLen / 60) * 100)}%` }}
                />
              </div>
              <span className="rm-bar__count">{titleLen} / 60</span>
            </div>
            {focusKeyword.trim() && !titleHasKw && (
              <p className="rm-field__warn">Primary keyword is missing from the SEO title.</p>
            )}
          </label>

          <label className="rm-field">
            <span className="rm-field__label">Permalink</span>
            <div className="rm-permalink">
              <span className="rm-permalink__host">{siteHost}/</span>
              <input
                className="rm-permalink__input"
                value={slug}
                onChange={(e) => onSlugChange(e.target.value)}
                placeholder="article-slug-from-title"
              />
            </div>
            <div className="rm-bar">
              <div className="rm-bar__track">
                <div
                  className={`rm-bar__fill ${barClass(slugLen, 8, 60)}`}
                  style={{ width: `${Math.min(100, (slugLen / 60) * 100)}%` }}
                />
              </div>
              <span className="rm-bar__count">{slugLen} chars</span>
            </div>
            <p className="rm-permalink__hint">
              Auto-generated from title — no /blog/ prefix
            </p>
          </label>

          <label className="rm-field">
            <span className="rm-field__label">Meta description</span>
            <textarea
              className="rm-field__textarea"
              rows={4}
              value={metaDescription}
              onChange={(e) => onMetaChange(e.target.value)}
            />
            <div className="rm-bar">
              <div className="rm-bar__track">
                <div
                  className={`rm-bar__fill ${barClass(metaLen, 120, 160)}`}
                  style={{ width: `${Math.min(100, (metaLen / 160) * 100)}%` }}
                />
              </div>
              <span className="rm-bar__count">{metaLen} / 160</span>
            </div>
            {focusKeyword.trim() && !metaHasKw && (
              <p className="rm-field__warn">Primary keyword is missing from the meta description.</p>
            )}
          </label>
        </div>

        <footer className="rm-modal__foot">
          <button type="button" className="btn btn--primary btn--sm" onClick={onClose}>
            Done
          </button>
        </footer>
      </div>
    </div>
  );
}
