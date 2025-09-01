import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import UserAvatar from "@/components/common/UserAvatar";
import MainNav from "../Navigation/MainNav";
import LandingNav from "../Navigation/LandingNav";

export default function Header({
  onContactClick,
}: {
  onContactClick?: () => void;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  const isLanding = location.pathname === "/";

  return (
    <header className="sticky top-0 w-full z-50">
      <div className="glass border-b backdrop-blur-lg">
        <div className="container flex items-center justify-between h-16 px-4 md:px-6">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Vitefolio
            </span>
          </Link>

          {/* Mobile toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden rounded-full"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="sr-only">Toggle menu</span>
          </Button>

          {/* Desktop Nav */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {isLanding ? <LandingNav mobile={false} onContactClick={onContactClick} /> : <MainNav mobile={false} />}

            <div className="flex items-center gap-4">
              {isAuthenticated && user ? (
                <>
                  <Link to="/dashboard">
                    <Button variant="ghost" size="sm">Dashboard</Button>
                  </Link>
                  <Link to={`/profile/${user.username ?? "user"}`} className="flex items-center gap-2">
                    <UserAvatar
                      user={{
                        name: user.name ?? user.username ?? "User",
                        username: user.username ?? "user",
                        avatar: user.avatar,
                      }}
                      size="sm"
                    />
                    <span className="text-sm font-medium hidden lg:inline">
                      {user.name ?? user.username ?? "User"}
                    </span>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden sm:inline">Logout</span>
                  </Button>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/login">Login</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link to="/register">Register</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden animate-fade-in">
          <div className="fixed inset-y-0 right-0 w-full max-w-sm glass border-l p-6 animate-slide-in-right">
            {/* Mobile Navigationbar */}
            <div className="flex items-center justify-between mb-8">
              <Link to="/" className="flex items-center space-x-2" onClick={() => setIsMenuOpen(false)}>
                <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Vitefolio
                </span>
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

            {/* Mobile Navigation Links */}
            {isLanding ? (
              <LandingNav
                mobile
                onItemClick={() => setIsMenuOpen(false)}
                onContactClick={() => {
                  onContactClick?.();          
                  setIsMenuOpen(false);
                }}
              />
            ) : (
              <MainNav mobile onItemClick={() => setIsMenuOpen(false)} />
            )}

            <div className="mt-6 flex flex-col gap-3">
              {isAuthenticated && user ? (
                <>
                  <Link
                    to={`/profile/${user.username ?? "user"}`}
                    className="flex items-center gap-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <UserAvatar
                      user={{
                        name: user.name ?? user.username ?? "User",
                        username: user.username ?? "user",
                        avatar: user.avatar,
                      }}
                      size="sm"
                    />
                    <span>{user.name ?? user.username ?? "User"}</span>
                  </Link>
                  <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full">Dashboard</Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full">Login</Button>
                  </Link>
                  <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full" variant="outline">
                      Register
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
