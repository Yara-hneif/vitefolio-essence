import express from "express";
import pool from "../config/db.js";
import { syncNewReposAsDraft } from "../services/githubSync.js";

const router = express.Router();

// Optional: create config table if it doesn't exist
async function ensureConfigTable() {
  const sql = `
    CREATE TABLE IF NOT EXISTS github_sync_config (
      id            INT PRIMARY KEY,
      enabled       BOOLEAN DEFAULT FALSE,
      username      TEXT,
      include_topics BOOLEAN DEFAULT TRUE,
      interval_min  INT DEFAULT 30,
      last_run_at   TIMESTAMPTZ,
      last_result   JSONB
    );
    -- seed single row if empty (id = 1)
    INSERT INTO github_sync_config (id)
    VALUES (1)
    ON CONFLICT (id) DO NOTHING;
  `;
  await pool.query(sql);
}

// Simple auth middleware using header secret
function requireSyncSecret(req, res, next) {
  const secret = process.env.SYNC_SECRET;
  const got =
    req.headers["x-sync-secret"] ||
    (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
  if (!secret || !got || got !== secret) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

async function getConfig() {
  const { rows } = await pool.query(
    `SELECT id, enabled, username, include_topics AS "includeTopics",
            interval_min AS "intervalMin", last_run_at AS "lastRunAt",
            last_result AS "lastResult"
     FROM github_sync_config
     WHERE id = 1`
  );
  if (rows.length) return rows[0];

  // Fallback defaults if table/row missing
  return {
    id: 1,
    enabled: false,
    username: process.env.GH_DEFAULT_USERNAME ?? null,
    includeTopics: (process.env.GH_INCLUDE_TOPICS ?? "true") === "true",
    intervalMin: Number(process.env.SYNC_INTERVAL_MIN ?? 30),
    lastRunAt: null,
    lastResult: null,
  };
}

async function upsertConfig({ enabled, username, includeTopics, intervalMin }) {
  const sql = `
    INSERT INTO github_sync_config (id, enabled, username, include_topics, interval_min)
    VALUES (1, COALESCE($1, enabled), COALESCE($2, username), COALESCE($3, include_topics), COALESCE($4, interval_min))
    ON CONFLICT (id) DO UPDATE SET
      enabled       = COALESCE(EXCLUDED.enabled, github_sync_config.enabled),
      username      = COALESCE(EXCLUDED.username, github_sync_config.username),
      include_topics= COALESCE(EXCLUDED.include_topics, github_sync_config.include_topics),
      interval_min  = COALESCE(EXCLUDED.interval_min, github_sync_config.interval_min)
    RETURNING id, enabled, username, include_topics AS "includeTopics",
              interval_min AS "intervalMin", last_run_at AS "lastRunAt",
              last_result AS "lastResult";
  `;
  const vals = [
    typeof enabled === "boolean" ? enabled : null,
    typeof username === "string" ? username.trim() : null,
    typeof includeTopics === "boolean" ? includeTopics : null,
    Number.isFinite(Number(intervalMin)) ? Number(intervalMin) : null,
  ];
  const { rows } = await pool.query(sql, vals);
  return rows[0];
}

async function setRunResult({ created, failed }) {
  const sql = `
    UPDATE github_sync_config
    SET last_run_at = NOW(),
        last_result = $1
    WHERE id = 1
    RETURNING id, enabled, username, include_topics AS "includeTopics",
              interval_min AS "intervalMin", last_run_at AS "lastRunAt",
              last_result AS "lastResult";
  `;
  const resJson = JSON.stringify({ created, failed });
  const { rows } = await pool.query(sql, [resJson]);
  return rows[0];
}

// Ensure table exists on module load
await ensureConfigTable();

/**
 * GET /api/admin/github-sync/config
 */
router.get("/config", requireSyncSecret, async (_req, res) => {
  try {
    const cfg = await getConfig();
    res.json(cfg);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("[github-sync] GET /config failed", e);
    res.status(500).json({ error: "Failed to load config" });
  }
});

/**
 * PUT /api/admin/github-sync/config
 * Body: { enabled?: boolean, username?: string, includeTopics?: boolean, intervalMin?: number }
 */
router.put("/config", requireSyncSecret, async (req, res) => {
  try {
    const payload = {
      enabled: typeof req.body?.enabled === "boolean" ? req.body.enabled : undefined,
      username: typeof req.body?.username === "string" ? req.body.username : undefined,
      includeTopics:
        typeof req.body?.includeTopics === "boolean" ? req.body.includeTopics : undefined,
      intervalMin: Number.isFinite(Number(req.body?.intervalMin))
        ? Number(req.body.intervalMin)
        : undefined,
    };
    const cfg = await upsertConfig(payload);
    res.json(cfg);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("[github-sync] PUT /config failed", e);
    res.status(500).json({ error: "Failed to update config" });
  }
});

/**
 * POST /api/admin/github-sync/run
 * Body (optional): { username?: string }
 */
router.post("/run", requireSyncSecret, async (req, res) => {
  try {
    const cfg = await getConfig();
    const username =
      (typeof req.body?.username === "string" && req.body.username.trim()) ||
      cfg.username ||
      process.env.GH_DEFAULT_USERNAME ||
      "";

    if (!username) return res.status(400).json({ error: "Missing username" });

    const includeTopics =
      typeof cfg.includeTopics === "boolean"
        ? cfg.includeTopics
        : (process.env.GH_INCLUDE_TOPICS ?? "true") === "true";

    const { created, failed } = await syncNewReposAsDraft({
      username,
      includeTopics,
      token: process.env.GITHUB_TOKEN,
    });

    await setRunResult({ created, failed });

    res.json({ created, failed });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("[github-sync] POST /run failed", e);
    res.status(500).json({ error: "Sync failed" });
  }
});

export default router;
