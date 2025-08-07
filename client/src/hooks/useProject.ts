import { useQuery } from "@tanstack/react-query";
import { fetchProjectBySlug } from "@/api";

export const useProject = (slug: string) => {
  return useQuery({
    queryKey: ["project", slug],
    queryFn: () => fetchProjectBySlug(slug),
    enabled: !!slug, // Only run query if slug exists
  });
}