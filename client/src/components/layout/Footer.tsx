
import { Link } from "react-router-dom";
import { Github, Linkedin, Mail, Twitter } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="relative z-10">
      <div className="glass border-t">
        <div className="container px-4 md:px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-medium mb-4 font-['Playfair_Display']">Portfolio</h3>
              <p className="text-muted-foreground">
                Creating beautiful digital experiences with a focus on design and functionality.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/projects" className="text-muted-foreground hover:text-primary transition-colors">
                    Projects
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Contact</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  contact@example.com
                </li>
                <li>San Francisco, CA</li>
              </ul>
              <div className="flex space-x-4 mt-4">
                <a 
                  href="https://github.com/Yara-hneif" 
                  aria-label="Github"
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  >
                  <Github className="h-5 w-5" />
                </a>
                
                <a 
                  href="#" 
                  aria-label="Twitter" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  >
                  <Twitter className="h-5 w-5" />
                </a>
                
                <a 
                  href="https://www.linkedin.com/in/yara-hneif" 
                  aria-label="LinkedIn" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  >
                  <Linkedin className="h-5 w-5" />
                </a>
              
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-6 border-t border-border/40 text-center text-muted-foreground">
            <p>&copy; {currentYear} Portfolio. Designed with <span className="text-primary">♥</span></p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
