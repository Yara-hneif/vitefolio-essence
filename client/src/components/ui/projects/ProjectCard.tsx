import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/data-display/card";
import { Badge } from "@/components/ui/data-display/badge";
import { Button } from "@/components/ui/navigation/button";
import Carousel from "@/components/ui/data-display/carousel";

import {
  Github,
  ExternalLink,
  Eye,
  Edit,
  Trash2,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Project } from "@/types/models/Project";

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
  const cover =
    project.cover_image && project.cover_image.trim() !== ""
      ? project.cover_image
      : "/placeholder.svg";

  return (
    <Card className={cn("hover-lift overflow-hidden", className)}>
      {/* صورة الغلاف */}
      <div className="aspect-video relative overflow-hidden">
        <img
          src={cover}
          alt={project.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

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
              <Badge key={tag.id} variant="outline">
                #{tag.name}
              </Badge>
            ))}
          </div>
        )}

        {/* Meta Info */}
        {project.updated_at && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              Updated {new Date(project.updated_at).toLocaleDateString()}
            </span>
          </div>
        )}

        {/* Carousel */}
        {project.gallery && project.gallery.length > 0 && (
          <Carousel images={project.gallery} className="mt-4" />
        )}

        {/* Links */}
        <div className="flex items-center gap-2">
          {project.repo_url && (
            <Button variant="outline" size="sm" asChild>
              <a
                href={project.repo_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-4 w-4 mr-1" />
                Code
              </a>
            </Button>
          )}
          {project.live_url && (
            <Button variant="outline" size="sm" asChild>
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                Live
              </a>
            </Button>
          )}
        </div>

        {/* Actions */}
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
