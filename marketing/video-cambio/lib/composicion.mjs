// Composición final: encadena los planos con sus transiciones (centradas en el tiempo del compás),
// superpone la capa de rótulos y añade la voz.
import path from 'node:path';
import { FORMATO } from '../guion.mjs';
import { barras } from './rutas.mjs';
import { ffmpeg } from './ffmpeg.mjs';

const { fps: FPS } = FORMATO;

/** Une todos los planos en un solo vídeo sin audio */
export async function encadenarPlanos(linea, archivoDe, salida) {
  const entradas = [];
  const filtros = [];
  linea.planos.forEach((p, i) => {
    entradas.push('-i', barras(archivoDe(p)));
    filtros.push(`[${i}:v]settb=AVTB,fps=${FPS},format=yuv420p,setpts=PTS-STARTPTS[p${i}]`);
  });
  let acumulado = 'p0';
  linea.planos.slice(1).forEach((p, k) => {
    const i = k + 1;
    const dur = p.entrada.fotogramas / FPS;
    const desde = (p.corte - p.asaIni) / FPS; // la transición queda centrada en el corte
    const etiqueta = `x${i}`;
    filtros.push(`[${acumulado}][p${i}]xfade=transition=${p.entrada.tipo}:duration=${dur.toFixed(4)}:offset=${desde.toFixed(4)}[${etiqueta}]`);
    acumulado = etiqueta;
  });
  await ffmpeg([
    ...entradas, '-filter_complex', filtros.join(';'), '-map', `[${acumulado}]`,
    '-frames:v', String(linea.total),
    '-c:v', 'libx264', '-preset', 'fast', '-crf', '8', '-pix_fmt', 'yuv420p', '-r', String(FPS), '-an', barras(salida),
  ]);
}

/** Vídeo final: base + rótulos + voz, listo para subir (H.264 + AAC, 1080x1920) */
export async function exportarFinal({ base, carpetaRotulos, voz, salida, total }) {
  const dur = total / FPS;
  const filtro =
    `[1:v]format=rgba[rot];[0:v][rot]overlay=0:0:format=auto,` +
    `fade=t=in:st=0:d=0.25,fade=t=out:st=${(dur - 0.5).toFixed(3)}:d=0.5,format=yuv420p[v];` +
    `[2:a]afade=t=out:st=${(dur - 0.6).toFixed(3)}:d=0.6[a]`;
  await ffmpeg([
    '-i', barras(base),
    '-framerate', String(FPS), '-i', barras(path.join(carpetaRotulos, 'f%05d.png')),
    '-i', barras(voz),
    '-filter_complex', filtro, '-map', '[v]', '-map', '[a]',
    '-frames:v', String(total),
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '13', '-profile:v', 'high', '-pix_fmt', 'yuv420p', '-r', String(FPS),
    '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-movflags', '+faststart', '-shortest', barras(salida),
  ]);
}
