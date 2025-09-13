import type { Database } from "@/types/database.types";

export type DbProfile = Database["public"]["Tables"]["profiles"]["Row"];


export interface User extends Omit<DbProfile, "role"> {
  role: "owner" | "user" | "super_admin" | "site_owner" | "site_admin" | "editor" | "viewer";
}
