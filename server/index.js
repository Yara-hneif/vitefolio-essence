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

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

app.use(express.json());

app.use("/api/projects", projectRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/admin/github-sync", adminGithubSync);

// Health Check
app.get("/", (_, res) => res.send("📡 Vitefolio API is running!"));

// Error handler middleware
app.use(errorHandler);
// 404 Not Found middleware
app.use(notFound);

app.listen(PORT, () => {
  logger.info(`🚀 Server listening on http://localhost:${PORT}`);
  startScheduler(); // Start the GitHub sync scheduler
});
