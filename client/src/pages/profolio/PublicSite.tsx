import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BuilderComponent } from '@builder.io/react';
import { getSiteBySlug, getHomePage } from '@/api/sites';
import { Button } from '@/components/ui/button';

export default function PublicSite() {
  const { slug } = useParams<{ slug: string }>();
  const [state, setState] = useState<{ title?: string; content?: any; notFound?: boolean }>({});

  useEffect(() => {
    (async () => {
      if (!slug) return;
      const site = await getSiteBySlug(slug);
      if (!site || (!site.published)) { setState({ notFound: true }); return; }
      const home = await getHomePage(site.id);
      setState({ title: site.title, content: home?.content });
    })();
  }, [slug]);

  if (state.notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center space-y-4">
        <div>
          <h1 className="text-2xl font-bold">Site Not Found</h1>
          <p className="text-muted-foreground mt-2">This site is not published or doesn’t exist.</p>
          <div className="mt-4">
            <Button asChild><Link to="/">Go Home</Link></Button>
          </div>
        </div>
      </div>
    );
  }

  if (!state.content) return <div className="p-8">Loading…</div>;

  return (
    <div className="min-h-screen">
      <BuilderComponent model="page" content={state.content} />
    </div>
  );
}
