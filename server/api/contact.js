import express from "express";
import { createContact } from "../controllers/contactController.js";

const router = express.Router();

router.post("/", createContact);

// Test endpoint to verify the contact route is working
router.get("/", (req, res) => {
  res.send("✅ Contact endpoint is working (GET test)");
});

export default router;
