import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type MarketingHeaderProps = {
  onOpenAuth?: () => void;
  right?: React.ReactNode;
};

export default function MarketingHeader({ onOpenAuth, right }: MarketingHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const nav = useNavigate();

  const openLogin = () => (onOpenAuth ? onOpenAuth() : nav("/login"));
  const openRegister = () => (onOpenAuth ? onOpenAuth() : nav("/register"));

  return (
    <header className="sticky top-0 w-full z-50">
      <div className="glass border-b backdrop-blur-lg bg-white/70 ">
        <div className="container flex items-center justify-between h-16 px-4 md:px-6">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-3xl font-bold font-['Playfair_Display'] bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Vitefolio
            </span>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden md:flex gap-6 text-sm">
            <a href="#features">Features</a>
            <a href="#templates">Templates</a>
            <a href="#cta">Pricing</a>
          </nav>

          {/* Desktop right area */}
          <div className="hidden md:flex items-center gap-2">
            {right ?? (
              <>
                <Button variant="ghost" onClick={() => nav("/Login")}
                aria-label="Go to dashboard">Log in</Button>
                <Button onClick={() => nav("/register")}>Get started</Button>
              </>
            )}
          </div>

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
        </div>
      </div>

      {/* Mobile navigation */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden animate-fade-in">
          <div className="fixed inset-y-0 right-0 w-full max-w-sm glass border-l p-6 animate-slide-in-right">
            <div className="flex items-center justify-between mb-8">
              <Link to="/" className="flex items-center space-x-2" onClick={() => setIsMenuOpen(false)}>
                <span className="text-xl font-bold font-['Playfair_Display'] bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
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

            {/* Mobile navigation links */}
            <nav className="flex flex-col gap-6 text-sm mb-8">
              <a href="#features" onClick={() => setIsMenuOpen(false)}>Features</a>
              <a href="#templates" onClick={() => setIsMenuOpen(false)}>Templates</a>
              <a href="#cta" onClick={() => setIsMenuOpen(false)}>Pricing</a>
            </nav>

            {/* Mobile auth buttons (تستخدم onOpenAuth إن وُجد وإلا تنتقل للصفحات) */}
            <div className="flex flex-col gap-3">
              <Button
                variant="ghost"
                onClick={() => { openLogin(); setIsMenuOpen(false); }}
                className="justify-start"
              >
                Log in
              </Button>
              <Button
                onClick={() => { openRegister(); setIsMenuOpen(false); }}
                className="justify-start"
              >
                Get started
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
