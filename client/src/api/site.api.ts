import { supabase } from '@/lib/supabase';
import type { DbSite, Site, SitePage } from '@/types/models/Site';

/* -----------------------
   Helpers
----------------------- */
function mapDbSiteToSite(db: DbSite): Site {
  return {
    ...db,
    name: db.name ?? null,
    status: db.status ?? null,
    template: db.template ?? '',
  };
}

/* -----------------------
   Sites
----------------------- */
export async function listSites(userId: string): Promise<Site[]> {
  const { data, error } = await supabase
    .from('sites')
    .select('*')
    .eq('owner_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapDbSiteToSite);
}

export async function getSiteBySlug(slug: string): Promise<Site | null> {
  const { data, error } = await supabase
    .from('sites')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error) throw error;
  return data ? mapDbSiteToSite(data as DbSite) : null;
}

export async function setSitePublished(siteId: string, published: boolean) {
  const { error } = await supabase.from('sites').update({ published }).eq('id', siteId);
  if (error) throw error;
}

/* -----------------------
   Pages
----------------------- */
export async function listPages(siteId: string): Promise<SitePage[]> {
  const { data, error } = await supabase
    .from('site_pages')
    .select('*')
    .eq('site_id', siteId)
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as SitePage[];
}

export async function getHomePage(siteId: string): Promise<SitePage | null> {
  const { data, error } = await supabase
    .from('site_pages')
    .select('*')
    .eq('site_id', siteId)
    .eq('is_home', true)
    .maybeSingle();

  if (error) throw error;
  return data as SitePage | null;
}

export async function loadPage(pageId: string): Promise<SitePage | null> {
  const { data, error } = await supabase
    .from('site_pages')
    .select('*')
    .eq('id', pageId)
    .maybeSingle();

  if (error) throw error;
  return data as SitePage | null;
}

export async function savePage(pageId: string, content: any) {
  const { error } = await supabase
    .from('site_pages')
    .update({ content, updated_at: new Date().toISOString() })
    .eq('id', pageId);

  if (error) throw error;
}

/* -----------------------
   Create Site (from template)
----------------------- */
export async function createSiteFromTemplate(siteData: {
  profile_id: string;
  title: string;
  slug: string;
  description?: string;
  template: string;
}) {
  const { profile_id, title, slug, description, template } = siteData;

  // 1. Insert site
  const { data: site, error: siteError } = await supabase
    .from('sites')
    .insert({
      owner_id: profile_id,
      profile_id,
      title,
      slug,
      template,
      published: false,
      is_public: false,
      status: 'draft',
      created_at: new Date().toISOString(),
      description: description ?? '',
    })
    .select()
    .single();

  if (siteError) throw siteError;

  // 2. Insert default home page
  const { data: page, error: pageError } = await supabase
    .from('site_pages')
    .insert({
      site_id: site.id,
      profile_id,
      name: 'Home',
      slug: 'home',
      is_home: true,
      content: {
        blocks: [
          { component: { name: 'Hero', options: { title, subtitle: 'Your tagline here' } } },
          { component: { name: 'ProjectsGrid', options: { title: 'Featured Projects' } } },
          { component: { name: 'ContactSection', options: { title: 'Get in Touch' } } },
          { component: { name: 'Footer', options: {} } },
        ],
      },
    })
    .select()
    .single();

  if (pageError) throw pageError;

  return { site: mapDbSiteToSite(site as DbSite), homePageId: page.id };
}

/* -----------------------
   Extra Site APIs
----------------------- */

/** Get single site by id */
export async function getSiteById(id: string): Promise<Site | null> {
  const { data, error } = await supabase.from('sites').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return data ? mapDbSiteToSite(data as DbSite) : null;
}

/** Update site */
export async function updateSite(id: string, updates: Partial<Site>) {
  const { data, error } = await supabase
    .from('sites')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return mapDbSiteToSite(data as DbSite);
}

/** Delete site and its pages */
export async function deleteSite(id: string) {
  const { error: pagesError } = await supabase.from('site_pages').delete().eq('site_id', id);
  if (pagesError) throw pagesError;

  const { error } = await supabase.from('sites').delete().eq('id', id);
  if (error) throw error;

  return true;
}
