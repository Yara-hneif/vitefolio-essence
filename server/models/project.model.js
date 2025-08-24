import pool from "../config/db.js";

// dynamic user ID
// This should be replaced with actual user ID logic in a real application.
const fixedUserId = "4a8bdb28-f98c-4940-84c4-5370f5915cf7";

// 1. Get all published projects for a user
export const getAllProjectsFromDB = async (userId = fixedUserId) => {
  const result = await pool.query(
    `SELECT * FROM projects WHERE user_id = $1 ORDER BY created_at DESC`,
    [userId]
  );
  return result.rows;
};

// 2. Get project by slug
export const getProjectBySlugFromDB = async (userId = fixedUserId, slug) => {
  const result = await pool.query(
    `SELECT * FROM projects WHERE user_id = $1 AND slug = $2`,
    [userId, slug]
  );
  return result.rows[0];
};

// 3. Create new project
export const createProjectInDB = async (project, userId = fixedUserId) => {
  const {
    title,
    slug,
    description,
    repo_url,
    live_url,
    status = "draft",
    tags = [],
  } = project;

  const result = await pool.query(
    `INSERT INTO projects (title, slug, description, repo_url, live_url, status, tags, user_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [title, slug, description, repo_url, live_url, status, tags, userId]
  );

  return result.rows[0];
};

// 4. Update existing project
export const updateProjectInDB = async (id, updates) => {
  const {
    title,
    slug,
    description,
    repo_url,
    live_url,
    status,
    tags,
  } = updates;

  const result = await pool.query(
    `UPDATE projects SET 
      title = $1,
      slug = $2,
      description = $3,
      repo_url = $4,
      live_url = $5,
      status = $6,
      tags = $7
     WHERE id = $8
     RETURNING *`,
    [title, slug, description, repo_url, live_url, status, tags, id]
  );

  return result.rows[0];
};

// 5. Delete project
export const deleteProjectFromDB = async (id) => {
  const result = await pool.query(`DELETE FROM projects WHERE id = $1`, [id]);
  return result.rowCount > 0;
};
