import { useRef, useState } from 'react';
import { Camera, Trash2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import socialService, { mensajeError } from '../../services/socialService';
import Avatar from './Avatar';

const MAX_BYTES = 2 * 1024 * 1024;
const TIPOS = ['image/jpeg', 'image/png', 'image/webp'];

// Foto de perfil con subida de archivo. El servidor vuelve a validar tipo y tamaño.
function SubirAvatar({ nombre, fotoUrl, onCambio }) {
  const toast = useToast();
  const inputRef = useRef(null);
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState(null);

  const elegir = async (e) => {
    const archivo = e.target.files?.[0];
    e.target.value = '';
    if (!archivo) return;

    if (!TIPOS.includes(archivo.type)) {
      setError('Formato no permitido. Usa una imagen JPG, PNG o WebP.');
      return;
    }
    if (archivo.size > MAX_BYTES) {
      setError('La imagen supera el máximo de 2 MB.');
      return;
    }

    setError(null);
    setSubiendo(true);
    try {
      const r = await socialService.subirAvatar(archivo);
      onCambio(r.fotoUrl);
      toast.success('Foto de perfil actualizada');
    } catch (err) {
      setError(mensajeError(err, 'No se pudo subir la imagen'));
    } finally {
      setSubiendo(false);
    }
  };

  const quitar = async () => {
    setSubiendo(true);
    try {
      await socialService.borrarAvatar();
      onCambio(null);
      setError(null);
    } catch (err) {
      setError(mensajeError(err, 'No se pudo quitar la foto'));
    } finally {
      setSubiendo(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-4">
        <Avatar nombre={nombre} fotoUrl={fotoUrl} tamano="lg" className={subiendo ? 'animate-pulse' : ''} />
        <div className="flex flex-wrap gap-2">
          <input
            ref={inputRef}
            type="file"
            accept={TIPOS.join(',')}
            onChange={elegir}
            className="sr-only"
            tabIndex={-1}
            aria-hidden="true"
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={subiendo}
            className="uf-btn uf-btn-ghost !px-4 !py-2 !text-xs disabled:opacity-50"
          >
            <Camera className="h-4 w-4" aria-hidden="true" />
            {subiendo ? 'Subiendo…' : fotoUrl ? 'Cambiar foto' : 'Subir foto'}
          </button>
          {fotoUrl && (
            <button
              type="button"
              onClick={quitar}
              disabled={subiendo}
              aria-label="Quitar foto de perfil"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-uf-line text-gray-400 transition hover:border-red-500/60 hover:text-red-400 disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
      <p className="mt-2 text-xs text-uf-muted">JPG, PNG o WebP. Máximo 2 MB.</p>
      {error && (
        <p role="alert" className="mt-2 text-sm text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}

export default SubirAvatar;
