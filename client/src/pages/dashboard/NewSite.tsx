import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createSiteFromTemplate } from "@/api/sites";
import { Button } from "@/components/ui/navigation/button";
import { Input } from "@/components/ui/form/input";
import { Label } from "@/components/ui/form/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/data-display/card";

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

export default function NewSite() {
  const nav = useNavigate();
  const [title, setTitle] = useState("My Portfolio");
  const [slug, setSlug] = useState("my-portfolio");
  const [busy, setBusy] = useState(false);

  const handleCreate = async () => {
    try {
      setBusy(true);
      const { homePageId } = await createSiteFromTemplate(title.trim(), slug.trim());
      nav(`/editor/${homePageId}`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-6">
      <h1 className="text-2xl font-bold">Create a New Site</h1>

      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setSlug(slugify(e.target.value));
              }}
            />
          </div>
          <div>
            <Label>Public URL (slug)</Label>
            <div className="flex gap-2">
              <span className="inline-flex items-center rounded-md border px-2">
                /site/
              </span>
              <Input
                value={slug}
                onChange={(e) => setSlug(slugify(e.target.value))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button disabled={!title.trim() || !slug.trim() || busy} onClick={handleCreate}>
          {busy ? "Creating…" : "Create Site"}
        </Button>
      </div>
    </div>
  );
}
