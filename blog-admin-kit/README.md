# Blog Admin Kit — portable copy

Yeh folder **AU Salary After Tax** project se copy hai. Isko kisi bhi Next.js 15 App Router project mein paste kar sakte ho.

**Default login password (dev):** `admin123` — production mein `.env.local` mein `ADMIN_PASSWORD` set karo.

---

## Folder structure

```
blog-admin-kit/
├── app/admin/              → Admin UI (dashboard, editor, login)
├── app/api/admin/          → Login, posts CRUD, image upload API
├── components/admin/       → Editor, SEO panel, dashboard UI
├── components/SiteChrome.tsx → Hides site header on /admin routes
├── lib/blog/               → Auth, storage, SEO scorer, types
├── middleware.ts           → Protects /admin and /api/admin
├── content/blog/           → Post JSON files (create at runtime)
├── public/blog-images/     → Uploaded images
├── styles/admin-panel.css  → All admin CSS (copy into your globals or import)
├── optional-public-blog/   → Public blog listing + article page (optional)
├── snippets/               → Layout + next.config examples
└── .env.example
```

---

## Quick install (5 steps)

### 1. Copy files into your Next.js project root

Merge folders (do not replace your whole app):

| From kit | To your project |
|----------|-----------------|
| `app/admin/` | `app/admin/` |
| `app/api/admin/` | `app/api/admin/` |
| `components/admin/` | `components/admin/` |
| `components/SiteChrome.tsx` | `components/` (or merge into your layout logic) |
| `lib/blog/` | `lib/blog/` |
| `middleware.ts` | root (merge matchers if you already have middleware) |
| `content/blog/` | `content/blog/` |
| `public/blog-images/` | `public/blog-images/` |

### 2. Install dependency

```bash
npm install marked
```

(`marked` is only needed if you use the optional public blog pages.)

### 3. Environment variable

Create `.env.local`:

```
ADMIN_PASSWORD=your-strong-password-here
```

On Vercel: Project → Settings → Environment Variables → same key.

### 4. Configure your site

Edit `lib/blog/config.ts`:

```ts
export const BLOG_CONFIG = {
  siteUrl: "https://yourdomain.com",
  siteName: "Your Site",
};

export const RESERVED_SLUGS = [
  // add every top-level route in YOUR app
  "about", "admin", "blog", ...
];
```

### 5. Add CSS

**Option A** — append to `app/globals.css`:

```css
@import "../blog-admin-kit/styles/admin-panel.css";
```

**Option B** — copy contents of `styles/admin-panel.css` into your `globals.css`.

**Note:** Admin CSS uses CSS variables from your theme (`--forest-900`, `--amber-500`, `--stone-*`, etc.). If missing, add basic fallbacks or your brand colors.

### 6. Layout (hide site header on admin)

Wrap your layout children with `SiteChrome` — see `snippets/layout-integration.example.tsx`.

---

## URLs

| URL | Purpose |
|-----|---------|
| `/admin/login` | Login |
| `/admin` | Dashboard |
| `/admin/posts/new` | New article editor |
| `/admin/posts/[id]/edit` | Edit article |

Articles save to `content/blog/{slug}.json` and images to `public/blog-images/`.

**Article URLs (this kit):** `yourdomain.com/article-slug` (no `/blog/` prefix).

Optional public pages: copy `optional-public-blog/` → `app/blog/page.tsx` and `app/[slug]/page.tsx`.

---

## Middleware merge

If you already have `middleware.ts`, merge the admin auth checks and add to `config.matcher`:

```ts
matcher: ["/admin/:path*", "/api/admin/:path*", ...your existing],
```

---

## Vercel note

Filesystem writes (`content/blog`, `public/blog-images`) do **not** persist on Vercel serverless after deploy. Workflow:

1. Write posts locally → git commit → push → redeploy

Or later add Vercel Blob / database for live publishing.

---

## File list

See `FILE-LIST.txt` for every file in this kit.

---

## Support checklist

- [ ] `npm install marked`
- [ ] `.env.local` with `ADMIN_PASSWORD`
- [ ] `lib/blog/config.ts` updated
- [ ] Admin CSS imported
- [ ] `SiteChrome` in layout (or admin without site header)
- [ ] `middleware.ts` active
- [ ] `content/blog` and `public/blog-images` exist

Done — open `/admin/login` and sign in.
