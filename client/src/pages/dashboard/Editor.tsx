import { useParams, useNavigate } from "react-router-dom";
import { BuilderComponent } from "@builder.io/react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function Editor() {
  const { pageId } = useParams();
  const nav = useNavigate();
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    if (pageId === "new") {
      setContent({
        data: { 
          userId: "me", 
          siteSlug: "me", 
          slug: "home", 
          isHome: true, 
          blocks: [{ 
            component: { 
              name: "Hero", 
              options: { title: "New Page" } 
            } 
          }] 
        }
      });
      return;
    }
    // Fallback: load from localStorage for MVP editor
    const raw = localStorage.getItem(`builder.page.${pageId}`);
    if (raw) setContent(JSON.parse(raw));
  }, [pageId]);

  const saveLocal = () => {
    if (!content) return;
    localStorage.setItem(`builder.page.${pageId}`, JSON.stringify(content));
    alert("Saved locally (MVP).");
  };

  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-10 bg-background/60 backdrop-blur border-b px-4 py-3 flex gap-3">
        <Button onClick={() => nav(-1)} variant="outline">
          Back
        </Button>
        <Button onClick={saveLocal} variant="outline">
          Save (local)
        </Button>
        <Button 
          variant="outline" 
          disabled 
          className="opacity-60 cursor-not-allowed" 
          title="Hook server later"
        >
          Publish (server)
        </Button>
      </div>
      <div className="max-w-5xl mx-auto p-4">
        {content ? (
          <BuilderComponent model="page" content={content} />
        ) : (
          <div>Loading…</div>
        )}
      </div>
    </div>
  );
}