// Controller logic for handling project-related requests.
import {
  getAllProjectsFromDB,
  getProjectBySlugFromDB,
} from "../models/projectModel.js";

// Fixed user ID for demonstration purposes
// This should be replaced with actual user ID logic in a real application.
const fixedUserId = "4a8bdb28-f98c-4940-84c4-5370f5915cf7";

// GET /api/projects
export const getAllProjects = async (req, res) => {
  try {
    const projects = await getAllProjectsFromDB(fixedUserId);
    res.json(projects);
  } catch (error) {
    console.error("❌ Error fetching projects:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// GET /api/projects/:slug
export const getProjectBySlug = async (req, res) => {
  const { slug } = req.params;
  try {
    const project = await getProjectBySlugFromDB(fixedUserId, slug);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    res.json(project);
  } catch (error) {
    console.error("❌ Error fetching project by slug:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};