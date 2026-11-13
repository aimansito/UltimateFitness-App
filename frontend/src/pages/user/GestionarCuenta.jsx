// ============================================
// GESTIONAR CUENTA - /cuenta
// Contraseña, descarga de datos (RGPD art. 20), retirar consentimiento de salud (art. 7.3)
// y eliminar la cuenta (art. 17).
// ============================================
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertTriangle, Download, HeartPulse, KeyRound, Loader2, ShieldCheck, Trash2, UserCog } from 'lucide-react';
import api from '../../services/api';
import authService from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { mensajeError } from '../../services/socialService';
import SEO from '../../components/common/SEO';
import Icono from '../../components/common/Icono';

const campo =
  'w-full rounded-xl border border-uf-line bg-black/50 px-4 py-3 text-white transition placeholder:text-gray-500 focus:border-uf-gold focus:outline-none';

function Bloque({ icono, titulo, descripcion, children, peligro = false }) {
  return (
    <section className={`uf-card p-6 ${peligro ? 'border-red-500/40' : ''}`}>
      <h2 className={`flex items-center gap-2 font-anton text-xl uppercase ${peligro ? 'text-red-400' : 'text-white'}`}>
        <Icono de={icono} className={`h-5 w-5 ${peligro ? 'text-red-400' : 'text-uf-gold'}`} />
        {titulo}
      </h2>
      {descripcion && <p className="mt-1.5 text-sm text-uf-muted">{descripcion}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}

function CambiarPassword() {
  const toast = useToast();
  const [datos, setDatos] = useState({ actual: '', nueva: '', repetir: '' });
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');

  const enviar = async (e) => {
    e.preventDefault();
    setError('');
    if (datos.nueva.length < 8) return setError('La nueva contraseña debe tener al menos 8 caracteres.');
    if (datos.nueva !== datos.repetir) return setError('Las contraseñas nuevas no coinciden.');
    setEnviando(true);
    try {
      await api.post('/cuenta/password', { actual: datos.actual, nueva: datos.nueva });
      setDatos({ actual: '', nueva: '', repetir: '' });
      toast.success('Contraseña actualizada. Te hemos enviado un aviso por email.');
    } catch (err) {
      setError(mensajeError(err, 'No se pudo cambiar la contraseña.'));
    } finally {
      setEnviando(false);
    }
  };

  const cambiar = (e) => setDatos((d) => ({ ...d, [e.target.name]: e.target.value }));

  return (
    <form onSubmit={enviar} className="grid gap-3 sm:grid-cols-3">
      <label className="sm:col-span-3">
        <span className="mb-1.5 block text-sm font-semibold text-gray-300">Contraseña actual</span>
        <input type="password" name="actual" autoComplete="current-password" required value={datos.actual} onChange={cambiar} className={campo} />
      </label>
      <label className="sm:col-span-3 sm:col-start-1 md:col-span-1">
        <span className="mb-1.5 block text-sm font-semibold text-gray-300">Nueva contraseña</span>
        <input type="password" name="nueva" autoComplete="new-password" required minLength={8} value={datos.nueva} onChange={cambiar} className={campo} />
      </label>
      <label className="sm:col-span-3 md:col-span-1">
        <span className="mb-1.5 block text-sm font-semibold text-gray-300">Repite la nueva</span>
        <input type="password" name="repetir" autoComplete="new-password" required minLength={8} value={datos.repetir} onChange={cambiar} className={campo} />
      </label>
      <div className="flex items-end sm:col-span-3 md:col-span-1">
        <button type="submit" disabled={enviando} className="uf-btn uf-btn-primary w-full disabled:opacity-50">
          {enviando ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
          Cambiar
        </button>
      </div>
      {error && (
        <p role="alert" className="text-sm text-red-300 sm:col-span-3">
          {error}
        </p>
      )}
    </form>
  );
}

function DescargarDatos() {
  const toast = useToast();
  const [cargando, setCargando] = useState(false);

  const descargar = async () => {
    setCargando(true);
    try {
      const r = await api.get('/cuenta/exportar', { responseType: 'blob' });
      const url = URL.createObjectURL(r.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'mis-datos-ultimate-fitness.json';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      toast.error('No se pudieron descargar tus datos. Inténtalo de nuevo.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <button type="button" onClick={descargar} disabled={cargando} className="uf-btn uf-btn-ghost disabled:opacity-50">
      {cargando ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Download className="h-4 w-4" aria-hidden="true" />}
      Descargar mis datos (JSON)
    </button>
  );
}

function RetirarSalud() {
  const toast = useToast();
  const { user, updateUser } = useAuth();
  const [confirmar, setConfirmar] = useState(false);
  const [cargando, setCargando] = useState(false);

  const retirar = async () => {
    setCargando(true);
    try {
      await api.delete('/cuenta/datos-salud');
      updateUser({ ...user, peso_actual: null, altura: null, peso_objetivo: null, imc: null, notas_salud: null });
      setConfirmar(false);
      toast.success('Hemos borrado tus datos de salud.');
    } catch (err) {
      toast.error(mensajeError(err, 'No se pudieron borrar los datos de salud.'));
    } finally {
      setCargando(false);
    }
  };

  if (!confirmar) {
    return (
      <button type="button" onClick={() => setConfirmar(true)} className="uf-btn uf-btn-ghost">
        Retirar consentimiento y borrar datos de salud
      </button>
    );
  }
  return (
    <div className="rounded-2xl border border-uf-gold/40 bg-uf-gold/5 p-4">
      <p className="text-sm text-gray-300">
        Se borrarán tu peso, altura, peso objetivo, IMC y notas de salud. Tus rutinas y dietas no se tocan. Podrás volver a añadirlos en Mis datos.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <button type="button" onClick={retirar} disabled={cargando} className="uf-btn uf-btn-primary disabled:opacity-50">
          {cargando && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
          Sí, borrar mis datos de salud
        </button>
        <button type="button" onClick={() => setConfirmar(false)} className="uf-btn uf-btn-ghost">
          Cancelar
        </button>
      </div>
    </div>
  );
}

function EliminarCuenta() {
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();
  const [abierto, setAbierto] = useState(false);
  const [password, setPassword] = useState('');
  const [entiendo, setEntiendo] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  if (user?.rol === 'admin') {
    return <p className="text-sm text-uf-muted">Las cuentas de administración no se pueden eliminar desde aquí.</p>;
  }

  const eliminar = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);
    try {
      await api.post('/cuenta/eliminar', { password });
      authService.logout();
      toast.success('Tu cuenta se ha eliminado. Gracias por haber entrenado con nosotros.');
      // Recarga completa para limpiar cualquier estado de la sesión anterior
      setTimeout(() => {
        navigate('/', { replace: true });
        window.location.reload();
      }, 1200);
    } catch (err) {
      setError(mensajeError(err, 'No se pudo eliminar la cuenta.'));
      setCargando(false);
    }
  };

  if (!abierto) {
    return (
      <button type="button" onClick={() => setAbierto(true)} className="uf-btn border border-red-500/60 text-red-300 hover:bg-red-500/10">
        <Trash2 className="h-4 w-4" aria-hidden="true" />
        Eliminar mi cuenta
      </button>
    );
  }

  return (
    <form onSubmit={eliminar} className="space-y-4 rounded-2xl border border-red-500/40 bg-red-500/5 p-5">
      <p className="flex gap-2 text-sm text-gray-200">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" aria-hidden="true" />
        Se borrarán de forma permanente tu perfil, tus datos de salud, tus rutinas, dietas, calendario, seguidores y favoritos. No se puede deshacer.
        Si quieres conservar una copia, descarga antes tus datos.
      </p>
      <label className="block">
        <span className="mb-1.5 block text-sm font-semibold text-gray-300">Escribe tu contraseña para confirmar</span>
        <input type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} className={campo} />
      </label>
      <label className="flex cursor-pointer items-start gap-3 text-sm text-gray-300">
        <input type="checkbox" checked={entiendo} onChange={(e) => setEntiendo(e.target.checked)} className="mt-0.5 h-5 w-5 shrink-0 accent-red-500" />
        Entiendo que mi cuenta y mis datos se eliminarán para siempre.
      </label>
      {error && (
        <p role="alert" className="text-sm text-red-300">
          {error}
        </p>
      )}
      <div className="flex flex-wrap gap-3">
        <button type="submit" disabled={!entiendo || !password || cargando} className="uf-btn bg-red-600 text-white hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-40">
          {cargando ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Trash2 className="h-4 w-4" aria-hidden="true" />}
          Eliminar definitivamente
        </button>
        <button
          type="button"
          onClick={() => {
            setAbierto(false);
            setPassword('');
            setEntiendo(false);
            setError('');
          }}
          className="uf-btn uf-btn-ghost"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

function GestionarCuenta() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-uf-darker px-4 py-12">
      <SEO title="Gestionar cuenta" description="Contraseña, tus datos y eliminación de la cuenta." />
      <div className="mx-auto max-w-3xl">
        <header className="mb-8">
          <span className="uf-eyebrow">Tu cuenta</span>
          <h1 className="mt-3 flex items-center gap-3 font-anton text-4xl uppercase text-white">
            <UserCog className="h-9 w-9 text-uf-gold" aria-hidden="true" />
            Gestionar cuenta
          </h1>
          <p className="mt-2 text-uf-muted">
            Sesión iniciada como <span className="font-semibold text-white">{user?.email}</span>
          </p>
        </header>

        <div className="space-y-6">
          <Bloque icono={UserCog} titulo="Datos y privacidad" descripcion="Edita tu nombre, foto y datos físicos, o decide quién ve tu perfil.">
            <div className="flex flex-wrap gap-3">
              <Link to="/perfil/datos" className="uf-btn uf-btn-ghost">Mis datos personales</Link>
              <Link to="/dashboard" className="uf-btn uf-btn-ghost">
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                Privacidad del perfil
              </Link>
            </div>
          </Bloque>

          <Bloque icono={KeyRound} titulo="Contraseña" descripcion="Te avisaremos por email cada vez que cambie.">
            <CambiarPassword />
          </Bloque>

          <Bloque icono={Download} titulo="Descargar mis datos" descripcion="Una copia de todo lo que guardamos sobre ti en un archivo que puedes llevarte a otro servicio.">
            <DescargarDatos />
          </Bloque>

          <Bloque icono={HeartPulse} titulo="Datos de salud" descripcion="Retira cuando quieras el consentimiento que diste al registrarte para usar tus datos físicos y de salud.">
            <RetirarSalud />
          </Bloque>

          <Bloque icono={Trash2} titulo="Eliminar cuenta" peligro>
            <EliminarCuenta />
          </Bloque>

          <p className="text-center text-sm text-uf-muted">
            Más información en la <Link to="/politica-privacidad" className="text-uf-gold hover:underline">Política de privacidad</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}

export default GestionarCuenta;
