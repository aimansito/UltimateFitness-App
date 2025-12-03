import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import {
  Utensils,
  Plus,
  Edit,
  Trash2,
  Clock,
  TrendingUp,
  ChevronRight,
  Search
} from 'lucide-react';

function MisPlatosEntrenador() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [platos, setPlatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (user && user.id) {
      fetchPlatos();
    }
  }, [user]);

  const fetchPlatos = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/platos/entrenador/${user.id}`);

      if (response.data.success) {
        setPlatos(response.data.platos);
      }
    } catch (error) {
      console.error('Error al cargar platos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEliminarPlato = async (platoId) => {
    if (!confirm('¿Estás seguro de eliminar este plato?')) return;

    try {
      const response = await api.delete(`/platos/${platoId}`);

      if (response.data.success) {
        alert('✅ Plato eliminado exitosamente');
        fetchPlatos();
      }
    } catch (error) {
      console.error('Error al eliminar plato:', error);
      alert('❌ Error al eliminar plato');
    }
  };

  const filteredPlatos = platos.filter(plato =>
    plato.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (plato.descripcion && plato.descripcion.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getDificultadColor = (dificultad) => {
    switch (dificultad) {
      case 'facil':
        return 'bg-green-500/20 text-green-400 border-green-500';
      case 'media':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500';
      case 'dificil':
        return 'bg-red-500/20 text-red-400 border-red-500';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-uf-darker via-gray-900 to-black py-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white text-xl">Cargando platos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-uf-darker via-gray-900 to-black py-12 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 py-6 px-8 rounded-t-lg shadow-lg">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white uppercase tracking-wider flex items-center gap-3">
                <Utensils className="w-8 h-8" />
                Mis Platos
              </h1>
              <p className="text-blue-100 mt-1">Gestiona tus recetas personalizadas</p>
            </div>
            <button
              onClick={() => navigate('/crear-plato')}
              className="bg-white text-blue-600 font-bold px-6 py-3 rounded-lg hover:bg-blue-50 transition flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Crear Nuevo Plato
            </button>
          </div>
        </div>

        {/* Buscador */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 border-b-2 border-gray-700">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar platos por nombre o descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        {/* Contenido */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-b-lg shadow-2xl border border-gray-700">

          {filteredPlatos.length === 0 ? (
            <div className="text-center py-16">
              <Utensils className="w-24 h-24 text-gray-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">
                {searchTerm
                  ? `No se encontraron platos con "${searchTerm}"`
                  : 'Aún no has creado ningún plato'}
              </h3>
              <p className="text-gray-400 mb-6">
                {!searchTerm && 'Comienza creando tu primer plato personalizado'}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => navigate('/crear-plato')}
                  className="bg-blue-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 mx-auto"
                >
                  <Plus className="w-5 h-5" />
                  Crear Primer Plato
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPlatos.map((plato) => (
                <div
                  key={plato.id}
                  className="bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-gray-700 hover:border-blue-500 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
                >
                  {/* Header del plato */}
                  <div className="bg-blue-900/30 border-b-2 border-blue-500/30 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Utensils className="w-5 h-5 text-blue-400" />
                      <h3 className="text-xl font-bold text-white">
                        {plato.nombre}
                      </h3>
                    </div>
                    {plato.descripcion && (
                      <p className="text-gray-400 text-sm line-clamp-2">
                        {plato.descripcion}
                      </p>
                    )}
                  </div>

                  {/* Contenido */}
                  <div className="p-4">
                    {/* Macros */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-gray-900 rounded-lg p-3 text-center">
                        <p className="text-xs text-gray-400 mb-1">Calorías</p>
                        <p className="text-lg font-bold text-white">
                          {Math.round(plato.calorias_totales)}
                        </p>
                      </div>
                      <div className="bg-gray-900 rounded-lg p-3 text-center">
                        <p className="text-xs text-orange-400 mb-1">Proteínas</p>
                        <p className="text-lg font-bold text-white">
                          {Math.round(plato.proteinas_totales)}g
                        </p>
                      </div>
                      <div className="bg-gray-900 rounded-lg p-3 text-center">
                        <p className="text-xs text-blue-400 mb-1">Carbos</p>
                        <p className="text-lg font-bold text-white">
                          {Math.round(plato.carbohidratos_totales)}g
                        </p>
                      </div>
                      <div className="bg-gray-900 rounded-lg p-3 text-center">
                        <p className="text-xs text-yellow-400 mb-1">Grasas</p>
                        <p className="text-lg font-bold text-white">
                          {Math.round(plato.grasas_totales)}g
                        </p>
                      </div>
                    </div>

                    {/* Info adicional */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {plato.dificultad && (
                        <span className={`px-2 py-1 rounded text-xs font-bold border ${getDificultadColor(plato.dificultad)}`}>
                          {plato.dificultad.toUpperCase()}
                        </span>
                      )}
                      {plato.tiempo_preparacion && (
                        <span className="px-2 py-1 rounded text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {plato.tiempo_preparacion} min
                        </span>
                      )}
                      {plato.tipo_comida && (
                        <span className="px-2 py-1 rounded text-xs font-bold bg-purple-500/20 text-purple-400 border border-purple-500">
                          {plato.tipo_comida}
                        </span>
                      )}
                    </div>

                    {/* Botones de acción */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/plato/${plato.id}`)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
                      >
                        <ChevronRight className="w-4 h-4" />
                        Ver
                      </button>
                      <button
                        onClick={() => navigate(`/editar-plato/${plato.id}`)}
                        className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-lg transition"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEliminarPlato(plato.id)}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Resumen */}
        {filteredPlatos.length > 0 && (
          <div className="mt-6 text-center text-gray-400">
            Mostrando {filteredPlatos.length} de {platos.length} platos
          </div>
        )}
      </div>
    </div>
  );
}

export default MisPlatosEntrenador;
