import { Link, NavLink } from "react-router-dom";

const navItem = "block px-3 py-2 text-white hover:text-yellow-300 text-lg";

export default function Header() {
  return (
    <header className="bg-gray-900 text-white shadow w-full">
      <nav className="max-w-screen-xl mx-auto flex flex-wrap items-center justify-between px-4 py-3">
        <Link to="/" className="text-2xl font-bold flex items-center gap-2">
          🧠 <span className="text-purple-300">MyPortfolio</span>
        </Link>

        <div className="flex flex-wrap gap-2 sm:gap-4 mt-2 sm:mt-0">
          <NavLink to="/" className={navItem}>
            Home
          </NavLink>
          <NavLink to="/projects" className={navItem}>
            Projects
          </NavLink>
          <NavLink to="/contact" className={navItem}>
            Contact
          </NavLink>
          <NavLink to="/admin" className={navItem}>
            Admin
          </NavLink>
        </div>
      </nav>
    </header>
  );
}
