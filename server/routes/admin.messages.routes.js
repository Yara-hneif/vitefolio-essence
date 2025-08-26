import { Router } from "express";
import requireAdmin from "../middleware/requireAdmin.js";
import { readStore, writeStore } from "../utils/messageStore.js";
import crypto from "crypto";

const router = Router();
router.use(requireAdmin);

// GET /api/admin/messages
router.get("/", (req, res) => {
  const { q = "", page = 1, pageSize = 50, sort = "created_at:desc" } = req.query;
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

  const [field, dir] = String(sort).split(":");
  if (field) {
    items.sort((a, b) => {
      const va = a?.[field];
      const vb = b?.[field];
      if (va === vb) return 0;
      return (va > vb ? 1 : -1) * (dir === "asc" ? 1 : -1);
    });
  }

  const p = Number(page) || 1;
  const ps = Number(pageSize) || 50;
  const start = (p - 1) * ps;
  const slice = items.slice(start, start + ps);

  res.json({ items: slice, total: items.length, page: p, pageSize: ps });
});

router.patch("/:id", (req, res) => {
  const { id } = req.params;
  const patch = req.body || {};
  const store = readStore();

  const idx = store.items.findIndex((m) => m.id === id);
  if (idx === -1) return res.status(404).json({ error: "not_found" });

  store.items[idx] = {
    ...store.items[idx],
    ...patch,
    updated_at: new Date().toISOString(),
  };
  writeStore(store);
  res.json(store.items[idx]);
});

// DELETE /api/admin/messages/:id
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const store = readStore();
  const before = store.items.length;
  store.items = store.items.filter((m) => m.id !== id);
  store.total = store.items.length;
  writeStore(store);
  res.json({ ok: true, removed: before - store.items.length });
});

// DELETE /api/admin/messages  (bulk)
router.delete("/", (req, res) => {
  const ids = Array.isArray(req.body?.ids) ? req.body.ids : [];
  const store = readStore();
  const before = store.items.length;
  store.items = store.items.filter((m) => !ids.includes(m.id));
  store.total = store.items.length;
  writeStore(store);
  res.json({ ok: true, removed: before - store.items.length });
});

// POST /api/admin/messages/:id/reply 
router.post("/:id/reply", (req, res) => {
  const { id } = req.params;
  const { subject, body } = req.body || {};
  const store = readStore();
  const idx = store.items.findIndex((m) => m.id === id);
  if (idx === -1) return res.status(404).json({ error: "not_found" });

  store.items[idx].replied_at = new Date().toISOString();
  writeStore(store);
  res.json({ ok: true });
});

router.post("/__seed", (req, res) => {
  const store = readStore();
  const now = new Date().toISOString();
  const id = crypto.randomUUID?.() || Math.random().toString(36).slice(2);
  const msg = {
    id,
    name: "Test User",
    email: "test@example.com",
    subject: "Hello!",
    message: "This is a test message from seed endpoint.",
    is_read: false,
    is_starred: false,
    created_at: now,
    updated_at: now,
  };
  store.items.unshift(msg);
  store.total = store.items.length;
  writeStore(store);
  res.json(msg);
});

export default router;
