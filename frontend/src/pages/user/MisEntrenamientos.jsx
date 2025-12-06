import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import {
  Dumbbell,
  Calendar,
  Clock,
  TrendingUp,
  CheckCircle,
  XCircle,
  ChevronRight,
  Activity,
  Target,
  Award,
  Plus,
  User,
  UserCheck
} from 'lucide-react';

function MisEntrenamientos() {
  const { user, isPremium } = useAuth();
  const navigate = useNavigate();
  const [entrenamientosCreados, setEntrenamientosCreados] = useState([]);
  const [entrenamientosAsignados, setEntrenamientosAsignados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEntrenamiento, setSelectedEntrenamiento] = useState(null);
  const [activeTab, setActiveTab] = useState('asignados'); // 'asignados' | 'creados'

  // ============================================
  // CARGAR ENTRENAMIENTOS DEL USUARIO
  // ============================================
  useEffect(() => {
    const fetchEntrenamientos = async () => {
      try {
        console.log('✅ Cargando entrenamientos...');

        // ✅ USAR api SERVICE QUE YA INCLUYE EL TOKEN AUTOMÁTICAMENTE
        const response = await api.get('/custom/mis-entrenamientos');

        if (response.data.success) {
          console.log('✅ Entrenamientos cargados:', response.data);
          setEntrenamientosCreados(response.data.creados);
          setEntrenamientosAsignados(response.data.asignados);

          // Si no tiene asignados pero sí creados, mostrar creados por defecto
          if (response.data.asignados.length === 0 && response.data.creados.length > 0) {
            setActiveTab('creados');
          }
        }
      } catch (error) {
        console.error('❌ Error al cargar entrenamientos:', error);
        if (error.response?.status === 401) {
          console.error('Token inválido o expirado');
        }
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchEntrenamientos();
    }
  }, [user]);

  const marcarCompletado = async (id) => {
    // TODO: Implementar lógica de completado real en backend
    // Por ahora solo actualizamos estado local
    const toggleCompletion = (list) => list.map(e => e.id === id ? { ...e, completado: !e.completado } : e);

    setEntrenamientosAsignados(prev => toggleCompletion(prev));
    setEntrenamientosCreados(prev => toggleCompletion(prev));
  };

  const getNivelColor = (nivel) => {
    switch (nivel) {
      case 'principiante':
        return 'bg-green-500/20 text-green-400 border-green-500';
      case 'intermedio':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500';
      case 'avanzado':
        return 'bg-red-500/20 text-red-400 border-red-500';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500';
    }
  };

  const getTipoIcon = (tipo) => {
    switch (tipo) {
      case 'fuerza':
        return <Dumbbell className="w-5 h-5" />;
      case 'cardio':
        return <Activity className="w-5 h-5" />;
      case 'flexibilidad':
        return <Target className="w-5 h-5" />;
      default:
        return <Dumbbell className="w-5 h-5" />;
    }
  };

  if (!isPremium) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-uf-darker via-gray-900 to-black py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-12 rounded-lg shadow-2xl border border-gray-700">
            <Award className="w-20 h-20 text-uf-gold mx-auto mb-6" />

            <h1 className="text-3xl font-bold text-white mb-4">
              Función Premium
            </h1>

            <p className="text-gray-300 mb-8 text-lg">
              Los entrenamientos personalizados están disponibles solo para usuarios Premium.
            </p>

            <a
              href="/upgrade-premium"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-uf-gold to-yellow-600 text-black font-bold px-8 py-4 rounded-lg uppercase tracking-wider hover:from-yellow-600 hover:to-uf-gold transition-all duration-300 transform hover:scale-105"
            >
              <Award className="w-5 h-5" />
              Ver Planes Premium
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-uf-darker via-gray-900 to-black py-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-uf-gold mx-auto mb-4"></div>
          <p className="text-white text-xl">Cargando entrenamientos...</p>
        </div>
      </div>
    );
  }

  const entrenamientosMostrados = activeTab === 'asignados' ? entrenamientosAsignados : entrenamientosCreados;

  return (
    <div className="min-h-screen bg-gradient-to-br from-uf-darker via-gray-900 to-black py-12 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Dumbbell className="w-8 h-8 text-uf-gold" />
              Mis Entrenamientos
            </h1>
            <p className="text-gray-400 mt-1">Gestiona tus rutinas y entrenamientos asignados</p>
          </div>
          <button
            onClick={() => navigate('/crear-entrenamiento')}
            className="bg-uf-gold text-black px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-yellow-500 transition-all"
          >
            <Plus className="w-5 h-5" />
            Crear Nueva Rutina
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-700 pb-1">
          <button
            onClick={() => setActiveTab('asignados')}
            className={`pb-3 px-4 font-bold flex items-center gap-2 transition-all ${activeTab === 'asignados'
              ? 'text-uf-gold border-b-2 border-uf-gold'
              : 'text-gray-400 hover:text-white'
              }`}
          >
            <UserCheck className="w-5 h-5" />
            Asignados por Entrenador
            <span className="bg-gray-800 text-xs px-2 py-0.5 rounded-full ml-1 text-gray-300">
              {entrenamientosAsignados.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('creados')}
            className={`pb-3 px-4 font-bold flex items-center gap-2 transition-all ${activeTab === 'creados'
              ? 'text-uf-gold border-b-2 border-uf-gold'
              : 'text-gray-400 hover:text-white'
              }`}
          >
            <User className="w-5 h-5" />
            Mis Rutinas Creadas
            <span className="bg-gray-800 text-xs px-2 py-0.5 rounded-full ml-1 text-gray-300">
              {entrenamientosCreados.length}
            </span>
          </button>
        </div>

        {/* Contenido */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-lg shadow-2xl border border-gray-700">

          {/* Lista de entrenamientos */}
          {entrenamientosMostrados.length === 0 ? (
            <div className="text-center py-12">
              <Dumbbell className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">
                {activeTab === 'asignados'
                  ? 'No tienes entrenamientos asignados por tu entrenador.'
                  : 'No has creado ninguna rutina personalizada todavía.'}
              </p>
              {activeTab === 'creados' && (
                <button
                  onClick={() => navigate('/crear-entrenamiento')}
                  className="mt-4 text-uf-gold hover:underline font-bold"
                >
                  ¡Crea tu primera rutina ahora!
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {entrenamientosMostrados.map((entrenamiento) => (
                <div
                  key={entrenamiento.id}
                  className={`bg-gradient-to-r from-gray-900 to-gray-800 border-2 rounded-lg p-6 transition-all duration-300 hover:shadow-xl ${entrenamiento.completado
                    ? 'border-green-700 bg-green-900/10'
                    : 'border-gray-700 hover:border-uf-gold'
                    }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-uf-gold/20 rounded-lg">
                          {getTipoIcon(entrenamiento.tipo)}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">
                            {entrenamiento.nombre}
                          </h3>
                          <p className="text-gray-400 text-sm">
                            {entrenamiento.descripcion}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3 mt-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getNivelColor(entrenamiento.nivelDificultad)}`}>
                          {entrenamiento.nivelDificultad?.toUpperCase()}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500">
                          <Clock className="w-3 h-3 inline mr-1" />
                          {entrenamiento.duracionMinutos} min
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-400 border border-purple-500">
                          <Calendar className="w-3 h-3 inline mr-1" />
                          {new Date(entrenamiento.fechaCreacion).toLocaleDateString('es-ES')}
                        </span>
                        {entrenamiento.creador && (
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-500/20 text-orange-400 border border-orange-500">
                            <UserCheck className="w-3 h-3 inline mr-1" />
                            Entrenador: {entrenamiento.creador.nombre}
                          </span>
                        )}
                      </div>

                      {selectedEntrenamiento === entrenamiento.id && (
                        <div className="mt-6 bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                          <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-uf-gold" />
                            Ejercicios
                          </h4>
                          {entrenamiento.entrenamientoEjercicios && entrenamiento.entrenamientoEjercicios.length > 0 ? (
                            <div className="space-y-2">
                              {entrenamiento.entrenamientoEjercicios.map((ejercicio, idx) => (
                                <div key={idx} className="flex items-center justify-between text-gray-300 bg-gray-800/50 p-3 rounded">
                                  <span className="font-semibold">{ejercicio.ejercicio?.nombre || 'Ejercicio'}</span>
                                  <span className="text-uf-gold">
                                    {ejercicio.series} series × {ejercicio.repeticiones}
                                  </span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-gray-500 text-sm">No hay ejercicios detallados.</p>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      <button
                        onClick={() => setSelectedEntrenamiento(
                          selectedEntrenamiento === entrenamiento.id ? null : entrenamiento.id
                        )}
                        className="p-2 bg-uf-gold/20 hover:bg-uf-gold/30 rounded-lg transition-all"
                      >
                        <ChevronRight className={`w-5 h-5 text-uf-gold transition-transform ${selectedEntrenamiento === entrenamiento.id ? 'rotate-90' : ''
                          }`} />
                      </button>

                      <button
                        onClick={() => marcarCompletado(entrenamiento.id)}
                        className={`p-2 rounded-lg transition-all ${entrenamiento.completado
                          ? 'bg-green-700 hover:bg-green-600'
                          : 'bg-gray-700 hover:bg-gray-600'
                          }`}
                      >
                        {entrenamiento.completado ? (
                          <CheckCircle className="w-5 h-5 text-white" />
                        ) : (
                          <XCircle className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MisEntrenamientos;