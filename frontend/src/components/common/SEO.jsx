import { Helmet } from 'react-helmet-async';

const SITE_URL = 'https://ultimatefitness.es';

function SEO({ title, description, keywords, image, url, type = 'website', noindex = false, jsonLd }) {
  const siteName = "Ultimate Fitness";
  const defaultTitle = "Ultimate Fitness | Transforma tu físico y tu vida";
  const defaultDescription = "Plataforma integral de fitness: rutinas de gimnasio, calistenia, dietas personalizadas y entrenadores profesionales. Empieza tu cambio hoy.";
  const defaultKeywords = "fitness, gimnasio, calistenia, dietas, entrenamiento online, entrenador personal, rutinas, ganar músculo, perder peso, nutrición deportiva";

  const seo = {
    title: title ? `${title} | ${siteName}` : defaultTitle,
    description: description || defaultDescription,
    keywords: keywords || defaultKeywords,
    image: image ? `${SITE_URL}${image}` : `${SITE_URL}/images/gymfondo.jpg`,
    url: url || (typeof window !== 'undefined' ? `${SITE_URL}${window.location.pathname}` : SITE_URL),
  };

  // Schema.org JSON-LD por defecto (Organization)
  const defaultJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Ultimate Fitness",
    "url": SITE_URL,
    "logo": `${SITE_URL}/logos/logo.png`,
    "description": defaultDescription,
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+34633714372",
      "contactType": "customer service",
      "availableLanguage": "Spanish"
    },
    "sameAs": [
      "https://www.instagram.com/ultimatefitness.uf/",
      "https://x.com/UltimateFts",
      "https://www.facebook.com/people/Aiman-Harrar/pfbid02RhkRkwtijJkrGWtLsztyCMbsJM9H4cGnV1K4LyTNoVbpPbWfT6usT3LmsZPiGk7Wl/"
    ]
  };

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <meta name="keywords" content={seo.keywords} />
      <meta name="robots" content={noindex ? "noindex, nofollow" : "index, follow"} />

      {/* Canonical URL */}
      <link rel="canonical" href={seo.url} />

      {/* OpenGraph tags (Facebook, LinkedIn, etc.) */}
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:image" content={seo.image} />
      <meta property="og:url" content={seo.url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="es_ES" />

      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@UltimateFts" />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={seo.image} />

      {/* JSON-LD Schema.org */}
      <script type="application/ld+json">
        {JSON.stringify(jsonLd || defaultJsonLd)}
      </script>
    </Helmet>
  );
}

export default SEO;
