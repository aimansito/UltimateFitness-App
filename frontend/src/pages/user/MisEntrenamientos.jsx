import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
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
  Award
} from 'lucide-react';

function MisEntrenamientos() {
  const { user, isPremium } = useAuth();
  const [entrenamientos, setEntrenamientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEntrenamiento, setSelectedEntrenamiento] = useState(null);

  // Cargar entrenamientos del usuario
  useEffect(() => {
    const fetchEntrenamientos = async () => {
      try {
        // TODO: Llamar al endpoint del backend
        // const response = await axios.get(`/api/usuarios/${user.id}/entrenamientos`);
        
        // Simulación de datos
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const entrenamientosMock = [
          {
            id: 1,
            nombre: 'Rutina Full Body - Principiante',
            tipo: 'fuerza',
            nivel_dificultad: 'principiante',
            duracion_minutos: 45,
            descripcion: 'Entrenamiento completo de cuerpo entero para principiantes',
            completado: false,
            fecha_asignacion: '2025-11-20',
            ejercicios: [
              { nombre: 'Sentadillas', series: 3, repeticiones: 12 },
              { nombre: 'Flexiones', series: 3, repeticiones: 10 },
              { nombre: 'Peso muerto', series: 3, repeticiones: 10 },
              { nombre: 'Plancha', series: 3, repeticiones: '30 seg' },
            ]
          },
          {
            id: 2,
            nombre: 'Cardio Intenso HIIT',
            tipo: 'cardio',
            nivel_dificultad: 'intermedio',
            duracion_minutos: 30,
            descripcion: 'Entrenamiento de alta intensidad por intervalos',
            completado: true,
            fecha_asignacion: '2025-11-18',
            ejercicios: [
              { nombre: 'Burpees', series: 4, repeticiones: 15 },
              { nombre: 'Mountain Climbers', series: 4, repeticiones: 20 },
              { nombre: 'Jumping Jacks', series: 4, repeticiones: 30 },
              { nombre: 'Sprint en sitio', series: 4, repeticiones: '30 seg' },
            ]
          },
          {
            id: 3,
            nombre: 'Entrenamiento de Piernas',
            tipo: 'fuerza',
            nivel_dificultad: 'avanzado',
            duracion_minutos: 60,
            descripcion: 'Rutina avanzada enfocada en piernas y glúteos',
            completado: false,
            fecha_asignacion: '2025-11-22',
            ejercicios: [
              { nombre: 'Sentadillas con barra', series: 4, repeticiones: 8 },
              { nombre: 'Zancadas', series: 3, repeticiones: 12 },
              { nombre: 'Peso muerto rumano', series: 4, repeticiones: 10 },
              { nombre: 'Prensa de piernas', series: 3, repeticiones: 12 },
            ]
          },
        ];
        
        setEntrenamientos(entrenamientosMock);
      } catch (error) {
        console.error('Error al cargar entrenamientos:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchEntrenamientos();
    }
  }, [user]);

  const marcarCompletado = async (id) => {
    try {
      // TODO: Llamar al endpoint del backend
      // await axios.post(`/api/entrenamientos/${id}/completar`);
      
      setEntrenamientos(prev => 
        prev.map(e => e.id === id ? { ...e, completado: !e.completado } : e)
      );
    } catch (error) {
      console.error('Error al marcar entrenamiento:', error);
    }
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
            href="/planes"
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-uf-darker via-gray-900 to-black py-12 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-uf-gold to-yellow-600 py-6 text-center rounded-t-lg shadow-lg">
          <h1 className="text-3xl font-bold text-black uppercase tracking-wider flex items-center justify-center gap-3">
            <Dumbbell className="w-8 h-8" />
            Mis Entrenamientos
          </h1>
        </div>

        {/* Contenido */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-b-lg shadow-2xl border border-gray-700">
          
          {/* Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-green-900/40 to-green-800/20 border-2 border-green-700 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-400 text-sm font-semibold uppercase tracking-wide">Completados</p>
                  <p className="text-4xl font-bold text-white mt-2">
                    {entrenamientos.filter(e => e.completado).length}
                  </p>
                </div>
                <CheckCircle className="w-12 h-12 text-green-400" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-900/40 to-yellow-800/20 border-2 border-yellow-700 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-400 text-sm font-semibold uppercase tracking-wide">Pendientes</p>
                  <p className="text-4xl font-bold text-white mt-2">
                    {entrenamientos.filter(e => !e.completado).length}
                  </p>
                </div>
                <Clock className="w-12 h-12 text-yellow-400" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 border-2 border-blue-700 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-400 text-sm font-semibold uppercase tracking-wide">Total</p>
                  <p className="text-4xl font-bold text-white mt-2">
                    {entrenamientos.length}
                  </p>
                </div>
                <TrendingUp className="w-12 h-12 text-blue-400" />
              </div>
            </div>
          </div>

          {/* Lista de entrenamientos */}
          {entrenamientos.length === 0 ? (
            <div className="text-center py-12">
              <Dumbbell className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">
                No tienes entrenamientos asignados todavía.
              </p>
              <p className="text-gray-500 mt-2">
                Tu entrenador te asignará rutinas pronto.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {entrenamientos.map((entrenamiento) => (
                <div
                  key={entrenamiento.id}
                  className={`bg-gradient-to-r from-gray-900 to-gray-800 border-2 rounded-lg p-6 transition-all duration-300 hover:shadow-xl ${
                    entrenamiento.completado
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
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getNivelColor(entrenamiento.nivel_dificultad)}`}>
                          {entrenamiento.nivel_dificultad.toUpperCase()}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500">
                          <Clock className="w-3 h-3 inline mr-1" />
                          {entrenamiento.duracion_minutos} min
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-400 border border-purple-500">
                          <Calendar className="w-3 h-3 inline mr-1" />
                          {new Date(entrenamiento.fecha_asignacion).toLocaleDateString('es-ES')}
                        </span>
                      </div>

                      {selectedEntrenamiento === entrenamiento.id && (
                        <div className="mt-6 bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                          <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-uf-gold" />
                            Ejercicios
                          </h4>
                          <div className="space-y-2">
                            {entrenamiento.ejercicios.map((ejercicio, idx) => (
                              <div key={idx} className="flex items-center justify-between text-gray-300 bg-gray-800/50 p-3 rounded">
                                <span className="font-semibold">{ejercicio.nombre}</span>
                                <span className="text-uf-gold">
                                  {ejercicio.series} series × {ejercicio.repeticiones}
                                </span>
                              </div>
                            ))}
                          </div>
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
                        <ChevronRight className={`w-5 h-5 text-uf-gold transition-transform ${
                          selectedEntrenamiento === entrenamiento.id ? 'rotate-90' : ''
                        }`} />
                      </button>

                      <button
                        onClick={() => marcarCompletado(entrenamiento.id)}
                        className={`p-2 rounded-lg transition-all ${
                          entrenamiento.completado
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