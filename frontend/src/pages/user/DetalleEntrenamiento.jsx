// ============================================
// DETALLE DE UNA RUTINA
// Semana con sus días y los ejercicios del día. Modo entreno: cronómetro, marcar cada
// ejercicio como hecho y, con todos hechos, «Completar rutina» abre la cámara para la foto
// estilo Strava que se guarda en el perfil. Quien creó la rutina puede añadir, sustituir
// o quitar ejercicios. Abajo, el progreso de la rutina en gráficas.
// ============================================
import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import useAuthEntrenador from '../../context/AuthContextEntrenador';
import api from '../../services/api';
import progresoService from '../../services/progresoService';
import { mensajeError } from '../../services/socialService';
import { useToast } from '../../context/ToastContext';
import { ArrowLeft, Camera, Check, Clock, Dumbbell, History, Image as ImageIcon, Lock, Moon, Play, Plus, Repeat, Trash2, TrendingUp } from 'lucide-react';
import MuscleMap from '../../components/common/MuscleMap';
import RegistroSeries from '../../components/progreso/RegistroSeries';
import ProgresoRutina from '../../components/progreso/ProgresoRutina';
import CompletarEntreno from '../../components/progreso/CompletarEntreno';
import SelectorMusculos from '../../components/gym/SelectorMusculos';
import { ultimaSesion } from '../../components/progreso/formato';

const DIAS = { 1: ['Lunes', 'L'], 2: ['Martes', 'M'], 3: ['Miércoles', 'X'], 4: ['Jueves', 'J'], 5: ['Viernes', 'V'], 6: ['Sábado', 'S'], 7: ['Domingo', 'D'] };
const dos = (n) => String(n).padStart(2, '0');
const fechaCorta = (f) => new Date(`${f}T00:00:00`).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
// Día de hoy en formato 1 (lunes) a 7 (domingo) y fecha local YYYY-MM-DD
const hoy = () => ((new Date().getDay() + 6) % 7) + 1;
const fechaHoy = () => {
  const d = new Date();
  return `${d.getFullYear()}-${dos(d.getMonth() + 1)}-${dos(d.getDate())}`;
};
const reloj = (ms) => {
  const s = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(s / 3600);
  return `${h ? `${h}:` : ''}${dos(Math.floor((s % 3600) / 60))}:${dos(s % 60)}`;
};

// Sesión de entreno del día (cuándo empezó y qué ejercicios están hechos), guardada en el navegador
const claveSesion = (rutina, dia) => `uf-sesion-${rutina}-${dia}-${fechaHoy()}`;
const leerSesion = (clave) => {
  try {
    return JSON.parse(localStorage.getItem(clave)) || { inicio: null, hechos: [] };
  } catch {
    return { inicio: null, hechos: [] };
  }
};

function DetalleEntrenamiento() {
  const { entrenamientoId } = useParams();
  const { user } = useAuth();
  const { entrenador } = useAuthEntrenador();
  const navigate = useNavigate();
  const toast = useToast();
  const camara = useRef(null);
  const galeria = useRef(null);
  const [eligiendoFoto, setEligiendoFoto] = useState(false);
  const [entrenamiento, setEntrenamiento] = useState(null);
  const [diaSeleccionado, setDiaSeleccionado] = useState(1);
  const [loading, setLoading] = useState(true);
  const [registrando, setRegistrando] = useState(null);
  const [ultimas, setUltimas] = useState({}); // ejercicio_id -> última sesión en esta rutina
  const [recarga, setRecarga] = useState(0);
  const [sesion, setSesion] = useState({ inicio: null, hechos: [] });
  const [ahora, setAhora] = useState(Date.now());
  const [foto, setFoto] = useState(null);
  const [selector, setSelector] = useState(null); // { modo: 'dia' } | { modo: 'sustituir', ejercicio }

  const isEntrenador = !!entrenador;
  const puedeRegistrar = user && !isEntrenador;
  const editable = puedeRegistrar && !!entrenamiento?.editable;

  const cargar = useCallback(
    (primeraVez = false) => {
      if (!(user || entrenador) || !entrenamientoId) return;
      const endpoint = isEntrenador ? `/entrenador/entrenamiento/${entrenamientoId}` : `/usuario/entrenamiento/${entrenamientoId}`;
      api
        .get(endpoint)
        .then((response) => {
          if (response.data.success && response.data.entrenamiento) {
            const datos = response.data.entrenamiento;
            setEntrenamiento(datos);
            if (primeraVez) {
              // Si hoy toca entrenar, se abre hoy; si no, el primer día activo
              const activos = (datos.dias || []).filter((d) => !d.es_descanso);
              const deHoy = activos.find((d) => d.dia_semana === hoy());
              if (deHoy || activos[0]) setDiaSeleccionado((deHoy || activos[0]).dia_semana);
            }
          }
        })
        .catch((error) => console.error('Error al cargar entrenamiento:', error))
        .finally(() => setLoading(false));
    },
    [user, entrenador, entrenamientoId, isEntrenador]
  );

  useEffect(() => {
    cargar(true);
  }, [cargar]);

  useEffect(() => {
    if (!puedeRegistrar) return;
    progresoService
      .rutina(entrenamientoId)
      .then((d) => setUltimas(Object.fromEntries(d.ejercicios.filter((e) => e.ultima).map((e) => [e.ejercicioId, e.ultima]))))
      .catch(() => {});
  }, [puedeRegistrar, entrenamientoId, recarga]);

  // Sesión del día seleccionado
  const clave = claveSesion(entrenamientoId, diaSeleccionado);
  useEffect(() => {
    setSesion(leerSesion(clave));
  }, [clave]);
  const guardarSesion = (nueva) => {
    setSesion(nueva);
    try {
      localStorage.setItem(clave, JSON.stringify(nueva));
    } catch {
      /* sin almacenamiento: la sesión vive solo en memoria */
    }
  };

  useEffect(() => {
    if (!sesion.inicio || sesion.completado) return undefined;
    const t = setInterval(() => setAhora(Date.now()), 1000);
    return () => clearInterval(t);
  }, [sesion.inicio, sesion.completado]);

  const handleBack = () => navigate(isEntrenador ? '/entrenador/mis-entrenamientos' : '/mis-entrenamientos');

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-uf-darker" role="status">
        <div className="text-center">
          <div className="mx-auto mb-4 h-14 w-14 animate-spin rounded-full border-b-4 border-t-4 border-uf-gold" />
          <p className="text-uf-muted">Cargando rutina...</p>
        </div>
      </div>
    );
  }

  if (!entrenamiento) {
    return (
      <div className="min-h-screen bg-uf-darker px-4 py-20 text-center">
        <h2 className="font-anton text-3xl uppercase text-white">Rutina no encontrada</h2>
        <button onClick={handleBack} className="uf-btn uf-btn-primary mt-6">Volver a mis entrenamientos</button>
      </div>
    );
  }

  const diaActual = entrenamiento.dias?.find((d) => d.dia_semana === diaSeleccionado);
  const ejerciciosDia = diaActual && !diaActual.es_descanso ? diaActual.ejercicios || [] : [];
  const diasActivos = entrenamiento.dias?.filter((d) => !d.es_descanso).length || 0;
  const seriesDia = ejerciciosDia.reduce((s, e) => s + (Number(e.series) || 0), 0);
  const gruposDia = ejerciciosDia.map((e) => e.grupo_muscular);

  // Progreso de la sesión
  const completado = !!sesion.completado;
  const hechos = ejerciciosDia.filter((e) => sesion.hechos.includes(e.id)).length;
  const todosHechos = ejerciciosDia.length > 0 && hechos === ejerciciosDia.length;
  const minutos = sesion.inicio ? Math.min(600, Math.max(1, Math.round((ahora - sesion.inicio) / 60000))) : null;
  // Kg movidos hoy (cada ejercicio una vez aunque se repita en el día)
  const volumenHoy = [...new Set(ejerciciosDia.map((e) => e.ejercicio_id))].reduce((n, id) => {
    const u = ultimas[id];
    return n + (u && u.fecha === fechaHoy() ? u.volumen || 0 : 0);
  }, 0);

  const empezar = () => guardarSesion({ ...sesion, inicio: sesion.inicio || Date.now() });
  const marcar = (id, valor) => {
    const ya = sesion.hechos.includes(id);
    const hecho = valor ?? !ya;
    if (hecho === ya) return;
    guardarSesion({ inicio: sesion.inicio || Date.now(), hechos: hecho ? [...sesion.hechos, id] : sesion.hechos.filter((x) => x !== id) });
  };

  // ---------- edición de la rutina ----------
  const quitar = async (ej) => {
    if (!window.confirm(`¿Quitar «${ej.ejercicio_nombre}» de este día?`)) return;
    try {
      await api.delete(`/usuario/rutina/ejercicio/${ej.id}`);
      toast.success('Ejercicio quitado');
      cargar();
    } catch (e) {
      toast.error(mensajeError(e, 'No se pudo quitar el ejercicio'));
    }
  };

  const aplicarSelector = async (seleccion) => {
    const actual = selector;
    setSelector(null);
    try {
      if (actual.modo === 'sustituir') {
        await api.patch(`/usuario/rutina/ejercicio/${actual.ejercicio.id}`, { ejercicioId: seleccion[0].id });
        toast.success(`Cambiado por ${seleccion[0].nombre}`);
      } else {
        const elegidos = seleccion.map((s) => s.id);
        const quitarIds = ejerciciosDia.filter((e) => !elegidos.includes(e.ejercicio_id));
        const nuevos = seleccion.filter((s) => !ejerciciosDia.some((e) => e.ejercicio_id === s.id));
        for (const e of quitarIds) await api.delete(`/usuario/rutina/ejercicio/${e.id}`);
        for (const s of nuevos) await api.post(`/usuario/rutina/${entrenamientoId}/dia/${diaSeleccionado}/ejercicios`, { ejercicioId: s.id });
        if (quitarIds.length || nuevos.length) toast.success('Rutina actualizada');
      }
      cargar();
    } catch (e) {
      toast.error(mensajeError(e, 'No se pudo actualizar la rutina'));
      cargar();
    }
  };

  const diaParaSelector = {
    nombre: DIAS[diaSeleccionado]?.[0],
    concepto: diaActual && !diaActual.es_descanso ? diaActual.concepto : '',
    ejercicios: ejerciciosDia.map((e) => ({ ejercicio_id: e.ejercicio_id, nombre: e.ejercicio_nombre, grupoMuscular: e.grupo_muscular })),
  };

  return (
    <div className="min-h-screen bg-uf-darker py-10 pb-32">
      <div className="container mx-auto max-w-6xl px-4">
        {/* Cabecera */}
        <button onClick={handleBack} className="mb-4 flex w-fit items-center gap-2 text-sm font-semibold text-uf-gold hover:text-white">
          <ArrowLeft className="h-4 w-4" />
          Mis entrenamientos
        </button>
        <div className="uf-card relative overflow-hidden p-6 md:p-8">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-uf-gold/10 blur-3xl" aria-hidden="true" />
          <div className="relative grid gap-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
            <div className="min-w-0">
              <span className="uf-eyebrow">Rutina de {entrenamiento.tipo || 'gym'}</span>
              <h1 className="mt-3 font-anton text-4xl uppercase leading-none text-white md:text-6xl">{entrenamiento.nombre}</h1>
              {entrenamiento.descripcion && <p className="mt-3 max-w-2xl text-uf-muted">{entrenamiento.descripcion}</p>}
            </div>
            <dl className="flex gap-3">
              {[
                [`${diasActivos}`, 'Días'],
                [`${entrenamiento.duracion_minutos || '-'}`, 'Min'],
                [entrenamiento.nivel_dificultad?.slice(0, 5) || '-', 'Nivel'],
              ].map(([v, k]) => (
                <div key={k} className="flex h-20 w-20 flex-col items-center justify-center rounded-full border-2 border-uf-gold/70 shadow-[0_0_24px_rgba(204,148,26,0.15)]">
                  <dd className="font-anton text-2xl uppercase leading-none text-uf-gold">{v}</dd>
                  <dt className="mt-1 text-[9px] font-bold uppercase tracking-widest text-uf-muted">{k}</dt>
                </div>
              ))}
            </dl>
          </div>

          {/* Semana */}
          <div className="relative mt-7 grid grid-cols-7 gap-1.5 sm:gap-2" role="tablist" aria-label="Días de la semana">
            {entrenamiento.dias?.map((dia) => {
              const [nombre, corto] = DIAS[dia.dia_semana] || ['', ''];
              const activo = diaSeleccionado === dia.dia_semana;
              const descanso = !!dia.es_descanso;
              return (
                <button
                  key={dia.dia_semana}
                  role="tab"
                  aria-selected={activo}
                  aria-label={`${nombre}${descanso ? ' (descanso)' : dia.concepto ? `: ${dia.concepto}` : ''}`}
                  onClick={() => setDiaSeleccionado(dia.dia_semana)}
                  className={`relative flex flex-col items-center rounded-2xl border px-1 py-3 transition ${
                    activo ? 'border-uf-gold bg-uf-gold text-black' : descanso ? 'border-uf-line bg-black/30 text-gray-600' : 'border-uf-gold/40 bg-uf-gold/5 text-white hover:border-uf-gold'
                  }`}
                >
                  <span className="font-anton text-2xl leading-none">{corto}</span>
                  <span className={`mt-1 hidden max-w-full truncate px-1 text-[9px] font-bold uppercase tracking-wider sm:block ${activo ? 'text-black/70' : 'text-uf-muted'}`}>
                    {descanso ? 'Descanso' : dia.concepto || nombre}
                  </span>
                  {dia.dia_semana === hoy() && <span className={`absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full ${activo ? 'bg-black' : 'bg-uf-gold'}`} aria-label="Hoy" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Día seleccionado */}
        <section className="mt-6" aria-labelledby="titulo-dia">
          {ejerciciosDia.length === 0 ? (
            <div className="uf-card flex flex-col items-center p-12 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-uf-line text-gray-500">
                {diaActual && !diaActual.es_descanso ? <Dumbbell className="h-7 w-7" /> : <Moon className="h-7 w-7" />}
              </span>
              <h2 id="titulo-dia" className="mt-4 font-anton text-3xl uppercase text-white">
                {DIAS[diaSeleccionado]?.[0]}: {diaActual && !diaActual.es_descanso ? 'sin ejercicios' : 'descanso'}
              </h2>
              <p className="mt-1 text-uf-muted">El músculo crece descansando. Mañana, a por ello.</p>
              {editable && (
                <button type="button" onClick={() => setSelector({ modo: 'dia' })} className="uf-btn uf-btn-ghost mt-6">
                  <Plus className="h-4 w-4" /> Entrenar este día
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
                <div className="flex items-center gap-4">
                  <MuscleMap grupos={gruposDia} vista="ambas" className="h-20 w-24 shrink-0" />
                  <div>
                    <span className="font-audiowide text-[11px] uppercase tracking-[0.3em] text-uf-muted">{DIAS[diaSeleccionado]?.[0]}</span>
                    <h2 id="titulo-dia" className="font-anton text-3xl uppercase leading-none text-white md:text-4xl">
                      {diaActual.concepto || 'Entrenamiento'}
                    </h2>
                  </div>
                </div>
                <p className="flex items-center gap-4 text-sm text-uf-muted">
                  <span><strong className="font-anton text-lg text-white">{ejerciciosDia.length}</strong> ejercicios</span>
                  <span><strong className="font-anton text-lg text-white">{seriesDia}</strong> series</span>
                  <span className="inline-flex items-center gap-1"><Clock className="h-4 w-4" /> ~{Math.round(seriesDia * 2.5)} min</span>
                </p>
              </div>

              <ol className="grid gap-3 md:grid-cols-2">
                {ejerciciosDia.map((ej, i) => {
                  const ultima = ultimas[ej.ejercicio_id];
                  const hecho = sesion.hechos.includes(ej.id);
                  return (
                    <li key={ej.id || i} className={`uf-card flex min-w-0 flex-col p-5 transition-colors ${hecho ? 'border-uf-gold/70 bg-uf-gold/[0.04]' : 'hover:border-uf-gold/60'}`}>
                      <div className="flex items-start gap-4">
                        {puedeRegistrar ? (
                          <button
                            type="button"
                            onClick={() => marcar(ej.id)}
                            aria-pressed={hecho}
                            aria-label={hecho ? `Desmarcar ${ej.ejercicio_nombre}` : `Marcar ${ej.ejercicio_nombre} como hecho`}
                            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-[3px] font-anton text-xl transition ${
                              hecho ? 'border-uf-gold bg-uf-gold text-black' : 'border-uf-gold text-uf-gold hover:bg-uf-gold/15'
                            }`}
                          >
                            {hecho ? <Check className="h-6 w-6" strokeWidth={3} /> : dos(i + 1)}
                          </button>
                        ) : (
                          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-[3px] border-uf-gold font-anton text-xl text-uf-gold">{dos(i + 1)}</span>
                        )}
                        <div className="min-w-0 flex-1">
                          <h3 className={`font-anton text-xl uppercase leading-tight ${hecho ? 'text-uf-gold' : 'text-white'}`}>{ej.ejercicio_nombre || 'Ejercicio'}</h3>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-uf-muted">
                            {ej.grupo_muscular || 'General'}
                            {hecho && <span className="ml-2 text-uf-gold">· Hecho</span>}
                          </p>
                        </div>
                        {editable ? (
                          <div className="flex shrink-0 gap-1">
                            <button type="button" onClick={() => setSelector({ modo: 'sustituir', ejercicio: ej })} aria-label={`Sustituir ${ej.ejercicio_nombre}`} title="Sustituir" className="flex h-9 w-9 items-center justify-center rounded-full border border-uf-line text-gray-400 transition hover:border-uf-gold hover:text-uf-gold">
                              <Repeat className="h-4 w-4" />
                            </button>
                            <button type="button" onClick={() => quitar(ej)} aria-label={`Quitar ${ej.ejercicio_nombre}`} title="Quitar" className="flex h-9 w-9 items-center justify-center rounded-full border border-uf-line text-gray-400 transition hover:border-red-400 hover:text-red-400">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <MuscleMap grupo={ej.grupo_muscular} className="h-14 w-9 shrink-0" />
                        )}
                      </div>

                      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                        {[
                          [ej.series, 'Series'],
                          [ej.repeticiones, 'Reps'],
                          [`${ej.descanso_segundos}s`, 'Descanso'],
                        ].map(([v, k]) => (
                          <div key={k} className="rounded-xl border border-uf-line bg-black/40 py-2">
                            <p className="font-anton text-2xl leading-none text-uf-gold">{v}</p>
                            <p className="mt-1 text-[9px] font-bold uppercase tracking-widest text-uf-muted">{k}</p>
                          </div>
                        ))}
                      </div>

                      {ej.notas && <p className="mt-3 border-l-2 border-uf-gold pl-3 text-sm text-gray-300">{ej.notas}</p>}

                      {puedeRegistrar && (
                        <div className="mt-auto pt-4">
                          <p className="mb-3 flex items-center gap-1.5 text-xs text-uf-muted">
                            <History className="h-3.5 w-3.5 shrink-0" />
                            {ultima ? (
                              <>Última vez ({fechaCorta(ultima.fecha)}): <strong className="text-white">{ultimaSesion(ultima)}</strong></>
                            ) : (
                              'Aún no lo has registrado'
                            )}
                          </p>
                          {ej.ejercicio_id && (
                            <button type="button" onClick={() => setRegistrando(ej)} className="uf-btn uf-btn-primary w-full !py-2.5 text-xs">
                              <TrendingUp className="h-4 w-4" />
                              Registrar series y peso
                            </button>
                          )}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ol>

              {editable && (
                <button
                  type="button"
                  onClick={() => setSelector({ modo: 'dia' })}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-uf-line py-4 font-anton text-lg uppercase tracking-wide text-gray-400 transition hover:border-uf-gold hover:text-uf-gold"
                >
                  <Plus className="h-5 w-5" /> Añadir o quitar ejercicios
                </button>
              )}
            </>
          )}
        </section>

        {/* Progreso de esta rutina */}
        {puedeRegistrar && (
          <section className="uf-card mt-10 p-5 md:p-7" aria-labelledby="titulo-progreso">
            <span className="uf-eyebrow">Tu evolución</span>
            <h2 id="titulo-progreso" className="mb-6 mt-2 font-anton text-3xl uppercase leading-none text-white md:text-4xl">
              Progreso de <span className="uf-text-gold">esta rutina</span>
            </h2>
            <ProgresoRutina
              entrenamientoId={Number(entrenamientoId)}
              recarga={recarga}
              onRegistrar={(e) =>
                setRegistrando({ ejercicio_id: e.ejercicioId, ejercicio_nombre: e.nombre, grupo_muscular: e.grupoMuscular, series: e.plan.series, repeticiones: e.plan.repeticiones })
              }
            />
          </section>
        )}
      </div>

      {/* Barra del entreno: cronómetro, progreso y completar */}
      {puedeRegistrar && ejerciciosDia.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-uf-gold/30 bg-black/90 px-4 py-3 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center gap-3 sm:gap-5">
            {completado ? (
              <p className="flex flex-1 items-center gap-2 font-anton text-lg uppercase text-uf-gold">
                <Check className="h-5 w-5" /> Rutina completada hoy
              </p>
            ) : !sesion.inicio ? (
              <>
                <p className="min-w-0 flex-1 text-sm text-uf-muted">Empieza el cronómetro y marca cada ejercicio al terminarlo.</p>
                <button type="button" onClick={empezar} className="uf-btn uf-btn-primary shrink-0 !py-2.5">
                  <Play className="h-4 w-4" /> Empezar
                </button>
              </>
            ) : (
              <>
                <div className="shrink-0 text-center">
                  <p className="font-anton text-2xl leading-none tabular-nums text-white">{reloj(ahora - sesion.inicio)}</p>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-uf-muted">Tiempo</p>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-uf-muted">
                    <span>Ejercicios</span>
                    <span className="text-white">{hechos}/{ejerciciosDia.length}</span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-uf-gold transition-all" style={{ width: `${(hechos / ejerciciosDia.length) * 100}%` }} />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setEligiendoFoto(true)}
                  disabled={!todosHechos}
                  title={todosHechos ? 'Haz la foto de tu entreno' : 'Marca todos los ejercicios para completar'}
                  className="uf-btn uf-btn-primary shrink-0 !px-4 !py-2.5 disabled:cursor-not-allowed disabled:opacity-40 sm:!px-6"
                >
                  {todosHechos ? <Camera className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                  <span className="hidden sm:inline">Completar rutina</span>
                  <span className="sm:hidden">Completar</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Elegir de dónde sale la foto: cámara o galería */}
      {eligiendoFoto && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-labelledby="titulo-foto" onClick={() => setEligiendoFoto(false)}>
          <div className="uf-card w-full max-w-sm rounded-b-none p-6 sm:rounded-b-[1.25rem]" onClick={(e) => e.stopPropagation()}>
            <span className="uf-eyebrow">Objetivo cumplido</span>
            <h2 id="titulo-foto" className="mt-2 font-anton text-3xl uppercase leading-none text-white">
              Tu foto <span className="uf-text-gold">del entreno</span>
            </h2>
            <p className="mt-2 text-sm text-uf-muted">Le pondremos encima el logo, el tiempo y los músculos que has trabajado.</p>
            <div className="mt-5 grid gap-3">
              <button type="button" onClick={() => { setEligiendoFoto(false); camara.current?.click(); }} className="uf-btn uf-btn-primary w-full">
                <Camera className="h-4 w-4" /> Hacer una foto
              </button>
              <button type="button" onClick={() => { setEligiendoFoto(false); galeria.current?.click(); }} className="uf-btn uf-btn-ghost w-full">
                <ImageIcon className="h-4 w-4" /> Elegir de la galería
              </button>
              <button type="button" onClick={() => setEligiendoFoto(false)} className="py-2 text-xs font-bold uppercase tracking-wider text-uf-muted hover:text-white">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cámara (en el móvil la abre directamente) y galería */}
      {[
        [camara, 'environment'],
        [galeria, undefined],
      ].map(([ref, capture]) => (
        <input
          key={capture || 'galeria'}
          ref={ref}
          type="file"
          accept="image/*"
          capture={capture}
          className="hidden"
          onChange={(e) => {
            const archivo = e.target.files?.[0];
            e.target.value = '';
            if (archivo) setFoto(archivo);
          }}
        />
      ))}

      {foto && diaActual && (
        <CompletarEntreno
          foto={foto}
          entrenamiento={{ id: Number(entrenamientoId), nombre: entrenamiento.nombre }}
          dia={diaActual}
          duracionMinutos={minutos}
          volumen={volumenHoy}
          onGuardado={() => guardarSesion({ ...sesion, completado: true })}
          onClose={() => setFoto(null)}
        />
      )}

      {selector && (
        <SelectorMusculos
          dia={diaParaSelector}
          sustituir={selector.modo === 'sustituir' ? { nombre: selector.ejercicio.ejercicio_nombre, grupoMuscular: selector.ejercicio.grupo_muscular } : undefined}
          onConfirmar={aplicarSelector}
          onClose={() => setSelector(null)}
        />
      )}

      {registrando && (
        <RegistroSeries
          ejercicio={{ id: registrando.ejercicio_id, nombre: registrando.ejercicio_nombre, grupoMuscular: registrando.grupo_muscular }}
          plan={{ series: registrando.series, repeticiones: registrando.repeticiones }}
          entrenamientoId={Number(entrenamientoId)}
          onClose={() => setRegistrando(null)}
          onGuardado={() => {
            setRecarga((n) => n + 1);
            // Registrar las series de un ejercicio del día lo da por hecho
            if (registrando.id) marcar(registrando.id, true);
          }}
        />
      )}
    </div>
  );
}

export default DetalleEntrenamiento;
