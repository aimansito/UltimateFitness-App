// Capa de rótulos sobre todo el vídeo: subtítulos palabra a palabra, rótulos de la intro,
// sello de marca con el capítulo y degradados de legibilidad. Se calcula qué se ve en cada
// fotograma, se pinta cada estado distinto una sola vez y se enlaza a su fotograma.
import path from 'node:path';
import fs from 'node:fs';
import { LOCUCION, ROTULOS, SUBTITULOS } from '../guion.mjs';
import { FPS, fotogramaDeTiempo, bloquesLocucion, aTiempoDeVideo } from './tiempo.mjs';
import { abrirPlantilla } from './escenas.mjs';

/** Trocea una frase en grupos cortos de palabras */
function trocear(palabras) {
  const grupos = [];
  let actual = [];
  for (const p of palabras) {
    const letras = actual.reduce((n, x) => n + x.length + 1, 0) + p.length;
    if (actual.length >= SUBTITULOS.maxPalabras || (actual.length > 0 && letras > SUBTITULOS.maxLetras)) {
      grupos.push(actual);
      actual = [];
    }
    actual.push(p);
  }
  if (actual.length) grupos.push(actual);
  // Una palabra suelta al final queda pobre: se une al grupo anterior si cabe
  if (grupos.length > 1 && grupos[grupos.length - 1].length === 1 && grupos[grupos.length - 2].length < SUBTITULOS.maxPalabras + 1) {
    const suelta = grupos.pop();
    if (grupos[grupos.length - 1].join(' ').length + suelta[0].length < SUBTITULOS.maxLetras + 6) grupos[grupos.length - 1].push(...suelta);
    else grupos.push(suelta);
  }
  return grupos;
}

/** Tramos [fotogramaIni, fotogramaFin, lineas, grande] con lo que se lee en cada momento */
function tramosDeTexto() {
  const tramos = [];

  // Rótulos de la intro (*palabra* = dorada)
  for (const [t0, t1, lineas] of ROTULOS) {
    tramos.push({
      ini: fotogramaDeTiempo(t0) + 3,
      fin: fotogramaDeTiempo(t1) - 2,
      grande: true,
      lineas: lineas.map((l) => l.split(' ').map((p) => ({ t: p.replace(/\*/g, ''), a: p.includes('*') }))),
    });
  }

  // Subtítulos de la locución: cada palabra se ilumina cuando se dice
  const bloques = bloquesLocucion();
  for (const [ini, fin, texto] of LOCUCION.frases) {
    const palabras = texto.toUpperCase().split(/\s+/);
    const pesos = palabras.map((p) => p.length + 2);
    const total = pesos.reduce((a, b) => a + b, 0);
    let t = ini;
    const tiempos = palabras.map((_, i) => {
      const inicio = t;
      t += ((fin - ini) * pesos[i]) / total;
      return inicio;
    });
    let n = 0;
    const grupos = trocear(palabras);
    grupos.forEach((grupo, g) => {
      grupo.forEach((_, i) => {
        const idx = n + i;
        const desde = tiempos[idx];
        const ultimaDelGrupo = i === grupo.length - 1;
        const ultimaDeLaFrase = idx === palabras.length - 1;
        const hasta = ultimaDeLaFrase ? fin : tiempos[idx + 1];
        tramos.push({
          ini: Math.round(aTiempoDeVideo(desde, bloques) * FPS),
          fin: Math.round((aTiempoDeVideo(Math.min(hasta, fin), bloques) + (ultimaDeLaFrase ? 0.15 : 0)) * FPS),
          grande: false,
          lineas: [grupo.map((p, j) => ({ t: p, a: j === i }))],
          grupo: `${ini}-${g}`,
          ultimaDelGrupo,
        });
      });
      n += grupo.length;
    });
  }
  return tramos.sort((a, b) => a.ini - b.ini);
}

/** Estado visible en cada fotograma del vídeo */
export function estadosPorFotograma(linea) {
  const tramos = tramosDeTexto();
  const estados = [];
  for (let f = 0; f < linea.total; f++) {
    const plano = linea.planos.find((p) => f >= p.corte && f < p.fin) || linea.planos[linea.planos.length - 1];
    const esMetraje = Boolean(plano.clip) && !plano.capa; // los planos con capa (tarjetas) llevan su propio sello
    const subY = plano.subY === false ? null : plano.subY ?? SUBTITULOS.yPorDefecto;
    const tramo = subY === null ? null : tramos.find((t) => f >= t.ini && f < t.fin);
    estados.push({
      sello: esMetraje ? plano.capitulo ?? '' : null, // null = sin sello (la escena ya lleva su logo)
      degradado: esMetraje,
      y: subY,
      grande: tramo?.grande || false,
      lineas: tramo ? tramo.lineas : [],
    });
  }
  return estados;
}

/** Pinta los estados distintos y deja en `carpeta` una imagen por fotograma (f00000.png...) */
export async function renderRotulos(linea, carpeta) {
  fs.rmSync(carpeta, { recursive: true, force: true });
  fs.mkdirSync(path.join(carpeta, 'estados'), { recursive: true });
  const estados = estadosPorFotograma(linea);
  const pagina = await abrirPlantilla('rotulos', {});
  const pintados = new Map();
  for (let f = 0; f < estados.length; f++) {
    const clave = JSON.stringify(estados[f]);
    if (!pintados.has(clave)) {
      const archivo = path.join(carpeta, 'estados', `e${String(pintados.size).padStart(4, '0')}.png`);
      await pagina.evaluate((e) => window.pintar(e), estados[f]);
      await pagina.screenshot({ path: archivo, omitBackground: true });
      pintados.set(clave, archivo);
    }
    const destino = path.join(carpeta, `f${String(f).padStart(5, '0')}.png`);
    try {
      fs.linkSync(pintados.get(clave), destino);
    } catch {
      fs.copyFileSync(pintados.get(clave), destino);
    }
  }
  await pagina.close();
  return pintados.size;
}
