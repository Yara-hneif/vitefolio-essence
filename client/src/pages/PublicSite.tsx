import { useParams } from "react-router-dom";
import { BuilderComponent } from "@builder.io/react";
import { useEffect, useState } from "react";

export default function PublicSite() {
  const { username, pageSlug } = useParams();
  const apiKey = import.meta.env.VITE_BUILDER_PUBLIC_KEY as string;
  const slug = pageSlug || "home";
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!apiKey) {
      console.warn("Builder.io public key not found");
      setLoading(false);
      return;
    }

    const q = encodeURIComponent(JSON.stringify({ "data.siteSlug": username, "data.slug": slug }));
    fetch(`https://cdn.builder.io/api/v3/content/page?apiKey=${apiKey}&limit=1&query=${q}`)
      .then(r => r.json())
      .then(res => {
        setContent(res?.results?.[0] || null);
        setLoading(false);
      })
      .catch(() => {
        setContent(null);
        setLoading(false);
      });
  }, [username, slug, apiKey]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Page Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The page you're looking for doesn't exist or hasn't been published yet.
          </p>
          <a 
            href="/" 
            className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Go Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div>
      <BuilderComponent model="page" content={content} />
    </div>
  );
}