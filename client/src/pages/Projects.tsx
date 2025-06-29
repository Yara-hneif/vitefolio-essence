
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
//import { ArrowRight, Code, Filter, Search } from "lucide-react";

import { ArrowRight, Code, Filter } from "lucide-react";
import { useState } from "react";

// Mock project data
const projects = [
  {
    id: 1,
    title: "E-commerce Website",
    description: "A full-featured online store with product listings, cart functionality, and secure checkout.",
    tags: ["React", "Node.js", "MongoDB", "Stripe"],
    imageUrl: "",
    category: "Web Development",
  },
  {
    id: 2,
    title: "Weather App",
    description: "Real-time weather information app with location detection and forecast data.",
    tags: ["React", "Weather API", "Geolocation"],
    imageUrl: "",
    category: "Mobile App",
  },
  {
    id: 3,
    title: "Task Management System",
    description: "A collaborative tool for teams to manage projects, tasks, and deadlines efficiently.",
    tags: ["React", "Express", "PostgreSQL", "Socket.io"],
    imageUrl: "",
    category: "Web Development",
  },
  {
    id: 4,
    title: "Portfolio Website",
    description: "A responsive personal portfolio website to showcase projects and skills.",
    tags: ["React", "Tailwind CSS", "Framer Motion"],
    imageUrl: "",
    category: "Web Development",
  },
  {
    id: 5,
    title: "Fitness Tracker",
    description: "An application to track workouts, nutrition, and fitness progress over time.",
    tags: ["React", "Chart.js", "Firebase"],
    imageUrl: "",
    category: "Mobile App",
  },
  {
    id: 6,
    title: "Recipe Finder",
    description: "Search and discover recipes based on available ingredients and dietary preferences.",
    tags: ["React", "Food API", "Redux"],
    imageUrl: "",
    category: "Web Development",
  },
];

const Projects = () => {
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const categories = ["All", ...Array.from(new Set(projects.map(p => p.category)))];
  
  const filteredProjects = activeFilter === "All" 
    ? projects 
    : projects.filter(p => p.category === activeFilter);

  return (
    <div className="animate-fade-in">
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 opacity-60"></div>
        <div className="container px-4 md:px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center p-1 mb-4 rounded-full bg-primary/10 text-primary">
              <Code className="h-5 w-5 mr-2" />
              <span className="text-sm font-medium">Portfolio</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">My Work</h1>
            <p className="text-xl text-muted-foreground">
              Explore my projects and see how I bring ideas to life through code and design.
            </p>
          </div>
        </div>
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-accent/10 rounded-full blur-3xl"></div>
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
                    variant={activeFilter === category ? "default" : "outline"}
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="card-3d border overflow-hidden rounded-xl h-full">
                <div className="card-3d-content h-full">
                  <div className="aspect-video bg-muted relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-accent/30"></div>
                  </div>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl">{project.title}</CardTitle>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        {project.category}
                      </span>
                    </div>
                    <CardDescription className="line-clamp-2">{project.description}</CardDescription>
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
                  <CardFooter>
                    <Button asChild variant="outline" size="sm" className="rounded-full hover-lift w-full">
                      <Link to={`/projects/${project.id}`} className="flex items-center justify-center gap-2">
                        View Details <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
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
