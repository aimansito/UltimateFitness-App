// Pista de voz: la locución recolocada en el tiempo del vídeo (intro sin voz + pausas del guion).
import path from 'node:path';
import { FUENTES } from '../guion.mjs';
import { RAIZ, barras } from './rutas.mjs';
import { ffmpeg } from './ffmpeg.mjs';
import { bloquesLocucion, VELOCIDAD_VOZ } from './tiempo.mjs';

export async function montarVoz(salida, duracionTotal) {
  const bloques = bloquesLocucion();
  const filtros = bloques.map((b, i) => {
    const inicioVideoMs = Math.round(b.inicioVideo * 1000);
    const dur = b.hasta - b.desde;
    // Cortes en mitad de los silencios, con microfundidos para que no haya chasquidos
    return (
      `[0:a]atrim=start=${b.desde}:end=${b.hasta},asetpts=PTS-STARTPTS,` +
      `afade=t=in:d=0.02,afade=t=out:st=${Math.max(0, dur - 0.04).toFixed(3)}:d=0.04,` +
      `atempo=${VELOCIDAD_VOZ},adelay=${inicioVideoMs}:all=1[b${i}]`
    );
  });
  const entradas = bloques.map((_, i) => `[b${i}]`).join('');
  filtros.push(
    `${entradas}amix=inputs=${bloques.length}:normalize=0:duration=longest,` +
      `highpass=f=70,loudnorm=I=-14:TP=-1.5:LRA=11,` +
      `apad=whole_dur=${duracionTotal.toFixed(3)},atrim=end=${duracionTotal.toFixed(3)},aresample=48000[voz]`
  );
  await ffmpeg([
    '-i', barras(path.resolve(RAIZ, FUENTES.locucion)),
    '-filter_complex', filtros.join(';'), '-map', '[voz]', '-ac', '2', '-c:a', 'pcm_s16le', barras(salida),
  ]);
}
