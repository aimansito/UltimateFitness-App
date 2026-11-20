// ============================================
// SELECTOR DE EJERCICIOS CON LA FIGURA
// Pulsas los músculos en el cuerpo (o en los chips) para elegir grupos; salen sus ejercicios
// y los marcas o desmarcas. Al confirmar, el día queda con exactamente lo marcado.
// ============================================
import { useEffect, useMemo, useState } from 'react';
import { Check, Plus, Search, X } from 'lucide-react';
import MuscleMap, { normalizarGrupo } from '../common/MuscleMap';
import { useBiblioteca, GRUPOS_PANEL, ALIAS, nombreGrupo } from './biblioteca';

const sinAcentos = (t) => (t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const GRUPOS_FIGURA = GRUPOS_PANEL.filter((g) => !['fullbody', 'cardio'].includes(g.id));

/**
 * dia: { nombre, ejercicios: [{ ejercicio_id, nombre, grupoMuscular }] }
 * onConfirmar(seleccion): lista de ejercicios del catálogo marcados, en orden de selección
 * sustituir (opcional): { nombre, grupoMuscular } -> modo de elegir uno solo para cambiarlo por ese
 */
function SelectorMusculos({ dia, onConfirmar, onClose, sustituir }) {
  const { ejercicios, cargando, error } = useBiblioteca();
  const [grupos, setGrupos] = useState(() =>
    sustituir
      ? [normalizarGrupo(sustituir.grupoMuscular)].filter(Boolean)
      : [...new Set(dia.ejercicios.map((e) => normalizarGrupo(e.grupoMuscular)).filter(Boolean))].slice(0, 2)
  );
  const [marcados, setMarcados] = useState(() =>
    sustituir ? [] : dia.ejercicios.map((e) => ({ id: e.ejercicio_id, nombre: e.nombre, grupoMuscular: e.grupoMuscular }))
  );
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    const esc = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', esc);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', esc);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const alternarGrupo = (g) => setGrupos((prev) => (prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]));
  const marcado = (id) => marcados.some((m) => m.id === id);
  const alternarEjercicio = (ej) => {
    if (sustituir) {
      onConfirmar([ej]);
      return;
    }
    setMarcados((prev) => (prev.some((m) => m.id === ej.id) ? prev.filter((m) => m.id !== ej.id) : [...prev, ej]));
  };

  const visibles = useMemo(() => {
    const q = sinAcentos(busqueda.trim());
    const aceptados = grupos.flatMap((g) => ALIAS[g] || [g]);
    return ejercicios
      .filter((ej) => {
        if (q) return sinAcentos(ej.nombre).includes(q);
        return aceptados.includes(normalizarGrupo(ej.grupoMuscular));
      })
      .sort((a, b) => nombreGrupo(a.grupoMuscular).localeCompare(nombreGrupo(b.grupoMuscular), 'es') || a.nombre.localeCompare(b.nombre, 'es'));
  }, [ejercicios, grupos, busqueda]);

  // Agrupados por grupo muscular para que la lista se lea como en la figura
  const porGrupo = useMemo(() => {
    const mapa = new Map();
    for (const ej of visibles) {
      const g = nombreGrupo(ej.grupoMuscular);
      if (!mapa.has(g)) mapa.set(g, []);
      mapa.get(g).push(ej);
    }
    return [...mapa.entries()];
  }, [visibles]);

  const iniciales = dia.ejercicios.map((e) => e.ejercicio_id);
  const nuevos = marcados.filter((m) => !iniciales.includes(m.id)).length;
  const quitados = iniciales.filter((id) => !marcado(id)).length;
  const hayCambios = nuevos > 0 || quitados > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/85 backdrop-blur-sm sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-labelledby="titulo-selector">
      <div className="uf-card flex max-h-[100dvh] w-full max-w-5xl flex-col overflow-hidden rounded-b-none sm:max-h-[92vh] sm:rounded-b-[1.25rem]">
        {/* Cabecera */}
        <header className="flex items-start justify-between gap-4 border-b border-uf-line p-5 md:px-7">
          <div className="min-w-0">
            <span className="uf-eyebrow">{sustituir ? 'Sustituir ejercicio' : 'Añadir ejercicios'}</span>
            <h2 id="titulo-selector" className="mt-2 font-anton text-3xl uppercase leading-none text-white">
              {sustituir ? (
                <>
                  Cambiar <span className="uf-text-gold">{sustituir.nombre}</span>
                </>
              ) : (
                <>
                  {dia.nombre}
                  {dia.concepto && <span className="uf-text-gold"> · {dia.concepto}</span>}
                </>
              )}
            </h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Cerrar" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-uf-line text-gray-400 hover:border-uf-gold hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="grid min-h-0 flex-1 overflow-y-auto md:grid-cols-[minmax(0,380px)_minmax(0,1fr)] md:overflow-hidden">
          {/* Figura */}
          <div className="border-b border-uf-line p-5 md:overflow-y-auto md:border-b-0 md:border-r md:px-7">
            <p className="text-center text-xs font-bold uppercase tracking-widest text-uf-muted">Toca los músculos que quieres entrenar</p>
            <MuscleMap grupos={grupos} vista="ambas" onGrupo={alternarGrupo} className="mx-auto mt-3 h-[260px] sm:h-[340px]" />
            <div className="mt-4 flex flex-wrap justify-center gap-1.5" role="group" aria-label="Grupos musculares">
              {GRUPOS_FIGURA.map((g) => {
                const activo = grupos.includes(g.id);
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => alternarGrupo(g.id)}
                    aria-pressed={activo}
                    className={`rounded-full border px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider transition ${
                      activo ? 'border-uf-gold bg-uf-gold text-black' : 'border-uf-line bg-white/[0.03] text-gray-400 hover:border-uf-gold/60 hover:text-white'
                    }`}
                  >
                    {g.nombre}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Ejercicios */}
          <div className="flex min-h-0 flex-col p-5 md:px-7">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" aria-hidden="true" />
              <input
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="O busca un ejercicio por nombre"
                className="w-full rounded-xl border border-uf-line bg-black/50 py-3 pl-10 pr-4 text-sm text-white placeholder-gray-600 focus:border-uf-gold focus:outline-none"
              />
            </label>

            <div className="mt-4 min-h-[16rem] flex-1 overflow-y-auto pr-1">
              {cargando && (
                <div className="py-14 text-center" role="status">
                  <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-b-4 border-t-4 border-uf-gold" />
                  <p className="text-sm text-uf-muted">Cargando ejercicios...</p>
                </div>
              )}
              {error && <p className="py-10 text-center text-sm text-red-300">No se pudieron cargar los ejercicios. Recarga la página.</p>}
              {!cargando && !error && !grupos.length && !busqueda.trim() && (
                <div className="flex h-full flex-col items-center justify-center py-14 text-center">
                  <span className="font-anton text-6xl text-uf-gold/30">01</span>
                  <p className="mt-3 max-w-xs text-sm text-uf-muted">Pulsa un músculo en la figura y aquí aparecerán sus ejercicios.</p>
                </div>
              )}
              {!cargando && !error && (grupos.length > 0 || busqueda.trim()) && visibles.length === 0 && (
                <p className="py-14 text-center text-sm text-uf-muted">No hay ejercicios para esta selección.</p>
              )}
              {porGrupo.map(([nombre, lista]) => (
                <section key={nombre} className="mb-5">
                  <h3 className="mb-2 flex items-center gap-3 font-audiowide text-[11px] uppercase tracking-[0.3em] text-uf-gold">
                    {nombre}
                    <span className="h-px flex-1 bg-uf-line" />
                    <span className="text-uf-muted">{lista.length}</span>
                  </h3>
                  <ul className="grid gap-2 sm:grid-cols-2">
                    {lista.map((ej) => {
                      const activo = marcado(ej.id);
                      const orden = marcados.findIndex((m) => m.id === ej.id) + 1;
                      return (
                        <li key={ej.id}>
                          <button
                            type="button"
                            onClick={() => alternarEjercicio(ej)}
                            aria-pressed={activo}
                            className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition ${
                              activo ? 'border-uf-gold bg-uf-gold/10 shadow-[0_0_24px_rgba(204,148,26,0.18)]' : 'border-uf-line bg-black/30 hover:border-uf-gold/50'
                            }`}
                          >
                            <span
                              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 font-anton text-base transition ${
                                activo ? 'border-uf-gold bg-uf-gold text-black' : 'border-uf-line text-gray-500'
                              }`}
                              aria-hidden="true"
                            >
                              {activo ? String(orden).padStart(2, '0') : <Plus className="h-4 w-4" />}
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block text-sm font-bold leading-snug text-white">{ej.nombre}</span>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-uf-muted">
                                {ej.nivelDificultad || 'intermedio'}
                                {ej.esMio && ' · Mío'}
                              </span>
                            </span>
                            {activo && <Check className="h-4 w-4 shrink-0 text-uf-gold" aria-hidden="true" />}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              ))}
            </div>
          </div>
        </div>

        {/* Pie (al sustituir, elegir un ejercicio ya confirma) */}
        {!sustituir && <footer className="flex flex-col items-center justify-between gap-3 border-t border-uf-line bg-black/40 p-4 sm:flex-row md:px-7">
          <p className="text-sm text-uf-muted">
            <strong className="font-anton text-xl text-white">{marcados.length}</strong> ejercicios en {dia.nombre}
            {hayCambios && (
              <span className="ml-2 text-uf-gold">
                {nuevos > 0 && `+${nuevos}`}
                {nuevos > 0 && quitados > 0 && ' · '}
                {quitados > 0 && `-${quitados}`}
              </span>
            )}
          </p>
          <div className="flex w-full gap-2 sm:w-auto">
            <button type="button" onClick={onClose} className="uf-btn uf-btn-ghost flex-1 sm:flex-none">Cancelar</button>
            <button type="button" onClick={() => onConfirmar(marcados)} className="uf-btn uf-btn-primary flex-1 sm:flex-none">
              <Check className="h-4 w-4" />
              Listo
            </button>
          </div>
        </footer>}
      </div>
    </div>
  );
}

export default SelectorMusculos;
