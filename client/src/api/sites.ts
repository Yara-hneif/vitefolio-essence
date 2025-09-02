import { supabase } from "@/lib/supabase";

export type Site = {
  id: string;
  user_id: string;
  title: string;
  slug: string;
  template?: string;
  published: boolean;
  created_at: string;
};

export type SitePage = {
  id: string;
  site_id: string;
  name: string;
  slug: string;
  is_home: boolean;
  content: any;
  updated_at: string;
};

/* -----------------------
   Sites
----------------------- */

export async function listSites(userId: string): Promise<Site[]> {
  const { data, error } = await supabase
    .from("sites")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as Site[];
}

export async function getSiteBySlug(slug: string): Promise<Site | null> {
  const { data, error } = await supabase
    .from("sites")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data as Site | null;
}

export async function setSitePublished(siteId: string, published: boolean) {
  const { error } = await supabase
    .from("sites")
    .update({ published })
    .eq("id", siteId);
  if (error) throw error;
}

/* -----------------------
   Pages
----------------------- */

export async function listPages(siteId: string): Promise<SitePage[]> {
  const { data, error } = await supabase
    .from("site_pages")
    .select("*")
    .eq("site_id", siteId)
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return data as SitePage[];
}

export async function getHomePage(siteId: string): Promise<SitePage | null> {
  const { data, error } = await supabase
    .from("site_pages")
    .select("*")
    .eq("site_id", siteId)
    .eq("is_home", true)
    .maybeSingle();
  if (error) throw error;
  return data as SitePage | null;
}

export async function loadPage(pageId: string): Promise<SitePage | null> {
  const { data, error } = await supabase
    .from("site_pages")
    .select("*")
    .eq("id", pageId)
    .maybeSingle();
  if (error) throw error;
  return data as SitePage | null;
}

export async function savePage(pageId: string, content: any) {
  const { error } = await supabase
    .from("site_pages")
    .update({ content, updated_at: new Date().toISOString() })
    .eq("id", pageId);
  if (error) throw error;
}

/* -----------------------
   Create Site (from template)
----------------------- */
export async function createSiteFromTemplate(title: string, slug: string) {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error("Not authenticated");

  const { data: site, error: siteError } = await supabase
    .from("sites")
    .insert({
      user_id: user.id,
      title,
      slug,
      template: "demo",
      published: false,
    })
    .select()
    .single();

  if (siteError) throw siteError;

  const { data: page, error: pageError } = await supabase
    .from("site_pages")
    .insert({
      site_id: site.id,
      name: "Home",
      slug: "home",
      is_home: true,
      content: {
        blocks: [
          { component: { name: "Hero", options: { title, subtitle: "Your tagline here" } } },
          { component: { name: "ProjectsGrid", options: { title: "Featured Projects" } } },
          { component: { name: "ContactSection", options: { title: "Get in Touch" } } },
          { component: { name: "Footer", options: {} } },
        ],
      },
    })
    .select()
    .single();

  if (pageError) throw pageError;

  return { site, homePageId: page.id };
}
