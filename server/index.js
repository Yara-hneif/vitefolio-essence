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
//import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";

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
//app.use("/api/protected", ClerkExpressRequireAuth(), (req, res) => {
//  res.json({ message: "You are authenticated with Clerk!", userId: req.auth.userId });
//});

/** Health */
app.get("/", (_, res) => res.send("📡 Vitefolio API is running!"));

/** Error handlers */
app.use(errorHandler);
app.use(notFound);

app.listen(PORT, () => {
  logger.info(`🚀 Server listening on http://localhost:${PORT}`);
  startScheduler();
});
