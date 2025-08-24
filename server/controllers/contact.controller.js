import {
  addContactToDB,
  getAllContactsFromDB,
  deleteContactFromDB,
} from "../models/contact.model.js";
import logger from "../utils/logger.js";

// GET /api/contact/all
export const getAllContacts = async (req, res) => {
  try {
    const contacts = await getAllContactsFromDB();
    res.status(200).json({ success: true, contacts });
  } catch (err) {
    logger.error("❌ Failed to fetch contact messages:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// POST /api/contact
export const createContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    const user_id = req.user?.id || null;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newContact = await addContactToDB({
      user_id,
      name,
      email,
      subject,
      message,
    });

    res.status(201).json({ success: true, contact: newContact });
  } catch (err) {
    logger.error("❌ Error saving contact form:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// DELETE /api/contact/:id
export const deleteContactMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await deleteContactFromDB(id);

    if (!deleted) {
      return res.status(404).json({ error: "Message not found" });
    }

    logger.info(`🗑️ Contact message deleted (ID: ${id})`);
    res.status(204).end();
  } catch (err) {
    logger.error(`❌ Failed to delete message ID ${req.params.id}:`, err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
