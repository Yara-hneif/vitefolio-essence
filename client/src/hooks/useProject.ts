import { useQuery } from "@tanstack/react-query";
import { fetchProjectBySlug } from "@/api";

export const useProject = (slug: string) => {
  return useQuery({
    queryKey: ["project", slug],
    queryFn: () => fetchProjectBySlug(slug),
    enabled: !!slug, 
    staleTime: 60_000,
  });
}