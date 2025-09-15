import { useEffect } from 'react';

type StructuredDataOptions = {
  type: 'Organization' | 'WebSite' | 'Article';
  name: string;
  url: string;
  description?: string;
  logo?: string;
  image?: string;
  author?: string;
  datePublished?: string;
  dateModified?: string;
};

export function useStructuredData(opts: StructuredDataOptions) {
  useEffect(() => {
    const scriptId = 'structured-data-jsonld';
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }

    const jsonLd: any = {
      '@context': 'https://schema.org',
      '@type': opts.type,
      name: opts.name,
      url: opts.url,
      description: opts.description,
    };

    if (opts.type === 'Organization') {
      if (opts.logo) jsonLd.logo = opts.logo;
    }

    if (opts.type === 'WebSite') {
      jsonLd.potentialAction = {
        '@type': 'SearchAction',
        target: `${opts.url}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      };
    }

    if (opts.type === 'Article') {
      if (opts.image) jsonLd.image = opts.image;
      if (opts.author) jsonLd.author = { '@type': 'Person', name: opts.author };
      if (opts.datePublished) jsonLd.datePublished = opts.datePublished;
      if (opts.dateModified) jsonLd.dateModified = opts.dateModified;
    }

    script.textContent = JSON.stringify(jsonLd, null, 2);

    return () => {
      if (script) {
        script.remove();
      }
    };
  }, [opts]);
}
