export default function requireAdmin(req, res, next) {
  const expected = process.env.ADMIN_SECRET;
  const got = req.header("x-admin-secret");
  if (!expected || got !== expected) {
    return res.status(401).json({ error: "unauthorized" });
  }
  next();
}
