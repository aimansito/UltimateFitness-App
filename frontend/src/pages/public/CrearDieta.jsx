import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { X, Plus, ChevronRight, Loader, Save } from "lucide-react";

function CrearDieta() {
  const navigate = useNavigate();
  const [paso, setPaso] = useState(1);
  const [alimentos, setAlimentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);

  // Estado del plato
  const [platoData, setPlatoData] = useState({
    nombre: "",
    descripcion: "",
    calorias_totales: 0,
    proteinas_totales: 0,
    carbohidratos_totales: 0,
    grasas_totales: 0,
    ingredientes: [],
  });

  // Ingredientes seleccionados por categoría
  const [ingredientesSeleccionados, setIngredientesSeleccionados] = useState({
    proteina: [],
    carbohidrato: [],
    grasa: [],
    verdura: [],
    fruta: [],
    lacteo: [],
  });

  const categorias = [
    { key: "proteina", label: "Proteínas", icon: "🥩", color: "red" },
    {
      key: "carbohidrato",
      label: "Carbohidratos",
      icon: "🍚",
      color: "yellow",
    },
    { key: "grasa", label: "Grasas Saludables", icon: "🥑", color: "green" },
    { key: "verdura", label: "Verduras", icon: "🥗", color: "emerald" },
    { key: "fruta", label: "Frutas", icon: "🍓", color: "pink" },
    { key: "lacteo", label: "Lácteos", icon: "🥛", color: "blue" },
  ];

  useEffect(() => {
    fetchAlimentos();
  }, []);

  const fetchAlimentos = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8000/api/alimentos");

      if (response.data.success) {
        console.log("Alimentos cargados:", response.data.alimentos.length);
        setAlimentos(response.data.alimentos);
      }
    } catch (error) {
      console.error("Error al cargar alimentos:", error);
      alert("Error al cargar alimentos. Por favor, recarga la página.");
    } finally {
      setLoading(false);
    }
  };

  const toggleIngrediente = (categoria, alimento) => {
    setIngredientesSeleccionados((prev) => {
      const yaSeleccionado = prev[categoria].some(
        (ing) => ing.id === alimento.id
      );

      if (yaSeleccionado) {
        return {
          ...prev,
          [categoria]: prev[categoria].filter((ing) => ing.id !== alimento.id),
        };
      } else {
        return {
          ...prev,
          [categoria]: [...prev[categoria], alimento],
        };
      }
    });
  };

  const calcularTotales = () => {
    const todosIngredientes = Object.values(ingredientesSeleccionados).flat();

    const totales = todosIngredientes.reduce(
      (acc, ing) => ({
        calorias: acc.calorias + (parseFloat(ing.calorias) || 0),
        proteinas: acc.proteinas + (parseFloat(ing.proteinas) || 0),
        carbohidratos: acc.carbohidratos + (parseFloat(ing.carbohidratos) || 0),
        grasas: acc.grasas + (parseFloat(ing.grasas) || 0),
      }),
      { calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0 }
    );

    return totales;
  };

  const handleContinuar = () => {
    const todosIngredientes = Object.values(ingredientesSeleccionados).flat();

    if (todosIngredientes.length === 0) {
      alert("Debes seleccionar al menos un ingrediente");
      return;
    }

    setPaso(2);
  };

  const handleGuardarPlato = async () => {
    if (!platoData.nombre.trim()) {
      alert("Debes dar un nombre al plato");
      return;
    }

    try {
      setGuardando(true);

      const totales = calcularTotales();
      const todosIngredientes = Object.values(ingredientesSeleccionados).flat();

      const dataToSend = {
        nombre: platoData.nombre,
        descripcion: platoData.descripcion || "Plato personalizado",
        tipo_comida: "almuerzo",
        ingredientes: todosIngredientes.map((ing, index) => ({
          alimento_id: ing.id,
          cantidad_gramos: 100,
        })),
      };

      console.log("📤 Enviando:", dataToSend);

      const response = await axios.post(
        "http://localhost:8000/api/platos",
        dataToSend
      );

      console.log("✅ Respuesta:", response.data);

      if (response.data.success) {
        alert("¡Plato creado exitosamente!");
        navigate("/mis-platos"); // ← CAMBIO AQUÍ
      } else {
        alert("Error: " + (response.data.error || "Error desconocido"));
      }
    } catch (error) {
      console.error("❌ Error:", error);
      console.error("❌ Detalle:", error.response?.data);
      alert("Error al guardar el plato");
    } finally {
      setGuardando(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-uf-darker via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <Loader className="animate-spin h-16 w-16 text-uf-gold mx-auto mb-4" />
          <p className="text-white text-xl">Cargando alimentos...</p>
        </div>
      </div>
    );
  }

  const totales = calcularTotales();
  const totalIngredientes = Object.values(ingredientesSeleccionados).flat()
    .length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-uf-darker via-gray-900 to-black py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-uf-gold to-yellow-600 py-6 px-8 rounded-t-lg">
          <h1 className="text-3xl font-bold text-black uppercase tracking-wider flex items-center gap-3">
            🔧 Construye tu Plato Personalizado
          </h1>
          <p className="text-gray-800 mt-2">
            Selecciona ingredientes de cada categoría y crea tu receta perfecta
          </p>
        </div>

        {/* Progress bar */}
        <div className="bg-gray-800 py-4 px-8 border-b-2 border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span
              className={`font-bold ${
                paso === 1 ? "text-uf-gold" : "text-gray-500"
              }`}
            >
              1. Ingredientes
            </span>
            <span
              className={`font-bold ${
                paso === 2 ? "text-uf-gold" : "text-gray-500"
              }`}
            >
              2. Detalles
            </span>
            <span className="font-bold text-gray-500">3. Confirmar</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-uf-gold to-yellow-600 transition-all duration-500"
              style={{ width: `${(paso / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Contenido */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-b-lg">
          {/* PASO 1: Seleccionar ingredientes */}
          {paso === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 uppercase">
                Selecciona ingredientes por categoría:
              </h2>

              <div className="space-y-6">
                {categorias.map((cat) => {
                  const alimentosCategoria = alimentos.filter((a) => {
                    const match =
                      a.tipo_alimento === cat.key || a.categoria === cat.key;
                    if (cat.key === "proteina") {
                      console.log(
                        "Alimento:",
                        a.nombre,
                        "tipo:",
                        a.tipo_alimento,
                        "match:",
                        match
                      );
                    }
                    return match;
                  });
                  const seleccionados =
                    ingredientesSeleccionados[cat.key].length;

                  return (
                    <div
                      key={cat.key}
                      className={`bg-gradient-to-br from-${cat.color}-900/40 to-${cat.color}-800/20 border-2 border-${cat.color}-700 rounded-lg p-6`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                          <span className="text-3xl">{cat.icon}</span>
                          {cat.label}
                        </h3>
                        <span className="text-gray-400 text-sm">
                          {seleccionados} seleccionados
                        </span>
                      </div>

                      {alimentosCategoria.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {alimentosCategoria.map((alimento) => {
                            const isSelected = ingredientesSeleccionados[
                              cat.key
                            ].some((ing) => ing.id === alimento.id);

                            return (
                              <button
                                key={alimento.id}
                                onClick={() =>
                                  toggleIngrediente(cat.key, alimento)
                                }
                                className={`p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                                  isSelected
                                    ? `bg-${cat.color}-500 border-${cat.color}-400 text-white`
                                    : "bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600"
                                }`}
                              >
                                <p className="font-bold mb-1">
                                  {alimento.nombre}
                                </p>
                                <div className="text-xs space-y-1">
                                  <p>🔥 {alimento.calorias} kcal</p>
                                  <p>💪 {alimento.proteinas}g proteínas</p>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-gray-400 text-center py-4">
                          No hay alimentos en esta categoría
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Totales y botón continuar */}
              <div className="mt-8 bg-gray-900 rounded-lg p-6 border-2 border-uf-gold">
                <h3 className="text-xl font-bold text-white mb-4">
                  Resumen Nutricional:
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gray-800 p-4 rounded-lg text-center">
                    <p className="text-gray-400 text-sm">Calorías</p>
                    <p className="text-2xl font-bold text-uf-gold">
                      {Math.round(totales.calorias)}
                    </p>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-lg text-center">
                    <p className="text-gray-400 text-sm">Proteínas</p>
                    <p className="text-2xl font-bold text-green-400">
                      {Math.round(totales.proteinas * 10) / 10}g
                    </p>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-lg text-center">
                    <p className="text-gray-400 text-sm">Carbos</p>
                    <p className="text-2xl font-bold text-yellow-400">
                      {Math.round(totales.carbohidratos * 10) / 10}g
                    </p>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-lg text-center">
                    <p className="text-gray-400 text-sm">Grasas</p>
                    <p className="text-2xl font-bold text-blue-400">
                      {Math.round(totales.grasas * 10) / 10}g
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleContinuar}
                  disabled={totalIngredientes === 0}
                  className="w-full bg-gradient-to-r from-uf-gold to-yellow-600 text-black font-bold py-4 px-6 rounded-lg hover:from-yellow-600 hover:to-uf-gold transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continuar a Detalles
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* PASO 2: Detalles del plato */}
          {paso === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 uppercase">
                Dale un nombre a tu plato:
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-white font-bold mb-2">
                    Nombre del Plato *
                  </label>
                  <input
                    type="text"
                    value={platoData.nombre}
                    onChange={(e) =>
                      setPlatoData({ ...platoData, nombre: e.target.value })
                    }
                    placeholder="Ej: Pollo con Arroz y Verduras"
                    className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border-2 border-gray-700 focus:border-uf-gold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-white font-bold mb-2">
                    Descripción (opcional)
                  </label>
                  <textarea
                    value={platoData.descripcion}
                    onChange={(e) =>
                      setPlatoData({
                        ...platoData,
                        descripcion: e.target.value,
                      })
                    }
                    placeholder="Describe tu plato..."
                    rows={4}
                    className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border-2 border-gray-700 focus:border-uf-gold focus:outline-none"
                  ></textarea>
                </div>

                {/* Resumen */}
                <div className="bg-gray-900 rounded-lg p-6 border-2 border-uf-gold">
                  <h3 className="text-xl font-bold text-white mb-4">
                    Resumen del Plato:
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="bg-gray-800 p-4 rounded-lg text-center">
                      <p className="text-gray-400 text-sm">Calorías</p>
                      <p className="text-2xl font-bold text-uf-gold">
                        {Math.round(totales.calorias)}
                      </p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg text-center">
                      <p className="text-gray-400 text-sm">Proteínas</p>
                      <p className="text-2xl font-bold text-green-400">
                        {Math.round(totales.proteinas * 10) / 10}g
                      </p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg text-center">
                      <p className="text-gray-400 text-sm">Carbos</p>
                      <p className="text-2xl font-bold text-yellow-400">
                        {Math.round(totales.carbohidratos * 10) / 10}g
                      </p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg text-center">
                      <p className="text-gray-400 text-sm">Grasas</p>
                      <p className="text-2xl font-bold text-blue-400">
                        {Math.round(totales.grasas * 10) / 10}g
                      </p>
                    </div>
                  </div>

                  <p className="text-gray-400 text-sm mb-2">
                    Ingredientes: {totalIngredientes}
                  </p>
                </div>

                {/* Botones */}
                <div className="flex gap-4">
                  <button
                    onClick={() => setPaso(1)}
                    className="flex-1 bg-gray-700 text-white font-bold py-4 px-6 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Volver
                  </button>
                  <button
                    onClick={handleGuardarPlato}
                    disabled={guardando || !platoData.nombre.trim()}
                    className="flex-1 bg-gradient-to-r from-uf-gold to-yellow-600 text-black font-bold py-4 px-6 rounded-lg hover:from-yellow-600 hover:to-uf-gold transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {guardando ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Guardar Plato
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CrearDieta;
