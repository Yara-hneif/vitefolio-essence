import type { Database } from "@/types/database.types";

export type DbMessage = Database["public"]["Tables"]["messages"]["Row"];

/**
 * Message model
 */
export type Message = DbMessage;
