import React from "react";

type Props = {
  copyright?: string;
};

export default function Footer({ copyright }: Props) {
  const currentYear = new Date().getFullYear();
  const defaultCopyright = `© ${currentYear} Portfolio. All rights reserved.`;

  return (
    <footer className="w-full py-12 bg-muted border-t">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-muted-foreground">
              {copyright || defaultCopyright}
            </p>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              GitHub
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              LinkedIn
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Twitter
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}