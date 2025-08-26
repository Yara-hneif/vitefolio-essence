const express = require("express");
const fs = require("fs");
const path = require("path");

const ADMIN_SECRET = process.env.ADMIN_SECRET;
const DATA_FILE = path.join(__dirname, "..", "data", "messages.json");

function ensureDataFile() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(JSON.stringify({ items: [], total: 0 }, null, 2));
  }
}
function readStore() {
  ensureDataFile();
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
}
function writeStore(s) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(s, null, 2), "utf8");
}

function requireAdmin(req, res, next) {
  const secret = req.headers["x-admin-secret"];
  if (!ADMIN_SECRET || secret !== ADMIN_SECRET) {
    return res.status(401).json({ error: "unauthorized" });
  }
  next();
}

const router = express.Router();
router.use(requireAdmin);

// GET /api/admin/messages
router.get("/messages", (req, res) => {
  const { q = "", page = 1, pageSize = 50 } = req.query;
  const store = readStore();
  let items = store.items || [];

  if (q) {
    const qq = String(q).toLowerCase();
    items = items.filter((m) =>
      [m.name, m.email, m.subject, m.message].some((f) =>
        String(f || "").toLowerCase().includes(qq)
      )
    );
  }

  const p = Number(page) || 1;
  const ps = Number(pageSize) || 50;
  const start = (p - 1) * ps;
  const slice = items.slice(start, start + ps);

  res.json({ items: slice, total: items.length, page: p, pageSize: ps });
});

router.patch("/messages/:id", express.json(), (req, res) => {
  const { id } = req.params;
  const patch = req.body || {};
  const store = readStore();
  const idx = store.items.findIndex((m) => m.id === id);
  if (idx === -1) return res.status(404).json({ error: "not found" });

  store.items[idx] = { ...store.items[idx], ...patch, updated_at: new Date().toISOString() };
  writeStore(store);
  res.json(store.items[idx]);
});

router.delete("/messages/:id", (req, res) => {
  const { id } = req.params;
  const store = readStore();
  const before = store.items.length;
  store.items = store.items.filter((m) => m.id !== id);
  store.total = store.items.length;
  writeStore(store);
  res.json({ ok: true, removed: before - store.items.length });
});

router.delete("/messages", express.json(), (req, res) => {
  const ids = Array.isArray(req.body?.ids) ? req.body.ids : [];
  const store = readStore();
  const before = store.items.length;
  store.items = store.items.filter((m) => !ids.includes(m.id));
  store.total = store.items.length;
  writeStore(store);
  res.json({ ok: true, removed: before - store.items.length });
});

router.post("/messages/:id/reply", express.json(), (req, res) => {
  const { id } = req.params;
  const store = readStore();
  const idx = store.items.findIndex((m) => m.id === id);
  if (idx === -1) return res.status(404).json({ error: "not found" });
  store.items[idx].replied_at = new Date().toISOString();
  writeStore(store);
  res.json({ ok: true });
});

module.exports = router;
