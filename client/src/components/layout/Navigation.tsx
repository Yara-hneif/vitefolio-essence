import { NavLink, Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

type NavItem = { text: string; href: string; external?: boolean };

interface NavigationProps {
  mobile: boolean;
  onItemClick?: () => void;
  showAuthControls?: boolean;
  rightSlot?: React.ReactNode;
}

const LINKS: readonly NavItem[] = [
  { text: "Home", href: "/" },
  { text: "Projects", href: "/projects" },
  { text: "About", href: "/about" },
  { text: "Contact", href: "/contact" },
] as const;

export default function Navigation({
  mobile,
  onItemClick,
  showAuthControls = true,
  rightSlot,
}: NavigationProps) {
  const { user } = useAuth();

  const LinkEl = ({ item }: { item: NavItem }) =>
    item.external ? (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "relative px-3 py-2 transition-all duration-300 outline-none",
          mobile ? "text-lg" : "text-sm font-medium",
          "text-foreground/70 hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary/40 rounded-md"
        )}
        onClick={onItemClick}
      >
        {item.text}
      </a>
    ) : (
      <NavLink
        to={item.href}
        onClick={onItemClick}
        className={({ isActive }) =>
          cn(
            "relative px-3 py-2 transition-all duration-300 outline-none",
            mobile ? "text-lg" : "text-sm font-medium",
            isActive ? "text-primary" : "text-foreground/70 hover:text-foreground",
            "focus-visible:ring-2 focus-visible:ring-primary/40 rounded-md"
          )
        }
      >
        {({ isActive }) => (
          <>
            {item.text}
            <span
              data-active={isActive ? "true" : "false"}
              className={cn(
                "absolute left-0 w-full h-0.5 bg-primary rounded-full transition-all",
                mobile ? "bottom-[-4px]" : "bottom-0",
                "opacity-0 data-[active=true]:opacity-100"
              )}
            />
          </>
        )}
      </NavLink>
    );

  return (
    <nav
      className={cn(
        "flex",
        mobile ? "flex-col space-y-6" : "items-center space-x-1"
      )}
      aria-label="Primary"
    >
      {LINKS.map((link) => (
        <LinkEl key={link.href} item={link} />
      ))}

      {mobile && (showAuthControls || rightSlot) ? (
        <div className="h-px w-full bg-border my-2" />
      ) : null}

      {rightSlot}

      {showAuthControls && !rightSlot && (
        <>
          {!user ? (
            <div className={cn("flex items-center gap-2", mobile ? "" : "ml-2 pl-2")}>
              <Link
                to="/login"
                onClick={onItemClick}
                className={cn(
                  "px-3 py-2 text-sm font-medium rounded-md outline-none",
                  "text-foreground/80 hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary/40"
                )}
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={onItemClick}
                className={cn(
                  "px-3 py-2 text-sm font-medium rounded-md border",
                  "hover:bg-accent/40 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                )}
              >
                Register
              </Link>
            </div>
          ) : (
            <div className={cn("flex items-center gap-3", mobile ? "" : "ml-3 pl-3")}>
              {/* Avatar */}
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.username}
                  className="h-8 w-8 rounded-full border object-cover"
                />
                
              ) : (        
                <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center">
                  {user?.username?.[0]?.toUpperCase() || "U"}
                </div>
              )}


              {/* Dashboard */}
              <Link
                to="/dashboard"
                onClick={onItemClick}
                className={cn(
                  "px-3 py-2 text-sm font-medium rounded-md border",
                  "hover:bg-accent/40 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                )}
                aria-label="Go to dashboard"
              >
                Dashboard
              </Link>
            </div>
          )}
        </>
      )}
    </nav>
  );
}
