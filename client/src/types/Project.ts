export type Project = {
  id: string;
  title: string;
  description: string;
  slug: string;
  category: string;
  tags: string[];
  image_url: string;
  repo_url: string;
  live_url: string;
  status: "draft" | "published";
  created_at: string;
};
