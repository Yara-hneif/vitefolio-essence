import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

type Props = {
  mobile?: boolean;
  onItemClick?: () => void;
  /** اختياري: لفرض البادئة يدويًا بدل الكشف من المسار */
  prefix?: "/demo" | "";
};

export default function MainNav({ mobile, onItemClick, prefix }: Props) {
  const { pathname } = useLocation();

  const inDemo = prefix ? prefix === "/demo" : pathname.startsWith("/demo");

  const p = (s = "") => {
    if (inDemo) return `/demo${s}`;
    return s === "" ? "/" : s;
  };

  const LINKS = [
    { text: "Home", href: p("/") },
    { text: "Projects", href: p("/projects") },
    { text: "About", href: p("/about") },
    { text: "Contact", href: p("/contact") },
  ];

  return (
    <nav className={mobile ? "flex flex-col gap-4" : "flex items-center gap-4"}>
      {LINKS.map((link) => (
        <NavLink
          key={link.text}
          to={link.href}
          onClick={onItemClick}
          end={link.text === "Home"}
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
