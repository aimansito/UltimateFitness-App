// ============================================
// CREAR ENTRENAMIENTO - Rutina semanal
// Cada día se rellena tocando los músculos en la figura (SelectorMusculos) y marcando
// ejercicios. La biblioteca completa (favoritos y ejercicios propios) sigue disponible aparte.
// Estética de los vídeos: números en círculo dorado, Anton y Audiowide.
// ============================================
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, CheckCircle, ChevronDown, Library, Minus, Moon, Plus, Save, Trash2, X } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import MuscleMap from '../../components/common/MuscleMap';
import PanelEjercicios from '../../components/gym/PanelEjercicios';
import SelectorMusculos from '../../components/gym/SelectorMusculos';

const DIAS_SEMANA = [
  { numero: 1, nombre: 'Lunes', corto: 'L' },
  { numero: 2, nombre: 'Martes', corto: 'M' },
  { numero: 3, nombre: 'Miércoles', corto: 'X' },
  { numero: 4, nombre: 'Jueves', corto: 'J' },
  { numero: 5, nombre: 'Viernes', corto: 'V' },
  { numero: 6, nombre: 'Sábado', corto: 'S' },
  { numero: 7, nombre: 'Domingo', corto: 'D' },
];

const NOMBRE_GRUPO = {
  pecho: 'Pecho', espalda: 'Espalda', piernas: 'Piernas', hombros: 'Hombros', biceps: 'Bíceps', triceps: 'Tríceps',
  core: 'Core', gluteos: 'Glúteos', fullbody: 'Full body', cardio: 'Cardio', brazos: 'Brazos', cadera: 'Cadera',
};
const normalizar = (g) => (g || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[\s_-]/g, '');
const dos = (n) => String(n).padStart(2, '0');

// Título automático del día a partir de lo que se trabaja ("Pecho · Tríceps")
const conceptoAutomatico = (ejercicios) =>
  [...new Set(ejercicios.map((e) => normalizar(e.grupoMuscular)).filter(Boolean))]
    .slice(0, 3)
    .map((g) => NOMBRE_GRUPO[g] || g)
    .join(' · ');

let uid = 0;
const nuevoEjercicio = (ej) => ({ uid: ++uid, ejercicio_id: ej.id, nombre: ej.nombre, grupoMuscular: ej.grupoMuscular, series: 3, repeticiones: 12, descanso: 60, notas: '' });

/** Campo numérico con botones − / + (cómodo en el móvil) */
function Paso({ etiqueta, valor, onCambiar, min, max, paso = 1, sufijo }) {
  const n = parseInt(valor, 10) || 0;
  const fijar = (v) => onCambiar(Math.min(max, Math.max(min, v)));
  return (
    <div className="min-w-0 rounded-xl border border-uf-line bg-black/40 px-1 py-1.5 text-center sm:px-2">
      <span className="block text-[9px] font-bold uppercase tracking-widest text-uf-muted">{etiqueta}</span>
      <div className="mt-0.5 flex items-center justify-between gap-0.5">
        <button type="button" onClick={() => fijar(n - paso)} aria-label={`Menos ${etiqueta}`} className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-gray-400 hover:bg-white/10 hover:text-white sm:h-7 sm:w-7">
          <Minus className="h-3.5 w-3.5" />
        </button>
        <input
          type="number"
          min={min}
          max={max}
          step={paso}
          value={valor}
          onChange={(e) => onCambiar(e.target.value)}
          aria-label={etiqueta}
          className="w-full min-w-0 bg-transparent text-center font-anton text-xl text-white [appearance:textfield] focus:outline-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <button type="button" onClick={() => fijar(n + paso)} aria-label={`Más ${etiqueta}`} className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-gray-400 hover:bg-white/10 hover:text-white sm:h-7 sm:w-7">
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
      {sufijo && <span className="sr-only">{sufijo}</span>}
    </div>
  );
}

function CrearEntrenamiento() {
  const navigate = useNavigate();
  const toast = useToast();

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [tipo, setTipo] = useState('gym');
  const [nivelDificultad, setNivelDificultad] = useState('intermedio');
  const [duracionMinutos, setDuracionMinutos] = useState(60);
  const [masOpciones, setMasOpciones] = useState(false);
  const [biblioteca, setBiblioteca] = useState(false);
  const [selector, setSelector] = useState(null); // número de día con la figura abierta

  const [dias, setDias] = useState(
    DIAS_SEMANA.map((d) => ({ diaSemana: d.numero, nombre: d.nombre, corto: d.corto, concepto: '', esDescanso: d.numero >= 6, ejercicios: [] }))
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

  // Desde la biblioteca completa: añade uno al día activo
  const anadirEjercicio = (ej) => {
    const destino = dias.find((d) => d.diaSemana === diaActivo);
    if (!destino) return;
    if (destino.ejercicios.some((e) => e.ejercicio_id === ej.id)) {
      toast.info(`${ej.nombre} ya está en ${destino.nombre}`);
      return;
    }
    cambiarDia(diaActivo, (d) => ({ esDescanso: false, ejercicios: [...d.ejercicios, nuevoEjercicio(ej)] }));
    toast.success(`${ej.nombre} añadido a ${destino.nombre}`);
  };

  // Desde la figura: el día queda exactamente con lo marcado (se conservan series/reps de los que ya estaban)
  const aplicarSeleccion = (numero, seleccion) => {
    cambiarDia(numero, (d) => ({
      esDescanso: false,
      ejercicios: seleccion.map((ej) => d.ejercicios.find((e) => e.ejercicio_id === ej.id) || nuevoEjercicio(ej)),
    }));
    setSelector(null);
    setDiaActivo(numero);
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

  const idsDiaActivo = useMemo(() => dia?.ejercicios.map((e) => e.ejercicio_id) || [], [dia]);
  const totalEjercicios = dias.reduce((n, d) => n + (d.esDescanso ? 0 : d.ejercicios.length), 0);
  const totalSeries = dias.reduce((n, d) => n + (d.esDescanso ? 0 : d.ejercicios.reduce((s, e) => s + (parseInt(e.series, 10) || 0), 0)), 0);

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
  const diaSelector = dias.find((d) => d.diaSemana === selector);

  return (
    <div className="min-h-screen bg-uf-darker py-10">
      {/* Selector con la figura */}
      {diaSelector && <SelectorMusculos dia={diaSelector} onConfirmar={(sel) => aplicarSeleccion(diaSelector.diaSemana, sel)} onClose={() => setSelector(null)} />}

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
            <p className="mt-2 text-sm text-uf-muted">Ábrelo cuando entrenes y apunta tus pesos: verás tu progreso en tu perfil.</p>
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

      <div className={`container mx-auto max-w-6xl px-4 ${creadoId ? 'blur-sm' : ''}`}>
        {/* Cabecera */}
        <div className="mb-8">
          <button type="button" onClick={() => navigate('/mis-entrenamientos')} className="mb-4 flex w-fit items-center gap-2 text-sm font-semibold text-uf-gold hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            Volver
          </button>
          <span className="uf-eyebrow">Tu rutina semanal</span>
          <h1 className="mt-2 font-anton text-5xl uppercase leading-none text-white md:text-6xl">
            Crea tu <span className="uf-text-gold">rutina</span>
          </h1>
          <p className="mt-3 max-w-2xl text-uf-muted">
            Elige los días que entrenas, pulsa <strong className="text-white">Añadir ejercicios</strong> y toca en la figura los músculos que quieres trabajar.
          </p>
        </div>

        {error && (
          <div role="alert" className="mb-6 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* Nombre y resumen */}
        <div className="uf-card mb-6 p-5 md:p-7">
          <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
            <label className="block">
              <span className="mb-2 block font-audiowide text-[11px] uppercase tracking-[0.3em] text-gray-300">Nombre del plan</span>
              <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej: Hipertrofia 4 días" maxLength={150} className={`${campo} font-anton text-2xl uppercase tracking-wide`} />
            </label>
            <dl className="grid grid-cols-3 gap-3 text-center">
              {[
                ['Días', diasEntreno.length],
                ['Ejercicios', totalEjercicios],
                ['Series', totalSeries],
              ].map(([k, v]) => (
                <div key={k} className="flex h-20 w-20 flex-col items-center justify-center rounded-full border-2 border-uf-gold/70 shadow-[0_0_24px_rgba(204,148,26,0.15)]">
                  <dd className="font-anton text-2xl leading-none text-uf-gold">{v}</dd>
                  <dt className="mt-1 text-[9px] font-bold uppercase tracking-widest text-uf-muted">{k}</dt>
                </div>
              ))}
            </dl>
          </div>

          {/* Semana: qué días se entrena */}
          <div className="mt-6 grid grid-cols-7 gap-1.5 sm:gap-2" role="group" aria-label="Días de la semana">
            {dias.map((d) => {
              const activo = d.diaSemana === diaActivo;
              const entrena = !d.esDescanso;
              return (
                <button
                  key={d.diaSemana}
                  type="button"
                  onClick={() => (entrena ? seleccionarDia(d.diaSemana) : toggleDescanso(d.diaSemana))}
                  aria-pressed={entrena}
                  aria-label={`${d.nombre}: ${entrena ? 'entreno' : 'descanso'}`}
                  className={`flex flex-col items-center rounded-2xl border py-2.5 transition ${
                    activo ? 'border-uf-gold bg-uf-gold text-black' : entrena ? 'border-uf-gold/50 bg-uf-gold/10 text-white' : 'border-uf-line bg-black/30 text-gray-500 hover:border-uf-gold/40'
                  }`}
                >
                  <span className="font-anton text-xl leading-none">{d.corto}</span>
                  <span className={`mt-1 text-[9px] font-bold uppercase tracking-wider ${activo ? 'text-black/70' : ''}`}>
                    {entrena ? `${d.ejercicios.length} ej.` : 'Desc.'}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
            <button type="button" onClick={() => setMasOpciones(!masOpciones)} aria-expanded={masOpciones} className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-uf-muted hover:text-white">
              <ChevronDown className={`h-4 w-4 transition-transform ${masOpciones ? 'rotate-180' : ''}`} />
              Más opciones
            </button>
            <button type="button" onClick={() => setBiblioteca(!biblioteca)} aria-expanded={biblioteca} className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-uf-muted hover:text-white">
              {biblioteca ? <X className="h-4 w-4" /> : <Library className="h-4 w-4" />}
              {biblioteca ? 'Cerrar biblioteca' : 'Biblioteca, favoritos y ejercicios propios'}
            </button>
          </div>
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

        <div className={`grid grid-cols-1 gap-6 ${biblioteca ? 'lg:grid-cols-[minmax(0,400px)_minmax(0,1fr)] lg:items-start' : ''}`}>
          {biblioteca && (
            <div className="min-w-0 lg:sticky lg:top-24">
              <PanelEjercicios destino={dia} destinos={dias} onCambiarDestino={seleccionarDia} onAnadir={anadirEjercicio} idsAnadidos={idsDiaActivo} />
            </div>
          )}

          {/* Días */}
          <div className="min-w-0 space-y-4">
            {dias.map((d) => {
              const activo = d.diaSemana === diaActivo;
              const grupos = d.ejercicios.map((e) => e.grupoMuscular);
              if (d.esDescanso) {
                return (
                  <section key={d.diaSemana} id={`dia-${d.diaSemana}`} aria-label={d.nombre} className="flex items-center gap-4 rounded-[1.25rem] border border-dashed border-uf-line px-5 py-3 opacity-70">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-uf-line text-gray-600">
                      <Moon className="h-5 w-5" />
                    </span>
                    <p className="min-w-0 flex-1 font-anton text-lg uppercase text-gray-400">
                      {d.nombre} <span className="ml-2 font-sans text-xs font-bold normal-case tracking-normal text-gray-600">Descanso</span>
                    </p>
                    <button type="button" onClick={() => toggleDescanso(d.diaSemana)} className="rounded-full border border-uf-line px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-400 transition hover:border-uf-gold hover:text-white">
                      Entrenar este día
                    </button>
                  </section>
                );
              }
              return (
                <section
                  key={d.diaSemana}
                  id={`dia-${d.diaSemana}`}
                  aria-label={d.nombre}
                  onClick={() => setDiaActivo(d.diaSemana)}
                  className={`uf-card overflow-hidden transition-colors ${activo ? 'border-uf-gold shadow-[0_0_40px_rgba(204,148,26,0.15)]' : ''}`}
                >
                  {/* Cabecera del día */}
                  <div className="flex flex-wrap items-center gap-4 p-5">
                    <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-[3px] font-anton text-2xl ${activo ? 'border-uf-gold bg-uf-gold text-black' : 'border-uf-gold text-uf-gold'}`}>
                      {dos(d.diaSemana)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h2 className="font-anton text-3xl uppercase leading-none text-white">{d.nombre}</h2>
                      <input
                        id={`concepto-${d.diaSemana}`}
                        value={d.concepto}
                        onChange={(e) => cambiarDia(d.diaSemana, { concepto: e.target.value })}
                        placeholder={conceptoAutomatico(d.ejercicios) || 'Nombre del día, p. ej. Pecho y tríceps'}
                        maxLength={100}
                        className="mt-1 w-full border-0 border-b border-transparent bg-transparent py-1 font-audiowide text-xs uppercase tracking-[0.2em] text-uf-gold placeholder-gray-600 focus:border-uf-gold focus:outline-none"
                        aria-label={`Nombre del entrenamiento de ${d.nombre}`}
                      />
                    </div>
                    <MuscleMap grupos={grupos.length ? grupos : ['fullbody']} vista="ambas" className={`hidden h-16 w-20 shrink-0 sm:flex ${grupos.length ? '' : 'opacity-25'}`} />
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); toggleDescanso(d.diaSemana); }}
                      aria-label={`Marcar ${d.nombre} como descanso`}
                      title="Marcar como descanso"
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-uf-line text-gray-500 transition hover:border-uf-gold hover:text-white"
                    >
                      <Moon className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Ejercicios del día */}
                  <div className="border-t border-uf-line p-5">
                    {d.ejercicios.length > 0 && (
                      <ol className="mb-4 space-y-3">
                        {d.ejercicios.map((e, i) => (
                          <li key={e.uid} className="rounded-2xl border border-uf-line bg-black/30 p-3 sm:p-4">
                            <div className="flex items-center gap-3">
                              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-uf-gold font-anton text-lg text-uf-gold">{dos(i + 1)}</span>
                              <div className="min-w-0 flex-1">
                                <p className="truncate font-anton text-lg uppercase leading-tight text-white">{e.nombre}</p>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-uf-muted">{NOMBRE_GRUPO[normalizar(e.grupoMuscular)] || e.grupoMuscular}</p>
                              </div>
                              <button type="button" onClick={() => quitarEjercicio(d.diaSemana, e.uid)} aria-label={`Quitar ${e.nombre}`} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-500 hover:bg-red-500/10 hover:text-red-400">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                            <div className="mt-3 grid grid-cols-3 gap-2">
                              <Paso etiqueta="Series" valor={e.series} min={1} max={20} onCambiar={(v) => cambiarEjercicio(d.diaSemana, e.uid, 'series', v)} />
                              <Paso etiqueta="Reps" valor={e.repeticiones} min={1} max={100} onCambiar={(v) => cambiarEjercicio(d.diaSemana, e.uid, 'repeticiones', v)} />
                              <Paso etiqueta="Desc. (s)" valor={e.descanso} min={0} max={600} paso={15} onCambiar={(v) => cambiarEjercicio(d.diaSemana, e.uid, 'descanso', v)} />
                            </div>
                          </li>
                        ))}
                      </ol>
                    )}
                    <button
                      type="button"
                      onClick={(ev) => { ev.stopPropagation(); setSelector(d.diaSemana); }}
                      className={`flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed py-4 font-anton text-lg uppercase tracking-wide transition ${
                        d.ejercicios.length ? 'border-uf-line text-gray-400 hover:border-uf-gold hover:text-uf-gold' : 'border-uf-gold/60 bg-uf-gold/5 text-uf-gold hover:bg-uf-gold/10'
                      }`}
                    >
                      <Plus className="h-5 w-5" />
                      {d.ejercicios.length ? 'Añadir o quitar ejercicios' : 'Añadir ejercicios'}
                    </button>
                  </div>
                </section>
              );
            })}

            {/* Guardar */}
            <div className="uf-card sticky bottom-3 z-10 flex flex-col items-center justify-between gap-4 border-uf-gold/40 p-4 sm:flex-row">
              <p className="text-sm text-uf-muted">
                <strong className="font-anton text-lg text-white">{diasEntreno.length}</strong> {diasEntreno.length === 1 ? 'día' : 'días'} ·{' '}
                <strong className="font-anton text-lg text-white">{totalEjercicios}</strong> ejercicios ·{' '}
                <strong className="font-anton text-lg text-white">{totalSeries}</strong> series a la semana
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
