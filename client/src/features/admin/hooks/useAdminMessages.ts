import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

/* ========= Types ========= */

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  is_read: boolean;
  is_starred: boolean;
  created_at: string;
  updated_at: string;
  auto_reply_sent_at?: string;
  replied_at?: string;
}

export interface MessagesResponse {
  items: ContactMessage[];
  total: number;
  page: number;
  pageSize: number;
}

export interface MessagesQueryParams {
  q?: string;
  page?: number;
  pageSize?: number;
  sort?: string;       // e.g. "created_at:desc"
  is_read?: boolean;
  is_starred?: boolean;
}

/* ========= Queries / Mutations ========= */

export function useAdminMessages(params: MessagesQueryParams = {}) {
  return useQuery({
    queryKey: ["admin-messages", params] as const,
    queryFn: async (): Promise<MessagesResponse> => {
      const res = await api.get<MessagesResponse>("/api/admin/messages", { params });
      return res.data;
    },
  });
}

export function useAdminUpdateMessage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      patch,
    }: {
      id: string;
      patch: Partial<Pick<ContactMessage, "is_read" | "is_starred">>;
    }) => {
      const res = await api.patch<ContactMessage>(`/api/admin/messages/${id}`, patch);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-messages"] });
    },
  });
}

export function useAdminDeleteMessage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/admin/messages/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-messages"] });
    },
  });
}

export function useAdminBulkDelete() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (ids: string[]) => {
      const res = await api.request<any>({
        url: "/api/admin/messages",
        method: "DELETE",
        data: { ids },
        headers: { "Content-Type": "application/json" },
      });
      return res.data as { ok: boolean; removed: number };
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-messages"] });
    },
  });
}

export function useAdminReply() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, subject, body }: { id: string; subject: string; body: string }) => {
      const res = await api.post<{ ok: true }>(`/api/admin/messages/${id}/reply`, { subject, body });
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-messages"] });
    },
  });
}
