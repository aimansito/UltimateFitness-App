// Capturas reales de la app (en local) para la parte de «funcionalidades».
// Requiere la app arrancada: frontend en APP.url y API en marcha. Solo hace falta repetirlas
// si cambia la interfaz; las imágenes quedan en assets/app/.
import path from 'node:path';
import fs from 'node:fs';
import { abrirNavegador } from './navegador.mjs';
import { DIR } from './rutas.mjs';

const MOVIL = { width: 390, height: 844 };
const ESPERA = 120000; // la API local puede tardar en responder

export const CAPTURAS = {
  rutinas: ['rutinas_1_pecho', 'rutinas_2_espalda', 'rutinas_3_anadidos', 'rutinas_4_dia'],
  dieta: 'dieta_larga',
};
export const rutaCaptura = (nombre) => path.join(DIR.assets, 'app', `${nombre}.png`);
export const faltanCapturas = () => [...CAPTURAS.rutinas, CAPTURAS.dieta].some((n) => !fs.existsSync(rutaCaptura(n)));

async function paginaConSesion(app) {
  const navegador = await abrirNavegador();
  const contexto = await navegador.newContext({ viewport: MOVIL, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  const pagina = await contexto.newPage();
  // Sin el aviso de cookies tapando la pantalla
  await pagina.addInitScript(() => {
    localStorage.setItem('cookie_consent', 'rejected');
    localStorage.setItem('cookie_consent_date', new Date().toISOString());
  });
  await pagina.goto(`${app.url}/login`, { waitUntil: 'networkidle', timeout: ESPERA });
  await pagina.fill('input[name=email]', app.usuario);
  await pagina.fill('input[name=password]', app.clave);
  await pagina.click('button[type=submit]');
  await pagina.waitForURL(/dashboard|calculadora/, { timeout: ESPERA });
  return { contexto, pagina };
}

export async function capturarApp(app) {
  fs.mkdirSync(path.join(DIR.assets, 'app'), { recursive: true });
  const { contexto, pagina } = await paginaConSesion(app);

  // ---------- Rutinas: figura muscular, ejercicios por grupo y el día montado ----------
  await pagina.goto(`${app.url}/crear-entrenamiento`, { waitUntil: 'networkidle', timeout: ESPERA });
  const panel = pagina.locator('section[aria-label="Biblioteca de ejercicios"]');
  await panel.locator('ul li').first().waitFor({ timeout: ESPERA });
  // Deja la figura y los grupos justo debajo de la barra de la app
  const alinear = async () => {
    await pagina.evaluate(() => {
      const mapa = document.querySelector('section[aria-label="Biblioteca de ejercicios"] .uf-muscle-map');
      window.scrollTo(0, mapa.getBoundingClientRect().top + window.scrollY - 86);
    });
    await pagina.waitForTimeout(350);
  };

  await panel.getByRole('button', { name: 'Pecho', exact: true }).click();
  await alinear();
  await pagina.screenshot({ path: rutaCaptura(CAPTURAS.rutinas[0]) });

  await panel.getByRole('button', { name: 'Espalda', exact: true }).click();
  await alinear();
  await pagina.screenshot({ path: rutaCaptura(CAPTURAS.rutinas[1]) });

  // Clic directo en el DOM: en móvil la lista tiene su propio scroll y el clic simulado puede caer sobre otro botón
  const anadir = panel.locator('button[aria-label^="Añadir "]');
  for (const i of [0, 1, 2]) await anadir.nth(i).evaluate((boton) => boton.click());
  await pagina.waitForTimeout(4500); // que desaparezcan los avisos
  await alinear();
  await pagina.screenshot({ path: rutaCaptura(CAPTURAS.rutinas[2]) });

  await pagina.evaluate(() => {
    const dia = document.getElementById('dia-1');
    window.scrollTo(0, dia.getBoundingClientRect().top + window.scrollY - 86);
  });
  await pagina.waitForTimeout(350);
  await pagina.screenshot({ path: rutaCaptura(CAPTURAS.rutinas[3]) });

  // ---------- Dieta: una dieta con sus macros, en una captura larga para desplazarla ----------
  await pagina.goto(`${app.url}/dieta/${app.dietaId}`, { waitUntil: 'networkidle', timeout: ESPERA });
  await pagina.getByText(/total del día/i).first().waitFor({ timeout: ESPERA });
  await pagina.waitForTimeout(600);
  await pagina.screenshot({ path: rutaCaptura(CAPTURAS.dieta), fullPage: true, clip: { x: 0, y: 0, width: MOVIL.width, height: 2000 } });

  await contexto.close();
}
