// ============================================
// HISTORIA DEL ENTRENO (1080x1920, estilo Strava)
// Sobre la foto del usuario, todo centrado y pequeño: logo, rutina, estadísticas apiladas,
// la figura con los grupos trabajados (donde Strava pone el recorrido) y los ejercicios
// como referencia de la rutina. Pensada para historias de Instagram/TikTok.
// ============================================
const W = 1080;
const H = 1920;
const ORO = '#CC941A';

const cargarImagen = (src) =>
  new Promise((ok, ko) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => ok(img);
    img.onerror = () => ko(new Error('No se pudo cargar la imagen'));
    img.src = src;
  });

function cubrir(ctx, img) {
  const escala = Math.max(W / img.width, H / img.height);
  const w = img.width * escala;
  const h = img.height * escala;
  ctx.drawImage(img, (W - w) / 2, (H - h) / 2, w, h);
}

/** Parte un texto en líneas que quepan en `ancho` (máximo `max` líneas, la última con «…») */
function lineas(ctx, texto, ancho, max) {
  const palabras = texto.split(' ');
  const out = [];
  let actual = '';
  for (const p of palabras) {
    const prueba = actual ? `${actual} ${p}` : p;
    if (ctx.measureText(prueba).width > ancho && actual) {
      out.push(actual);
      actual = p;
    } else actual = prueba;
  }
  if (actual) out.push(actual);
  if (out.length > max) {
    const ultimas = out.slice(0, max);
    let u = ultimas[max - 1];
    while (ctx.measureText(`${u}…`).width > ancho && u.length > 1) u = u.slice(0, -1);
    ultimas[max - 1] = `${u}…`;
    return ultimas;
  }
  return out;
}

async function svgAImagen(svg, w, h) {
  const copia = svg.cloneNode(true);
  copia.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  copia.setAttribute('width', String(w));
  copia.setAttribute('height', String(h));
  // El color de cada músculo va en el style en línea del polígono, que se serializa con él
  const datos = new XMLSerializer().serializeToString(copia);
  return cargarImagen(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(datos)}`);
}

/** Duración legible: «48 min», «1 h 12 min» */
export const formatoDuracion = (min) => {
  if (!min) return null;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return h ? `${h} h ${m ? `${m} min` : ''}`.trim() : `${m} min`;
};

/**
 * fotoSrc: foto del usuario (URL o data URL) · mapaSvgs: <svg> del mapa muscular ya pintado (con colores)
 * stats: [{ etiqueta, valor }] · ejercicios: nombres · devuelve un Blob JPEG
 */
export async function generarHistoria({ fotoSrc, rutina, dia, grupos, stats, ejercicios = [], mapaSvgs = [], web, usuario }) {
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  await Promise.all(['400 60px Anton', '400 24px Audiowide', '600 30px Inter', '800 66px Inter'].map((f) => document.fonts?.load(f).catch(() => {})));

  // Foto y velos suaves para que el texto se lea sin tapar la foto
  if (fotoSrc) cubrir(ctx, await cargarImagen(fotoSrc));
  else {
    const g = ctx.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, '#1a1406');
    g.addColorStop(1, '#050505');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }
  ctx.fillStyle = 'rgba(0,0,0,0.18)';
  ctx.fillRect(0, 0, W, H);
  const centro = ctx.createRadialGradient(W / 2, 920, 80, W / 2, 920, 760);
  centro.addColorStop(0, 'rgba(0,0,0,0.42)');
  centro.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = centro;
  ctx.fillRect(0, 0, W, H);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.shadowColor = 'rgba(0,0,0,0.5)';
  ctx.shadowBlur = 16;
  ctx.shadowOffsetY = 2;

  // Logo y marca
  let y = 400;
  try {
    const logo = await cargarImagen('/logos/logo-small.png');
    const alto = 70;
    const ancho = (logo.width / logo.height) * alto;
    ctx.drawImage(logo, W / 2 - ancho / 2, y, ancho, alto);
    y += alto + 30;
  } catch {
    y += 40;
  }
  ctx.fillStyle = '#ffffff';
  ctx.font = '400 19px Audiowide';
  ctx.letterSpacing = '6px';
  ctx.fillText('ULTIMATE FITNESS', W / 2 + 3, y);
  ctx.letterSpacing = '0px';

  // Rutina y día
  y += 60;
  ctx.font = '400 44px Anton';
  ctx.fillText(lineas(ctx, (rutina || '').toUpperCase(), 760, 1)[0] || '', W / 2, y);
  if (dia) {
    y += 40;
    ctx.fillStyle = 'rgba(255,255,255,0.86)';
    ctx.font = '600 24px Inter';
    ctx.fillText(lineas(ctx, dia, 760, 1)[0], W / 2, y);
  }

  // Estadísticas apiladas (como Strava: etiqueta pequeña y valor grande)
  y += 82;
  const yStats = y;
  for (const s of stats.filter((x) => x.valor)) {
    ctx.fillStyle = 'rgba(255,255,255,0.92)';
    ctx.font = '600 24px Inter';
    ctx.fillText(s.etiqueta, W / 2, y);
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 52px Inter';
    ctx.fillText(String(s.valor), W / 2, y + 56);
    y += 104;
  }

  // Figura con lo trabajado: pequeña, a la derecha, donde Strava dibuja el recorrido
  if (mapaSvgs.length) {
    ctx.shadowColor = 'rgba(0,0,0,0.35)';
    const alto = 205;
    const ancho = 92;
    const x0 = 800;
    for (let i = 0; i < mapaSvgs.length; i++) {
      const img = await svgAImagen(mapaSvgs[i], ancho, alto);
      ctx.drawImage(img, x0 + i * (ancho + 8), yStats - 30, ancho, alto);
    }
    if (grupos) {
      ctx.fillStyle = ORO;
      ctx.font = '700 15px Inter';
      ctx.letterSpacing = '3px';
      // Un grupo por línea si no caben juntos (nunca se parte un nombre)
      const partes = grupos.toUpperCase().split(' · ');
      const filas = ctx.measureText(partes.join(' · ')).width <= 230 ? [partes.join(' · ')] : partes.slice(0, 3);
      filas.forEach((l, i) => ctx.fillText(l, x0 + ancho + 4, yStats + alto + 4 + i * 22));
      ctx.letterSpacing = '0px';
    }
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
  }

  // Referencia de la rutina: los ejercicios en una línea fina
  y += 4;
  ctx.fillStyle = ORO;
  ctx.shadowBlur = 0;
  ctx.fillRect(W / 2 - 30, y - 6, 60, 3);
  ctx.shadowBlur = 16;
  y += 40;
  if (ejercicios.length) {
    ctx.fillStyle = 'rgba(255,255,255,0.88)';
    ctx.font = '500 20px Inter';
    for (const l of lineas(ctx, [...new Set(ejercicios)].join('  ·  '), 720, 2)) {
      ctx.fillText(l, W / 2, y);
      y += 30;
    }
  }

  // Dónde encontrar la rutina
  y += 24;
  ctx.fillStyle = ORO;
  ctx.font = '400 21px Audiowide';
  ctx.fillText(web, W / 2, y);
  if (usuario) {
    y += 34;
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.font = '600 19px Inter';
    ctx.fillText(usuario, W / 2, y);
  }

  return new Promise((ok, ko) => canvas.toBlob((b) => (b ? ok(b) : ko(new Error('No se pudo crear la imagen'))), 'image/jpeg', 0.9));
}
