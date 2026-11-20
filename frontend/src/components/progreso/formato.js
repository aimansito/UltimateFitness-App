// Textos cortos para mostrar registros de series

/** Resumen de una sesión: "60 kg · 10/10/8" (o solo las repeticiones si no hubo peso) */
export function ultimaSesion(u) {
  if (!u) return null;
  const reps = u.series.map((s) => s.repeticiones).join('/');
  return u.pesoMax != null ? `${Number.isInteger(u.pesoMax) ? u.pesoMax : u.pesoMax.toFixed(1)} kg · ${reps}` : `${reps} reps`;
}
