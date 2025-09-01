import { Link, useLocation } from "react-router-dom";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  const { pathname } = useLocation();
  const isLanding = pathname === "/";
  const year = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-6 py-10">
        {/* Top grid */}
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand / Intro */}
          <div className="md:col-span-1">
            <div className="text-xl font-extrabold">Vitefolio</div>
            <p className="mt-2 text-sm text-muted-foreground">
              {isLanding
                ? "Build and share a beautiful portfolio in minutes."
                : "Creating beautiful digital experiences with a focus on design and functionality."}
            </p>
          </div>

          {/* Column 2 */}
          <div>
            <div className="text-sm font-semibold">
              {isLanding ? "Product" : "Quick Links"}
            </div>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {isLanding ? (
                <>
                  <li><a href="/#features">Features</a></li>
                  <li><a href="/#templates">Templates</a></li>
                  <li><a href="/#how-it-works">How it works</a></li>
                  <li><a href="/#faq">FAQ</a></li>
                </>
              ) : (
                <>
                  <li><Link to="/">Home</Link></li>
                  <li><Link to="/projects">Projects</Link></li>
                  <li><Link to="/about">About</Link></li>
                  <li><Link to="/contact">Contact</Link></li>
                </>
              )}
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <div className="text-sm font-semibold">{isLanding ? "Company" : "Contact"}</div>
            {isLanding ? (
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li><Link to="/contact">Contact</Link></li>
                <li>
                  <a href="#" onClick={(e) => e.preventDefault()}>
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" onClick={(e) => e.preventDefault()}>
                    Privacy
                  </a>
                </li>
              </ul>
            ) : (
              <div className="mt-3 space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  <a href="mailto:contact@example.com">contact@example.com</a>
                </div>
                <div>San Francisco, CA</div>
              </div>
            )}
          </div>

          {/* Column 4 (Socials) */}
          <div>
            <div className="text-sm font-semibold">Follow</div>
            <div className="mt-3 flex gap-4 text-muted-foreground">
              <a
                href="https://github.com/Yara-hneif"
                aria-label="GitHub"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
                onClick={(e) => e.preventDefault()}
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/yara-hneif"
                aria-label="LinkedIn"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-8 flex flex-col-reverse items-center justify-between gap-3 border-t pt-6 text-xs text-muted-foreground md:flex-row">
          <span>© {year} Vitefolio. All rights reserved.</span>
          <span>Made with ❤️ and TypeScript</span>
        </div>
      </div>
    </footer>
  );
}
