
import { Button } from "@/components/ui/navigation/button";
import { Link } from "react-router-dom";
import { Heart, User, Star, Code, Sparkles, ArrowRight, Laptop } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/overlay/hover-card";

const About = () => {
  // Skills data
  const skills = [
    { 
      category: "Frontend", 
      items: ["HTML/CSS", "JavaScript", "React", "Vue.js", "Tailwind CSS"],
      color: "from-primary/20 to-primary/10",
      icon: <Code className="h-5 w-5" />
    },
    { 
      category: "Backend", 
      items: ["Node.js", "Express", "Python", "Django", "PHP"],
      color: "from-accent/20 to-accent/10",
      icon: <Laptop className="h-5 w-5" />
    },
    { 
      category: "Database", 
      items: ["MongoDB", "MySQL", "PostgreSQL", "Firebase"],
      color: "from-secondary/30 to-secondary/10",
      icon: <Star className="h-5 w-5" />
    },
    { 
      category: "Tools", 
      items: ["Git", "Docker", "AWS", "Figma", "VS Code"],
      color: "from-[#FFC6A1]/30 to-[#FFC6A1]/10",
      icon: <Sparkles className="h-5 w-5" />
    },
  ];

  // Timeline data
  const timeline = [
    {
      year: "2023",
      title: "Senior Developer",
      company: "Tech Solutions Inc.",
      description: "Leading a team of developers to build scalable web applications.",
    },
    {
      year: "2021",
      title: "Full Stack Developer",
      company: "Digital Innovations",
      description: "Developed and maintained various client projects using modern web technologies.",
    },
    {
      year: "2019",
      title: "Frontend Developer",
      company: "Creative Agency",
      description: "Created responsive and interactive user interfaces for client websites.",
    },
    {
      year: "2017",
      title: "Web Design Intern",
      company: "StartUp Hub",
      description: "Assisted in designing and implementing website layouts and features.",
    },
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 opacity-60"></div>
        <div className="container px-4 md:px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center p-1 mb-4 rounded-full bg-primary/10 text-primary">
              <User className="h-5 w-5 mr-2" />
              <span className="text-sm font-medium">About Me</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">My Journey</h1>
            <p className="text-xl text-muted-foreground">
              Get to know more about my background, skills, and experience.
            </p>
          </div>
        </div>
        <div className="absolute top-0 right-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-accent/10 rounded-full blur-3xl"></div>
      </section>

      {/* Bio Section */}
      <section className="section-padding relative overflow-hidden">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="rounded-2xl overflow-hidden border-4 border-white shadow-xl max-w-md mx-auto neu-element aspect-square relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-accent/20"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="h-16 w-16 text-white/80" />
                </div>
              </div>
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-primary/20 rounded-full blur-xl"></div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-accent/20 rounded-full blur-xl"></div>
            </div>
            
            <div>
              <div className="inline-flex items-center justify-center p-1 mb-4 rounded-full bg-primary/10 text-primary">
                <Heart className="h-5 w-5 mr-2" />
                <span className="text-sm font-medium">My Story</span>
              </div>
              <h2 className="text-3xl font-bold mb-6">Passionate About Code & Design</h2>
              <div className="space-y-5 text-muted-foreground">
                <p>
                  Hello! I'm a passionate web developer and designer with over 5 years of experience creating beautiful digital experiences. I specialize in building responsive, user-friendly websites and applications that combine elegant design with powerful functionality.
                </p>
                <p>
                  My journey in web development started during college when I discovered my passion for bringing creative ideas to life through code. Since then, I've been continuously learning and expanding my skills, embracing new technologies and design trends.
                </p>
                <p>
                  I believe that great websites should not only look stunning but also provide exceptional user experiences. My approach combines technical expertise with a keen eye for design details, resulting in projects that are both visually impressive and functionally robust.
                </p>
              </div>
              <Button asChild className="mt-8 rounded-full glass hover-glow">
                <Link to="/contact" className="flex items-center gap-2">
                  Let's Connect <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-muted/50"></div>
        <div className="container px-4 md:px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center p-1 mb-4 rounded-full bg-primary/10 text-primary">
              <Sparkles className="h-5 w-5 mr-2" />
              <span className="text-sm font-medium">Expertise</span>
            </div>
            <h2 className="text-3xl font-bold mb-4">My Skills</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A comprehensive overview of my technical skills and proficiencies.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {skills.map((skillGroup) => (
              <div 
                key={skillGroup.category} 
                className="glass rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${skillGroup.color} flex items-center justify-center mb-4`}>
                  {skillGroup.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4">{skillGroup.category}</h3>
                <ul className="space-y-3">
                  {skillGroup.items.map((skill) => (
                    <li key={skill} className="flex items-center">
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <div className="flex items-center cursor-pointer">
                            <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                            <span>{skill}</span>
                          </div>
                        </HoverCardTrigger>
                        <HoverCardContent className="glass">
                          <div className="text-sm">
                            <p className="font-medium">{skill}</p>
                            <p className="text-muted-foreground">Experienced in building projects with {skill}</p>
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute top-1/3 left-0 w-full h-1/3 bg-gradient-to-r from-primary/5 to-accent/5 -skew-y-3 -z-10 transform-gpu"></div>
      </section>

      {/* Experience Timeline */}
      <section className="section-padding">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center p-1 mb-4 rounded-full bg-primary/10 text-primary">
              <Star className="h-5 w-5 mr-2" />
              <span className="text-sm font-medium">Career</span>
            </div>
            <h2 className="text-3xl font-bold mb-4">Work Experience</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A timeline of my professional journey and growth as a developer.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <div className="relative border-l-2 border-primary/30 pl-8 space-y-12">
              {timeline.map((item, index) => (
                <div key={index} className="relative group">
                  <div className="absolute -left-[41px] w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                    <div className="w-5 h-5 bg-background rounded-full"></div>
                  </div>
                  
                  <div className="glass rounded-xl p-6 hover-lift">
                    <div className="text-sm font-medium text-primary mb-1">{item.year}</div>
                    <h3 className="text-xl font-semibold">{item.title}</h3>
                    <div className="text-muted-foreground mb-2">{item.company}</div>
                    <p>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent opacity-90"></div>
        <div className="container px-4 md:px-6 text-center relative z-10">
          <div className="glass p-8 md:p-12 rounded-2xl max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4 text-white">Let's Create Something Amazing</h2>
            <p className="max-w-2xl mx-auto mb-8 text-white/90">
              Interested in working together? Let's discuss your project and bring your ideas to life.
            </p>
            <Button asChild variant="secondary" size="lg" className="rounded-full neu-element">
              <Link to="/contact" className="flex items-center gap-2">
                Start a Conversation <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
