// client/src/types/Project.ts
export type Project = {
  id: string;
  title: string;
  category?: string;
  slug: string;
  description?: string;
  url?: string;
  liveUrl?: string;   
  repoUrl?: string;
  coverImage?: string;
  imageUrl?: string;
  tags?: string[];
  sortOrder?: number;
  createdAt?: string;
  updatedAt?: string;
  status?: "draft" | "published";

};
