// ============================================
// CONSTRUCTOR DE PLATOS PERSONALIZADO
// Permite crear platos desde cero eligiendo alimentos por categoría
// ============================================
import { useState, useEffect } from 'react';

function ConstructorPlatos({ onGuardarPlato, onCerrar }) {
  const [paso, setPaso] = useState(1); // 1: Categorías, 2: Detalles, 3: Confirmar
  const [nombrePlato, setNombrePlato] = useState('');
  const [descripcionPlato, setDescripcionPlato] = useState('');
  const [tipoComida, setTipoComida] = useState('almuerzo');
  const [ingredientesSeleccionados, setIngredientesSeleccionados] = useState([]);
  
  // Alimentos disponibles por categoría
  const [alimentosPorCategoria, setAlimentosPorCategoria] = useState({
    proteina: [],
    carbohidrato: [],
    grasa: [],
    verdura: [],
    fruta: [],
    lacteo: []
  });

  const [cargando, setCargando] = useState(true);
  const [totalesPlato, setTotalesPlato] = useState({
    calorias: 0,
    proteinas: 0,
    carbohidratos: 0,
    grasas: 0
  });

  const categorias = {
    proteina: { nombre: 'Proteínas', icon: '🥩', color: 'red' },
    carbohidrato: { nombre: 'Carbohidratos', icon: '🍚', color: 'blue' },
    grasa: { nombre: 'Grasas Saludables', icon: '🥑', color: 'green' },
    verdura: { nombre: 'Verduras', icon: '🥦', color: 'emerald' },
    fruta: { nombre: 'Frutas', icon: '🍎', color: 'orange' },
    lacteo: { nombre: 'Lácteos', icon: '🥛', color: 'purple' }
  };

  const tiposComida = {
    desayuno: { nombre: 'Desayuno', icon: '🌅' },
    media_manana: { nombre: 'Media Mañana', icon: '☕' },
    almuerzo: { nombre: 'Almuerzo', icon: '🍽️' },
    merienda: { nombre: 'Merienda', icon: '🍎' },
    cena: { nombre: 'Cena', icon: '🌙' },
    post_entreno: { nombre: 'Post-Entreno', icon: '💪' }
  };

  // Cargar alimentos por tipo
  useEffect(() => {
    cargarAlimentos();
  }, []);

  // Recalcular totales cuando cambian ingredientes
  useEffect(() => {
    calcularTotales();
  }, [ingredientesSeleccionados]);

  const cargarAlimentos = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/alimentos');
      const data = await response.json();

      if (data['hydra:member']) {
        const alimentos = data['hydra:member'];
        
        // Agrupar por tipo
        const agrupados = {
          proteina: alimentos.filter(a => a.tipoAlimento === 'proteina'),
          carbohidrato: alimentos.filter(a => a.tipoAlimento === 'carbohidrato'),
          grasa: alimentos.filter(a => a.tipoAlimento === 'grasa'),
          verdura: alimentos.filter(a => a.tipoAlimento === 'verdura'),
          fruta: alimentos.filter(a => a.tipoAlimento === 'fruta'),
          lacteo: alimentos.filter(a => a.tipoAlimento === 'lacteo')
        };

        setAlimentosPorCategoria(agrupados);
      }
    } catch (error) {
      console.error('Error cargando alimentos:', error);
    } finally {
      setCargando(false);
    }
  };

  const agregarIngrediente = (alimento, cantidad = 100) => {
    const nuevoIngrediente = {
      id: Date.now(),
      alimentoId: alimento.id,
      nombre: alimento.nombre,
      cantidad: cantidad,
      calorias: alimento.calorias,
      proteinas: alimento.proteinas,
      carbohidratos: alimento.carbohidratos,
      grasas: alimento.grasas,
      categoria: alimento.tipoAlimento
    };

    setIngredientesSeleccionados([...ingredientesSeleccionados, nuevoIngrediente]);
  };

  const eliminarIngrediente = (id) => {
    setIngredientesSeleccionados(ingredientesSeleccionados.filter(ing => ing.id !== id));
  };

  const actualizarCantidad = (id, nuevaCantidad) => {
    setIngredientesSeleccionados(ingredientesSeleccionados.map(ing =>
      ing.id === id ? { ...ing, cantidad: parseFloat(nuevaCantidad) || 0 } : ing
    ));
  };

  const calcularTotales = () => {
    const totales = ingredientesSeleccionados.reduce((acc, ing) => {
      const cantidad = ing.cantidad || 0;
      return {
        calorias: acc.calorias + ((ing.calorias * cantidad) / 100),
        proteinas: acc.proteinas + ((ing.proteinas * cantidad) / 100),
        carbohidratos: acc.carbohidratos + ((ing.carbohidratos * cantidad) / 100),
        grasas: acc.grasas + ((ing.grasas * cantidad) / 100)
      };
    }, { calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0 });

    setTotalesPlato(totales);
  };

  const guardarPlato = () => {
    if (!nombrePlato.trim()) {
      alert('Por favor, añade un nombre a tu plato');
      return;
    }

    if (ingredientesSeleccionados.length === 0) {
      alert('Añade al menos un ingrediente');
      return;
    }

    const platoCreado = {
      id: Date.now(),
      tipo: 'plato_personalizado',
      nombre: nombrePlato,
      descripcion: descripcionPlato || `Plato personalizado con ${ingredientesSeleccionados.length} ingredientes`,
      tipoComida: tipoComida,
      ingredientes: ingredientesSeleccionados,
      totales: totalesPlato,
      esPersonalizado: true
    };

    onGuardarPlato(platoCreado);
    onCerrar();
  };

  if (cargando) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-uf-gold"></div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-gradient-to-br from-gray-900 to-black max-w-6xl w-full max-h-[95vh] overflow-y-auto rounded-2xl border-2 border-uf-gold shadow-2xl">
        
        {/* HEADER */}
        <div className="sticky top-0 bg-gradient-to-r from-uf-gold to-yellow-600 p-6 z-10">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-3xl font-anton font-bold text-black mb-2 uppercase">
                🔨 Construye Tu Plato Personalizado
              </h2>
              <p className="text-gray-800">
                Selecciona ingredientes de cada categoría y crea tu receta perfecta
              </p>
            </div>
            <button
              onClick={onCerrar}
              className="ml-4 bg-black/20 hover:bg-black/40 text-black rounded-full p-2 transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* PROGRESO */}
          <div className="mt-4 flex items-center gap-2">
            <div className={`flex-1 h-2 rounded-full ${paso >= 1 ? 'bg-black' : 'bg-black/20'}`}></div>
            <div className={`flex-1 h-2 rounded-full ${paso >= 2 ? 'bg-black' : 'bg-black/20'}`}></div>
            <div className={`flex-1 h-2 rounded-full ${paso >= 3 ? 'bg-black' : 'bg-black/20'}`}></div>
          </div>
          <div className="mt-2 flex justify-between text-xs text-black font-bold">
            <span>1. Ingredientes</span>
            <span>2. Detalles</span>
            <span>3. Confirmar</span>
          </div>
        </div>

        <div className="p-6">
          
          {/* PASO 1: SELECCIÓN DE INGREDIENTES */}
          {paso === 1 && (
            <div className="space-y-6">
              
              {/* INGREDIENTES SELECCIONADOS */}
              {ingredientesSeleccionados.length > 0 && (
                <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-6 border-2 border-uf-gold">
                  <h3 className="text-xl font-bold text-white mb-4 uppercase flex items-center gap-2">
                    <svg className="w-6 h-6 text-uf-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Tu Plato ({ingredientesSeleccionados.length} ingredientes)
                  </h3>
                  
                  <div className="space-y-3 mb-4">
                    {ingredientesSeleccionados.map((ing) => (
                      <div key={ing.id} className="flex items-center gap-3 bg-gray-800 p-3 rounded-lg">
                        <div className="w-2 h-2 bg-uf-gold rounded-full"></div>
                        <div className="flex-1">
                          <span className="text-white font-bold">{ing.nombre}</span>
                          <span className="text-gray-500 text-sm ml-2">({categorias[ing.categoria]?.nombre})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={ing.cantidad}
                            onChange={(e) => actualizarCantidad(ing.id, e.target.value)}
                            className="w-20 bg-gray-700 text-white px-2 py-1 rounded text-center"
                            min="1"
                          />
                          <span className="text-gray-400 text-sm">g</span>
                        </div>
                        <div className="text-gray-400 text-sm min-w-[70px] text-right">
                          {Math.round((ing.calorias * ing.cantidad) / 100)} kcal
                        </div>
                        <button
                          onClick={() => eliminarIngrediente(ing.id)}
                          className="text-red-400 hover:text-red-300 transition"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* TOTALES PARCIALES */}
                  <div className="grid grid-cols-4 gap-4 pt-4 border-t border-gray-700">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-uf-gold">{Math.round(totalesPlato.calorias)}</div>
                      <div className="text-gray-400 text-xs">kcal</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-400">{Math.round(totalesPlato.proteinas)}g</div>
                      <div className="text-gray-400 text-xs">Proteínas</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">{Math.round(totalesPlato.carbohidratos)}g</div>
                      <div className="text-gray-400 text-xs">Carbos</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-400">{Math.round(totalesPlato.grasas)}g</div>
                      <div className="text-gray-400 text-xs">Grasas</div>
                    </div>
                  </div>
                </div>
              )}

              {/* CATEGORÍAS DE ALIMENTOS */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white uppercase">Selecciona Ingredientes por Categoría:</h3>
                
                {Object.entries(categorias).map(([key, cat]) => (
                  <div key={key} className="bg-gray-800 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl">{cat.icon}</span>
                      <h4 className="text-lg font-bold text-white">{cat.nombre}</h4>
                      <span className="text-gray-500 text-sm">({alimentosPorCategoria[key]?.length || 0} opciones)</span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {alimentosPorCategoria[key]?.slice(0, 8).map((alimento) => (
                        <button
                          key={alimento.id}
                          onClick={() => agregarIngrediente(alimento)}
                          className={`text-left p-3 rounded-lg border-2 transition hover:scale-105 bg-gray-700 border-gray-600 hover:border-${cat.color}-500`}
                        >
                          <div className="font-bold text-white text-sm">{alimento.nombre}</div>
                          <div className="text-gray-400 text-xs mt-1">
                            {alimento.calorias} kcal/100g
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* BOTÓN SIGUIENTE */}
              <button
                onClick={() => setPaso(2)}
                disabled={ingredientesSeleccionados.length === 0}
                className="w-full bg-gradient-to-r from-uf-gold to-yellow-600 text-black font-bold py-4 rounded-lg hover:from-yellow-600 hover:to-uf-gold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                Continuar a Detalles
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          )}

          {/* PASO 2: DETALLES DEL PLATO */}
          {paso === 2 && (
            <div className="space-y-6">
              <div className="bg-gray-800 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4 uppercase">Detalles de Tu Plato</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 text-sm mb-2 font-bold">Nombre del Plato *</label>
                    <input
                      type="text"
                      value={nombrePlato}
                      onChange={(e) => setNombrePlato(e.target.value)}
                      placeholder="Ej: Mi Bowl Proteico Favorito"
                      className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-uf-gold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm mb-2 font-bold">Descripción (opcional)</label>
                    <textarea
                      value={descripcionPlato}
                      onChange={(e) => setDescripcionPlato(e.target.value)}
                      placeholder="Ej: Plato completo rico en proteínas para después del entrenamiento"
                      rows="3"
                      className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-uf-gold focus:outline-none"
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm mb-2 font-bold">¿Para qué momento del día?</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {Object.entries(tiposComida).map(([key, tipo]) => (
                        <label key={key}>
                          <input
                            type="radio"
                            name="tipoComida"
                            value={key}
                            checked={tipoComida === key}
                            onChange={(e) => setTipoComida(e.target.value)}
                            className="hidden"
                          />
                          <div className={`cursor-pointer text-center py-3 rounded-lg border-2 transition ${
                            tipoComida === key
                              ? 'bg-uf-gold text-black border-uf-gold'
                              : 'bg-gray-700 text-white border-gray-600 hover:border-gray-500'
                          }`}>
                            <div className="text-xl mb-1">{tipo.icon}</div>
                            <div className="font-bold text-sm">{tipo.nombre}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setPaso(1)}
                  className="flex-1 bg-gray-700 text-white font-bold py-3 rounded-lg hover:bg-gray-600 transition"
                >
                  ← Volver
                </button>
                <button
                  onClick={() => setPaso(3)}
                  className="flex-1 bg-gradient-to-r from-uf-gold to-yellow-600 text-black font-bold py-3 rounded-lg hover:from-yellow-600 hover:to-uf-gold transition"
                >
                  Revisar Plato →
                </button>
              </div>
            </div>
          )}

          {/* PASO 3: CONFIRMACIÓN */}
          {paso === 3 && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-uf-gold/20 to-yellow-600/20 border-2 border-uf-gold rounded-xl p-6">
                <h3 className="text-2xl font-anton font-bold text-white mb-2 uppercase">{nombrePlato}</h3>
                <p className="text-gray-400 mb-4">{descripcionPlato || 'Plato personalizado'}</p>
                
                <div className="flex items-center gap-4 mb-4">
                  <span className="bg-gray-800 text-white px-4 py-2 rounded-lg font-bold">
                    {tiposComida[tipoComida].icon} {tiposComida[tipoComida].nombre}
                  </span>
                  <span className="bg-gray-800 text-white px-4 py-2 rounded-lg">
                    {ingredientesSeleccionados.length} ingredientes
                  </span>
                </div>

                {/* TOTALES */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div className="text-center bg-gray-800 rounded-lg p-4">
                    <div className="text-3xl font-bold text-uf-gold">{Math.round(totalesPlato.calorias)}</div>
                    <div className="text-gray-400 text-sm">kcal</div>
                  </div>
                  <div className="text-center bg-gray-800 rounded-lg p-4">
                    <div className="text-3xl font-bold text-red-400">{Math.round(totalesPlato.proteinas)}g</div>
                    <div className="text-gray-400 text-sm">Proteínas</div>
                  </div>
                  <div className="text-center bg-gray-800 rounded-lg p-4">
                    <div className="text-3xl font-bold text-blue-400">{Math.round(totalesPlato.carbohidratos)}g</div>
                    <div className="text-gray-400 text-sm">Carbos</div>
                  </div>
                  <div className="text-center bg-gray-800 rounded-lg p-4">
                    <div className="text-3xl font-bold text-yellow-400">{Math.round(totalesPlato.grasas)}g</div>
                    <div className="text-gray-400 text-sm">Grasas</div>
                  </div>
                </div>

                {/* INGREDIENTES */}
                <h4 className="text-lg font-bold text-white mb-3 uppercase">Ingredientes:</h4>
                <div className="space-y-2">
                  {ingredientesSeleccionados.map((ing) => (
                    <div key={ing.id} className="flex items-center justify-between bg-gray-800 p-3 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-uf-gold rounded-full"></div>
                        <span className="text-white">{ing.nombre}</span>
                        <span className="text-gray-500 text-sm">({ing.cantidad}g)</span>
                      </div>
                      <div className="text-gray-400 text-sm">
                        {Math.round((ing.calorias * ing.cantidad) / 100)} kcal
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setPaso(2)}
                  className="flex-1 bg-gray-700 text-white font-bold py-3 rounded-lg hover:bg-gray-600 transition"
                >
                  ← Editar
                </button>
                <button
                  onClick={guardarPlato}
                  className="flex-1 bg-gradient-to-r from-uf-gold to-yellow-600 text-black font-bold py-3 rounded-lg hover:from-yellow-600 hover:to-uf-gold transition flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Añadir a Mi Dieta
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default ConstructorPlatos;