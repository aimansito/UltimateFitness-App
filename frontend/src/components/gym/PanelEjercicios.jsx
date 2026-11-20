// ============================================
// PANEL DE EJERCICIOS - Biblioteca para montar una rutina
// Figura muscular arriba: al pulsar un grupo se cargan sus ejercicios y cada uno
// se añade al día elegido con un clic. Incluye favoritos y ejercicios propios.
// ============================================
import { useEffect, useMemo, useState } from 'react';
import { Check, Heart, Plus, Search, Trash2, X } from 'lucide-react';
import api from '../../services/api';
import socialService, { mensajeError } from '../../services/socialService';
import { useToast } from '../../context/ToastContext';
import MuscleMap, { normalizarGrupo } from '../common/MuscleMap';
import { ALIAS, GRUPOS_PANEL, guardarCache, nombreGrupo, useBiblioteca } from './biblioteca';

const NIVELES = [
  { id: '', nombre: 'Todos los niveles' },
  { id: 'principiante', nombre: 'Principiante' },
  { id: 'intermedio', nombre: 'Intermedio' },
  { id: 'avanzado', nombre: 'Avanzado' },
];

const POR_PAGINA = 40;
const FORMULARIO_VACIO = { nombre: '', grupoMuscular: 'pecho', nivelDificultad: 'intermedio', descripcion: '' };

const sinAcentos = (t) => (t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

function PanelEjercicios({ destino, destinos, onCambiarDestino, onAnadir, idsAnadidos = [] }) {
  const toast = useToast();
  const biblioteca = useBiblioteca();
  const { cargando, error } = biblioteca;
  const [ejercicios, setEjercicios] = useState(biblioteca.ejercicios);
  const [grupo, setGrupo] = useState('todos');
  const [nivel, setNivel] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [pestana, setPestana] = useState('catalogo');
  const [limite, setLimite] = useState(POR_PAGINA);
  const [creando, setCreando] = useState(false);
  const [formulario, setFormulario] = useState(FORMULARIO_VACIO);
  const [guardando, setGuardando] = useState(false);

  // Cuando termina la descarga del catálogo
  useEffect(() => setEjercicios(biblioteca.ejercicios), [biblioteca.ejercicios]);

  const actualizar = (lista) => {
    guardarCache(lista);
    setEjercicios(lista);
  };

  const visibles = useMemo(() => {
    const q = sinAcentos(busqueda.trim());
    return ejercicios
      .filter((ej) => {
        if (pestana === 'favoritos' && !ej.guardado) return false;
        if (pestana === 'mios' && !ej.esMio) return false;
        if (grupo !== 'todos' && !(ALIAS[grupo] || [grupo]).includes(normalizarGrupo(ej.grupoMuscular))) return false;
        if (nivel && ej.nivelDificultad?.toLowerCase() !== nivel) return false;
        if (q && !sinAcentos(ej.nombre).includes(q) && !sinAcentos(ej.descripcion).includes(q)) return false;
        return true;
      })
      .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
  }, [ejercicios, pestana, grupo, nivel, busqueda]);

  useEffect(() => setLimite(POR_PAGINA), [pestana, grupo, nivel, busqueda]);

  const nFavoritos = ejercicios.filter((e) => e.guardado).length;
  const nMios = ejercicios.filter((e) => e.esMio).length;

  const toggleFavorito = async (ej) => {
    const nuevo = !ej.guardado;
    actualizar(ejercicios.map((e) => (e.id === ej.id ? { ...e, guardado: nuevo } : e)));
    try {
      if (nuevo) await socialService.guardar('ejercicio', ej.id);
      else await socialService.quitarGuardado('ejercicio', ej.id);
    } catch (e) {
      actualizar(ejercicios.map((x) => (x.id === ej.id ? { ...x, guardado: !nuevo } : x)));
      toast.error(mensajeError(e, 'No se pudo actualizar el favorito'));
    }
  };

  const crear = async () => {
    if (formulario.nombre.trim().length < 3) {
      toast.warning('Pon un nombre de al menos 3 letras');
      return;
    }
    setGuardando(true);
    try {
      const r = await api.post('/custom/ejercicios', formulario);
      actualizar([r.data.ejercicio, ...ejercicios]);
      setFormulario(FORMULARIO_VACIO);
      setCreando(false);
      setPestana('mios');
      setGrupo('todos');
      toast.success(`Ejercicio "${r.data.ejercicio.nombre}" creado. Solo tú lo ves.`);
    } catch (e) {
      toast.error(mensajeError(e, 'No se pudo crear el ejercicio'));
    } finally {
      setGuardando(false);
    }
  };

  const borrar = async (ej) => {
    if (!window.confirm(`¿Borrar "${ej.nombre}"?`)) return;
    try {
      await api.delete(`/custom/ejercicios/${ej.id}`);
      actualizar(ejercicios.filter((e) => e.id !== ej.id));
    } catch (e) {
      toast.error(mensajeError(e, 'No se pudo borrar'));
    }
  };

  const campo = 'w-full rounded-xl border border-uf-line bg-black/50 px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:border-uf-gold focus:outline-none';
  const pestanaClase = (activa) =>
    `flex-1 rounded-full px-3 py-2 text-[11px] font-bold uppercase tracking-wider transition ${activa ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`;

  return (
    <section className="uf-card flex flex-col overflow-hidden" aria-label="Biblioteca de ejercicios">
      {/* Cabecera: destino */}
      <header className="border-b border-uf-line p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <span className="uf-eyebrow">Biblioteca de ejercicios</span>
            <h2 className="mt-2 font-anton text-2xl uppercase text-white">
              Añadir a <span className="uf-text-gold">{destino?.nombre || 'tu rutina'}</span>
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setCreando(!creando)}
            className="uf-btn uf-btn-ghost shrink-0 !px-4 !py-2.5 text-xs"
            aria-expanded={creando}
          >
            {creando ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            Crear ejercicio
          </button>
        </div>
        {destinos && (
          <label className="mt-4 block">
            <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-uf-muted">Día al que se añaden</span>
            <select value={destino?.diaSemana || ''} onChange={(e) => onCambiarDestino(Number(e.target.value))} className={campo}>
              {destinos.map((d) => (
                <option key={d.diaSemana} value={d.diaSemana}>
                  {d.nombre}
                  {d.concepto ? ` · ${d.concepto}` : ''}
                  {d.esDescanso ? ' (descanso)' : ''}
                </option>
              ))}
            </select>
          </label>
        )}
      </header>

      {/* Crear ejercicio propio */}
      {creando && (
        <div className="space-y-3 border-b border-uf-line bg-uf-gold/5 p-5">
          <p className="text-xs text-uf-muted">Tu ejercicio solo lo verás tú. Aparecerá en la pestaña Míos.</p>
          <input
            value={formulario.nombre}
            onChange={(e) => setFormulario({ ...formulario, nombre: e.target.value })}
            placeholder="Nombre, p. ej. Press inclinado con mancuernas"
            maxLength={150}
            className={campo}
          />
          <div className="grid grid-cols-2 gap-3">
            <select value={formulario.grupoMuscular} onChange={(e) => setFormulario({ ...formulario, grupoMuscular: e.target.value })} className={campo}>
              {GRUPOS_PANEL.map((g) => (
                <option key={g.id} value={g.id}>{g.nombre}</option>
              ))}
            </select>
            <select value={formulario.nivelDificultad} onChange={(e) => setFormulario({ ...formulario, nivelDificultad: e.target.value })} className={campo}>
              {NIVELES.slice(1).map((n) => (
                <option key={n.id} value={n.id}>{n.nombre}</option>
              ))}
            </select>
          </div>
          <textarea
            value={formulario.descripcion}
            onChange={(e) => setFormulario({ ...formulario, descripcion: e.target.value })}
            placeholder="Técnica o notas (opcional)"
            rows={2}
            maxLength={1000}
            className={campo}
          />
          <button type="button" onClick={crear} disabled={guardando} className="uf-btn uf-btn-primary w-full !py-2.5 text-sm disabled:opacity-50">
            {guardando ? 'Guardando...' : 'Guardar ejercicio'}
          </button>
        </div>
      )}

      <div className="p-5">
        {/* Figura y grupos */}
        <MuscleMap grupo={grupo === 'todos' ? 'fullbody' : grupo} vista="ambas" className="mx-auto h-40 sm:h-48" />
        <div className="mt-4 flex flex-wrap justify-center gap-1.5" role="group" aria-label="Grupo muscular">
          {[{ id: 'todos', nombre: 'Todos' }, ...GRUPOS_PANEL].map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => setGrupo(g.id)}
              aria-pressed={grupo === g.id}
              className={`rounded-full border px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider transition ${
                grupo === g.id
                  ? 'border-uf-gold bg-uf-gold text-black'
                  : 'border-uf-line bg-white/[0.03] text-gray-400 hover:border-uf-gold/60 hover:text-white'
              }`}
            >
              {g.nombre}
            </button>
          ))}
        </div>

        {/* Pestañas y filtros */}
        <div className="mt-5 flex rounded-full border border-uf-line bg-black/40 p-1" role="tablist">
          <button type="button" role="tab" aria-selected={pestana === 'catalogo'} onClick={() => setPestana('catalogo')} className={pestanaClase(pestana === 'catalogo')}>
            Catálogo
          </button>
          <button type="button" role="tab" aria-selected={pestana === 'favoritos'} onClick={() => setPestana('favoritos')} className={pestanaClase(pestana === 'favoritos')}>
            Favoritos {nFavoritos > 0 && `(${nFavoritos})`}
          </button>
          <button type="button" role="tab" aria-selected={pestana === 'mios'} onClick={() => setPestana('mios')} className={pestanaClase(pestana === 'mios')}>
            Míos {nMios > 0 && `(${nMios})`}
          </button>
        </div>
        <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" aria-hidden="true" />
            <input value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Buscar ejercicio" className={`${campo} !pl-9`} aria-label="Buscar ejercicio" />
          </label>
          <select value={nivel} onChange={(e) => setNivel(e.target.value)} className={`${campo} w-auto`} aria-label="Nivel">
            {NIVELES.map((n) => (
              <option key={n.id} value={n.id}>{n.nombre}</option>
            ))}
          </select>
        </div>

        {/* Lista */}
        <div className="mt-4 max-h-[26rem] overflow-y-auto pr-1">
          {cargando && (
            <div className="py-10 text-center" role="status">
              <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-b-4 border-t-4 border-uf-gold" />
              <p className="text-sm text-uf-muted">Cargando ejercicios...</p>
            </div>
          )}
          {error && <p className="py-8 text-center text-sm text-red-300">No se pudieron cargar los ejercicios. Recarga la página.</p>}
          {!cargando && !error && visibles.length === 0 && (
            <div className="py-10 text-center text-sm text-uf-muted">
              {pestana === 'favoritos' && 'Aún no tienes favoritos. Pulsa el corazón de un ejercicio para guardarlo aquí.'}
              {pestana === 'mios' && 'Aún no has creado ejercicios propios.'}
              {pestana === 'catalogo' && 'No hay ejercicios con estos filtros.'}
            </div>
          )}
          {!cargando && !error && visibles.length > 0 && (
            <ul className="space-y-2">
              {visibles.slice(0, limite).map((ej) => {
                const anadido = idsAnadidos.includes(ej.id);
                return (
                  <li
                    key={ej.id}
                    className={`flex items-center gap-3 rounded-xl border p-2.5 transition ${
                      anadido ? 'border-uf-gold/50 bg-uf-gold/5' : 'border-uf-line bg-black/30 hover:border-uf-gold/50'
                    }`}
                  >
                    <MuscleMap grupo={ej.grupoMuscular} className="h-14 w-9 shrink-0" />
                    <button type="button" onClick={() => onAnadir(ej)} className="min-w-0 flex-1 text-left">
                      <span className="block truncate text-sm font-bold text-white">{ej.nombre}</span>
                      <span className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-uf-muted">
                        <span className="text-uf-gold">{nombreGrupo(ej.grupoMuscular)}</span>
                        <span aria-hidden="true">·</span>
                        <span>{ej.nivelDificultad || 'intermedio'}</span>
                        {ej.esMio && <span className="rounded bg-white/10 px-1.5 py-0.5 text-white">Mío</span>}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleFavorito(ej)}
                      aria-pressed={ej.guardado}
                      aria-label={ej.guardado ? 'Quitar de favoritos' : 'Guardar en favoritos'}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-500 transition hover:text-uf-gold"
                    >
                      <Heart className={`h-4.5 w-4.5 ${ej.guardado ? 'fill-uf-gold text-uf-gold' : ''}`} />
                    </button>
                    {ej.esMio && (
                      <button type="button" onClick={() => borrar(ej)} aria-label="Borrar ejercicio" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-500 transition hover:text-red-400">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => onAnadir(ej)}
                      aria-label={`Añadir ${ej.nombre}`}
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition ${
                        anadido ? 'bg-uf-gold/20 text-uf-gold' : 'bg-uf-gold text-black hover:bg-yellow-400'
                      }`}
                    >
                      {anadido ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
          {visibles.length > limite && (
            <button type="button" onClick={() => setLimite(limite + POR_PAGINA)} className="uf-btn uf-btn-ghost mt-3 w-full !py-2 text-xs">
              Ver más ({visibles.length - limite} restantes)
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

export default PanelEjercicios;
