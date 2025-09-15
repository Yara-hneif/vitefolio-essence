import type { Database } from '@/types/database.types';

export type DbEducation = Database['public']['Tables']['education']['Row'];

export type Education = DbEducation;
