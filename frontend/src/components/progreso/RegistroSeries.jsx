// ============================================
// REGISTRO DE SERIES - Apunta repeticiones y peso de un ejercicio
// y muestra su evolución (récord, gráfico y últimas sesiones)
// ============================================
import { useEffect, useState } from 'react';
import { Minus, Plus, Save, Trash2, Trophy, X } from 'lucide-react';
import progresoService from '../../services/progresoService';
import { mensajeError } from '../../services/socialService';
import { useToast } from '../../context/ToastContext';
import MuscleMap from '../common/MuscleMap';
import GraficoProgreso from './GraficoProgreso';

const hoy = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
const fechaCorta = (f) => new Date(`${f}T00:00:00`).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
const kg = (v) => (v == null ? '-' : `${Number.isInteger(v) ? v : v.toFixed(1)} kg`);

/**
 * ejercicio: { id, nombre, grupoMuscular } · plan (opcional): { series, repeticiones } de la rutina
 * entrenamientoId (opcional): rutina desde la que se registra
 */
function RegistroSeries({ ejercicio, plan, entrenamientoId, onClose, onGuardado }) {
  const toast = useToast();
  const [historial, setHistorial] = useState(null);
  const [fecha, setFecha] = useState(hoy());
  const [series, setSeries] = useState([]);
  const [guardando, setGuardando] = useState(false);

  // Series iniciales: las de la última sesión, o las que marca la rutina
  const prepararSeries = (h) => {
    const ultima = h?.sesiones?.[0];
    if (ultima) return ultima.series.map((s) => ({ repeticiones: s.repeticiones, peso: s.peso ?? '' }));
    const n = Math.min(Math.max(parseInt(plan?.series, 10) || 3, 1), 10);
    return Array.from({ length: n }, () => ({ repeticiones: parseInt(plan?.repeticiones, 10) || 10, peso: '' }));
  };

  useEffect(() => {
    let vigente = true;
    progresoService
      .historial(ejercicio.id)
      .then((h) => {
        if (!vigente) return;
        setHistorial(h);
        setSeries(prepararSeries(h));
      })
      .catch(() => vigente && setSeries(prepararSeries(null)));
    return () => {
      vigente = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ejercicio.id]);

  useEffect(() => {
    const esc = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', esc);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', esc);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const cambiar = (i, campo, valor) => setSeries((prev) => prev.map((s, j) => (j === i ? { ...s, [campo]: valor } : s)));
  const anadirSerie = () => setSeries((prev) => (prev.length >= 20 ? prev : [...prev, { ...(prev[prev.length - 1] || { repeticiones: 10, peso: '' }) }]));
  const quitarSerie = (i) => setSeries((prev) => (prev.length <= 1 ? prev : prev.filter((_, j) => j !== i)));

  const guardar = async () => {
    const limpias = series.map((s) => ({
      repeticiones: parseInt(s.repeticiones, 10),
      peso: s.peso === '' || s.peso == null ? null : parseFloat(String(s.peso).replace(',', '.')),
    }));
    if (limpias.some((s) => !s.repeticiones || s.repeticiones < 1)) {
      toast.warning('Cada serie necesita al menos 1 repetición');
      return;
    }
    setGuardando(true);
    try {
      const anteriorRecord = historial?.record?.peso ?? 0;
      const h = await progresoService.guardar({ ejercicioId: ejercicio.id, entrenamientoId, fecha, series: limpias });
      setHistorial(h);
      const maxHoy = Math.max(0, ...limpias.map((s) => s.peso || 0));
      if (anteriorRecord > 0 && maxHoy > anteriorRecord) toast.success(`Nuevo récord en ${ejercicio.nombre}: ${kg(maxHoy)}`);
      else toast.success('Series guardadas');
      onGuardado?.(h);
    } catch (e) {
      toast.error(mensajeError(e, 'No se pudieron guardar las series'));
    } finally {
      setGuardando(false);
    }
  };

  const borrarSesion = async (f) => {
    if (!window.confirm(`¿Borrar el registro del ${fechaCorta(f)}?`)) return;
    try {
      setHistorial(await progresoService.borrarSesion(ejercicio.id, f));
      onGuardado?.();
    } catch (e) {
      toast.error(mensajeError(e, 'No se pudo borrar'));
    }
  };

  const sesiones = historial?.sesiones || [];
  const puntos = [...sesiones].reverse().map((s) => ({ etiqueta: fechaCorta(s.fecha), valor: s.pesoMax }));
  const campo = 'w-full min-w-0 rounded-lg border border-uf-line bg-black/50 px-2 py-2 text-center text-white focus:border-uf-gold focus:outline-none';

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 p-0 backdrop-blur-sm sm:items-center sm:p-4" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="titulo-registro">
      <div className="uf-card max-h-[92vh] w-full max-w-2xl overflow-y-auto overflow-x-hidden rounded-b-none sm:rounded-b-[1.25rem]" onClick={(e) => e.stopPropagation()}>
        {/* Cabecera */}
        <div className="sticky top-0 z-10 flex items-center gap-4 border-b border-uf-line bg-uf-card/95 px-5 py-4 backdrop-blur">
          <MuscleMap grupo={ejercicio.grupoMuscular} className="h-14 w-9 shrink-0" />
          <div className="min-w-0 flex-1">
            <span className="uf-eyebrow">Registrar series</span>
            <h2 id="titulo-registro" className="truncate font-anton text-2xl uppercase text-white">{ejercicio.nombre}</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Cerrar" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-uf-line text-gray-400 hover:border-uf-gold hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6 p-5">
          {/* Récords */}
          {historial?.record && (
            <div className="grid grid-cols-3 gap-3">
              <Dato titulo="Récord" valor={kg(historial.record.peso)} detalle={fechaCorta(historial.record.fecha)} destacado />
              <Dato titulo="1RM estimado" valor={kg(historial.mejor1rm)} detalle="mejor marca" />
              <Dato titulo="Sesiones" valor={sesiones.length} detalle="registradas" />
            </div>
          )}

          {/* Formulario */}
          <div className="rounded-2xl border border-uf-line bg-black/30 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="font-anton text-lg uppercase text-white">Hoy he hecho</h3>
              <input type="date" value={fecha} max={hoy()} onChange={(e) => setFecha(e.target.value)} className="min-w-0 max-w-[10.5rem] rounded-lg border border-uf-line bg-black/50 px-3 py-1.5 text-sm text-white focus:border-uf-gold focus:outline-none" aria-label="Fecha" />
            </div>
            <div className="grid grid-cols-[2.5rem_minmax(0,1fr)_minmax(0,1fr)_2rem] items-center gap-2 px-1 pb-1 text-[10px] font-bold uppercase tracking-widest text-uf-muted">
              <span>Serie</span>
              <span className="text-center">Reps</span>
              <span className="text-center">Peso (kg)</span>
              <span />
            </div>
            <ul className="space-y-2">
              {series.map((s, i) => (
                <li key={i} className="grid grid-cols-[2.5rem_minmax(0,1fr)_minmax(0,1fr)_2rem] items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-uf-gold/15 font-anton text-uf-gold">{i + 1}</span>
                  <input type="number" inputMode="numeric" min="1" max="200" value={s.repeticiones} onChange={(e) => cambiar(i, 'repeticiones', e.target.value)} className={campo} aria-label={`Repeticiones serie ${i + 1}`} />
                  <input type="number" inputMode="decimal" min="0" max="1000" step="0.5" value={s.peso} placeholder="Sin peso" onChange={(e) => cambiar(i, 'peso', e.target.value)} className={campo} aria-label={`Peso serie ${i + 1}`} />
                  <button type="button" onClick={() => quitarSerie(i)} disabled={series.length <= 1} aria-label={`Quitar serie ${i + 1}`} className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:text-red-400 disabled:opacity-30">
                    <Minus className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={anadirSerie} className="uf-btn uf-btn-ghost flex-1 !py-2.5 text-xs">
                <Plus className="h-4 w-4" />
                Añadir serie
              </button>
              <button type="button" onClick={guardar} disabled={guardando || series.length === 0} className="uf-btn uf-btn-primary flex-1 !py-2.5 text-xs disabled:opacity-50">
                <Save className="h-4 w-4" />
                {guardando ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>

          {/* Evolución */}
          {sesiones.length > 0 && (
            <div>
              <h3 className="mb-2 font-anton text-lg uppercase text-white">Tu evolución</h3>
              <div className="rounded-2xl border border-uf-line bg-black/30 p-3">
                <GraficoProgreso puntos={puntos} />
              </div>
              <ul className="mt-4 space-y-2">
                {sesiones.slice(0, 8).map((s) => (
                  <li key={s.fecha} className="flex items-center gap-3 rounded-xl border border-uf-line bg-black/30 px-3 py-2.5">
                    <span className="w-16 shrink-0 text-xs font-bold uppercase text-uf-muted">{fechaCorta(s.fecha)}</span>
                    <span className="min-w-0 flex-1 truncate text-sm text-gray-200">
                      {s.series.map((x) => (x.peso != null ? `${x.repeticiones}×${x.peso}` : `${x.repeticiones}`)).join('  ·  ')}
                    </span>
                    {historial?.record?.fecha === s.fecha && <Trophy className="h-4 w-4 shrink-0 text-uf-gold" aria-label="Récord" />}
                    <button type="button" onClick={() => borrarSesion(s.fecha)} aria-label={`Borrar registro del ${fechaCorta(s.fecha)}`} className="shrink-0 text-gray-600 hover:text-red-400">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Dato({ titulo, valor, detalle, destacado }) {
  return (
    <div className={`min-w-0 rounded-xl border p-3 text-center ${destacado ? 'border-uf-gold/50 bg-uf-gold/10' : 'border-uf-line bg-black/30'}`}>
      <div className="text-[10px] font-bold uppercase tracking-widest text-uf-muted">{titulo}</div>
      <div className={`mt-1 font-anton text-2xl ${destacado ? 'text-uf-gold' : 'text-white'}`}>{valor}</div>
      <div className="text-[11px] text-uf-muted">{detalle}</div>
    </div>
  );
}

export default RegistroSeries;
