import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const LINKS = [
  { text: "Home", href: "/demo" },
  { text: "Projects", href: "/projects" },
  { text: "About", href: "/about" },
  { text: "Contact", href: "/contact" },
];

export default function MainNav({ mobile, onItemClick }: { mobile?: boolean; onItemClick?: () => void }) {
  return (
    <nav className={mobile ? "flex flex-col gap-4" : "flex items-center gap-4"}>
      {LINKS.map((link) => (
        <NavLink
          key={link.href}
          to={link.href}
          onClick={onItemClick}
          className={({ isActive }) =>
            cn(
              "relative px-3 py-2 text-sm font-medium transition-colors",
              isActive ? "text-primary" : "text-foreground/70 hover:text-foreground"
            )
          }
        >
          {link.text}
        </NavLink>
      ))}
    </nav>
  );
}
