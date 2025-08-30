import React from "react";

type ProjectItem = {
  title: string;
  subtitle: string;
  href: string;
  imageUrl: string;
};

type Props = {
  items?: ProjectItem[];
};

export default function ProjectsGrid({ items = [] }: Props) {
  const defaultItems: ProjectItem[] = [
    {
      title: "E-commerce Platform",
      subtitle: "Modern shopping experience with React and Node.js",
      href: "#project1",
      imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop"
    },
    {
      title: "Portfolio Website",
      subtitle: "Clean and responsive design with smooth animations",
      href: "#project2", 
      imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop"
    },
    {
      title: "Task Management App",
      subtitle: "Collaborative workspace with real-time updates",
      href: "#project3",
      imageUrl: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop"
    }
  ];

  const projectItems = items.length > 0 ? items : defaultItems;

  return (
    <section className="w-full py-16 bg-background">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
          Featured Projects
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projectItems.map((item, index) => (
            <a 
              key={index}
              href={item.href}
              className="group block bg-card rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border"
            >
              <div className="aspect-video overflow-hidden">
                <img 
                  src={item.imageUrl} 
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-card-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-muted-foreground">
                  {item.subtitle}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}