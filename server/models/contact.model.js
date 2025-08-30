import pool from "../config/db.js";

// Get all contact records
export const getAllContactsFromDB = async () => {
  const result = await pool.query("SELECT * FROM contact ORDER BY created_at DESC");
  return result.rows;
};

// Add a new contact
export const addContactToDB = async ({ user_id, name, email, subject, message }) => {
  const result = await pool.query(
    `INSERT INTO contact (user_id, name, email, subject, message)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [user_id || null, name, email, subject, message]
  );
  return result.rows[0];
};

// Delete contact by ID
export const deleteContactFromDB = async (id) => {
  const result = await pool.query("DELETE FROM contact WHERE id = $1 RETURNING *", [id]);
  return result.rowCount > 0;
};
