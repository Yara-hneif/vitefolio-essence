// Minimal GitHub types we care about
export type GitHubRepo = {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  homepage: string | null;
  language: string | null;
  topics?: string[];
  owner: { login: string };
  has_pages?: boolean;
  visibility?: "public" | "private" | "internal";
};

export type FetchOptions = {
  includeTopics?: boolean;
  token?: string; // optional GitHub token for higher rate limits
};

const GH_API = "https://api.github.com";
const STD_HEADERS: Record<string, string> = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
};

export async function fetchPublicRepos(
  username: string,
  opts: FetchOptions = {}
): Promise<GitHubRepo[]> {
  const url = `${GH_API}/users/${encodeURIComponent(
    username
  )}/repos?per_page=100&type=public&sort=updated`;
  const headers = { ...STD_HEADERS };
  if (opts.token) headers.Authorization = `Bearer ${opts.token}`;

  const res = await fetch(url, { headers });
  if (!res.ok) {
    const msg = await res.text().catch(() => res.statusText);
    throw new Error(`GitHub repos fetch failed: ${res.status} ${msg}`);
  }
  const repos = (await res.json()) as GitHubRepo[];

  if (opts.includeTopics) {
    // Fetch topics per repo with limited parallelism
    const limiter = pLimit(6);
    await Promise.allSettled(
      repos.map((r) =>
        limiter(async () => {
          try {
            const tRes = await fetch(
              `${GH_API}/repos/${r.owner.login}/${r.name}/topics`,
              { headers }
            );
            if (tRes.ok) {
              const tJson = (await tRes.json()) as { names?: string[] };
              (r as any).topics = tJson.names ?? [];
            }
          } catch {
            /* noop */
          }
        })
      )
    );
  }

  return repos.filter((r) => r.visibility !== "private");
}

// Lightweight concurrency limiter (no deps)
function pLimit(concurrency: number) {
  let active = 0;
  const queue: (() => void)[] = [];
  const next = () => {
    active--;
    if (queue.length) queue.shift()!();
  };
  return function <T>(fn: () => Promise<T>) {
    return new Promise<T>((resolve, reject) => {
      const run = () => {
        active++;
        fn().then((v) => {
          resolve(v);
          next();
        }, reject);
      };
      if (active < concurrency) run();
      else queue.push(run);
    });
  };
}

// Helpers
export const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

// GitHub social preview image (public, cacheable)
export const repoOgImage = (owner: string, name: string) =>
  `https://opengraph.githubassets.com/1/${owner}/${name}`;

// Heuristic Pages URL if has_pages is true
export const pagesUrl = (owner: string, name: string) =>
  `https://${owner}.github.io/${name}`;
