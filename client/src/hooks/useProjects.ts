import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Project, mapDbProjectToProject } from "@/types/models/Project";
import { api } from "@/api/client.api";

const fetchProjects = async (): Promise<Project[]> => {
  // SELECT projects.*, tags.id, tags.name
  // FROM projects
  // LEFT JOIN project_tags ON projects.id = project_tags.project_id
  // LEFT JOIN tags ON project_tags.tag_id = tags.id
  const { data } = await api.get("/api/projects?with=tags,profile");
  if (!Array.isArray(data)) throw new Error("Invalid data format");
  return data.map((p) => mapDbProjectToProject(p));
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
      if (!newProject.profile_id) {
        throw new Error("profile_id is required");
      }
      const { data } = await api.post("/api/projects", newProject);
      return mapDbProjectToProject(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  const updateProject = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Project> }) => {
      const { data } = await api.put(`/api/projects/${id}`, updates);
      return mapDbProjectToProject(data);
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
