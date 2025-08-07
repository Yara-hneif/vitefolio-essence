import { useParams } from "react-router-dom";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useProject } from "@/hooks/useProject";

const ProjectDetails = () => {
  const { slug } = useParams();
  if (!slug) {
    return <p className="text-center mt-10 text-red-500">Invalid project slug.</p>;
  }

  const { data: project, isLoading, isError } = useProject(slug);
  if (isLoading) return <p className="text-center mt-10">Loading project...</p>;
  if (isError || !project) return <p className="text-center mt-10 text-red-500">Project not found.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 animate-fade-in">
      <div className="mb-4">
        <Button variant="outline" asChild>
          <Link to="/projects" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Projects
          </Link>
        </Button>
      </div>

      <div className="rounded-lg shadow border relative aspect-video bg-gradient-to-br from-primary/10 to-accent/10 p-4 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 shimmer rounded-xl z-0" />
          <img
          src={project.image_url || "/default-img.png"}
          alt={project.title}
          className="w-full object-cover max-h-96"
          />
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
          <p className="text-muted-foreground mb-4">{project.description}</p>

          <div className="flex flex-wrap gap-2 mb-4">
            {Array.isArray(project.tags) && project.tags.length > 0 ? (
              project.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="bg-secondary text-secondary-foreground text-xs px-2 py-0.5 rounded-full"
                >
                  #{tag}
                </span>
              ))
            ) : (
              <span className="text-sm text-muted-foreground">No tags available</span>
            )}

          </div>

          <div className="flex gap-4">
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline text-sm inline-flex items-center gap-1"
            >
              <ExternalLink className="h-4 w-4" /> Live Demo
            </a>
            <a
              href={project.repo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:underline text-sm inline-flex items-center gap-1"
            >
              <Github className="h-4 w-4" /> Source Code
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
