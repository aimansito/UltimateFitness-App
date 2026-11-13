// ============================================
// MODAL EJERCICIO - Modal con detalles
// ============================================
import { PAGOS } from "../../config/funciones";
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Lock, Star, X } from 'lucide-react';
import MuscleMap from '../common/MuscleMap';

const NIVEL_STYLES = {
  principiante: 'border-green-500/30 bg-green-500/10 text-green-400',
  intermedio: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400',
  avanzado: 'border-red-500/30 bg-red-500/10 text-red-400',
};

function ModalEjercicio({ ejercicio, onClose, isPremium }) {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const nivelClase = NIVEL_STYLES[ejercicio.nivelDificultad] || 'border-uf-line bg-white/5 text-gray-400';

  return (
    <div
      className="animate-fadeIn fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={ejercicio.nombre}
    >
      <div
        className="uf-card animate-scaleIn max-h-[90vh] w-full max-w-3xl overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-uf-line bg-uf-card/95 px-6 py-5 backdrop-blur">
          <h2 className="font-anton text-2xl uppercase text-white md:text-3xl">{ejercicio.nombre}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-uf-line text-gray-400 transition hover:border-uf-gold hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-6 p-6 md:grid-cols-[220px_1fr]">
          {/* Zona trabajada */}
          <div className="rounded-2xl border border-uf-line bg-black/40 p-4 text-center">
            <span className="uf-eyebrow justify-center">Zona trabajada</span>
            <MuscleMap grupo={ejercicio.grupoMuscular} vista="ambas" className="mt-4 h-52" />
            <p className="mt-3 font-anton text-xl uppercase text-uf-gold">{ejercicio.grupoMuscular || 'General'}</p>
          </div>

          <div>
            <div className="mb-5 flex flex-wrap gap-2">
              <span className="uf-chip">{ejercicio.tipo || 'Gym'}</span>
              <span className={`rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${nivelClase}`}>
                {ejercicio.nivelDificultad || 'Intermedio'}
              </span>
            </div>

            <div className="mb-6 flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${i < Math.floor(ejercicio.valoracionPromedio || 0) ? 'fill-uf-gold text-uf-gold' : 'text-gray-700'}`}
                    aria-hidden="true"
                  />
                ))}
              </div>
              <span className="font-bold text-white">{ejercicio.valoracionPromedio || '0.00'}</span>
              <span className="text-sm text-uf-muted">({ejercicio.totalValoraciones || 0} valoraciones)</span>
            </div>

            <h3 className="font-audiowide text-xs uppercase tracking-widest text-uf-gold">Descripción</h3>
            <p className="mt-2 leading-relaxed text-gray-300">
              {ejercicio.descripcion || 'Ejercicio compuesto para desarrollo de fuerza y masa muscular.'}
            </p>

            {isPremium && ejercicio.videoUrl && (
              <div className="mt-6">
                <h3 className="font-audiowide text-xs uppercase tracking-widest text-uf-gold">Video tutorial</h3>
                <div className="mt-3 aspect-video overflow-hidden rounded-xl bg-black">
                  <iframe src={ejercicio.videoUrl} className="h-full w-full" allowFullScreen title={ejercicio.nombre} />
                </div>
              </div>
            )}

            {!isPremium && (
              <div className="mt-6 flex items-center gap-4 rounded-2xl border border-uf-gold/40 bg-uf-gold/5 p-4">
                <Lock className="h-6 w-6 shrink-0 text-uf-gold" />
                <p className="flex-1 text-sm text-gray-300">
                  {PAGOS
                    ? 'Los videos HD y la técnica detallada están incluidos en Premium.'
                    : 'Crea tu cuenta gratis para ver los videos y la técnica detallada.'}
                </p>
                <Link to={PAGOS ? '/upgrade-premium' : '/register'} className="uf-btn uf-btn-primary shrink-0 !px-4 !py-2.5">
                  {PAGOS ? 'Ver Premium' : 'Crear cuenta'}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalEjercicio;
