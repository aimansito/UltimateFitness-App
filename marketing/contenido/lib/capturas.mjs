// Capturas reales de la app local (cuenta de prueba) para los vídeos y posts.
// Si la cuenta no tiene progreso registrado, apunta unas semanas de press inclinado de ejemplo.
import path from 'node:path';
import fs from 'node:fs';
import { abrirNavegador } from '../../video-cambio/lib/navegador.mjs';
import { DIR } from './rutas.mjs';

export const APP = { url: 'http://localhost:5173', api: 'http://localhost:8000/api', usuario: 'sara@example.com', clave: 'password123' };
const MOVIL = { width: 390, height: 844 };
const ESPERA = 120000;

export const CAPTURAS = ['calculadora', 'progreso', 'progreso-grafica', 'blog', 'imc', 'inicio'];
export const rutaApp = (nombre) => path.join(DIR.assets, 'app', `${nombre}.png`);
export const faltanCapturas = () => CAPTURAS.some((n) => !fs.existsSync(rutaApp(n)));

async function api(ruta, { token, ...op } = {}) {
  const r = await fetch(`${APP.api}${ruta}`, { ...op, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) } });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(`${ruta}: ${r.status} ${JSON.stringify(d).slice(0, 200)}`);
  return d;
}

async function progresoDeEjemplo(token) {
  const resumen = await api('/progreso/resumen', { token });
  if ((resumen.ejercicios || []).length > 0) return;
  const hoy = new Date();
  const pesos = [50, 52.5, 55, 55, 57.5, 60];
  for (const [i, peso] of pesos.entries()) {
    const f = new Date(hoy);
    f.setDate(hoy.getDate() - (pesos.length - 1 - i) * 7);
    await api('/progreso/registros', {
      token, method: 'POST',
      body: JSON.stringify({ ejercicioId: 74, fecha: f.toISOString().slice(0, 10), series: [8, 8, 7, 6].map((r) => ({ repeticiones: r, peso })) }),
    });
  }
}

export async function capturarApp() {
  const { token } = await api('/login', { method: 'POST', body: JSON.stringify({ email: APP.usuario, password: APP.clave }) });
  await progresoDeEjemplo(token);

  const navegador = await abrirNavegador();
  const contexto = await navegador.newContext({ viewport: MOVIL, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  const pagina = await contexto.newPage();
  await pagina.addInitScript(() => {
    localStorage.setItem('cookie_consent', 'rejected');
    localStorage.setItem('cookie_consent_date', new Date().toISOString());
  });
  await pagina.goto(`${APP.url}/login`, { waitUntil: 'networkidle', timeout: ESPERA });
  await pagina.fill('input[name=email]', APP.usuario);
  await pagina.fill('input[name=password]', APP.clave);
  await pagina.click('button[type=submit]');
  await pagina.waitForURL(/dashboard|calculadora/, { timeout: ESPERA });

  const foto = async (ruta, nombre, preparar) => {
    await pagina.goto(`${APP.url}${ruta}`, { waitUntil: 'networkidle', timeout: ESPERA });
    await pagina.waitForTimeout(900);
    const pantalla = preparar ? await preparar() : false;
    await pagina.screenshot({ path: rutaApp(nombre), fullPage: !pantalla });
    console.log(`  captura: ${nombre}`);
  };

  await foto('/user/dashboard', 'inicio');
  await foto('/calculadora', 'calculadora', async () => {
    await pagina.fill('input[name=peso]', '75');
    await pagina.fill('input[name=altura]', '178');
    await pagina.fill('input[name=edad]', '26');
    await pagina.getByRole('button', { name: /calcular/i }).first().evaluate((b) => b.click());
    await pagina.waitForTimeout(900);
  });
  await foto('/progreso', 'progreso', async () => {
    // Abre el ejercicio y deja a la vista el récord y la gráfica de evolución
    const boton = pagina.getByText(/press de banca en multipower/i).first();
    if (await boton.count()) await boton.evaluate((b) => b.click());
    await pagina.waitForTimeout(1200);
    return true;
  });
  await foto('/blog', 'blog');
  await foto('/perfil/datos', 'imc', async () => {
    await pagina.getByText(/IMC Calculado/i).first().evaluate((el) => el.scrollIntoView({ block: 'center' }));
    await pagina.waitForTimeout(700);
    return true;
  });
  await contexto.close();
}
