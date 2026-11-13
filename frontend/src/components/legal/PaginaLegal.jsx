import { Link } from 'react-router-dom';
import SEO from '../common/SEO';
import Icono from '../common/Icono';
import { ULTIMA_ACTUALIZACION } from '../../config/legal';

// Estructura común de las páginas legales: cabecera, índice de secciones y contenido.
// secciones: [{ id, titulo, contenido }]
export function PaginaLegal({ titulo, subtitulo, descripcionSeo, icono, secciones }) {
  return (
    <div className="min-h-screen bg-uf-darker px-4 py-12">
      <SEO title={titulo} description={descripcionSeo} />
      <article className="mx-auto max-w-3xl">
        <header className="mb-10">
          <span className="uf-eyebrow">Legal</span>
          <h1 className="mt-3 flex items-center gap-3 font-anton text-4xl uppercase text-white md:text-5xl">
            <Icono de={icono} className="h-9 w-9 shrink-0 text-uf-gold" />
            {titulo}
          </h1>
          <p className="mt-3 text-uf-muted">{subtitulo}</p>
          <p className="mt-1 text-sm text-uf-muted">Última actualización: {ULTIMA_ACTUALIZACION}</p>
        </header>

        <nav aria-label="Contenido" className="uf-card mb-10 p-5">
          <ol className="grid gap-1.5 text-sm sm:grid-cols-2">
            {secciones.map((s, i) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="text-gray-300 transition hover:text-uf-gold">
                  {i + 1}. {s.titulo}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="space-y-10">
          {secciones.map((s, i) => (
            <section key={s.id} id={s.id} className="scroll-mt-24">
              <h2 className="font-anton text-2xl uppercase text-uf-gold">
                {i + 1}. {s.titulo}
              </h2>
              <div className="legal-texto mt-4 space-y-3 leading-relaxed text-gray-300">{s.contenido}</div>
            </section>
          ))}
        </div>

        <div className="mt-14 border-t border-uf-line pt-6">
          <Link to="/" className="uf-btn uf-btn-ghost">
            Volver al inicio
          </Link>
        </div>
      </article>
    </div>
  );
}

export function Lista({ children }) {
  return <ul className="list-disc space-y-1.5 pl-5 marker:text-uf-gold">{children}</ul>;
}

export function Tabla({ cabecera, filas }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-uf-line">
      <table className="w-full min-w-[520px] text-left text-sm">
        <thead className="bg-white/5 text-xs uppercase tracking-wider text-uf-muted">
          <tr>
            {cabecera.map((c) => (
              <th key={c} scope="col" className="px-4 py-3 font-semibold">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-uf-line">
          {filas.map((fila) => (
            <tr key={fila[0]}>
              {fila.map((celda, j) => (
                <td key={j} className="px-4 py-3 align-top">
                  {celda}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Correo({ email }) {
  return (
    <a href={`mailto:${email}`} className="font-semibold text-uf-gold hover:underline">
      {email}
    </a>
  );
}
