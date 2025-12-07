import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAuthEntrenador from "../../context/AuthContextEntrenador";
import api from "../../services/api";
import { ArrowLeft, Save, Plus, Trash2, Calendar, Search } from "lucide-react";
import ConstructorPlatos from "../../components/dieta/ConstructorPlatos";
import SelectorPlatos from "../../components/dieta/SelectorPlatos";

function CrearDietaCliente() {
  const { clienteId } = useParams();
  const { entrenador } = useAuthEntrenador();
  const navigate = useNavigate();

  const [cliente, setCliente] = useState(null);
  const [nombreDieta, setNombreDieta] = useState("");
  const [descripcionDieta, setDescripcionDieta] = useState("");
  const [alimentos, setAlimentos] = useState([]);
  const [platos, setPlatos] = useState([]);
  const [diaSeleccionado, setDiaSeleccionado] = useState("lunes");
  const [momentoActual, setMomentoActual] = useState(null);
  const [mostrarConstructor, setMostrarConstructor] = useState(false);
  const [mostrarSelector, setMostrarSelector] = useState(false);
  const [planSemanal, setPlanSemanal] = useState({
    lunes: {
      desayuno: [],
      media_manana: [],
      almuerzo: [],
      merienda: [],
      cena: [],
      post_entreno: [],
    },
    martes: {
      desayuno: [],
      media_manana: [],
      almuerzo: [],
      merienda: [],
      cena: [],
      post_entreno: [],
    },
    miercoles: {
      desayuno: [],
      media_manana: [],
      almuerzo: [],
      merienda: [],
      cena: [],
      post_entreno: [],
    },
    jueves: {
      desayuno: [],
      media_manana: [],
      almuerzo: [],
      merienda: [],
      cena: [],
      post_entreno: [],
    },
    viernes: {
      desayuno: [],
      media_manana: [],
      almuerzo: [],
      merienda: [],
      cena: [],
      post_entreno: [],
    },
    sabado: {
      desayuno: [],
      media_manana: [],
      almuerzo: [],
      merienda: [],
      cena: [],
      post_entreno: [],
    },
    domingo: {
      desayuno: [],
      media_manana: [],
      almuerzo: [],
      merienda: [],
      cena: [],
      post_entreno: [],
    },
  });
  const [loading, setLoading] = useState(true);

  const diasSemana = [
    { key: "lunes", label: "LUNES" },
    { key: "martes", label: "MARTES" },
    { key: "miercoles", label: "MIÉRCOLES" },
    { key: "jueves", label: "JUEVES" },
    { key: "viernes", label: "VIERNES" },
    { key: "sabado", label: "SÁBADO" },
    { key: "domingo", label: "DOMINGO" },
  ];

  const momentosComida = [
    { key: "desayuno", label: "Desayuno", icon: "🌅" },
    { key: "media_manana", label: "Media Mañana", icon: "☕" },
    { key: "almuerzo", label: "Almuerzo", icon: "🍽️" },
    { key: "merienda", label: "Merienda", icon: "🥤" },
    { key: "cena", label: "Cena", icon: "🌙" },
    { key: "post_entreno", label: "Post-Entreno", icon: "💪" },
  ];

  useEffect(() => {
    fetchCliente();
    fetchAlimentos();
    fetchPlatos();
  }, [clienteId]);

  const fetchCliente = async () => {
    try {
      const response = await api.get(
        `/entrenador/mis-clientes/${entrenador.id}`
      );
      if (response.data.success) {
        const clienteEncontrado = response.data.clientes.find(
          (c) => c.id === parseInt(clienteId)
        );
        setCliente(clienteEncontrado);
      }
    } catch (error) {
      console.error("Error al cargar cliente:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAlimentos = async () => {
    try {
      const response = await api.get("/alimentos");
      setAlimentos(response.data);
    } catch (error) {
      console.error("Error al cargar alimentos:", error);
    }
  };

  const fetchPlatos = async () => {
    try {
      const response = await api.get("/platos");
      if (response.data.success) {
        setPlatos(response.data.platos);
      }
    } catch (error) {
      console.error("Error al cargar platos:", error);
    }
  };

  const abrirConstructor = (momento) => {
    setMomentoActual(momento);
    setMostrarConstructor(true);
  };

  const abrirSelector = (momento) => {
    setMomentoActual(momento);
    setMostrarSelector(true);
  };

  const handleGuardarPlato = (plato) => {
    const nuevoPlan = { ...planSemanal };
    nuevoPlan[diaSeleccionado][momentoActual].push({
      tipo: "plato_personalizado",
      id: Date.now(),
      nombre: plato.nombre,
      descripcion: plato.descripcion,
      ingredientes: plato.ingredientes,
      calorias: plato.totales.calorias,
      proteinas: plato.totales.proteinas,
      carbohidratos: plato.totales.carbohidratos,
      grasas: plato.totales.grasas,
    });
    setPlanSemanal(nuevoPlan);
    setMostrarConstructor(false);
    setMomentoActual(null);
  };

  const handleSeleccionarPlato = (plato) => {
    const nuevoPlan = { ...planSemanal };
    nuevoPlan[diaSeleccionado][momentoActual].push({
      tipo: "plato",
      id: Date.now(),
      plato_id: plato.id,
      nombre: plato.nombre,
      descripcion: plato.descripcion,
      ingredientes: plato.ingredientes,
      calorias: plato.totales.calorias,
      proteinas: plato.totales.proteinas,
      carbohidratos: plato.totales.carbohidratos,
      grasas: plato.totales.grasas,
    });
    setPlanSemanal(nuevoPlan);
    setMostrarSelector(false);
    setMomentoActual(null);
  };

  const eliminarItem = (momento, itemId) => {
    const nuevoPlan = { ...planSemanal };
    nuevoPlan[diaSeleccionado][momento] = nuevoPlan[diaSeleccionado][
      momento
    ].filter((item) => item.id !== itemId);
    setPlanSemanal(nuevoPlan);
  };

  const calcularTotalesMomento = (momento) => {
    const items = planSemanal[diaSeleccionado][momento];
    return items.reduce(
      (totales, item) => ({
        calorias: totales.calorias + (item.calorias || 0),
        proteinas: totales.proteinas + (item.proteinas || 0),
        carbohidratos: totales.carbohidratos + (item.carbohidratos || 0),
        grasas: totales.grasas + (item.grasas || 0),
      }),
      { calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0 }
    );
  };

  const calcularTotalesDia = () => {
    const dia = planSemanal[diaSeleccionado];
    let totales = { calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0 };

    Object.values(dia).forEach((momento) => {
      momento.forEach((item) => {
        totales.calorias += item.calorias || 0;
        totales.proteinas += item.proteinas || 0;
        totales.carbohidratos += item.carbohidratos || 0;
        totales.grasas += item.grasas || 0;
      });
    });

    return totales;
  };

  const guardarDieta = async () => {
    if (!nombreDieta.trim()) {
      alert("❌ Debes ingresar un nombre para la dieta");
      return;
    }

    // Validar que TODOS los días y TODOS los momentos tengan al menos 1 ítem
    const diasRequeridos = [
      "lunes",
      "martes",
      "miercoles",
      "jueves",
      "viernes",
      "sabado",
      "domingo",
    ];
    const momentosRequeridos = [
      { key: "desayuno", label: "Desayuno" },
      { key: "media_manana", label: "Media Mañana" },
      { key: "almuerzo", label: "Almuerzo" },
      { key: "merienda", label: "Merienda" },
      { key: "cena", label: "Cena" },
      { key: "post_entreno", label: "Post-Entreno" },
    ];

    const diasLabels = {
      lunes: "Lunes",
      martes: "Martes",
      miercoles: "Miércoles",
      jueves: "Jueves",
      viernes: "Viernes",
      sabado: "Sábado",
      domingo: "Domingo",
    };

    // Validar completitud
    for (const dia of diasRequeridos) {
      for (const momento of momentosRequeridos) {
        if (
          !planSemanal[dia][momento.key] ||
          planSemanal[dia][momento.key].length === 0
        ) {
          alert(
            `❌ ERROR: Falta añadir platos en:\n\n📅 ${diasLabels[dia]}\n🍽️ ${momento.label}\n\n⚠️ Todos los días y todos los momentos del día deben tener al menos 1 plato o alimento.`
          );
          return;
        }
      }
    }

    // Calcular totales de la dieta (promedio semanal)
    let totalesSemana = {
      calorias: 0,
      proteinas: 0,
      carbohidratos: 0,
      grasas: 0,
    };

    Object.values(planSemanal).forEach((dia) => {
      Object.values(dia).forEach((momento) => {
        momento.forEach((item) => {
          totalesSemana.calorias += item.calorias || 0;
          totalesSemana.proteinas += item.proteinas || 0;
          totalesSemana.carbohidratos += item.carbohidratos || 0;
          totalesSemana.grasas += item.grasas || 0;
        });
      });
    });

    // Promedio diario
    const totalesDiarios = {
      calorias: Math.round(totalesSemana.calorias / 7),
      proteinas: Math.round(totalesSemana.proteinas / 7),
      carbohidratos: Math.round(totalesSemana.carbohidratos / 7),
      grasas: Math.round(totalesSemana.grasas / 7),
    };

    const dietaData = {
      nombre: nombreDieta,
      descripcion: descripcionDieta,
      creador_id: entrenador.id,
      cliente_id: parseInt(clienteId),
      calorias_totales: totalesDiarios.calorias,
      proteinas_totales: totalesDiarios.proteinas,
      carbohidratos_totales: totalesDiarios.carbohidratos,
      grasas_totales: totalesDiarios.grasas,
      plan_semanal: planSemanal,
    };

    setLoading(true);

    try {
      const response = await api.post(
        "/entrenador/crear-dieta",
        dietaData
      );

      if (response.data.success) {
        alert(
          `✅ ¡Dieta creada exitosamente!\n\n📋 ${nombreDieta}\n👤 Asignada a ${cliente.nombre} ${cliente.apellidos}\n🔥 ${totalesDiarios.calorias} kcal/día`
        );
        navigate("/entrenador/dashboard");
      } else {
        alert("❌ Error al crear la dieta: " + response.data.error);
      }
    } catch (error) {
      console.error("Error al guardar dieta:", error);
      if (error.response?.data?.error) {
        alert("❌ Error: " + error.response.data.error);
      } else {
        alert("❌ Error al guardar la dieta. Verifica la consola.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-uf-darker via-gray-900 to-black py-12 px-4 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-uf-gold"></div>
      </div>
    );
  }

  if (!cliente) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-uf-darker via-gray-900 to-black py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Cliente no encontrado
          </h2>
          <button
            onClick={() => navigate("/entrenador/dashboard")}
            className="bg-uf-gold text-black px-6 py-2 rounded-lg font-bold"
          >
            Volver al Dashboard
          </button>
        </div>
      </div>
    );
  }

  const totalesDia = calcularTotalesDia();

  return (
    <div className="min-h-screen bg-gradient-to-br from-uf-darker via-gray-900 to-black py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/entrenador/dashboard")}
            className="text-uf-gold hover:text-yellow-600 font-semibold flex items-center gap-2 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver al Dashboard
          </button>

          <div className="bg-gradient-to-r from-orange-600 to-orange-700 py-6 px-8 rounded-lg">
            <h1 className="text-3xl font-bold text-white mb-2">
              Crear Dieta para {cliente.nombre} {cliente.apellidos}
            </h1>
            <p className="text-orange-100">
              Diseña un plan nutricional semanal personalizado
            </p>
          </div>
        </div>

        {/* Formulario básico */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-gray-700 rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white font-semibold mb-2">
                Nombre de la Dieta *
              </label>
              <input
                type="text"
                value={nombreDieta}
                onChange={(e) => setNombreDieta(e.target.value)}
                className="w-full bg-gray-900 border-2 border-gray-700 rounded-lg px-4 py-2 text-white focus:border-uf-gold outline-none"
                placeholder="Ej: Dieta Equilibrada 2000kcal"
              />
            </div>
            <div>
              <label className="block text-white font-semibold mb-2">
                Descripción
              </label>
              <input
                type="text"
                value={descripcionDieta}
                onChange={(e) => setDescripcionDieta(e.target.value)}
                className="w-full bg-gray-900 border-2 border-gray-700 rounded-lg px-4 py-2 text-white focus:border-uf-gold outline-none"
                placeholder="Ej: Plan para mantener peso"
              />
            </div>
          </div>
        </div>

        {/* Selector de día */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-gray-700 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-uf-gold" />
            Selecciona un día
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {diasSemana.map((dia) => (
              <button
                key={dia.key}
                onClick={() => setDiaSeleccionado(dia.key)}
                className={`py-3 px-4 rounded-lg font-bold transition-all ${diaSeleccionado === dia.key
                  ? "bg-uf-gold text-black"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
              >
                {dia.label}
              </button>
            ))}
          </div>
        </div>

        {/* Resumen del día */}
        <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 border-2 border-purple-700 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-bold text-white mb-4">
            Totales del{" "}
            {diasSemana.find((d) => d.key === diaSeleccionado)?.label}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-900 rounded-lg p-4 text-center">
              <p className="text-gray-400 text-sm">Calorías</p>
              <p className="text-2xl font-bold text-orange-400">
                {Math.round(totalesDia.calorias)}
              </p>
            </div>
            <div className="bg-gray-900 rounded-lg p-4 text-center">
              <p className="text-gray-400 text-sm">Proteínas</p>
              <p className="text-2xl font-bold text-blue-400">
                {Math.round(totalesDia.proteinas)}g
              </p>
            </div>
            <div className="bg-gray-900 rounded-lg p-4 text-center">
              <p className="text-gray-400 text-sm">Carbohidratos</p>
              <p className="text-2xl font-bold text-green-400">
                {Math.round(totalesDia.carbohidratos)}g
              </p>
            </div>
            <div className="bg-gray-900 rounded-lg p-4 text-center">
              <p className="text-gray-400 text-sm">Grasas</p>
              <p className="text-2xl font-bold text-yellow-400">
                {Math.round(totalesDia.grasas)}g
              </p>
            </div>
          </div>
        </div>

        {/* Comidas del día */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-gray-700 rounded-lg p-6 mb-6">
          <h3 className="text-2xl font-bold text-white mb-6">
            Plan del {diasSemana.find((d) => d.key === diaSeleccionado)?.label}
          </h3>

          <div className="space-y-6">
            {momentosComida.map((momento) => {
              const totalesMomento = calcularTotalesMomento(momento.key);
              const items = planSemanal[diaSeleccionado][momento.key];

              return (
                <div
                  key={momento.key}
                  className="bg-gray-900 rounded-lg p-6 border-2 border-gray-700"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-xl font-bold text-white flex items-center gap-2">
                        <span>{momento.icon}</span>
                        {momento.label}
                      </h4>
                      <p className="text-sm text-gray-400 mt-1">
                        {Math.round(totalesMomento.calorias)} kcal ·{" "}
                        {items.length} ítems
                      </p>
                    </div>

                    <div className="flex gap-2 text-xs">
                      <span className="text-orange-400">
                        {Math.round(totalesMomento.calorias)} kcal
                      </span>
                      <span className="text-blue-400">
                        P: {Math.round(totalesMomento.proteinas)}g
                      </span>
                      <span className="text-green-400">
                        C: {Math.round(totalesMomento.carbohidratos)}g
                      </span>
                      <span className="text-yellow-400">
                        G: {Math.round(totalesMomento.grasas)}g
                      </span>
                    </div>
                  </div>

                  {/* Botones */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <button
                      onClick={() => abrirSelector(momento.key)}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg font-bold flex items-center justify-center gap-2"
                    >
                      <Search className="w-5 h-5" />
                      Plato Predefinido
                    </button>
                    <button
                      onClick={() => abrirConstructor(momento.key)}
                      className="bg-uf-gold hover:bg-yellow-600 text-black px-4 py-3 rounded-lg font-bold flex items-center justify-center gap-2"
                    >
                      <Plus className="w-5 h-5" />
                      Crear Plato
                    </button>
                  </div>

                  {/* Items */}
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="bg-gray-800 rounded-lg p-4 border border-gray-700"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h5 className="text-white font-bold">
                                {item.nombre}
                              </h5>
                              {item.tipo === "plato_personalizado" && (
                                <span className="bg-uf-gold text-black text-xs px-2 py-1 rounded-full font-bold">
                                  PERSONALIZADO
                                </span>
                              )}
                            </div>
                            {item.descripcion && (
                              <p className="text-gray-400 text-sm mb-2">
                                {item.descripcion}
                              </p>
                            )}

                            {/* Ingredientes */}
                            {item.ingredientes &&
                              item.ingredientes.length > 0 && (
                                <div className="mt-2 space-y-1">
                                  {item.ingredientes.map((ing, idx) => (
                                    <div
                                      key={idx}
                                      className="text-xs text-gray-500"
                                    >
                                      • {ing.nombre} - {ing.cantidad}g
                                    </div>
                                  ))}
                                </div>
                              )}
                          </div>

                          <button
                            onClick={() => eliminarItem(momento.key, item.id)}
                            className="text-red-500 hover:text-red-400 p-2 ml-4"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>

                        {/* Macros */}
                        <div className="flex gap-3 text-xs mt-3 pt-3 border-t border-gray-700">
                          <span className="text-orange-400 font-semibold">
                            🔥 {Math.round(item.calorias)} kcal
                          </span>
                          <span className="text-blue-400">
                            P: {Math.round(item.proteinas)}g
                          </span>
                          <span className="text-green-400">
                            C: {Math.round(item.carbohidratos)}g
                          </span>
                          <span className="text-yellow-400">
                            G: {Math.round(item.grasas)}g
                          </span>
                        </div>
                      </div>
                    ))}

                    {items.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <p>No hay alimentos añadidos</p>
                        <p className="text-sm mt-1">
                          Usa los botones de arriba para añadir
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Botón guardar */}
        <div className="flex justify-end">
          <button
            onClick={guardarDieta}
            className="bg-uf-gold text-black px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-600 flex items-center gap-3"
          >
            <Save className="w-6 h-6" />
            GUARDAR DIETA COMPLETA
          </button>
        </div>
      </div>

      {/* Modales */}
      {mostrarConstructor && (
        <ConstructorPlatos
          onGuardarPlato={handleGuardarPlato}
          onCerrar={() => {
            setMostrarConstructor(false);
            setMomentoActual(null);
          }}
        />
      )}

      {mostrarSelector && (
        <SelectorPlatos
          onSeleccionar={handleSeleccionarPlato}
          onCancelar={() => {
            setMostrarSelector(false);
            setMomentoActual(null);
          }}
        />
      )}
    </div>
  );
}

export default CrearDietaCliente;
