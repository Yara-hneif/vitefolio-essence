import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/data-display/card";
import { Github, Globe, Share } from "lucide-react";
import { Button } from "@/components/ui/navigation/button";

const items = [
  { icon: Github, title: "GitHub", desc: "Import projects and link repos." },
  { icon: Globe, title: "Custom Domain", desc: "Point your profile to your domain." },
  { icon: Share, title: "Social Links", desc: "Add networks in one click." },
];

export default function Integrations({ onPrimary }: { onPrimary: () => void }) {
  return (
    <section className="section-padding">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold leading-[1.1]">Integrate what matters</h2>
          <p className="mt-2 text-muted-foreground">Start minimal, connect more when you need it.</p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
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

        <div className="mt-8 flex justify-center">
          <Button size="lg" onClick={onPrimary} className="px-8">Try the Demo</Button>
        </div>
      </div>
    </section>
  );
}
