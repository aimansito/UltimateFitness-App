// Navegador sin interfaz (Playwright) para capturar la app y renderizar las escenas HTML.
// Playwright ya está instalado en frontend/: se carga desde ahí para no duplicar dependencias.
import { createRequire } from 'node:module';
import path from 'node:path';
import { RAIZ_REPO } from './rutas.mjs';

const requireFrontend = createRequire(path.join(RAIZ_REPO, 'frontend', 'package.json'));

export function cargarDelFrontend(modulo) {
  return requireFrontend(modulo);
}

let navegador = null;

export async function abrirNavegador() {
  if (!navegador) {
    const { chromium } = cargarDelFrontend('playwright');
    navegador = await chromium.launch();
  }
  return navegador;
}

export async function cerrarNavegador() {
  if (navegador) {
    await navegador.close();
    navegador = null;
  }
}
