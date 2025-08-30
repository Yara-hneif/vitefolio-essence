import { Link } from "react-router-dom";
import { Github, Twitter, Linkedin } from "lucide-react";

export default function MarketingFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="text-xl font-extrabold">Vitefolio</div>
            <p className="mt-2 text-sm text-muted-foreground">
              Build and share a beautiful portfolio in minutes.
            </p>
          </div>

          <div>
            <div className="text-sm font-semibold">Product</div>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><a href="#features">Features</a></li>
              <li><a href="#templates">Templates</a></li>
              <li><a href="#how-it-works">How it works</a></li>
              <li><a href="#faq">FAQ</a></li>
            </ul>
          </div>

          <div>
            <div className="text-sm font-semibold">Company</div>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link to="/contact">Contact</Link></li>
              <li><a href="#" onClick={(e)=>e.preventDefault()}>Terms</a></li>
              <li><a href="#" onClick={(e)=>e.preventDefault()}>Privacy</a></li>
            </ul>
          </div>

          <div>
            <div className="text-sm font-semibold">Follow</div>
            <div className="mt-3 flex gap-3 text-muted-foreground">
              <a href="#" aria-label="GitHub" onClick={(e)=>e.preventDefault()}><Github className="h-5 w-5" /></a>
              <a href="#" aria-label="Twitter" onClick={(e)=>e.preventDefault()}><Twitter className="h-5 w-5" /></a>
              <a href="#" aria-label="LinkedIn" onClick={(e)=>e.preventDefault()}><Linkedin className="h-5 w-5" /></a>
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between border-t pt-6 text-xs text-muted-foreground">
          <span>© {year} Vitefolio. All rights reserved.</span>
          <span>Made with ❤️ and TypeScript</span>
        </div>
      </div>
    </footer>
  );
}
