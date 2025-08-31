import { supabase } from "../config/supabase.js";

// Get all contact records
export const getAllContactsFromDB = async () => {
  const { data, error } = await supabase
    .from("contact")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

// Add a new contact
export const addContactToDB = async ({ user_id, name, email, subject, message }) => {
  const { data, error } = await supabase
    .from("contact")
    .insert([
      {
        user_id: user_id || null,
        name,
        email,
        subject,
        message,
        is_read: false,
        is_starred: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ])
    .single();

  if (error) throw error;
  return data;
};

// Update contact 
export const updateContactInDB = async (id, updates) => {
  const { data, error } = await supabase
    .from("contact")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
};

// Mark as replied
export const markAsRepliedInDB = async (id) => {
  const { error } = await supabase
    .from("contact")
    .update({ replied_at: new Date().toISOString(), updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw error;
  return true;
};

// Delete contact by ID
export const deleteContactFromDB = async (id) => {
  const { error } = await supabase.from("contact").delete().eq("id", id);
  if (error) throw error;
  return true;
};
