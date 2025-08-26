
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NavigationProps {
  mobile: boolean;
  onItemClick?: () => void;
}

const Navigation = ({ mobile, onItemClick }: NavigationProps) => {
  const location = useLocation();
  
  const links = [
    { text: "Home", href: "/" },
    { text: "Projects", href: "/projects" },
    { text: "About", href: "/about" },
    { text: "Contact", href: "/contact" },
  ] as const;

  // Check if the current path is active
  const isActivePath = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname === href || location.pathname.startsWith(href + "/");
  };

return (
    <nav
      className={cn(
        "flex",
        mobile ? "flex-col space-y-6" : "items-center space-x-1"
      )}
    >
      {links.map((link) => {
        const isActive = isActivePath(link.href);

        return (
          <Link
            key={link.href}
            to={link.href}
            className={cn(
              "relative px-3 py-2 transition-all duration-300",
              mobile ? "text-lg" : "text-sm font-medium",
              isActive
                ? "text-primary"
                : "text-foreground/70 hover:text-foreground"
            )}
            onClick={onItemClick}
          >
            {link.text}
            {isActive && (
              <span
                className={cn(
                  "absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full",
                  mobile ? "bottom-[-4px]" : ""
                )}
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
};

export default Navigation;
