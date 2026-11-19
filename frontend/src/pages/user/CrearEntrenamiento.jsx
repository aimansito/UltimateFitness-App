// ============================================
// CREAR ENTRENAMIENTO - Rutina semanal
// Izquierda: biblioteca con la figura muscular (pulsas grupo -> ejercicios -> clic para añadir).
// Derecha: nombre del plan y los 7 días; nombras el día y pasas al siguiente.
// ============================================
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Calendar, CheckCircle, ChevronDown, Moon, Save, Trash2 } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import MuscleMap from '../../components/common/MuscleMap';
import PanelEjercicios from '../../components/gym/PanelEjercicios';

const DIAS_SEMANA = [
  { numero: 1, nombre: 'Lunes' },
  { numero: 2, nombre: 'Martes' },
  { numero: 3, nombre: 'Miércoles' },
  { numero: 4, nombre: 'Jueves' },
  { numero: 5, nombre: 'Viernes' },
  { numero: 6, nombre: 'Sábado' },
  { numero: 7, nombre: 'Domingo' },
];

const NOMBRE_GRUPO = {
  pecho: 'Pecho', espalda: 'Espalda', piernas: 'Piernas', hombros: 'Hombros', biceps: 'Bíceps', triceps: 'Tríceps',
  core: 'Core', gluteos: 'Glúteos', fullbody: 'Full body', cardio: 'Cardio', brazos: 'Brazos', cadera: 'Cadera',
};
const normalizar = (g) => (g || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[\s_-]/g, '');

// Título automático del día a partir de lo que se trabaja ("Pecho · Tríceps")
const conceptoAutomatico = (ejercicios) =>
  [...new Set(ejercicios.map((e) => normalizar(e.grupoMuscular)).filter(Boolean))]
    .slice(0, 3)
    .map((g) => NOMBRE_GRUPO[g] || g)
    .join(' · ');

let uid = 0;

function CrearEntrenamiento() {
  const navigate = useNavigate();
  const toast = useToast();

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [tipo, setTipo] = useState('gym');
  const [nivelDificultad, setNivelDificultad] = useState('intermedio');
  const [duracionMinutos, setDuracionMinutos] = useState(60);
  const [masOpciones, setMasOpciones] = useState(false);

  const [dias, setDias] = useState(
    DIAS_SEMANA.map((d) => ({ diaSemana: d.numero, nombre: d.nombre, concepto: '', esDescanso: d.numero >= 6, ejercicios: [] }))
  );
  const [diaActivo, setDiaActivo] = useState(1);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState(null);
  const [creadoId, setCreadoId] = useState(null);

  const dia = dias.find((d) => d.diaSemana === diaActivo);
  // Un día cuenta como de entreno si tiene ejercicios; los demás se guardan como descanso
  const diasEntreno = dias.filter((d) => !d.esDescanso && d.ejercicios.length > 0);

  useEffect(() => {
    if (error) window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [error]);

  const cambiarDia = (numero, cambios) =>
    setDias((prev) => prev.map((d) => (d.diaSemana === numero ? { ...d, ...(typeof cambios === 'function' ? cambios(d) : cambios) } : d)));

  const seleccionarDia = (numero) => {
    setDiaActivo(numero);
    document.getElementById(`dia-${numero}`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  const anadirEjercicio = (ej) => {
    const destino = dias.find((d) => d.diaSemana === diaActivo);
    if (!destino) return;
    if (destino.ejercicios.some((e) => e.ejercicio_id === ej.id)) {
      toast.info(`${ej.nombre} ya está en ${destino.nombre}`);
      return;
    }
    cambiarDia(diaActivo, (d) => ({
      esDescanso: false,
      ejercicios: [
        ...d.ejercicios,
        { uid: ++uid, ejercicio_id: ej.id, nombre: ej.nombre, grupoMuscular: ej.grupoMuscular, series: 3, repeticiones: 12, descanso: 60, notas: '' },
      ],
    }));
    toast.success(`${ej.nombre} añadido a ${destino.nombre}`);
  };

  const cambiarEjercicio = (numero, id, campo, valor) =>
    cambiarDia(numero, (d) => ({ ejercicios: d.ejercicios.map((e) => (e.uid === id ? { ...e, [campo]: valor } : e)) }));

  const quitarEjercicio = (numero, id) => cambiarDia(numero, (d) => ({ ejercicios: d.ejercicios.filter((e) => e.uid !== id) }));

  const toggleDescanso = (numero) => {
    cambiarDia(numero, (d) => ({ esDescanso: !d.esDescanso }));
    if (numero === diaActivo) {
      const siguiente = dias.find((d) => d.diaSemana !== numero && !d.esDescanso);
      if (siguiente) setDiaActivo(siguiente.diaSemana);
    }
  };

  const siguienteDia = (numero) => {
    const despues = dias.filter((d) => d.diaSemana > numero);
    const siguiente = despues.find((d) => !d.esDescanso) || despues[0];
    if (siguiente) {
      seleccionarDia(siguiente.diaSemana);
      setTimeout(() => document.getElementById(`concepto-${siguiente.diaSemana}`)?.focus(), 350);
    }
  };

  const idsDiaActivo = useMemo(() => dia?.ejercicios.map((e) => e.ejercicio_id) || [], [dia]);
  const totalEjercicios = dias.reduce((n, d) => n + (d.esDescanso ? 0 : d.ejercicios.length), 0);

  const guardar = async () => {
    setError(null);
    if (!nombre.trim()) {
      setError('Pon un nombre a tu plan');
      return;
    }
    if (diasEntreno.length === 0) {
      setError('Añade ejercicios al menos a un día');
      return;
    }

    const payload = {
      nombre: nombre.trim(),
      descripcion,
      tipo,
      nivelDificultad,
      duracionMinutos: parseInt(duracionMinutos, 10) || 60,
      esPublico: false,
      dias: dias.map((d) => {
        const descanso = d.esDescanso || d.ejercicios.length === 0;
        return {
        diaSemana: d.diaSemana,
        concepto: descanso ? '' : d.concepto.trim() || conceptoAutomatico(d.ejercicios) || 'Entrenamiento',
        esDescanso: descanso,
        ejercicios: descanso
          ? []
          : d.ejercicios.map((e) => ({
              ejercicio_id: e.ejercicio_id,
              series: parseInt(e.series, 10) || 3,
              repeticiones: parseInt(e.repeticiones, 10) || 12,
              descanso: parseInt(e.descanso, 10) || 60,
              notas: e.notas,
            })),
        };
      }),
    };

    try {
      setGuardando(true);
      const r = await api.post('/usuario/crear-entrenamiento', payload);
      if (r.data.success) setCreadoId(r.data.entrenamiento_id);
      else setError(r.data.error || 'No se pudo crear el entrenamiento');
    } catch (e) {
      setError(e.response?.data?.error || 'Error de conexión. Inténtalo de nuevo.');
    } finally {
      setGuardando(false);
    }
  };

  const campo = 'w-full rounded-xl border border-uf-line bg-black/50 px-4 py-3 text-white placeholder-gray-600 transition focus:border-uf-gold focus:outline-none';
  const campoMini = 'w-full rounded-lg border border-uf-line bg-black/50 px-2 py-1.5 text-center text-sm text-white focus:border-uf-gold focus:outline-none';

  return (
    <div className="min-h-screen bg-uf-darker py-10">
      {/* Plan creado */}
      {creadoId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="titulo-creado">
          <div className="uf-card w-full max-w-md border-uf-gold p-8 text-center">
            <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-uf-gold/20">
              <CheckCircle className="h-12 w-12 text-uf-gold" />
            </span>
            <h2 id="titulo-creado" className="mt-5 font-anton text-3xl uppercase text-white">Plan creado</h2>
            <p className="mt-3 text-gray-300">
              <strong className="text-white">{nombre}</strong> ya está en tus entrenamientos: {diasEntreno.length} {diasEntreno.length === 1 ? 'día' : 'días'} y {totalEjercicios} ejercicios.
            </p>
            <div className="mt-7 space-y-3">
              <button type="button" onClick={() => navigate(`/mis-entrenamientos/${creadoId}`)} className="uf-btn uf-btn-primary w-full">
                <Calendar className="h-4 w-4" />
                Ver rutina completa
              </button>
              <button type="button" onClick={() => navigate('/mis-entrenamientos')} className="uf-btn uf-btn-ghost w-full">
                Ir a mis entrenamientos
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={`container mx-auto px-4 ${creadoId ? 'blur-sm' : ''}`}>
        {/* Cabecera */}
        <div className="mb-8">
          <button type="button" onClick={() => navigate('/mis-entrenamientos')} className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-uf-gold hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            Volver
          </button>
          <span className="uf-eyebrow">Tu rutina</span>
          <h1 className="mt-2 font-anton text-4xl uppercase text-white md:text-5xl">
            Crear <span className="uf-text-gold">entrenamiento</span>
          </h1>
          <p className="mt-2 max-w-2xl text-uf-muted">
            Elige un grupo muscular en la figura, pulsa los ejercicios para añadirlos al día seleccionado, ponle nombre al día y pasa al siguiente.
          </p>
        </div>

        {error && (
          <div role="alert" className="mb-6 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:items-start">
          {/* Biblioteca */}
          <div className="min-w-0 lg:sticky lg:top-24">
            <PanelEjercicios destino={dia} destinos={dias} onCambiarDestino={seleccionarDia} onAnadir={anadirEjercicio} idsAnadidos={idsDiaActivo} />
          </div>

          {/* Plan */}
          <div className="min-w-0 space-y-4">
            <div className="uf-card p-5 md:p-6">
              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-300">Nombre del plan</span>
                <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej: Hipertrofia 4 días" maxLength={150} className={campo} />
              </label>
              <button type="button" onClick={() => setMasOpciones(!masOpciones)} aria-expanded={masOpciones} className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-uf-muted hover:text-white">
                <ChevronDown className={`h-4 w-4 transition-transform ${masOpciones ? 'rotate-180' : ''}`} />
                Más opciones
              </button>
              {masOpciones && (
                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  <label className="block">
                    <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-300">Tipo</span>
                    <select value={tipo} onChange={(e) => setTipo(e.target.value)} className={campo}>
                      <option value="gym">Gimnasio</option>
                      <option value="casa">En casa</option>
                      <option value="cardio">Cardio</option>
                      <option value="flexibilidad">Flexibilidad</option>
                    </select>
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-300">Nivel</span>
                    <select value={nivelDificultad} onChange={(e) => setNivelDificultad(e.target.value)} className={campo}>
                      <option value="principiante">Principiante</option>
                      <option value="intermedio">Intermedio</option>
                      <option value="avanzado">Avanzado</option>
                    </select>
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-300">Minutos por sesión</span>
                    <input type="number" min="10" max="300" value={duracionMinutos} onChange={(e) => setDuracionMinutos(e.target.value)} className={campo} />
                  </label>
                  <label className="block sm:col-span-3">
                    <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-300">Descripción</span>
                    <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} rows={2} placeholder="Objetivo del plan (opcional)" className={campo} />
                  </label>
                </div>
              )}
            </div>

            {/* Días */}
            {dias.map((d) => {
              const activo = d.diaSemana === diaActivo;
              const grupos = d.ejercicios.map((e) => e.grupoMuscular);
              return (
                <section
                  key={d.diaSemana}
                  id={`dia-${d.diaSemana}`}
                  aria-label={d.nombre}
                  className={`uf-card overflow-hidden transition-colors ${activo ? 'border-uf-gold shadow-[0_0_0_1px_rgba(204,148,26,0.4)]' : d.esDescanso ? 'opacity-70' : ''}`}
                >
                  {/* Cabecera del día */}
                  <div
                    className={`flex cursor-pointer flex-wrap items-center gap-3 p-4 ${activo ? 'bg-uf-gold/10' : ''}`}
                    onClick={() => !d.esDescanso && seleccionarDia(d.diaSemana)}
                  >
                    {d.esDescanso ? (
                      <span className="flex h-16 w-12 shrink-0 items-center justify-center text-gray-600">
                        <Moon className="h-7 w-7" />
                      </span>
                    ) : (
                      <MuscleMap grupos={grupos.length ? grupos : ['fullbody']} className={`h-16 w-12 shrink-0 ${grupos.length ? '' : 'opacity-30'}`} />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h2 className="font-anton text-xl uppercase text-white">{d.nombre}</h2>
                        {activo && <span className="uf-chip border-uf-gold/40 bg-uf-gold/10 text-[10px] text-uf-gold">Añadiendo aquí</span>}
                      </div>
                      {d.esDescanso ? (
                        <p className="text-sm text-gray-500">Día de descanso</p>
                      ) : (
                        <input
                          id={`concepto-${d.diaSemana}`}
                          value={d.concepto}
                          onChange={(e) => cambiarDia(d.diaSemana, { concepto: e.target.value })}
                          onFocus={() => setDiaActivo(d.diaSemana)}
                          onClick={(e) => e.stopPropagation()}
                          placeholder={conceptoAutomatico(d.ejercicios) || 'Nombre del día, p. ej. Pecho y tríceps'}
                          maxLength={100}
                          className="mt-1 w-full border-0 border-b border-transparent bg-transparent py-1 text-sm text-uf-gold placeholder-gray-500 focus:border-uf-gold focus:outline-none"
                          aria-label={`Nombre del entrenamiento de ${d.nombre}`}
                        />
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); toggleDescanso(d.diaSemana); }}
                      className={`rounded-full border px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider transition ${
                        d.esDescanso ? 'border-uf-line text-gray-400 hover:border-uf-gold hover:text-white' : 'border-uf-gold/40 bg-uf-gold/10 text-uf-gold hover:bg-uf-gold hover:text-black'
                      }`}
                    >
                      {d.esDescanso ? 'Entrenar este día' : 'Descanso'}
                    </button>
                  </div>

                  {/* Ejercicios del día */}
                  {!d.esDescanso && (
                    <div className="border-t border-uf-line p-4">
                      {d.ejercicios.length === 0 ? (
                        <p className="py-3 text-center text-sm text-uf-muted">
                          {activo ? 'Pulsa un ejercicio de la biblioteca para añadirlo aquí.' : 'Sin ejercicios: se guardará como descanso. Pulsa este día para añadirle ejercicios.'}
                        </p>
                      ) : (
                        <ul className="space-y-2">
                          <li className="hidden grid-cols-[1fr_repeat(3,4.5rem)_2rem] gap-2 px-2 text-[10px] font-bold uppercase tracking-widest text-uf-muted sm:grid">
                            <span>Ejercicio</span>
                            <span className="text-center">Series</span>
                            <span className="text-center">Reps</span>
                            <span className="text-center">Desc. (s)</span>
                            <span />
                          </li>
                          {d.ejercicios.map((e, i) => (
                            <li key={e.uid} className="grid grid-cols-[1fr_auto] items-center gap-2 rounded-xl border border-uf-line bg-black/30 p-2 sm:grid-cols-[1fr_repeat(3,4.5rem)_2rem]">
                              <div className="min-w-0 pl-1">
                                <span className="block truncate text-sm font-bold text-white">
                                  <span className="mr-2 text-uf-gold">{i + 1}.</span>
                                  {e.nombre}
                                </span>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-uf-muted">{NOMBRE_GRUPO[normalizar(e.grupoMuscular)] || e.grupoMuscular}</span>
                              </div>
                              <button type="button" onClick={() => quitarEjercicio(d.diaSemana, e.uid)} aria-label={`Quitar ${e.nombre}`} className="justify-self-end text-gray-500 hover:text-red-400 sm:order-last sm:justify-self-center">
                                <Trash2 className="h-4 w-4" />
                              </button>
                              <div className="col-span-2 grid grid-cols-3 gap-2 sm:col-span-3 sm:contents">
                                <input type="number" min="1" max="20" value={e.series} onChange={(ev) => cambiarEjercicio(d.diaSemana, e.uid, 'series', ev.target.value)} className={campoMini} aria-label="Series" />
                                <input type="number" min="1" max="100" value={e.repeticiones} onChange={(ev) => cambiarEjercicio(d.diaSemana, e.uid, 'repeticiones', ev.target.value)} className={campoMini} aria-label="Repeticiones" />
                                <input type="number" min="0" max="600" step="5" value={e.descanso} onChange={(ev) => cambiarEjercicio(d.diaSemana, e.uid, 'descanso', ev.target.value)} className={campoMini} aria-label="Descanso en segundos" />
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                      {activo && d.diaSemana < 7 && (
                        <div className="mt-3 flex justify-end">
                          <button type="button" onClick={() => siguienteDia(d.diaSemana)} className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-uf-gold hover:text-white">
                            Siguiente día
                            <ArrowRight className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </section>
              );
            })}

            {/* Guardar */}
            <div className="uf-card flex flex-col items-center justify-between gap-4 p-5 sm:flex-row">
              <p className="text-sm text-uf-muted">
                <strong className="text-white">{diasEntreno.length}</strong> {diasEntreno.length === 1 ? 'día' : 'días'} de entreno ·{' '}
                <strong className="text-white">{totalEjercicios}</strong> ejercicios
              </p>
              <button type="button" onClick={guardar} disabled={guardando} className="uf-btn uf-btn-primary w-full sm:w-auto disabled:opacity-50">
                <Save className="h-4 w-4" />
                {guardando ? 'Guardando...' : 'Guardar plan'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CrearEntrenamiento;
