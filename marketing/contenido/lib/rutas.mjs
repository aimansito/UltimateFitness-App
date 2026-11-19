// Rutas del proyecto de contenido. build/ es intermedio; para-publicar/ es lo que se sube a redes.
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

export const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export const DIR = {
  escenas: path.join(RAIZ, 'escenas'),
  assets: path.join(RAIZ, 'assets'),
  build: path.join(RAIZ, 'build'),
  publicar: path.join(RAIZ, 'para-publicar'),
};

export function carpeta(...partes) {
  const dir = path.join(...partes);
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

export const barras = (ruta) => ruta.replace(/\\/g, '/');
