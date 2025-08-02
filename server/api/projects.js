//  This function retrieves all projects from the database.
//  It uses the PostgreSQL connection pool to execute a query and return the results.
import express from "express";
import {
  getAllProjects,
  getProjectBySlug,
} from "../controllers/projectsController.js";

const router = express.Router();

// GET /api/projects
router.get("/", getAllProjects);
// GET /api/projects/:slug
router.get("/:slug", getProjectBySlug);


export default router;
