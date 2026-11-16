import { forwardRef } from 'react';
import MuscleMap from '../common/MuscleMap';
import { formatoSeries, gruposDe, nombresGrupos, statsDe } from '../../utils/imagenEntreno';

const fechaCorta = (d = new Date()) =>
  d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }).replace('.', '');

/**
 * Tarjeta del entreno estilo Strava (proporción 4:5): foto de fondo, rutina, ejercicios,
 * estadísticas y el mapa muscular con lo trabajado. El ref apunta al mapa para poder exportarlo.
 */
const TarjetaEntreno = forwardRef(function TarjetaEntreno(
  { fotoSrc, nombre, rutina, dia, ejercicios = [], duracionMinutos, fecha = fechaCorta(), compacta = false },
  mapaRef
) {
  const grupos = gruposDe(ejercicios);
  const stats = statsDe(ejercicios, duracionMinutos).filter((s) => s.valor !== null);
  const max = compacta ? 3 : 5;

  return (
    <div className="relative isolate aspect-[4/5] w-full overflow-hidden rounded-3xl border border-uf-line bg-gradient-to-br from-[#1a1406] to-black">
      {fotoSrc && (
        <img src={fotoSrc} alt="" crossOrigin="anonymous" className="absolute inset-0 -z-10 h-full w-full object-cover" />
      )}
      <div className="absolute inset-x-0 top-0 -z-10 h-1/5 bg-gradient-to-b from-black/70 to-transparent" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-[65%] bg-gradient-to-b from-transparent via-black/75 to-black/95" aria-hidden="true" />

      <div className="flex items-start justify-between p-[5%]">
        <span className="font-anton text-sm uppercase tracking-wide text-uf-gold sm:text-base">Ultimate Fitness</span>
        <span className="text-xs font-semibold text-white sm:text-sm">{fecha}</span>
      </div>

      <div className="absolute inset-x-0 bottom-0 p-[5%]">
        <div className="flex items-end gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-[11px] font-bold uppercase tracking-wider text-uf-gold sm:text-xs">{nombre} ha completado</p>
            <p className={`mt-1 line-clamp-2 font-anton uppercase leading-none text-white ${compacta ? 'text-2xl' : 'text-3xl sm:text-4xl'}`}>
              {rutina}
            </p>
            {dia && <p className="mt-1.5 truncate text-sm font-semibold text-gray-300">{dia}</p>}
            {ejercicios.length > 0 && (
              <ul className="mt-3 space-y-1 text-sm text-white">
                {ejercicios.slice(0, max).map((e, i) => (
                  <li key={`${e.nombre}-${i}`} className="flex items-center gap-2 truncate">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-uf-gold" aria-hidden="true" />
                    <span className="truncate">
                      {e.nombre}
                      {formatoSeries(e) ? <span className="text-gray-400">{`  ${formatoSeries(e)}`}</span> : null}
                    </span>
                  </li>
                ))}
                {ejercicios.length > max && <li className="pl-3.5 text-gray-400">+{ejercicios.length - max} más</li>}
              </ul>
            )}
          </div>
          {grupos.length > 0 && (
            <div className={`shrink-0 text-center ${compacta ? 'w-20' : 'w-28 sm:w-32'}`}>
              <div ref={mapaRef} className={compacta ? 'h-28' : 'h-36 sm:h-44'}>
                <MuscleMap grupos={grupos} vista="ambas" className="h-full w-full" bodyColor="#3a3a3a" />
              </div>
              <p className="mt-1 line-clamp-2 font-anton text-[11px] uppercase leading-tight text-uf-gold sm:text-xs">{nombresGrupos(ejercicios)}</p>
            </div>
          )}
        </div>

        {stats.length > 0 && (
          <dl className="mt-4 grid border-t border-white/15 pt-3" style={{ gridTemplateColumns: `repeat(${stats.length}, minmax(0, 1fr))` }}>
            {stats.map((s) => (
              <div key={s.etiqueta}>
                <dt className="text-[10px] font-bold uppercase tracking-wider text-gray-400 sm:text-xs">{s.etiqueta}</dt>
                <dd className={`font-anton text-white ${compacta ? 'text-xl' : 'text-2xl sm:text-3xl'}`}>{s.valor}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </div>
  );
});

export default TarjetaEntreno;
