import { api } from "@/lib/api";

export type SyncConfig = {
  id: number;
  enabled: boolean;
  username: string | null;
  includeTopics: boolean;
  intervalMin: number;
  lastRunAt: string | null;
  lastResult: any | null;
};

type RunSyncResponse = { created: number; failed: number };

const SYNC_HEADERS: Record<string, string> = {};
const secret = import.meta.env.VITE_SYNC_SECRET as string | undefined;
if (secret) SYNC_HEADERS["X-Sync-Secret"] = secret;

// Strongly-typed responses using Axios generics
export async function getSyncConfig(): Promise<SyncConfig> {
  const res = await api.get<SyncConfig>("/api/admin/github-sync/config", {
    headers: SYNC_HEADERS,
  });
  return res.data;
}

export async function updateSyncConfig(
  payload: Partial<Pick<SyncConfig, "enabled" | "username" | "includeTopics" | "intervalMin">>
): Promise<SyncConfig> {
  const body: Partial<SyncConfig> = {};
  if (typeof payload.enabled === "boolean") body.enabled = payload.enabled;
  if (typeof payload.username === "string") body.username = payload.username;
  if (typeof payload.includeTopics === "boolean") body.includeTopics = payload.includeTopics;
  if (typeof payload.intervalMin === "number") body.intervalMin = payload.intervalMin;

  const res = await api.put<SyncConfig>("/api/admin/github-sync/config", body, {
    headers: SYNC_HEADERS,
  });
  return res.data;
}

export async function runSyncNow(): Promise<RunSyncResponse> {
  const res = await api.post<RunSyncResponse>(
    "/api/admin/github-sync/run",
    {},
    { headers: SYNC_HEADERS }
  );
  return res.data;
}
