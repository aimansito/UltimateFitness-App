// ============================================
// TARJETA EJERCICIO - Card de ejercicio
// ============================================
import { Star, Lock } from 'lucide-react';
import MuscleMap from '../common/MuscleMap';

const NIVEL_STYLES = {
  principiante: 'border-green-500/30 bg-green-500/10 text-green-400',
  intermedio: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400',
  avanzado: 'border-red-500/30 bg-red-500/10 text-red-400',
};

function TarjetaEjercicio({ ejercicio, isPremium, onClick }) {
  const estaBloqueado = ejercicio.esPremium && !isPremium;
  const nivelClase = NIVEL_STYLES[ejercicio.nivelDificultad] || 'border-uf-line bg-white/5 text-gray-400';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`uf-card group flex w-full items-stretch gap-4 overflow-hidden p-5 text-left ${
        estaBloqueado ? 'cursor-not-allowed opacity-70' : 'uf-card-hover cursor-pointer'
      }`}
    >
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="mb-3 flex items-center gap-2">
          <span className="uf-chip border-uf-gold/30 bg-uf-gold/10 text-uf-gold">
            {ejercicio.grupoMuscular || 'General'}
          </span>
          {estaBloqueado && <Lock className="h-4 w-4 text-uf-gold" aria-label="Contenido premium" />}
        </div>

        <h3 className="font-anton text-xl uppercase leading-tight text-white transition-colors group-hover:text-uf-gold">
          {ejercicio.nombre}
        </h3>

        <p className="mt-2 line-clamp-2 flex-1 text-xs leading-relaxed text-uf-muted">
          {ejercicio.descripcion || 'Ejercicio de fuerza y resistencia'}
        </p>

        <div className="mt-4 flex items-center justify-between gap-2">
          <span className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${nivelClase}`}>
            {ejercicio.nivelDificultad || 'Intermedio'}
          </span>
          <span className="flex items-center gap-1 text-xs">
            <Star className="h-3.5 w-3.5 fill-uf-gold text-uf-gold" aria-hidden="true" />
            <span className="font-bold text-white">{ejercicio.valoracionPromedio || '0.0'}</span>
            <span className="text-gray-600">({ejercicio.totalValoraciones || 0})</span>
          </span>
        </div>
      </div>

      <MuscleMap grupo={ejercicio.grupoMuscular} className="h-32 w-16 shrink-0 self-center" />
    </button>
  );
}

export default TarjetaEjercicio;
