import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Layers, Rocket, Paintbrush, ShieldCheck } from "lucide-react";

const items = [
  { icon: Layers, title: "Composable", desc: "Small, reusable blocks for fast iteration." },
  { icon: Paintbrush, title: "Polished UI", desc: "Shadcn + Tailwind with clean defaults." },
  { icon: Rocket, title: "Performance", desc: "Optimized LCP and minimal CLS." },
  { icon: ShieldCheck, title: "Accessible", desc: "Semantic HTML and a11y best practices." },
];

export default function Features() {
  return (
    <section className="section-padding">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-3xl md:text-4xl font-bold leading-[1.1] text-center">Fast, clean, and flexible</h2>
        <p className="mt-2 text-center text-muted-foreground">
          A focused set of features to ship your portfolio quickly.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ icon: Icon, title, desc }) => (
            <Card key={title} className="transition-transform will-change-transform hover:-translate-y-0.5">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Icon aria-hidden className="w-5 h-5 text-primary" />
                  <CardTitle className="text-base">{title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">{desc}</CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
