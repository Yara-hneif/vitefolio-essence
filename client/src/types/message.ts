export interface AdminMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

export interface SiteMessage {
  id: string;
  site_id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}
export type Message = AdminMessage | SiteMessage;