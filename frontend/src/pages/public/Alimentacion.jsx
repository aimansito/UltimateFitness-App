// ============================================
// ALIMENTACIÓN - Dietas profesionales
// ============================================
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Alimentacion() {
  const { isPremium } = useAuth();
  const [dietas, setDietas] = useState([]);
  const [dietasFiltradas, setDietasFiltradas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [objetivoSeleccionado, setObjetivoSeleccionado] = useState('TODAS');

  const objetivos = [
    { id: 'TODAS', nombre: 'TODAS' },
    { id: 'perder_peso', nombre: 'PÉRDIDA DE PESO' },
    { id: 'ganar_masa', nombre: 'GANANCIA MUSCULAR' },
    { id: 'definicion', nombre: 'DEFINICIÓN' },
    { id: 'rendimiento', nombre: 'RENDIMIENTO DEPORTIVO' },
    { id: 'mantenimiento', nombre: 'MANTENIMIENTO' }
  ];

  useEffect(() => {
    cargarDietas();
  }, []);

  const cargarDietas = async () => {
    try {
      setCargando(true);
      const response = await fetch('http://localhost:8000/api/custom/dietas/publicas');
      const data = await response.json();
      
      const dietasData = data.dietas || [];
      setDietas(dietasData);
      setDietasFiltradas(dietasData);
    } catch (error) {
      console.error('Error cargando dietas:', error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    if (objetivoSeleccionado === 'TODAS') {
      setDietasFiltradas(dietas);
    } else {
      const filtradas = dietas.filter(d => 
        d.nombre?.toLowerCase().includes(objetivoSeleccionado.toLowerCase())
      );
      setDietasFiltradas(filtradas);
    }
  }, [objetivoSeleccionado, dietas]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-uf-darker to-black py-12">
      <div className="container mx-auto px-4">
        
        {/* HEADER */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-anton font-bold text-white mb-4 uppercase tracking-wider">
            <span className="text-uf-gold">Dietas</span> Profesionales
          </h1>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto mb-8">
            Planes nutricionales diseñados por expertos, clasificados por objetivos y valorados por la comunidad
          </p>
          
          <Link
            to="/crear-dieta"
            className="inline-flex items-center gap-2 bg-uf-gold text-black font-bold px-8 py-4 rounded-lg hover:bg-uf-blue hover:text-white transition-all duration-300 transform hover:scale-105 uppercase text-sm shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Crear Mi Dieta
          </Link>
        </div>

        {/* FILTROS */}
        <div className="mb-12">
          <div className="flex flex-wrap gap-3 justify-center">
            {objetivos.map((objetivo) => (
              <button
                key={objetivo.id}
                onClick={() => setObjetivoSeleccionado(objetivo.id)}
                className={`
                  px-6 py-3 rounded-lg font-bold uppercase text-sm transition-all duration-300
                  ${objetivoSeleccionado === objetivo.id
                    ? 'bg-uf-gold text-black shadow-lg shadow-uf-gold/50'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                  }
                `}
              >
                {objetivo.nombre}
              </button>
            ))}
          </div>
        </div>

        {/* DIETAS DESTACADAS */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <svg className="w-8 h-8 text-uf-gold" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <h2 className="text-3xl font-anton font-bold text-white uppercase">
              Dietas Destacadas
            </h2>
          </div>

          {cargando && (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-uf-gold"></div>
            </div>
          )}

          {!cargando && dietasFiltradas.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dietasFiltradas.map((dieta) => (
                <TarjetaDieta
                  key={dieta.id}
                  dieta={dieta}
                  isPremium={isPremium}
                />
              ))}
            </div>
          )}

          {!cargando && dietasFiltradas.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-400 text-xl">
                No se encontraron dietas con este filtro
              </p>
            </div>
          )}
        </div>

        {/* SUPLEMENTOS */}
        <SeccionSuplementos isPremium={isPremium} />

      </div>
    </div>
  );
}

// ============================================
// COMPONENTE: TarjetaDieta
// ============================================
function TarjetaDieta({ dieta, isPremium }) {
  const esPremium = Math.random() > 0.7; // Simulado

  return (
    <Link
      to={`/dieta/${dieta.id}`}
      className="group relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden border-2 border-gray-700 hover:border-uf-gold transition-all duration-300 transform hover:scale-105"
    >
      {esPremium && (
        <div className="absolute top-3 right-3 bg-uf-gold text-black px-3 py-1 rounded-full font-bold text-xs flex items-center gap-1 z-10">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          PREMIUM
        </div>
      )}

      <div className="h-48 bg-gradient-to-br from-uf-gold/20 to-green-500/20 flex items-center justify-center">
        <svg className="w-24 h-24 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-2 uppercase">
          {dieta.nombre}
        </h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {dieta.descripcion || 'Plan nutricional completo'}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-4 h-4 ${i < Math.floor(dieta.valoracionPromedio || 0) ? 'text-uf-gold' : 'text-gray-600'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="text-gray-400 text-sm ml-2">
              ({dieta.totalValoraciones || 0})
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ============================================
// COMPONENTE: SeccionSuplementos
// ============================================
function SeccionSuplementos({ isPremium }) {
  const suplementos = [
    {
      nombre: 'WHEY PROTEIN ISOLATE',
      categoria: 'Proteína',
      descripcion: 'Proteína de suero aislada de máxima pureza',
      premium: false
    },
    {
      nombre: 'CREATINA MONOHIDRATO',
      categoria: 'Creatina',
      descripcion: 'Creatina pura micronizada de grado farmacéutico',
      premium: false
    },
    {
      nombre: 'PRE-WORKOUT EXTREME',
      categoria: 'Pre-entreno',
      descripcion: 'Fórmula avanzada con cafeína y beta-alanina',
      premium: true
    }
  ];

  return (
    <div>
      <h2 className="text-3xl font-anton font-bold text-white uppercase mb-8">
        <span className="text-uf-gold">Suplementos</span> Recomendados
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {suplementos.map((suplemento, index) => (
          <div
            key={index}
            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border-2 border-gray-700 hover:border-uf-gold transition-all duration-300"
          >
            {suplemento.premium && !isPremium && (
              <div className="flex items-center justify-center mb-4">
                <svg className="w-16 h-16 text-uf-gold" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" />
                </svg>
              </div>
            )}

            <div className="flex items-center gap-2 mb-3">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                suplemento.categoria === 'Proteína' ? 'bg-red-500/20 text-red-400' :
                suplemento.categoria === 'Creatina' ? 'bg-purple-500/20 text-purple-400' :
                'bg-orange-500/20 text-orange-400'
              }`}>
                {suplemento.categoria}
              </span>
            </div>

            <h3 className="text-lg font-bold text-white mb-2 uppercase">
              {suplemento.nombre}
            </h3>
            <p className="text-gray-400 text-sm">
              {suplemento.descripcion}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Alimentacion;