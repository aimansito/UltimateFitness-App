// ============================================
// PROGRESO DE UNA RUTINA
// Totales en anillos, volumen semanal en barras y la evolución de cada ejercicio
// (estética de los vídeos: dorado, Anton, números en círculo).
// ============================================
import { useEffect, useState } from 'react';
import { ArrowDownRight, ArrowUpRight, Dumbbell } from 'lucide-react';
import progresoService from '../../services/progresoService';
import MuscleMap from '../common/MuscleMap';
import GraficoProgreso from './GraficoProgreso';
import { ultimaSesion } from './formato';

const DIA = ['', 'L', 'M', 'X', 'J', 'V', 'S', 'D'];
const fechaCorta = (f) => new Date(`${f}T00:00:00`).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
const miles = (n) => (n >= 10000 ? `${(n / 1000).toFixed(n >= 100000 ? 0 : 1)}k` : n.toLocaleString('es-ES'));
const dos = (n) => String(n).padStart(2, '0');


function Anillo({ valor, etiqueta }) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex h-[5.5rem] w-[5.5rem] items-center justify-center rounded-full border-[3px] border-uf-gold/80 shadow-[0_0_30px_rgba(204,148,26,0.18)] sm:h-28 sm:w-28">
        <span className="font-anton text-3xl leading-none text-uf-gold sm:text-4xl">{valor}</span>
      </div>
      <span className="mt-2 text-[10px] font-bold uppercase tracking-widest text-uf-muted">{etiqueta}</span>
    </div>
  );
}

/** Barras del volumen (kg movidos) de cada semana */
function BarrasSemanas({ semanas }) {
  if (!semanas.length) return null;
  const max = Math.max(...semanas.map((s) => s.volumen), 1);
  return (
    <div className="flex h-40 items-end gap-1.5 sm:gap-2" role="img" aria-label={`Volumen semanal de las últimas ${semanas.length} semanas`}>
      {semanas.map((s, i) => {
        const ultima = i === semanas.length - 1;
        return (
          <div key={s.semana} className="flex min-w-0 flex-1 flex-col items-center justify-end gap-1.5" title={`Semana del ${fechaCorta(s.semana)}: ${s.volumen.toLocaleString('es-ES')} kg en ${s.series} series`}>
            <span className={`text-[9px] font-bold ${ultima ? 'text-uf-gold' : 'text-uf-muted'}`}>{miles(s.volumen)}</span>
            <div
              className={`w-full rounded-t-md ${ultima ? 'bg-uf-gold shadow-[0_0_18px_rgba(204,148,26,0.5)]' : 'bg-uf-gold/35'}`}
              style={{ height: `${Math.max(4, (s.volumen / max) * 100)}px` }}
            />
            <span className="truncate text-[9px] uppercase text-uf-muted">{fechaCorta(s.semana)}</span>
          </div>
        );
      })}
    </div>
  );
}

/**
 * entrenamientoId: rutina a mostrar · recarga: cambia para volver a pedir los datos
 * onRegistrar (opcional): botón para registrar un ejercicio desde aquí
 */
function ProgresoRutina({ entrenamientoId, recarga = 0, onRegistrar }) {
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let vigente = true;
    setError(false);
    progresoService
      .rutina(entrenamientoId)
      .then((d) => vigente && setDatos(d))
      .catch(() => vigente && setError(true));
    return () => {
      vigente = false;
    };
  }, [entrenamientoId, recarga]);

  if (error) return <p className="py-8 text-center text-sm text-red-300">No se pudo cargar el progreso de esta rutina.</p>;
  if (!datos) {
    return (
      <div className="flex justify-center py-12" role="status">
        <div className="h-10 w-10 animate-spin rounded-full border-b-4 border-t-4 border-uf-gold" />
      </div>
    );
  }

  const { totales, semanas, ejercicios } = datos;
  if (totales.sesiones === 0) {
    return (
      <div className="flex flex-col items-center py-10 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-uf-gold/50 text-uf-gold">
          <Dumbbell className="h-7 w-7" />
        </span>
        <p className="mt-4 font-anton text-2xl uppercase text-white">Aún sin registros</p>
        <p className="mt-1 max-w-sm text-sm text-uf-muted">Cuando entrenes, pulsa «Registrar series» en cada ejercicio de la rutina y apunta el peso. Aquí verás cómo mejoras.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-center gap-3 sm:gap-8">
        <Anillo valor={totales.sesiones} etiqueta="Días" />
        <Anillo valor={miles(totales.series)} etiqueta="Series" />
        <Anillo valor={miles(totales.volumen)} etiqueta="Kg movidos" />
      </div>

      {semanas.length > 0 && (
        <div className="mt-8">
          <h3 className="mb-3 flex items-center gap-3 font-audiowide text-[11px] uppercase tracking-[0.3em] text-white">
            Volumen por semana <span className="h-px flex-1 bg-uf-line" />
          </h3>
          <BarrasSemanas semanas={semanas} />
        </div>
      )}

      <h3 className="mb-3 mt-8 flex items-center gap-3 font-audiowide text-[11px] uppercase tracking-[0.3em] text-white">
        Ejercicios <span className="h-px flex-1 bg-uf-line" />
      </h3>
      <ul className="grid gap-3 md:grid-cols-2">
        {ejercicios.map((e, i) => {
          const sube = e.mejora != null && e.mejora >= 0;
          return (
            <li key={e.ejercicioId} className="min-w-0 rounded-2xl border border-uf-line bg-black/30 p-4">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-uf-gold font-anton text-base text-uf-gold">{dos(i + 1)}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-anton text-lg uppercase leading-tight text-white">{e.nombre}</p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-uf-muted">
                    {e.dias.map((d) => DIA[d]).join(' · ')} · {e.plan.series}×{e.plan.repeticiones}
                  </p>
                </div>
                {e.mejora != null ? (
                  <span className={`inline-flex shrink-0 items-center gap-0.5 rounded-full px-2 py-1 text-xs font-bold ${sube ? 'bg-uf-gold/15 text-uf-gold' : 'bg-red-500/10 text-red-300'}`}>
                    {sube ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                    {sube ? '+' : ''}
                    {e.mejora}%
                  </span>
                ) : (
                  <MuscleMap grupo={e.grupoMuscular} className="h-12 w-8 shrink-0" />
                )}
              </div>
              {e.evolucion.length > 1 ? (
                <div className="mt-3">
                  <GraficoProgreso puntos={e.evolucion.map((s) => ({ etiqueta: fechaCorta(s.fecha), valor: s.pesoMax }))} alto={70} compacto />
                </div>
              ) : null}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-x-2 gap-y-1 text-xs">
                <span className="text-uf-muted">
                  {e.ultima ? (
                    <>
                      Última ({fechaCorta(e.ultima.fecha)}): <strong className="text-white">{ultimaSesion(e.ultima)}</strong>
                    </>
                  ) : (
                    'Sin registrar todavía'
                  )}
                </span>
                {e.mejorPeso > 0 && <span className="shrink-0 font-bold text-uf-gold">Récord {e.mejorPeso} kg</span>}
              </div>
              {onRegistrar && (
                <button type="button" onClick={() => onRegistrar(e)} className="mt-3 w-full rounded-full border border-uf-gold/40 py-2 text-[11px] font-bold uppercase tracking-wider text-uf-gold transition hover:bg-uf-gold hover:text-black">
                  Registrar series
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default ProgresoRutina;
