import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  category: string;
  tags?: string[];
  image_url: string;
  slug: string;
  repo_url: string;
  live_url: string;
}

export const ProjectCard = ({
  id,
  title,
  description,
  category,
  tags = [],
  image_url,
  slug,
  repo_url,
  live_url,
}: ProjectCardProps) => {
  return (
    <Card
      key={id}
      className="group card-3d border overflow-hidden rounded-xl h-full transition-all hover:scale-[1.015] hover:shadow-2xl hover:border-primary/40 bg-white/90 dark:bg-background/90"
    >
      <div className="card-3d-content h-full flex flex-col">
        <div className="aspect-video relative overflow-hidden">
          <div className="absolute inset-0 shimmer z-0 rounded-b-xl" />
          <img
            src={image_url}
            alt={title}
            className="relative z-10 object-contain w-full h-full p-6 group-hover:animate-float"
          />
        </div>
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300">
              {title}
            </CardTitle>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
              {category}
            </span>
          </div>
          <CardDescription className="line-clamp-2 text-muted-foreground">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2 mt-auto">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="rounded-full hover-lift w-full"
          >
            <Link
              to={`/projects/${slug}`}
              className="flex items-center justify-center gap-2"
            >
              View Details <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <div className="flex justify-between w-full text-xs text-muted-foreground">
            <a
              href={live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              🔗 Live Demo
            </a>
            <a
              href={repo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              💻 Source Code
            </a>
          </div>
        </CardFooter>
      </div>
    </Card>
  );
};
