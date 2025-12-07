import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAuthEntrenador from '../../context/AuthContextEntrenador';
import api from '../../services/api';
import { ArrowLeft, Calendar } from 'lucide-react';

function DetalleDietaEntrenador() {
  const { dietaId } = useParams();
  const { entrenador } = useAuthEntrenador();
  const navigate = useNavigate();
  const [dieta, setDieta] = useState(null);
  const [planSemanal, setPlanSemanal] = useState({});
  const [diaSeleccionado, setDiaSeleccionado] = useState('lunes');
  const [loading, setLoading] = useState(true);

  const diasSemana = [
    { key: 'lunes', label: 'LUNES' },
    { key: 'martes', label: 'MARTES' },
    { key: 'miercoles', label: 'MIÉRCOLES' },
    { key: 'jueves', label: 'JUEVES' },
    { key: 'viernes', label: 'VIERNES' },
    { key: 'sabado', label: 'SÁBADO' },
    { key: 'domingo', label: 'DOMINGO' }
  ];

  useEffect(() => {
    if (dietaId) {
      fetchDetalleDieta();
    }
  }, [dietaId]);

  const fetchDetalleDieta = async () => {
    try {
      const response = await api.get(`/usuario/dieta/${dietaId}`);
      console.log('✅ Detalle dieta (entrenador):', response.data);

      if (response.data.success) {
        setDieta(response.data.dieta);
        setPlanSemanal(response.data.plan_semanal);
      }
    } catch (error) {
      console.error('❌ Error al cargar dieta:', error);
      console.error('Detalle del error:', error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const calcularMacrosPlato = (plato) => {
    if (plato.ingredientes && plato.ingredientes.length > 0) {
      return plato.ingredientes.reduce((acc, ing) => ({
        calorias: acc.calorias + (ing.calorias * ing.cantidad_gramos) / 100,
        proteinas: acc.proteinas + (ing.proteinas * ing.cantidad_gramos) / 100,
        carbohidratos: acc.carbohidratos + (ing.carbohidratos * ing.cantidad_gramos) / 100,
        grasas: acc.grasas + (ing.grasas * ing.cantidad_gramos) / 100
      }), { calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0 });
    }
    return {
      calorias: parseFloat(plato.calorias) || 0,
      proteinas: parseFloat(plato.proteinas) || 0,
      carbohidratos: parseFloat(plato.carbohidratos) || 0,
      grasas: parseFloat(plato.grasas) || 0
    };
  };

  const calcularTotalesDia = () => {
    const dia = planSemanal[diaSeleccionado];
    if (!dia) return { calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0 };

    let totales = { calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0 };

    // Sumar todos los momentos del día
    Object.values(dia).forEach(momentoPlatos => {
      momentoPlatos.forEach(plato => {
        const macrosPlato = calcularMacrosPlato(plato);
        totales.calorias += macrosPlato.calorias;
        totales.proteinas += macrosPlato.proteinas;
        totales.carbohidratos += macrosPlato.carbohidratos;
        totales.grasas += macrosPlato.grasas;
      });
    });

    return totales;
  };

  const getMomentoHora = (momento) => {
    const horas = {
      'desayuno': '08:00',
      'media_manana': '11:00',
      'almuerzo': '14:00',
      'merienda': '17:00',
      'cena': '21:00',
      'post_entreno': 'Post-entreno'
    };
    return horas[momento] || '';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-uf-darker via-gray-900 to-black py-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white text-xl">Cargando dieta...</p>
        </div>
      </div>
    );
  }

  if (!dieta) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-uf-darker via-gray-900 to-black py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Dieta no encontrada</h2>
          <button
            onClick={() => navigate('/entrenador/mis-dietas')}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-purple-700"
          >
            Volver a Mis Dietas
          </button>
        </div>
      </div>
    );
  }

  const totalesDia = calcularTotalesDia();

  return (
    <div className="min-h-screen bg-gradient-to-br from-uf-darker via-gray-900 to-black py-12 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/entrenador/mis-dietas')}
            className="text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-2 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver a Mis Dietas
          </button>

          <div className="bg-gradient-to-r from-purple-600 to-purple-700 py-6 px-8 rounded-lg">
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              🍽️ {dieta.nombre}
            </h1>
            <p className="text-purple-100">{dieta.descripcion || 'Plan nutricional personalizado'}</p>
          </div>
        </div>

        {/* Objetivo y calorías */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-purple-500 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">
                Objetivo: {Math.round(dieta.calorias_totales || 0)} kcal diarias
              </h3>
              <p className="text-gray-400 text-sm flex items-center gap-2 mt-2">
                <Calendar className="w-4 h-4" />
                Plan semanal
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-600/20 to-purple-700/20 border-2 border-purple-500 rounded-lg p-4 text-center min-w-[150px]">
              <p className="text-purple-400 text-sm font-semibold mb-1">CALORÍAS DIARIAS</p>
              <p className="text-4xl font-bold text-white">{Math.round(dieta.calorias_totales || 0)}</p>
              <p className="text-gray-400 text-xs">kcal</p>
            </div>
          </div>

          {/* Macros objetivo */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-blue-900/30 border-2 border-blue-500 rounded-lg p-4 text-center">
              <div className="text-blue-400 mb-2">💪</div>
              <p className="text-blue-400 text-sm font-semibold">PROTEÍNAS</p>
              <p className="text-2xl font-bold text-white">{Math.round(dieta.proteinas_totales || 0)}g</p>
            </div>

            <div className="bg-green-900/30 border-2 border-green-500 rounded-lg p-4 text-center">
              <div className="text-green-400 mb-2">🌾</div>
              <p className="text-green-400 text-sm font-semibold">CARBOHIDRATOS</p>
              <p className="text-2xl font-bold text-white">{Math.round(dieta.carbohidratos_totales || 0)}g</p>
            </div>

            <div className="bg-yellow-900/30 border-2 border-yellow-500 rounded-lg p-4 text-center">
              <div className="text-yellow-400 mb-2">🥑</div>
              <p className="text-yellow-400 text-sm font-semibold">GRASAS</p>
              <p className="text-2xl font-bold text-white">{Math.round(dieta.grasas_totales || 0)}g</p>
            </div>
          </div>
        </div>

        {/* Selección día */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-gray-700 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            📅 Selecciona un día
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {diasSemana.map((dia) => (
              <button
                key={dia.key}
                onClick={() => setDiaSeleccionado(dia.key)}
                className={`py-3 px-4 rounded-lg font-bold transition-all ${diaSeleccionado === dia.key
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
              >
                {dia.label}
              </button>
            ))}
          </div>
        </div>

        {/* Resumen del día */}
        <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 border-2 border-purple-700 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            ⏱️ Resumen del día
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-900 rounded-lg p-4 text-center">
              <div className="text-orange-400 mb-2">🔥</div>
              <p className="text-gray-400 text-sm">Calorías</p>
              <p className="text-2xl font-bold text-white">{Math.round(totalesDia.calorias)}</p>
            </div>
            <div className="bg-gray-900 rounded-lg p-4 text-center">
              <div className="text-blue-400 mb-2">💪</div>
              <p className="text-gray-400 text-sm">Proteínas</p>
              <p className="text-2xl font-bold text-white">{Math.round(totalesDia.proteinas)}g</p>
            </div>
            <div className="bg-gray-900 rounded-lg p-4 text-center">
              <div className="text-green-400 mb-2">🌾</div>
              <p className="text-gray-400 text-sm">Carbohidratos</p>
              <p className="text-2xl font-bold text-white">{Math.round(totalesDia.carbohidratos)}g</p>
            </div>
            <div className="bg-gray-900 rounded-lg p-4 text-center">
              <div className="text-yellow-400 mb-2">🥑</div>
              <p className="text-gray-400 text-sm">Grasas</p>
              <p className="text-2xl font-bold text-white">{Math.round(totalesDia.grasas)}g</p>
            </div>
          </div>
        </div>

        {/* Comidas del día */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-gray-700 rounded-lg p-6">
          <h3 className="text-2xl font-bold text-white mb-6">
            Comidas del {diasSemana.find(d => d.key === diaSeleccionado)?.label}
          </h3>

          {!planSemanal[diaSeleccionado] ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No hay comidas programadas para este día</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(planSemanal[diaSeleccionado]).map(([momento, platos]) =>
                platos.length > 0 && platos.map((plato, index) => {
                  const macrosPlato = calcularMacrosPlato(plato);
                  return (
                    <div
                      key={`${momento}-${index}`}
                      className="bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-gray-700 rounded-lg p-6 hover:border-purple-500 transition-all"
                    >
                      {/* Header comida */}
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <div className="text-3xl">🍽️</div>
                            <div>
                              <h4 className="text-xl font-bold text-white capitalize">
                                {momento.replace('_', ' ')}
                              </h4>
                              <p className="text-gray-400 text-sm">⏰ {getMomentoHora(momento)}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Nombre del Plato */}
                      <div className="mb-4">
                        <h5 className="text-lg font-bold text-purple-400 mb-1">{plato.nombre}</h5>
                        {plato.descripcion && (
                          <p className="text-gray-400 text-sm italic">{plato.descripcion}</p>
                        )}
                      </div>

                      {/* Ingredientes */}
                      {plato.ingredientes && plato.ingredientes.length > 0 && (
                        <div className="space-y-3 mb-4">
                          <p className="text-sm text-gray-400 font-semibold mb-2">Ingredientes:</p>
                          {plato.ingredientes.map((ingrediente, idx) => (
                            <div key={idx} className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                              <div className="flex items-center justify-between mb-2">
                                <h5 className="text-white font-semibold">{ingrediente.alimento_nombre}</h5>
                                <span className="text-purple-400 font-bold">{ingrediente.cantidad_gramos}g</span>
                              </div>
                              <div className="flex gap-3 text-xs">
                                <span className="text-orange-400">🔥 {Math.round((ingrediente.calorias * ingrediente.cantidad_gramos) / 100)} kcal</span>
                                <span className="text-blue-400">P: {Math.round((ingrediente.proteinas * ingrediente.cantidad_gramos) / 100)}g</span>
                                <span className="text-green-400">C: {Math.round((ingrediente.carbohidratos * ingrediente.cantidad_gramos) / 100)}g</span>
                                <span className="text-yellow-400">G: {Math.round((ingrediente.grasas * ingrediente.cantidad_gramos) / 100)}g</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Totales de la comida */}
                      <div className="border-t border-gray-700 pt-4">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400 font-semibold">TOTALES:</span>
                          <div className="flex gap-4 text-sm">
                            <span className="text-orange-400 font-bold">
                              {Math.round(macrosPlato.calorias)} kcal
                            </span>
                            <span className="text-blue-400">P: {Math.round(macrosPlato.proteinas)}g</span>
                            <span className="text-green-400">C: {Math.round(macrosPlato.carbohidratos)}g</span>
                            <span className="text-yellow-400">G: {Math.round(macrosPlato.grasas)}g</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DetalleDietaEntrenador;
