import { useEffect } from "react";

type BreadcrumbItem = {
  name: string;
  url: string;
};

export function useBreadcrumbStructuredData(items: BreadcrumbItem[]) {
  useEffect(() => {
    const scriptId = "breadcrumbs-structured-data";
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: item.url,
      })),
    };

    script.textContent = JSON.stringify(jsonLd, null, 2);

    return () => {
      if (script) {
        script.remove();
      }
    };
  }, [items]);
}
