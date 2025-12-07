import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../../services/api";
import useAuthEntrenador from "../../context/AuthContextEntrenador";
import {
  Users,
  Dumbbell,
  Utensils,
  Calendar,
  Activity,
  ChevronRight,
  Target,
} from "lucide-react";

function DashboardEntrenador() {
  const { entrenador, isAuthenticated, logout } = useAuthEntrenador();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [vistaActual, setVistaActual] = useState("dashboard");
  const [estadisticas, setEstadisticas] = useState(null);
  const [misClientes, setMisClientes] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [loading, setLoading] = useState(true);

  // Si NO está autenticado → fuera
  useEffect(() => {
    if (!isAuthenticated || !entrenador) {
      logout();
      navigate("/login");
    }
  }, [isAuthenticated, entrenador]);

  // Leer parámetro ?vista=clientes
  useEffect(() => {
    const vista = searchParams.get("vista");
    if (vista === "clientes") {
      setVistaActual("clientes");
    }
  }, [searchParams]);

  // Cargar dashboard + clientes
  useEffect(() => {
    if (entrenador) {
      fetchDashboardData();
      fetchMisClientes();
    }
  }, [entrenador]);

  // Cargar estadísticas reales desde backend
  const fetchDashboardData = async () => {
    try {
      const response = await api.get(`/entrenadores/${entrenador.id}/dashboard-stats`);

      if (response.data.success) {
        setEstadisticas(response.data.estadisticas);
      }
    } catch (error) {
      console.error("Error al cargar dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  // Cargar clientes reales desde backend
  const fetchMisClientes = async () => {
    try {
      const response = await api.get(`/entrenador/mis-clientes/${entrenador.id}`);

      if (response.data.success) {
        setMisClientes(response.data.clientes);
      }
    } catch (error) {
      console.error("Error al cargar clientes:", error);
      console.error("Detalles:", error.response?.data);
    }
  };

  // Diccionario de objetivos
  const objetivosMap = {
    ganar_masa: { label: "Ganar Masa", icon: "💪", color: "blue" },
    perder_peso: { label: "Perder Peso", icon: "📉", color: "red" },
    resistencia: { label: "Resistencia", icon: "🏃", color: "green" },
    tonificar: { label: "Tonificar", icon: "🎯", color: "purple" },
    cuidar_alimentacion: {
      label: "Cuidar Alimentación",
      icon: "🥗",
      color: "emerald",
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-uf-darker via-gray-900 to-black py-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-uf-gold mx-auto mb-4"></div>
          <p className="text-white text-xl">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-uf-darker via-gray-900 to-black py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-uf-gold to-yellow-600 py-6 px-8 rounded-t-lg shadow-lg">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-bold text-black uppercase tracking-wider flex items-center gap-3">
                <Activity className="w-8 h-8" />
                Panel de Entrenador
              </h1>
              <p className="text-gray-800 mt-1">
                Bienvenido, {entrenador?.nombre}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-black" />
              <span className="text-black font-semibold">
                {new Date().toLocaleDateString("es-ES", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>

          {/* PESTAÑAS */}
          <div className="flex gap-2">
            <button
              onClick={() => setVistaActual("dashboard")}
              className={`px-6 py-2 rounded-lg font-bold transition-all ${vistaActual === "dashboard"
                  ? "bg-black text-uf-gold"
                  : "bg-black/20 text-black hover:bg-black/30"
                }`}
            >
              Dashboard
            </button>

            <button
              onClick={() => setVistaActual("clientes")}
              className={`px-6 py-2 rounded-lg font-bold transition-all flex items-center gap-2 ${vistaActual === "clientes"
                  ? "bg-black text-uf-gold"
                  : "bg-black/20 text-black hover:bg-black/30"
                }`}
            >
              <Users className="w-5 h-5" />
              Mis Clientes ({misClientes.length})
            </button>
          </div>
        </div>

        {/* CONTENIDO */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-b-lg shadow-2xl border border-gray-700">
          {vistaActual === "dashboard" && (
            <>
              {/* STATS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Clientes */}
                <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 border-2 border-blue-700 rounded-lg p-6">
                  <p className="text-blue-400 text-sm font-semibold uppercase">
                    Total Clientes
                  </p>
                  <p className="text-4xl font-bold text-white">
                    {estadisticas.total_clientes}
                  </p>
                </div>

                {/* Entrenamientos */}
                <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 border-2 border-purple-700 rounded-lg p-6">
                  <p className="text-purple-400 text-sm font-semibold uppercase">
                    Total Entrenamientos
                  </p>
                  <p className="text-4xl font-bold text-white">
                    {estadisticas.entrenamientos_asignados}
                  </p>
                </div>

                {/* Dietas */}
                <div className="bg-gradient-to-br from-orange-900/40 to-orange-800/20 border-2 border-orange-700 rounded-lg p-6">
                  <p className="text-orange-400 text-sm font-semibold uppercase">
                    Total Dietas
                  </p>
                  <p className="text-4xl font-bold text-white">
                    {estadisticas.dietas_asignadas}
                  </p>
                </div>
              </div>

              {/* ACCESOS RÁPIDOS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => navigate("/entrenador/mis-entrenamientos")}
                  className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 border-2 border-purple-700 rounded-lg p-6 hover:scale-105 transition"
                >
                  <Dumbbell className="w-8 h-8 text-purple-400 mb-2" />
                  <h3 className="text-xl font-bold text-white">Mis Entrenamientos</h3>
                </button>

                <button
                  onClick={() => navigate("/entrenador/mis-platos")}
                  className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 border-2 border-blue-700 rounded-lg p-6 hover:scale-105 transition"
                >
                  <Utensils className="w-8 h-8 text-blue-400 mb-2" />
                  <h3 className="text-xl font-bold text-white">Mis Platos</h3>
                </button>

                <button
                  onClick={() => navigate("/entrenador/mis-dietas")}
                  className="bg-gradient-to-br from-orange-900/40 to-orange-800/20 border-2 border-orange-700 rounded-lg p-6 hover:scale-105 transition"
                >
                  <Calendar className="w-8 h-8 text-orange-400 mb-2" />
                  <h3 className="text-xl font-bold text-white">Mis Dietas</h3>
                </button>
              </div>
            </>
          )}

          {/* MIS CLIENTES */}
          {vistaActual === "clientes" && (
            <div>
              {!clienteSeleccionado ? (
                /* LISTA */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {misClientes.map((cliente) => {
                    const objetivo =
                      objetivosMap[cliente.objetivo] ||
                      objetivosMap["cuidar_alimentacion"];

                    return (
                      <div
                        key={cliente.id}
                        onClick={() => setClienteSeleccionado(cliente)}
                        className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border-2 border-gray-700 hover:border-uf-gold transition cursor-pointer"
                      >
                        <div className={`p-4 bg-${objetivo.color}-900/20`}>
                          <h3 className="text-white text-xl font-bold">
                            {cliente.nombre} {cliente.apellidos}
                          </h3>
                          <p className="text-gray-400">{cliente.email}</p>

                          <span
                            className={`inline-flex items-center gap-2 mt-3 px-3 py-1 rounded-full bg-${objetivo.color}-600/20 text-${objetivo.color}-400 font-bold`}
                          >
                            {objetivo.icon} {objetivo.label}
                          </span>
                        </div>

                        <div className="p-4">
                          <p className="text-gray-400 text-sm">
                            Cliente desde {cliente.fecha_registro}
                          </p>
                          <ChevronRight className="w-5 h-5 text-uf-gold mt-2" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* DETALLE */
                <div>
                  <button
                    onClick={() => setClienteSeleccionado(null)}
                    className="text-uf-gold mb-4"
                  >
                    ← Volver
                  </button>

                  <h2 className="text-3xl text-white font-bold mb-4">
                    {clienteSeleccionado.nombre} {clienteSeleccionado.apellidos}
                  </h2>

                  {/* Acciones */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <button
                      onClick={() =>
                        navigate(`/entrenador/cliente/${clienteSeleccionado.id}/crear-entrenamiento`)
                      }
                      className="bg-purple-900/40 border-2 border-purple-700 p-6 rounded-lg"
                    >
                      <Dumbbell className="w-10 h-10 text-purple-400 mb-3" />
                      <h3 className="text-white font-bold text-lg">
                        Crear Entrenamiento
                      </h3>
                    </button>

                    <button
                      onClick={() =>
                        navigate(`/entrenador/cliente/${clienteSeleccionado.id}/crear-dieta`)
                      }
                      className="bg-orange-900/40 border-2 border-orange-700 p-6 rounded-lg"
                    >
                      <Utensils className="w-10 h-10 text-orange-400 mb-3" />
                      <h3 className="text-white font-bold text-lg">
                        Crear Dieta
                      </h3>
                    </button>

                    <button
                      onClick={() =>
                        navigate(`/entrenador/cliente/${clienteSeleccionado.id}/progreso`)
                      }
                      className="bg-green-900/40 border-2 border-green-700 p-6 rounded-lg"
                    >
                      <Target className="w-10 h-10 text-green-400 mb-3" />
                      <h3 className="text-white font-bold text-lg">
                        Ver Progreso
                      </h3>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardEntrenador;
