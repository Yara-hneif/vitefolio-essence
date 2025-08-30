import React from "react";

type Props = {
  label?: string;
  href?: string;
  variant?: "primary" | "secondary";
};

export default function Button({ 
  label = "Get in Touch", 
  href = "/contact", 
  variant = "primary" 
}: Props) {
  const baseClasses = "inline-block px-6 py-3 rounded-xl font-semibold transition-all duration-300";
  const variantClasses = variant === "primary" 
    ? "bg-primary text-primary-foreground shadow-lg hover:shadow-xl" 
    : "bg-secondary text-secondary-foreground border hover:bg-secondary/80";

  return (
    <div className="w-full py-8 text-center">
      <a 
        href={href}
        className={`${baseClasses} ${variantClasses}`}
      >
        {label}
      </a>
    </div>
  );
}