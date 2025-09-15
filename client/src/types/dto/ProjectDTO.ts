/**
 * DTOs (Data Transfer Objects) for creating and updating projects
 * Used in API requests, ensures only valid fields are sent
 */

export interface CreateProjectDTO {
  title: string;
  slug: string;
  description?: string;
  url?: string;
  coverImage?: string; // optional project cover
  tags?: string[]; // optional tags for categorization
  category?: string; // project category
}

export interface UpdateProjectDTO extends Partial<CreateProjectDTO> {
  id: string; // required for updates
}
