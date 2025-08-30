import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Github, ExternalLink, Eye, Edit, Trash2, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { Project } from "@/types/Project";

interface ProjectCardProps {
  project: Project;
  showActions?: boolean;
  onDelete?: (id: string) => void;
  className?: string;
}

export default function ProjectCard({
  project,
  showActions = false,
  onDelete,
  className,
}: ProjectCardProps) {
  return (
    <Card className={cn("hover-lift overflow-hidden", className)}>
      {(project.coverImage || project.imageUrl) && (
        <div className="aspect-video relative overflow-hidden">
          <img
            src={project.coverImage || project.imageUrl || "/placeholder.svg"}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
      )}

      <CardHeader>
        <CardTitle className="text-xl">
          <Link to={`/projects/${project.slug}`} className="hover:underline">
            {project.title}
          </Link>
        </CardTitle>
        {project.description && (
          <p className="text-sm text-muted-foreground mt-2">
            {project.description}
          </p>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Tags */}
        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Meta Info */}
        {project.updatedAt && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              Updated {new Date(project.updatedAt).toLocaleDateString()}
            </span>
          </div>
        )}

        {/* روابط خارجية */}
        <div className="flex items-center gap-2">
          {project.repoUrl && (
            <Button variant="outline" size="sm" asChild>
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-4 w-4 mr-1" />
                Code
              </a>
            </Button>
          )}
          {(project.liveUrl || project.url) && (
            <Button variant="outline" size="sm" asChild>
              <a
                href={project.liveUrl || project.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                Live
              </a>
            </Button>
          )}
        </div>

        {/* أزرار إدارية */}
        {showActions && (
          <div className="flex items-center gap-2 pt-2">
            <Button variant="ghost" size="sm" asChild>
              <Link to={`/projects/${project.slug}`}>
                <Eye className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link to={`/admin/projects/${project.id}/edit`}>
                <Edit className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete?.(project.id)}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
