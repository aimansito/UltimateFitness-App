import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import socialService, { mensajeError, rutaPerfil } from '../../services/socialService';
import Avatar from './Avatar';

// Modal con la lista paginada de seguidores o seguidos de una cuenta
function ListaCuentasModal({ tipo, id, modo, onCerrar }) {
  const [cuentas, setCuentas] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [hayMas, setHayMas] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const cerrarRef = useRef(null);

  useEffect(() => {
    let vigente = true;
    const pedir = modo === 'seguidores' ? socialService.seguidores : socialService.seguidos;
    pedir(tipo, id, pagina)
      .then((r) => {
        if (!vigente) return;
        setCuentas((previas) => (pagina === 1 ? r.cuentas : [...previas, ...r.cuentas]));
        setHayMas(r.hayMas);
        setError(null);
      })
      .catch((e) => vigente && setError(mensajeError(e, 'No se pudo cargar la lista')))
      .finally(() => vigente && setCargando(false));
    return () => {
      vigente = false;
    };
  }, [tipo, id, modo, pagina]);

  useEffect(() => {
    cerrarRef.current?.focus();
    const alPulsar = (e) => e.key === 'Escape' && onCerrar();
    document.addEventListener('keydown', alPulsar);
    return () => document.removeEventListener('keydown', alPulsar);
  }, [onCerrar]);

  const titulo = modo === 'seguidores' ? 'Seguidores' : 'Siguiendo';

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onCerrar}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={titulo}
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[80vh] w-full max-w-md flex-col rounded-t-3xl border border-uf-line bg-uf-card sm:rounded-3xl"
      >
        <div className="flex items-center justify-between border-b border-uf-line px-6 py-4">
          <h2 className="font-anton text-2xl uppercase text-white">{titulo}</h2>
          <button
            ref={cerrarRef}
            type="button"
            onClick={onCerrar}
            aria-label="Cerrar"
            className="flex h-10 w-10 items-center justify-center rounded-full text-gray-400 transition hover:bg-white/5 hover:text-white"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="overflow-y-auto px-3 py-3">
          {error && <p className="px-3 py-6 text-center text-sm text-red-300">{error}</p>}

          {!error && !cargando && cuentas.length === 0 && (
            <p className="px-3 py-10 text-center text-sm text-uf-muted">
              {modo === 'seguidores' ? 'Todavía no tiene seguidores.' : 'Todavía no sigue a nadie.'}
            </p>
          )}

          <ul>
            {cuentas.map((c) => (
              <li key={`${c.tipo}-${c.id}`}>
                <Link
                  to={rutaPerfil(c)}
                  onClick={onCerrar}
                  className="flex items-center gap-3 rounded-2xl px-3 py-2.5 transition hover:bg-white/5"
                >
                  <Avatar nombre={c.nombre} fotoUrl={c.fotoUrl} tamano="sm" />
                  <span className="min-w-0 flex-1 truncate font-semibold text-white">{c.nombre}</span>
                  {c.esMio && <span className="uf-chip">Tú</span>}
                  {!c.esMio && c.loSigo && <span className="uf-chip">Siguiendo</span>}
                </Link>
              </li>
            ))}
          </ul>

          {cargando && (
            <div className="flex justify-center py-8" role="status" aria-label="Cargando">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-uf-gold" />
            </div>
          )}

          {hayMas && !cargando && (
            <button
              type="button"
              onClick={() => {
                setCargando(true);
                setPagina((p) => p + 1);
              }}
              className="uf-btn uf-btn-ghost mx-auto my-3 !flex !py-2 !text-xs"
            >
              Ver más
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ListaCuentasModal;
