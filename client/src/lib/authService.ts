import { supabase } from "@/lib/supabase";
import type { UserResource } from "@clerk/types";


export async function syncUserToSupabase(
  clerkUser: UserResource,
  extra?: { username?: string; name?: string }
) {
  if (!clerkUser) return;

  const social_links: Record<string, string | undefined> = {
    github: (clerkUser.publicMetadata as any)?.github,
    linkedin: (clerkUser.publicMetadata as any)?.linkedin,
    twitter: (clerkUser.publicMetadata as any)?.twitter,
    website: (clerkUser.publicMetadata as any)?.website,
  };

  const skills = ((clerkUser.publicMetadata as any)?.skills as string[]) ?? [];

  const { error } = await supabase.from("profiles").upsert(
    {
      id: clerkUser.id,
      clerk_id: clerkUser.id,
      email: clerkUser.primaryEmailAddress?.emailAddress ?? "",
      name: clerkUser.fullName ??
        `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim(),
      username: clerkUser.username ??
        clerkUser.primaryEmailAddress?.emailAddress?.split("@")[0] ??
        `user_${clerkUser.id}`,
      avatar: clerkUser.imageUrl ?? "",
      bio: (clerkUser.publicMetadata?.bio as string) ?? "",
      social_links: (clerkUser.publicMetadata?.social_links as Record<string, string>) ?? {},
      skills: (clerkUser.publicMetadata?.skills as string[]) ?? [],
    },
    { onConflict: "clerk_id" }
  );
  if (error) console.error("❌ Sync error:", error.message);
  else console.log("✅ User synced to Supabase");
}


export async function deleteUserFromSupabase(clerkId: string) {

  const { data: prof, error: profErr } = await supabase
    .from("profiles")
    .select("id")
    .eq("clerk_id", clerkId)
    .maybeSingle();

  if (profErr) throw profErr;
  const userUuid = prof?.id as string | undefined;

  if (userUuid) {
    await supabase.from("blogs").delete().eq("user_id", userUuid);
    await supabase.from("projects").delete().eq("user_id", userUuid);
    await supabase.from("education").delete().eq("user_id", userUuid);
    await supabase.from("experience").delete().eq("user_id", userUuid);
    await supabase.from("certifications").delete().eq("user_id", userUuid);
    await supabase.from("links_recommended").delete().eq("user_id", userUuid);
    await supabase.from("sites").delete().eq("user_id", userUuid);
    await supabase.from("analytics").delete().eq("user_id", userUuid);
    await supabase.from("user_skills").delete().eq("user_id", userUuid);
    await supabase.from("contact").delete().eq("user_id", userUuid);
  }

  await supabase.from("profiles").delete().eq("clerk_id", clerkId);
}
