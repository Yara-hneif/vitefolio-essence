import type { Database } from '@/types/database.types';

export type DbSite = Database['public']['Tables']['sites']['Row'];
export type Site = DbSite;

export type DbSitePage = Database['public']['Tables']['site_pages']['Row'];
export type SitePage = DbSitePage;
