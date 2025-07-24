import pool from "../config/db.js";

export const createContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    // Assuming user_id is available from the request context, e.g., from authentication middleware
    // If user_id is not available, you can set it to null or handle it accordingly
    const user_id = req.user?.id || null;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const result = await pool.query(
      `INSERT INTO contact (user_id, name, email, subject, message)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [user_id, name, email, subject, message]
    );

    res.status(201).json({ success: true, contact: result.rows[0] });
  } catch (err) {
    console.error("Error saving contact form:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
