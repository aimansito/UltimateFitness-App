// ============================================
// POLÍTICA DE COOKIES (LSSI-CE art. 22.2 y Guía de cookies de la AEPD)
// ============================================
import { Cookie } from 'lucide-react';
import { PaginaLegal, Lista, Tabla } from '../../components/legal/PaginaLegal';
import { abrirAjustesCookies } from '../../utils/consentimiento';

function PoliticaCookies() {
  const secciones = [
    {
      id: 'que-son',
      titulo: 'Qué son',
      contenido: (
        <p>
          Las cookies y tecnologías similares (como el almacenamiento local del navegador) guardan información en tu dispositivo cuando visitas un sitio web.
          Algunas son necesarias para que funcione; otras solo se usan si las aceptas.
        </p>
      ),
    },
    {
      id: 'necesarias',
      titulo: 'Almacenamiento necesario',
      contenido: (
        <>
          <p>Se usa siempre, porque sin él el servicio no funciona. No requiere consentimiento.</p>
          <Tabla
            cabecera={['Nombre', 'Para qué', 'Duración']}
            filas={[
              ['token, usuario', 'Mantener tu sesión iniciada.', 'Hasta que cierres sesión o caduque.'],
              ['cookie_consent, cookie_consent_date', 'Recordar si aceptaste o rechazaste la analítica.', '12 meses; después se vuelve a preguntar.'],
            ]}
          />
        </>
      ),
    },
    {
      id: 'analitica',
      titulo: 'Analítica (solo si aceptas)',
      contenido: (
        <>
          <p>
            Estas herramientas no se cargan hasta que pulsas «Aceptar». Si rechazas, no se instalan.
          </p>
          <Tabla
            cabecera={['Proveedor', 'Para qué', 'Más información']}
            filas={[
              ['Google Tag Manager (Google Ireland Ltd.)', 'Cargar y gestionar las herramientas de medición.', <a key="g" href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-uf-gold hover:underline">Privacidad de Google</a>],
              ['Microsoft Clarity (Microsoft Ireland Operations Ltd.)', 'Entender cómo se usa el sitio mediante mapas de calor y grabaciones anónimas de la sesión. Las cookies de Clarity (_clck, _clsk) duran hasta 1 año.', <a key="m" href="https://privacy.microsoft.com/es-es/privacystatement" target="_blank" rel="noopener noreferrer" className="text-uf-gold hover:underline">Privacidad de Microsoft</a>],
            ]}
          />
          <p>No usamos cookies de publicidad.</p>
        </>
      ),
    },
    {
      id: 'gestionar',
      titulo: 'Cambiar tu elección',
      contenido: (
        <>
          <p>Puedes cambiar de opinión cuando quieras. Si retiras el consentimiento, la página se recarga sin las herramientas de analítica.</p>
          <button type="button" onClick={abrirAjustesCookies} className="uf-btn uf-btn-primary">
            Configurar cookies
          </button>
          <p>También puedes borrar las cookies desde tu navegador:</p>
          <Lista>
            <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-uf-gold hover:underline">Chrome</a></li>
            <li><a href="https://support.mozilla.org/es/kb/Borrar%20cookies" target="_blank" rel="noopener noreferrer" className="text-uf-gold hover:underline">Firefox</a></li>
            <li><a href="https://support.microsoft.com/es-es/microsoft-edge/eliminar-las-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-uf-gold hover:underline">Edge</a></li>
            <li><a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-uf-gold hover:underline">Safari</a></li>
          </Lista>
        </>
      ),
    },
  ];

  return (
    <PaginaLegal
      titulo="Política de cookies"
      subtitulo="Qué guardamos en tu navegador y cómo decides sobre la analítica."
      descripcionSeo="Política de cookies de Ultimate Fitness: almacenamiento necesario y analítica con consentimiento."
      icono={Cookie}
      secciones={secciones}
    />
  );
}

export default PoliticaCookies;
