// Genera los vídeos y los carruseles y los deja ordenados en para-publicar/.
//   node montar.mjs                 todo
//   node montar.mjs videos          solo vídeos      (o: posts)
//   node montar.mjs 03-carbos-o-proteina   solo uno (vídeo o post por su id)
//   node montar.mjs --capturas      vuelve a capturar la app (necesita la app local arrancada)
//   node montar.mjs --prueba=03-carbos-o-proteina:2,8   fotogramas sueltos en build/<id>/prueba-*.png
import path from 'node:path';
import fs from 'node:fs';
import { pathToFileURL } from 'node:url';
import { execFileSync } from 'node:child_process';
import { VIDEOS, POSTS, VOZ, MARCA } from './guion.mjs';
import { DIR, carpeta, barras } from './lib/rutas.mjs';
import { ffmpeg, ejecutar } from '../video-cambio/lib/ffmpeg.mjs';
import { abrirNavegador, cerrarNavegador } from '../video-cambio/lib/navegador.mjs';
import { capturarApp, faltanCapturas, rutaApp } from './lib/capturas.mjs';

const W = 1080, H = 1920, FPS = 30;
const ENTRADA = 0.35;   // silencio antes de la primera frase
const COLA = 1.8;       // el cierre se queda en pantalla después de la voz
const args = process.argv.slice(2);
const filtros = args.filter((a) => !a.startsWith('--'));
const prueba = args.find((a) => a.startsWith('--prueba='))?.split('=')[1];
const quiere = (tipo, id) => !filtros.length || filtros.includes(tipo) || filtros.includes(id);
const url = (ruta) => pathToFileURL(ruta).href;
const winPath = (p) => p.replace(/\//g, '\\');

const FONDOS = {
  empuje: { archivo: '../empuje/empujeoriginal.mp4', desde: 1.6, hasta: 15.5 },
  tiron: { archivo: '../tiron/tironoriginal.mp4', desde: 1.8, hasta: 16.2 },
};
const HASHTAGS = '#gym #fitness #gymtok #nutricion #entrenamiento #rutina #ultimatefitness';

async function duracion(archivo) {
  return parseFloat((await ejecutar('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', archivo])).trim());
}

// ---------------------------------------------------------------- voz
/** Sintetiza las frases que hayan cambiado (todas las de todos los vídeos en una sola llamada) */
function generarVoz(videos) {
  const pendientes = [];
  for (const v of videos) {
    const dir = carpeta(DIR.build, v.id, 'voz');
    v.frases.forEach((f, i) => {
      const base = path.join(dir, String(i));
      const hablado = f.voz ?? f.texto;
      const firma = `${VOZ.nombre}|${VOZ.velocidad}|${hablado}`;
      const previo = fs.existsSync(`${base}.txt`) ? fs.readFileSync(`${base}.txt`, 'utf8') : '';
      if (previo !== firma || !fs.existsSync(`${base}.wav`)) {
        pendientes.push({ salida: winPath(base), texto: hablado });
        fs.writeFileSync(`${base}.txt`, firma);
      }
    });
  }
  if (!pendientes.length) return;
  const lista = path.join(carpeta(DIR.build), 'voz-pendiente.json');
  fs.writeFileSync(lista, JSON.stringify(pendientes));
  console.log(`Voz: ${pendientes.length} frases…`);
  execFileSync('powershell.exe', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', path.join(path.dirname(DIR.escenas), 'lib', 'voz.ps1'),
    '-Lista', lista, '-Voz', VOZ.nombre, '-Velocidad', String(VOZ.velocidad)], { stdio: 'inherit' });
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

// Locución propia (ElevenLabs u otra) en fuentes/<id>.mp3: si existe, sustituye a la voz de Windows
const audioExterno = (v) => {
  const ruta = path.join(path.dirname(DIR.escenas), 'fuentes', `${v.id}.mp3`);
  return fs.existsSync(ruta) ? ruta : null;
};

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

async function lineaDeTiempo(v) {
  const dir = path.join(DIR.build, v.id, 'voz');
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
  const externo = audioExterno(v);
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
    tramos = voces.map((x) => { const tramo = [t, t + x.dur]; t += x.dur + VOZ.pausa; return tramo; });
    voces.forEach((x, i) => audios.push({ wav: x.wav, ini: tramos[i][0] }));
  }

  for (const [i, f] of v.frases.entries()) {
    const [ini, fin] = tramos[i];
    // Las palabras se reparten en el tramo real con el ritmo relativo de la voz de referencia
    const escala = (fin - ini) / voces[i].dur;
    const palabras = voces[i].palabras.map((p) => ({ ...p, t: ini + p.t * escala }));
    fragmentos.push(...fragmentar(palabras, fin));
    frases.push({ ...f, ini: i === 0 ? 0 : ini - 0.12 });
  }
  const total = tramos[tramos.length - 1][1] + COLA;
  frases.forEach((f, i) => { f.fin = frases[i + 1]?.ini ?? total; });
  return { frases, fragmentos, audios, total };
}

// ---------------------------------------------------------------- vídeo
async function crearFondo(v, total, destino) {
  const fondo = FONDOS[v.fondo];
  // Metraje de gimnasio desenfocado y oscurecido: ambiente sin competir con el texto.
  // Primero el tramo tratado y después se repite hasta cubrir el vídeo.
  const tramo = path.join(DIR.build, `fondo-${v.fondo}.mp4`);
  if (!fs.existsSync(tramo)) {
    await ffmpeg([
      '-ss', String(fondo.desde), '-t', String(fondo.hasta - fondo.desde), '-i', barras(path.resolve(path.dirname(DIR.escenas), fondo.archivo)),
      '-vf', `setpts=1.3*PTS,scale=${W}:${H}:force_original_aspect_ratio=increase,crop=${W}:${H},gblur=sigma=9,eq=brightness=-0.22:saturation=0.55,fps=${FPS},format=yuv420p`,
      '-an', '-c:v', 'libx264', '-preset', 'medium', '-crf', '14', barras(tramo),
    ]);
  }
  await ffmpeg(['-stream_loop', '-1', '-i', barras(tramo), '-t', String(total), '-c', 'copy', barras(destino)]);
}

async function crearAudio(audios, total, destino) {
  const entradas = audios.flatMap((a) => ['-i', barras(a.wav)]);
  const retardos = audios.map((a, i) => `[${i}:a]aresample=48000,adelay=${Math.round(a.ini * 1000)}|${Math.round(a.ini * 1000)}[a${i}]`).join(';');
  const mezcla = `${audios.map((_, i) => `[a${i}]`).join('')}amix=inputs=${audios.length}:normalize=0,loudnorm=I=-15:TP=-1.5:LRA=9,apad=whole_dur=${total}[s]`;
  await ffmpeg([...entradas, '-filter_complex', `${retardos};${mezcla}`, '-map', '[s]', '-ac', '2', '-ar', '48000', '-t', String(total), barras(destino)]);
}

async function abrirPagina(plantilla, ancho, alto) {
  const navegador = await abrirNavegador();
  const pagina = await navegador.newPage({ viewport: { width: ancho, height: alto }, deviceScaleFactor: 1 });
  pagina.on('pageerror', (e) => console.error(`  [${plantilla}] error: ${e.message}`));
  await pagina.goto(url(path.join(DIR.escenas, plantilla)));
  return pagina;
}

const srtTiempo = (s) => {
  const ms = Math.round(s * 1000);
  const p = (n, l = 2) => String(n).padStart(l, '0');
  return `${p(Math.floor(ms / 3600000))}:${p(Math.floor(ms / 60000) % 60)}:${p(Math.floor(ms / 1000) % 60)},${p(ms % 1000, 3)}`;
};

async function montarVideo(v) {
  const build = carpeta(DIR.build, v.id);
  const { frases, fragmentos, audios, total } = await lineaDeTiempo(v);
  const datos = {
    web: MARCA.web, usuario: MARCA.usuario, fragmentos,
    frases: frases.map((f) => ({ ...f, imagen: f.captura ? url(rutaApp(f.captura)) : null })),
  };

  if (prueba) {
    const [id, instantes] = prueba.split(':');
    if (id !== v.id) return;
    const fondo = path.join(build, 'fondo.mp4');
    if (!fs.existsSync(fondo)) await crearFondo(v, total, fondo);
    const pagina = await abrirPagina('video.html', W, H);
    await pagina.evaluate((d) => window.iniciar(d), datos);
    for (const t of instantes.split(',').map(Number)) {
      const capa = path.join(build, `capa-${t}.png`);
      await pagina.evaluate((s) => window.fijarTiempo(s), t);
      await pagina.screenshot({ path: capa, omitBackground: true });
      await ffmpeg(['-ss', String(t), '-i', barras(fondo), '-i', barras(capa), '-filter_complex', '[0:v][1:v]overlay=0:0,scale=540:-1', '-frames:v', '1', barras(path.join(build, `prueba-${t}.png`))]);
    }
    await pagina.close();
    console.log(`[${v.id}] duración ${total.toFixed(1)} s`);
    return;
  }

  console.log(`[${v.id}] ${total.toFixed(1)} s: fondo y audio`);
  const fondo = path.join(build, 'fondo.mp4');
  const audio = path.join(build, 'voz.m4a');
  await crearFondo(v, total, fondo);
  await crearAudio(audios, total, audio);

  const dirCapa = path.join(build, 'capa');
  fs.rmSync(dirCapa, { recursive: true, force: true });
  fs.mkdirSync(dirCapa, { recursive: true });
  const fotogramas = Math.round(total * FPS);
  const pagina = await abrirPagina('video.html', W, H);
  await pagina.evaluate((d) => window.iniciar(d), datos);
  for (let f = 0; f < fotogramas; f++) {
    await pagina.evaluate((s) => window.fijarTiempo(s), f / FPS);
    await pagina.screenshot({ path: path.join(dirCapa, `f${String(f).padStart(4, '0')}.png`), omitBackground: true });
    if (f % 150 === 0) console.log(`[${v.id}] capa ${f}/${fotogramas}`);
  }
  await pagina.close();

  const destino = carpeta(DIR.publicar, 'videos', v.id);
  await ffmpeg([
    '-i', barras(fondo), '-framerate', String(FPS), '-i', barras(path.join(dirCapa, 'f%04d.png')), '-i', barras(audio),
    '-filter_complex', '[1:v]format=rgba[c];[0:v][c]overlay=0:0:format=auto,format=yuv420p[v]',
    '-map', '[v]', '-map', '2:a', '-t', String(total),
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-profile:v', 'high', '-r', String(FPS), '-movflags', '+faststart',
    '-c:a', 'aac', '-b:a', '192k', barras(path.join(destino, 'video.mp4')),
  ]);

  // Subtítulos aparte (por si la red social los pide como archivo) y textos para publicar
  const srt = fragmentos.map((c, i) => `${i + 1}\n${srtTiempo(c.ini)} --> ${srtTiempo(c.fin)}\n${c.palabras.map((p) => p.w).join(' ')}\n`).join('\n');
  fs.writeFileSync(path.join(destino, 'subtitulos.srt'), srt);
  fs.writeFileSync(path.join(destino, 'guion.txt'), v.frases.map((f) => f.texto).join('\n') + '\n');
  const cuerpo = v.descripcion ?? `Todo esto lo tienes gratis en ${MARCA.web} (enlace en la bio).`;
  fs.writeFileSync(path.join(destino, 'descripcion.txt'), `${v.titulo}\n\n${cuerpo}\n\n${v.hashtags ?? HASHTAGS}\n`);
  console.log(`[${v.id}] listo`);
}

// ---------------------------------------------------------------- posts
async function montarPost(p) {
  const destino = carpeta(DIR.publicar, 'posts', p.id);
  const pagina = await abrirPagina('post.html', 1080, 1350);
  for (const [i, s] of p.slides.entries()) {
    const slide = { ...s };
    if (s.captura) slide.imagen = url(rutaApp(s.captura));
    if (s.visual?.captura) slide.visual = { imagen: url(rutaApp(s.visual.captura)) };
    await pagina.evaluate((d) => window.pintar(d), slide);
    await pagina.screenshot({ path: path.join(destino, `${i + 1}.png`) });
  }
  await pagina.close();
  fs.writeFileSync(path.join(destino, 'descripcion.txt'), `${p.texto}\n\n${HASHTAGS}\n`);
  console.log(`[post ${p.id}] listo`);
}

try {
  if (args.includes('--capturas') || faltanCapturas()) {
    console.log('Capturando la app…');
    await capturarApp();
  }
  const videos = VIDEOS.filter((v) => quiere('videos', v.id) || (prueba && prueba.startsWith(v.id)));
  const posts = prueba ? [] : POSTS.filter((p) => quiere('posts', p.id));
  for (const p of posts) await montarPost(p);
  if (videos.length) {
    generarVoz(videos);
    await Promise.all(videos.map(montarVideo));
  }
} finally {
  await cerrarNavegador();
}
