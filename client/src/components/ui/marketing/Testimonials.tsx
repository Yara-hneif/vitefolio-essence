import { Card, CardContent } from "@/components/ui/data-display/card";

const items = [
  { name: "Maya A.", role: "Frontend Dev", quote: "Clean, fast, and easy to tailor. Love the defaults." },
  { name: "Tom H.", role: "Designer", quote: "Balanced visuals without the noise. Perfect baseline." },
  { name: "Eli R.", role: "Student", quote: "Got a publishable portfolio in one afternoon." },
];

export default function Testimonials() {
  return (
    <section className="section-padding">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-3xl md:text-4xl font-bold leading-[1.1] text-center">Loved by makers</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {items.map((t) => (
            <Card key={t.name} className="transition-transform will-change-transform hover:-translate-y-0.5">
              <CardContent className="pt-6">
                <p className="text-sm leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                <p className="mt-3 text-xs text-muted-foreground">
                  {t.name} — {t.role}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
