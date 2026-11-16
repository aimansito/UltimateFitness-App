// Planos de metraje: recorta el clip, lo alarga (cámara lenta con interpolación y/o ida y vuelta),
// lo coloca entero en 1080x1920 sobre un fondo difuminado, con un zoom suave y el color del capítulo.
import path from 'node:path';
import { CLIPS, FORMATO, FUENTES } from '../guion.mjs';
import { RAIZ, barras } from './rutas.mjs';
import { ffmpeg, CODEC_INTERMEDIO } from './ffmpeg.mjs';

const { ancho: W, alto: H, fps: FPS } = FORMATO;

// Color por capítulo: el recuerdo va desaturado y cálido, el progreso vivo, el estancamiento casi sin color
const COLORES = {
  recuerdo: 'eq=saturation=0.68:contrast=1.04:brightness=0.01,colorbalance=rs=0.04:gs=0.01:bs=-0.05',
  vivo: 'eq=saturation=1.14:contrast=1.07',
  apagado: 'eq=saturation=0.32:contrast=0.98:brightness=-0.03',
  oscuro: 'eq=saturation=0.5:contrast=0.95:brightness=-0.2,gblur=sigma=5',
  fondo: 'eq=saturation=0.9:contrast=1.03:brightness=-0.05',
};

export const videoFuente = (clip) => path.resolve(RAIZ, clip?.archivo || FUENTES.video);

export async function renderClip(plano, salida) {
  const clip = CLIPS[plano.clip];
  const N = plano.fotogramas;
  const margen = 0.04; // fuera los fotogramas mezclados de los cortes originales
  const ini = clip.ini + margen;
  const dur = clip.fin - clip.ini - 2 * margen;
  const [cw, ch, cx, cy] = clip.recorte;

  const bumeran = plano.modo === 'bumeran';
  const disponible = bumeran ? dur * 2 : dur;
  const factor = Math.max(1, (N / FPS + 0.25) / disponible); // cuánto hay que ralentizar
  const [z0, z1] = plano.zoom || [1, 1.06];
  const ax = plano.anclaX ?? 0.5;
  const ay = plano.anclaY ?? 0.5;

  const pasos = [`[0:v]crop=${cw}:${ch}:${cx}:${cy},setsar=1,fps=${FPS}[base]`];
  let actual = 'base';
  if (bumeran) {
    pasos.push(`[base]split[ida][copia];[copia]reverse[vuelta];[ida][vuelta]concat=n=2:v=1:a=0[bum]`);
    actual = 'bum';
  }
  // 1) Duración: cámara lenta con interpolación de movimiento, sobre el clip limpio de bloques
  const tiempo = [
    'deblock=filter=weak:block=4',
    `setpts=${factor.toFixed(4)}*(PTS-STARTPTS)`,
    factor > 1.05 ? `minterpolate=fps=${FPS}:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1` : `fps=${FPS}`,
    'tpad=stop_mode=clone:stop_duration=2',
    `trim=end_frame=${N}`,
    'setpts=PTS-STARTPTS',
  ];
  pasos.push(`[${actual}]${tiempo.join(',')},split[nitido][paraFondo]`);

  // 2) Encuadre: el clip entero, sin recortarlo (ampliarlo de más lo pixela), y detrás una copia
  //    difuminada que rellena lo que sobra de la pantalla vertical. Todo al doble de tamaño para
  //    que el zoom posterior sea suave.
  pasos.push(
    `[paraFondo]scale=${W / 4}:${H / 4}:force_original_aspect_ratio=increase,crop=${W / 4}:${H / 4},` +
      `gblur=sigma=14,eq=brightness=-0.16:saturation=0.85,scale=${W * 2}:${H * 2}:flags=bicubic[fondo]`
  );
  pasos.push(`[nitido]scale=${W * 2}:${H * 2}:force_original_aspect_ratio=decrease:flags=lanczos+accurate_rnd[frente]`);
  const final = [
    `zoompan=z='${z0}+(${z1}-${z0})*on/${N}':x='(iw-iw/zoom)*${ax}':y='(ih-ih/zoom)*${ay}':d=1:s=${W}x${H}:fps=${FPS}`,
    'cas=0.35', // enfoque suave que no resalta los bloques de compresión
    COLORES[plano.color] || COLORES.vivo,
    'vignette=PI/6',
    'format=yuv420p',
  ];
  pasos.push(`[fondo][frente]overlay=(W-w)/2:(H-h)/2,${final.join(',')}[v]`);

  await ffmpeg([
    '-ss', ini.toFixed(4), '-t', dur.toFixed(4), '-i', barras(videoFuente(clip)),
    '-filter_complex', pasos.join(';'), '-map', '[v]', '-frames:v', String(N),
    ...CODEC_INTERMEDIO, barras(salida),
  ]);
  return factor;
}

/** Foto suelta (jpeg) recortada y a 1080 de ancho */
export async function prepararFoto(origen, salida, recorte) {
  const filtros = [recorte ? `crop=${recorte.join(':')}` : null, `scale=${W}:-2:flags=lanczos`].filter(Boolean).join(',');
  await ffmpeg(['-i', barras(path.resolve(RAIZ, origen)), '-frames:v', '1', '-vf', filtros, barras(salida)]);
}

/** Fotograma fijo de un clip (las «fotos»), ya recortado y a 1080 de ancho */
export async function extraerFoto(nombreClip, salida) {
  const clip = CLIPS[nombreClip];
  const [cw, ch, cx, cy] = clip.recorte;
  const instante = (clip.ini + clip.fin) / 2;
  await ffmpeg([
    '-ss', instante.toFixed(3), '-i', barras(videoFuente(clip)), '-frames:v', '1',
    '-vf', `crop=${cw}:${ch}:${cx}:${cy},scale=${W}:-2:flags=lanczos,unsharp=5:5:0.6`,
    barras(salida),
  ]);
}
