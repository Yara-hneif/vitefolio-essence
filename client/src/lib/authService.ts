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
