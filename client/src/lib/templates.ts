// Template system for VitePortfolio (Supabase-ready)
import { supabase } from "@/lib/supabase";

export interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  category: string;
  features: string[];
  blocks: any[];
  isPopular?: boolean;
  demoUrl?: string;
}

export const createSiteFromTemplate = async (
  template: Template,
  siteData: {
    name: string;
    slug: string;
    description: string;
    userId: string;
  }
) => {
  const { data: site, error: siteError } = await supabase
    .from("sites")
    .insert({
      user_id: siteData.userId,
      name: siteData.name,
      slug: siteData.slug,
      description: siteData.description,
      template: template.id,
      status: "draft",
      published: false,
    })
    .select()
    .single();

  if (siteError) throw siteError;

  const builderContent = {
    data: {
      userId: siteData.userId,
      siteSlug: siteData.slug,
      slug: "home",
      isHome: true,
      title: siteData.name,
      description: siteData.description,
      template: template.id,
    },
    blocks: template.blocks.map((block) => ({
      ...block,
      component: {
        ...block.component,
        options: {
          ...block.component.options,
          title: block.component.options?.title?.includes("Your Name")
            ? block.component.options.title.replace("Your Name", siteData.name)
            : block.component.options?.title,
        },
      },
    })),
  };

  const { data: page, error: pageError } = await supabase
    .from("site_pages")
    .insert({
      site_id: site.id,
      name: "Home",
      slug: "home",
      is_home: true,
      content: builderContent,
    })
    .select()
    .single();

  if (pageError) throw pageError;

  return { siteId: site.id, homePageId: page.id };
};

export const getUserSites = async (userId: string) => {
  const { data, error } = await supabase
    .from("sites")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
};
