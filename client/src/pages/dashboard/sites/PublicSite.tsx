import { useParams } from 'react-router-dom';
import { BuilderComponent } from '@builder.io/react';
import type { BuilderContent } from '@builder.io/sdk';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useStructuredData } from '@/lib/structuredData';
import { useBreadcrumbStructuredData } from '@/lib/breadcrumbsStructuredData';

type ErrorStateProps = {
  message: string;
};

function ErrorState({ message }: ErrorStateProps) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-red-500 mb-4">Error</h1>
        <p className="text-muted-foreground mb-8">{message}</p>
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

export default function PublicSite() {
  const { username, pageSlug } = useParams();
  const apiKey = import.meta.env.VITE_BUILDER_PUBLIC_KEY as string;
  const canonical = typeof window !== 'undefined' ? window.location.href : undefined;
  const slug = pageSlug || 'home';

  const [content, setContent] = useState<BuilderContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPage() {
      if (!apiKey) {
        console.warn('Builder.io public key not found');
        setError('Site misconfiguration: missing Builder.io key.');
        setLoading(false);
        return;
      }

      try {
        if (!username) {
          setError('Missing site username');
          setLoading(false);
          return;
        }

        if (!username) {
          setError('Missing username');
          setLoading(false);
          return;
        }

        // Step 1: Check if site is published in Supabase
        const { data: site, error: siteError } = await supabase
          .from('sites')
          .select('published')
          .eq('slug', username)
          .single();

        if (siteError) throw siteError;
        if (!site?.published) {
          setError('This site is not published.');
          setLoading(false);
          return;
        }

        // Step 2: Fetch from Builder.io
        const q = encodeURIComponent(
          JSON.stringify({ 'data.siteSlug': username, 'data.slug': slug })
        );

        const res = await fetch(
          `https://cdn.builder.io/api/v3/content/page?apiKey=${apiKey}&limit=1&query=${q}`
        );
        const json = await res.json();

        setContent(json?.results?.[0] || null);
      } catch (err: any) {
        console.error('Error loading page:', err.message);
        setError('Something went wrong while loading the page.');
      } finally {
        setLoading(false);
      }
    }

    loadPage();
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

  if (error) {
    return <ErrorState message={error} />;
  }

  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Page Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The page you&apos;re looking for doesn&apos;t exist or hasn&apos;t been published yet.
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

  //  SEO values
  const pageTitle =
    (content.data?.title as string) || (content.name as string) || `${username} | Vitefolio`;
  const pageDescription =
    (content.data?.description as string) || 'Personal site powered by Vitefolio Essence';
  const ogImage = (content.data?.ogImage as string) || (content.data?.image as string) || undefined;

  //  Inject Structured Data (Article)
  useStructuredData({
    type: 'Article',
    name: pageTitle,
    url: canonical || '',
    description: pageDescription,
    image: ogImage,
    author: username || 'Unknown',
    datePublished: (content as any)?.firstPublishedDate,
    dateModified: (content as any)?.lastUpdatedDate,
  });

  //  Inject BreadcrumbList
  useBreadcrumbStructuredData([
    { name: 'Home', url: 'https://vitefolio.com' },
    { name: username || 'User', url: `https://vitefolio.com/${username}` },
    {
      name: slug,
      url: `https://vitefolio.com/${username}/${slug}`,
    },
  ]);

  return (
    <div>
      <BuilderComponent model="page" content={content} />
    </div>
  );
}
