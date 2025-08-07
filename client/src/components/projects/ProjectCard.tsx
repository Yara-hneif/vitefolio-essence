import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import CollaboratorTag from '@/components/common/CollaboratorTag';
import { Project } from '@/data/mockData';
import { 
  ExternalLink, 
  Github, 
  Calendar,
  Users,
  Eye,
  Edit
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  project: Project;
  showActions?: boolean;
  variant?: 'default' | 'minimal';
  className?: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ 
  project, 
  showActions = false, 
  variant = 'default',
  className 
}) => {
  const statusColors = {
    planning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    'in-progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
  };

  if (variant === 'minimal') {
    return (
      <Card className={cn("hover-lift", className)}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-lg">{project.title}</h3>
            <Badge className={statusColors[project.status]}>
              {project.status.replace('-', ' ')}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
          <div className="flex flex-wrap gap-1 mb-3">
            {project.technologies.slice(0, 3).map((tech) => (
              <Badge key={tech} variant="outline" className="text-xs">
                {tech}
              </Badge>
            ))}
            {project.technologies.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{project.technologies.length - 3}
              </Badge>
            )}
          </div>
          {project.collaborators.length > 0 && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Users className="h-3 w-3" />
              <span>{project.collaborators.length} collaborator{project.collaborators.length !== 1 ? 's' : ''}</span>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("hover-lift overflow-hidden", className)}>
      {/* Project Image */}
      {project.image && (
        <div className="aspect-video relative overflow-hidden">
          <img 
            src={project.image} 
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
      )}

      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl">{project.title}</CardTitle>
            <CardDescription className="mt-2">{project.description}</CardDescription>
          </div>
          <Badge className={statusColors[project.status]}>
            {project.status.replace('-', ' ')}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Technologies */}
        <div className="flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <Badge key={tech} variant="outline">
              {tech}
            </Badge>
          ))}
        </div>

        {/* Collaborators */}
        {project.collaborators.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
              <Users className="h-4 w-4" />
              Collaborators
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.collaborators.map((collaborator) => (
                <CollaboratorTag 
                  key={collaborator.id} 
                  collaborator={collaborator} 
                  variant="minimal"
                />
              ))}
            </div>
          </div>
        )}

        {/* Meta Info */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>Updated {new Date(project.updatedAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            {project.githubUrl && (
              <Button variant="outline" size="sm" asChild>
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4 mr-1" />
                  Code
                </a>
              </Button>
            )}
            {project.liveUrl && (
              <Button variant="outline" size="sm" asChild>
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Live
                </a>
              </Button>
            )}
          </div>

          {showActions && (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link to={`/dashboard/projects/${project.id}`}>
                  <Eye className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link to={`/dashboard/projects/${project.id}/edit`}>
                  <Edit className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;