// Preparación y exportación de la foto del entreno.

const LADO_MAX = 1600;

/** "4x12", o "3 series" si el ejercicio no tiene repeticiones (planchas, isométricos...) */
export const formatoSeries = (e) => {
  if (!e?.series) return '';
  const reps = e.repeticiones && String(e.repeticiones) !== '0' ? e.repeticiones : null;
  return reps ? `${e.series}x${reps}` : `${e.series} series`;
};

/** Grupos musculares (sin repetir) de una lista de ejercicios */
export const gruposDe = (ejercicios = []) => [...new Set(ejercicios.map((e) => e.grupo).filter(Boolean))];

const NOMBRES_GRUPO = {
  pecho: 'Pecho', espalda: 'Espalda', piernas: 'Piernas', hombros: 'Hombros', biceps: 'Bíceps', triceps: 'Tríceps',
  brazos: 'Brazos', core: 'Core', gluteos: 'Glúteos', cadera: 'Cadera', fullbody: 'Full body', cardio: 'Cardio', agarre: 'Agarre',
};
const clave = (g) => (g || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[\s_-]/g, '');

/** "Pecho · Espalda": grupos trabajados, para mostrar bajo la figura */
export const nombresGrupos = (ejercicios = []) =>
  [...new Set(gruposDe(ejercicios).map((g) => NOMBRES_GRUPO[clave(g)] || g))].join(' · ');

/** Estadísticas de la tarjeta: ejercicios, series totales y duración */
export const statsDe = (ejercicios = [], duracionMinutos = null) => {
  const series = ejercicios.reduce((total, e) => total + (e.series || 0), 0);
  return [
    { etiqueta: 'Ejercicios', valor: ejercicios.length },
    { etiqueta: 'Series', valor: series || null },
    { etiqueta: 'Duración', valor: duracionMinutos ? `${duracionMinutos} min` : null },
  ];
};


/**
 * Reduce la foto y la vuelve a codificar como JPEG en el navegador.
 * Al redibujarla se pierden los metadatos (EXIF con GPS, modelo del móvil...) y se
 * aplica la orientación correcta. El servidor vuelve a limpiar por si acaso.
 */
export async function prepararFoto(archivo) {
  if (!archivo?.type?.startsWith('image/')) {
    throw new Error('Elige una imagen (JPG, PNG, WebP o HEIC si tu navegador la abre).');
  }
  let bitmap;
  try {
    bitmap = await createImageBitmap(archivo, { imageOrientation: 'from-image' });
  } catch {
    throw new Error('Tu navegador no puede abrir esta imagen. Prueba con una foto JPG.');
  }
  const escala = Math.min(1, LADO_MAX / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * escala);
  canvas.height = Math.round(bitmap.height * escala);
  canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close?.();
  const blob = await new Promise((ok) => canvas.toBlob(ok, 'image/jpeg', 0.86));
  if (!blob) throw new Error('No se pudo procesar la imagen.');
  return blob;
}

const cargarImagen = (src) =>
  new Promise((ok, ko) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => ok(img);
    img.onerror = ko;
    img.src = src;
  });

function dibujarCubriendo(ctx, img, w, h) {
  const escala = Math.max(w / img.width, h / img.height);
  const dw = img.width * escala;
  const dh = img.height * escala;
  ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
}

function textoAjustado(ctx, texto, maxAncho) {
  if (ctx.measureText(texto).width <= maxAncho) return texto;
  let t = texto;
  while (t.length > 1 && ctx.measureText(`${t}…`).width > maxAncho) t = t.slice(0, -1);
  return `${t}…`;
}

/**
 * Genera la tarjeta del entreno como PNG 1080x1350 (formato vertical de Instagram).
 * mapaSvgs: elementos <svg> del mapa muscular ya pintado en pantalla.
 */
export async function generarTarjetaPng({ fotoSrc, nombre, rutina, dia, fecha, stats, ejercicios, mapaSvgs, grupos = '' }) {
  const W = 1080;
  const H = 1350;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  await document.fonts?.ready;

  // Fondo: la foto o un degradado de marca
  if (fotoSrc) {
    dibujarCubriendo(ctx, await cargarImagen(fotoSrc), W, H);
  } else {
    const fondo = ctx.createLinearGradient(0, 0, W, H);
    fondo.addColorStop(0, '#1a1406');
    fondo.addColorStop(1, '#050505');
    ctx.fillStyle = fondo;
    ctx.fillRect(0, 0, W, H);
  }
  // Velos para que el texto se lea sobre cualquier foto
  const arriba = ctx.createLinearGradient(0, 0, 0, 260);
  arriba.addColorStop(0, 'rgba(0,0,0,0.7)');
  arriba.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = arriba;
  ctx.fillRect(0, 0, W, 260);
  const abajo = ctx.createLinearGradient(0, H * 0.38, 0, H);
  abajo.addColorStop(0, 'rgba(0,0,0,0)');
  abajo.addColorStop(0.35, 'rgba(0,0,0,0.75)');
  abajo.addColorStop(1, 'rgba(0,0,0,0.95)');
  ctx.fillStyle = abajo;
  ctx.fillRect(0, H * 0.38, W, H * 0.62);

  const ORO = '#CC941A';
  const M = 64;

  // Cabecera
  ctx.textBaseline = 'top';
  ctx.fillStyle = ORO;
  ctx.font = '400 40px Anton, sans-serif';
  ctx.fillText('ULTIMATE FITNESS', M, 56);
  ctx.fillStyle = '#ffffff';
  ctx.font = '600 30px Inter, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText(fecha, W - M, 64);
  ctx.textAlign = 'left';

  // Mapa muscular (vistas delantera y trasera) a la derecha
  const anchoMapa = 300;
  const altoMapa = 360;
  const yMapa = 600;
  if (mapaSvgs?.length) {
    const hueco = anchoMapa / mapaSvgs.length;
    for (let i = 0; i < mapaSvgs.length; i++) {
      const svg = mapaSvgs[i].cloneNode(true);
      svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      const vb = svg.viewBox?.baseVal;
      const proporcion = vb && vb.width ? vb.width / vb.height : 0.5;
      const h = altoMapa;
      const w = Math.min(hueco - 10, h * proporcion);
      svg.setAttribute('width', String(w));
      svg.setAttribute('height', String(h));
      const datos = new XMLSerializer().serializeToString(svg);
      const img = await cargarImagen(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(datos)}`);
      ctx.drawImage(img, W - M - anchoMapa + i * hueco + (hueco - w) / 2, yMapa, w, h);
    }
    // Grupos trabajados bajo la figura
    if (grupos) {
      ctx.fillStyle = ORO;
      ctx.font = '400 30px Anton, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(textoAjustado(ctx, grupos.toUpperCase(), anchoMapa + 20), W - M - anchoMapa / 2, yMapa + altoMapa + 14);
      ctx.textAlign = 'left';
    }
  }

  // Bloque inferior
  let y = 600;
  const anchoTexto = W - M * 2 - anchoMapa - 30;
  ctx.fillStyle = ORO;
  ctx.font = '700 28px Inter, sans-serif';
  ctx.fillText(textoAjustado(ctx, `${nombre} ha completado`.toUpperCase(), anchoTexto), M, y);
  y += 48;
  ctx.fillStyle = '#ffffff';
  // El nombre de la rutina se encoge hasta caber; solo se corta si aun así no entra
  let tam = 84;
  do {
    ctx.font = `400 ${tam}px Anton, sans-serif`;
    if (ctx.measureText(rutina.toUpperCase()).width <= anchoTexto) break;
    tam -= 4;
  } while (tam > 52);
  ctx.fillText(textoAjustado(ctx, rutina.toUpperCase(), anchoTexto), M, y + (84 - tam) / 2);
  y += 104;
  if (dia) {
    ctx.fillStyle = '#d4d4d4';
    ctx.font = '600 32px Inter, sans-serif';
    ctx.fillText(textoAjustado(ctx, dia, anchoTexto), M, y);
    y += 56;
  }

  // Ejercicios (máximo 5, para no pisar las estadísticas)
  ctx.font = '500 30px Inter, sans-serif';
  const visibles = ejercicios.slice(0, 5);
  for (const e of visibles) {
    ctx.fillStyle = ORO;
    ctx.beginPath();
    ctx.arc(M + 8, y + 17, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    const detalle = formatoSeries(e) ? `  ${formatoSeries(e)}` : '';
    ctx.fillText(textoAjustado(ctx, `${e.nombre}${detalle}`, anchoTexto - 30), M + 30, y);
    y += 46;
  }
  if (ejercicios.length > visibles.length) {
    ctx.fillStyle = '#a3a3a3';
    ctx.fillText(`+${ejercicios.length - visibles.length} más`, M + 30, y);
  }

  // Estadísticas
  const yStats = H - 190;
  ctx.fillStyle = 'rgba(255,255,255,0.15)';
  ctx.fillRect(M, yStats - 30, W - M * 2, 2);
  const columnas = stats.filter((s) => s.valor !== null && s.valor !== undefined && s.valor !== '');
  const anchoCol = (W - M * 2) / Math.max(columnas.length, 1);
  columnas.forEach((s, i) => {
    const x = M + i * anchoCol;
    ctx.fillStyle = '#a3a3a3';
    ctx.font = '700 24px Inter, sans-serif';
    ctx.fillText(s.etiqueta.toUpperCase(), x, yStats);
    ctx.fillStyle = '#ffffff';
    ctx.font = '400 64px Anton, sans-serif';
    ctx.fillText(String(s.valor), x, yStats + 38);
  });

  return new Promise((ok, ko) => canvas.toBlob((b) => (b ? ok(b) : ko(new Error('No se pudo crear la imagen'))), 'image/png'));
}

export function descargarBlob(blob, nombreArchivo) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nombreArchivo;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
