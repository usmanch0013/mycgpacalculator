import { readFile } from "fs/promises";
import path from "path";

const pendingUpserts = new Map<string, string>();
const pendingDeletes = new Set<string>();
let flushTimer: ReturnType<typeof setTimeout> | null = null;

function gitConfig() {
  const token = process.env.GITHUB_TOKEN?.trim();
  const owner = process.env.GITHUB_OWNER?.trim() || "usmanch0013";
  const repo = process.env.GITHUB_REPO?.trim() || "mycgpa";
  const branch = process.env.GITHUB_BRANCH?.trim() || "main";
  if (!token) return null;
  return { token, owner, repo, branch };
}

export function isGitSyncEnabled(): boolean {
  return Boolean(gitConfig());
}

function repoPath(relativePath: string): string {
  return relativePath.replace(/^\/+/, "").replace(/\\/g, "/");
}

async function getFileSha(relativePath: string): Promise<string | null> {
  const cfg = gitConfig();
  if (!cfg) return null;

  const filePath = repoPath(relativePath);
  const url = `https://api.github.com/repos/${cfg.owner}/${cfg.repo}/contents/${encodeURIComponent(filePath).replace(/%2F/g, "/")}?ref=${encodeURIComponent(cfg.branch)}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${cfg.token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  if (res.status === 404) return null;
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GitHub read failed for ${filePath}: ${err}`);
  }

  const data = (await res.json()) as { sha?: string };
  return data.sha ?? null;
}

async function upsertGitFile(relativePath: string, base64Content: string) {
  const cfg = gitConfig();
  if (!cfg) return;

  const filePath = repoPath(relativePath);
  const sha = await getFileSha(relativePath);
  const url = `https://api.github.com/repos/${cfg.owner}/${cfg.repo}/contents/${encodeURIComponent(filePath).replace(/%2F/g, "/")}`;

  const res = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${cfg.token}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    body: JSON.stringify({
      message: `Sync blog content: ${filePath}`,
      content: base64Content,
      branch: cfg.branch,
      ...(sha ? { sha } : {}),
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GitHub write failed for ${filePath}: ${err}`);
  }
}

async function deleteGitFile(relativePath: string) {
  const cfg = gitConfig();
  if (!cfg) return;

  const filePath = repoPath(relativePath);
  const sha = await getFileSha(relativePath);
  if (!sha) return;

  const url = `https://api.github.com/repos/${cfg.owner}/${cfg.repo}/contents/${encodeURIComponent(filePath).replace(/%2F/g, "/")}`;

  const res = await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${cfg.token}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    body: JSON.stringify({
      message: `Remove blog content: ${filePath}`,
      sha,
      branch: cfg.branch,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GitHub delete failed for ${filePath}: ${err}`);
  }
}

function scheduleFlush(delayMs = 8000) {
  if (!isGitSyncEnabled()) return;
  if (flushTimer) clearTimeout(flushTimer);
  flushTimer = setTimeout(() => {
    void flushGitSyncQueue();
  }, delayMs);
}

export function queueGitUpsert(relativePath: string, absolutePath: string) {
  if (!isGitSyncEnabled()) return;
  pendingUpserts.set(repoPath(relativePath), absolutePath);
  pendingDeletes.delete(repoPath(relativePath));
  scheduleFlush();
}

export function queueGitDelete(relativePath: string) {
  if (!isGitSyncEnabled()) return;
  const normalized = repoPath(relativePath);
  pendingDeletes.add(normalized);
  pendingUpserts.delete(normalized);
  scheduleFlush(1500);
}

export async function flushGitSyncQueue(): Promise<void> {
  if (!isGitSyncEnabled()) return;
  if (flushTimer) {
    clearTimeout(flushTimer);
    flushTimer = null;
  }

  const deletes = Array.from(pendingDeletes);
  const upserts = Array.from(pendingUpserts.entries());
  pendingDeletes.clear();
  pendingUpserts.clear();

  for (const relativePath of deletes) {
    await deleteGitFile(relativePath);
  }

  for (const [relativePath, absolutePath] of upserts) {
    const buffer = await readFile(absolutePath);
    await upsertGitFile(relativePath, buffer.toString("base64"));
  }
}

/** Flush pending Git changes without failing the caller (e.g. local save still succeeded). */
export async function safeFlushGitSyncQueue(): Promise<string | null> {
  if (!isGitSyncEnabled()) return null;
  try {
    await flushGitSyncQueue();
    return null;
  } catch (e) {
    console.error("[blog git sync]", e);
    return e instanceof Error ? e.message : "Git sync failed";
  }
}

export async function syncBlogFile(relativePath: string, absolutePath: string) {
  if (!isGitSyncEnabled()) return;
  const buffer = await readFile(absolutePath);
  await upsertGitFile(relativePath, buffer.toString("base64"));
}

export function blogRelativePath(absolutePath: string): string {
  return path.relative(process.cwd(), absolutePath).replace(/\\/g, "/");
}
