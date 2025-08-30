export interface Contact {
  id: string;
  user_id?: string | null;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}
