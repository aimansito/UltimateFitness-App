import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import {
  Utensils,
  Plus,
  Edit,
  Trash2,
  Users,
  ChevronRight,
  Search,
  Eye,
  Globe
} from 'lucide-react';

function MisDietasEntrenador() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dietas, setDietas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalUsuarios, setModalUsuarios] = useState(null);
  const [usuariosAsignados, setUsuariosAsignados] = useState([]);

  useEffect(() => {
    if (user && user.id) {
      fetchDietas();
    }
  }, [user]);

  const fetchDietas = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/entrenador/dietas/${user.id}`);

      if (response.data.success) {
        setDietas(response.data.dietas);
      }
    } catch (error) {
      console.error('Error al cargar dietas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEliminarDieta = async (dietaId) => {
    if (!confirm('¿Estás seguro de eliminar esta dieta? Esta acción no se puede deshacer.')) return;

    try {
      const response = await api.delete(`/entrenador/dieta/${dietaId}`);

      if (response.data.success) {
        alert('✅ Dieta eliminada exitosamente');
        fetchDietas();
      }
    } catch (error) {
      console.error('Error al eliminar dieta:', error);
      alert('❌ Error al eliminar dieta');
    }
  };

  const handleVerUsuarios = async (dietaId, dietaNombre) => {
    try {
      const response = await api.get(`/entrenador/dieta/${dietaId}/usuarios-asignados`);

      if (response.data.success) {
        setUsuariosAsignados(response.data.usuarios);
        setModalUsuarios({ dietaId, dietaNombre });
      }
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      alert('❌ Error al cargar usuarios asignados');
    }
  };

  const filteredDietas = dietas.filter(dieta =>
    dieta.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (dieta.descripcion && dieta.descripcion.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-uf-darker via-gray-900 to-black py-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white text-xl">Cargando dietas...</p>
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
                Mis Dietas
              </h1>
              <p className="text-blue-100 mt-1">Gestiona tus planes nutricionales</p>
            </div>
            <button
              onClick={() => navigate('/entrenador/dashboard?vista=clientes')}
              className="bg-white text-blue-600 font-bold px-6 py-3 rounded-lg hover:bg-blue-50 transition flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Crear Nueva Dieta
            </button>
          </div>
        </div>

        {/* Buscador */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 border-b-2 border-gray-700">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar dietas por nombre o descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        {/* Contenido */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-b-lg shadow-2xl border border-gray-700">

          {filteredDietas.length === 0 ? (
            <div className="text-center py-16">
              <Utensils className="w-24 h-24 text-gray-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">
                {searchTerm
                  ? `No se encontraron dietas con "${searchTerm}"`
                  : 'Aún no has creado ninguna dieta'}
              </h3>
              <p className="text-gray-400 mb-6">
                {!searchTerm && 'Comienza creando tu primer plan nutricional'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDietas.map((dieta) => (
                <div
                  key={dieta.id}
                  className="bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-gray-700 hover:border-blue-500 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
                >
                  {/* Header de la dieta */}
                  <div className="bg-blue-900/30 border-b-2 border-blue-500/30 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold text-white">
                        {dieta.nombre}
                      </h3>
                      {dieta.es_publica && (
                        <Globe className="w-5 h-5 text-green-400" title="Dieta Pública" />
                      )}
                    </div>
                    {dieta.descripcion && (
                      <p className="text-gray-400 text-sm line-clamp-2">
                        {dieta.descripcion}
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
                          {dieta.calorias_totales ? Math.round(dieta.calorias_totales) : '-'}
                        </p>
                      </div>
                      <div className="bg-gray-900 rounded-lg p-3 text-center">
                        <p className="text-xs text-orange-400 mb-1">Proteínas</p>
                        <p className="text-lg font-bold text-white">
                          {dieta.proteinas_totales ? `${Math.round(dieta.proteinas_totales)}g` : '-'}
                        </p>
                      </div>
                      <div className="bg-gray-900 rounded-lg p-3 text-center">
                        <p className="text-xs text-blue-400 mb-1">Carbos</p>
                        <p className="text-lg font-bold text-white">
                          {dieta.carbohidratos_totales ? `${Math.round(dieta.carbohidratos_totales)}g` : '-'}
                        </p>
                      </div>
                      <div className="bg-gray-900 rounded-lg p-3 text-center">
                        <p className="text-xs text-yellow-400 mb-1">Grasas</p>
                        <p className="text-lg font-bold text-white">
                          {dieta.grasas_totales ? `${Math.round(dieta.grasas_totales)}g` : '-'}
                        </p>
                      </div>
                    </div>

                    {/* Usuarios asignados */}
                    <div className="mb-4">
                      <button
                        onClick={() => handleVerUsuarios(dieta.id, dieta.nombre)}
                        className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-lg transition flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-blue-400" />
                          <span className="text-sm">Usuarios asignados</span>
                        </div>
                        <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                          {dieta.usuarios_asignados}
                        </span>
                      </button>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/dieta/${dieta.id}`)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        Ver
                      </button>
                      <button
                        onClick={() => handleEliminarDieta(dieta.id)}
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
        {filteredDietas.length > 0 && (
          <div className="mt-6 text-center text-gray-400">
            Mostrando {filteredDietas.length} de {dietas.length} dietas
          </div>
        )}
      </div>

      {/* Modal de usuarios asignados */}
      {modalUsuarios && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden border-2 border-blue-500">
            <div className="bg-blue-600 p-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Users className="w-6 h-6" />
                Usuarios Asignados
              </h2>
              <p className="text-blue-100 mt-1">{modalUsuarios.dietaNombre}</p>
            </div>

            <div className="p-6 overflow-y-auto max-h-96">
              {usuariosAsignados.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No hay usuarios asignados a esta dieta</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {usuariosAsignados.map((usuario) => (
                    <div
                      key={usuario.id}
                      className="bg-gray-900 rounded-lg p-4 flex items-center justify-between hover:bg-gray-800 transition"
                    >
                      <div>
                        <p className="text-white font-bold">
                          {usuario.nombre} {usuario.apellidos}
                        </p>
                        <p className="text-gray-400 text-sm">{usuario.email}</p>
                        <p className="text-blue-400 text-xs mt-1">
                          Asignado: {usuario.fecha_asignacion}
                        </p>
                      </div>
                      {usuario.es_premium && (
                        <span className="bg-gradient-to-r from-uf-gold to-yellow-600 text-black text-xs font-bold px-3 py-1 rounded-full">
                          PREMIUM
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-gray-900 p-4 border-t-2 border-gray-700">
              <button
                onClick={() => setModalUsuarios(null)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MisDietasEntrenador;
