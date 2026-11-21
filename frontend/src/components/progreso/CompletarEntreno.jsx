// ============================================
// COMPLETAR ENTRENO
// Con la foto recién hecha compone la historia estilo Strava (logo, figura, tiempo y
// ejercicios), la guarda en el perfil como objetivo cumplido y deja compartirla en redes.
// ============================================
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Download, Share2, Trophy, UserCheck, UserPlus, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import socialService, { mensajeError } from '../../services/socialService';
import { useToast } from '../../context/ToastContext';
import MuscleMap from '../common/MuscleMap';
import { prepararFoto, descargarBlob, nombresGrupos } from '../../utils/imagenEntreno';
import { formatoDuracion, generarHistoria } from '../../utils/historiaEntreno';

const WEB = 'ultimatefitnessuf.com';
const USUARIO = '@ultimatefitness.utf';
const DIAS = ['', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

/**
 * foto: File de la cámara · entrenamiento: { id, nombre } · dia: día de la rutina (con ejercicios)
 * duracionMinutos: cronómetro de la sesión · volumen: kg movidos hoy (opcional)
 */
function CompletarEntreno({ foto, entrenamiento, dia, duracionMinutos, volumen, onClose, onGuardado }) {
  const toast = useToast();
  const { user } = useAuth();
  const mapaRef = useRef(null);
  const [imagen, setImagen] = useState(null); // { blob, url }
  const [estado, setEstado] = useState('creando'); // creando | guardando | listo | error
  const [error, setError] = useState(null);
  const [registro, setRegistro] = useState(null);
  // Publicado en el perfil (y ese día en el feed de quien te sigue): lo decide la persona
  const [publico, setPublico] = useState(false);

  const ejercicios = dia.ejercicios || [];
  const grupos = ejercicios.map((e) => e.grupo_muscular);
  const series = ejercicios.reduce((n, e) => n + (Number(e.series) || 0), 0);

  useEffect(() => {
    let vigente = true;
    let urlFoto = null;
    (async () => {
      try {
        const preparada = await prepararFoto(foto);
        urlFoto = URL.createObjectURL(preparada);
        await new Promise((ok) => requestAnimationFrame(() => requestAnimationFrame(ok)));
        const blob = await generarHistoria({
          fotoSrc: urlFoto,
          rutina: entrenamiento.nombre,
          dia: [DIAS[dia.dia_semana], dia.concepto].filter(Boolean).join(' · '),
          grupos: nombresGrupos(ejercicios.map((e) => ({ grupo: e.grupo_muscular }))),
          stats: [
            { etiqueta: 'Tiempo', valor: formatoDuracion(duracionMinutos) },
            { etiqueta: 'Ejercicios', valor: ejercicios.length },
            { etiqueta: 'Series', valor: series || null },
            { etiqueta: 'Volumen', valor: volumen > 0 ? `${Math.round(volumen).toLocaleString('es-ES', { useGrouping: 'always' })} kg` : null },
          ],
          ejercicios: ejercicios.map((e) => e.ejercicio_nombre),
          mapaSvgs: [...(mapaRef.current?.querySelectorAll('svg') || [])],
          web: WEB,
          usuario: USUARIO,
        });
        if (!vigente) return;
        setImagen({ blob, url: URL.createObjectURL(blob) });
        setEstado('guardando');

        // Guardar como objetivo cumplido del día (y publicación en el feed)
        const r = await socialService.completarEntrenoHoy(entrenamiento.id, false, {
          diaId: dia.id,
          ejercicios: ejercicios.map((e) => e.ejercicio_id),
          duracionMinutos,
        });
        if (!vigente) return;
        setRegistro(r.id);
        // El entreno ya cuenta como hecho; si la foto no se sube, se avisa pero se puede compartir igual
        try {
          await socialService.subirFotoEntreno(r.id, blob, true);
        } catch (e) {
          if (vigente) setError(mensajeError(e, 'No se pudo subir la foto a tu perfil, pero tu entreno sí ha quedado registrado.'));
        }
        if (!vigente) return;
        setEstado('listo');
        onGuardado?.();
      } catch (e) {
        if (!vigente) return;
        setError(mensajeError(e, e.message || 'No se pudo guardar el entreno'));
        setEstado('error');
      } finally {
        if (urlFoto) URL.revokeObjectURL(urlFoto);
      }
    })();
    return () => {
      vigente = false;
    };
    // Se compone una sola vez con la foto recibida
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [foto]);

  useEffect(() => () => imagen && URL.revokeObjectURL(imagen.url), [imagen]);

  const nombreArchivo = `ultimate-fitness-${new Date().toISOString().slice(0, 10)}.jpg`;

  const compartir = async () => {
    if (!imagen) return;
    const archivo = new File([imagen.blob], nombreArchivo, { type: 'image/jpeg' });
    if (navigator.canShare?.({ files: [archivo] })) {
      try {
        await navigator.share({ files: [archivo], title: 'Mi entreno', text: `Entreno completado con ${USUARIO}` });
      } catch {
        /* cancelado por el usuario */
      }
    } else {
      descargarBlob(imagen.blob, nombreArchivo);
      toast.info('Tu navegador no permite compartir directamente: la imagen se ha descargado para que la subas.');
    }
  };

  const cambiarPublico = async () => {
    const nuevo = !publico;
    setPublico(nuevo);
    try {
      await socialService.completarEntrenoHoy(entrenamiento.id, nuevo);
      if (nuevo) toast.success('Publicado en tu perfil');
    } catch (e) {
      setPublico(!nuevo);
      toast.error(mensajeError(e, nuevo ? 'No se pudo publicar en tu perfil' : 'No se pudo quitar de tu perfil'));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="titulo-completado">
      {/* Figura oculta: de aquí salen los SVG coloreados que se pintan en la historia */}
      <div ref={mapaRef} className="pointer-events-none fixed -left-[9999px] top-0 h-[250px] w-[240px]" aria-hidden="true">
        <MuscleMap grupos={grupos} vista="ambas" className="h-full w-full" bodyColor="rgba(255,255,255,0.28)" />
      </div>

      <div className="flex max-h-full w-full max-w-md flex-col items-center overflow-y-auto">
        <div className="flex w-full items-center justify-between">
          <span className="inline-flex items-center gap-2 font-audiowide text-[11px] uppercase tracking-[0.3em] text-uf-gold">
            <Trophy className="h-4 w-4" /> Objetivo cumplido
          </span>
          <button type="button" onClick={onClose} aria-label="Cerrar" className="flex h-10 w-10 items-center justify-center rounded-full border border-uf-line text-gray-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>
        <h2 id="titulo-completado" className="mt-2 w-full font-anton text-3xl uppercase leading-none text-white">
          {entrenamiento.nombre} <span className="uf-text-gold">hecho</span>
        </h2>

        <div className="relative mt-4 aspect-[9/16] w-full max-w-[19rem] overflow-hidden rounded-3xl border border-uf-line bg-black">
          {imagen ? (
            <img src={imagen.url} alt="Tu entreno de hoy" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full flex-col items-center justify-center" role="status">
              <div className="h-10 w-10 animate-spin rounded-full border-b-4 border-t-4 border-uf-gold" />
              <p className="mt-3 text-sm text-uf-muted">Preparando tu foto...</p>
            </div>
          )}
        </div>

        {estado === 'error' && <p role="alert" className="mt-4 text-center text-sm text-red-300">{error}</p>}
        {estado === 'listo' && error && <p role="alert" className="mt-4 text-center text-sm text-amber-200">{error}</p>}
        <p className="mt-3 flex items-center gap-1.5 text-xs text-uf-muted" role="status">
          {estado === 'guardando' && 'Guardando en tu perfil...'}
          {estado === 'listo' && (
            <>
              <Check className="h-4 w-4 text-uf-gold" /> {error ? 'Entreno registrado (sin foto)' : 'Guardado en tu perfil'}
            </>
          )}
        </p>

        <div className="mt-4 grid w-full grid-cols-2 gap-2">
          <button type="button" onClick={compartir} disabled={!imagen} className="uf-btn uf-btn-primary col-span-2 disabled:opacity-50">
            <Share2 className="h-4 w-4" /> Compartir en Instagram o redes
          </button>
          <button type="button" onClick={() => imagen && descargarBlob(imagen.blob, nombreArchivo)} disabled={!imagen} className="uf-btn uf-btn-ghost disabled:opacity-50">
            <Download className="h-4 w-4" /> Descargar
          </button>
          <button
            type="button"
            onClick={cambiarPublico}
            disabled={!registro}
            aria-pressed={publico}
            className={`uf-btn disabled:opacity-50 ${publico ? 'uf-btn-ghost !border-uf-gold !text-uf-gold' : 'uf-btn-ghost'}`}
          >
            {publico ? <UserCheck className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
            {publico ? 'Publicado' : 'Publicar en mi perfil'}
          </button>
        </div>
        {publico && user?.id && (
          <Link to={`/perfil/usuario/${user.id}`} className="mt-3 text-xs font-bold uppercase tracking-wider text-uf-gold hover:underline">
            Ver en mi perfil
          </Link>
        )}
      </div>
    </div>
  );
}

export default CompletarEntreno;
