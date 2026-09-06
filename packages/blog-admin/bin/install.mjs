#!/usr/bin/env node
/**
 * Install blog admin into a Next.js App Router project.
 *
 * Usage:
 *   node packages/blog-admin/bin/install.mjs
 *   node packages/blog-admin/bin/install.mjs /path/to/other-site
 */
import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(__dirname, "..");
const templateRoot = path.join(packageRoot, "template");
const targetRoot = path.resolve(process.argv[2] || process.cwd());

function copyMerge(from, to) {
  if (!existsSync(from)) return;
  mkdirSync(path.dirname(to), { recursive: true });
  cpSync(from, to, { recursive: true, force: true });
}

function main() {
  if (!existsSync(templateRoot)) {
    console.error(
      "Template missing. From the source repo run:\n  npm run sync-blog-admin"
    );
    process.exit(1);
  }

  const merges = [
    ["src/app/admin", "src/app/admin"],
    ["src/app/api/admin", "src/app/api/admin"],
    ["src/components/admin", "src/components/admin"],
    ["src/lib/blog", "src/lib/blog"],
    ["src/styles/admin-panel.css", "src/styles/admin-panel.css"],
    ["src/styles/blog-public.css", "src/styles/blog-public.css"],
    ["content/blog", "content/blog"],
    ["public/blog-images", "public/blog-images"],
  ];

  console.log(`Installing blog admin into: ${targetRoot}\n`);

  for (const [fromRel, toRel] of merges) {
    const from = path.join(templateRoot, fromRel);
    const to = path.join(targetRoot, toRel);
    copyMerge(from, to);
    console.log(`  ✓ ${toRel}`);
  }

  const envExample = path.join(packageRoot, ".env.example");
  const envTarget = path.join(targetRoot, ".env.blog-admin.example");
  if (existsSync(envExample)) {
    cpSync(envExample, envTarget, { force: true });
    console.log("  ✓ .env.blog-admin.example");
  }

  const middlewareSnippet = path.join(templateRoot, "snippets/middleware.ts");
  const snippetTarget = path.join(targetRoot, "snippets/blog-admin-middleware.ts");
  if (existsSync(middlewareSnippet)) {
    mkdirSync(path.dirname(snippetTarget), { recursive: true });
    cpSync(middlewareSnippet, snippetTarget, { force: true });
    console.log("  ✓ snippets/blog-admin-middleware.ts");
  }

  const pkgPath = path.join(targetRoot, "package.json");
  if (existsSync(pkgPath)) {
    const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
    if (!pkg.dependencies?.marked) {
      pkg.dependencies = { ...pkg.dependencies, marked: "^15.0.12" };
      writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);
      console.log("\n  Added marked dependency — run npm install");
    }
  }

  console.log(`
Done! Next steps in ${targetRoot}:

1. Copy vars from .env.blog-admin.example → .env.local
   Required: NEXT_PUBLIC_SITE_URL, ADMIN_PASSWORD

2. Merge middleware from snippets/blog-admin-middleware.ts
   (or copy into your existing src/middleware.ts)

3. Import admin CSS in src/app/admin/layout.tsx:
   import "@/styles/admin-panel.css";
   import "@/styles/blog-public.css";

4. npm install && npm run dev → open /admin/login

Branding (site name, email, logo initials) is automatic from NEXT_PUBLIC_SITE_URL.
Set NEXT_PUBLIC_SITE_NAME only if you want a prettier display name.
`);
}

main();
