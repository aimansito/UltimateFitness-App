import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useToast } from "../../context/ToastContext";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import { Clock } from 'lucide-react';
import Icono from '../../components/common/Icono';
import { Apple, Beef, BicepsFlexed, Carrot, Coffee, Milk, Moon, Nut, Sunrise, UtensilsCrossed, Wheat } from 'lucide-react';

function CrearPlato() {
  const navigate = useNavigate();
  const toast = useToast();

  const [paso, setPaso] = useState(1); // 1: Ingredientes, 2: Detalles, 3: Confirmar
  const [nombrePlato, setNombrePlato] = useState("");
  const [descripcionPlato, setDescripcionPlato] = useState("");
  const [tipoComida, setTipoComida] = useState("almuerzo");
  const [dificultad, setDificultad] = useState("media");
  const [tiempoPreparacion, setTiempoPreparacion] = useState("");
  const [ingredientesSeleccionados, setIngredientesSeleccionados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  const [alimentosPorCategoria, setAlimentosPorCategoria] = useState({
    proteina: [],
    carbohidrato: [],
    grasa: [],
    verdura: [],
    fruta: [],
    lacteo: [],
  });

  const [totalesPlato, setTotalesPlato] = useState({
    calorias: 0,
    proteinas: 0,
    carbohidratos: 0,
    grasas: 0,
  });

  const categorias = {
    proteina: { nombre: "Proteínas", icon: Beef },
    carbohidrato: { nombre: "Carbohidratos", icon: Wheat },
    grasa: { nombre: "Grasas Saludables", icon: Nut },
    verdura: { nombre: "Verduras", icon: Carrot },
    fruta: { nombre: "Frutas", icon: Apple },
    lacteo: { nombre: "Lácteos", icon: Milk },
  };

  const tiposComida = {
    desayuno: { nombre: "Desayuno", icon: Sunrise },
    media_manana: { nombre: "Media Mañana", icon: Coffee },
    almuerzo: { nombre: "Almuerzo", icon: UtensilsCrossed },
    merienda: { nombre: "Merienda", icon: Apple },
    cena: { nombre: "Cena", icon: Moon },
    post_entreno: { nombre: "Post-Entreno", icon: BicepsFlexed },
  };

  const dificultades = {
    facil: { nombre: "Fácil", color: "green" },
    media: { nombre: "Media", color: "yellow" },
    dificil: { nombre: "Difícil", color: "red" },
  };

  useEffect(() => {
    cargarAlimentos();
  }, []);

  useEffect(() => {
    calcularTotales();
  }, [ingredientesSeleccionados]);

  const cargarAlimentos = async () => {
    try {
      const response = await api.get("/alimentos");

      if (response.data.success) {
        const alimentos = response.data.alimentos;

        const agrupados = {
          proteina: alimentos.filter(
            (a) => a.tipo_alimento === "proteina" || a.categoria === "proteina"
          ),
          carbohidrato: alimentos.filter(
            (a) => a.tipo_alimento === "carbohidrato" || a.categoria === "carbohidrato"
          ),
          grasa: alimentos.filter(
            (a) => a.tipo_alimento === "grasa" || a.categoria === "grasa"
          ),
          verdura: alimentos.filter(
            (a) => a.tipo_alimento === "verdura" || a.categoria === "verdura"
          ),
          fruta: alimentos.filter(
            (a) => a.tipo_alimento === "fruta" || a.categoria === "fruta"
          ),
          lacteo: alimentos.filter(
            (a) => a.tipo_alimento === "lacteo" || a.categoria === "lacteo"
          ),
        };

        setAlimentosPorCategoria(agrupados);
      }
    } catch (error) {
      console.error("Error cargando alimentos:", error);
      toast.error("Error al cargar alimentos");
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
      categoria: alimento.tipo_alimento || alimento.categoria,
    };

    setIngredientesSeleccionados([...ingredientesSeleccionados, nuevoIngrediente]);
  };

  const eliminarIngrediente = (id) => {
    setIngredientesSeleccionados(ingredientesSeleccionados.filter((ing) => ing.id !== id));
  };

  const actualizarCantidad = (id, nuevaCantidad) => {
    setIngredientesSeleccionados(
      ingredientesSeleccionados.map((ing) =>
        ing.id === id ? { ...ing, cantidad: parseFloat(nuevaCantidad) || 0 } : ing
      )
    );
  };

  const calcularTotales = () => {
    const totales = ingredientesSeleccionados.reduce(
      (acc, ing) => {
        const cantidad = ing.cantidad || 0;
        return {
          calorias: acc.calorias + (ing.calorias * cantidad) / 100,
          proteinas: acc.proteinas + (ing.proteinas * cantidad) / 100,
          carbohidratos: acc.carbohidratos + (ing.carbohidratos * cantidad) / 100,
          grasas: acc.grasas + (ing.grasas * cantidad) / 100,
        };
      },
      { calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0 }
    );

    setTotalesPlato(totales);
  };

  const guardarPlato = async () => {
    if (!nombrePlato.trim()) {
      toast.error("Por favor, añade un nombre al plato");
      return;
    }

    if (ingredientesSeleccionados.length === 0) {
      toast.error("Añade al menos un ingrediente");
      return;
    }

    try {
      setGuardando(true);

      const dataToSend = {
        nombre: nombrePlato,
        descripcion: descripcionPlato || "Plato personalizado",
        tipo_comida: tipoComida,
        dificultad: dificultad,
        tiempo_preparacion: tiempoPreparacion ? parseInt(tiempoPreparacion) : null,
        ingredientes: ingredientesSeleccionados.map((ing) => ({
          alimento_id: ing.alimentoId,
          cantidad_gramos: ing.cantidad,
        })),
      };

      const response = await api.post("/platos", dataToSend);

      if (response.data.success) {
        toast.success("Plato creado exitosamente");
        navigate("/mis-platos");
      } else {
        toast.error("Error: " + (response.data.error || "No se pudo guardar el plato"));
      }
    } catch (error) {
   console.error(" Error al guardar plato:", error);
      toast.error("Error al guardar el plato: " + (error.response?.data?.error || error.message));
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-uf-darker via-gray-900 to-black py-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-uf-gold mx-auto mb-4"></div>
          <p className="text-white text-xl">Cargando alimentos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-uf-darker via-gray-900 to-black py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-uf-gold to-yellow-600 py-6 px-8 rounded-t-lg shadow-lg">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-black uppercase tracking-wider flex items-center gap-3">
                Crear Nuevo Plato
              </h1>
              <p className="text-black/70 mt-1">Diseña tu propia receta</p>
            </div>
            <button
              onClick={() => navigate("/mis-platos")}
              className="bg-black/20 hover:bg-black/30 text-black font-bold px-6 py-3 rounded-lg transition flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Volver
            </button>
          </div>

          {/* Progreso */}
          <div className="mt-6 flex items-center gap-2">
            <div className={`flex-1 h-2 rounded-full ${paso >= 1 ? "bg-black" : "bg-black/20"}`}></div>
            <div className={`flex-1 h-2 rounded-full ${paso >= 2 ? "bg-black" : "bg-black/20"}`}></div>
            <div className={`flex-1 h-2 rounded-full ${paso >= 3 ? "bg-black" : "bg-black/20"}`}></div>
          </div>
          <div className="mt-2 flex justify-between text-xs text-black font-bold">
            <span>1. Ingredientes</span>
            <span>2. Detalles</span>
            <span>3. Confirmar</span>
          </div>
        </div>

        {/* Contenido */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-b-lg shadow-2xl border border-gray-700">
          {/* PASO 1: SELECCIÓN DE INGREDIENTES */}
          {paso === 1 && (
            <div className="space-y-6">
              {ingredientesSeleccionados.length > 0 && (
                <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-6 border-2 border-uf-gold">
                  <h3 className="text-xl font-bold text-white mb-4 uppercase flex items-center gap-2">
                    Tu Plato ({ingredientesSeleccionados.length} ingredientes)
                  </h3>

                  <div className="space-y-3 mb-4">
                    {ingredientesSeleccionados.map((ing) => (
                      <div key={ing.id} className="flex items-center gap-3 bg-gray-800 p-3 rounded-lg">
                        <div className="w-2 h-2 bg-uf-gold rounded-full"></div>
                        <div className="flex-1">
                          <span className="text-white font-bold">{ing.nombre}</span>
                          <span className="text-gray-500 text-sm ml-2">
                            ({categorias[ing.categoria]?.nombre})
                          </span>
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
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-4 gap-4 pt-4 border-t border-gray-700">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">
                        {Math.round(totalesPlato.calorias)}
                      </div>
                      <div className="text-gray-400 text-xs">kcal</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-400">
                        {Math.round(totalesPlato.proteinas)}g
                      </div>
                      <div className="text-gray-400 text-xs">Proteínas</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">
                        {Math.round(totalesPlato.carbohidratos)}g
                      </div>
                      <div className="text-gray-400 text-xs">Carbos</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-400">
                        {Math.round(totalesPlato.grasas)}g
                      </div>
                      <div className="text-gray-400 text-xs">Grasas</div>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white uppercase">
                  Selecciona Ingredientes por Categoría:
                </h3>

                {Object.entries(categorias).map(([key, cat]) => (
                  <div key={key} className="bg-gray-800 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl"><Icono de={cat.icon} className="w-6 h-6 inline-block" /></span>
                      <h4 className="text-lg font-bold text-white">{cat.nombre}</h4>
                      <span className="text-gray-500 text-sm">
                        ({alimentosPorCategoria[key]?.length || 0} opciones)
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {alimentosPorCategoria[key]?.slice(0, 12).map((alimento) => (
                        <button
                          key={alimento.id}
                          onClick={() => agregarIngrediente(alimento)}
                          className="text-left p-3 rounded-lg border-2 transition hover:scale-105 bg-gray-700 border-gray-600 hover:border-uf-gold"
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

              <button
                onClick={() => setPaso(2)}
                disabled={ingredientesSeleccionados.length === 0}
                className="w-full bg-gradient-to-r from-uf-gold to-yellow-600 text-black font-bold py-4 rounded-lg hover:from-yellow-600 hover:to-uf-gold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                Continuar a Detalles →
              </button>
            </div>
          )}

          {/* PASO 2: DETALLES DEL PLATO */}
          {paso === 2 && (
            <div className="space-y-6">
              <div className="bg-gray-800 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4 uppercase">Detalles del Plato</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 text-sm mb-2 font-bold">
                      Nombre del Plato *
                    </label>
                    <input
                      type="text"
                      value={nombrePlato}
                      onChange={(e) => setNombrePlato(e.target.value)}
                      placeholder="Ej: Pollo a la plancha con arroz integral"
                      className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-uf-gold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm mb-2 font-bold">
                      Descripción (opcional)
                    </label>
                    <textarea
                      value={descripcionPlato}
                      onChange={(e) => setDescripcionPlato(e.target.value)}
                      placeholder="Descripción del plato, instrucciones de preparación..."
                      rows="3"
                      className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-uf-gold focus:outline-none"
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm mb-2 font-bold">
                      ¿Para qué momento del día?
                    </label>
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
                          <div
                            className={`cursor-pointer text-center py-3 rounded-lg border-2 transition ${tipoComida === key
                                ? "bg-uf-gold text-black border-uf-gold"
                                : "bg-gray-700 text-white border-gray-600 hover:border-gray-500"
                              }`}
                          >
                            <div className="text-xl mb-1"><Icono de={tipo.icon} className="w-6 h-6 inline-block" /></div>
                            <div className="font-bold text-sm">{tipo.nombre}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 text-sm mb-2 font-bold">
                        Dificultad
                      </label>
                      <select
                        value={dificultad}
                        onChange={(e) => setDificultad(e.target.value)}
                        className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-uf-gold focus:outline-none"
                      >
                        {Object.entries(dificultades).map(([key, dif]) => (
                          <option key={key} value={key}>
                            {dif.nombre}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-300 text-sm mb-2 font-bold">
                        Tiempo de preparación (minutos)
                      </label>
                      <input
                        type="number"
                        value={tiempoPreparacion}
                        onChange={(e) => setTiempoPreparacion(e.target.value)}
                        placeholder="Ej: 30"
                        min="1"
                        className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-uf-gold focus:outline-none"
                      />
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
              <div className="bg-gradient-to-r from-yellow-900/40 to-yellow-800/20 border-2 border-uf-gold rounded-xl p-6">
                <h3 className="text-2xl font-bold text-white mb-2 uppercase">{nombrePlato}</h3>
                <p className="text-gray-400 mb-4">{descripcionPlato || "Sin descripción"}</p>

                <div className="flex items-center gap-4 mb-4 flex-wrap">
                  <span className="bg-gray-800 text-white px-4 py-2 rounded-lg font-bold">
                    <Icono de={tiposComida[tipoComida].icon} className="w-4 h-4 inline-block mr-1" /> {tiposComida[tipoComida].nombre}
                  </span>
                  <span className="bg-gray-800 text-white px-4 py-2 rounded-lg">
                    {ingredientesSeleccionados.length} ingredientes
                  </span>
                  <span className={`bg-${dificultades[dificultad].color}-500/20 text-${dificultades[dificultad].color}-400 px-4 py-2 rounded-lg font-bold`}>
                    {dificultades[dificultad].nombre}
                  </span>
                  {tiempoPreparacion && (
                    <span className="bg-gray-800 text-white px-4 py-2 rounded-lg">
                      <Clock className="inline-block w-4 h-4 mr-1 -mt-0.5" aria-hidden="true" />{tiempoPreparacion} min
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div className="text-center bg-gray-800 rounded-lg p-4">
                    <div className="text-3xl font-bold text-white">
                      {Math.round(totalesPlato.calorias)}
                    </div>
                    <div className="text-gray-400 text-sm">kcal</div>
                  </div>
                  <div className="text-center bg-gray-800 rounded-lg p-4">
                    <div className="text-3xl font-bold text-orange-400">
                      {Math.round(totalesPlato.proteinas)}g
                    </div>
                    <div className="text-gray-400 text-sm">Proteínas</div>
                  </div>
                  <div className="text-center bg-gray-800 rounded-lg p-4">
                    <div className="text-3xl font-bold text-blue-400">
                      {Math.round(totalesPlato.carbohidratos)}g
                    </div>
                    <div className="text-gray-400 text-sm">Carbos</div>
                  </div>
                  <div className="text-center bg-gray-800 rounded-lg p-4">
                    <div className="text-3xl font-bold text-yellow-400">
                      {Math.round(totalesPlato.grasas)}g
                    </div>
                    <div className="text-gray-400 text-sm">Grasas</div>
                  </div>
                </div>

                <h4 className="text-lg font-bold text-white mb-3 uppercase">Ingredientes:</h4>
                <div className="space-y-2">
                  {ingredientesSeleccionados.map((ing) => (
                    <div
                      key={ing.id}
                      className="flex items-center justify-between bg-gray-800 p-3 rounded-lg"
                    >
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
                  disabled={guardando}
                >
                  ← Editar
                </button>
                <button
                  onClick={guardarPlato}
                  disabled={guardando}
                  className="flex-1 bg-gradient-to-r from-uf-gold to-yellow-600 text-black font-bold py-3 rounded-lg hover:from-yellow-600 hover:to-uf-gold transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {guardando ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-black"></div>
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
          )}
        </div>
      </div>
    </div>
  );
}

export default CrearPlato;
