import { supabase } from "../config/supabase.js";

const GH_API = "https://api.github.com";
const STD_HEADERS = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
};

export const slugify = (s) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

export const repoOgImage = (owner, name) =>
  `https://opengraph.githubassets.com/1/${owner}/${name}`;

export const pagesUrl = (owner, name) =>
  `https://${owner}.github.io/${name}`;

export async function fetchPublicRepos(username, includeTopics = true, token) {
  const headers = { ...STD_HEADERS };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${GH_API}/users/${encodeURIComponent(username)}/repos?per_page=100&type=public&sort=updated`, { headers });
  if (!res.ok) throw new Error(`GitHub repos fetch failed: ${res.status}`);
  const repos = await res.json();
  return (repos || []).filter((r) => r && r.visibility !== "private");
}

// Insert draft project
async function insertDraftProject(p) {
  const { error } = await supabase.from("projects").insert([{ ...p, status: "draft" }]);
  if (error) throw error;
  return true;
}

export async function syncNewReposAsDraft({ username, includeTopics, token }) {
  const repos = await fetchPublicRepos(username, includeTopics, token);
  const { data: existing } = await supabase.from("projects").select("slug, repoUrl");

  const slugSet = new Set(existing?.map((r) => r.slug?.toLowerCase()));
  const urlSet = new Set(existing?.map((r) => r.repoUrl?.toLowerCase()));

  const candidates = repos.filter((r) => {
    const s = slugify(r.name);
    const u = String(r.html_url || "").toLowerCase().trim();
    return !slugSet.has(s) && !urlSet.has(u);
  });

  let created = 0, failed = 0;
  for (const r of candidates) {
    try {
      const payload = {
        title: r.name,
        slug: slugify(r.name),
        category: "Open Source",
        description: r.description ?? null,
        imageUrl: repoOgImage(r.owner?.login, r.name),
        liveUrl: r.homepage || (r.has_pages ? pagesUrl(r.owner?.login, r.name) : null),
        repoUrl: r.html_url,
        tags: r.language ? [r.language] : [],
      };
      await insertDraftProject(payload);
      created++;
    } catch {
      failed++;
    }
  }
  return { created, failed };
}
