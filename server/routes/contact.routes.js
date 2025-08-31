import express from "express";
import {
  createContact,
  getAllContacts,
  deleteContactMessage,
  updateContact,
  markAsReplied,
} from "../controllers/contact.controller.js";
import logger from "../utils/logger.js";

const router = express.Router();

// Route: POST /api/contact
router.post("/", createContact);

// Route: GET /api/contact/all
router.get("/all", getAllContacts);

// Route: PATCH /api/contact/:id
router.patch("/:id", updateContact);

// Route: POST /api/contact/:id/reply
router.post("/:id/reply", markAsReplied);

// Route: DELETE /api/contact/:id
router.delete("/:id", deleteContactMessage);

// Route: GET /api/contact (test)
if (process.env.NODE_ENV !== "production") {
  router.get("/", (req, res) => {
    logger.info("📡 GET /api/contact (test)");
    res.send("✅ Contact endpoint is working (GET test)");
  });
}

export default router;
