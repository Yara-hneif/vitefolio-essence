import pool from "../config/db.js";

export const getAllProjectsFromDB = async () => {
  const result = await pool.query("SELECT * FROM projects ORDER BY id ASC");
  return result.rows;
};