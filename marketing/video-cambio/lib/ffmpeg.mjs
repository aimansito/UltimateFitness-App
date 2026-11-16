// Ejecución de ffmpeg / ffprobe con errores legibles.
import { spawn } from 'node:child_process';

export function ejecutar(programa, args, { silencioso = true } = {}) {
  return new Promise((resolver, rechazar) => {
    const proceso = spawn(programa, args, { windowsHide: true });
    let salida = '';
    proceso.stdout.on('data', (d) => (salida += d));
    proceso.stderr.on('data', (d) => {
      salida += d;
      if (!silencioso) process.stderr.write(d);
    });
    proceso.on('error', rechazar);
    proceso.on('close', (codigo) => {
      if (codigo === 0) resolver(salida);
      else rechazar(new Error(`${programa} terminó con código ${codigo}\n${salida.split('\n').slice(-25).join('\n')}`));
    });
  });
}

export const ffmpeg = (args, opciones) => ejecutar('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...args], opciones);

export async function numFotogramas(archivo) {
  const salida = await ejecutar('ffprobe', [
    '-v', 'error', '-select_streams', 'v:0', '-count_frames',
    '-show_entries', 'stream=nb_read_frames', '-of', 'csv=p=0', archivo,
  ]);
  return parseInt(salida.trim(), 10);
}

/** Codificación intermedia: casi sin pérdida y con los mismos parámetros en todos los planos */
export const CODEC_INTERMEDIO = ['-c:v', 'libx264', '-preset', 'fast', '-crf', '8', '-pix_fmt', 'yuv420p', '-r', '30', '-video_track_timescale', '15360', '-an'];
