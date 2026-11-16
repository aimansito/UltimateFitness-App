// ============================================
// MI PROGRESO - Evolución de fuerza por ejercicio
// ============================================
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDownRight, ArrowUpRight, CalendarDays, Dumbbell, Layers, Plus, Weight } from 'lucide-react';
import progresoService from '../../services/progresoService';
import SEO from '../../components/common/SEO';
import MuscleMap from '../../components/common/MuscleMap';
import GraficoProgreso from '../../components/progreso/GraficoProgreso';
import RegistroSeries from '../../components/progreso/RegistroSeries';

const fechaCorta = (f) => new Date(`${f}T00:00:00`).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });

function MiProgreso() {
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState(false);
  const [abierto, setAbierto] = useState(null);

  const cargar = useCallback(() => {
    progresoService
      .resumen()
      .then((d) => {
        setDatos(d);
        setError(false);
      })
      .catch(() => setError(true));
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const ejercicios = datos?.ejercicios || [];

  return (
    <div className="min-h-screen bg-uf-darker py-12">
      <SEO title="Mi progreso" description="Tu evolución de fuerza por ejercicio." noindex />
      <div className="container mx-auto max-w-6xl px-4">
        <div className="mb-10">
          <span className="uf-eyebrow">Seguimiento</span>
          <h1 className="mt-3 font-anton text-4xl uppercase text-white md:text-5xl">
            Mi <span className="uf-text-gold">progreso</span>
          </h1>
          <p className="mt-2 max-w-2xl text-uf-muted">
            Apunta las series, repeticiones y peso de cada ejercicio desde tu rutina y mira cómo mejoras semana a semana.
          </p>
        </div>

        {error && <p className="uf-card p-6 text-center text-red-300">No se pudo cargar tu progreso. Recarga la página.</p>}

        {!datos && !error && (
          <div className="flex justify-center py-20" role="status">
            <div className="h-12 w-12 animate-spin rounded-full border-b-4 border-t-4 border-uf-gold" />
          </div>
        )}

        {datos && (
          <>
            <dl className="mb-8 grid grid-cols-3 gap-3">
              <Total icono={<CalendarDays className="mx-auto h-5 w-5 text-uf-gold" aria-hidden="true" />} valor={datos.totales.dias} nombre="Días entrenados" />
              <Total icono={<Layers className="mx-auto h-5 w-5 text-uf-gold" aria-hidden="true" />} valor={datos.totales.series} nombre="Series" />
              <Total icono={<Weight className="mx-auto h-5 w-5 text-uf-gold" aria-hidden="true" />} valor={`${datos.totales.volumen.toLocaleString('es-ES')} kg`} nombre="Volumen total" />
            </dl>

            {ejercicios.length === 0 ? (
              <div className="uf-card flex flex-col items-center p-10 text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-uf-gold/15 text-uf-gold">
                  <Dumbbell className="h-8 w-8" />
                </span>
                <h2 className="mt-5 font-anton text-2xl uppercase text-white">Aún no has registrado nada</h2>
                <p className="mt-2 max-w-md text-uf-muted">
                  Abre una de tus rutinas y pulsa «Registrar series» en cada ejercicio al terminar. Aquí verás tus récords y tu evolución.
                </p>
                <Link to="/mis-entrenamientos" className="uf-btn uf-btn-primary mt-6">
                  <Plus className="h-4 w-4" />
                  Ir a mis rutinas
                </Link>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {ejercicios.map((e) => (
                  <button
                    key={e.ejercicioId}
                    type="button"
                    onClick={() => setAbierto(e)}
                    className="uf-card uf-card-hover group flex flex-col p-5 text-left"
                  >
                    <div className="flex items-start gap-3">
                      <MuscleMap grupo={e.grupoMuscular} className="h-14 w-9 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <h2 className="truncate font-anton text-xl uppercase text-white group-hover:text-uf-gold">{e.nombre}</h2>
                        <p className="text-xs text-uf-muted">
                          {e.sesiones} {e.sesiones === 1 ? 'sesión' : 'sesiones'} · última {fechaCorta(e.ultimaFecha)}
                        </p>
                      </div>
                      {e.mejora != null && (
                        <span className={`inline-flex shrink-0 items-center gap-0.5 rounded-full px-2 py-1 text-xs font-bold ${e.mejora >= 0 ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'}`}>
                          {e.mejora >= 0 ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                          {Math.abs(e.mejora)}%
                        </span>
                      )}
                    </div>
                    <div className="mt-4">
                      <GraficoProgreso compacto alto={56} puntos={e.evolucion.map((s) => ({ etiqueta: s.fecha, valor: s.pesoMax }))} />
                    </div>
                    <div className="mt-3 flex items-end justify-between border-t border-uf-line pt-3">
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-uf-muted">Récord</div>
                        <div className="font-anton text-2xl text-uf-gold">{e.mejorPeso > 0 ? `${e.mejorPeso} kg` : '-'}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-uf-muted">Última</div>
                        <div className="font-anton text-2xl text-white">{e.pesoActual ? `${e.pesoActual} kg` : '-'}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {abierto && (
        <RegistroSeries
          ejercicio={{ id: abierto.ejercicioId, nombre: abierto.nombre, grupoMuscular: abierto.grupoMuscular }}
          onClose={() => setAbierto(null)}
          onGuardado={cargar}
        />
      )}
    </div>
  );
}

function Total({ icono, valor, nombre }) {
  return (
    <div className="uf-card p-4 text-center">
      {icono}
      <dd className="mt-2 font-anton text-2xl text-white md:text-3xl">{valor}</dd>
      <dt className="mt-1 text-[10px] font-bold uppercase tracking-widest text-uf-muted">{nombre}</dt>
    </div>
  );
}

export default MiProgreso;
