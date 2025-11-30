import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Dumbbell,
  Utensils,
  TrendingUp,
  Calendar,
  CheckCircle,
  Clock,
  Award,
  Activity,
  Target,
  ChevronRight,
  Plus,
} from "lucide-react";

function DashboardEntrenador() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [vistaActual, setVistaActual] = useState("dashboard"); // 'dashboard' o 'clientes'
  const [estadisticas, setEstadisticas] = useState(null);
  const [clientesRecientes, setClientesRecientes] = useState([]);
  const [misClientes, setMisClientes] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
      fetchMisClientes();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const estadisticasMock = {
        total_clientes: 24,
        clientes_activos: 18,
        entrenamientos_asignados: 47,
        dietas_asignadas: 22,
        clientes_nuevos_mes: 5,
        tasa_completado: 78,
      };

      const clientesMock = [
        {
          id: 1,
          nombre: "Juan Pérez",
          email: "juan.perez@email.com",
          objetivo: "Ganar masa muscular",
          ultimo_entrenamiento: "2025-11-25",
          progreso: 85,
        },
        {
          id: 2,
          nombre: "María García",
          email: "maria.garcia@email.com",
          objetivo: "Perder peso",
          ultimo_entrenamiento: "2025-11-24",
          progreso: 72,
        },
        {
          id: 3,
          nombre: "Carlos López",
          email: "carlos.lopez@email.com",
          objetivo: "Tonificar",
          ultimo_entrenamiento: "2025-11-23",
          progreso: 90,
        },
        {
          id: 4,
          nombre: "Ana Martínez",
          email: "ana.martinez@email.com",
          objetivo: "Mantener peso",
          ultimo_entrenamiento: "2025-11-22",
          progreso: 65,
        },
      ];

      setEstadisticas(estadisticasMock);
      setClientesRecientes(clientesMock);
    } catch (error) {
      console.error("Error al cargar dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMisClientes = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/entrenador/mis-clientes/${user.id}`
      );

      if (response.data.success) {
        setMisClientes(response.data.clientes);
      }
    } catch (error) {
      console.error("Error al cargar clientes:", error);
    }
  };

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
        {/* Header con pestañas */}
        <div className="bg-gradient-to-r from-uf-gold to-yellow-600 py-6 px-8 rounded-t-lg shadow-lg">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-bold text-black uppercase tracking-wider flex items-center gap-3">
                <Activity className="w-8 h-8" />
                Panel de Entrenador
              </h1>
              <p className="text-gray-800 mt-1">Bienvenido, {user?.nombre}</p>
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

          {/* Pestañas */}
          <div className="flex gap-2">
            <button
              onClick={() => setVistaActual("dashboard")}
              className={`px-6 py-2 rounded-lg font-bold transition-all ${
                vistaActual === "dashboard"
                  ? "bg-black text-uf-gold"
                  : "bg-black/20 text-black hover:bg-black/30"
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setVistaActual("clientes")}
              className={`px-6 py-2 rounded-lg font-bold transition-all flex items-center gap-2 ${
                vistaActual === "clientes"
                  ? "bg-black text-uf-gold"
                  : "bg-black/20 text-black hover:bg-black/30"
              }`}
            >
              <Users className="w-5 h-5" />
              Mis Clientes ({misClientes.length})
            </button>
          </div>
        </div>

        {/* Contenido */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-b-lg shadow-2xl border border-gray-700">
          {/* VISTA DASHBOARD */}
          {vistaActual === "dashboard" && (
            <>
              {/* Estadísticas principales */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Total clientes */}
                <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 border-2 border-blue-700 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-blue-500/20 rounded-lg">
                      <Users className="w-8 h-8 text-blue-400" />
                    </div>
                    <TrendingUp className="w-6 h-6 text-green-400" />
                  </div>
                  <p className="text-blue-400 text-sm font-semibold uppercase tracking-wide mb-1">
                    Total Clientes
                  </p>
                  <p className="text-4xl font-bold text-white">
                    {estadisticas?.total_clientes}
                  </p>
                  <p className="text-gray-400 text-xs mt-2">
                    +{estadisticas?.clientes_nuevos_mes} este mes
                  </p>
                </div>

                {/* Clientes activos */}
                <div className="bg-gradient-to-br from-green-900/40 to-green-800/20 border-2 border-green-700 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-green-500/20 rounded-lg">
                      <CheckCircle className="w-8 h-8 text-green-400" />
                    </div>
                  </div>
                  <p className="text-green-400 text-sm font-semibold uppercase tracking-wide mb-1">
                    Activos
                  </p>
                  <p className="text-4xl font-bold text-white">
                    {estadisticas?.clientes_activos}
                  </p>
                  <p className="text-gray-400 text-xs mt-2">
                    {(
                      (estadisticas?.clientes_activos /
                        estadisticas?.total_clientes) *
                      100
                    ).toFixed(0)}
                    % del total
                  </p>
                </div>

                {/* Entrenamientos asignados */}
                <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 border-2 border-purple-700 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-purple-500/20 rounded-lg">
                      <Dumbbell className="w-8 h-8 text-purple-400" />
                    </div>
                  </div>
                  <p className="text-purple-400 text-sm font-semibold uppercase tracking-wide mb-1">
                    Entrenamientos
                  </p>
                  <p className="text-4xl font-bold text-white">
                    {estadisticas?.entrenamientos_asignados}
                  </p>
                  <p className="text-gray-400 text-xs mt-2">
                    Asignados actualmente
                  </p>
                </div>

                {/* Dietas asignadas */}
                <div className="bg-gradient-to-br from-orange-900/40 to-orange-800/20 border-2 border-orange-700 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-orange-500/20 rounded-lg">
                      <Utensils className="w-8 h-8 text-orange-400" />
                    </div>
                  </div>
                  <p className="text-orange-400 text-sm font-semibold uppercase tracking-wide mb-1">
                    Dietas
                  </p>
                  <p className="text-4xl font-bold text-white">
                    {estadisticas?.dietas_asignadas}
                  </p>
                  <p className="text-gray-400 text-xs mt-2">
                    Planes nutricionales activos
                  </p>
                </div>
              </div>

              {/* Tasa de completado */}
              <div className="bg-gradient-to-br from-uf-gold/10 to-yellow-600/10 border-2 border-uf-gold rounded-lg p-6 mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Target className="w-6 h-6 text-uf-gold" />
                    <h3 className="text-xl font-bold text-white">
                      Tasa de Completado General
                    </h3>
                  </div>
                  <span className="text-3xl font-bold text-uf-gold">
                    {estadisticas?.tasa_completado}%
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-4">
                  <div
                    className="bg-gradient-to-r from-uf-gold to-yellow-600 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${estadisticas?.tasa_completado}%` }}
                  ></div>
                </div>
                <p className="text-gray-400 text-sm mt-2">
                  Promedio de entrenamientos completados por tus clientes
                </p>
              </div>

              {/* Clientes recientes */}
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-gray-700 rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Clock className="w-6 h-6 text-uf-gold" />
                    <h3 className="text-2xl font-bold text-white">
                      Actividad Reciente
                    </h3>
                  </div>
                  <button
                    onClick={() => setVistaActual("clientes")}
                    className="text-uf-gold hover:text-yellow-600 font-semibold text-sm flex items-center gap-2"
                  >
                    Ver todos
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3">
                  {clientesRecientes.map((cliente) => (
                    <div
                      key={cliente.id}
                      className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 hover:border-uf-gold transition-all duration-300"
                    >
                      <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-12 h-12 bg-gradient-to-br from-uf-gold to-yellow-600 rounded-full flex items-center justify-center">
                            <span className="text-black font-bold text-lg">
                              {cliente.nombre.charAt(0)}
                            </span>
                          </div>
                          <div className="flex-1">
                            <h4 className="text-white font-semibold">
                              {cliente.nombre}
                            </h4>
                            <p className="text-gray-400 text-sm">
                              {cliente.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div>
                            <p className="text-gray-400 text-xs">Objetivo</p>
                            <p className="text-white font-semibold text-sm">
                              {cliente.objetivo}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-xs">
                              Último entreno
                            </p>
                            <p className="text-white font-semibold text-sm">
                              {new Date(
                                cliente.ultimo_entrenamiento
                              ).toLocaleDateString("es-ES")}
                            </p>
                          </div>
                          <div className="text-center min-w-[80px]">
                            <p className="text-gray-400 text-xs mb-1">
                              Progreso
                            </p>
                            <div className="relative w-16 h-16">
                              <svg className="transform -rotate-90 w-16 h-16">
                                <circle
                                  cx="32"
                                  cy="32"
                                  r="28"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                  fill="transparent"
                                  className="text-gray-700"
                                />
                                <circle
                                  cx="32"
                                  cy="32"
                                  r="28"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                  fill="transparent"
                                  strokeDasharray={`${2 * Math.PI * 28}`}
                                  strokeDashoffset={`${
                                    2 *
                                    Math.PI *
                                    28 *
                                    (1 - cliente.progreso / 100)
                                  }`}
                                  className="text-uf-gold transition-all duration-500"
                                />
                              </svg>
                              <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm">
                                {cliente.progreso}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* VISTA MIS CLIENTES */}
          {vistaActual === "clientes" && (
            <>
              {clienteSeleccionado ? (
                // DETALLE DEL CLIENTE
                <div>
                  <button
                    onClick={() => setClienteSeleccionado(null)}
                    className="mb-6 text-uf-gold hover:text-yellow-600 font-semibold flex items-center gap-2"
                  >
                    ← Volver a lista de clientes
                  </button>

                  {/* Header del cliente */}
                  <div className="bg-gradient-to-r from-blue-900/40 to-blue-800/20 border-2 border-blue-700 rounded-lg p-6 mb-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h2 className="text-3xl font-bold text-white mb-2">
                          {clienteSeleccionado.nombre}{" "}
                          {clienteSeleccionado.apellidos}
                        </h2>
                        <p className="text-gray-400">
                          {clienteSeleccionado.email}
                        </p>
                      </div>
                      {clienteSeleccionado.es_premium && (
                        <span className="bg-uf-gold text-black text-sm font-bold px-4 py-2 rounded-full">
                          PREMIUM
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-gray-900 rounded-lg p-3 text-center">
                        <p className="text-gray-400 text-sm">Peso</p>
                        <p className="text-2xl font-bold text-uf-gold">
                          {clienteSeleccionado.peso_actual
                            ? `${clienteSeleccionado.peso_actual}kg`
                            : "-"}
                        </p>
                      </div>
                      <div className="bg-gray-900 rounded-lg p-3 text-center">
                        <p className="text-gray-400 text-sm">Altura</p>
                        <p className="text-2xl font-bold text-blue-400">
                          {clienteSeleccionado.altura
                            ? `${clienteSeleccionado.altura}cm`
                            : "-"}
                        </p>
                      </div>
                      <div className="bg-gray-900 rounded-lg p-3 text-center">
                        <p className="text-gray-400 text-sm">Edad</p>
                        <p className="text-2xl font-bold text-green-400">
                          {clienteSeleccionado.edad || "-"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <button
                      onClick={() =>
                        navigate(
                          `/entrenador/cliente/${clienteSeleccionado.id}/crear-entrenamiento`
                        )
                      }
                      className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 border-2 border-purple-700 rounded-lg p-6 hover:scale-105 transition-all group text-left"
                    >
                      <Dumbbell className="w-12 h-12 text-purple-400 mb-4 group-hover:scale-110 transition-transform" />
                      <h3 className="text-xl font-bold text-white mb-2">
                        Crear Entrenamiento
                      </h3>
                      <p className="text-gray-400 text-sm">
                        Diseña una rutina personalizada
                      </p>
                    </button>

                    <button
                      onClick={() =>
                        navigate(
                          `/entrenador/cliente/${clienteSeleccionado.id}/crear-dieta`
                        )
                      }
                      className="bg-gradient-to-br from-orange-900/40 to-orange-800/20 border-2 border-orange-700 rounded-lg p-6 hover:scale-105 transition-all group text-left"
                    >
                      <Utensils className="w-12 h-12 text-orange-400 mb-4 group-hover:scale-110 transition-transform" />
                      <h3 className="text-xl font-bold text-white mb-2">
                        Crear Dieta
                      </h3>
                      <p className="text-gray-400 text-sm">
                        Diseña un plan nutricional semanal
                      </p>
                    </button>

                    <button
                      onClick={() =>
                        navigate(
                          `/entrenador/cliente/${clienteSeleccionado.id}/progreso`
                        )
                      }
                      className="bg-gradient-to-br from-green-900/40 to-green-800/20 border-2 border-green-700 rounded-lg p-6 hover:scale-105 transition-all group text-left"
                    >
                      <Target className="w-12 h-12 text-green-400 mb-4 group-hover:scale-110 transition-transform" />
                      <h3 className="text-xl font-bold text-white mb-2">
                        Ver Progreso
                      </h3>
                      <p className="text-gray-400 text-sm">
                        Analiza evolución y métricas
                      </p>
                    </button>
                  </div>
                </div>
              ) : (
                // LISTA DE CLIENTES
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {misClientes.map((cliente) => {
                    const objetivo =
                      objetivosMap[cliente.objetivo] ||
                      objetivosMap["cuidar_alimentacion"];

                    return (
                      <div
                        key={cliente.id}
                        onClick={() => setClienteSeleccionado(cliente)}
                        className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border-2 border-gray-700 hover:border-uf-gold transition-all duration-300 overflow-hidden cursor-pointer"
                      >
                        <div
                          className={`bg-${objetivo.color}-900/30 border-b-2 border-${objetivo.color}-500/30 p-4`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-white">
                                {cliente.nombre} {cliente.apellidos}
                              </h3>
                              <p className="text-gray-400 text-sm">
                                {cliente.email}
                              </p>
                            </div>
                            {cliente.es_premium && (
                              <span className="bg-uf-gold text-black text-xs font-bold px-2 py-1 rounded-full">
                                PREMIUM
                              </span>
                            )}
                          </div>

                          <div
                            className={`inline-flex items-center gap-2 bg-${objetivo.color}-500/20 text-${objetivo.color}-400 px-3 py-1 rounded-full text-sm font-bold`}
                          >
                            <span>{objetivo.icon}</span>
                            {objetivo.label}
                          </div>
                        </div>

                        <div className="p-4">
                          <div className="grid grid-cols-3 gap-3 mb-4">
                            <div className="text-center bg-gray-900 rounded-lg p-3">
                              <p className="text-xs text-gray-400 mb-1">Peso</p>
                              <p className="text-lg font-bold text-uf-gold">
                                {cliente.peso_actual
                                  ? `${cliente.peso_actual}kg`
                                  : "-"}
                              </p>
                            </div>
                            <div className="text-center bg-gray-900 rounded-lg p-3">
                              <p className="text-xs text-gray-400 mb-1">
                                Altura
                              </p>
                              <p className="text-lg font-bold text-blue-400">
                                {cliente.altura ? `${cliente.altura}cm` : "-"}
                              </p>
                            </div>
                            <div className="text-center bg-gray-900 rounded-lg p-3">
                              <p className="text-xs text-gray-400 mb-1">Edad</p>
                              <p className="text-lg font-bold text-green-400">
                                {cliente.edad || "-"}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-sm text-gray-400">
                            <span>Cliente desde {cliente.fecha_registro}</span>
                            <ChevronRight className="w-5 h-5 text-uf-gold" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardEntrenador;
