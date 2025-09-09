import { useEffect } from "react";

export function useGlobalStructuredData() {
  useEffect(() => {
    const scriptId = "global-structured-data";
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }

    const jsonLd = [
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "Vitefolio Essence",
        url: "https://vitefolio.com",
        logo: "https://vitefolio.com/logo.png",
        sameAs: [
          "https://github.com/Yara-hneif/vitefolio-essence",
          "https://www.linkedin.com/company/vitefolio",
          "https://twitter.com/vitefolio"
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Vitefolio Essence",
        url: "https://vitefolio.com",
        potentialAction: {
          "@type": "SearchAction",
          target: "https://vitefolio.com/search?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      }
    ];

    script.textContent = JSON.stringify(jsonLd, null, 2);

    return () => {
      if (script) {
        script.remove();
      }
    };
  }, []);
}
