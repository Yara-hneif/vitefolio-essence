// ESM module – safe to import on startup (no side effects)

import pool from "../config/db.js";

/**
 * Insert a new contact message.
 * Returns the inserted row.
 */
export async function createContact({ name, email, message }) {
  const { rows } = await pool.query(
    `
      INSERT INTO contacts (name, email, message, created_at)
      VALUES ($1, $2, $3, NOW())
      RETURNING id, name, email, message, created_at
    `,
    [name, email, message]
  );
  return rows[0];
}

/**
 * Get latest contact messages (paged).
 */
export async function listContacts({ limit = 50, offset = 0 } = {}) {
  const { rows } = await pool.query(
    `
      SELECT id, name, email, message, created_at
      FROM contacts
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2
    `,
    [limit, offset]
  );
  return rows;
}

/**
 * Delete a contact by id.
 * Returns true if a row was deleted.
 */
export async function deleteContact(id) {
  const res = await pool.query(`DELETE FROM contacts WHERE id = $1`, [id]);
  return res.rowCount > 0;
}
