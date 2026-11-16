// Rutas del proyecto de vídeo. Todo lo generado va a build/ (intermedio) y salida/ (final).
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

export const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const RAIZ_REPO = path.resolve(RAIZ, '..', '..');

export const DIR = {
  escenas: path.join(RAIZ, 'escenas'),
  assets: path.join(RAIZ, 'assets'),
  build: path.join(RAIZ, 'build'),
  salida: path.join(RAIZ, 'salida'),
};

/** Carpeta dentro de build/, creada si no existe */
export function carpetaBuild(...partes) {
  const dir = path.join(DIR.build, ...partes);
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

/** Ruta con barras normales: ffmpeg y las URL file:// las prefieren así en Windows */
export const barras = (ruta) => ruta.replace(/\\/g, '/');
