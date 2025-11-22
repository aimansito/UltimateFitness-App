// ============================================
// MODAL RECETA - Vista detallada del plato
// ============================================
import { useEffect } from 'react';

function ModalReceta({ plato, onClose }) {
  const iconosDificultad = {
    'facil': { icon: '🟢', text: 'Fácil', color: 'green' },
    'media': { icon: '🟡', text: 'Media', color: 'yellow' },
    'dificil': { icon: '🔴', text: 'Difícil', color: 'red' }
  };

  const dificultad = iconosDificultad[plato.dificultad] || iconosDificultad.media;

  // Cerrar con ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Bloquear scroll del body
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-gradient-to-br from-gray-900 to-black max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-2xl border-2 border-uf-gold shadow-2xl animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="sticky top-0 bg-gradient-to-r from-uf-gold to-yellow-600 p-6 z-10">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-3xl font-anton font-bold text-black mb-2 uppercase">
                {plato.nombre}
              </h2>
              <p className="text-gray-800 mb-4">
                {plato.descripcion}
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="bg-black/20 text-black px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                  🕐 {plato.tiempo_preparacion} minutos
                </span>
                <span className={`bg-black/20 text-black px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1`}>
                  {dificultad.icon} {dificultad.text}
                </span>
                <span className="bg-black/20 text-black px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                  ⭐ {plato.valoracion_promedio} ({plato.total_valoraciones} valoraciones)
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="ml-4 bg-black/20 hover:bg-black/40 text-black rounded-full p-2 transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* CONTENIDO */}
        <div className="p-6">
          
          {/* VALORES NUTRICIONALES */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-6 mb-6 border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4 uppercase flex items-center gap-2">
              <svg className="w-6 h-6 text-uf-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Información Nutricional
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center bg-gray-800 rounded-lg p-4">
                <div className="text-4xl font-bold text-uf-gold mb-1">
                  {Math.round(plato.totales?.calorias || 0)}
                </div>
                <div className="text-gray-400 text-sm uppercase">Calorías</div>
              </div>
              <div className="text-center bg-gray-800 rounded-lg p-4">
                <div className="text-4xl font-bold text-red-400 mb-1">
                  {Math.round(plato.totales?.proteinas || 0)}g
                </div>
                <div className="text-gray-400 text-sm uppercase">Proteína</div>
              </div>
              <div className="text-center bg-gray-800 rounded-lg p-4">
                <div className="text-4xl font-bold text-blue-400 mb-1">
                  {Math.round(plato.totales?.carbohidratos || 0)}g
                </div>
                <div className="text-gray-400 text-sm uppercase">Carbos</div>
              </div>
              <div className="text-center bg-gray-800 rounded-lg p-4">
                <div className="text-4xl font-bold text-yellow-400 mb-1">
                  {Math.round(plato.totales?.grasas || 0)}g
                </div>
                <div className="text-gray-400 text-sm uppercase">Grasas</div>
              </div>
            </div>
          </div>

          {/* INGREDIENTES */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-6 mb-6 border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4 uppercase flex items-center gap-2">
              <svg className="w-6 h-6 text-uf-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Ingredientes
            </h3>
            <div className="space-y-3">
              {plato.ingredientes?.map((ing, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between bg-gray-800 p-4 rounded-lg hover:bg-gray-750 transition"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-2 h-2 bg-uf-gold rounded-full"></div>
                    <span className="text-white font-bold">{ing.nombre}</span>
                    <span className="text-gray-500">({ing.cantidad}g)</span>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <div className="text-center min-w-[50px]">
                      <div className="text-white font-bold">{Math.round(ing.calorias)}</div>
                      <div className="text-gray-500 text-xs">kcal</div>
                    </div>
                    <div className="hidden md:block text-center min-w-[40px]">
                      <div className="text-red-400 font-bold">{Math.round(ing.proteinas)}g</div>
                      <div className="text-gray-500 text-xs">P</div>
                    </div>
                    <div className="hidden md:block text-center min-w-[40px]">
                      <div className="text-blue-400 font-bold">{Math.round(ing.carbohidratos)}g</div>
                      <div className="text-gray-500 text-xs">C</div>
                    </div>
                    <div className="hidden md:block text-center min-w-[40px]">
                      <div className="text-yellow-400 font-bold">{Math.round(ing.grasas)}g</div>
                      <div className="text-gray-500 text-xs">G</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* INSTRUCCIONES */}
          {plato.instrucciones && (
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-6 mb-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4 uppercase flex items-center gap-2">
                <svg className="w-6 h-6 text-uf-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Instrucciones
              </h3>
              <div className="space-y-4">
                {plato.instrucciones.split('\n').map((paso, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-uf-gold text-black rounded-full flex items-center justify-center font-bold">
                      {idx + 1}
                    </div>
                    <p className="text-gray-300 flex-1 pt-1">
                      {paso.replace(/^\d+\.\s*/, '')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ACCIONES */}
          <div className="flex gap-4">
            <button className="flex-1 bg-gradient-to-r from-uf-gold to-yellow-600 text-black font-bold py-3 px-6 rounded-lg hover:from-yellow-600 hover:to-uf-gold transition-all duration-300 flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              Añadir a Favoritos
            </button>
            <button className="flex-1 bg-gray-700 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-600 transition-all duration-300 flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Compartir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalReceta;