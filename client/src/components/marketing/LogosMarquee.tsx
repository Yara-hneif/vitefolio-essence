const logos = [
  { alt: "GitHub", src: "/logos/github.svg", w: 88, h: 28 },
  { alt: "Vite", src: "/logos/vite.svg", w: 72, h: 28 },
  { alt: "Tailwind", src: "/logos/tailwind.svg", w: 96, h: 28 },
  { alt: "Shadcn", src: "/logos/shadcn.svg", w: 90, h: 28 },
];

export default function LogosMarquee() {
  return (
    <section className="section-padding">
      <div className="mx-auto max-w-6xl px-4">
        <p className="text-center text-sm text-muted-foreground">Trusted by builders using modern tooling</p>
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-6 items-center justify-items-center">
          {logos.map((l) => (
            <img
              key={l.alt}
              src={l.src}
              alt={l.alt}
              width={l.w}
              height={l.h}
              loading="lazy"
              className="opacity-80"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
