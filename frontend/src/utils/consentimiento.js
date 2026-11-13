// Consentimiento de cookies de analítica (LSSI-CE art. 22.2).
// Google Tag Manager y Microsoft Clarity solo se cargan después de que la persona pulse «Aceptar».

const CLAVE = 'cookie_consent';
const CLAVE_FECHA = 'cookie_consent_date';
const VALIDEZ_MS = 365 * 24 * 60 * 60 * 1000; // se vuelve a preguntar a los 12 meses
export const EVENTO_AJUSTES = 'uf:ajustes-cookies';

const GTM_ID = 'GTM-NF4CGD93';
const CLARITY_ID = 'vd9ypo0bh0';

function leer(clave) {
  try {
    return localStorage.getItem(clave);
  } catch {
    return null;
  }
}

/** 'accepted' | 'rejected' | null (sin decidir o caducado) */
export function leerConsentimiento() {
  const valor = leer(CLAVE);
  const fecha = Date.parse(leer(CLAVE_FECHA) || '');
  if (!valor || Number.isNaN(fecha) || Date.now() - fecha > VALIDEZ_MS) return null;
  return valor === 'accepted' || valor === 'rejected' ? valor : null;
}

export function guardarConsentimiento(valor) {
  const anterior = leerConsentimiento();
  try {
    localStorage.setItem(CLAVE, valor);
    localStorage.setItem(CLAVE_FECHA, new Date().toISOString());
  } catch {
    // Sin almacenamiento: se volverá a preguntar en la próxima visita
  }
  if (valor === 'accepted') {
    cargarAnalitica();
  } else if (anterior === 'accepted') {
    // Retirar el consentimiento: borrar sus cookies y recargar para descargar los scripts
    borrarCookiesAnalitica();
    window.location.reload();
  }
}

let cargada = false;

export function cargarAnalitica() {
  if (cargada || typeof document === 'undefined') return;
  cargada = true;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
  const gtm = document.createElement('script');
  gtm.async = true;
  gtm.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
  document.head.appendChild(gtm);

  window.clarity =
    window.clarity ||
    function (...args) {
      (window.clarity.q = window.clarity.q || []).push(args);
    };
  const clarity = document.createElement('script');
  clarity.async = true;
  clarity.src = `https://www.clarity.ms/tag/${CLARITY_ID}`;
  document.head.appendChild(clarity);
}

function borrarCookiesAnalitica() {
  const dominio = window.location.hostname;
  const partes = dominio.split('.');
  const raiz = partes.length > 1 ? `.${partes.slice(-2).join('.')}` : dominio;
  document.cookie.split(';').forEach((c) => {
    const nombre = c.split('=')[0].trim();
    if (/^(_ga|_gid|_gat|_clck|_clsk|CLID|MUID|ANONCHK|SM)/.test(nombre)) {
      for (const d of ['', `; domain=${dominio}`, `; domain=${raiz}`]) {
        document.cookie = `${nombre}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${d}`;
      }
    }
  });
}

/** Vuelve a mostrar el aviso de cookies para cambiar la elección */
export function abrirAjustesCookies() {
  window.dispatchEvent(new Event(EVENTO_AJUSTES));
}
