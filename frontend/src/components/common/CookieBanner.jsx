// ============================================
// AVISO DE COOKIES - la analítica solo se carga tras «Aceptar»
// ============================================
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Cookie } from 'lucide-react';
import {
  EVENTO_AJUSTES,
  cargarAnalitica,
  guardarConsentimiento,
  leerConsentimiento,
} from '../../utils/consentimiento';

function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consentimiento = leerConsentimiento();
    if (consentimiento === 'accepted') {
      cargarAnalitica();
    }
    const mostrar = () => setVisible(true);
    window.addEventListener(EVENTO_AJUSTES, mostrar);
    // Sin decisión (o caducada): se pregunta tras un momento para no bloquear la carga
    const timer = consentimiento ? null : setTimeout(mostrar, 800);
    return () => {
      window.removeEventListener(EVENTO_AJUSTES, mostrar);
      if (timer) clearTimeout(timer);
    };
  }, []);

  const decidir = (valor) => {
    setVisible(false);
    guardarConsentimiento(valor);
  };

  if (!visible) return null;

  const actual = leerConsentimiento();

  return (
    <div
      role="dialog"
      aria-labelledby="cookies-titulo"
      aria-describedby="cookies-texto"
      className="fixed bottom-0 left-0 right-0 z-[9999] p-4 animate-slideUp"
    >
      <div className="mx-auto max-w-4xl rounded-2xl border border-uf-gold/40 bg-uf-card p-6 shadow-2xl shadow-black/50">
        <div className="flex flex-col items-start gap-4 md:flex-row md:items-center">
          <div className="flex flex-1 items-start gap-3">
            <Cookie className="mt-1 h-8 w-8 shrink-0 text-uf-gold" aria-hidden="true" />
            <div>
              <h2 id="cookies-titulo" className="mb-1 text-lg font-bold text-white">
                Cookies de analítica
              </h2>
              <p id="cookies-texto" className="text-sm leading-relaxed text-gray-400">
                Con tu permiso usamos Google Tag Manager y Microsoft Clarity para entender cómo se usa la web y mejorarla.
                No usamos cookies de publicidad. Puedes cambiar tu elección cuando quieras.{' '}
                <Link to="/politica-cookies" className="font-semibold text-uf-gold hover:underline">
                  Más información
                </Link>
                {actual && (
                  <span className="mt-1 block text-xs text-uf-muted">
                    Elección actual: {actual === 'accepted' ? 'aceptadas' : 'rechazadas'}.
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Mismo peso visual para aceptar y rechazar (Guía de cookies de la AEPD) */}
          <div className="flex w-full shrink-0 gap-3 md:w-auto">
            <button type="button" onClick={() => decidir('rejected')} className="uf-btn uf-btn-ghost flex-1 !px-6 !py-2.5 md:flex-none">
              Rechazar
            </button>
            <button type="button" onClick={() => decidir('accepted')} className="uf-btn uf-btn-primary flex-1 !px-6 !py-2.5 md:flex-none">
              Aceptar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CookieBanner;
