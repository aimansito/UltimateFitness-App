// ============================================
// Catálogo de ejercicios compartido (panel de la biblioteca y selector con la figura).
// Se descarga una vez por sesión.
// ============================================
import { useEffect, useState } from 'react';
import api from '../../services/api';
import { normalizarGrupo } from '../common/MuscleMap';

export const GRUPOS_PANEL = [
  { id: 'pecho', nombre: 'Pecho' },
  { id: 'espalda', nombre: 'Espalda' },
  { id: 'piernas', nombre: 'Piernas' },
  { id: 'hombros', nombre: 'Hombros' },
  { id: 'biceps', nombre: 'Bíceps' },
  { id: 'triceps', nombre: 'Tríceps' },
  { id: 'core', nombre: 'Core' },
  { id: 'gluteos', nombre: 'Glúteos' },
  { id: 'fullbody', nombre: 'Full body' },
  { id: 'cardio', nombre: 'Cardio' },
];

// Grupos del catálogo que también encajan en un chip (p. ej. "brazos" sale en bíceps y tríceps)
export const ALIAS = {
  biceps: ['biceps', 'brazos'],
  triceps: ['triceps', 'brazos'],
  gluteos: ['gluteos', 'cadera'],
  piernas: ['piernas', 'cadera'],
};

export const nombreGrupo = (g) => GRUPOS_PANEL.find((x) => x.id === normalizarGrupo(g))?.nombre || g || 'General';

let cache = null;
let pendiente = null;

/** Sustituye la caché tras crear, borrar o marcar favoritos */
export const guardarCache = (lista) => {
  cache = lista;
};

export function useBiblioteca() {
  const [ejercicios, setEjercicios] = useState(cache || []);
  const [cargando, setCargando] = useState(!cache);
  const [error, setError] = useState(false);
  useEffect(() => {
    if (cache) return undefined;
    let vigente = true;
    pendiente ??= api.get('/custom/ejercicios?limit=300').then((r) => (cache = r.data?.ejercicios ?? []));
    pendiente
      .then((lista) => vigente && setEjercicios(lista))
      .catch(() => {
        pendiente = null;
        if (vigente) setError(true);
      })
      .finally(() => vigente && setCargando(false));
    return () => {
      vigente = false;
    };
  }, []);
  return { ejercicios, cargando, error };
}
