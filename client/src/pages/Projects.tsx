import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowRight, Code, Filter } from "lucide-react";
import { useState } from "react";
import { useProjects } from "@/hooks/useProjects";

type Project = {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  image_url: string;
  slug: string;
  repo_url: string;
  live_url: string;
  status: "draft" | "published";
  created_at: string;
};

const Projects = () => {
  const {
    data: projects = [],
    isLoading,
    isError,
  } = useProjects(); // fetch projects
  const [activeFilter, setActiveFilter] = useState<string>("All");

  const categories: string[] = [
    "All",
    ...Array.from(new Set(projects.map((p: Project) => p.category))) as string[],
  ];

  const filteredProjects =
    activeFilter === "All"
      ? projects
      : projects.filter((p: Project) => p.category === activeFilter);

  return (
    <div className="animate-fade-in">
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 opacity-60"></div>
        <div className="container px-4 md:px-6 relative z-10 text-center">
          <div className="inline-flex items-center justify-center p-1 mb-4 rounded-full bg-primary/10 text-primary">
            <Code className="h-5 w-5 mr-2" />
            <span className="text-sm font-medium">Portfolio</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">My Work</h1>
          <p className="text-xl text-muted-foreground">
            Explore my projects and see how I bring ideas to life through code
            and design.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container px-4 md:px-6">
          <div className="mb-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
              <h2 className="text-2xl font-bold">Explore Projects</h2>
              <div className="flex items-center gap-2 overflow-x-auto pb-2 max-w-full">
                <Filter className="h-4 w-4 mr-1 text-muted-foreground" />
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={
                      activeFilter === category ? "default" : "outline"
                    }
                    size="sm"
                    className={`rounded-full whitespace-nowrap ${
                      activeFilter === category ? "" : "neu-element"
                    }`}
                    onClick={() => setActiveFilter(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            {isLoading && <p>Loading projects...</p>}
            {isError && (
              <p className="text-red-500">Failed to load projects.</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project: Project) => (
              <Card
                key={project.id}
                className="card-3d border overflow-hidden rounded-xl h-full"
              >
                <div className="card-3d-content h-full flex flex-col">
                  <div className="aspect-video bg-muted relative overflow-hidden">
                    <img
                      src={project.image_url}
                      alt={project.title}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-accent/30"></div>
                  </div>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl">{project.title}</CardTitle>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        {project.category}
                      </span>
                    </div>
                    <CardDescription className="line-clamp-2">
                      {project.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
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
                        to={`/projects/${project.slug}`}
                        className="flex items-center justify-center gap-2"
                      >
                        View Details <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                    <div className="flex justify-between w-full text-xs text-muted-foreground">
                      <a
                        href={project.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        🔗 Live Demo
                      </a>
                      <a
                        href={project.repo_url}
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
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Projects;
