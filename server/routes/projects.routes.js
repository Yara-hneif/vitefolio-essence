import express from "express";
import {
  getAllProjects,
  getProjectById,
  getProjectBySlug,
  createProject,
  updateProject,
  deleteProject,
} from "../controllers/projects.controller.js";

const router = express.Router();

router.get("/", getAllProjects);
router.post("/", createProject);

// by slug
router.get("/:slug", getProjectBySlug);

// by id
router.get("/:id", getProjectById);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);

export default router;
