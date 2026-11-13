// ============================================
// BARRA FILTROS - Filtros de ejercicios
// ============================================
const NIVELES = [
  { id: '', nombre: 'Todos' },
  { id: 'principiante', nombre: 'Principiante' },
  { id: 'intermedio', nombre: 'Intermedio' },
  { id: 'avanzado', nombre: 'Avanzado' },
];

function BarraFiltros({
  gruposMusculares,
  musculoSeleccionado,
  setMusculoSeleccionado,
  nivelSeleccionado,
  setNivelSeleccionado,
}) {
  return (
    <div className="mb-10 flex flex-col items-center gap-5">
      <div className="flex flex-wrap justify-center gap-2" role="group" aria-label="Grupo muscular">
        {gruposMusculares.map((grupo) => (
          <button
            key={grupo.id}
            type="button"
            onClick={() => setMusculoSeleccionado(grupo.id)}
            aria-pressed={musculoSeleccionado === grupo.id}
            className={`rounded-full border px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
              musculoSeleccionado === grupo.id
                ? 'border-uf-gold bg-uf-gold text-black shadow-lg shadow-uf-gold/30'
                : 'border-uf-line bg-white/[0.03] text-gray-400 hover:border-uf-gold/60 hover:text-white'
            }`}
          >
            {grupo.nombre}
          </button>
        ))}
      </div>

      <div className="inline-flex max-w-full overflow-x-auto rounded-full border border-uf-line bg-uf-card p-1" role="group" aria-label="Nivel">
        {NIVELES.map((nivel) => (
          <button
            key={nivel.id}
            type="button"
            onClick={() => setNivelSeleccionado(nivel.id)}
            aria-pressed={nivelSeleccionado === nivel.id}
            className={`shrink-0 rounded-full px-2.5 py-2 text-[10px] font-bold uppercase tracking-wider transition-colors sm:px-4 sm:text-[11px] ${
              nivelSeleccionado === nivel.id ? 'bg-white text-black' : 'text-gray-400 hover:text-white'
            }`}
          >
            {nivel.nombre}
          </button>
        ))}
      </div>
    </div>
  );
}

export default BarraFiltros;
