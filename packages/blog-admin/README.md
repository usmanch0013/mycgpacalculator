# Next.js Blog Admin Plugin

Portable blog admin panel (Rank Math-style SEO, visual editor, categories, backup, GitHub sync) for **any Next.js App Router** site.

**Branding is automatic** — set `NEXT_PUBLIC_SITE_URL` per domain. Site name, email, admin title, and backup filenames are derived from that URL. No manual site name in code.

---

## Install on a new website

### Option A — from this repo (recommended)

```bash
# 1. In the source repo, refresh the template
npm run sync-blog-admin

# 2. In your OTHER Next.js project folder
node /path/to/cgpa-calculator/packages/blog-admin/bin/install.mjs
```

### Option B — copy the folder

Copy `packages/blog-admin/` into your project and run:

```bash
node packages/blog-admin/bin/install.mjs
```

---

## Environment variables (per domain)

Create `.env.local` on each website:

### Required

| Variable | Example | Purpose |
|----------|---------|---------|
| `NEXT_PUBLIC_SITE_URL` | `https://mysite.com` | Live URL — **main branding source** |
| `ADMIN_PASSWORD` | `your-strong-password` | Admin login (`/admin/login`) |

### Optional (recommended)

| Variable | Example | Purpose |
|----------|---------|---------|
| `NEXT_PUBLIC_SITE_NAME` | `My Cool Site` | Pretty name (else derived from domain) |
| `SITE_EMAIL` | `hello@mysite.com` | Default contact (else `hello@domain`) |
| `BLOG_BRAND_INITIALS` | `MC` | Admin logo letters (else auto) |
| `BLOG_ADMIN_TITLE` | `My Site Blog` | Admin header (else `{SITE_NAME} Blog`) |
| `BLOG_DEFAULT_AUTHOR` | `My Site` | Default post author |
| `BLOG_RESERVED_SLUGS` | `shop,pricing,app` | Extra blocked article slugs |
| `BLOG_STORAGE_PREFIX` | `my-site` | Backup/preview file prefix |

### GitHub sync (optional)

| Variable | Purpose |
|----------|---------|
| `GITHUB_TOKEN` | Personal access token with repo scope |
| `GITHUB_OWNER` | GitHub username |
| `GITHUB_REPO` | Repository name |
| `GITHUB_BRANCH` | Branch (default `main`) |

---

## Example — 3 different websites

**Site 1 — cgpacalculatorpro.com**
```env
NEXT_PUBLIC_SITE_URL=https://cgpacalculatorpro.com
NEXT_PUBLIC_SITE_NAME=CGPA Calculator Pro
ADMIN_PASSWORD=...
BLOG_RESERVED_SLUGS=calculator,universities
GITHUB_OWNER=usmanch0013
GITHUB_REPO=mycgpa
GITHUB_TOKEN=...
```

**Site 2 — example.com**
```env
NEXT_PUBLIC_SITE_URL=https://example.com
ADMIN_PASSWORD=...
```

**Site 3 — local dev**
```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
ADMIN_PASSWORD=admin123
```

Each site gets its own admin branding automatically from the URL.

---

## After install checklist

- [ ] `npm install` (adds `marked`)
- [ ] `.env.local` with `NEXT_PUBLIC_SITE_URL` + `ADMIN_PASSWORD`
- [ ] Merge `snippets/blog-admin-middleware.ts` into `src/middleware.ts`
- [ ] Admin layout imports `admin-panel.css` + `blog-public.css`
- [ ] Folders exist: `content/blog/`, `public/blog-images/`
- [ ] Optional: public blog pages at `/blog` and `/[slug]`

---

## URLs

| URL | Purpose |
|-----|---------|
| `/admin/login` | Login |
| `/admin` | Dashboard |
| `/admin/posts/new` | New article |
| `/admin/posts/[id]/edit` | Edit article |

Posts save to `content/blog/{slug}.json`. Images go to `public/blog-images/`.

---

## Update plugin on all sites

1. In source repo: `npm run sync-blog-admin`
2. Re-run `install.mjs` on each site (merges updated files)
3. Re-deploy

---

## Hostinger / Vercel note

File writes persist when using Node hosting with a writable filesystem + Git deploy. On pure serverless without Git sync, use local edit → commit → push workflow.
