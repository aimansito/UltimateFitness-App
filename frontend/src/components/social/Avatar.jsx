import { useState } from 'react';
import { urlFoto } from '../../services/socialService';

const TAMANOS = {
  sm: 'h-10 w-10 text-sm',
  md: 'h-14 w-14 text-lg',
  lg: 'h-20 w-20 text-2xl',
  xl: 'h-28 w-28 text-4xl sm:h-36 sm:w-36 sm:text-5xl',
};

const iniciales = (nombre = '') =>
  nombre
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() || '')
    .join('') || '?';

// Foto de perfil circular; si no hay foto (o falla al cargar) muestra las iniciales
function Avatar({ nombre, fotoUrl, tamano = 'md', className = '' }) {
  const [rota, setRota] = useState(null);
  const src = urlFoto(fotoUrl);
  const mostrarFoto = src && rota !== src;

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-uf-gold/40 bg-gradient-to-br from-uf-gold/25 to-uf-card-2 font-anton uppercase text-uf-gold ${TAMANOS[tamano]} ${className}`}
    >
      {mostrarFoto ? (
        <img
          src={src}
          alt={`Foto de ${nombre}`}
          className="h-full w-full object-cover"
          loading="lazy"
          onError={() => setRota(src)}
        />
      ) : (
        <span aria-hidden="true">{iniciales(nombre)}</span>
      )}
    </span>
  );
}

export default Avatar;
