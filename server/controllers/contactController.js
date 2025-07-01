import pool from "../config/db.js";

export const createContact = async (req, res) => {
  try {
    const { user_id, name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const result = await pool.query(
      `INSERT INTO contact (user_id, name, email, message)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [user_id || null, name, email, message]
    );

    res.status(201).json({ success: true, contact: result.rows[0] });
  } catch (err) {
    console.error("Error saving contact form:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
