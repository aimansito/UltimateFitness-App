import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Loader, Plus, Clock, TrendingUp, Eye, Utensils, Sunrise, Coffee, Apple, Moon, Dumbbell } from 'lucide-react';

function MisPlatos() {
  const [platos, setPlatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroTipo, setFiltroTipo] = useState('todos');

  const tiposComida = [
    { value: 'todos', label: 'Todos', icon: Utensils },
    { value: 'desayuno', label: 'Desayuno', icon: Sunrise },
    { value: 'media_manana', label: 'Media Mañana', icon: Coffee },
    { value: 'almuerzo', label: 'Almuerzo', icon: Utensils },
    { value: 'merienda', label: 'Merienda', icon: Apple },
    { value: 'cena', label: 'Cena', icon: Moon },
    { value: 'post_entreno', label: 'Post-Entreno', icon: Dumbbell }
  ];

  useEffect(() => {
    fetchPlatos();
  }, []);

  const fetchPlatos = async () => {
    try {
      setLoading(true);
      const response = await api.get('/platos');

      if (response.data.success) {
        setPlatos(response.data.platos);
      }
    } catch (error) {
      console.error('Error al cargar platos:', error);
    } finally {
      setLoading(false);
    }
  };

  const platosFiltrados = filtroTipo === 'todos'
    ? platos
    : platos.filter(p => p.tipo_comida === filtroTipo);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-uf-darker via-gray-900 to-black flex items-center justify-center">
        <Loader className="animate-spin h-16 w-16 text-uf-gold" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-uf-darker via-gray-900 to-black py-12 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 uppercase tracking-wider">
              Mis Platos
            </h1>
            <p className="text-gray-400 text-lg">
              Gestiona tus recetas y platos personalizados
            </p>
          </div>
          <Link
            to="/crear-dieta"
            className="flex items-center gap-2 bg-gradient-to-r from-uf-gold to-yellow-600 text-black font-bold px-6 py-3 rounded-lg hover:from-yellow-600 hover:to-uf-gold transition-all duration-300"
          >
            <Plus className="w-5 h-5" />
            Crear Plato
          </Link>
        </div>

        {/* Filtros */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3">
            {tiposComida.map((tipo) => {
              const Icon = tipo.icon;
              return (
                <button
                  key={tipo.value}
                  onClick={() => setFiltroTipo(tipo.value)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ${filtroTipo === tipo.value
                      ? 'bg-uf-gold text-black'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  {tipo.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Grid de platos */}
        {platosFiltrados.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {platosFiltrados.map((plato) => {
              const Icon = tiposComida.find(t => t.value === plato.tipo_comida)?.icon || Utensils;

              return (
                <div
                  key={plato.id}
                  className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border-2 border-gray-700 hover:border-uf-gold transition-all duration-300 overflow-hidden"
                >
                  {/* Imagen placeholder */}
                  <div className="bg-gray-800 h-40 flex items-center justify-center">
                    <Icon className="w-16 h-16 text-gray-400" />
                  </div>

                  <div className="p-6">
                    {/* Header */}
                    <div className="mb-4">
                      <span className="text-xs text-uf-gold font-bold uppercase tracking-wider">
                        {tiposComida.find(t => t.value === plato.tipo_comida)?.label}
                      </span>
                      <h3 className="text-xl font-bold text-white mt-1">
                        {plato.nombre}
                      </h3>
                      {plato.descripcion && (
                        <p className="text-gray-400 text-sm mt-2 line-clamp-2">
                          {plato.descripcion}
                        </p>
                      )}
                    </div>

                    {/* Macros */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-gray-900 rounded-lg p-3">
                        <p className="text-xs text-gray-400">Calorías</p>
                        <p className="text-lg font-bold text-uf-gold">
                          {Math.round(plato.calorias_totales)}
                        </p>
                      </div>
                      <div className="bg-gray-900 rounded-lg p-3">
                        <p className="text-xs text-gray-400">Proteínas</p>
                        <p className="text-lg font-bold text-green-400">
                          {Math.round(plato.proteinas_totales)}g
                        </p>
                      </div>
                      <div className="bg-gray-900 rounded-lg p-3">
                        <p className="text-xs text-gray-400">Carbos</p>
                        <p className="text-lg font-bold text-yellow-400">
                          {Math.round(plato.carbohidratos_totales)}g
                        </p>
                      </div>
                      <div className="bg-gray-900 rounded-lg p-3">
                        <p className="text-xs text-gray-400">Grasas</p>
                        <p className="text-lg font-bold text-blue-400">
                          {Math.round(plato.grasas_totales)}g
                        </p>
                      </div>
                    </div>

                    {/* Botones */}
                    <div className="flex gap-2">
                      <Link
                        to={`/plato/${plato.id}`}
                        className="flex-1 flex items-center justify-center gap-2 bg-uf-gold text-black font-bold py-2 rounded-lg hover:bg-yellow-600 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        Ver
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-400 text-xl mb-6">
              No tienes platos creados aún
            </p>
            <Link
              to="/crear-dieta"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-uf-gold to-yellow-600 text-black font-bold px-8 py-4 rounded-lg hover:from-yellow-600 hover:to-uf-gold transition-all duration-300"
            >
              <Plus className="w-5 h-5" />
              Crear Mi Primer Plato
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default MisPlatos;