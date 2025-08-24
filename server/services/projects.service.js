import db from "../config/db.js";

export const getAllProjects = async () => {
  const result = await db.query("SELECT * FROM projects ORDER BY created_at DESC");
  return result.rows;
};

export const getProjectBySlug = async (slug) => {
  const result = await db.query("SELECT * FROM projects WHERE slug = $1", [slug]);
  return result.rows[0];
};

export const createProject = async (projectData) => {
  const {
    title,
    description,
    category,
    tags,
    image_url,
    slug,
    repo_url,
    live_url,
    status,
  } = projectData;

  const result = await db.query(
    `INSERT INTO projects 
    (title, description, category, tags, image_url, slug, repo_url, live_url, status) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *`,
    [title, description, category, tags, image_url, slug, repo_url, live_url, status]
  );

  return result.rows[0];
};

export const updateProject = async (id, updatedData) => {
  const {
    title,
    description,
    category,
    tags,
    image_url,
    slug,
    repo_url,
    live_url,
    status,
  } = updatedData;

  const result = await db.query(
    `UPDATE projects SET
      title = $1,
      description = $2,
      category = $3,
      tags = $4,
      image_url = $5,
      slug = $6,
      repo_url = $7,
      live_url = $8,
      status = $9
    WHERE id = $10
    RETURNING *`,
    [title, description, category, tags, image_url, slug, repo_url, live_url, status, id]
  );

  return result.rows[0];
};

export const deleteProject = async (id) => {
  const result = await db.query("DELETE FROM projects WHERE id = $1 RETURNING *", [id]);
  return result.rows[0];
};
