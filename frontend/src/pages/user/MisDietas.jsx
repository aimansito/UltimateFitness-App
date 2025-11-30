import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Utensils, 
  ChevronRight, 
  Calendar,
  Apple
} from 'lucide-react';

function MisDietas() {
  const { user } = useAuth();
  const [dietas, setDietas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchMisDietas();
    }
  }, [user]);

  const fetchMisDietas = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/usuario/mis-dietas/${user.id}`);
      
      if (response.data.success) {
        setDietas(response.data.dietas);
      }
    } catch (error) {
      console.error('Error al cargar dietas:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-uf-darker via-gray-900 to-black py-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-uf-gold mx-auto mb-4"></div>
          <p className="text-white text-xl">Cargando dietas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-uf-darker via-gray-900 to-black py-12 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-orange-700 py-6 px-8 rounded-t-lg shadow-lg">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white uppercase tracking-wider flex items-center gap-3">
                <Utensils className="w-8 h-8" />
                Mis Dietas
              </h1>
              <p className="text-orange-100 mt-1">Planes nutricionales asignados por tu entrenador</p>
            </div>
            <div className="bg-white/20 px-4 py-2 rounded-lg">
              <span className="text-white font-bold text-2xl">{dietas.length}</span>
              <span className="text-orange-100 text-sm ml-2">Dietas</span>
            </div>
          </div>
        </div>

        {/* Contenido */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-b-lg shadow-2xl border border-gray-700">
          
          {dietas.length === 0 ? (
            <div className="text-center py-16">
              <Apple className="w-24 h-24 text-gray-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">No tienes dietas asignadas</h3>
              <p className="text-gray-400">Tu entrenador aún no te ha asignado ningún plan nutricional</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dietas.map((dieta) => (
                <Link
                  key={dieta.id}
                  to={`/mis-dietas/${dieta.id}`}
                  className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border-2 border-gray-700 hover:border-orange-500 transition-all duration-300 overflow-hidden group"
                >
                  <div className="bg-orange-900/30 border-b-2 border-orange-500/30 p-4">
                    <h3 className="text-xl font-bold text-white mb-2">{dieta.nombre}</h3>
                    <p className="text-gray-400 text-sm line-clamp-2">
                      {dieta.descripcion || 'Sin descripción'}
                    </p>
                  </div>

                  <div className="p-4">
                    {/* Macros */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-gray-900 rounded-lg p-3 text-center">
                        <p className="text-xs text-gray-400 mb-1">Calorías</p>
                        <p className="text-lg font-bold text-orange-400">
                          {dieta.calorias_totales ? Math.round(dieta.calorias_totales) : '-'}
                        </p>
                      </div>
                      <div className="bg-gray-900 rounded-lg p-3 text-center">
                        <p className="text-xs text-gray-400 mb-1">Proteínas</p>
                        <p className="text-lg font-bold text-blue-400">
                          {dieta.proteinas_totales ? `${Math.round(dieta.proteinas_totales)}g` : '-'}
                        </p>
                      </div>
                      <div className="bg-gray-900 rounded-lg p-3 text-center">
                        <p className="text-xs text-gray-400 mb-1">Carbos</p>
                        <p className="text-lg font-bold text-green-400">
                          {dieta.carbohidratos_totales ? `${Math.round(dieta.carbohidratos_totales)}g` : '-'}
                        </p>
                      </div>
                      <div className="bg-gray-900 rounded-lg p-3 text-center">
                        <p className="text-xs text-gray-400 mb-1">Grasas</p>
                        <p className="text-lg font-bold text-yellow-400">
                          {dieta.grasas_totales ? `${Math.round(dieta.grasas_totales)}g` : '-'}
                        </p>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-gray-400">
                        <Calendar className="w-4 h-4" />
                        {dieta.fecha_asignacion}
                      </div>
                      <ChevronRight className="w-5 h-5 text-orange-500 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MisDietas;