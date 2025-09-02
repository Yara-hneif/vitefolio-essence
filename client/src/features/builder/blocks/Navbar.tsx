import React from "react";

type Props = { 
  logoText?: string;
};

export default function Navbar({ logoText = "Portfolio" }: Props) {
  return (
    <nav className="w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <h2 className="text-2xl font-bold text-primary">{logoText}</h2>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <a href="#home" className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
                Home
              </a>
              <a href="#about" className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
                About
              </a>
              <a href="#projects" className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
                Projects
              </a>
              <a href="#contact" className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
                Contact
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}