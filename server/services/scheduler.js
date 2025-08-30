// Periodic GitHub sync with single-run locking via PostgreSQL advisory locks.

import cron from "node-cron";
import pool from "../config/db.js";
import { syncNewReposAsDraft } from "./githubSync.js";


let task = null;

// Use a constant bigint key for advisory lock; change if you need isolation per env.
const LOCK_KEY = 904215823401n; // bigint

function minutesSince(date) {
  if (!date) return Infinity;
  const t = typeof date === "string" ? new Date(date) : date;
  return (Date.now() - t.getTime()) / 60000;
}

async function ensureConfigTable() {
  const sql = `
    CREATE TABLE IF NOT EXISTS github_sync_config (
      id              INT PRIMARY KEY,
      enabled         BOOLEAN DEFAULT FALSE,
      username        TEXT,
      include_topics  BOOLEAN DEFAULT TRUE,
      interval_min    INT DEFAULT 30,
      last_run_at     TIMESTAMPTZ,
      last_result     JSONB
    );
    INSERT INTO github_sync_config (id)
    VALUES (1)
    ON CONFLICT (id) DO NOTHING;
  `;
  await pool.query(sql);
}

async function getConfig() {
  const { rows } = await pool.query(
    `SELECT id, enabled, username,
            include_topics AS "includeTopics",
            interval_min   AS "intervalMin",
            last_run_at    AS "lastRunAt",
            last_result    AS "lastResult"
       FROM github_sync_config
      WHERE id = 1`
  );

  if (rows.length) return rows[0];

  // Fallback defaults if the table exists but row is missing
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

async function setRunResult({ created, failed }) {
  const sql = `
    UPDATE github_sync_config
       SET last_run_at = NOW(),
           last_result = $1
     WHERE id = 1
  `;
  await pool.query(sql, [JSON.stringify({ created, failed })]);
}

async function withAdvisoryLock(fn) {
  // Try to acquire advisory lock
  const { rows } = await pool.query(
    "SELECT pg_try_advisory_lock($1::bigint) AS locked",
    [LOCK_KEY]
  );
  const locked = rows?.[0]?.locked === true;

  if (!locked) {
    // Another process is running the job
    return;
  }

  try {
    await fn();
  } finally {
    // Always release lock
    await pool.query("SELECT pg_advisory_unlock($1::bigint)", [LOCK_KEY]).catch(() => {});
  }
}

export function startScheduler() {
  if (task) return; // already started

  // Every minute; internal logic decides whether it's time based on interval
  task = cron.schedule("* * * * *", async () => {
    await withAdvisoryLock(async () => {
      try {
        await ensureConfigTable();
        const cfg = await getConfig();
        if (!cfg?.enabled) return;

        const interval = Math.max(1, Number(cfg.intervalMin ?? 30));
        if (minutesSince(cfg.lastRunAt) < interval) return;

        const username =
          cfg.username || process.env.GH_DEFAULT_USERNAME || "";
        if (!username) return;

        const includeTopics =
          typeof cfg.includeTopics === "boolean"
            ? cfg.includeTopics
            : (process.env.GH_INCLUDE_TOPICS ?? "true") === "true";

        const { created, failed } = await syncNewReposAsDraft({
          username,
          includeTopics,
          token: process.env.GITHUB_TOKEN, // server-side only
        });

        await setRunResult({ created, failed });

        // Optional logs
        if (created || failed) {
          console.log(`[github-sync] run completed: created=${created}, failed=${failed}`);
        }
      } catch (e) {
        console.error("[github-sync] scheduled run failed:", e);
      }
    });
  });

  task.start();
  console.log("[github-sync] scheduler started (every 1 minute)");
}

export function stopScheduler() {
  if (task) {
    task.stop();
    task = null;
    console.log("[github-sync] scheduler stopped");
  }
}
