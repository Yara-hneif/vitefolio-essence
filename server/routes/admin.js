import { Router } from "express";
import requireAdmin from "../middleware/requireAdmin.js";
import { supabase } from "../config/supabase.js";
import crypto from "crypto";

const router = Router();
router.use(requireAdmin);


router.get("/", async (req, res) => {
  const { q = "", page = 1, pageSize = 50 } = req.query;

  const { data, error } = await supabase
    .from("contact")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return res.status(500).json({ error: error.message });

  let items = data || [];
  if (q) {
    const qq = String(q).toLowerCase();
    items = items.filter((m) =>
      [m.name, m.email, m.subject, m.message].some((f) =>
        String(f || "").toLowerCase().includes(qq)
      )
    );
  }

  const p = Math.max(1, Number(page) || 1);
  const ps = Math.max(1, Number(pageSize) || 50);
  const start = (p - 1) * ps;
  const slice = items.slice(start, start + ps);

  res.json({ items: slice, total: items.length, page: p, pageSize: ps });
});

router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const patch = req.body || {};

  const { data, error } = await supabase
    .from("contact")
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq("id", id)
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from("contact").delete().eq("id", id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

router.delete("/", async (req, res) => {
  const ids = Array.isArray(req.body?.ids) ? req.body.ids : [];
  if (!ids.length) return res.json({ ok: true, removed: 0 });

  const { error } = await supabase.from("contact").delete().in("id", ids);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

router.post("/:id/reply", async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase
    .from("contact")
    .update({ replied_at: new Date().toISOString(), updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

router.post("/__seed", async (_req, res) => {
  const now = new Date().toISOString();
  const msg = {
    id: crypto.randomUUID(),
    name: "Test User",
    email: "test@example.com",
    subject: "Hello!",
    message: "This is a test message",
    is_read: false,
    is_starred: false,
    created_at: now,
    updated_at: now,
  };
  const { error } = await supabase.from("contact").insert([msg]);
  if (error) return res.status(500).json({ error: error.message });
  res.json(msg);
});

export default router;
