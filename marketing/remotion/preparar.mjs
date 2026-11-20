// Monta los vídeos de guion.mjs con Remotion.
//
//   node preparar.mjs                      todos
//   node preparar.mjs 13-creatina          solo ese (o varios ids)
//   node preparar.mjs --datos              solo voz + datos (para abrir `npm run estudio`)
//   node preparar.mjs --prueba=13-creatina:2,9.5   fotogramas sueltos en build/<id>/
//
// Locución propia (ElevenLabs): fuentes/<id>.mp3, una frase por línea del guion.txt.
// Resultado: ../contenido/para-publicar/videos/<id>/ (video.mp4, subtitulos.srt, guion.txt, descripcion.txt)
import path from 'node:path';
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { VIDEOS, VOZ, MARCA } from './guion.mjs';
import { generarVoz, lineaDeTiempo, crearAudio, duracion, srt } from '../contenido/lib/tiempo.mjs';
import { carpeta, barras } from '../contenido/lib/rutas.mjs';
import { ffmpeg } from '../video-cambio/lib/ffmpeg.mjs';

const RAIZ = path.dirname(fileURLToPath(import.meta.url));
const CONTENIDO = path.resolve(RAIZ, '../contenido');
const BUILD = path.join(RAIZ, 'build');
const PUBLICO = path.join(RAIZ, 'public');
const FPS = 30;

const args = process.argv.slice(2);
const ids = args.filter((a) => !a.startsWith('--'));
const soloDatos = args.includes('--datos');
const prueba = args.find((a) => a.startsWith('--prueba='))?.split('=')[1];
const elegidos = VIDEOS.filter((v) => (prueba ? prueba.startsWith(`${v.id}:`) : !ids.length || ids.includes(v.id)));
if (!elegidos.length) throw new Error(`ningún vídeo coincide con ${ids.join(', ') || prueba}`);

/** Recursos estáticos que usa la composición: logos, capturas de la app y metraje de fondo */
async function copiarRecursos() {
  const copiar = (de, a) => {
    fs.mkdirSync(path.dirname(a), { recursive: true });
    if (!fs.existsSync(a) || fs.statSync(a).mtimeMs < fs.statSync(de).mtimeMs) fs.copyFileSync(de, a);
  };
  for (const logo of ['logo.png', 'logo-small.png']) copiar(path.join(CONTENIDO, 'assets', logo), path.join(PUBLICO, logo));
  for (const f of fs.readdirSync(path.join(CONTENIDO, 'assets', 'app'))) copiar(path.join(CONTENIDO, 'assets', 'app', f), path.join(PUBLICO, 'app', f));
  const fondos = {};
  for (const nombre of ['empuje', 'tiron']) {
    const de = path.join(CONTENIDO, 'build', `fondo-${nombre}.mp4`);
    if (!fs.existsSync(de)) throw new Error(`falta ${de}: monta antes algún vídeo de contenido con ese fondo`);
    // El fondo va como secuencia de JPG: los decodificadores de vídeo de Remotion fallan a ratos al buscar fotogramas
    const dir = path.join(PUBLICO, 'fondos', nombre);
    const marca = path.join(dir, '.listo');
    if (!fs.existsSync(marca) || fs.statSync(marca).mtimeMs < fs.statSync(de).mtimeMs) {
      fs.rmSync(dir, { recursive: true, force: true });
      fs.mkdirSync(dir, { recursive: true });
      await ffmpeg(['-i', barras(de), '-q:v', '3', barras(path.join(dir, '%04d.jpg'))]);
      fs.writeFileSync(marca, '');
    }
    fondos[nombre] = { dir: `fondos/${nombre}`, n: fs.readdirSync(dir).filter((f) => f.endsWith('.jpg')).length };
  }
  return fondos;
}

const npx = (args) => execFileSync(process.execPath, [path.join(RAIZ, 'node_modules', '@remotion', 'cli', 'remotion-cli.js'), ...args], { cwd: RAIZ, stdio: 'inherit' });

const fondos = await copiarRecursos();
generarVoz(elegidos, { build: BUILD, voz: VOZ });

// Datos de todas las composiciones (también las no elegidas, para que el estudio las vea todas)
const rutaDatos = path.join(RAIZ, 'src', 'generado', 'videos.json');
const todos = fs.existsSync(rutaDatos) ? JSON.parse(fs.readFileSync(rutaDatos, 'utf8')) : {};

for (const v of elegidos) {
  const externo = path.join(RAIZ, 'fuentes', `${v.id}.mp3`);
  const tiene = fs.existsSync(externo);
  const { frases, fragmentos, audios, total } = await lineaDeTiempo(v, { build: BUILD, voz: VOZ, externo: tiene ? externo : null });
  const audio = path.join(carpeta(PUBLICO, 'voz'), `${v.id}.m4a`);
  await crearAudio(audios, total, audio);
  todos[v.id] = {
    id: v.id, fps: FPS, total, web: MARCA.web, usuario: MARCA.usuario,
    audio: `voz/${v.id}.m4a`, fondo: fondos[v.fondo],
    frases: frases.map(({ voz, ...f }) => f), fragmentos,
  };
  console.log(`[${v.id}] ${total.toFixed(1)} s · voz ${tiene ? 'propia' : 'de Windows'}`);
}
fs.mkdirSync(path.dirname(rutaDatos), { recursive: true });
fs.writeFileSync(rutaDatos, JSON.stringify(todos));

if (prueba) {
  const [id, instantes] = prueba.split(':');
  for (const t of instantes.split(',').map(Number)) {
    npx(['still', 'src/index.jsx', id, path.join(BUILD, id, `prueba-${t}.png`), `--frame=${Math.round(t * FPS)}`, '--gl=angle', '--scale=0.5', '--log=error']);
  }
} else if (!soloDatos) {
  for (const v of elegidos) {
    const destino = carpeta(CONTENIDO, 'para-publicar', 'videos', v.id);
    const render = () => npx(['render', 'src/index.jsx', v.id, path.join(destino, 'video.mp4'), '--gl=angle', '--codec=h264', '--crf=17', '--audio-bitrate=192k', '--log=error']);
    // El decodificador de vídeo de Remotion falla a veces al leer el fondo: un segundo intento lo resuelve
    try { render(); } catch { console.warn(`[${v.id}] reintentando el render`); render(); }
    const d = todos[v.id];
    fs.writeFileSync(path.join(destino, 'subtitulos.srt'), srt(d.fragmentos));
    fs.writeFileSync(path.join(destino, 'guion.txt'), v.frases.map((f) => f.texto).join('\n') + '\n');
    fs.writeFileSync(path.join(destino, 'descripcion.txt'), `${v.titulo}\n\n${v.descripcion}\n\n${v.hashtags}\n`);
    console.log(`[${v.id}] listo`);
  }
}
