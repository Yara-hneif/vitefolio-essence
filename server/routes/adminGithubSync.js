import express from "express";
import { supabase } from "../config/supabase.js";
import { syncNewReposAsDraft } from "../services/githubSync.js";

const router = express.Router();

function requireSyncSecret(req, res, next) {
  const secret = process.env.SYNC_SECRET;
  const got = req.headers["x-sync-secret"] || (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
  if (!secret || got !== secret) return res.status(401).json({ error: "Unauthorized" });
  next();
}

// GET config
router.get("/config", requireSyncSecret, async (_req, res) => {
  const { data, error } = await supabase.from("github_sync_config").select("*").eq("id", 1).single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// PUT config
router.put("/config", requireSyncSecret, async (req, res) => {
  const payload = req.body;
  const { data, error } = await supabase.from("github_sync_config").upsert({ id: 1, ...payload }).single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// POST run sync
router.post("/run", requireSyncSecret, async (req, res) => {
  try {
    const { data: cfg } = await supabase.from("github_sync_config").select("*").eq("id", 1).single();
    const username = req.body?.username || cfg?.username || process.env.GH_DEFAULT_USERNAME;
    if (!username) return res.status(400).json({ error: "Missing username" });
    const { created, failed } = await syncNewReposAsDraft({ username, includeTopics: cfg?.include_topics ?? true, token: process.env.GITHUB_TOKEN });
    await supabase.from("github_sync_config").update({ last_run_at: new Date().toISOString(), last_result: { created, failed } }).eq("id", 1);
    res.json({ created, failed });
  } catch (e) {
    res.status(500).json({ error: "Sync failed" });
  }
});

export default router;
