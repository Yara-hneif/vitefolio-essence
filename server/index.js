import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import projectRoutes from "./routes/projects.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import deleteAccountHandler from "./routes/deleteAccount.js";

import errorHandler from "./middleware/errorHandler.js";
import notFound from "./middleware/notFound.js";
import logger from "./utils/logger.js";
import { startScheduler } from "./services/scheduler.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

/** CORS: allow your Vite dev origin and credentials */
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5173";
app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    credentials: true,
  })
);
app.use(express.json());

/** Public routes */
app.use("/api/projects", projectRoutes);
app.use("/api/contact", contactRoutes);
app.post("/api/delete-account", deleteAccountHandler);

/** Health check */
app.get("/", (_, res) => res.send("📡 Vitefolio API is running!"));

/** Error handlers */
app.use(errorHandler);
app.use(notFound);

app.listen(PORT, () => {
  logger.info(`🚀 Server listening on http://localhost:${PORT}`);
  startScheduler();
});
