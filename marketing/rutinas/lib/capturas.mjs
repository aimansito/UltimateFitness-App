// Captura real de la app: crea (si no existe) la rutina en la cuenta de prueba local y fotografía
// su página de detalle en tamaño móvil. Solo hace falta la primera vez o si cambia la interfaz.
import path from 'node:path';
import fs from 'node:fs';
import { APP, VIDEOS } from '../guion.mjs';
import { abrirNavegador } from '../../video-cambio/lib/navegador.mjs';
import { DIR } from './rutas.mjs';

const MOVIL = { width: 390, height: 844 };
const ESPERA = 120000;

export const rutaCaptura = (clave) => path.join(DIR.assets, `app-${clave}.png`);

async function api(ruta, { token, ...opciones } = {}) {
  const r = await fetch(`${APP.api}${ruta}`, {
    ...opciones,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
  });
  const datos = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(`${ruta}: ${r.status} ${JSON.stringify(datos).slice(0, 200)}`);
  return datos;
}

/** Devuelve el id de la rutina, creándola si hace falta */
async function asegurarRutina(token, video) {
  const nombre = `Rutina de ${video.titulo}`;
  const lista = await api('/custom/mis-entrenamientos', { token });
  const existentes = lista.entrenamientos || lista.data || lista;
  const ya = Array.isArray(existentes) ? existentes.find((e) => e.nombre === nombre) : null;
  if (ya) return ya.id;

  const ejercicios = video.ejercicios
    .filter((e) => !e.continua)
    .map((e) => {
      const [s, r] = e.series.split('×').map((n) => parseInt(n, 10));
      const variante = video.ejercicios.filter((o) => o.nombre === e.nombre && o.detalle).map((o) => o.detalle);
      return { ejercicio_id: e.catalogo, series: s, repeticiones: r, descanso: 90, notas: [e.zona, ...new Set(variante)].join(' · ') };
    });
  const dias = [1, 2, 3, 4, 5, 6, 7].map((dia, i) => ({
    diaSemana: dia,
    concepto: i === 0 ? video.grupos.join(', ') : '',
    esDescanso: i !== 0,
    ejercicios: i === 0 ? ejercicios : [],
  }));
  const r = await api('/usuario/crear-entrenamiento', {
    token,
    method: 'POST',
    body: JSON.stringify({
      nombre,
      descripcion: `${video.grupos.join(', ')}. Duración aproximada: ${video.duracion}.`,
      tipo: 'fuerza',
      nivelDificultad: 'intermedio',
      duracionMinutos: video.duracion.includes('h') ? 80 : 50,
      esPublico: false,
      dias,
    }),
  });
  return r.entrenamiento_id;
}

export const faltanCapturas = () => Object.keys(VIDEOS).some((k) => !fs.existsSync(rutaCaptura(k)));

export async function capturarApp() {
  const { token } = await api('/login', { method: 'POST', body: JSON.stringify({ email: APP.usuario, password: APP.clave }) });

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

  for (const [clave, video] of Object.entries(VIDEOS)) {
    const id = await asegurarRutina(token, video);
    await pagina.goto(`${APP.url}/mis-entrenamientos/${id}`, { waitUntil: 'networkidle', timeout: ESPERA });
    await pagina.getByText(`Rutina de ${video.titulo}`).first().waitFor({ timeout: ESPERA });
    await pagina.waitForTimeout(800);
    await pagina.screenshot({ path: rutaCaptura(clave), fullPage: true });
    console.log(`  captura: ${clave} (rutina ${id})`);
  }
  await contexto.close();
}
