import express from "express";
import {
  getAllProjectsFromDB,
  getProjectById,
  getProjectBySlugFromDB,
  createProjectInDB,
  updateProjectInDB,
  deleteProjectFromDB,
} from "../models/project.model.js"; 

const router = express.Router();

// Get all projects (for current user)
router.get("/", async (req, res) => {
  try {
    const projects = await getAllProjectsFromDB(req);
    res.json(projects);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

// Get project by slug
router.get("/slug/:slug", async (req, res) => {
  try {
    const project = await getProjectBySlugFromDB(req, req.params.slug);
    if (!project) return res.status(404).json({ error: "Not found" });
    res.json(project);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

// Get project by ID
router.get("/:id", async (req, res) => {
  try {
    const project = await getProjectById(req, req.params.id);
    if (!project) return res.status(404).json({ error: "Not found" });
    res.json(project);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

// Create project
router.post("/", async (req, res) => {
  try {
    const project = await createProjectInDB(req, req.body);
    res.json(project);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

// Update project
router.put("/:id", async (req, res) => {
  try {
    const project = await updateProjectInDB(req, req.params.id, req.body);
    if (!project) return res.status(404).json({ error: "Not found" });
    res.json(project);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

// Delete project
router.delete("/:id", async (req, res) => {
  try {
    const ok = await deleteProjectFromDB(req, req.params.id);
    if (!ok) return res.status(404).json({ error: "Not found" });
    res.json({ ok: true });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

export default router;
