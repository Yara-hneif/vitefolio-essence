import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import projectRoutes from "./routes/projects.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import errorHandler from "./middleware/errorHandler.js";
import notFound from "./middleware/notFound.js";
import logger from "./utils/logger.js";
import adminGithubSync from "./routes/adminGithubSync.js";
import { startScheduler } from "./services/scheduler.js";
import adminMessagesRoutes from "./routes/admin.messages.routes.js";
import requireAdmin from "./middleware/requireAdmin.js";
import { requireAuth, getAuth } from "@clerk/express";
import { Webhook } from "svix";
import { createClient } from "@supabase/supabase-js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

/** CORS: allow your Vite dev origin and credentials (if needed) */
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5173";
app.use(cors({
  origin: FRONTEND_ORIGIN,
  credentials: true,
}));
app.use(express.json());

/** Public routes */
app.use("/api/projects", projectRoutes);
app.use("/api/contact", contactRoutes);

/** Admin routes (protected with Bearer token) */
app.use("/api/admin/messages", requireAdmin, adminMessagesRoutes);
app.use("/api/admin/github-sync", requireAdmin, adminGithubSync);

/** Clerk routes */
app.use("/api/protected", requireAuth(), (req, res) => {
  const { userId } = getAuth(req);
  res.json({ message: "You are authenticated with Clerk!", userId });
});

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

app.post("/webhooks/clerk", express.json(), async (req, res) => {
  try {
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
    const evt = wh.verify(JSON.stringify(req.body), req.headers);

    if (evt.type === "user.created" || evt.type === "user.updated") {
      const user = evt.data;
      const email = user.email_addresses[0]?.email_address ?? "";

      await supabase.from("profiles").upsert({
        id: user.id,
        clerk_id: user.id,
        email,
        name: user.first_name
          ? `${user.first_name} ${user.last_name ?? ""}`.trim()
          : email.split("@")[0],
        username: user.username ?? email.split("@")[0],
        avatar: user.image_url ?? null,
        bio: "",
        social_links: {},
        skills: [],
      }, { onConflict: "clerk_id" });
    }

    res.status(200).send("ok");
  } catch (err) {
    console.error("Webhook failed:", err);
    res.status(400).send("Invalid signature");
  }
});

/** Health */
app.get("/", (_, res) => res.send("📡 Vitefolio API is running!"));

/** Error handlers */
app.use(errorHandler);
app.use(notFound);

app.listen(PORT, () => {
  logger.info(`🚀 Server listening on http://localhost:${PORT}`);
  startScheduler();
});
