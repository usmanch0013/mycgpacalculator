"use client";

import { useEffect, useState } from "react";
import type { BlogCategory } from "@/lib/blog/types";

interface CategoryPickerProps {
  selected: string[];
  onChange: (slugs: string[]) => void;
}

export default function CategoryPicker({ selected, onChange }: CategoryPickerProps) {
  const [catalog, setCatalog] = useState<BlogCategory[]>([]);
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const res = await fetch("/api/admin/categories", { cache: "no-store" });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load categories");
        if (active) setCatalog(Array.isArray(data) ? data : []);
      } catch (e) {
        if (active) setError(e instanceof Error ? e.message : "Failed to load categories");
      } finally {
        if (active) setLoading(false);
      }
    }

    void load();
    return () => {
      active = false;
    };
  }, []);

  function toggle(slug: string) {
    if (selected.includes(slug)) {
      onChange(selected.filter((item) => item !== slug));
      return;
    }
    onChange([...selected, slug]);
  }

  async function addCategory() {
    const name = newName.trim();
    if (!name || saving) return;

    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, syncGit: true }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not add category");

      setCatalog((prev) => {
        if (prev.some((category) => category.slug === data.slug)) return prev;
        return [...prev, { slug: data.slug, name: data.name }].sort((a, b) =>
          a.name.localeCompare(b.name)
        );
      });
      if (!selected.includes(data.slug)) onChange([...selected, data.slug]);
      setNewName("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not add category");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="wp-side-field wp-categories">
      <span>Categories</span>

      {loading ? (
        <p className="wp-categories__empty">Loading categories…</p>
      ) : catalog.length === 0 ? (
        <p className="wp-categories__empty">No categories yet. Add one below.</p>
      ) : (
        <ul className="wp-categories__list">
          {catalog.map((category) => (
            <li key={category.slug}>
              <label className="wp-categories__item">
                <input
                  type="checkbox"
                  checked={selected.includes(category.slug)}
                  onChange={() => toggle(category.slug)}
                />
                <span>{category.name}</span>
              </label>
            </li>
          ))}
        </ul>
      )}

      <div className="wp-categories__add">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New category name"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              void addCategory();
            }
          }}
        />
        <button type="button" onClick={() => void addCategory()} disabled={saving || !newName.trim()}>
          {saving ? "Adding…" : "Add"}
        </button>
      </div>
      <small>Tick existing categories, or add a new one for this article.</small>
      {error && <p className="wp-categories__error">{error}</p>}
    </div>
  );
}
