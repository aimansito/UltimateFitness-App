// ============================================
// PLANIFICADOR SEMANAL DE DIETAS
// Permite asignar dietas diferentes a cada día de la semana
// ============================================
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import SelectorDietaDia from '../../components/calendario/SelectorDietaDia';
import { Calendar, PartyPopper, Palmtree } from 'lucide-react';

function PlanificadorSemanal() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [planSemanal, setPlanSemanal] = useState({
    lunes: null,
    martes: null,
    miercoles: null,
    jueves: null,
    viernes: null,
    sabado: null,
    domingo: null
  });

  const [estadoDias, setEstadoDias] = useState({
    lunes: { completado: false, notas: '' },
    martes: { completado: false, notas: '' },
    miercoles: { completado: false, notas: '' },
    jueves: { completado: false, notas: '' },
    viernes: { completado: false, notas: '' },
    sabado: { completado: false, notas: '' },
    domingo: { completado: false, notas: '' }
  });

  const [diaSeleccionado, setDiaSeleccionado] = useState(null);
  const [mostrarSelector, setMostrarSelector] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  const diasSemana = [
    { key: 'lunes', nombre: 'Lunes', icon: Calendar, color: 'blue' },
    { key: 'martes', nombre: 'Martes', icon: Calendar, color: 'green' },
    { key: 'miercoles', nombre: 'Miércoles', icon: Calendar, color: 'yellow' },
    { key: 'jueves', nombre: 'Jueves', icon: Calendar, color: 'orange' },
    { key: 'viernes', nombre: 'Viernes', icon: Calendar, color: 'red' },
    { key: 'sabado', nombre: 'Sábado', icon: PartyPopper, color: 'purple' },
    { key: 'domingo', nombre: 'Domingo', icon: Palmtree, color: 'pink' }
  ];

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    cargarPlanSemanal();
  }, [isAuthenticated]);

  // Obtener día actual de la semana
  const getDiaActual = () => {
    const dias = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
    const hoy = new Date().getDay();
    return dias[hoy];
  };

  const diaActual = getDiaActual();

  const cargarPlanSemanal = async () => {
    try {
      setCargando(true);
      // TODO: Cargar plan semanal del usuario desde el backend
      // const response = await fetch(`http://localhost:8000/api/custom/calendario-usuario/${user.id}`);
      // const data = await response.json();

      // Por ahora, dejamos vacío
      setCargando(false);
    } catch (error) {
      console.error('Error cargando plan semanal:', error);
      setCargando(false);
    }
  };

  const asignarDieta = (dia, dieta) => {
    setPlanSemanal(prev => ({
      ...prev,
      [dia]: dieta
    }));
    setMostrarSelector(false);
    setDiaSeleccionado(null);
  };

  const eliminarDieta = (dia) => {
    setPlanSemanal(prev => ({
      ...prev,
      [dia]: null
    }));
  };

  const marcarCompletado = (dia) => {
    setEstadoDias(prev => ({
      ...prev,
      [dia]: {
        ...prev[dia],
        completado: !prev[dia].completado
      }
    }));
  };

  const actualizarNotas = (dia, notas) => {
    setEstadoDias(prev => ({
      ...prev,
      [dia]: {
        ...prev[dia],
        notas: notas
      }
    }));
  };

  const duplicarDieta = (diaOrigen, diaDestino) => {
    const dietaOrigen = planSemanal[diaOrigen];
    if (dietaOrigen) {
      setPlanSemanal(prev => ({
        ...prev,
        [diaDestino]: dietaOrigen
      }));
    }
  };

  const guardarPlanSemanal = async () => {
    setGuardando(true);
    try {
      // Preparar datos para el backend
      const planData = Object.entries(planSemanal).map(([dia, dieta]) => ({
        dia_semana: dia,
        dieta_id: dieta?.id || null,
        completado: estadoDias[dia].completado,
        notas: estadoDias[dia].notas,
        fecha_asignacion: new Date().toISOString().split('T')[0]
      }));

      // TODO: Enviar al backend
      // const response = await fetch('http://localhost:8000/api/custom/calendario-usuario/guardar', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ usuario_id: user.id, plan: planData })
      // });

      toast.success('✅ Plan semanal guardado exitosamente');
    } catch (error) {
      console.error('Error guardando plan:', error);
      toast.error('❌ Error al guardar el plan semanal');
    } finally {
      setGuardando(false);
    }
  };

  // Calcular totales de la semana
  const calcularTotalesSemana = () => {
    let totales = { calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0 };
    let diasConDieta = 0;

    Object.values(planSemanal).forEach(dieta => {
      if (dieta) {
        diasConDieta++;
        // Asumiendo que cada dieta tiene estos campos calculados
        totales.calorias += dieta.calorias_totales || 0;
        totales.proteinas += dieta.proteinas_totales || 0;
        totales.carbohidratos += dieta.carbohidratos_totales || 0;
        totales.grasas += dieta.grasas_totales || 0;
      }
    });

    return { ...totales, diasConDieta };
  };

  const totalesSemana = calcularTotalesSemana();

  if (cargando) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-uf-darker to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-uf-gold mx-auto mb-4"></div>
          <p className="text-white text-xl">Cargando plan semanal...</p>
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
            Volver a Alimentación
          </Link>

          <h1 className="text-4xl md:text-5xl font-anton font-bold text-white mb-3 uppercase">
            Mi Plan Semanal de Dietas
          </h1>
          <p className="text-gray-400 text-lg">
            Organiza tu alimentación día a día para toda la semana
          </p>
        </div>

        {/* TOTALES DE LA SEMANA */}
        <div className="bg-gradient-to-r from-uf-gold/10 to-yellow-600/10 border-2 border-uf-gold rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-anton font-bold text-white mb-4 uppercase">
            Resumen Semanal
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-uf-gold mb-1">
                {totalesSemana.diasConDieta}/7
              </div>
              <div className="text-gray-400 text-sm uppercase">Días Planificados</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-1">
                {Math.round(totalesSemana.calorias)}
              </div>
              <div className="text-gray-400 text-sm uppercase">kcal Totales</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-red-400 mb-1">
                {Math.round(totalesSemana.proteinas)}g
              </div>
              <div className="text-gray-400 text-sm uppercase">Proteínas</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400 mb-1">
                {Math.round(totalesSemana.carbohidratos)}g
              </div>
              <div className="text-gray-400 text-sm uppercase">Carbos</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-400 mb-1">
                {Math.round(totalesSemana.grasas)}g
              </div>
              <div className="text-gray-400 text-sm uppercase">Grasas</div>
            </div>
          </div>
          {totalesSemana.diasConDieta > 0 && (
            <div className="mt-4 text-center text-gray-400 text-sm">
              Promedio diario: {Math.round(totalesSemana.calorias / totalesSemana.diasConDieta)} kcal
            </div>
          )}
        </div>

        {/* CALENDARIO SEMANAL */}
        <div className="space-y-4">
          {diasSemana.map((dia) => {
            const dietaAsignada = planSemanal[dia.key];
            const estado = estadoDias[dia.key];
            const esHoy = dia.key === diaActual;

            return (
              <div
                key={dia.key}
                className={`bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden border-2 ${esHoy ? 'border-uf-gold shadow-lg shadow-uf-gold/20' : 'border-gray-700'
                  }`}
              >
                {/* HEADER DEL DÍA */}
                <div className={`bg-gradient-to-r from-${dia.color}-500/20 to-${dia.color}-600/20 border-b-2 border-${dia.color}-500/30 p-4`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <dia.icon className="w-8 h-8 text-white" />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-anton font-bold text-white uppercase">{dia.nombre}</h3>
                          {esHoy && (
                            <span className="bg-uf-gold text-black text-xs font-bold px-2 py-1 rounded animate-pulse">
                              HOY
                            </span>
                          )}
                        </div>
                        {dietaAsignada ? (
                          <p className="text-gray-400 text-sm">
                            {dietaAsignada.nombre} · {Math.round(dietaAsignada.calorias_totales || 0)} kcal
                          </p>
                        ) : (
                          <p className="text-gray-500 text-sm">Sin dieta asignada</p>
                        )}
                      </div>
                    </div>

                    {/* CHECKBOX COMPLETADO */}
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={estado.completado}
                        onChange={() => marcarCompletado(dia.key)}
                        className="w-6 h-6 rounded border-2 border-gray-600 bg-gray-700 checked:bg-uf-gold checked:border-uf-gold transition"
                      />
                      <span className="text-gray-400 text-sm">Completado</span>
                    </label>
                  </div>
                </div>

                {/* CONTENIDO DEL DÍA */}
                <div className="p-4">
                  {dietaAsignada ? (
                    <div className="space-y-4">
                      {/* INFO DE LA DIETA */}
                      <div className="bg-uf-darker rounded-lg p-4 border border-gray-700">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="text-white font-bold text-lg mb-1">{dietaAsignada.nombre}</h4>
                            <p className="text-gray-400 text-sm">{dietaAsignada.descripcion}</p>
                          </div>
                          <Link
                            to={`/dieta/${dietaAsignada.id}`}
                            className="ml-4 bg-uf-gold text-black px-3 py-1 rounded-lg hover:bg-yellow-500 transition text-sm font-bold"
                          >
                            Ver Plan
                          </Link>
                        </div>

                        {/* MACROS */}
                        <div className="grid grid-cols-4 gap-2 text-sm">
                          <div className="text-center bg-gray-800 rounded p-2">
                            <div className="font-bold text-white">{Math.round(dietaAsignada.calorias_totales || 0)}</div>
                            <div className="text-gray-500 text-xs">kcal</div>
                          </div>
                          <div className="text-center bg-gray-800 rounded p-2">
                            <div className="font-bold text-red-400">{Math.round(dietaAsignada.proteinas_totales || 0)}g</div>
                            <div className="text-gray-500 text-xs">P</div>
                          </div>
                          <div className="text-center bg-gray-800 rounded p-2">
                            <div className="font-bold text-blue-400">{Math.round(dietaAsignada.carbohidratos_totales || 0)}g</div>
                            <div className="text-gray-500 text-xs">C</div>
                          </div>
                          <div className="text-center bg-gray-800 rounded p-2">
                            <div className="font-bold text-yellow-400">{Math.round(dietaAsignada.grasas_totales || 0)}g</div>
                            <div className="text-gray-500 text-xs">G</div>
                          </div>
                        </div>
                      </div>

                      {/* NOTAS */}
                      <div>
                        <label className="block text-gray-400 text-sm mb-2">Notas del día:</label>
                        <textarea
                          value={estado.notas}
                          onChange={(e) => actualizarNotas(dia.key, e.target.value)}
                          placeholder="Ej: Me sentí con mucha energía, bebí 2L de agua..."
                          rows="2"
                          className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-uf-gold focus:outline-none text-sm"
                        ></textarea>
                      </div>

                      {/* ACCIONES */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setDiaSeleccionado(dia.key);
                            setMostrarSelector(true);
                          }}
                          className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 rounded-lg transition text-sm"
                        >
                          Cambiar Dieta
                        </button>
                        <button
                          onClick={() => eliminarDieta(dia.key)}
                          className="bg-red-600 hover:bg-red-500 text-white font-bold px-4 py-2 rounded-lg transition text-sm"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <svg className="w-16 h-16 mx-auto mb-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <p className="text-gray-500 mb-4">No hay dieta asignada para este día</p>
                      <button
                        onClick={() => {
                          setDiaSeleccionado(dia.key);
                          setMostrarSelector(true);
                        }}
                        className="bg-gradient-to-r from-uf-gold to-yellow-600 text-black font-bold px-6 py-3 rounded-lg hover:from-yellow-600 hover:to-uf-gold transition"
                      >
                        Asignar Dieta
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* BOTÓN GUARDAR */}
        <div className="mt-8 flex justify-center gap-4">
          <Link
            to="/crear-dieta"
            className="bg-gray-700 text-white font-bold px-8 py-4 rounded-lg hover:bg-gray-600 transition flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Crear Nueva Dieta
          </Link>
          <button
            onClick={guardarPlanSemanal}
            disabled={guardando || totalesSemana.diasConDieta === 0}
            className="bg-gradient-to-r from-uf-gold to-yellow-600 text-black font-bold px-12 py-4 rounded-lg hover:from-yellow-600 hover:to-uf-gold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
          >
            {guardando ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-black"></div>
                Guardando...
              </>
            ) : (
              <>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                Guardar Plan Semanal
              </>
            )}
          </button>
        </div>

      </div>

      {/* MODAL SELECTOR DE DIETA */}
      {mostrarSelector && (
        <SelectorDietaDia
          dia={diaSeleccionado}
          onSeleccionar={(dieta) => asignarDieta(diaSeleccionado, dieta)}
          onCerrar={() => {
            setMostrarSelector(false);
            setDiaSeleccionado(null);
          }}
        />
      )}
    </div>
  );
}

export default PlanificadorSemanal;