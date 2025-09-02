
import { Button } from "@/components/ui/navigation/button";
import { Link } from "react-router-dom";
import { Home, Search } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="relative z-10">
        <div className="text-center px-4 glass rounded-2xl p-12 max-w-lg">
          <div className="relative mb-8 mx-auto w-32 h-32">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-xl"></div>
            <div className="relative flex items-center justify-center w-full h-full">
              <h1 className="text-7xl font-bold text-primary">404</h1>
            </div>
          </div>
          <h2 className="text-3xl font-semibold mb-6">Page Not Found</h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-8">
            The page you are looking for might have been removed, had its name changed,
            or is temporarily unavailable.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="rounded-full glass hover-glow">
              <Link to="/" className="flex items-center gap-2">
                <Home className="h-4 w-4" /> Return Home
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full neu-element">
              <Link to="/contact" className="flex items-center gap-2">
                <Search className="h-4 w-4" /> Help Me Find
              </Link>
            </Button>
          </div>
        </div>
      </div>
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent/10 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default NotFound;
