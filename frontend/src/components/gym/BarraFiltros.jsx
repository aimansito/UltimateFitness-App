// ============================================
// BARRA FILTROS - Filtros de ejercicios
// ============================================
function BarraFiltros({ 
  gruposMusculares, 
  musculoSeleccionado, 
  setMusculoSeleccionado,
  nivelSeleccionado,
  setNivelSeleccionado
}) {
  
  const niveles = [
    { id: '', nombre: 'Todos los niveles' },
    { id: 'principiante', nombre: 'Principiante' },
    { id: 'intermedio', nombre: 'Intermedio' },
    { id: 'avanzado', nombre: 'Avanzado' }
  ];

  return (
    <div className="mb-12">
      
      {/* ============================================ */}
      {/* GRUPOS MUSCULARES */}
      {/* ============================================ */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-3 justify-center">
          {gruposMusculares.map((grupo) => (
            <button
              key={grupo.id}
              onClick={() => setMusculoSeleccionado(grupo.id)}
              className={`
                px-6 py-3 rounded-lg font-bold uppercase text-sm transition-all duration-300
                ${musculoSeleccionado === grupo.id
                  ? 'bg-uf-gold text-black shadow-lg shadow-uf-gold/50'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                }
              `}
            >
              {grupo.nombre}
            </button>
          ))}
        </div>
      </div>

      {/* ============================================ */}
      {/* SELECTOR DE NIVEL */}
      {/* ============================================ */}
      <div className="flex justify-center">
        <select
          value={nivelSeleccionado}
          onChange={(e) => setNivelSeleccionado(e.target.value)}
          className="bg-gray-800 text-white border-2 border-gray-700 rounded-lg px-6 py-3 font-semibold uppercase focus:border-uf-gold focus:outline-none transition"
        >
          {niveles.map((nivel) => (
            <option key={nivel.id} value={nivel.id}>
              {nivel.nombre}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default BarraFiltros;