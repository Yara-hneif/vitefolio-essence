import { AlignCenter } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export default function LandingNav({
  mobile,
  onItemClick,
  onContactClick, 
}: {
  mobile?: boolean;
  onItemClick?: () => void;
  onContactClick?: () => void; 
}) {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const scrollToId = (id: string, offset = 80) => {
    const el = document.getElementById(id);
    if (!el) return false;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
    return true;
  };

  const go = (id: "features" | "templates" | "pricing") => {
    if (pathname !== "/") {
      navigate({ pathname: "/", hash: `#${id}` });
    } else {
      const ok = scrollToId(id);
      if (!ok) window.location.hash = `#${id}`;
    }
    onItemClick?.();
  };

  const baseClass = mobile
    ? "flex flex-col gap-4 items-start"
    : "flex items-center gap-4";

  return (
    <nav className={baseClass }>
      <button onClick={() => go("features")} className="hover:text-primary text-left">
        Features
      </button>
      <button onClick={() => go("templates")} className="hover:text-primary text-left">
        Templates
      </button>
      <button onClick={() => go("pricing")} className="hover:text-primary text-left">
        Pricing
      </button>
      <button
        onClick={onContactClick} 
        className="text-sm font-medium hover:text-primary text-left"
      >
        Contact
      </button>
    </nav>
  );
}
