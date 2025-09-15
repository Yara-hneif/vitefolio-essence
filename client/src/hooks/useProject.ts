import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/client.api';
import { Project, mapDbProjectToProject } from '@/types/models/Project';

const fetchProjectBySlug = async (slug: string): Promise<Project> => {
  const { data } = await api.get(`/api/projects/${slug}?with=tags,profile`);
  if (!data) throw new Error('Project not found');
  return mapDbProjectToProject(data);
};

export const useProject = (slug: string) => {
  return useQuery<Project>({
    queryKey: ['project', slug],
    queryFn: () => fetchProjectBySlug(slug),
    enabled: !!slug,
    staleTime: 60_000,
  });
};
