// Genera los vídeos y los carruseles y los deja ordenados en para-publicar/.
//   node montar.mjs                 todo
//   node montar.mjs videos          solo vídeos      (o: posts)
//   node montar.mjs 03-carbos-o-proteina   solo uno (vídeo o post por su id)
//   node montar.mjs --capturas      vuelve a capturar la app (necesita la app local arrancada)
//   node montar.mjs --prueba=03-carbos-o-proteina:2,8   fotogramas sueltos en build/<id>/prueba-*.png
import path from 'node:path';
import fs from 'node:fs';
import { pathToFileURL } from 'node:url';
import { VIDEOS, POSTS, VOZ, MARCA } from './guion.mjs';
import { DIR, carpeta, barras } from './lib/rutas.mjs';
import { ffmpeg } from '../video-cambio/lib/ffmpeg.mjs';
import { generarVoz, lineaDeTiempo, crearAudio, srt } from './lib/tiempo.mjs';
import { abrirNavegador, cerrarNavegador } from '../video-cambio/lib/navegador.mjs';
import { capturarApp, faltanCapturas, rutaApp } from './lib/capturas.mjs';

const W = 1080, H = 1920, FPS = 30;
const args = process.argv.slice(2);
const filtros = args.filter((a) => !a.startsWith('--'));
const prueba = args.find((a) => a.startsWith('--prueba='))?.split('=')[1];
const quiere = (tipo, id) => !filtros.length || filtros.includes(tipo) || filtros.includes(id);
const url = (ruta) => pathToFileURL(ruta).href;

const FONDOS = {
  empuje: { archivo: '../empuje/empujeoriginal.mp4', desde: 1.6, hasta: 15.5 },
  tiron: { archivo: '../tiron/tironoriginal.mp4', desde: 1.8, hasta: 16.2 },
};
const HASHTAGS = '#gym #fitness #gymtok #nutricion #entrenamiento #rutina #ultimatefitness';

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

async function abrirPagina(plantilla, ancho, alto) {
  const navegador = await abrirNavegador();
  const pagina = await navegador.newPage({ viewport: { width: ancho, height: alto }, deviceScaleFactor: 1 });
  pagina.on('pageerror', (e) => console.error(`  [${plantilla}] error: ${e.message}`));
  await pagina.goto(url(path.join(DIR.escenas, plantilla)));
  return pagina;
}

async function montarVideo(v) {
  const build = carpeta(DIR.build, v.id);
  const externo = path.join(path.dirname(DIR.escenas), 'fuentes', `${v.id}.mp3`);
  const { frases, fragmentos, audios, total } = await lineaDeTiempo(v, { build: DIR.build, voz: VOZ, externo: fs.existsSync(externo) ? externo : null });
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
  fs.writeFileSync(path.join(destino, 'subtitulos.srt'), srt(fragmentos));
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
    generarVoz(videos, { build: DIR.build, voz: VOZ });
    await Promise.all(videos.map(montarVideo));
  }
} finally {
  await cerrarNavegador();
}
