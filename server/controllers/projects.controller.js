import {
  getAllProjectsFromDB,
  getProjectBySlugFromDB,
  createProjectInDB,
  updateProjectInDB,
  deleteProjectFromDB,
} from "../models/project.model.js";
import logger from "../utils/logger.js";

// GET /api/projects
export const getAllProjects = async (req, res, next) => {
  try {
    const projects = await getAllProjectsFromDB(req);
    logger.info("✅ Retrieved all projects from DB");
    res.status(200).json(projects);
  } catch (error) {
    logger.error(`❌ getAllProjects failed: ${error.message}`);
    next(error);
  }
};

// GET /api/projects/:slug
export const getProjectBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const project = await getProjectBySlugFromDB(req, slug);

    if (!project) {
      logger.warn(`⚠️ Project not found for slug: ${slug}`);
      return res.status(404).json({ error: "Project not found" });
    }

    logger.info(`✅ Fetched project with slug: ${slug}`);
    res.status(200).json(project);
  } catch (error) {
    logger.error(`❌ getProjectBySlug failed: ${error.message}`);
    next(error);
  }
};

// POST /api/projects
export const createProject = async (req, res, next) => {
  try {
    const projectData = req.body;
    const newProject = await createProjectInDB(req, projectData);

    logger.info(`✅ Project created: ${newProject.title}`);
    res.status(201).json(newProject);
  } catch (error) {
    logger.error(`❌ createProject failed: ${error.message}`);
    next(error);
  }
};

// PUT /api/projects/:id
export const updateProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const updated = await updateProjectInDB(req, id, updateData);

    if (!updated) {
      logger.warn(`⚠️ Attempted to update non-existing project with ID: ${id}`);
      return res.status(404).json({ error: "Project not found" });
    }

    logger.info(`✅ Project updated: ${updated.title} (ID: ${id})`);
    res.status(200).json(updated);
  } catch (error) {
    logger.error(`❌ updateProject failed: ${error.message}`);
    next(error);
  }
};

// DELETE /api/projects/:id
export const deleteProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await deleteProjectFromDB(req, id);

    if (!deleted) {
      logger.warn(`⚠️ Attempted to delete non-existing project with ID: ${id}`);
      return res.status(404).json({ error: "Project not found" });
    }

    logger.info(`🗑️ Project deleted (ID: ${id})`);
    res.status(204).end();
  } catch (error) {
    logger.error(`❌ deleteProject failed: ${error.message}`);
    next(error);
  }
};
