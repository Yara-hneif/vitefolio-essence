import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BuilderComponent } from "@builder.io/react";
import { loadPage, savePage, setSitePublished } from "@/api/sites";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Editor() {
  const { pageId } = useParams<{ pageId: string }>();
  const nav = useNavigate();
  const [content, setContent] = useState<any>(null);
  const [siteId, setSiteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    (async () => {
      if (!pageId) return;
      const page = await loadPage(pageId);
      if (!page) return;
      setSiteId(page.site_id);
      setContent(page.content);
    })();
  }, [pageId]);

  async function handleSave() {
    if (!pageId || !content) return;
    setSaving(true);
    try {
      await savePage(pageId, content);
    } finally {
      setSaving(false);
    }
  }

  async function handlePublish() {
    if (!siteId) return;
    setPublishing(true);
    try {
      await setSitePublished(siteId, true);
      window.open(`/site/${siteId}`, "_blank");
    } finally {
      setPublishing(false);
    }
  }

  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-10 bg-background/60 backdrop-blur border-b px-4 py-3 flex gap-3">
        <Button onClick={() => nav(-1)} variant="outline">Back</Button>
        <Button onClick={handleSave} variant="outline" disabled={saving}>
          {saving ? "Saving…" : "Save"}
        </Button>
        <Button onClick={handlePublish} disabled={!siteId || publishing}>
          {publishing ? "Publishing…" : "Publish"}
        </Button>
      </div>

      <div className="max-w-5xl mx-auto p-4">
        {content ? (
          <Card>
            <CardContent className="p-0">
              <BuilderComponent model="page" content={content} />
            </CardContent>
          </Card>
        ) : (
          <div>Loading…</div>
        )}
      </div>
    </div>
  );
}
