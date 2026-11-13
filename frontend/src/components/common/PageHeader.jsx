// Cabecera común de las páginas públicas: etiqueta, titular grande y subtítulo
function PageHeader({ eyebrow, title, highlight, subtitle, children }) {
  return (
    <header className="relative isolate overflow-hidden border-b border-uf-line">
      <div className="uf-grid-bg absolute inset-0 -z-10" aria-hidden="true" />
      <div className="uf-glow -z-10 left-1/2 top-[-40%] h-72 w-[40rem] -translate-x-1/2" aria-hidden="true" />
      <div className="container mx-auto px-4 py-16 text-center md:py-20">
        {eyebrow && <span className="uf-eyebrow justify-center">{eyebrow}</span>}
        <h1 className="mx-auto mt-4 max-w-4xl font-anton text-5xl uppercase leading-[1] text-white md:text-7xl">
          {title} {highlight && <span className="uf-text-gold">{highlight}</span>}
        </h1>
        {subtitle && <p className="mx-auto mt-5 max-w-2xl text-lg text-uf-muted">{subtitle}</p>}
        {children}
      </div>
    </header>
  );
}

export default PageHeader;
