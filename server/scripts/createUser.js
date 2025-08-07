import bcrypt from "bcrypt";
import pool from "../config/db.js"; 

const createUser = async () => {
  const name = "Yara Hneif";
  const email = "yara@example.com";
  const password = "123456";

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id`,
      [name, email, hashedPassword]
    );

    console.log("✅ User created with ID:", result.rows[0].id);
    process.exit();
  } catch (error) {
    console.error("❌ Error creating user:", error);
    process.exit(1);
  }
};

createUser();
