import pool from "../config/db.js";

export const getAllProjectsFromDB = async (userId) => {
  const result = await pool.query(
    `SELECT * FROM projects WHERE user_id = $1 AND status = 'published' ORDER BY created_at DESC`,
    [userId]
  );
  return result.rows;
};
export const getProjectBySlugFromDB = async (userId, slug) => {
  const result = await pool.query(
    `SELECT * FROM projects WHERE user_id = $1 AND slug = $2 AND status = 'published'`,
    [userId, slug]
  );
  return result.rows[0];
};
