import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/utils/types/database.types";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL or Anon Key is missing from environment variables");
}

// External token provider (e.g., Clerk JWT via getToken({ template: "supabase" }))
let externalTokenProvider: null | (() => Promise<string | null>) = null;
export function setExternalTokenProvider(fn: () => Promise<string | null>) {
  externalTokenProvider = fn;
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  // Proper way to inject an async access token for every request
  accessToken: async () => {
    try {
      return externalTokenProvider ? (await externalTokenProvider()) ?? null : null;
    } catch {
      return null;
    }
  },
});
