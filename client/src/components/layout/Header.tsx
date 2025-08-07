import { useState } from "react";
import { Link } from "react-router-dom";
import { LogOut, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import Navigation from "./Navigation";
import UserAvatar from "../common/UserAvatar";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="sticky top-0 w-full z-50">
      <div className="glass border-b backdrop-blur-lg">
        <div className="container flex items-center justify-between h-16 px-4 md:px-6">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold font-['Playfair_Display']">Portfolio</span>
          </Link>
          
          {/* Mobile menu button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden rounded-full" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="sr-only">Toggle menu</span>
          </Button>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Navigation mobile={false} />
            
            {/* Auth Section */}
            <div className="flex items-center gap-4">
              {isAuthenticated && user ? (
                <>
                  <Link to="/dashboard" className="hidden md:block">
                    <Button variant="ghost" size="sm">Dashboard</Button>
                  </Link>
                  <Link to={`/u/${user.username}`} className="hidden md:flex items-center gap-2">
                    <UserAvatar user={user} size="sm" />
                    <span className="text-sm font-medium">{user.name}</span>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={logout} className="hidden md:flex">
                    <LogOut className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/login">Sign In</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link to="/register">Sign Up</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile navigation */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden animate-fade-in">
          <div className="fixed inset-y-0 right-0 w-full max-w-sm glass border-l p-6 animate-slide-in-right">
            <div className="flex items-center justify-between mb-8">
              <Link to="/" className="flex items-center space-x-2" onClick={() => setIsMenuOpen(false)}>
                <span className="text-xl font-bold font-['Playfair_Display']">Portfolio</span>
              </Link>
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full" 
                onClick={() => setIsMenuOpen(false)}
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Close menu</span>
              </Button>
            </div>
            <Navigation mobile={true} onItemClick={() => setIsMenuOpen(false)} />
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

