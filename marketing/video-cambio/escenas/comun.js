// Utilidades comunes de las escenas.
// fijarTiempo(t) congela todas las animaciones CSS en el segundo t: el montaje pide un
// fotograma detrás de otro, así que el resultado es siempre el mismo.

window.fijarTiempo = (t) => {
  for (const animacion of document.getAnimations()) {
    animacion.pause();
    animacion.currentTime = t * 1000;
  }
  if (window.alTiempo) window.alTiempo(t);
};

/** Espera a que estén cargadas las tipografías y las imágenes antes de capturar */
window.esperarRecursos = async () => {
  await Promise.all([
    document.fonts.load('400 100px Anton'),
    document.fonts.load('400 30px Audiowide'),
    document.fonts.load('400 30px Inter'),
    document.fonts.load('700 30px Inter'),
    document.fonts.load('800 30px Inter'),
  ]);
  await document.fonts.ready;
  await Promise.all(
    [...document.images].map((img) => (img.complete ? img.decode().catch(() => {}) : new Promise((ok) => { img.onload = img.onerror = ok; })))
  );
};

/** Crea un elemento con clases, estilos y contenido */
window.crear = (etiqueta, clases = '', html = '', estilos = {}) => {
  const el = document.createElement(etiqueta);
  if (clases) el.className = clases;
  if (html) el.innerHTML = html;
  Object.assign(el.style, estilos);
  return el;
};

const facil = (x) => 1 - Math.pow(1 - x, 3);
/** Progreso 0..1 suavizado entre dos instantes */
window.progreso = (t, desde, hasta) => facil(Math.min(1, Math.max(0, (t - desde) / (hasta - desde))));
