
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Code, Heart, Sparkles, Star } from "lucide-react";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";

const Home = () => {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-8 relative z-10">
            <div className="relative">
              <Sparkles className="absolute -left-8 -top-8 text-primary h-8 w-8 animate-pulse" />
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight max-w-3xl leading-tight">
                Creating <span className="text-primary italic">Beautiful</span> Digital Experiences
              </h1>
              <Sparkles className="absolute -right-8 -bottom-2 text-primary h-8 w-8 animate-pulse" />
            </div>
            
            <p className="text-xl text-muted-foreground max-w-2xl">
              I'm a passionate developer with an eye for design, transforming ideas into elegant and functional solutions.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Button asChild size="lg" className="rounded-full glass hover-glow">
                <Link to="/projects" className="flex items-center gap-2">
                  View My Work <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full neu-element">
                <Link to="/contact" className="flex items-center gap-2">
                  Get in Touch <Heart className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-1/4 -left-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-24 w-64 h-64 bg-accent/10 rounded-full blur-3xl"></div>
      </section>

      {/* Featured Projects Section */}
      <section className="section-padding relative">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center mb-16">
            <div className="inline-flex items-center justify-center p-1 mb-4 rounded-full bg-primary/10 text-primary">
              <Code className="h-5 w-5 mr-2" />
              <span className="text-sm font-medium">Latest Projects</span>
            </div>
            <h2 className="text-3xl font-bold mb-4">Featured Work</h2>
            <p className="text-muted-foreground max-w-2xl">
              A curated selection of my most recent and noteworthy projects.
            </p>
          </div>

          <Carousel className="w-full max-w-5xl mx-auto" opts={{ align: "center" }}>
            <CarouselContent>
              {[1, 2, 3].map((item) => (
                <CarouselItem key={item} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-2 h-full">
                    <div className="card-3d h-full rounded-xl border overflow-hidden">
                      <div className="card-3d-content h-full">
                        <div className="aspect-video bg-muted relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-accent/30"></div>
                        </div>
                        <div className="p-6 bg-card">
                          <h3 className="text-xl font-bold mb-2">Project {item}</h3>
                          <p className="text-muted-foreground mb-4 text-sm">
                            A brief description of this beautiful project and the technologies used.
                          </p>
                          <Button asChild variant="outline" size="sm" className="flex gap-2 rounded-full">
                            <Link to={`/projects/${item}`}>Explore Details</Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>

          <div className="mt-12 flex justify-center">
            <Button asChild variant="outline" className="rounded-full neu-element">
              <Link to="/projects" className="flex items-center gap-2">
                View All Projects <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="section-padding relative overflow-hidden">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1">
              <div className="inline-flex items-center justify-center p-1 mb-4 rounded-full bg-primary/10 text-primary">
                <Star className="h-5 w-5 mr-2" />
                <span className="text-sm font-medium">About Me</span>
              </div>
              <h2 className="text-3xl font-bold mb-4">Passionate Creator</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  I'm a detail-oriented developer with a passion for creating beautiful, user-centric digital experiences that solve real problems.
                </p>
                <p>
                  My approach combines technical precision with creative thinking, allowing me to build solutions that are both functional and aesthetically pleasing.
                </p>
                <p>
                  When I'm not coding, you might find me exploring design trends, experimenting with new technologies, or finding inspiration in art and nature.
                </p>
              </div>
              <Button asChild className="mt-6 rounded-full glass hover-glow">
                <Link to="/about">Learn More About Me</Link>
              </Button>
            </div>
            <div className="order-1 md:order-2">
              <div className="relative mx-auto">
                <div className="rounded-full overflow-hidden border-4 border-white shadow-xl w-64 h-64 md:w-80 md:h-80 mx-auto neu-element">
                  <div className="w-full h-full bg-gradient-to-br from-primary/30 to-accent/30"></div>
                </div>
                <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-accent/20 rounded-full blur-2xl"></div>
                <div className="absolute -top-6 -left-6 w-40 h-40 bg-primary/20 rounded-full blur-2xl"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-1/2 left-0 w-full h-[20%] bg-muted -skew-y-3 -z-10 transform-gpu"></div>
      </section>

      {/* Contact CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent opacity-90"></div>
        <div className="container px-4 md:px-6 text-center relative z-10">
          <div className="glass p-8 md:p-12 rounded-2xl max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4 text-white">Let's Create Something Amazing</h2>
            <p className="max-w-2xl mx-auto mb-8 text-white/90">
              Have a project in mind or want to know more about my work? I'd love to hear from you and discuss how we can collaborate.
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

export default Home;
