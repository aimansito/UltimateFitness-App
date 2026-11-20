// ============================================
// OBJETIVOS CUMPLIDOS (perfil)
// Cada rutina completada con su foto estilo Strava, como una galería de publicaciones.
// ============================================
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Globe, Lock, Trophy, X } from 'lucide-react';
import socialService, { urlFoto } from '../../services/socialService';
import { formatoDuracion } from '../../utils/historiaEntreno';

const fechaCorta = (f) => new Date(`${f}T00:00:00`).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });

function ObjetivosCumplidos() {
  const [entrenos, setEntrenos] = useState(null);
  const [total, setTotal] = useState(0);
  const [pagina, setPagina] = useState(1);
  const [hayMas, setHayMas] = useState(false);
  const [abierta, setAbierta] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    socialService
      .misEntrenos(pagina)
      .then((d) => {
        setEntrenos((prev) => (pagina === 1 ? d.entrenos : [...(prev || []), ...d.entrenos]));
        setHayMas(d.hayMas);
        setTotal(d.total);
      })
      .catch(() => setError(true));
  }, [pagina]);

  return (
    <section className="uf-card p-5 md:p-7" aria-labelledby="titulo-objetivos">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="uf-eyebrow">Tus entrenos</span>
          <h2 id="titulo-objetivos" className="mt-2 font-anton text-3xl uppercase leading-none text-white md:text-4xl">
            Objetivos <span className="uf-text-gold">cumplidos</span>
          </h2>
        </div>
        {total > 0 && (
          <span className="flex items-center gap-2 font-anton text-2xl text-uf-gold">
            <Trophy className="h-5 w-5" /> {total}
          </span>
        )}
      </div>

      {error && <p className="py-6 text-center text-sm text-red-300">No se pudieron cargar tus entrenos.</p>}
      {!entrenos && !error && (
        <div className="flex justify-center py-10" role="status">
          <div className="h-10 w-10 animate-spin rounded-full border-b-4 border-t-4 border-uf-gold" />
        </div>
      )}
      {entrenos?.length === 0 && (
        <div className="py-8 text-center">
          <p className="font-anton text-2xl uppercase text-white">Aún no has completado ninguna rutina</p>
          <p className="mx-auto mt-1 max-w-md text-sm text-uf-muted">
            Abre tu rutina, marca los ejercicios mientras entrenas y pulsa «Completar rutina»: tu foto aparecerá aquí.
          </p>
          <Link to="/mis-entrenamientos" className="uf-btn uf-btn-primary mt-5">Ir a mis rutinas</Link>
        </div>
      )}

      {entrenos?.length > 0 && (
        <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-5">
          {entrenos.map((e) => (
            <li key={e.id} className="min-w-0">
              <button
                type="button"
                onClick={() => setAbierta(e)}
                className="group relative block aspect-[9/16] w-full overflow-hidden rounded-xl border border-uf-line bg-black text-left"
                aria-label={`${e.entrenamiento.nombre}, ${fechaCorta(e.fecha)}`}
              >
                {e.fotoUrl ? (
                  <img src={urlFoto(e.fotoUrl)} alt="" loading="lazy" className="h-full w-full object-cover transition group-hover:scale-105" />
                ) : (
                  <span className="flex h-full items-center justify-center bg-gradient-to-br from-[#1a1406] to-black">
                    <Trophy className="h-8 w-8 text-uf-gold/60" />
                  </span>
                )}
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-2 pt-6">
                  <span className="block truncate text-[10px] font-bold uppercase tracking-wider text-white">{e.entrenamiento.nombre}</span>
                  <span className="block text-[10px] text-uf-gold">{fechaCorta(e.fecha)}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
      {hayMas && (
        <button type="button" onClick={() => setPagina((p) => p + 1)} className="uf-btn uf-btn-ghost mx-auto mt-4 !flex !py-2 !text-xs">
          Ver más
        </button>
      )}

      {abierta && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4" role="dialog" aria-modal="true" aria-label={abierta.entrenamiento.nombre} onClick={() => setAbierta(null)}>
          <div className="relative w-full max-w-sm" onClick={(ev) => ev.stopPropagation()}>
            <button type="button" onClick={() => setAbierta(null)} aria-label="Cerrar" className="absolute -top-12 right-0 flex h-10 w-10 items-center justify-center rounded-full border border-uf-line text-gray-300 hover:text-white">
              <X className="h-5 w-5" />
            </button>
            {abierta.fotoUrl && <img src={urlFoto(abierta.fotoUrl)} alt={`Entreno: ${abierta.entrenamiento.nombre}`} className="max-h-[78vh] w-full rounded-2xl object-contain" />}
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm text-uf-muted">
              <span className="font-anton text-lg uppercase text-white">{abierta.entrenamiento.nombre}</span>
              <span className="flex items-center gap-3">
                {abierta.duracionMinutos && (
                  <span className="inline-flex items-center gap-1"><Clock className="h-4 w-4" /> {formatoDuracion(abierta.duracionMinutos)}</span>
                )}
                <span className="inline-flex items-center gap-1">
                  {abierta.compartido ? <Globe className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                  {abierta.compartido ? 'En el feed' : 'Privado'}
                </span>
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default ObjetivosCumplidos;
