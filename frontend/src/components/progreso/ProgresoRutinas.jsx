// ============================================
// PROGRESO POR RUTINA (perfil y Mi progreso)
// Eliges una de tus rutinas y ves su evolución en gráficas.
// ============================================
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Plus } from 'lucide-react';
import progresoService from '../../services/progresoService';
import ProgresoRutina from './ProgresoRutina';

function ProgresoRutinas({ titulo = true }) {
  const [rutinas, setRutinas] = useState(null);
  const [elegida, setElegida] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    progresoService
      .rutinas()
      .then((d) => {
        setRutinas(d.rutinas);
        setElegida(d.rutinas[0]?.id ?? null);
      })
      .catch(() => setError(true));
  }, []);

  return (
    <section className="uf-card p-5 md:p-7" aria-labelledby="titulo-progreso-rutinas">
      {titulo && (
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <span className="uf-eyebrow">Tu progreso</span>
            <h2 id="titulo-progreso-rutinas" className="mt-2 font-anton text-3xl uppercase leading-none text-white md:text-4xl">
              Progreso de tus <span className="uf-text-gold">rutinas</span>
            </h2>
          </div>
          {elegida && (
            <Link to={`/mis-entrenamientos/${elegida}`} className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-uf-gold hover:text-white">
              Abrir rutina
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      )}

      {error && <p className="py-6 text-center text-sm text-red-300">No se pudo cargar tu progreso.</p>}
      {!rutinas && !error && (
        <div className="flex justify-center py-10" role="status">
          <div className="h-10 w-10 animate-spin rounded-full border-b-4 border-t-4 border-uf-gold" />
        </div>
      )}

      {rutinas?.length === 0 && (
        <div className="flex flex-col items-center py-8 text-center">
          <p className="font-anton text-2xl uppercase text-white">Todavía no tienes rutinas</p>
          <p className="mt-1 text-sm text-uf-muted">Crea tu rutina semanal y apunta tus pesos para ver aquí tu evolución.</p>
          <Link to="/crear-entrenamiento" className="uf-btn uf-btn-primary mt-5">
            <Plus className="h-4 w-4" />
            Crear rutina
          </Link>
        </div>
      )}

      {rutinas?.length > 0 && (
        <>
          {rutinas.length > 1 && (
            <div className="mb-6 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Tus rutinas">
              {rutinas.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  role="tab"
                  aria-selected={r.id === elegida}
                  onClick={() => setElegida(r.id)}
                  className={`shrink-0 rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-wider transition ${
                    r.id === elegida ? 'border-uf-gold bg-uf-gold text-black' : 'border-uf-line text-gray-400 hover:border-uf-gold/60 hover:text-white'
                  }`}
                >
                  {r.nombre}
                  {r.sesiones > 0 && <span className={`ml-1.5 ${r.id === elegida ? 'text-black/60' : 'text-uf-gold'}`}>{r.sesiones}</span>}
                </button>
              ))}
            </div>
          )}
          {elegida && <ProgresoRutina entrenamientoId={elegida} />}
        </>
      )}
    </section>
  );
}

export default ProgresoRutinas;
