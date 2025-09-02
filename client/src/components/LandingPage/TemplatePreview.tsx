import { Card, CardContent } from "@/components/ui/data-display/card";
import { Badge } from "@/components/ui/data-display/badge";

export default function TemplatePreview() {
  // Pure UI mockup to showcase what a portfolio could look like
  return (
    <Card className="overflow-hidden shadow-lg">
      <CardContent className="p-0">
        <div className="bg-gradient-to-br from-indigo-50 via-white to-violet-50">
          <div className="p-6 md:p-10">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-gradient-to-br from-indigo-400 to-violet-400" />
              <div>
                <h3 className="text-xl font-bold">Yara Hneif</h3>
                <p className="text-sm text-muted-foreground">Full-Stack Developer • React • Node</p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <Badge>TypeScript</Badge>
              <Badge variant="secondary">Tailwind</Badge>
              <Badge variant="outline">PostgreSQL</Badge>
              <Badge variant="secondary">Framer Motion</Badge>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {[1,2,3].map((i) => (
                <div key={i} className="rounded-xl border bg-white/70 p-4 backdrop-blur">
                  <div className="h-28 rounded-lg bg-gradient-to-br from-indigo-200 to-violet-200" />
                  <div className="mt-3 font-semibold">Project {i}</div>
                  <p className="text-sm text-muted-foreground">Short description of the project goes here.</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
