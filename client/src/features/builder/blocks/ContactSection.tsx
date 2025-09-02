import React from "react";

type Props = {
  mailto?: string;
};

export default function ContactSection({ mailto = "hello@example.com" }: Props) {
  return (
    <section className="w-full py-16 bg-background">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
          Get In Touch
        </h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          I'm always interested in new opportunities and exciting projects. 
          Let's work together to bring your ideas to life.
        </p>
        <a 
          href={`mailto:${mailto}`}
          className="inline-block px-8 py-4 bg-primary text-primary-foreground rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
        >
          Send Message
        </a>
      </div>
    </section>
  );
}