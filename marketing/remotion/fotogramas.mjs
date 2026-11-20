// Hoja de contacto rápida: empaqueta una vez y saca fotogramas sueltos de varios vídeos.
//   node fotogramas.mjs 12-despues-de-entrenar:1.5,6,20 14-no-pierdo-grasa:2,14
// Deja build/hoja-<id>.png (a media resolución).
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import { ffmpeg } from '../video-cambio/lib/ffmpeg.mjs';

const RAIZ = path.dirname(fileURLToPath(import.meta.url));
const serveUrl = await bundle({ entryPoint: path.join(RAIZ, 'src', 'index.jsx') });
for (const arg of process.argv.slice(2)) {
  const [id, lista] = arg.split(':');
  const dir = path.join(RAIZ, 'build', id);
  fs.mkdirSync(dir, { recursive: true });
  const composition = await selectComposition({ serveUrl, id, chromiumOptions: { gl: 'angle' } });
  const tiempos = lista.split(',').map(Number);
  const archivos = [];
  for (const t of tiempos) {
    const salida = path.join(dir, `f-${t}.png`);
    await renderStill({ composition, serveUrl, output: salida, frame: Math.min(composition.durationInFrames - 1, Math.round(t * 30)), scale: 0.25, chromiumOptions: { gl: 'angle' } });
    archivos.push(salida);
  }
  await ffmpeg([...archivos.flatMap((a) => ['-i', a.replace(/\\/g, '/')]), '-filter_complex', `hstack=inputs=${archivos.length}`, path.join(RAIZ, 'build', `hoja-${id}.png`).replace(/\\/g, '/')]);
  console.log(`hoja-${id}.png`);
}
