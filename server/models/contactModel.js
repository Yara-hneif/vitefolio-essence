import pool from "../config/db.js";

// Get all contact records
export const getAllContactsFromDB = async () => {
  const result = await pool.query("SELECT * FROM contact ORDER BY created_at DESC");
  return result.rows;
};

// Add a new contact
export const addContactToDB = async ({ user_id, type, value }) => {
  const result = await pool.query(
    `INSERT INTO contact (user_id, type, value)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [user_id, type, value]
  );
  return result.rows[0];
};
