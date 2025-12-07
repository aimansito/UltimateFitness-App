// ============================================
// DETALLE DIETA - Plan diario con PLATOS
// ============================================
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ModalReceta from '../../components/ModalReceta';

function DetalleDieta() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [dieta, setDieta] = useState(null);
  const [planDiario, setPlanDiario] = useState(null);
  const [totales, setTotales] = useState(null);
  const [diaActual, setDiaActual] = useState('lunes');
  const [diasDisponibles, setDiasDisponibles] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [platoSeleccionado, setPlatoSeleccionado] = useState(null);

  const momentosDelDia = [
    { key: 'desayuno', nombre: 'DESAYUNO', icon: '🌅', color: 'orange' },
    { key: 'media_mañana', nombre: 'MEDIA MAÑANA', icon: '☕', color: 'yellow' },
    { key: 'comida', nombre: 'COMIDA', icon: '🍽️', color: 'green' },
    { key: 'merienda', nombre: 'MERIENDA', icon: '🍎', color: 'red' },
    { key: 'cena', nombre: 'CENA', icon: '🌙', color: 'blue' }
  ];

  const iconosDificultad = {
    'facil': '🟢',
    'media': '🟡',
    'dificil': '🔴'
  };

  const diasSemana = [
    { key: 'lunes', nombre: 'Lunes' },
    { key: 'martes', nombre: 'Martes' },
    { key: 'miercoles', nombre: 'Miércoles' },
    { key: 'jueves', nombre: 'Jueves' },
    { key: 'viernes', nombre: 'Viernes' },
    { key: 'sabado', nombre: 'Sábado' },
    { key: 'domingo', nombre: 'Domingo' }
  ];

  useEffect(() => {
    cargarPlanDiario();
  }, [id, diaActual]);

  const cargarPlanDiario = async () => {
    try {
      setCargando(true);
      const response = await fetch(`http://localhost:8000/api/custom/dietas/${id}/plan-diario?dia=${diaActual}`);
      const data = await response.json();

      if (data.success) {
        setDieta(data.dieta);
        setPlanDiario(data.planDiario);
        setTotales(data.totales);
        setDiasDisponibles(data.diasDisponibles || []);
      } else {
        setError('No se pudo cargar la dieta');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error al cargar la dieta');
    } finally {
      setCargando(false);
    }
  };

  if (cargando) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-uf-darker to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-uf-gold mx-auto mb-4"></div>
          <p className="text-white text-xl">Cargando dieta...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-uf-darker to-black flex items-center justify-center">
        <div className="text-center">
          <svg className="w-20 h-20 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-red-400 text-xl mb-4">{error}</p>
          <Link to="/alimentacion" className="text-uf-gold hover:underline">
            Volver a Alimentación
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-uf-darker to-black py-12">
      <div className="container mx-auto px-4">

        {/* HEADER */}
        <div className="mb-8">
          <Link
            to="/alimentacion"
            className="inline-flex items-center text-uf-gold hover:text-uf-blue transition mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver a Dietas
          </Link>

          <h1 className="text-4xl md:text-5xl font-anton font-bold text-white mb-3 uppercase">
            {dieta?.nombre}
          </h1>
          <p className="text-gray-400 text-lg">
            {dieta?.descripcion}
          </p>
        </div>

        {/* SELECTOR DE DÍAS */}
        {diasDisponibles.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-anton font-bold text-white mb-4 uppercase text-center">
              Seleccionar Día
            </h2>
            <div className="flex flex-wrap gap-3 justify-center">
              {diasSemana.map((dia) => {
                const disponible = diasDisponibles.includes(dia.key);
                return (
                  <button
                    key={dia.key}
                    onClick={() => disponible && setDiaActual(dia.key)}
                    disabled={!disponible}
                    className={`px-6 py-3 rounded-lg font-bold uppercase text-sm transition-all duration-300 ${diaActual === dia.key
                        ? 'bg-uf-gold text-black shadow-lg shadow-uf-gold/50'
                        : disponible
                          ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                          : 'bg-gray-900 text-gray-600 cursor-not-allowed opacity-50'
                      }`}
                  >
                    {dia.nombre}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* TOTALES DEL DÍA */}
        <div className="bg-gradient-to-r from-uf-gold/10 to-yellow-600/10 border-2 border-uf-gold rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-anton font-bold text-white mb-4 uppercase">
            Total del Día - {diasSemana.find(d => d.key === diaActual)?.nombre}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-uf-gold mb-1">
                {Math.round(totales?.calorias || 0)}
              </div>
              <div className="text-gray-400 text-sm uppercase">Calorías</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-red-400 mb-1">
                {Math.round(totales?.proteinas || 0)}g
              </div>
              <div className="text-gray-400 text-sm uppercase">Proteína</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400 mb-1">
                {Math.round(totales?.carbohidratos || 0)}g
              </div>
              <div className="text-gray-400 text-sm uppercase">Carbos</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-400 mb-1">
                {Math.round(totales?.grasas || 0)}g
              </div>
              <div className="text-gray-400 text-sm uppercase">Grasas</div>
            </div>
          </div>
        </div>

        {/* PLAN POR COMIDAS CON PLATOS */}
        <div className="space-y-6">
          {momentosDelDia.map((momento) => {
            const platos = planDiario?.[momento.key] || [];
            if (platos.length === 0) return null;

            // Calcular total de la comida sumando todos los platos
            const totalComida = platos.reduce((acc, plato) => ({
              calorias: acc.calorias + (plato.totales?.calorias || 0),
              proteinas: acc.proteinas + (plato.totales?.proteinas || 0),
              carbohidratos: acc.carbohidratos + (plato.totales?.carbohidratos || 0),
              grasas: acc.grasas + (plato.totales?.grasas || 0)
            }), { calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0 });

            return (
              <div
                key={momento.key}
                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden border-2 border-gray-700"
              >
                {/* Header de la comida */}
                <div className={`bg-gradient-to-r from-${momento.color}-500/20 to-${momento.color}-600/20 border-b-2 border-${momento.color}-500/30 p-4`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{momento.icon}</span>
                      <div>
                        <h3 className="text-xl font-anton font-bold text-white uppercase">
                          {momento.nombre}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          {Math.round(totalComida.calorias)} kcal · {platos.length} plato{platos.length > 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    <div className="hidden md:flex gap-4 text-sm">
                      <div className="text-center">
                        <div className="text-red-400 font-bold">{Math.round(totalComida.proteinas)}g</div>
                        <div className="text-gray-500">Proteína</div>
                      </div>
                      <div className="text-center">
                        <div className="text-blue-400 font-bold">{Math.round(totalComida.carbohidratos)}g</div>
                        <div className="text-gray-500">Carbos</div>
                      </div>
                      <div className="text-center">
                        <div className="text-yellow-400 font-bold">{Math.round(totalComida.grasas)}g</div>
                        <div className="text-gray-500">Grasas</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Lista de platos */}
                <div className="p-4 space-y-4">
                  {platos.map((plato, index) => (
                    <div
                      key={index}
                      className="bg-uf-darker rounded-xl overflow-hidden border border-gray-700 hover:border-uf-gold transition-all duration-300 cursor-pointer group"
                      onClick={() => setPlatoSeleccionado(plato)}
                    >
                      {/* Header del plato */}
                      <div className="p-4 bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-3 h-3 bg-uf-gold rounded-full animate-pulse"></div>
                              <h4 className="text-lg font-bold text-white group-hover:text-uf-gold transition">
                                {plato.nombre}
                              </h4>
                            </div>
                            <p className="text-gray-400 text-sm mb-3">
                              {plato.descripcion}
                            </p>
                            <div className="flex flex-wrap gap-3 text-xs">
                              <span className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full flex items-center gap-1">
                                🕐 {plato.tiempo_preparacion} min
                              </span>
                              <span className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full flex items-center gap-1">
                                {iconosDificultad[plato.dificultad]} {plato.dificultad}
                              </span>
                              <span className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full flex items-center gap-1">
                                ⭐ {plato.valoracion_promedio} ({plato.total_valoraciones})
                              </span>
                            </div>
                          </div>
                          <div className="text-right ml-4">
                            <div className="text-3xl font-bold text-uf-gold">
                              {Math.round(plato.totales?.calorias || 0)}
                            </div>
                            <div className="text-gray-500 text-xs">kcal</div>
                          </div>
                        </div>
                      </div>

                      {/* Ingredientes del plato */}
                      <div className="p-4">
                        <h5 className="text-sm font-bold text-gray-400 uppercase mb-3">
                          Ingredientes:
                        </h5>
                        <div className="grid md:grid-cols-2 gap-2">
                          {plato.ingredientes?.map((ing, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between bg-gray-800 p-3 rounded-lg"
                            >
                              <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-uf-gold rounded-full"></div>
                                <span className="text-white text-sm">
                                  {ing.nombre}
                                </span>
                                <span className="text-gray-500 text-xs">
                                  ({ing.cantidad}g)
                                </span>
                              </div>
                              <div className="text-gray-400 text-xs">
                                {Math.round(ing.calorias)} kcal
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Totales del plato */}
                        <div className="mt-4 pt-4 border-t border-gray-700">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400 text-sm font-bold">TOTALES DEL PLATO:</span>
                            <div className="flex gap-4 text-sm">
                              <div className="text-center">
                                <div className="text-red-400 font-bold">{Math.round(plato.totales?.proteinas || 0)}g</div>
                                <div className="text-gray-500 text-xs">P</div>
                              </div>
                              <div className="text-center">
                                <div className="text-blue-400 font-bold">{Math.round(plato.totales?.carbohidratos || 0)}g</div>
                                <div className="text-gray-500 text-xs">C</div>
                              </div>
                              <div className="text-center">
                                <div className="text-yellow-400 font-bold">{Math.round(plato.totales?.grasas || 0)}g</div>
                                <div className="text-gray-500 text-xs">G</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Botón ver receta */}
                        <button
                          className="mt-4 w-full bg-gradient-to-r from-uf-gold to-yellow-600 text-black font-bold py-2 px-4 rounded-lg hover:from-yellow-600 hover:to-uf-gold transition-all duration-300 flex items-center justify-center gap-2 group-hover:scale-105"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPlatoSeleccionado(plato);
                          }}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Ver Receta Completa
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* ACCIONES */}
        {isAuthenticated && (
          <div className="mt-8 flex gap-4 justify-center">
            <button className="bg-uf-gold text-black font-bold px-8 py-3 rounded-lg hover:bg-uf-blue hover:text-white transition">
              Añadir a Mi Plan
            </button>
            <button className="bg-gray-700 text-white font-bold px-8 py-3 rounded-lg hover:bg-gray-600 transition">
              Compartir
            </button>
          </div>
        )}

      </div>

      {/* MODAL DE RECETA */}
      {platoSeleccionado && (
        <ModalReceta
          plato={platoSeleccionado}
          onClose={() => setPlatoSeleccionado(null)}
        />
      )}
    </div>
  );
}

export default DetalleDieta;