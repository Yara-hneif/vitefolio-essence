import type { Database } from '@/types/database.types';

export type DbContact = Database['public']['Tables']['contact']['Row'];

export type Contact = DbContact;
