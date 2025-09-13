import { api } from "./client.api";
import { Contact } from "@/types/models/Contact";

export async function getAllContacts(): Promise<Contact[]> {
  const { data } = await api.get<Contact[]>("/api/contact/all");
  return data;
}

export async function deleteContactMessage(id: string) {
  const { data } = await api.delete(`/api/contact/${id}`);
  return data;
}

export async function sendContactMessage(payload: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const { data } = await api.post("/api/contact", payload);
  return data;
}
