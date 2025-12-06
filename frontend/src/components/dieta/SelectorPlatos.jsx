// ============================================
// SELECTOR DE PLATOS PREDEFINIDOS
// Muestra platos del catálogo filtrados por tipo de comida
// ============================================
import { useState, useEffect } from "react";

function SelectorPlatos({ tipoComida, onSeleccionar, onCerrar }) {
  const [platos, setPlatos] = useState([]);
  const [platoSeleccionado, setPlatoSeleccionado] = useState(null);
  const [cargando, setCargando] = useState(true);

  const iconosDificultad = {
    facil: { icon: "🟢", text: "Fácil" },
    media: { icon: "🟡", text: "Media" },
    dificil: { icon: "🔴", text: "Difícil" },
  };

  useEffect(() => {
    cargarPlatos();
  }, [tipoComida]);

  const cargarPlatos = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/platos");
      const data = await response.json();

      console.log("📥 Platos cargados:", data);

      if (data.success) {
        // Filtrar por tipo de comida si es necesario
        const platosFiltrados = data.platos;
        setPlatos(platosFiltrados);
      }
    } catch (error) {
      console.error("Error cargando platos:", error);
    } finally {
      setCargando(false);
    }
  };

  const seleccionarPlato = async (platoId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/platos/${platoId}`
      );
      const data = await response.json();

      console.log("📥 Detalle del plato:", data);

      if (data.success) {
        setPlatoSeleccionado(data.plato);
      }
    } catch (error) {
      console.error("Error cargando detalle del plato:", error);
    }
  };

  const confirmarSeleccion = () => {
    if (platoSeleccionado) {
      // Transformar ingredientes al formato esperado
      const ingredientesTransformados = (platoSeleccionado.ingredientes || []).map(ing => ({
        nombre: ing.alimento?.nombre || ing.nombre || 'Ingrediente',
        cantidad: ing.cantidad_gramos || ing.cantidad || 0
      }));

      // Preparar plato para añadir a la dieta
      const platoParaDieta = {
        id: platoSeleccionado.id,
        tipo: "plato",
        nombre: platoSeleccionado.nombre,
        descripcion: platoSeleccionado.descripcion,
        tipoComida: platoSeleccionado.tipo_comida,
        ingredientes: ingredientesTransformados,
        totales: {
          calorias: parseFloat(platoSeleccionado.calorias_totales) || 0,
          proteinas: parseFloat(platoSeleccionado.proteinas_totales) || 0,
          carbohidratos:
            parseFloat(platoSeleccionado.carbohidratos_totales) || 0,
          grasas: parseFloat(platoSeleccionado.grasas_totales) || 0,
        },
        esPersonalizado: false,
      };

      console.log('✅ Plato preparado para dieta:', platoParaDieta);
      onSeleccionar(platoParaDieta);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-gradient-to-br from-gray-900 to-black max-w-5xl w-full max-h-[95vh] overflow-y-auto rounded-2xl border-2 border-uf-gold shadow-2xl">
        {/* HEADER */}
        <div className="sticky top-0 bg-gradient-to-r from-uf-gold to-yellow-600 p-6 z-10">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-2xl font-anton font-bold text-black uppercase">
                Platos Predefinidos
              </h3>
              <p className="text-gray-800 text-sm">
                Elige una receta completa de nuestro catálogo
              </p>
            </div>
            <button
              onClick={onCerrar}
              className="bg-black/20 hover:bg-black/40 text-black rounded-full p-2 transition"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6">
          {!platoSeleccionado ? (
            <>
              {/* LISTA DE PLATOS */}
              {cargando ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-uf-gold mx-auto mb-4"></div>
                  <p className="text-gray-400">Cargando platos...</p>
                </div>
              ) : platos.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {platos.map((plato) => (
                    <button
                      key={plato.id}
                      onClick={() => seleccionarPlato(plato.id)}
                      className="text-left bg-gray-800 hover:bg-gray-700 rounded-xl p-4 border-2 border-gray-700 hover:border-uf-gold transition group"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-white group-hover:text-uf-gold transition mb-1">
                            {plato.nombre}
                          </h4>
                          <p className="text-gray-400 text-sm line-clamp-2">
                            {plato.descripcion}
                          </p>
                        </div>
                        <div className="text-right ml-4">
                          <div className="text-2xl font-bold text-uf-gold">
                            {Math.round(plato.calorias_totales)}
                          </div>
                          <div className="text-gray-500 text-xs">kcal</div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs">
                          🕐 {plato.tiempo_preparacion} min
                        </span>
                        <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs">
                          {iconosDificultad[plato.dificultad]?.icon}{" "}
                          {iconosDificultad[plato.dificultad]?.text}
                        </span>
                        <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs">
                          ⭐ {plato.valoracion_promedio}
                        </span>
                      </div>

                      <div className="flex justify-between text-sm pt-3 border-t border-gray-700">
                        <div className="text-center">
                          <div className="text-red-400 font-bold">
                            {Math.round(plato.proteinas_totales)}g
                          </div>
                          <div className="text-gray-500 text-xs">P</div>
                        </div>
                        <div className="text-center">
                          <div className="text-blue-400 font-bold">
                            {Math.round(plato.carbohidratos_totales)}g
                          </div>
                          <div className="text-gray-500 text-xs">C</div>
                        </div>
                        <div className="text-center">
                          <div className="text-yellow-400 font-bold">
                            {Math.round(plato.grasas_totales)}g
                          </div>
                          <div className="text-gray-500 text-xs">G</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <svg
                    className="w-20 h-20 mx-auto mb-4 opacity-30"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-xl">No hay platos disponibles</p>
                  <p className="text-sm mt-2">
                    Prueba creando tu propio plato personalizado
                  </p>
                </div>
              )}
            </>
          ) : (
            <>
              {/* DETALLE DEL PLATO */}
              <div className="space-y-6">
                <div className="bg-gray-800 rounded-xl p-6">
                  <h4 className="text-2xl font-bold text-white mb-2">
                    {platoSeleccionado.nombre}
                  </h4>
                  <p className="text-gray-400 mb-4">
                    {platoSeleccionado.descripcion}
                  </p>

                  <div className="flex flex-wrap gap-3 mb-4">
                    <span className="bg-gray-700 text-white px-3 py-1 rounded-lg">
                      🕐 {platoSeleccionado.tiempo_preparacion} minutos
                    </span>
                    <span className="bg-gray-700 text-white px-3 py-1 rounded-lg">
                      {iconosDificultad[platoSeleccionado.dificultad]?.icon}{" "}
                      {iconosDificultad[platoSeleccionado.dificultad]?.text}
                    </span>
                    <span className="bg-gray-700 text-white px-3 py-1 rounded-lg">
                      ⭐ {platoSeleccionado.valoracion_promedio} (
                      {platoSeleccionado.total_valoraciones})
                    </span>
                  </div>

                  {/* TOTALES */}
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className="text-center bg-gray-700 rounded-lg p-3">
                      <div className="text-3xl font-bold text-uf-gold">
                        {Math.round(platoSeleccionado.calorias_totales)}
                      </div>
                      <div className="text-gray-400 text-xs">kcal</div>
                    </div>
                    <div className="text-center bg-gray-700 rounded-lg p-3">
                      <div className="text-3xl font-bold text-red-400">
                        {Math.round(platoSeleccionado.proteinas_totales)}g
                      </div>
                      <div className="text-gray-400 text-xs">Proteínas</div>
                    </div>
                    <div className="text-center bg-gray-700 rounded-lg p-3">
                      <div className="text-3xl font-bold text-blue-400">
                        {Math.round(platoSeleccionado.carbohidratos_totales)}g
                      </div>
                      <div className="text-gray-400 text-xs">Carbos</div>
                    </div>
                    <div className="text-center bg-gray-700 rounded-lg p-3">
                      <div className="text-3xl font-bold text-yellow-400">
                        {Math.round(platoSeleccionado.grasas_totales)}g
                      </div>
                      <div className="text-gray-400 text-xs">Grasas</div>
                    </div>
                  </div>

                  {/* INGREDIENTES */}
                  <h5 className="text-lg font-bold text-white mb-3 uppercase">
                    Ingredientes:
                  </h5>
                  <div className="space-y-2">
                    {platoSeleccionado.ingredientes?.map((ing, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between bg-gray-700 p-3 rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-uf-gold rounded-full"></div>
                          <span className="text-white">
                            {ing.alimento.nombre}
                          </span>
                          <span className="text-gray-500 text-sm">
                            ({ing.cantidad_gramos}g)
                          </span>
                        </div>
                        <div className="text-gray-400 text-sm">
                          {Math.round(ing.calorias)} kcal
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* BOTONES */}
                <div className="flex gap-4">
                  <button
                    onClick={() => setPlatoSeleccionado(null)}
                    className="flex-1 bg-gray-700 text-white font-bold py-3 rounded-lg hover:bg-gray-600 transition"
                  >
                    ← Volver
                  </button>
                  <button
                    onClick={confirmarSeleccion}
                    className="flex-1 bg-gradient-to-r from-uf-gold to-yellow-600 text-black font-bold py-3 rounded-lg hover:from-yellow-600 hover:to-uf-gold transition"
                  >
                    Añadir a Mi Dieta
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default SelectorPlatos;
