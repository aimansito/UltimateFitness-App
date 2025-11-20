// ============================================
// MODAL EJERCICIO - Modal con detalles
// ============================================
import { useEffect } from 'react';

function ModalEjercicio({ ejercicio, onClose, isPremium }) {
  // Cerrar con ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Prevenir scroll del body
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-uf-dark to-black border-2 border-uf-gold/50 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        
        {/* ============================================ */}
        {/* HEADER */}
        {/* ============================================ */}
        <div className="sticky top-0 bg-uf-dark/95 backdrop-blur-sm border-b border-uf-gold/30 p-6 flex items-center justify-between z-10">
          <h2 className="text-3xl font-anton font-bold text-white uppercase">
            {ejercicio.nombre}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition p-2"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ============================================ */}
        {/* CONTENIDO */}
        {/* ============================================ */}
        <div className="p-6">
          
          {/* Tags superiores */}
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="bg-uf-blue/20 text-uf-blue px-4 py-2 rounded-full text-sm font-bold uppercase">
              {ejercicio.tipo || 'GYM'}
            </span>
            <span className="bg-uf-gold/20 text-uf-gold px-4 py-2 rounded-full text-sm font-bold uppercase">
              {ejercicio.grupoMuscular || 'General'}
            </span>
            <span className={`
              px-4 py-2 rounded-full text-sm font-bold uppercase
              ${ejercicio.nivelDificultad === 'principiante' ? 'bg-green-500/20 text-green-400' : ''}
              ${ejercicio.nivelDificultad === 'intermedio' ? 'bg-yellow-500/20 text-yellow-400' : ''}
              ${ejercicio.nivelDificultad === 'avanzado' ? 'bg-red-500/20 text-red-400' : ''}
            `}>
              {ejercicio.nivelDificultad || 'Intermedio'}
            </span>
          </div>

          {/* Valoración */}
          <div className="flex items-center gap-2 mb-6">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-6 h-6 ${i < Math.floor(ejercicio.valoracionPromedio || 0) ? 'text-uf-gold' : 'text-gray-600'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-white font-bold text-lg">
              {ejercicio.valoracionPromedio || '0.00'}
            </span>
            <span className="text-gray-400 text-sm">
              ({ejercicio.totalValoraciones || 0} valoraciones)
            </span>
          </div>

          {/* Descripción */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-uf-gold mb-3 uppercase">Descripción</h3>
            <p className="text-gray-300 leading-relaxed">
              {ejercicio.descripcion || 'Ejercicio compuesto para desarrollo de fuerza y masa muscular.'}
            </p>
          </div>

          {/* Video (si es premium y tiene URL) */}
          {isPremium && ejercicio.videoUrl && (
            <div className="mb-6">
              <h3 className="text-xl font-bold text-uf-gold mb-3 uppercase">Video Tutorial</h3>
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                <iframe
                  src={ejercicio.videoUrl}
                  className="w-full h-full"
                  allowFullScreen
                  title={ejercicio.nombre}
                />
              </div>
            </div>
          )}

          {/* Mensaje para no premium */}
          {!isPremium && (
            <div className="bg-gradient-to-r from-uf-gold/20 to-yellow-600/20 border-2 border-uf-gold rounded-xl p-6 text-center">
              <svg className="w-12 h-12 text-uf-gold mx-auto mb-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" />
              </svg>
              <h4 className="text-lg font-bold text-white mb-2">
                Contenido Premium
              </h4>
              <p className="text-gray-300 mb-4">
                Hazte Premium para acceder a videos HD y descripciones detalladas de ejecución
              </p>
              <button className="bg-uf-gold text-black font-bold px-6 py-3 rounded-lg hover:bg-yellow-500 transition">
                Actualizar a Premium
              </button>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex gap-4 mt-6">
            <button className="flex-1 bg-uf-blue text-white font-bold px-6 py-3 rounded-lg hover:bg-uf-gold hover:text-black transition uppercase">
              Añadir a Mi Rutina
            </button>
            <button className="flex-1 bg-gray-700 text-white font-bold px-6 py-3 rounded-lg hover:bg-gray-600 transition uppercase">
              Marcar Favorito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalEjercicio;