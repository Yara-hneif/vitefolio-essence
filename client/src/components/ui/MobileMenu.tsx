// components/MobileMenu.tsx
import React from "react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";

interface NavLinkItem {
  name: string;
  path: string;
}

const navLinks: NavLinkItem[] = [
  { name: "Home", path: "/" },
  { name: "Projects", path: "/projects" },
  { name: "Contact", path: "/contact" },
  { name: "Admin", path: "/admin" },
];

const MobileMenu = (): React.ReactElement => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className="sm:hidden">
      <button
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
        className="text-white focus:outline-none"
      >
        {open ? <X size={28} /> : <Menu size={28} />}
      </button>

      {open && (
        <div className="absolute top-16 left-0 w-full bg-gray-900 shadow-lg z-40">
          <nav className="flex flex-col items-start px-4 py-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className="block px-4 py-2 text-lg text-white hover:text-yellow-300 transition"
                onClick={() => setOpen(false)}
              >
                {link.name}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}

export default MobileMenu;
