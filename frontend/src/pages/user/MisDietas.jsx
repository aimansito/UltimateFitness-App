import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../../services/api';
import {
  Utensils,
  ChevronRight,
  Calendar,
  Apple,
  User,
  Globe
} from 'lucide-react';

function MisDietas() {
  const { user, isPremium } = useAuth();
  const [searchParams] = useSearchParams();
  const [dietasAsignadas, setDietasAsignadas] = useState([]);
  const [dietasCreadas, setDietasCreadas] = useState([]);
  const [dietasPublicas, setDietasPublicas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Leer pestaña de URL o usar default
  const tabFromUrl = searchParams.get('tab');
  const getInitialTab = () => {
    if (tabFromUrl && ['asignadas', 'creadas', 'publicas'].includes(tabFromUrl)) {
      return tabFromUrl;
    }
    return isPremium ? 'asignadas' : 'publicas';
  };

  const [tabActivo, setTabActivo] = useState(getInitialTab());

  useEffect(() => {
    if (user) {
      fetchMisDietas();
      fetchDietasPublicas();
    }
  }, [user]);

  // Actualizar pestaña cuando cambia el parámetro de URL
  useEffect(() => {
    if (tabFromUrl && ['asignadas', 'creadas', 'publicas'].includes(tabFromUrl)) {
      setTabActivo(tabFromUrl);
    }
  }, [tabFromUrl]);

  const fetchMisDietas = async () => {
    try {
      // Solo cargar dietas personales si es premium
      if (isPremium) {
        const response = await api.get(`/usuario/mis-dietas/${user.id}`);
        console.log('✅ Respuesta dietas usuario:', response.data);

        if (response.data.success) {
          setDietasAsignadas(response.data.dietasAsignadas || []);
          setDietasCreadas(response.data.dietasCreadas || []);
        }
      }
    } catch (error) {
      console.error('❌ Error al cargar dietas:', error);
      console.error('Detalle del error:', error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const fetchDietasPublicas = async () => {
    try {
      const response = await api.get('/custom/dietas/publicas');
      console.log('✅ Respuesta dietas públicas:', response.data);

      if (response.data.success) {
        setDietasPublicas(response.data.dietas || []);
      }
    } catch (error) {
      console.error('❌ Error al cargar dietas públicas:', error);
      console.error('Detalle del error:', error.response?.data);
    }
  };

  const renderDietas = (dietas, tipo) => {
    if (dietas.length === 0) {
      const mensajes = {
        asignadas: {
          titulo: 'No tienes dietas asignadas',
          descripcion: 'Tu entrenador aún no te ha asignado ningún plan nutricional'
        },
        creadas: {
          titulo: 'No has creado dietas',
          descripcion: 'Aún no has creado ninguna dieta personalizada'
        },
        publicas: {
          titulo: 'No hay dietas públicas disponibles',
          descripcion: 'Próximamente habrá más dietas disponibles'
        }
      };

      return (
        <div className="text-center py-16">
          <Apple className="w-24 h-24 text-gray-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">
            {mensajes[tipo].titulo}
          </h3>
          <p className="text-gray-400">
            {mensajes[tipo].descripcion}
          </p>
        </div>
      );
    }

    return (
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
              {tipo === 'asignadas' && dieta.entrenador_nombre && (
                <div className="flex items-center gap-2 mt-2 text-orange-300 text-sm">
                  <User className="w-4 h-4" />
                  <span>{dieta.entrenador_nombre} {dieta.entrenador_apellidos}</span>
                </div>
              )}
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
                  {tipo === 'asignadas' ? dieta.fecha_asignacion : dieta.fecha_creacion}
                </div>
                <ChevronRight className="w-5 h-5 text-orange-500 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    );
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

  const totalDietas = isPremium
    ? dietasAsignadas.length + dietasCreadas.length
    : dietasPublicas.length;

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
              <p className="text-orange-100 mt-1">Gestiona tus planes nutricionales</p>
            </div>
            <div className="bg-white/20 px-4 py-2 rounded-lg">
              <span className="text-white font-bold text-2xl">{totalDietas}</span>
              <span className="text-orange-100 text-sm ml-2">Total</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 border-b-2 border-gray-700">
          <div className="flex gap-1 p-2">
            {isPremium && (
              <>
                <button
                  onClick={() => setTabActivo('asignadas')}
                  className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${tabActivo === 'asignadas'
                      ? 'bg-orange-500 text-white shadow-lg'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <User className="w-5 h-5" />
                    <span>Dietas de mi Entrenador</span>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs ${tabActivo === 'asignadas' ? 'bg-white/20' : 'bg-gray-900'
                      }`}>
                      {dietasAsignadas.length}
                    </span>
                  </div>
                </button>
                <button
                  onClick={() => setTabActivo('creadas')}
                  className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${tabActivo === 'creadas'
                      ? 'bg-orange-500 text-white shadow-lg'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Utensils className="w-5 h-5" />
                    <span>Mis Dietas Creadas</span>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs ${tabActivo === 'creadas' ? 'bg-white/20' : 'bg-gray-900'
                      }`}>
                      {dietasCreadas.length}
                    </span>
                  </div>
                </button>
              </>
            )}
            <button
              onClick={() => setTabActivo('publicas')}
              className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${tabActivo === 'publicas'
                  ? 'bg-orange-500 text-white shadow-lg'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Globe className="w-5 h-5" />
                <span>Dietas Públicas</span>
                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${tabActivo === 'publicas' ? 'bg-white/20' : 'bg-gray-900'
                  }`}>
                  {dietasPublicas.length}
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Contenido */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-b-lg shadow-2xl border border-gray-700">
          {tabActivo === 'asignadas' && renderDietas(dietasAsignadas, 'asignadas')}
          {tabActivo === 'creadas' && renderDietas(dietasCreadas, 'creadas')}
          {tabActivo === 'publicas' && renderDietas(dietasPublicas, 'publicas')}
        </div>
      </div>
    </div>
  );
}

export default MisDietas;