// Uses PostgreSQL Pool from server/config/db.js (pg). Node 18+ fetch is required.

import pool from "../config/db.js";

// --- Utilities ---

const GH_API = "https://api.github.com";
const STD_HEADERS = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
};

/** Minimal concurrency limiter (no deps) */
function pLimit(concurrency) {
  let active = 0;
  const queue = [];
  const next = () => {
    active--;
    if (queue.length) queue.shift()();
  };
  return function run(fn) {
    return new Promise((resolve, reject) => {
      const task = () => {
        active++;
        Promise.resolve()
          .then(fn)
          .then(
            (v) => {
              resolve(v);
              next();
            },
            (e) => {
              reject(e);
              next();
            }
          );
      };
      if (active < concurrency) task();
      else queue.push(task);
    });
  };
}

export const slugify = (s) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

export const repoOgImage = (owner, name) =>
  `https://opengraph.githubassets.com/1/${owner}/${name}`;

export const pagesUrl = (owner, name) =>
  `https://${owner}.github.io/${name}`;

// --- GitHub ---

/**
 * Fetch public repositories for a user. Optionally expands topics.
 * @param {string} username
 * @param {boolean} includeTopics
 * @param {string=} token
 * @returns {Promise<Array<Object>>}
 */
export async function fetchPublicRepos(username, includeTopics = true, token) {
  const headers = { ...STD_HEADERS };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(
    `${GH_API}/users/${encodeURIComponent(username)}/repos?per_page=100&type=public&sort=updated`,
    { headers }
  );
  if (!res.ok) {
    const msg = await res.text().catch(() => res.statusText);
    throw new Error(`GitHub repos fetch failed: ${res.status} ${msg}`);
  }

  const repos = await res.json();
  const publics = (Array.isArray(repos) ? repos : []).filter(
    (r) => r && r.visibility !== "private"
  );

  if (!includeTopics) return publics;

  const limit = pLimit(6);
  await Promise.allSettled(
    publics.map((r) =>
      limit(async () => {
        try {
          const tRes = await fetch(
            `${GH_API}/repos/${r.owner?.login}/${r.name}/topics`,
            { headers }
          );
          if (tRes.ok) {
            const tJson = await tRes.json();
            r.topics = Array.isArray(tJson?.names) ? tJson.names : [];
          }
        } catch {
          // ignore
        }
      })
    )
  );

  return publics;
}

// --- Database helpers ---

/** Read existing unique keys (slug, repoUrl) to avoid duplicates. */
async function getExistingKeys() {
  const { rows } = await pool.query(`SELECT slug, repoUrl FROM projects`);
  const slugSet = new Set();
  const urlSet = new Set();
  for (const r of rows) {
    if (r.slug) slugSet.add(String(r.slug).toLowerCase());
    if (r.repoUrl) urlSet.add(String(r.repoUrl).toLowerCase().trim());
  }
  return { slugSet, urlSet };
}

/**
 * Insert a project as DRAFT (admin approval required).
 * Uses ON CONFLICT (slug) DO NOTHING to avoid duplicates.
 */
async function insertDraftProject(p) {
  const text = `
    INSERT INTO projects
      (title, slug, status, category, description, imageUrl, liveUrl, repoUrl, tags)
    VALUES
      ($1,    $2,   $3,     $4,       $5,          $6,        $7,      $8,       $9)
    ON CONFLICT (slug) DO NOTHING
    RETURNING id
  `;
  const values = [
    p.title,
    p.slug,
    "draft",
    p.category ?? null,
    p.description ?? null,
    p.imageUrl ?? null,
    p.liveUrl ?? null,
    p.repoUrl ?? null,
    Array.isArray(p.tags) ? p.tags : [],
  ];
  const res = await pool.query(text, values);
  return res.rowCount; // 1 if inserted, 0 if conflicted
}

// --- Sync orchestrator ---

/**
 * Sync public repos and create new ones as DRAFT projects.
 * New = not present by slug OR repoUrl.
 * @param {{ username: string, includeTopics: boolean, token?: string }} opts
 * @returns {Promise<{created:number, failed:number}>}
 */
export async function syncNewReposAsDraft(opts) {
  const repos = await fetchPublicRepos(
    opts.username,
    !!opts.includeTopics,
    opts.token
  );

  const { slugSet, urlSet } = await getExistingKeys();

  const candidates = repos.filter((r) => {
    const s = slugify(r.name || "");
    const u = String(r.html_url || "").toLowerCase().trim();
    const slugHit = slugSet.has(s);
    const urlHit = u ? urlSet.has(u) : false;
    return !slugHit && !urlHit;
  });

  if (!candidates.length) return { created: 0, failed: 0 };

  let created = 0;
  let failed = 0;

  for (const r of candidates) {
    try {
      const tags = Array.from(
        new Set([
          ...(r.language ? [r.language] : []),
          ...((r.topics && Array.isArray(r.topics) ? r.topics : [])),
        ])
      );

      const payload = {
        title: r.name,
        slug: slugify(r.name),
        category: "Open Source",
        description: r.description ?? null,
        imageUrl: repoOgImage(r.owner?.login, r.name),
        liveUrl:
          (r.homepage && r.homepage.trim()) ||
          (r.has_pages ? pagesUrl(r.owner?.login, r.name) : null),
        repoUrl: r.html_url,
        tags,
      };

      const rowCount = await insertDraftProject(payload);
      if (rowCount > 0) {
        created += 1;
        slugSet.add(payload.slug.toLowerCase());
        if (payload.repoUrl) urlSet.add(payload.repoUrl.toLowerCase());
      }
    } catch (e) {
      failed += 1;
      // eslint-disable-next-line no-console
      console.error("[githubSync] insert failed:", e);
    }
  }

  return { created, failed };
}

export default {
  fetchPublicRepos,
  syncNewReposAsDraft,
  slugify,
  repoOgImage,
  pagesUrl,
};
