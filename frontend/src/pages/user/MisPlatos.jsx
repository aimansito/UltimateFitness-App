import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import {
  Utensils,
  Clock,
  TrendingUp,
  Star,
  ChevronRight,
  Award,
  Plus,
  Search
} from 'lucide-react';

function MisPlatos() {
  const { user, isPremium } = useAuth();
  const navigate = useNavigate();
  const [platos, setPlatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPlatos = async () => {
      try {
        setLoading(true);
        console.log('Cargando platos del usuario:', user.id);

        const response = await api.get(`/platos/usuario/${user.id}`);

        if (response.data.success) {
          console.log('Platos cargados:', response.data);
          setPlatos(response.data.platos);
        }
      } catch (error) {
        console.error('Error al cargar platos:', error);
        setPlatos([]);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchPlatos();
    }
  }, [user]);

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
              Los platos personalizados están disponibles solo para usuarios Premium.
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
          <p className="text-white text-xl">Cargando platos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-uf-darker via-gray-900 to-black py-12 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Utensils className="w-8 h-8 text-uf-gold" />
              Mis Platos
            </h1>
            <p className="text-gray-400 mt-1">Platos que has creado en tus dietas</p>
          </div>
        </div>

        {/* Buscador */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar platos por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-uf-gold transition-all"
            />
          </div>
        </div>

        {/* Contenido */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-lg shadow-2xl border border-gray-700">

          {filteredPlatos.length === 0 ? (
            <div className="text-center py-12">
              <Utensils className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">
                {searchTerm
                  ? `No se encontraron platos con "${searchTerm}"`
                  : 'Aún no has creado ningún plato en tus dietas.'}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => navigate('/crear-dieta')}
                  className="mt-4 text-uf-gold hover:underline font-bold"
                >
                  ¡Crea tu primera dieta ahora!
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredPlatos.map((plato) => (
                <div
                  key={plato.id}
                  className="bg-gradient-to-r from-gray-900 to-gray-800 border-2 border-gray-700 hover:border-uf-gold rounded-lg p-6 transition-all duration-300 hover:shadow-xl cursor-pointer"
                  onClick={() => navigate(`/plato/${plato.id}`)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Utensils className="w-5 h-5 text-uf-gold" />
                        <h3 className="text-xl font-bold text-white">
                          {plato.nombre}
                        </h3>
                      </div>
                      {plato.descripcion && (
                        <p className="text-gray-400 text-sm mb-3">
                          {plato.descripcion}
                        </p>
                      )}
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-500" />
                  </div>

                  {/* Macros */}
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    <div className="text-center bg-gray-800 rounded p-2">
                      <p className="text-xs text-gray-400">Calorías</p>
                      <p className="text-sm font-bold text-white">{Math.round(plato.calorias_totales)}</p>
                    </div>
                    <div className="text-center bg-gray-800 rounded p-2">
                      <p className="text-xs text-orange-400">Proteínas</p>
                      <p className="text-sm font-bold text-white">{Math.round(plato.proteinas_totales)}g</p>
                    </div>
                    <div className="text-center bg-gray-800 rounded p-2">
                      <p className="text-xs text-blue-400">Carbos</p>
                      <p className="text-sm font-bold text-white">{Math.round(plato.carbohidratos_totales)}g</p>
                    </div>
                    <div className="text-center bg-gray-800 rounded p-2">
                      <p className="text-xs text-yellow-400">Grasas</p>
                      <p className="text-sm font-bold text-white">{Math.round(plato.grasas_totales)}g</p>
                    </div>
                  </div>

                  {/* Info adicional */}
                  <div className="flex flex-wrap gap-2">
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
                    {plato.valoracion_promedio > 0 && (
                      <span className="px-2 py-1 rounded text-xs font-bold bg-uf-gold/20 text-uf-gold border border-uf-gold flex items-center gap-1">
                        <Star className="w-3 h-3 fill-current" />
                        {plato.valoracion_promedio.toFixed(1)}
                      </span>
                    )}
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

export default MisPlatos;
