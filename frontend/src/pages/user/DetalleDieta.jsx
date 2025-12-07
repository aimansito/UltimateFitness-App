import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { ArrowLeft, Calendar, Utensils, Clock, Flame, Dumbbell, Wheat, Droplet } from 'lucide-react';

function DetalleDieta() {
  const { dietaId } = useParams();
  const { user } = useAuth();
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
      const response = await api.get(`/usuario/dieta/${dietaId}/detalle`);
      console.log('✅ Detalle dieta:', response.data);

      if (response.data.success) {
        setDieta(response.data.dieta);
        setPlanSemanal(response.data.planSemanal);
      }
    } catch (error) {
      console.error('❌ Error al cargar dieta:', error);
      console.error('Detalle del error:', error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const calcularTotalesDia = () => {
    const dia = planSemanal[diaSeleccionado];
    if (!dia) return { calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0 };

    let totales = { calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0 };

    // Sumar todos los momentos del día
    Object.values(dia).forEach(momentoPlatos => {
      momentoPlatos.forEach(plato => {
        totales.calorias += plato.calorias || 0;
        totales.proteinas += plato.proteinas || 0;
        totales.carbohidratos += plato.carbohidratos || 0;
        totales.grasas += plato.grasas || 0;
      });
    });

    return totales;
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

  const calcularTotalesPorMomento = (platos) => {
    let totales = { calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0 };

    platos.forEach(plato => {
      const macros = calcularMacrosPlato(plato);
      totales.calorias += macros.calorias;
      totales.proteinas += macros.proteinas;
      totales.carbohidratos += macros.carbohidratos;
      totales.grasas += macros.grasas;
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
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-uf-gold mx-auto mb-4"></div>
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
            onClick={() => navigate('/mis-dietas')}
            className="bg-uf-gold text-black px-6 py-2 rounded-lg font-bold hover:bg-yellow-600"
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
            onClick={() => navigate('/mis-dietas')}
            className="text-uf-gold hover:text-yellow-600 font-semibold flex items-center gap-2 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver a Mis Dietas
          </button>

          <div className="bg-gradient-to-r from-uf-gold to-yellow-600 py-6 px-8 rounded-lg">
            <h1 className="text-3xl font-bold text-black mb-2 flex items-center gap-3">
              <Utensils className="w-8 h-8" /> {dieta.nombre}
            </h1>
            <p className="text-gray-800">{dieta.descripcion || 'Plan nutricional personalizado'}</p>
          </div>
        </div>

        {/* Selección día */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-gray-700 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-uf-gold" /> Selecciona un día
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {diasSemana.map((dia) => (
              <button
                key={dia.key}
                onClick={() => setDiaSeleccionado(dia.key)}
                className={`py-3 px-4 rounded-lg font-bold transition-all ${diaSeleccionado === dia.key
                  ? 'bg-uf-gold text-black'
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
            <Clock className="w-5 h-5 text-purple-400" /> Resumen del día
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-900 rounded-lg p-4 text-center">
              <div className="text-orange-400 mb-2 flex justify-center"><Flame className="w-6 h-6" /></div>
              <p className="text-gray-400 text-sm">Calorías</p>
              <p className="text-2xl font-bold text-white">{Math.round(totalesDia.calorias)}</p>
            </div>
            <div className="bg-gray-900 rounded-lg p-4 text-center">
              <div className="text-blue-400 mb-2 flex justify-center"><Dumbbell className="w-6 h-6" /></div>
              <p className="text-gray-400 text-sm">Proteínas</p>
              <p className="text-2xl font-bold text-white">{Math.round(totalesDia.proteinas)}g</p>
            </div>
            <div className="bg-gray-900 rounded-lg p-4 text-center">
              <div className="text-green-400 mb-2 flex justify-center"><Wheat className="w-6 h-6" /></div>
              <p className="text-gray-400 text-sm">Carbohidratos</p>
              <p className="text-2xl font-bold text-white">{Math.round(totalesDia.carbohidratos)}g</p>
            </div>
            <div className="bg-gray-900 rounded-lg p-4 text-center">
              <div className="text-yellow-400 mb-2 flex justify-center"><Droplet className="w-6 h-6" /></div>
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
              {Object.entries(planSemanal[diaSeleccionado]).map(([momento, platos]) => {
                if (!platos || platos.length === 0) return null;

                const totalesMomento = calcularTotalesPorMomento(platos);

                return (
                  <div
                    key={momento}
                    className="bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-gray-700 rounded-lg p-6 hover:border-uf-gold transition-all"
                  >
                    {/* Header comida con macros */}
                    <div className="flex items-start justify-between mb-4 flex-wrap gap-4">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl"><Utensils className="w-8 h-8 text-white" /></div>
                        <div>
                          <h4 className="text-xl font-bold text-white capitalize">
                            {momento.replace('_', ' ')}
                          </h4>
                          <p className="text-gray-400 text-sm flex items-center gap-1"><Clock className="w-4 h-4" /> {getMomentoHora(momento)}</p>
                        </div>
                      </div>

                      {/* Macros de esta comida */}
                      <div className="flex gap-3 text-xs bg-gray-800 rounded-lg px-4 py-2">
                        <span className="text-orange-400 font-bold flex items-center gap-1"><Flame className="w-3 h-3" /> {Math.round(totalesMomento.calorias)} kcal</span>
                        <span className="text-blue-400">P: {Math.round(totalesMomento.proteinas)}g</span>
                        <span className="text-green-400">C: {Math.round(totalesMomento.carbohidratos)}g</span>
                        <span className="text-yellow-400">G: {Math.round(totalesMomento.grasas)}g</span>
                      </div>
                    </div>

                    {/* Platos de esta comida */}
                    <div className="space-y-4">
                      {platos.map((plato, index) => {
                        const macros = calcularMacrosPlato(plato);
                        return (
                          <div key={index} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                            {/* Nombre del Plato */}
                            <h5 className="text-lg font-bold text-uf-gold mb-2">{plato.nombre}</h5>
                            {plato.descripcion && (
                              <p className="text-gray-400 text-sm italic mb-3">{plato.descripcion}</p>
                            )}

                            {/* Ingredientes */}
                            {plato.ingredientes && plato.ingredientes.length > 0 && (
                              <div className="space-y-2 mb-3">
                                <p className="text-xs text-gray-500 font-semibold">Ingredientes:</p>
                                {plato.ingredientes.map((ingrediente, idx) => (
                                  <div key={idx} className="bg-gray-900 rounded p-2 border border-gray-700">
                                    <div className="flex items-center justify-between mb-1">
                                      <span className="text-white text-sm font-semibold">{ingrediente.nombre}</span>
                                      <span className="text-uf-gold text-sm font-bold">{ingrediente.cantidad_gramos}g</span>
                                    </div>
                                    <div className="flex gap-2 text-xs">
                                      <span className="text-orange-400">{Math.round(ingrediente.calorias)} kcal</span>
                                      <span className="text-blue-400">P: {Math.round(ingrediente.proteinas)}g</span>
                                      <span className="text-green-400">C: {Math.round(ingrediente.carbohidratos)}g</span>
                                      <span className="text-yellow-400">G: {Math.round(ingrediente.grasas)}g</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Totales del plato */}
                            <div className="border-t border-gray-700 pt-2 mt-2">
                              <div className="flex items-center justify-between">
                                <span className="text-gray-500 text-xs font-semibold">Total plato:</span>
                                <div className="flex gap-2 text-xs">
                                  <span className="text-orange-400 font-bold">{Math.round(macros.calorias)} kcal</span>
                                  <span className="text-blue-400">P: {Math.round(macros.proteinas)}g</span>
                                  <span className="text-green-400">C: {Math.round(macros.carbohidratos)}g</span>
                                  <span className="text-yellow-400">G: {Math.round(macros.grasas)}g</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DetalleDieta;