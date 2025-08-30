import express from "express";
import {
  createContact,
  getAllContacts,
  deleteContactMessage,
} from "../controllers/contact.controller.js";
import logger from "../utils/logger.js";

const router = express.Router();

// Route: POST /api/contact
router.post("/", async (req, res, next) => {
  logger.info("📥 Received POST /api/contact");
  return createContact(req, res, next);
});

// Route: GET /api/contact/all
router.get("/all", async (req, res, next) => {
  logger.info("📬 Received GET /api/contact/all");
  return getAllContacts(req, res, next);
});

// Route: DELETE /api/contact/:id
router.delete("/:id", async (req, res, next) => {
  logger.info(`🗑️ Received DELETE /api/contact/${req.params.id}`);
  return deleteContactMessage(req, res, next);
});

// Route: GET /api/contact
if (process.env.NODE_ENV !== "production") {
  router.get("/", (req, res) => {
    logger.info("📡 GET /api/contact (test)");
    res.send("✅ Contact endpoint is working (GET test)");
  });
}

export default router;
