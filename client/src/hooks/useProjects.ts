import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Project } from "@/utils/types/Project";
import { api } from "@/lib/api";

const fetchProjects = async (): Promise<Project[]> => {
  const { data } = await api.get("/api/projects");
  if (!Array.isArray(data)) throw new Error("Invalid data format");
  return data;
};

export const useProjects = () => {
  const queryClient = useQueryClient();

  const {
    data: projects,
    isLoading,
    isError,
  } = useQuery<Project[], Error>({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });

  const createProject = useMutation({
    mutationFn: async (newProject: Partial<Project>) => {
      const { data } = await api.post("/api/projects", newProject);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  const updateProject = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Project> }) => {
      const { data } = await api.put(`/api/projects/${id}`, updates);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  const deleteProject = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/projects/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  return {
    projects,
    isLoading,
    isError,
    createProject,
    updateProject,
    deleteProject,
  };
};
