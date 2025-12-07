import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAuthEntrenador from '../../context/AuthContextEntrenador';
import api from '../../services/api';
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Calendar,
  Dumbbell,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const DIAS_SEMANA = [
  { numero: 1, nombre: 'Lunes', key: 'lunes' },
  { numero: 2, nombre: 'Martes', key: 'martes' },
  { numero: 3, nombre: 'Miércoles', key: 'miercoles' },
  { numero: 4, nombre: 'Jueves', key: 'jueves' },
  { numero: 5, nombre: 'Viernes', key: 'viernes' },
  { numero: 6, nombre: 'Sábado', key: 'sabado' },
  { numero: 7, nombre: 'Domingo', key: 'domingo' }
];

function CrearEntrenamientoCliente() {
  const { clienteId } = useParams();
  const { entrenador } = useAuthEntrenador();
  const navigate = useNavigate();

  const [cliente, setCliente] = useState(null);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [tipo, setTipo] = useState('gym');
  const [nivelDificultad, setNivelDificultad] = useState('intermedio');
  const [duracionMinutos, setDuracionMinutos] = useState(60);
  const [ejerciciosDisponibles, setEjerciciosDisponibles] = useState([]);
  const [diaExpandido, setDiaExpandido] = useState(1);
  const [loading, setLoading] = useState(true);

  const [dias, setDias] = useState(DIAS_SEMANA.map(dia => ({
    dia_nombre: dia.key,
    dia_semana: dia.numero,
    concepto: '',
    es_descanso: dia.numero === 6 || dia.numero === 7,
    ejercicios: []
  })));

  useEffect(() => {
    if (clienteId) {
      fetchCliente();
      fetchEjercicios();
    }
  }, [clienteId]);

  const fetchCliente = async () => {
    try {
      const response = await api.get(`/entrenador/mis-clientes/${entrenador.id}`);
      if (response.data.success) {
        const clienteEncontrado = response.data.clientes.find(c => c.id === parseInt(clienteId));
        setCliente(clienteEncontrado);
      }
    } catch (error) {
      console.error('Error al cargar cliente:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEjercicios = async () => {
    try {
      // Endpoint correcto según backend: /api/custom/ejercicios
      const response = await api.get('/custom/ejercicios');

      console.log('Respuesta ejercicios:', response.data);

      // ✅ La respuesta es directamente un array
      if (Array.isArray(response.data)) {
        setEjerciciosDisponibles(response.data);
        console.log(`✅ Cargados ${response.data.length} ejercicios`);
      } else if (response.data.ejercicios && Array.isArray(response.data.ejercicios)) {
        setEjerciciosDisponibles(response.data.ejercicios);
      } else {
        console.error('Formato de ejercicios no reconocido:', response.data);
        setEjerciciosDisponibles([]);
      }
    } catch (error) {
      console.error('Error al cargar ejercicios:', error);
      console.error('Detalles:', error.response?.data);
      setEjerciciosDisponibles([]);
    }
  };

  const toggleDescanso = (diaSemana) => {
    setDias(prev => prev.map(dia =>
      dia.dia_semana === diaSemana
        ? { ...dia, es_descanso: !dia.es_descanso, concepto: !dia.es_descanso ? '' : dia.concepto, ejercicios: !dia.es_descanso ? [] : dia.ejercicios }
        : dia
    ));
  };

  const actualizarConcepto = (diaSemana, concepto) => {
    setDias(prev => prev.map(dia =>
      dia.dia_semana === diaSemana ? { ...dia, concepto } : dia
    ));
  };

  const agregarEjercicio = (diaSemana) => {
    setDias(prev => prev.map(dia =>
      dia.dia_semana === diaSemana
        ? {
          ...dia,
          ejercicios: [
            ...dia.ejercicios,
            {
              id: Date.now(),
              ejercicio_id: '',
              series: 3,
              repeticiones: 12,
              descanso_segundos: 60,
              notas: ''
            }
          ]
        }
        : dia
    ));
  };

  const actualizarEjercicio = (diaSemana, ejercicioId, campo, valor) => {
    setDias(prev => prev.map(dia =>
      dia.dia_semana === diaSemana
        ? {
          ...dia,
          ejercicios: dia.ejercicios.map(ej =>
            ej.id === ejercicioId ? { ...ej, [campo]: valor } : ej
          )
        }
        : dia
    ));
  };

  const eliminarEjercicio = (diaSemana, ejercicioId) => {
    setDias(prev => prev.map(dia =>
      dia.dia_semana === diaSemana
        ? { ...dia, ejercicios: dia.ejercicios.filter(ej => ej.id !== ejercicioId) }
        : dia
    ));
  };

  const guardarEntrenamiento = async () => {
    if (!nombre.trim()) {
      alert('❌ Debes ingresar un nombre para el plan');
      return;
    }

    const diasActivos = dias.filter(d => !d.es_descanso);

    if (diasActivos.length < 5) {
      alert(`❌ ERROR: Necesitas al menos 5 días activos.\n\nActualmente: ${diasActivos.length} días`);
      return;
    }

    for (const dia of diasActivos) {
      if (!dia.concepto.trim()) {
        alert(`❌ ERROR: El día "${DIAS_SEMANA.find(d => d.numero === dia.dia_semana).nombre}" está activo pero no tiene concepto`);
        return;
      }
      if (dia.ejercicios.length === 0) {
        alert(`❌ ERROR: El día "${DIAS_SEMANA.find(d => d.numero === dia.dia_semana).nombre}" está activo pero no tiene ejercicios`);
        return;
      }
      const ejercicioSinSeleccionar = dia.ejercicios.find(ej => !ej.ejercicio_id);
      if (ejercicioSinSeleccionar) {
        alert(`❌ ERROR: El día "${DIAS_SEMANA.find(d => d.numero === dia.dia_semana).nombre}" tiene ejercicios sin seleccionar`);
        return;
      }
    }

    const payload = {
      nombre,
      descripcion,
      tipo,
      duracion_minutos: parseInt(duracionMinutos),
      nivel_dificultad: nivelDificultad,
      creador_id: entrenador.id,
      cliente_id: parseInt(clienteId),
      plan_semanal: dias
    };

    try {
      setLoading(true);
      const response = await api.post('/entrenador/crear-entrenamiento', payload);

      if (response.data.success) {
        alert(`✅ ¡Entrenamiento creado!\n\n💪 ${nombre}\n👤 ${cliente.nombre} ${cliente.apellidos}`);
        navigate('/entrenador/dashboard');
      } else {
        alert('❌ Error: ' + response.data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error: ' + (error.response?.data?.error || 'Error desconocido'));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-uf-darker via-gray-900 to-black py-12 px-4 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-uf-gold"></div>
      </div>
    );
  }

  if (!cliente) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-uf-darker via-gray-900 to-black py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Cliente no encontrado</h2>
          <button
            onClick={() => navigate('/entrenador/dashboard')}
            className="bg-uf-gold text-black px-6 py-2 rounded-lg font-bold"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  const diasActivosCount = dias.filter(d => !d.es_descanso).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-uf-darker via-gray-900 to-black py-12 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/entrenador/dashboard')}
            className="text-uf-gold hover:text-yellow-600 font-semibold flex items-center gap-2 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver
          </button>

          <div className="bg-gradient-to-r from-purple-600 to-purple-700 py-6 px-8 rounded-lg">
            <h1 className="text-3xl font-bold text-white mb-2">
              <Dumbbell className="inline w-8 h-8 mr-2" />
              Crear Entrenamiento para {cliente.nombre} {cliente.apellidos}
            </h1>
            <p className="text-purple-100">Diseña un plan semanal de entrenamiento personalizado</p>
          </div>
        </div>

        {/* Debug info */}
        {ejerciciosDisponibles.length === 0 && (
          <div className="bg-yellow-900/20 border border-yellow-500 rounded-lg p-4 mb-6">
            <p className="text-yellow-300">⚠️ No se cargaron ejercicios. Verifica la consola del navegador (F12).</p>
          </div>
        )}

        {/* Información general */}
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">Información General</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-300 mb-2">Nombre del Plan *</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-white focus:border-uf-gold outline-none"
                placeholder="Ej: Plan Hipertrofia 5 días"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Tipo</label>
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-white focus:border-uf-gold outline-none"
              >
                <option value="gym">Gimnasio</option>
                <option value="workout">Workout</option>
                <option value="hiit">HIIT</option>
                <option value="cardio">Cardio</option>
                <option value="funcional">Funcional</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Dificultad</label>
              <select
                value={nivelDificultad}
                onChange={(e) => setNivelDificultad(e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-white focus:border-uf-gold outline-none"
              >
                <option value="principiante">Principiante</option>
                <option value="intermedio">Intermedio</option>
                <option value="avanzado">Avanzado</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Duración promedio (min)</label>
              <input
                type="number"
                value={duracionMinutos}
                onChange={(e) => setDuracionMinutos(e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-white focus:border-uf-gold outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-gray-300 mb-2">Descripción</label>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-white focus:border-uf-gold outline-none h-24"
                placeholder="Describe el objetivo de este plan..."
              />
            </div>
          </div>
        </div>

        {/* Validación visual */}
        <div className={`mb-6 p-4 rounded-lg border-2 ${diasActivosCount >= 5 ? 'bg-green-900/20 border-green-500' : 'bg-red-900/20 border-red-500'}`}>
          <p className="text-white font-bold text-center">
            📅 Días activos: {diasActivosCount}/7 {diasActivosCount >= 5 ? '✅' : '⚠️ (Mínimo 5 requeridos)'}
          </p>
        </div>

        {/* Días de la semana */}
        <div className="space-y-4 mb-6">
          {dias.map((dia) => {
            const diaInfo = DIAS_SEMANA.find(d => d.numero === dia.dia_semana);

            return (
              <div
                key={dia.dia_semana}
                className={`bg-gray-900 border-2 rounded-lg overflow-hidden transition-all ${dia.es_descanso ? 'border-gray-700' : 'border-uf-gold/50'
                  }`}
              >
                {/* Header del día */}
                <div
                  className={`p-4 cursor-pointer flex items-center justify-between ${dia.es_descanso ? 'bg-gray-800' : 'bg-gradient-to-r from-uf-gold/20 to-transparent'
                    }`}
                  onClick={() => setDiaExpandido(diaExpandido === dia.dia_semana ? null : dia.dia_semana)}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <Calendar className="w-6 h-6 text-uf-gold" />
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white">{diaInfo.nombre}</h3>
                      {!dia.es_descanso && dia.concepto && (
                        <p className="text-uf-gold text-sm">{dia.concepto}</p>
                      )}
                      {dia.es_descanso && (
                        <p className="text-gray-500 text-sm">Día de descanso</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleDescanso(dia.dia_semana); }}
                      className={`px-4 py-2 rounded font-bold transition-all ${dia.es_descanso
                          ? 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                          : 'bg-green-600 text-white hover:bg-green-500'
                        }`}
                    >
                      {dia.es_descanso ? 'Descanso' : 'Activo'}
                    </button>
                    {diaExpandido === dia.dia_semana ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>

                {/* Contenido expandible */}
                {diaExpandido === dia.dia_semana && !dia.es_descanso && (
                  <div className="p-6 border-t border-gray-700">
                    {/* Concepto */}
                    <div className="mb-6">
                      <label className="block text-gray-300 mb-2 font-bold">
                        Concepto del entrenamiento *
                      </label>
                      <input
                        type="text"
                        value={dia.concepto}
                        onChange={(e) => actualizarConcepto(dia.dia_semana, e.target.value)}
                        className="w-full bg-gray-800 border border-gray-600 rounded p-3 text-white focus:border-uf-gold outline-none"
                        placeholder="Ej: Pecho y Tríceps, Pierna Completa..."
                      />
                    </div>

                    {/* Lista de ejercicios */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="text-lg font-bold text-white">Ejercicios</h4>
                        <button
                          onClick={() => agregarEjercicio(dia.dia_semana)}
                          className="bg-uf-gold text-black px-4 py-2 rounded font-bold flex items-center gap-2 hover:bg-yellow-500"
                        >
                          <Plus className="w-4 h-4" />
                          Agregar Ejercicio
                        </button>
                      </div>

                      {dia.ejercicios.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">
                          No hay ejercicios. Agrega al menos uno.
                        </p>
                      ) : (
                        dia.ejercicios.map((ejercicio) => (
                          <div key={ejercicio.id} className="bg-gray-800 p-4 rounded border border-gray-700 relative">
                            <button
                              onClick={() => eliminarEjercicio(dia.dia_semana, ejercicio.id)}
                              className="absolute top-2 right-2 text-red-500 hover:text-red-400"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>

                            <div className="grid grid-cols-1 gap-4 mb-4">
                              <div>
                                <label className="block text-gray-400 text-sm mb-1">Ejercicio *</label>
                                <select
                                  value={ejercicio.ejercicio_id}
                                  onChange={(e) => actualizarEjercicio(dia.dia_semana, ejercicio.id, 'ejercicio_id', e.target.value)}
                                  className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
                                >
                                  <option value="">Seleccionar ejercicio...</option>
                                  {ejerciciosDisponibles.map(ej => (
                                    <option key={ej.id} value={ej.id}>
                                      {ej.nombre} ({ej.grupoMuscular || 'General'})
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                              <div>
                                <label className="block text-gray-400 text-sm mb-1">Series</label>
                                <input
                                  type="number"
                                  value={ejercicio.series}
                                  onChange={(e) => actualizarEjercicio(dia.dia_semana, ejercicio.id, 'series', e.target.value)}
                                  className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
                                />
                              </div>
                              <div>
                                <label className="block text-gray-400 text-sm mb-1">Reps</label>
                                <input
                                  type="number"
                                  value={ejercicio.repeticiones}
                                  onChange={(e) => actualizarEjercicio(dia.dia_semana, ejercicio.id, 'repeticiones', e.target.value)}
                                  className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
                                />
                              </div>
                              <div>
                                <label className="block text-gray-400 text-sm mb-1">Descanso (s)</label>
                                <input
                                  type="number"
                                  value={ejercicio.descanso_segundos}
                                  onChange={(e) => actualizarEjercicio(dia.dia_semana, ejercicio.id, 'descanso_segundos', e.target.value)}
                                  className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
                                />
                              </div>
                            </div>

                            <div className="mt-3">
                              <label className="block text-gray-400 text-sm mb-1">Notas</label>
                              <input
                                type="text"
                                value={ejercicio.notas}
                                onChange={(e) => actualizarEjercicio(dia.dia_semana, ejercicio.id, 'notas', e.target.value)}
                                className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
                                placeholder="Ej: Aumentar peso en última serie"
                              />
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Botón guardar */}
        <div className="flex justify-end">
          <button
            onClick={guardarEntrenamiento}
            disabled={loading || diasActivosCount < 5}
            className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-green-500 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-6 h-6" />
            {loading ? 'Guardando...' : 'Guardar Plan Semanal'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CrearEntrenamientoCliente;
