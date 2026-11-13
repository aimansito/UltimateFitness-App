// ============================================
// VERIFICAR EMAIL - /verificar-email?token=...
// Se abre desde el enlace del correo que se envía al registrarse.
// ============================================
import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Loader2, MailWarning } from 'lucide-react';
import api from '../../services/api';
import SEO from '../../components/common/SEO';

function VerificarEmail() {
  const [params] = useSearchParams();
  const token = params.get('token') || '';
  const [estado, setEstado] = useState(token ? 'cargando' : 'error');
  const [mensaje, setMensaje] = useState(token ? '' : 'El enlace no es válido. Ábrelo desde el correo que te enviamos.');
  const enviado = useRef(false);

  useEffect(() => {
    // En desarrollo React ejecuta los efectos dos veces: el token solo puede usarse una
    if (!token || enviado.current) return;
    enviado.current = true;
    api
      .post('/verificar-email', { token })
      .then((r) => {
        setEstado('ok');
        setMensaje(r.data.message);
      })
      .catch((err) => {
        setEstado('error');
        setMensaje(err?.response?.data?.error || 'No se pudo confirmar el email. Inténtalo de nuevo.');
      });
  }, [token]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-uf-darker px-4 py-16">
      <SEO title="Confirmar email" description="Confirmación del email de tu cuenta." />
      <div className="uf-card w-full max-w-md p-8 text-center" role="status" aria-live="polite">
        {estado === 'cargando' && (
          <>
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-uf-gold" aria-hidden="true" />
            <h1 className="mt-5 font-anton text-3xl uppercase text-white">Confirmando tu email</h1>
          </>
        )}
        {estado === 'ok' && (
          <>
            <CheckCircle2 className="mx-auto h-12 w-12 text-uf-gold" aria-hidden="true" />
            <h1 className="mt-5 font-anton text-3xl uppercase text-white">Email confirmado</h1>
            <p className="mt-3 text-gray-300">{mensaje}</p>
            <Link to="/login" className="uf-btn uf-btn-primary mt-8 w-full">
              Iniciar sesión
            </Link>
          </>
        )}
        {estado === 'error' && (
          <>
            <MailWarning className="mx-auto h-12 w-12 text-red-400" aria-hidden="true" />
            <h1 className="mt-5 font-anton text-3xl uppercase text-white">No se pudo confirmar</h1>
            <p className="mt-3 text-gray-300">{mensaje}</p>
            <p className="mt-3 text-sm text-uf-muted">
              Si tu enlace ha caducado, intenta iniciar sesión y pulsa «Reenviar correo de confirmación».
            </p>
            <Link to="/login" className="uf-btn uf-btn-ghost mt-8 w-full">
              Ir a iniciar sesión
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default VerificarEmail;
