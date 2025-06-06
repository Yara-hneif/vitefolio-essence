import React from "react";
import { Link, NavLink } from "react-router-dom";
import MobileMenu from "./MobileMenu";

interface NavItem {
  name: string;
  path: string;
}

const navLinks: NavItem[] = [
  { name: "Home", path: "/" },
  { name: "Projects", path: "/projects" },
  { name: "Contact", path: "/contact" },
  { name: "Admin", path: "/admin" },
];
export default function Header(): React.JSX.Element {
  return (
    <header className="bg-gray-900 shadow sticky top-0 z-50">
      <nav className="max-w-screen-xl mx-auto flex items-center justify-between px-4 py-4">
        <Link
          to="/"
          className="text-2xl sm:text-3xl font-bold flex items-center gap-2 text-purple-300"
        >
          🧠 <span>MyPortfolio</span> 
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden sm:flex gap-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className="px-4 py-2 rounded text-lg font-medium text-white hover:text-yellow-300 transition"
            >
              {link.name}
            </NavLink>
          ))}
        </div>
        
        {/* Mobile Menu Button */}
        <MobileMenu />
      </nav>
    </header>
  );
}
