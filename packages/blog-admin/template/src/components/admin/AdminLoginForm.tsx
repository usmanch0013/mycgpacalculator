"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BLOG_CONFIG } from "@/lib/blog/config";

export default function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        setError("Wrong password. Try again.");
        return;
      }
      const from = searchParams.get("from") || "/admin";
      router.push(from);
      router.refresh();
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-login">
      <div className="admin-login__card">
        <h1 className="admin-login__title">{BLOG_CONFIG.siteName}</h1>
        <p className="admin-login__desc">
          Sign in to {BLOG_CONFIG.loginTagline}.
        </p>
        <form onSubmit={handleSubmit} className="admin-login__form">
          <label className="admin-field">
            <span className="admin-field__label">Password</span>
            <input
              type="password"
              className="admin-field__input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </label>
          {error && <p className="admin-login__error">{error}</p>}
          <button type="submit" className="btn btn--primary admin-login__btn" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
