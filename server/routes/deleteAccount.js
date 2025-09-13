import { createClient } from "@supabase/supabase-js";

// Initialize Supabase Admin client using service_role key
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * DELETE ACCOUNT ROUTE HANDLER
 * This will:
 *  1. Delete all user-related data from projects, sites, profiles
 *  2. Delete the user from Supabase Auth
 */
export default async function deleteAccountHandler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ error: "Missing userId" });
  }

  try {
    // 1. Delete related data from dependent tables
    await supabaseAdmin.from("projects").delete().eq("profile_id", userId);
    await supabaseAdmin.from("sites").delete().eq("owner_id", userId);
    await supabaseAdmin.from("profiles").delete().eq("id", userId);

    // 2. Delete the user from Supabase Auth
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (authError) throw authError;

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("❌ Failed to delete account:", err);
    return res.status(500).json({ error: err.message || "Failed to delete account" });
  }
}
