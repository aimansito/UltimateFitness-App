import { Helmet } from 'react-helmet-async';

function SEO({ title, description, keywords, image, url }) {
  const siteName = "Ultimate Fitness";
  const defaultTitle = "Ultimate Fitness | Transforma tu físico y tu vida";
  const defaultDescription = "Plataforma integral de fitness: rutinas de gimnasio, calistenia, dietas personalizadas y entrenadores profesionales. Empieza tu cambio hoy.";
  const defaultKeywords = "fitness, gimnasio, calistenia, dietas, entrenamiento online, entrenador personal, rutinas, ganar músculo, perder peso";
  
  const seo = {
    title: title ? `${title} | ${siteName}` : defaultTitle,
    description: description || defaultDescription,
    keywords: keywords || defaultKeywords,
    image: image || "/images/gymfondo.jpg", // Default image for social sharing
    url: url || window.location.href,
  };

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <meta name="keywords" content={seo.keywords} />

      {/* OpenGraph tags (Facebook, LinkedIn, etc.) */}
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:image" content={seo.image} />
      <meta property="og:url" content={seo.url} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={seo.image} />
    </Helmet>
  );
}

export default SEO;
