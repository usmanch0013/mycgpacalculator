"use client";

import CategoryPicker from "@/components/admin/CategoryPicker";
import FeaturedImageUpload, { type FeaturedImageMeta } from "@/components/admin/FeaturedImageUpload";
import { estimateReadingTime } from "@/lib/blog/markdown";
import { getSiteHost } from "@/lib/blog/paths";
import type { PostStatus } from "@/lib/blog/types";

interface PostSettingsPanelProps {
  status: PostStatus;
  author: string;
  slug: string;
  excerpt: string;
  featuredImage: FeaturedImageMeta;
  categories: string[];
  wordCount: number;
  onStatusChange: (v: PostStatus) => void;
  onAuthorChange: (v: string) => void;
  onSlugChange: (v: string) => void;
  onExcerptChange: (v: string) => void;
  onFeaturedImageChange: (v: FeaturedImageMeta) => void;
  onCategoriesChange: (v: string[]) => void;
  onSlugManual: () => void;
}

export default function PostSettingsPanel({
  status,
  author,
  slug,
  excerpt,
  featuredImage,
  categories,
  wordCount,
  onStatusChange,
  onAuthorChange,
  onSlugChange,
  onExcerptChange,
  onFeaturedImageChange,
  onCategoriesChange,
  onSlugManual,
}: PostSettingsPanelProps) {
  const readingMin = estimateReadingTime(wordCount);
  const siteHost = getSiteHost();

  return (
    <div className="wp-post-panel">
      <FeaturedImageUpload
        value={featuredImage}
        onChange={onFeaturedImageChange}
      />

      <div className="wp-post-panel__stats">
        <div>
          <strong>{wordCount}</strong>
          <span>Words</span>
        </div>
        <div>
          <strong>{readingMin}</strong>
          <span>Min read</span>
        </div>
      </div>

      <label className="wp-side-field">
        <span>Status</span>
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value as PostStatus)}
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </label>

      <label className="wp-side-field">
        <span>Author</span>
        <input value={author} onChange={(e) => onAuthorChange(e.target.value)} />
      </label>

      <CategoryPicker selected={categories} onChange={onCategoriesChange} />

      <div className="wp-side-field">
        <span>Permalink</span>
        <div className="rm-permalink rm-permalink--sidebar">
          <span className="rm-permalink__host">{siteHost}/</span>
          <input
            className="rm-permalink__input"
            value={slug}
            onChange={(e) => {
              onSlugManual();
              onSlugChange(e.target.value);
            }}
            placeholder="auto-from-title"
          />
        </div>
        <p className="rm-permalink__hint">Updates automatically when you type the title</p>
      </div>

      <label className="wp-side-field">
        <span>Excerpt</span>
        <textarea
          rows={3}
          value={excerpt}
          onChange={(e) => onExcerptChange(e.target.value)}
          placeholder="Short summary for blog listing"
        />
      </label>
    </div>
  );
}
