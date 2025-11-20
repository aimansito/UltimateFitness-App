// ============================================
// TARJETA EJERCICIO - Card de ejercicio
// ============================================
function TarjetaEjercicio({ ejercicio, isPremium, onClick }) {
  const estaBloqueado = ejercicio.esPremium && !isPremium;

  return (
    <div
      onClick={onClick}
      className={`
        relative bg-gradient-to-br from-gray-800 to-gray-900 
        rounded-xl overflow-hidden border-2 border-gray-700
        hover:border-uf-gold transition-all duration-300
        transform hover:scale-105 hover:shadow-2xl
        ${estaBloqueado ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}
      `}
    >
      {/* Imagen de fondo (placeholder) */}
      <div className="h-48 bg-gradient-to-br from-uf-gold/20 to-uf-blue/20 flex items-center justify-center relative">
        <svg className="w-24 h-24 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>

        {/* Badge Premium */}
        {estaBloqueado && (
          <div className="absolute top-3 right-3 bg-uf-gold text-black px-3 py-1 rounded-full font-bold text-xs flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" />
            </svg>
            PREMIUM
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="p-5">
        <h3 className="text-xl font-bold text-white mb-2 uppercase">
          {ejercicio.nombre}
        </h3>

        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {ejercicio.descripcion || 'Ejercicio de fuerza y resistencia'}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="bg-uf-blue/20 text-uf-blue px-3 py-1 rounded-full text-xs font-semibold uppercase">
            {ejercicio.grupoMuscular || 'General'}
          </span>
          <span className={`
            px-3 py-1 rounded-full text-xs font-semibold uppercase
            ${ejercicio.nivelDificultad === 'principiante' ? 'bg-green-500/20 text-green-400' : ''}
            ${ejercicio.nivelDificultad === 'intermedio' ? 'bg-yellow-500/20 text-yellow-400' : ''}
            ${ejercicio.nivelDificultad === 'avanzado' ? 'bg-red-500/20 text-red-400' : ''}
          `}>
            {ejercicio.nivelDificultad || 'Intermedio'}
          </span>
        </div>

        {/* Valoración */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-4 h-4 ${i < Math.floor(ejercicio.valoracionPromedio || 0) ? 'text-uf-gold' : 'text-gray-600'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="text-gray-400 text-sm ml-2">
              ({ejercicio.totalValoraciones || 0})
            </span>
          </div>

          {estaBloqueado && (
            <svg className="w-6 h-6 text-uf-gold" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}

export default TarjetaEjercicio;