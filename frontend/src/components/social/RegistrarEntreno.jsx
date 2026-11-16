import { useEffect, useRef, useState } from 'react';
import { Camera, CheckCircle2, Clock, Download, ImageOff, Images, Loader2, Share2, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import socialService, { mensajeError, urlFoto } from '../../services/socialService';
import { descargarBlob, formatoSeries, generarTarjetaPng, nombresGrupos, prepararFoto, statsDe } from '../../utils/imagenEntreno';
import TarjetaEntreno from './TarjetaEntreno';

/**
 * Registrar el entreno de hoy (o ver uno ya registrado) con tarjeta estilo Strava:
 * día de la rutina, ejercicios hechos, foto opcional, compartir en el feed y descargar la imagen.
 *
 * Nuevo:      <RegistrarEntreno entrenamientoId={id} compartirInicial onCerrar onGuardado />
 * Existente:  <RegistrarEntreno registro={itemDeEntrenoHoy} onCerrar onGuardado />
 */
function RegistrarEntreno({ entrenamientoId, registro = null, compartirInicial = true, onCerrar, onGuardado }) {
  const toast = useToast();
  const { user } = useAuth();
  const nombre = user?.nombre || 'Yo';
  const idRutina = registro?.entrenamiento.id ?? entrenamientoId;

  const [plan, setPlan] = useState(null); // { rutina, dias, diaSugerido }
  const [diaId, setDiaId] = useState(null);
  const [marcados, setMarcados] = useState(new Set());
  const [compartir, setCompartir] = useState(registro ? registro.compartido : compartirInicial);
  const [foto, setFoto] = useState(null); // { blob, url } foto nueva aún sin subir
  const [fotoGuardada, setFotoGuardada] = useState(registro?.fotoUrl ? urlFoto(registro.fotoUrl) : null);
  const [guardadoId, setGuardadoId] = useState(registro?.id ?? null);
  const [compartirGuardado, setCompartirGuardado] = useState(registro ? registro.compartido : null);
  const [ocupado, setOcupado] = useState(false);
  const [error, setError] = useState('');
  const [minutos, setMinutos] = useState(registro?.entrenamiento.duracionMinutos ?? '');
  const mapaRef = useRef(null);
  const inputRef = useRef(null);
  const camaraRef = useRef(null);
  const cerrarRef = useRef(null);

  // El móvil puede mandar la imagen directamente a Instagram, TikTok, WhatsApp...
  const puedeCompartir = (() => {
    try {
      return Boolean(navigator.canShare?.({ files: [new File([''], 'entreno.png', { type: 'image/png' })] }));
    } catch {
      return false;
    }
  })();

  // Plan de la rutina (solo al registrar uno nuevo)
  useEffect(() => {
    if (registro) return;
    let vigente = true;
    socialService
      .rutinaParaMarcar(idRutina)
      .then((r) => {
        if (!vigente) return;
        setPlan(r);
        if (r.rutina?.duracionMinutos) setMinutos((m) => (m === '' ? r.rutina.duracionMinutos : m));
        const dia = r.dias.find((d) => d.id === r.diaSugerido) || r.dias[0];
        setDiaId(dia?.id ?? null);
        setMarcados(new Set((dia?.ejercicios || []).map((e) => e.id)));
      })
      .catch(() => vigente && setPlan({ rutina: { nombre: '' }, dias: [], diaSugerido: null }));
    return () => {
      vigente = false;
    };
  }, [idRutina, registro]);

  useEffect(() => {
    cerrarRef.current?.focus();
    const alPulsar = (e) => e.key === 'Escape' && !ocupado && onCerrar();
    document.addEventListener('keydown', alPulsar);
    return () => document.removeEventListener('keydown', alPulsar);
  }, [onCerrar, ocupado]);

  useEffect(() => () => foto && URL.revokeObjectURL(foto.url), [foto]);

  const dia = plan?.dias.find((d) => d.id === diaId) || null;
  const ejercicios = registro ? registro.ejercicios : (dia?.ejercicios || []).filter((e) => marcados.has(e.id));
  const rutinaNombre = registro ? registro.entrenamiento.nombre : plan?.rutina.nombre || '';
  // Tiempo real que ha durado; se propone el de la rutina y se puede cambiar
  const duracion = parseInt(minutos, 10) > 0 ? parseInt(minutos, 10) : null;
  const diaNombre = registro ? registro.diaHecho : dia?.nombre;
  const fotoSrc = foto?.url || fotoGuardada;

  const elegirDia = (id) => {
    const nuevo = plan.dias.find((d) => String(d.id) === String(id));
    setDiaId(nuevo?.id ?? null);
    setMarcados(new Set((nuevo?.ejercicios || []).map((e) => e.id)));
  };

  const alternar = (id) =>
    setMarcados((prev) => {
      const s = new Set(prev);
      if (s.has(id)) s.delete(id);
      else s.add(id);
      return s;
    });

  const elegirFoto = async (e) => {
    const archivo = e.target.files?.[0];
    e.target.value = '';
    if (!archivo) return;
    setError('');
    try {
      const blob = await prepararFoto(archivo);
      if (foto) URL.revokeObjectURL(foto.url);
      setFoto({ blob, url: URL.createObjectURL(blob) });
    } catch (err) {
      setError(err.message);
    }
  };

  const subirFoto = async (id) => {
    if (!foto) return;
    const r = await socialService.subirFotoEntreno(id, foto.blob);
    setFotoGuardada(urlFoto(r.fotoUrl));
    URL.revokeObjectURL(foto.url);
    setFoto(null);
  };

  const guardar = async () => {
    setOcupado(true);
    setError('');
    try {
      let id = guardadoId;
      if (id === null) {
        const r = await socialService.completarEntrenoHoy(Number(idRutina), compartir, {
          diaId: dia?.id ?? null,
          ejercicios: ejercicios.map((x) => x.id),
        });
        id = r.id;
        setGuardadoId(id);
      } else if (compartir !== compartirGuardado) {
        // Sin "ejercicios": el servidor conserva los que ya estaban guardados
        await socialService.completarEntrenoHoy(Number(idRutina), compartir);
      }
      setCompartirGuardado(compartir);
      await subirFoto(id);
      toast.success(compartir ? 'Entreno guardado y compartido en el feed' : 'Entreno guardado');
      onGuardado?.();
    } catch (err) {
      setError(mensajeError(err, 'No se pudo guardar el entreno'));
    } finally {
      setOcupado(false);
    }
  };

  const quitarFoto = async () => {
    if (foto) {
      URL.revokeObjectURL(foto.url);
      setFoto(null);
      return;
    }
    if (!guardadoId || !fotoGuardada) return;
    setOcupado(true);
    try {
      await socialService.borrarFotoEntreno(guardadoId);
      setFotoGuardada(null);
      onGuardado?.();
    } catch (err) {
      setError(mensajeError(err, 'No se pudo quitar la foto'));
    } finally {
      setOcupado(false);
    }
  };

  const descargar = async () => {
    setOcupado(true);
    setError('');
    try {
      const blob = await generarTarjetaPng({
        grupos: nombresGrupos(ejercicios),
        fotoSrc,
        nombre,
        rutina: rutinaNombre,
        dia: diaNombre,
        fecha: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }).replace('.', ''),
        stats: statsDe(ejercicios, duracion),
        ejercicios,
        mapaSvgs: mapaRef.current ? [...mapaRef.current.querySelectorAll('svg')] : [],
      });
      const nombreArchivo = `entreno-${new Date().toISOString().slice(0, 10)}.png`;
      if (puedeCompartir) {
        const archivo = new File([blob], nombreArchivo, { type: 'image/png' });
        try {
          await navigator.share({ files: [archivo], title: rutinaNombre, text: 'Entreno completado con Ultimate Fitness' });
        } catch (e) {
          // Cancelar el menú de compartir no es un error
          if (e?.name !== 'AbortError') descargarBlob(blob, nombreArchivo);
        }
      } else {
        descargarBlob(blob, nombreArchivo);
      }
    } catch {
      setError('No se pudo crear la imagen. Inténtalo de nuevo.');
    } finally {
      setOcupado(false);
    }
  };

  const yaGuardado = guardadoId !== null;
  const hayCambios = !yaGuardado || foto !== null || compartir !== compartirGuardado;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={() => !ocupado && onCerrar()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-registrar-entreno"
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[95vh] w-full max-w-4xl flex-col overflow-hidden rounded-t-3xl border border-uf-line bg-uf-card sm:rounded-3xl"
      >
        <div className="flex items-center justify-between border-b border-uf-line px-5 py-4 sm:px-6">
          <h2 id="titulo-registrar-entreno" className="font-anton text-2xl uppercase text-white">
            {registro ? 'Tu entreno de hoy' : 'Registrar entreno'}
          </h2>
          <button
            ref={cerrarRef}
            type="button"
            onClick={onCerrar}
            disabled={ocupado}
            aria-label="Cerrar"
            className="flex h-10 w-10 items-center justify-center rounded-full text-gray-400 transition hover:bg-white/5 hover:text-white"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="grid flex-1 gap-6 overflow-y-auto p-5 sm:p-6 md:grid-cols-[1fr_minmax(0,22rem)]">
          {/* Vista previa de la tarjeta */}
          <div className="order-2 md:order-1">
            {plan || registro ? (
              <TarjetaEntreno
                ref={mapaRef}
                fotoSrc={fotoSrc}
                nombre={nombre}
                rutina={rutinaNombre}
                dia={diaNombre}
                ejercicios={ejercicios}
                duracionMinutos={duracion}
              />
            ) : (
              <div className="aspect-[4/5] w-full animate-pulse rounded-3xl bg-white/5" />
            )}
          </div>

          {/* Controles */}
          <div className="order-1 space-y-5 md:order-2">
            {!registro && !plan && (
              <div className="space-y-3" aria-busy="true" aria-label="Cargando la rutina">
                <div className="h-12 animate-pulse rounded-xl bg-white/5" />
                <div className="h-40 animate-pulse rounded-xl bg-white/5" />
              </div>
            )}

            {!registro && plan && plan.dias.length > 1 && (
              <label className="block">
                <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-300">Día de la rutina</span>
                <select
                  value={diaId ?? ''}
                  onChange={(e) => elegirDia(e.target.value)}
                  disabled={yaGuardado}
                  className="w-full rounded-xl border border-uf-line bg-black/50 px-4 py-3 text-white focus:border-uf-gold focus:outline-none disabled:opacity-60"
                >
                  {plan.dias.map((d) => (
                    <option key={d.id ?? 'unico'} value={d.id ?? ''}>
                      {d.nombre}
                      {d.descanso ? ' (descanso)' : ''}
                    </option>
                  ))}
                </select>
              </label>
            )}

            {!registro && dia && dia.ejercicios.length > 0 && (
              <fieldset disabled={yaGuardado} className="disabled:opacity-60">
                <legend className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-300">
                  Ejercicios hechos ({marcados.size}/{dia.ejercicios.length})
                </legend>
                <ul className="max-h-56 space-y-1.5 overflow-y-auto pr-1">
                  {dia.ejercicios.map((e) => (
                    <li key={e.id}>
                      <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-uf-line bg-black/30 px-3 py-2.5 text-sm text-gray-200 transition hover:border-uf-gold/50">
                        <input
                          type="checkbox"
                          checked={marcados.has(e.id)}
                          onChange={() => alternar(e.id)}
                          className="h-4 w-4 shrink-0 accent-uf-gold"
                        />
                        <span className="min-w-0 flex-1 truncate">{e.nombre}</span>
                        {formatoSeries(e) ? <span className="shrink-0 text-xs text-uf-muted">{formatoSeries(e)}</span> : null}
                      </label>
                    </li>
                  ))}
                </ul>
              </fieldset>
            )}

            {!registro && plan && plan.dias.length === 0 && (
              <p className="rounded-xl border border-dashed border-uf-line p-4 text-sm text-uf-muted">
                Esta rutina aún no tiene ejercicios. Se registrará como hecha igualmente.
              </p>
            )}

            <div>
              <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-300">Foto</span>
              <input ref={inputRef} type="file" accept="image/*" onChange={elegirFoto} className="hidden" />
              {/* En el móvil abre la cámara directamente */}
              <input ref={camaraRef} type="file" accept="image/*" capture="user" onChange={elegirFoto} className="hidden" />
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => camaraRef.current?.click()} disabled={ocupado} className="uf-btn uf-btn-primary !px-4 !py-2.5">
                  <Camera className="h-4 w-4" aria-hidden="true" />
                  Hacer foto
                </button>
                <button type="button" onClick={() => inputRef.current?.click()} disabled={ocupado} className="uf-btn uf-btn-ghost !px-4 !py-2.5">
                  <Images className="h-4 w-4" aria-hidden="true" />
                  Galería
                </button>
                {fotoSrc && (
                  <button type="button" onClick={quitarFoto} disabled={ocupado} className="uf-btn uf-btn-ghost !px-4 !py-2.5">
                    <ImageOff className="h-4 w-4" aria-hidden="true" />
                    Quitar
                  </button>
                )}
              </div>
              <p className="mt-1.5 text-xs text-uf-muted">Quitamos la ubicación y los datos del móvil antes de guardarla.</p>
            </div>

            <label className="flex items-center justify-between gap-3 rounded-xl border border-uf-line bg-black/30 px-4 py-3 text-sm text-gray-200">
              <span className="inline-flex items-center gap-2">
                <Clock className="h-4 w-4 text-uf-gold" aria-hidden="true" />
                Tiempo de entreno
              </span>
              <span className="inline-flex items-center gap-2">
                <input
                  type="number"
                  inputMode="numeric"
                  min="1"
                  max="600"
                  value={minutos}
                  onChange={(e) => setMinutos(e.target.value)}
                  placeholder="60"
                  className="w-20 rounded-lg border border-uf-line bg-black/50 px-2 py-1.5 text-center text-white focus:border-uf-gold focus:outline-none"
                  aria-label="Minutos de entreno"
                />
                <span className="text-uf-muted">min</span>
              </span>
            </label>

            <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-uf-line bg-black/30 px-4 py-3 text-sm text-gray-200">
              <span className="inline-flex items-center gap-2">
                <Share2 className="h-4 w-4 text-uf-gold" aria-hidden="true" />
                Compartir en el feed
              </span>
              <input
                type="checkbox"
                role="switch"
                checked={compartir}
                onChange={(e) => setCompartir(e.target.checked)}
                className="h-5 w-9 cursor-pointer accent-uf-gold"
              />
            </label>

            {error && (
              <p role="alert" className="text-sm text-red-300">
                {error}
              </p>
            )}

            <div className="space-y-2">
              {hayCambios && (
                <button type="button" onClick={guardar} disabled={ocupado || (!plan && !registro)} className="uf-btn uf-btn-primary w-full disabled:opacity-50">
                  {ocupado ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <CheckCircle2 className="h-4 w-4" aria-hidden="true" />}
                  {yaGuardado ? 'Guardar cambios' : 'Guardar entreno'}
                </button>
              )}
              <button type="button" onClick={descargar} disabled={ocupado || (!plan && !registro)} className="uf-btn uf-btn-ghost w-full disabled:opacity-50">
                {puedeCompartir ? <Share2 className="h-4 w-4" aria-hidden="true" /> : <Download className="h-4 w-4" aria-hidden="true" />}
                {puedeCompartir ? 'Compartir imagen en redes' : 'Descargar imagen para redes'}
              </button>
              {yaGuardado && !hayCambios && (
                <button type="button" onClick={onCerrar} className="uf-btn uf-btn-ghost w-full">
                  Hecho
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegistrarEntreno;
