import db from "../config/db.js";

// Get all projects (optionally filter by user_id)
export async function getAllProjects(userId = null) {
  if (userId) {
    return db.query("SELECT * FROM projects WHERE user_id = $1 ORDER BY created_at DESC", [userId]);
  }
  return db.query("SELECT * FROM projects ORDER BY created_at DESC");
}

// Get project by ID
export async function getProjectById(id, userId = null) {
  if (userId) {
    return db.query("SELECT * FROM projects WHERE id = $1 AND user_id = $2", [id, userId]);
  }
  return db.query("SELECT * FROM projects WHERE id = $1", [id]);
}

// Get project by slug
export async function getProjectBySlug(slug, userId = null) {
  if (userId) {
    return db.query("SELECT * FROM projects WHERE slug = $1 AND user_id = $2", [slug, userId]);
  }
  return db.query("SELECT * FROM projects WHERE slug = $1", [slug]);
}

// Create project
export async function createProject(project, userId) {
  const { title, description, slug, status, imageUrl, liveUrl, repoUrl, tags } = project;
  const result = await db.query(
    `INSERT INTO projects (title, description, slug, status, imageUrl, liveUrl, repoUrl, tags, user_id)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
    [title, description, slug, status || "draft", imageUrl, liveUrl, repoUrl, tags || [], userId]
  );
  return result.rows[0];
}

// Update project
export async function updateProject(id, updates, userId = null, isSuper = false) {
  const fields = Object.keys(updates);
  if (fields.length === 0) return null;

  const setClause = fields.map((f, i) => `${f} = $${i + 1}`).join(", ");
  const values = Object.values(updates);

  let query = `UPDATE projects SET ${setClause}, updated_at = NOW() WHERE id = $${fields.length + 1}`;
  let params = [...values, id];

  if (!isSuper && userId) {
    query += ` AND user_id = $${fields.length + 2}`;
    params.push(userId);
  }

  query += " RETURNING *";
  const result = await db.query(query, params);
  return result.rows[0] || null;
}

// Delete project
export async function deleteProject(id, userId = null, isSuper = false) {
  let query = "DELETE FROM projects WHERE id = $1";
  let params = [id];

  if (!isSuper && userId) {
    query += " AND user_id = $2";
    params.push(userId);
  }

  const result = await db.query(query, params);
  return result.rowCount > 0;
}