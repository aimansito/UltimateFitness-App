// Escenas HTML (logo, app, tarjetas, cierre) renderizadas fotograma a fotograma con el navegador.
// Cada plantilla expone window.iniciar(datos) y window.fijarTiempo(segundos): así el resultado
// es determinista y se puede volver a generar idéntico.
import path from 'node:path';
import fs from 'node:fs';
import { pathToFileURL } from 'node:url';
import { FORMATO } from '../guion.mjs';
import { abrirNavegador } from './navegador.mjs';
import { DIR, barras } from './rutas.mjs';
import { ffmpeg, CODEC_INTERMEDIO } from './ffmpeg.mjs';

const { ancho: W, alto: H, fps: FPS } = FORMATO;

export const urlArchivo = (ruta) => pathToFileURL(ruta).href;

export async function abrirPlantilla(nombre, datos) {
  const navegador = await abrirNavegador();
  const pagina = await navegador.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  pagina.on('pageerror', (e) => console.error(`  [${nombre}] error en la página: ${e.message}`));
  await pagina.goto(urlArchivo(path.join(DIR.escenas, `${nombre}.html`)));
  await pagina.evaluate((d) => window.iniciar(d), datos);
  return pagina;
}

/**
 * Renderiza una escena opaca a vídeo. Los primeros `asaIni` fotogramas (la transición de entrada)
 * muestran el estado inicial; la animación arranca justo en el corte.
 */
export async function renderEscena({ plantilla, datos, fotogramas, asaIni, carpeta, salida, fondo = null }) {
  fs.rmSync(carpeta, { recursive: true, force: true });
  fs.mkdirSync(carpeta, { recursive: true });
  const ext = fondo ? 'png' : 'jpg';
  const pagina = await abrirPlantilla(plantilla, datos);
  for (let f = 0; f < fotogramas; f++) {
    const t = Math.max(0, (f - asaIni) / FPS);
    await pagina.evaluate((s) => window.fijarTiempo(s), t);
    const archivo = path.join(carpeta, `f${String(f).padStart(4, '0')}.${ext}`);
    if (fondo) await pagina.screenshot({ path: archivo, omitBackground: true });
    else await pagina.screenshot({ path: archivo, type: 'jpeg', quality: 95 });
  }
  await pagina.close();
  const secuencia = ['-framerate', String(FPS), '-i', barras(path.join(carpeta, `f%04d.${ext}`))];
  if (fondo) {
    // La escena es una capa transparente que va encima de un plano de metraje
    await ffmpeg([
      '-i', barras(fondo), ...secuencia,
      '-filter_complex', '[1:v]format=rgba[capa];[0:v][capa]overlay=0:0:format=auto,format=yuv420p[v]', '-map', '[v]',
      '-frames:v', String(fotogramas), ...CODEC_INTERMEDIO, barras(salida),
    ]);
  } else {
    await ffmpeg([...secuencia, '-vf', 'format=yuv420p', '-frames:v', String(fotogramas), ...CODEC_INTERMEDIO, barras(salida)]);
  }
}
