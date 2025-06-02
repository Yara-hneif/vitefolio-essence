import dotenv from "dotenv";
dotenv.config(); // Load environment variables from .env file

import express from "express";
import cors from "cors";
import projectsRoutes from "./routes/projects.js";
import contactRoutes from "./routes/contact.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/projects", projectsRoutes);
app.use("/api/contact", contactRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
