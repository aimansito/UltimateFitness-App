import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bookmark, BookmarkCheck, Check, Clock, Copy, Dumbbell, Eye, EyeOff, Flame, Salad, UtensilsCrossed } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import socialService, { mensajeError } from '../../services/socialService';

const TIPOS = {
  entrenamiento: { Icono: Dumbbell, etiqueta: 'Rutina', copiar: 'Copiar a mis rutinas', copiado: 'Rutina copiada a tus entrenamientos' },
  dieta: { Icono: Salad, etiqueta: 'Dieta', copiar: 'Copiar a mis dietas', copiado: 'Dieta copiada a tus dietas' },
  plato: { Icono: UtensilsCrossed, etiqueta: 'Plato' },
};

const enlaceDetalle = (item) => {
  if (item.itemTipo === 'dieta') return `/dieta/${item.id}`;
  if (item.itemTipo === 'plato') return `/plato/${item.id}`;
  return null;
};

const humanizar = (texto) => (texto ? String(texto).replace(/_/g, ' ') : '');

// Tarjeta de una rutina, dieta o plato dentro de un perfil.
// - Contenido ajeno: Guardar (favorito) y Copiar a mi biblioteca.
// - Contenido propio (gestionable): interruptor Público / Oculto.
function TarjetaItemSocial({ item, gestionable = false, onCambio }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [guardado, setGuardado] = useState(!!item.guardado);
  const [publico, setPublico] = useState(!!item.publico);
  const [copiado, setCopiado] = useState(false);
  const [ocupado, setOcupado] = useState(null);

  const { Icono, etiqueta, copiar, copiado: textoCopiado } = TIPOS[item.itemTipo];
  const detalle = enlaceDetalle(item);

  const exigirSesion = () => {
    if (isAuthenticated) return true;
    navigate('/register');
    return false;
  };

  const alternarGuardado = async () => {
    if (!exigirSesion() || ocupado) return;
    const siguiente = !guardado;
    setGuardado(siguiente);
    setOcupado('guardar');
    try {
      if (siguiente) await socialService.guardar(item.itemTipo, item.id);
      else await socialService.quitarGuardado(item.itemTipo, item.id);
      toast.success(siguiente ? 'Guardado en tus favoritos' : 'Quitado de tus favoritos');
      onCambio?.({ ...item, guardado: siguiente });
    } catch (error) {
      setGuardado(!siguiente);
      toast.error(mensajeError(error, 'No se pudo guardar'));
    } finally {
      setOcupado(null);
    }
  };

  const clonar = async () => {
    if (!exigirSesion() || ocupado) return;
    setOcupado('copiar');
    try {
      await socialService.clonar(item.itemTipo, item.id);
      setCopiado(true);
      toast.success(textoCopiado);
    } catch (error) {
      toast.error(mensajeError(error, 'No se pudo copiar'));
    } finally {
      setOcupado(null);
    }
  };

  const alternarVisibilidad = async () => {
    if (ocupado) return;
    const siguiente = !publico;
    setPublico(siguiente);
    setOcupado('visibilidad');
    try {
      await socialService.cambiarVisibilidad(item.itemTipo, item.id, siguiente);
      toast.success(siguiente ? 'Ahora se ve en tu perfil' : 'Oculto de tu perfil');
    } catch (error) {
      setPublico(!siguiente);
      toast.error(mensajeError(error, 'No se pudo cambiar la visibilidad'));
    } finally {
      setOcupado(null);
    }
  };

  const titulo = (
    <h3 className="font-anton text-xl uppercase leading-tight text-white transition-colors group-hover:text-uf-gold">
      {item.nombre}
    </h3>
  );

  return (
    <article className={`uf-card group flex h-full flex-col p-5 ${gestionable && !publico ? 'opacity-70' : ''}`}>
      <div className="mb-4 flex items-center justify-between gap-2">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-uf-gold/30 bg-uf-gold/10 text-uf-gold">
          <Icono className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="flex flex-wrap justify-end gap-1.5">
          {item.esCopia && <span className="uf-chip">Copia</span>}
          <span className="uf-chip">{humanizar(item.tipo || item.tipoComida) || etiqueta}</span>
        </div>
      </div>

      {detalle ? (
        <Link to={detalle} className="rounded focus-visible:outline-offset-4">
          {titulo}
        </Link>
      ) : (
        titulo
      )}

      <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-uf-muted">
        {item.descripcion || 'Sin descripción'}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-semibold text-gray-400">
        {item.duracionMinutos != null && (
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-uf-gold" aria-hidden="true" />
            {item.duracionMinutos} min
          </span>
        )}
        {item.calorias != null && (
          <span className="inline-flex items-center gap-1">
            <Flame className="h-3.5 w-3.5 text-uf-gold" aria-hidden="true" />
            {item.calorias} kcal
          </span>
        )}
        {item.nivel && <span className="capitalize">{humanizar(item.nivel)}</span>}
      </div>

      <div className="mt-4 flex items-center gap-2 border-t border-uf-line pt-4">
        {gestionable ? (
          <button
            type="button"
            onClick={alternarVisibilidad}
            aria-pressed={publico}
            className={`inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-full border px-4 text-xs font-bold uppercase tracking-wider transition ${
              publico
                ? 'border-uf-gold/50 bg-uf-gold/10 text-uf-gold hover:bg-uf-gold/20'
                : 'border-uf-line text-gray-400 hover:border-gray-500 hover:text-white'
            }`}
          >
            {publico ? <Eye className="h-4 w-4" aria-hidden="true" /> : <EyeOff className="h-4 w-4" aria-hidden="true" />}
            {publico ? 'Visible en mi perfil' : 'Oculto'}
          </button>
        ) : (
          <>
            {copiar && (
              <button
                type="button"
                onClick={clonar}
                disabled={copiado || ocupado === 'copiar'}
                className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-full border border-uf-line px-4 text-xs font-bold uppercase tracking-wider text-gray-200 transition hover:border-uf-gold hover:text-uf-gold disabled:cursor-default disabled:border-uf-gold/40 disabled:text-uf-gold"
              >
                {copiado ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
                {copiado ? 'Copiado' : copiar}
              </button>
            )}
            <button
              type="button"
              onClick={alternarGuardado}
              aria-pressed={guardado}
              aria-label={guardado ? `Quitar ${item.nombre} de favoritos` : `Guardar ${item.nombre} en favoritos`}
              className={`inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-full border px-3 text-xs font-bold uppercase tracking-wider transition ${
                copiar ? 'w-10 !px-0' : 'flex-1'
              } ${
                guardado
                  ? 'border-uf-gold bg-uf-gold text-black'
                  : 'border-uf-line text-gray-300 hover:border-uf-gold hover:text-uf-gold'
              }`}
            >
              {guardado ? <BookmarkCheck className="h-4 w-4" aria-hidden="true" /> : <Bookmark className="h-4 w-4" aria-hidden="true" />}
              {!copiar && (guardado ? 'Guardado' : 'Guardar')}
            </button>
          </>
        )}
      </div>
    </article>
  );
}

export default TarjetaItemSocial;
