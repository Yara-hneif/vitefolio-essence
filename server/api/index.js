// This is the entry point for the server application.
// It sets up the server, connects to the database, and defines routes.

// Import routes for projects and contact form
import projectsRoutes from "./projects.js";
import contactRoutes from "./contact.js";

// Load environment variables from.env file
import dotenv from "dotenv";
dotenv.config(); // Load environment variables from .env file

// Import necessary modules
import express from "express";
import cors from "cors";

// Create the Express application and set up the server port and CORS settings.
const app = express();
const PORT = process.env.PORT || 5000;

// Apply CORS middleware to all routes. This allows cross-origin requests from any origin.
app.use(cors());
app.use(express.json());

// Define routes for projects and contact form.
app.use("/api/projects", projectsRoutes);
app.use("/api/contact", contactRoutes);

// Health check route (homepage)
app.get("/", (req, res) => {
  res.send("📡 Vitefolio API is running!");
});

// Start the server.
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
