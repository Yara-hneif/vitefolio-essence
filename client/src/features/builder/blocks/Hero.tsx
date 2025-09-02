import React from "react";

type Props = { 
  title?: string; 
  subtitle?: string; 
  ctaLabel?: string; 
  ctaHref?: string; 
};

export default function Hero({ 
  title = "Creating Beautiful Digital Experiences", 
  subtitle = "I'm a passionate developer building modern web applications", 
  ctaLabel = "View My Work", 
  ctaHref = "#projects" 
}: Props) {
  return (
    <section className="w-full py-16 md:py-24 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground mb-6">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
        {ctaLabel && (
          <a 
            href={ctaHref || "#"} 
            className="inline-block mt-8 px-8 py-4 bg-primary text-primary-foreground rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
          >
            {ctaLabel}
          </a>
        )}
      </div>
    </section>
  );
}