// Voz, línea de tiempo y subtítulos. Lo comparten el montaje con Playwright (contenido/montar.mjs)
// y el de Remotion (remotion/preparar.mjs).
//
// Cada vídeo se describe como { id, frases: [{ texto, voz? }] }. La voz de Windows da el ritmo de
// referencia de cada palabra; si hay locución propia (ElevenLabs) se reparten las frases en sus pausas.
import path from 'node:path';
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { carpeta, barras } from './rutas.mjs';
import { ffmpeg, ejecutar } from '../../video-cambio/lib/ffmpeg.mjs';

const SCRIPT_VOZ = path.join(path.dirname(fileURLToPath(import.meta.url)), 'voz.ps1');
export const ENTRADA = 0.35;   // silencio antes de la primera frase
export const COLA = 1.8;       // el cierre se queda en pantalla después de la voz
const winPath = (p) => p.replace(/\//g, '\\');

export async function duracion(archivo) {
  return parseFloat((await ejecutar('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', archivo])).trim());
}

/** Sintetiza las frases que hayan cambiado (todas las de todos los vídeos en una sola llamada) */
export function generarVoz(videos, { build, voz }) {
  const pendientes = [];
  for (const v of videos) {
    const dir = carpeta(build, v.id, 'voz');
    v.frases.forEach((f, i) => {
      const base = path.join(dir, String(i));
      const hablado = f.voz ?? f.texto;
      const firma = `${voz.nombre}|${voz.velocidad}|${hablado}`;
      const previo = fs.existsSync(`${base}.txt`) ? fs.readFileSync(`${base}.txt`, 'utf8') : '';
      if (previo !== firma || !fs.existsSync(`${base}.wav`)) {
        pendientes.push({ salida: winPath(base), texto: hablado });
        fs.writeFileSync(`${base}.txt`, firma);
      }
    });
  }
  if (!pendientes.length) return;
  const lista = path.join(carpeta(build), 'voz-pendiente.json');
  fs.writeFileSync(lista, JSON.stringify(pendientes));
  console.log(`Voz: ${pendientes.length} frases…`);
  execFileSync('powershell.exe', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', SCRIPT_VOZ,
    '-Lista', lista, '-Voz', voz.nombre, '-Velocidad', String(voz.velocidad)], { stdio: 'inherit' });
}

/** Instante de cada palabra del texto en pantalla a partir de las marcas de la voz */
function palabrasConTiempo(texto, marcas, dur) {
  const tokens = texto.split(/\s+/).filter(Boolean);
  // La voz repite la marca de los números («500 calorías» aparece dos veces): se agrupan
  const grupos = [];
  for (const m of marcas) {
    const ultimo = grupos[grupos.length - 1];
    if (ultimo && ultimo.w === m.w) ultimo.tiempos.push(m.t);
    else grupos.push({ w: m.w, tiempos: [m.t] });
  }
  const tiempos = [];
  for (const g of grupos) {
    const n = g.w.split(/\s+/).filter(Boolean).length;
    for (let j = 0; j < n; j++) tiempos.push(g.tiempos[Math.min(j, g.tiempos.length - 1)]);
  }
  if (tiempos.length === tokens.length) return tokens.map((w, i) => ({ w, t: tiempos[i] }));
  // Si no casan, se reparte por longitud de palabra (aviso para revisar el texto)
  console.warn(`  aviso: subtítulos repartidos por longitud en «${texto.slice(0, 40)}…» (${tiempos.length} marcas / ${tokens.length} palabras)`);
  const total = tokens.reduce((s, w) => s + w.length + 1, 0);
  let acum = 0;
  return tokens.map((w) => { const t = (acum / total) * dur; acum += w.length + 1; return { w, t }; });
}

/** Trocea la frase en golpes de 1 a 4 palabras, cortando también en la puntuación */
function fragmentar(palabras, finFrase) {
  const fragmentos = [];
  let actual = [];
  palabras.forEach((p, i) => {
    actual.push(p);
    const corte = /[,.:;?!]$/.test(p.w) || actual.length >= 4 || i === palabras.length - 1;
    if (corte) { fragmentos.push(actual); actual = []; }
  });
  return fragmentos.map((ps, i) => ({
    palabras: ps,
    ini: ps[0].t,
    fin: fragmentos[i + 1] ? fragmentos[i + 1][0].t : Math.min(finFrase, ps[ps.length - 1].t + 0.9),
  }));
}

async function silencios(archivo) {
  const salida = await ejecutar('ffmpeg', ['-hide_banner', '-i', archivo, '-af', 'silencedetect=noise=-38dB:d=0.12', '-f', 'null', '-']);
  const lista = [];
  for (const m of salida.matchAll(/silence_start: ([\d.]+)[\s\S]*?silence_end: ([\d.]+)/g)) lista.push({ ini: +m[1], fin: +m[2] });
  return lista;
}

/**
 * Elige en qué pausas del audio empieza cada frase. Las pausas entre frases y dentro de una frase
 * duran parecido, así que se combina la duración de la pausa con dónde «debería» caer el corte
 * según lo que dura cada frase con la voz de Windows (programación dinámica, en orden).
 */
function elegirCortes(pausas, pesos, iniVoz, finVoz) {
  const n = pesos.length - 1;
  const total = pesos.reduce((a, b) => a + b, 0);
  const esperado = [];
  let acum = 0;
  for (let k = 0; k < n; k++) { acum += pesos[k]; esperado.push(iniVoz + (acum / total) * (finVoz - iniVoz)); }
  const cand = pausas.filter((p) => p.ini > iniVoz + 0.3 && p.fin < finVoz - 0.3);
  if (cand.length < n) return null;
  const puntos = (k, j) => 4 * (cand[j].fin - cand[j].ini) - Math.abs((cand[j].ini + cand[j].fin) / 2 - esperado[k]);
  const mejor = Array.from({ length: n }, () => new Array(cand.length).fill(-Infinity));
  const previo = Array.from({ length: n }, () => new Array(cand.length).fill(-1));
  for (let j = 0; j < cand.length; j++) mejor[0][j] = puntos(0, j);
  for (let k = 1; k < n; k++) {
    for (let j = k; j < cand.length; j++) {
      for (let i = k - 1; i < j; i++) {
        const s = mejor[k - 1][i] + puntos(k, j);
        if (s > mejor[k][j]) { mejor[k][j] = s; previo[k][j] = i; }
      }
    }
  }
  let j = mejor[n - 1].indexOf(Math.max(...mejor[n - 1]));
  const elegidos = [];
  for (let k = n - 1; k >= 0; k--) { elegidos.unshift(cand[j]); j = previo[k][j]; }
  return elegidos;
}

/**
 * Planos (con ini/fin), fragmentos de subtítulos, pistas de audio y duración total del vídeo.
 * `externo` es la ruta de la locución propia, o null para usar la voz de Windows.
 */
export async function lineaDeTiempo(v, { build, voz, externo }) {
  const dir = path.join(build, v.id, 'voz');
  const frases = [], fragmentos = [], audios = [];
  const voces = [];
  for (const [i, f] of v.frases.entries()) {
    const wav = path.join(dir, `${i}.wav`);
    const dur = await duracion(wav);
    const marcas = JSON.parse(fs.readFileSync(path.join(dir, `${i}.json`), 'utf8').replace(/^﻿/, ''));
    voces.push({ wav, dur, palabras: palabrasConTiempo(f.texto, marcas, dur) });
  }

  // Tramos de voz de cada frase: [inicio, fin] en segundos del vídeo
  let tramos;
  if (externo) {
    const durExterno = await duracion(externo);
    const pausas = await silencios(externo);
    const iniVoz = pausas[0] && pausas[0].ini < 0.05 ? pausas[0].fin : 0;
    const ultima = pausas[pausas.length - 1];
    const finVoz = ultima && ultima.fin > durExterno - 0.05 ? ultima.ini : durExterno;
    const cortes = elegirCortes(pausas, voces.map((x) => x.dur), iniVoz, finVoz);
    if (!cortes) throw new Error(`${v.id}: el audio no tiene pausas suficientes para separar las ${v.frases.length} frases`);
    const limites = [iniVoz, ...cortes.flatMap((c) => [c.ini, c.fin]), finVoz];
    tramos = v.frases.map((_, i) => [limites[2 * i] + ENTRADA, limites[2 * i + 1] + ENTRADA]);
    audios.push({ wav: externo, ini: ENTRADA });
    console.log(`[${v.id}] audio propio: ${tramos.map(([a, b]) => `${a.toFixed(1)}-${b.toFixed(1)}`).join(' | ')}`);
  } else {
    let t = ENTRADA;
    tramos = voces.map((x) => { const tramo = [t, t + x.dur]; t += x.dur + voz.pausa; return tramo; });
    voces.forEach((x, i) => audios.push({ wav: x.wav, ini: tramos[i][0] }));
  }

  for (const [i, f] of v.frases.entries()) {
    const [ini, fin] = tramos[i];
    // Las palabras se reparten en el tramo real con el ritmo relativo de la voz de referencia
    const escala = (fin - ini) / voces[i].dur;
    const palabras = voces[i].palabras.map((p) => ({ ...p, t: ini + p.t * escala }));
    fragmentos.push(...fragmentar(palabras, fin));
    frases.push({ ...f, ini: i === 0 ? 0 : ini - 0.12, habla: [ini, fin] });
  }
  const total = tramos[tramos.length - 1][1] + COLA;
  frases.forEach((f, i) => { f.fin = frases[i + 1]?.ini ?? total; });
  return { frases, fragmentos, audios, total };
}

/** Mezcla las pistas de voz en su sitio y normaliza el volumen (-15 LUFS, lo que piden las redes) */
export async function crearAudio(audios, total, destino) {
  const entradas = audios.flatMap((a) => ['-i', barras(a.wav)]);
  const retardos = audios.map((a, i) => `[${i}:a]aresample=48000,adelay=${Math.round(a.ini * 1000)}|${Math.round(a.ini * 1000)}[a${i}]`).join(';');
  const mezcla = `${audios.map((_, i) => `[a${i}]`).join('')}amix=inputs=${audios.length}:normalize=0,loudnorm=I=-15:TP=-1.5:LRA=9,apad=whole_dur=${total}[s]`;
  await ffmpeg([...entradas, '-filter_complex', `${retardos};${mezcla}`, '-map', '[s]', '-ac', '2', '-ar', '48000', '-t', String(total), barras(destino)]);
}

const srtTiempo = (s) => {
  const ms = Math.round(s * 1000);
  const p = (n, l = 2) => String(n).padStart(l, '0');
  return `${p(Math.floor(ms / 3600000))}:${p(Math.floor(ms / 60000) % 60)}:${p(Math.floor(ms / 1000) % 60)},${p(ms % 1000, 3)}`;
};

export const srt = (fragmentos) =>
  fragmentos.map((c, i) => `${i + 1}\n${srtTiempo(c.ini)} --> ${srtTiempo(c.fin)}\n${c.palabras.map((p) => p.w).join(' ')}\n`).join('\n');
