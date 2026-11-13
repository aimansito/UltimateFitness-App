import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Camera, CheckCircle2, Dumbbell, Share2, Undo2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import socialService, { mensajeError, urlFoto } from '../../services/socialService';
import RegistrarEntreno from './RegistrarEntreno';

// "Entreno de hoy": marcar una rutina como hecha y decidir si se comparte en el feed
function EntrenoHoy({ onCompartido }) {
  const toast = useToast();
  const [hoy, setHoy] = useState([]);
  const [rutinas, setRutinas] = useState([]);
  const [elegida, setElegida] = useState('');
  const [compartir, setCompartir] = useState(true);
  const [cargando, setCargando] = useState(true);
  const [ocupado, setOcupado] = useState(false);
  // Modal: { entrenamientoId } para registrar uno nuevo, { registro } para ver/editar uno hecho
  const [modal, setModal] = useState(null);

  const cargar = useCallback(async () => {
    try {
      const r = await socialService.entrenoHoy();
      setHoy(r.hoy);
      setRutinas(r.rutinas);
      const pendiente = r.hoy.find((h) => !h.completadoHoy);
      setElegida((actual) => actual || String(pendiente?.entrenamiento.id ?? r.rutinas[0]?.id ?? ''));
    } catch {
      // El panel queda vacío; el resto del dashboard no depende de él
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const completados = hoy.filter((h) => h.completadoHoy);

  const completar = async (entrenamientoId, quiereCompartir) => {
    if (ocupado) return;
    setOcupado(true);
    try {
      await socialService.completarEntrenoHoy(Number(entrenamientoId), quiereCompartir);
      toast.success(quiereCompartir ? 'Entreno completado y compartido en el feed' : 'Entreno completado');
      await cargar();
      onCompartido?.();
    } catch (error) {
      toast.error(mensajeError(error, 'No se pudo registrar el entreno'));
    } finally {
      setOcupado(false);
    }
  };

  const deshacer = async (calendarioId) => {
    if (ocupado) return;
    setOcupado(true);
    try {
      await socialService.deshacerEntrenoHoy(calendarioId);
      await cargar();
      onCompartido?.();
    } catch (error) {
      toast.error(mensajeError(error, 'No se pudo deshacer'));
    } finally {
      setOcupado(false);
    }
  };

  // Todas las opciones: las de hoy primero, sin repetir
  const opciones = [
    ...hoy.filter((h) => !h.completadoHoy).map((h) => ({ id: h.entrenamiento.id, nombre: `${h.entrenamiento.nombre} · plan de hoy` })),
    ...rutinas,
  ].filter((o, i, lista) => lista.findIndex((x) => x.id === o.id) === i && !completados.some((c) => c.entrenamiento.id === o.id));

  return (
    <section className="uf-card p-6" aria-labelledby="titulo-entreno-hoy">
      <span className="uf-eyebrow">Hoy</span>
      <h2 id="titulo-entreno-hoy" className="mt-2 font-anton text-2xl uppercase text-white">
        Entreno del día
      </h2>

      {cargando && <div className="mt-5 h-24 animate-pulse rounded-2xl bg-white/5" />}

      {!cargando && completados.length > 0 && (
        <ul className="mt-5 space-y-3">
          {completados.map((h) => (
            <li key={h.id} className="rounded-2xl border border-uf-gold/30 bg-uf-gold/5 p-4">
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  onClick={() => setModal({ registro: h })}
                  aria-label={`Ver la tarjeta de ${h.entrenamiento.nombre}`}
                  className="relative h-14 w-12 shrink-0 overflow-hidden rounded-lg border border-uf-gold/40 bg-black/40 transition hover:border-uf-gold"
                >
                  {h.fotoUrl ? (
                    <img src={urlFoto(h.fotoUrl)} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <CheckCircle2 className="m-auto h-5 w-5 text-uf-gold" aria-hidden="true" />
                  )}
                </button>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-white">{h.entrenamiento.nombre}</p>
                  <p className="text-xs text-uf-muted">
                    Completado hoy{h.compartido ? ' · visible en el feed' : ' · no compartido'}
                    {h.ejercicios?.length ? ` · ${h.ejercicios.length} ejercicios` : ''}
                  </p>
                  <button
                    type="button"
                    onClick={() => setModal({ registro: h })}
                    className="mt-1 inline-flex items-center gap-1.5 text-xs font-semibold text-uf-gold hover:underline"
                  >
                    <Camera className="h-3.5 w-3.5" aria-hidden="true" />
                    {h.fotoUrl ? 'Ver tarjeta' : 'Añadir foto y ver tarjeta'}
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => deshacer(h.id)}
                  disabled={ocupado}
                  aria-label={`Deshacer ${h.entrenamiento.nombre}`}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-400 transition hover:bg-white/5 hover:text-white disabled:opacity-50"
                >
                  <Undo2 className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
              <label className="mt-3 flex cursor-pointer items-center justify-between gap-3 border-t border-uf-gold/20 pt-3 text-sm text-gray-200">
                <span className="inline-flex items-center gap-2">
                  <Share2 className="h-4 w-4 text-uf-gold" aria-hidden="true" />
                  Compartir en el feed
                </span>
                <Interruptor
                  activo={h.compartido}
                  deshabilitado={ocupado}
                  onCambio={(valor) => completar(h.entrenamiento.id, valor)}
                />
              </label>
            </li>
          ))}
        </ul>
      )}

      {!cargando && opciones.length > 0 && (
        <div className="mt-5 space-y-3">
          <label htmlFor="rutina-hoy" className="block text-xs font-bold uppercase tracking-wider text-gray-300">
            {completados.length > 0 ? 'Añadir otro entreno' : '¿Qué has entrenado hoy?'}
          </label>
          <select
            id="rutina-hoy"
            value={elegida}
            onChange={(e) => setElegida(e.target.value)}
            className="w-full rounded-xl border border-uf-line bg-black/50 px-4 py-3 text-white transition focus:border-uf-gold focus:outline-none"
          >
            {opciones.map((o) => (
              <option key={o.id} value={o.id}>
                {o.nombre}
              </option>
            ))}
          </select>
          <label className="flex cursor-pointer items-center justify-between gap-3 text-sm text-gray-200">
            <span className="inline-flex items-center gap-2">
              <Share2 className="h-4 w-4 text-uf-gold" aria-hidden="true" />
              Hacer público en el feed
            </span>
            <Interruptor activo={compartir} onCambio={setCompartir} />
          </label>
          <button
            type="button"
            onClick={() =>
              setModal({ entrenamientoId: opciones.some((o) => String(o.id) === elegida) ? elegida : opciones[0].id })
            }
            disabled={ocupado}
            className="uf-btn uf-btn-primary w-full disabled:opacity-50"
          >
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            Marcar como completado
          </button>
          <p className="text-center text-xs text-uf-muted">Marca los ejercicios que has hecho y añade una foto si quieres.</p>
        </div>
      )}

      {!cargando && opciones.length === 0 && completados.length === 0 && (
        <div className="mt-5 rounded-2xl border border-dashed border-uf-line p-6 text-center">
          <Dumbbell className="mx-auto h-8 w-8 text-uf-muted" aria-hidden="true" />
          <p className="mt-3 text-sm text-uf-muted">
            Crea tu primera rutina para registrar y compartir tu entreno diario.
          </p>
          <Link to="/crear-entrenamiento" className="uf-btn uf-btn-ghost mt-4 !py-2 !text-xs">
            Crear rutina
          </Link>
        </div>
      )}
      {modal && (
        <RegistrarEntreno
          entrenamientoId={modal.entrenamientoId}
          registro={modal.registro || null}
          compartirInicial={compartir}
          onCerrar={() => setModal(null)}
          onGuardado={async () => {
            await cargar();
            onCompartido?.();
          }}
        />
      )}
    </section>
  );
}

function Interruptor({ activo, onCambio, deshabilitado = false }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={activo}
      disabled={deshabilitado}
      onClick={(e) => {
        e.preventDefault();
        onCambio(!activo);
      }}
      className={`relative h-7 w-12 shrink-0 rounded-full transition-colors disabled:opacity-50 ${activo ? 'bg-uf-gold' : 'bg-gray-700'}`}
    >
      <span
        className={`absolute left-0.5 top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${activo ? 'translate-x-5' : ''}`}
      />
    </button>
  );
}

export default EntrenoHoy;
