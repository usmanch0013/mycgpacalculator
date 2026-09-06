#!/usr/bin/env node
/**
 * Sync live blog admin source into packages/blog-admin/template
 * Run from repo root: npm run sync-blog-admin
 */
import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const templateRoot = path.join(root, "packages", "blog-admin", "template");

const copies = [
  ["src/app/admin", "src/app/admin"],
  ["src/app/api/admin", "src/app/api/admin"],
  ["src/components/admin", "src/components/admin"],
  ["src/lib/blog", "src/lib/blog"],
  ["src/styles/admin-panel.css", "src/styles/admin-panel.css"],
  ["src/styles/blog-public.css", "src/styles/blog-public.css"],
  ["content/blog/.gitkeep", "content/blog/.gitkeep"],
  ["public/blog-images/.gitkeep", "public/blog-images/.gitkeep"],
];

function copyItem(fromRel, toRel) {
  const from = path.join(root, fromRel);
  const to = path.join(templateRoot, toRel);
  if (!existsSync(from)) {
    console.warn(`skip missing: ${fromRel}`);
    return;
  }
  mkdirSync(path.dirname(to), { recursive: true });
  cpSync(from, to, { recursive: true, force: true });
  console.log(`copied ${fromRel}`);
}

if (existsSync(templateRoot)) {
  rmSync(templateRoot, { recursive: true, force: true });
}
mkdirSync(templateRoot, { recursive: true });

for (const [from, to] of copies) {
  copyItem(from, to);
}

// Snippets for integration
const snippetsDir = path.join(templateRoot, "snippets");
mkdirSync(snippetsDir, { recursive: true });

const middlewareSnippet = `import { NextResponse, type NextRequest } from "next/server";
import { COOKIE_NAME, verifySessionToken } from "@/lib/blog/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    if (!token || !(await verifySessionToken(token))) {
      const login = new URL("/admin/login", request.url);
      login.searchParams.set("from", pathname);
      return NextResponse.redirect(login);
    }
  }

  if (pathname.startsWith("/api/admin") && !pathname.startsWith("/api/admin/login")) {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    if (!token || !(await verifySessionToken(token))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
`;

import { writeFileSync } from "node:fs";
writeFileSync(path.join(snippetsDir, "middleware.ts"), middlewareSnippet);

const adminLayoutSnippet = `import "@/styles/admin-panel.css";
import "@/styles/blog-public.css";
`;

writeFileSync(path.join(snippetsDir, "admin-layout-imports.ts"), adminLayoutSnippet);

console.log("\nBlog admin template synced to packages/blog-admin/template");
