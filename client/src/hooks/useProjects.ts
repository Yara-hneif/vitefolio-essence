import { useQuery } from "@tanstack/react-query";
import { fetchProjects } from "@/api";

export const useProjects = () => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });
};
