import { useParams } from "react-router-dom";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useProject } from "@/hooks/useProject";
import { resolveImageUrl } from "@/lib/urls";
import placeholderImg from "@/assets/images/placeholder.svg";

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
      {/* Back Button */}
      <div className="mb-4">
        <Button variant="outline" asChild>
          <Link to="/projects" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Projects
          </Link>
        </Button>
      </div>

      {/* Card Container */}
      <div className="card-3d-content rounded-lg shadow border bg-gradient-to-br from-primary/10 to-accent/10 overflow-hidden flex flex-col md:flex-row">
        
        {/* Image */}
        <div className="relative w-full md:w-1/2 aspect-video md:aspect-auto">
          <img
            src={resolveImageUrl(project.imageUrl || "") || placeholderImg}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = placeholderImg;
            }}
            alt={project.title}
            className="object-cover w-full h-full"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 pointer-events-none"></div>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col justify-center w-full md:w-1/2">
          <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
          <p className="text-muted-foreground mb-4">{project.description}</p>

          {/* Tags */}
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

          {/* Links */}
          <div className="flex gap-4">
            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline text-sm inline-flex items-center gap-1"
              >
                <ExternalLink className="h-4 w-4" /> Live Demo
              </a>
            )}
            {project.repo_url && (
              <a
                href={project.repo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:underline text-sm inline-flex items-center gap-1"
              >
                <Github className="h-4 w-4" /> Source Code
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
