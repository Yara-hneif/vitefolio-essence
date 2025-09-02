// src/lib/authService.ts
import { supabase } from "@/lib/supabase";
import { UserResource } from "@clerk/types";

/**
 * Sync a Clerk user with Supabase "profiles" table.
 * Always call this with `clerkUser` from Clerk hooks (useUser).
 */
export async function syncUserToSupabase(
  clerkUser: UserResource,
  extra?: { username?: string; full_name?: string }
) {
  if (!clerkUser) return;

  const { error } = await supabase.from("profiles").upsert(
    {
      clerk_id: clerkUser.id,
      email: clerkUser.primaryEmailAddress?.emailAddress ?? undefined,
      full_name: extra?.full_name ?? clerkUser.fullName ?? undefined,
      username: extra?.username ?? undefined,
      avatar_url: clerkUser.imageUrl ?? undefined,
    },
    { onConflict: "clerk_id" }
  );

  if (error) {
    console.error("❌ Failed to sync user to Supabase:", error.message);
  } else {
    console.log("✅ User synced to Supabase");
  }
}

/**
 * Delete a Clerk user from Supabase and remove related data.
 * Call this before deleting the user from Clerk.
 */
export async function deleteUserFromSupabase(clerkId: string) {
  try {
    // Delete related records from all user-related tables
    await supabase.from("contacts").delete().eq("user_id", clerkId);
    await supabase.from("projects").delete().eq("user_id", clerkId);
    await supabase.from("profiles").delete().eq("clerk_id", clerkId);

    console.log("✅ User and related data deleted from Supabase");
  } catch (err: any) {
    console.error("❌ Failed to delete user from Supabase:", err.message);
    throw err;
  }
}
