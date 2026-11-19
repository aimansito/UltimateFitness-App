// Monta los vídeos de rutina: node montar.mjs [empuje|tiron] [--capturas] [--sin-capa]
//   1. Base: el clip original a 1080x1920 (fondo desenfocado a los lados) + negro para el cierre.
//   2. Fotogramas congelados en cada corte (para las transiciones).
//   3. Capa gráfica (portada, rótulos, transiciones, cierre) renderizada fotograma a fotograma.
//   4. Composición final con el audio original.
import path from 'node:path';
import fs from 'node:fs';
import { pathToFileURL } from 'node:url';
import { FORMATO, VIDEOS, CIERRE, MARCA } from './guion.mjs';
import { DIR, RAIZ, carpeta, barras } from './lib/rutas.mjs';
import { ffmpeg, ejecutar } from '../video-cambio/lib/ffmpeg.mjs';
import { abrirNavegador, cerrarNavegador } from '../video-cambio/lib/navegador.mjs';
import { figuraSvg } from '../video-cambio/lib/figura.mjs';
import { capturarApp, faltanCapturas, rutaCaptura } from './lib/capturas.mjs';

const { ancho: W, alto: H, fps: FPS } = FORMATO;
const args = process.argv.slice(2);
const elegidos = args.filter((a) => !a.startsWith('--'));
const claves = elegidos.length ? elegidos : Object.keys(VIDEOS);
const url = (ruta) => pathToFileURL(ruta).href;

async function duracion(archivo) {
  const s = await ejecutar('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', archivo]);
  return parseFloat(s.trim());
}

async function crearBase(origen, destino, fin) {
  // El original es 592x1280: se escala a lo alto con lanczos y un poco de nitidez, y los lados
  // se rellenan con el mismo plano desenfocado (sin recortar ni ampliar de más)
  await ffmpeg([
    '-i', barras(origen),
    '-filter_complex',
    `[0:v]split[a][b];` +
    `[a]scale=${W}:${H}:force_original_aspect_ratio=increase,crop=${W}:${H},gblur=sigma=38,eq=brightness=-0.1:saturation=0.85[fondo];` +
    `[b]scale=-2:${H}:flags=lanczos,cas=0.45[frente];` +
    `[fondo][frente]overlay=(W-w)/2:0,fps=${FPS},trim=duration=${fin},setpts=PTS-STARTPTS,` +
    `tpad=stop_mode=add:stop_duration=${CIERRE}:color=black,format=yuv420p[v]`,
    '-map', '[v]', '-c:v', 'libx264', '-preset', 'medium', '-crf', '9', '-an', barras(destino),
  ]);
}

async function congelar(base, segundo, destino) {
  const n = Math.round(segundo * FPS) - 1; // último fotograma antes del corte
  await ffmpeg(['-i', barras(base), '-vf', `select=eq(n\\,${n})`, '-frames:v', '1', barras(destino)]);
}

function datosEjercicios(video, fin) {
  let num = 0;
  const lista = video.ejercicios.map((e, i) => {
    if (!e.continua) num++;
    return { ...e, num, fin: video.ejercicios[i + 1]?.ini ?? fin, svg: figuraSvg(e.musculos, e.vista) };
  });
  // Un ejercicio partido en dos clips cuenta como uno: el bloque va del primero al último
  for (const e of lista) {
    const grupo = lista.filter((o) => o.num === e.num);
    e.inicioBloque = grupo[0].ini;
    e.finBloque = grupo[grupo.length - 1].fin;
  }
  return { lista, total: num };
}

async function abrirCapa(clave, datos) {
  const navegador = await abrirNavegador();
  const pagina = await navegador.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  pagina.on('pageerror', (e) => console.error(`  [${clave}] error en la página: ${e.message}`));
  await pagina.goto(url(path.join(DIR.escenas, 'capa.html')));
  await pagina.evaluate((d) => window.iniciar(d), datos);
  return pagina;
}

/** --prueba=1.2,5 : solo esos instantes, ya compuestos sobre la base, en build/<clave>/prueba-*.png */
async function renderPrueba(clave, datos, base, build, instantes) {
  const pagina = await abrirCapa(clave, datos);
  for (const t of instantes) {
    const capa = path.join(build, `capa-${t}.png`);
    await pagina.evaluate((s) => window.fijarTiempo(s), t);
    await pagina.screenshot({ path: capa, omitBackground: true });
    const n = Math.round(t * FPS);
    await ffmpeg(['-i', barras(base), '-i', barras(capa), '-filter_complex', `[0:v]select=eq(n\\,${n})[b];[b][1:v]overlay=0:0,scale=540:-1`, '-frames:v', '1', barras(path.join(build, `prueba-${t}.png`))]);
  }
  await pagina.close();
}

async function renderCapa(clave, datos, fotogramas, dirCapa) {
  fs.rmSync(dirCapa, { recursive: true, force: true });
  fs.mkdirSync(dirCapa, { recursive: true });
  const pagina = await abrirCapa(clave, datos);
  for (let f = 0; f < fotogramas; f++) {
    await pagina.evaluate((s) => window.fijarTiempo(s), f / FPS);
    await pagina.screenshot({ path: path.join(dirCapa, `f${String(f).padStart(4, '0')}.png`), omitBackground: true });
    if (f % 100 === 0) console.log(`  [${clave}] capa ${f}/${fotogramas}`);
  }
  await pagina.close();
}

async function montar(clave) {
  const video = VIDEOS[clave];
  const origen = path.resolve(RAIZ, video.origen);
  const build = carpeta(DIR.build, clave);
  const fin = Math.floor((await duracion(origen)) * FPS) / FPS;
  const total = fin + CIERRE;
  const fotogramas = Math.round(total * FPS);

  const base = path.join(build, 'base.mp4');
  const prueba = args.find((a) => a.startsWith('--prueba='));
  if (!prueba || !fs.existsSync(base)) {
    console.log(`[${clave}] base`);
    await crearBase(origen, base, fin);
  }

  console.log(`[${clave}] cortes`);
  const { lista, total: numEjercicios } = datosEjercicios(video, fin);
  const momentos = [
    { t: video.portadaFin, tipo: 'uf' },
    ...lista.slice(1).map((e) => ({ t: e.ini, tipo: 'lineas' })),
    { t: fin, tipo: 'lineas' },
  ];
  const cortes = [];
  for (const [i, m] of momentos.entries()) {
    const img = path.join(build, `congelado-${i}.png`);
    await congelar(base, m.t, img);
    cortes.push({ ...m, img: url(img) });
  }

  const datos = {
    titulo: video.titulo, grupos: video.grupos, duracion: video.duracion, web: MARCA.web,
    portadaFin: video.portadaFin, fin, cierre: CIERRE,
    ejercicios: lista, total: numEjercicios, cortes, app: url(rutaCaptura(clave)),
  };
  if (prueba) {
    await renderPrueba(clave, datos, base, build, prueba.split('=')[1].split(',').map(Number));
    return;
  }
  if (!args.includes('--sin-capa')) {
    console.log(`[${clave}] capa (${fotogramas} fotogramas)`);
    await renderCapa(clave, datos, fotogramas, path.join(build, 'capa'));
  }

  console.log(`[${clave}] composición`);
  fs.mkdirSync(DIR.salida, { recursive: true });
  const salida = path.join(DIR.salida, `rutina-${clave}.mp4`);
  await ffmpeg([
    '-i', barras(base),
    '-framerate', String(FPS), '-i', barras(path.join(build, 'capa', 'f%04d.png')),
    '-i', barras(origen),
    '-filter_complex',
    `[1:v]format=rgba[c];[0:v][c]overlay=0:0:format=auto,format=yuv420p[v];` +
    `[2:a]atrim=0:${fin},afade=t=out:st=${(fin - 0.7).toFixed(2)}:d=0.7,apad=whole_dur=${total}[a]`,
    '-map', '[v]', '-map', '[a]', '-t', String(total),
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '15', '-profile:v', 'high', '-pix_fmt', 'yuv420p',
    '-r', String(FPS), '-movflags', '+faststart', '-c:a', 'aac', '-b:a', '192k', barras(salida),
  ]);
  console.log(`[${clave}] listo: ${salida}`);
}

try {
  if (args.includes('--capturas') || faltanCapturas()) {
    console.log('Capturando la app…');
    await capturarApp();
  }
  await Promise.all(claves.map(montar));
} finally {
  await cerrarNavegador();
}
