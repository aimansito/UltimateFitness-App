// ============================================
// GYM - Biblioteca de ejercicios
// ============================================
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import TarjetaEjercicio from '../../components/gym/TarjetaEjercicio';
import ModalEjercicio from '../../components/gym/ModalEjercicio';
import BarraFiltros from '../../components/gym/BarraFiltros';

function Gym() {
  // ============================================
  // ESTADO
  // ============================================
  const { isPremium } = useAuth();
  const [ejercicios, setEjercicios] = useState([]);
  const [ejerciciosFiltrados, setEjerciciosFiltrados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [ejercicioSeleccionado, setEjercicioSeleccionado] = useState(null);
  
  // Filtros
  const [musculoSeleccionado, setMusculoSeleccionado] = useState('TODOS');
  const [nivelSeleccionado, setNivelSeleccionado] = useState('');

  // ============================================
  // GRUPOS MUSCULARES
  // ============================================
  const gruposMusculares = [
    { id: 'TODOS', nombre: 'TODOS' },
    { id: 'pecho', nombre: 'PECHO' },
    { id: 'espalda', nombre: 'ESPALDA' },
    { id: 'piernas', nombre: 'PIERNAS' },
    { id: 'hombros', nombre: 'HOMBROS' },
    { id: 'biceps', nombre: 'BÍCEPS' },
    { id: 'triceps', nombre: 'TRÍCEPS' },
    { id: 'core', nombre: 'CORE' },
    { id: 'gluteos', nombre: 'GLÚTEOS' }
  ];

  // ============================================
  // CARGAR EJERCICIOS
  // ============================================
  useEffect(() => {
    cargarEjercicios();
  }, []);

  const cargarEjercicios = async () => {
    try {
      setCargando(true);
      setError(null);
      // Endpoint correcto según backend: /api/custom/ejercicios
      const response = await fetch('http://localhost:8000/api/custom/ejercicios');
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}`);
      }
      
      const data = await response.json();
      
      // API Platform puede usar "member" o "hydra:member"
      let ejerciciosData = data.member || data['hydra:member'] || [];
      
      console.log('✅ Ejercicios cargados:', ejerciciosData.length);
      
      setEjercicios(ejerciciosData);
      setEjerciciosFiltrados(ejerciciosData);
    } catch (err) {
      console.error('❌ Error:', err);
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  // ============================================
  // FILTRAR EJERCICIOS
  // ============================================
  useEffect(() => {
    let filtrados = [...ejercicios];

    if (musculoSeleccionado !== 'TODOS') {
      filtrados = filtrados.filter(ej => 
        ej.grupoMuscular?.toLowerCase() === musculoSeleccionado.toLowerCase()
      );
    }

    if (nivelSeleccionado) {
      filtrados = filtrados.filter(ej => 
        ej.nivelDificultad?.toLowerCase() === nivelSeleccionado.toLowerCase()
      );
    }

    setEjerciciosFiltrados(filtrados);
  }, [musculoSeleccionado, nivelSeleccionado, ejercicios]);

  // ============================================
  // ABRIR MODAL
  // ============================================
  const abrirModal = (ejercicio) => {
    setEjercicioSeleccionado(ejercicio);
  };

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-uf-darker to-black py-12">
      <div className="container mx-auto px-4">
        
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-anton font-bold text-white mb-4 uppercase tracking-wider">
            Biblioteca de <span className="text-uf-gold">Ejercicios</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            Explora nuestra colección completa de ejercicios
          </p>
        </div>

        {!isPremium && (
          <div className="max-w-4xl mx-auto mb-12">
            <div className="bg-gradient-to-r from-uf-gold/20 to-yellow-600/20 border-2 border-uf-gold rounded-xl p-6 text-center">
              <h3 className="text-xl font-bold text-white mb-3">
                Hazte Premium para acceder a videos HD
              </h3>
              <button className="bg-uf-gold text-black font-bold px-8 py-3 rounded-lg hover:bg-yellow-500 transition">
                Actualizar a Premium
              </button>
            </div>
          </div>
        )}

        {!cargando && !error && (
          <BarraFiltros
            gruposMusculares={gruposMusculares}
            musculoSeleccionado={musculoSeleccionado}
            setMusculoSeleccionado={setMusculoSeleccionado}
            nivelSeleccionado={nivelSeleccionado}
            setNivelSeleccionado={setNivelSeleccionado}
          />
        )}

        {cargando && (
          <div className="flex flex-col justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-uf-gold mb-4"></div>
            <p className="text-white text-xl">Cargando...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-20">
            <p className="text-red-400 text-xl mb-4">Error al cargar</p>
            <button
              onClick={cargarEjercicios}
              className="bg-uf-gold text-black font-bold px-8 py-3 rounded-lg"
            >
              Reintentar
            </button>
          </div>
        )}

        {!cargando && !error && ejerciciosFiltrados.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ejerciciosFiltrados.map((ejercicio) => (
              <TarjetaEjercicio
                key={ejercicio.id}
                ejercicio={ejercicio}
                isPremium={isPremium}
                onClick={() => abrirModal(ejercicio)}
              />
            ))}
          </div>
        )}

        {!cargando && !error && ejerciciosFiltrados.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-xl">No se encontraron ejercicios</p>
          </div>
        )}

      </div>

      {ejercicioSeleccionado && (
        <ModalEjercicio
          ejercicio={ejercicioSeleccionado}
          onClose={() => setEjercicioSeleccionado(null)}
          isPremium={isPremium}
        />
      )}
    </div>
  );
}

export default Gym;
