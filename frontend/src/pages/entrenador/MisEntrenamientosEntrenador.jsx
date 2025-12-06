import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import {
  Dumbbell,
  Plus,
  Edit,
  Trash2,
  Users,
  ChevronRight,
  Search,
  Eye,
  Calendar,
  Target
} from 'lucide-react';

function MisEntrenamientosEntrenador() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [entrenamientos, setEntrenamientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (user && user.id) {
      fetchEntrenamientos();
    }
  }, [user]);

  const fetchEntrenamientos = async () => {
    try {
      setLoading(true);
      // Endpoint específico para entrenadores (busca por creador_id)
      const response = await api.get(`/entrenador/mis-entrenamientos/${user.id}`);

      console.log('✅ Respuesta entrenamientos entrenador:', response.data);

      if (response.data.success) {
        // Los entrenamientos creados por el entrenador
        setEntrenamientos(response.data.creados || []);
      }
    } catch (error) {
      console.error('❌ Error al cargar entrenamientos:', error);
      console.error('Detalle del error:', error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const handleEliminarEntrenamiento = async (entrenamientoId) => {
    if (!confirm('¿Estás seguro de eliminar este entrenamiento? Esta acción no se puede deshacer.')) return;

    try {
      const response = await api.delete(`/custom/entrenamientos/${entrenamientoId}`);

      if (response.data.success) {
        alert('✅ Entrenamiento eliminado exitosamente');
        fetchEntrenamientos();
      }
    } catch (error) {
      console.error('Error al eliminar entrenamiento:', error);
      alert('❌ Error al eliminar entrenamiento');
    }
  };

  const contarEjerciciosTotales = (entrenamiento) => {
    if (!entrenamiento.dias) return 0;
    return entrenamiento.dias.reduce((total, dia) => {
      return total + (dia.ejercicios?.length || 0);
    }, 0);
  };

  const contarDiasActivos = (entrenamiento) => {
    if (!entrenamiento.dias) return 0;
    return entrenamiento.dias.filter(dia => !dia.esDescanso).length;
  };

  const filteredEntrenamientos = entrenamientos.filter(entrenamiento =>
    entrenamiento.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (entrenamiento.descripcion && entrenamiento.descripcion.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-uf-darker via-gray-900 to-black py-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white text-xl">Cargando entrenamientos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-uf-darker via-gray-900 to-black py-12 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 py-6 px-8 rounded-t-lg shadow-lg">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white uppercase tracking-wider flex items-center gap-3">
                <Dumbbell className="w-8 h-8" />
                Mis Entrenamientos
              </h1>
              <p className="text-purple-100 mt-1">Gestiona tus rutinas de entrenamiento</p>
            </div>
            <div className="bg-white/20 px-4 py-2 rounded-lg">
              <span className="text-white font-bold text-2xl">{entrenamientos.length}</span>
              <span className="text-purple-100 text-sm ml-2">Total</span>
            </div>
          </div>
        </div>

        {/* Barra de búsqueda y acción */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 border-b-2 border-gray-700">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Búsqueda */}
            <div className="relative flex-1 w-full md:max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar entrenamientos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-900 border-2 border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
              />
            </div>

            {/* Botón Crear */}
            <button
              onClick={() => navigate('/entrenador/dashboard?vista=clientes')}
              className="bg-white text-purple-600 font-bold px-6 py-3 rounded-lg hover:bg-purple-50 transition flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Crear Nuevo Entrenamiento
            </button>
          </div>
        </div>

        {/* Lista de entrenamientos */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-b-lg shadow-2xl border border-gray-700">
          {filteredEntrenamientos.length === 0 ? (
            <div className="text-center py-16">
              <Dumbbell className="w-24 h-24 text-gray-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">
                {searchTerm ? 'No se encontraron entrenamientos' : 'No tienes entrenamientos creados'}
              </h3>
              <p className="text-gray-400 mb-6">
                {searchTerm ? 'Intenta con otros términos de búsqueda' : 'Crea tu primer plan de entrenamiento para tus clientes'}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => navigate('/entrenador/dashboard?vista=clientes')}
                  className="bg-purple-600 text-white font-bold px-8 py-3 rounded-lg hover:bg-purple-700 transition flex items-center gap-2 mx-auto"
                >
                  <Plus className="w-5 h-5" />
                  Crear Primer Entrenamiento
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEntrenamientos.map((entrenamiento) => (
                <div
                  key={entrenamiento.id}
                  className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border-2 border-gray-700 hover:border-purple-500 transition-all duration-300 overflow-hidden group"
                >
                  {/* Header */}
                  <div className="bg-purple-900/30 border-b-2 border-purple-500/30 p-4">
                    <h3 className="text-xl font-bold text-white mb-2">{entrenamiento.nombre}</h3>
                    <p className="text-gray-400 text-sm line-clamp-2">
                      {entrenamiento.descripcion || 'Sin descripción'}
                    </p>

                    {/* Badge tipo */}
                    <div className="flex items-center gap-2 mt-3">
                      <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-xs font-bold uppercase">
                        {entrenamiento.tipo}
                      </span>
                      <span className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-xs font-bold">
                        {entrenamiento.nivelDificultad}
                      </span>
                    </div>
                  </div>

                  {/* Estadísticas */}
                  <div className="p-4">
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="bg-gray-900 rounded-lg p-3 text-center">
                        <p className="text-xs text-gray-400 mb-1">Días</p>
                        <p className="text-lg font-bold text-purple-400">
                          {contarDiasActivos(entrenamiento)}/7
                        </p>
                      </div>
                      <div className="bg-gray-900 rounded-lg p-3 text-center">
                        <p className="text-xs text-gray-400 mb-1">Ejercicios</p>
                        <p className="text-lg font-bold text-blue-400">
                          {contarEjerciciosTotales(entrenamiento)}
                        </p>
                      </div>
                      <div className="bg-gray-900 rounded-lg p-3 text-center">
                        <p className="text-xs text-gray-400 mb-1">Duración</p>
                        <p className="text-lg font-bold text-green-400">
                          {entrenamiento.duracionMinutos}m
                        </p>
                      </div>
                    </div>

                    {/* Asignado a */}
                    {entrenamiento.asignadoA && (
                      <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-3 mb-4">
                        <div className="flex items-center gap-2 text-blue-300 text-sm">
                          <Users className="w-4 h-4" />
                          <span className="font-semibold">Asignado a:</span>
                        </div>
                        <p className="text-white text-sm mt-1">
                          {entrenamiento.asignadoA.nombre} {entrenamiento.asignadoA.apellidos}
                        </p>
                      </div>
                    )}

                    {/* Acciones */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/entrenamiento/${entrenamiento.id}`)}
                        className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        Ver
                      </button>
                      <button
                        onClick={() => handleEliminarEntrenamiento(entrenamiento.id)}
                        className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between text-xs text-gray-400 mt-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(entrenamiento.fechaCreacion).toLocaleDateString('es-ES')}
                      </span>
                      {entrenamiento.esPublico && (
                        <span className="bg-green-900/30 text-green-400 px-2 py-1 rounded-full text-xs font-bold">
                          Público
                        </span>
                      )}
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

export default MisEntrenamientosEntrenador;
