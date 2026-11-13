import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Dumbbell } from 'lucide-react';
import socialService, { rutaPerfil, urlFoto } from '../../services/socialService';
import { gruposDe } from '../../utils/imagenEntreno';
import MuscleMap from '../common/MuscleMap';
import Avatar from './Avatar';

// Feed de entrenos completados hoy y compartidos por la comunidad.
// Cambiar `refresco` vuelve a pedir la primera página.
function FeedEntrenos({ refresco = 0 }) {
  const [entrenos, setEntrenos] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [hayMas, setHayMas] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setPagina(1);
  }, [refresco]);

  useEffect(() => {
    let vigente = true;
    socialService
      .feedEntrenos(pagina)
      .then((r) => {
        if (!vigente) return;
        setEntrenos((previos) => (pagina === 1 ? r.entrenos : [...previos, ...r.entrenos]));
        setHayMas(r.hayMas);
        setError(false);
      })
      .catch(() => vigente && setError(true))
      .finally(() => vigente && setCargando(false));
    return () => {
      vigente = false;
    };
  }, [pagina, refresco]);

  return (
    <section className="uf-card p-6" aria-labelledby="titulo-feed">
      <span className="uf-eyebrow">Comunidad</span>
      <h2 id="titulo-feed" className="mt-2 font-anton text-2xl uppercase text-white">
        Entrenos de hoy
      </h2>

      {cargando && entrenos.length === 0 && <div className="mt-5 h-24 animate-pulse rounded-2xl bg-white/5" />}

      {error && <p className="mt-5 text-sm text-red-300">No se pudo cargar el feed.</p>}

      {!cargando && !error && entrenos.length === 0 && (
        <div className="mt-5 rounded-2xl border border-dashed border-uf-line p-6 text-center">
          <Dumbbell className="mx-auto h-8 w-8 text-uf-muted" aria-hidden="true" />
          <p className="mt-3 text-sm text-uf-muted">
            Nadie ha compartido su entreno todavía. Completa el tuyo y sé la primera persona de hoy.
          </p>
        </div>
      )}

      <ul className="mt-5 space-y-3">
        {entrenos.map((e) => {
          const grupos = gruposDe(e.ejercicios);
          return (
            <li key={e.id} className="overflow-hidden rounded-2xl border border-uf-line bg-black/20">
              <Link
                to={rutaPerfil(e.autor)}
                className="flex items-center gap-3 p-3 transition hover:bg-white/[0.03]"
              >
                <Avatar nombre={e.autor.nombre} fotoUrl={e.autor.fotoUrl} tamano="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-gray-300">
                    <span className="font-semibold text-white">{e.autor.nombre}</span> ha completado
                  </p>
                  <p className="truncate font-anton text-lg uppercase leading-tight text-uf-gold">
                    {e.entrenamiento.nombre}
                  </p>
                </div>
                <div className="shrink-0 text-right text-xs text-uf-muted">
                  <p>{e.hora}</p>
                  {e.entrenamiento.duracionMinutos != null && (
                    <p className="mt-0.5 inline-flex items-center gap-1">
                      <Clock className="h-3 w-3" aria-hidden="true" />
                      {e.entrenamiento.duracionMinutos} min
                    </p>
                  )}
                </div>
              </Link>

              {e.fotoUrl && (
                <img
                  src={urlFoto(e.fotoUrl)}
                  alt={`Foto del entreno de ${e.autor.nombre}`}
                  loading="lazy"
                  className="aspect-[4/5] max-h-80 w-full object-cover"
                />
              )}

              {(e.ejercicios?.length > 0 || e.diaHecho) && (
                <div className="flex items-center gap-3 border-t border-uf-line p-3">
                  <div className="min-w-0 flex-1">
                    {e.diaHecho && <p className="truncate text-xs font-semibold text-gray-300">{e.diaHecho}</p>}
                    {e.ejercicios?.length > 0 && (
                      <p className="mt-0.5 line-clamp-2 text-xs text-uf-muted">
                        {e.ejercicios.map((x) => x.nombre).join(' · ')}
                      </p>
                    )}
                  </div>
                  {grupos.length > 0 && (
                    <div className="h-16 w-12 shrink-0">
                      <MuscleMap grupos={grupos} vista="ambas" className="h-full w-full" bodyColor="#3a3a3a" />
                    </div>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {hayMas && (
        <button
          type="button"
          onClick={() => setPagina((p) => p + 1)}
          className="uf-btn uf-btn-ghost mx-auto mt-4 !flex !py-2 !text-xs"
        >
          Ver más
        </button>
      )}
    </section>
  );
}

export default FeedEntrenos;
