import {
  addContactToDB,
  getAllContactsFromDB,
  deleteContactFromDB,
  updateContactInDB,
  markAsRepliedInDB,
} from "../models/contact.model.js";
import logger from "../utils/logger.js";

// GET all
export const getAllContacts = async (req, res) => {
  try {
    const contacts = await getAllContactsFromDB();
    res.status(200).json({ success: true, contacts });
  } catch (err) {
    logger.error("❌ Failed to fetch contact messages:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// POST new
export const createContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const newContact = await addContactToDB({ name, email, subject, message });
    res.status(201).json({ success: true, contact: newContact });
  } catch (err) {
    logger.error("❌ Error saving contact form:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// PATCH update
export const updateContact = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await updateContactInDB(id, req.body);
    if (!updated) return res.status(404).json({ error: "Contact not found" });
    res.status(200).json(updated);
  } catch (err) {
    logger.error("❌ Failed to update contact:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// POST reply
export const markAsReplied = async (req, res) => {
  try {
    const { id } = req.params;
    await markAsRepliedInDB(id);
    res.json({ ok: true });
  } catch (err) {
    logger.error("❌ Failed to mark as replied:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// DELETE
export const deleteContactMessage = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteContactFromDB(id);
    res.status(204).end();
  } catch (err) {
    logger.error("❌ Failed to delete contact:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
