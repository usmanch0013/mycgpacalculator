"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { BlogPost } from "@/lib/blog/types";

export default function BlogBackupPanel() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function downloadBackup() {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const res = await fetch("/api/admin/backup");
      if (!res.ok) throw new Error("Backup download failed");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      const stamp = new Date().toISOString().slice(0, 10);
      anchor.href = url;
      anchor.download = `cgpa-blog-backup-${stamp}.json`;
      anchor.click();
      URL.revokeObjectURL(url);
      setMessage("Backup downloaded. Keep this file as an extra safety copy.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Backup failed");
    } finally {
      setBusy(false);
    }
  }

  async function restoreBackup(file: File) {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as { posts?: BlogPost[] };
      const posts = Array.isArray(parsed.posts) ? parsed.posts : Array.isArray(parsed) ? parsed : null;
      if (!posts?.length) throw new Error("Invalid backup file — no articles found.");

      const replace = confirm(
        "Restore all articles from this backup?\n\nOK = replace current articles\nCancel = merge with current articles"
      );

      const res = await fetch("/api/admin/backup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          posts,
          mode: replace ? "replace" : "merge",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Restore failed");

      setMessage(`Restored ${data.count} article${data.count === 1 ? "" : "s"} successfully.`);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Restore failed");
    } finally {
      setBusy(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return (
    <section className="admin-backup">
      <div className="admin-backup__head">
        <div>
          <h2 className="admin-backup__title">Article backup</h2>
          <p className="admin-backup__desc">
            Articles sync to GitHub automatically when configured. You can also download a JSON
            backup anytime, or restore from a saved file if anything goes missing.
          </p>
        </div>
      </div>

      <div className="admin-backup__actions">
        <button
          type="button"
          className="admin-btn admin-btn--primary admin-btn--sm"
          onClick={downloadBackup}
          disabled={busy}
        >
          {busy ? "Working…" : "Download backup"}
        </button>
        <label className="admin-btn admin-btn--outline admin-btn--sm admin-backup__upload">
          {busy ? "Working…" : "Restore backup"}
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            disabled={busy}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void restoreBackup(file);
            }}
          />
        </label>
      </div>

      {message && <p className="admin-backup__msg admin-backup__msg--ok">{message}</p>}
      {error && <p className="admin-backup__msg admin-backup__msg--error">{error}</p>}
    </section>
  );
}
