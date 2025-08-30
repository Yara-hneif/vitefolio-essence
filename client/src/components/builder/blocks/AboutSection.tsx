import React from "react";

type Props = {
  html?: string;
};

export default function AboutSection({ html }: Props) {
  const defaultContent = `
    <div class="prose prose-lg max-w-none">
      <h2 class="text-3xl font-bold mb-6">About Me</h2>
      <p class="text-lg text-gray-600 mb-4">
        I'm a passionate full-stack developer with over 5 years of experience creating 
        beautiful and functional web applications. I specialize in React, Node.js, and 
        modern web technologies.
      </p>
      <p class="text-lg text-gray-600 mb-4">
        When I'm not coding, you can find me exploring new technologies, contributing to 
        open source projects, or sharing knowledge with the developer community.
      </p>
    </div>
  `;

  return (
    <section className="w-full py-16 bg-muted/30">
      <div className="max-w-4xl mx-auto px-4">
        <div 
          dangerouslySetInnerHTML={{ 
            __html: html || defaultContent 
          }} 
        />
      </div>
    </section>
  );
}