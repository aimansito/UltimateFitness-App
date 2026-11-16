// ============================================
// CALCULADORA - Resultado de calorías y macros, guardado en el perfil
// Llega aquí quien calculó en el landing (tras crear su cuenta) o quien
// entra desde su panel. El resultado se guarda en Mis datos.
// ============================================
import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Flame, Salad, Utensils } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import SEO from '../../components/common/SEO';
import CalculadoraNutricional from '../../components/dieta/CalculadoraNutricional';
import {
  borrarPendiente,
  calcularNecesidades,
  datosAPerfil,
  leerPendiente,
  perfilADatos,
  validarDatos,
} from '../../utils/calculoNutricional';

function Calculadora() {
  const { user, updateUser } = useAuth();
  const location = useLocation();
  const toast = useToast();
  const [resultado, setResultado] = useState(null);
  const [datos, setDatos] = useState(null);
  const [guardado, setGuardado] = useState(false);
  const procesado = useRef(false);

  // Guarda los datos en el perfil (peso, altura, edad, sexo, actividad y objetivo)
  const guardarEnPerfil = async (d) => {
    if (!user?.id) return;
    try {
      const r = await api.put(`/custom/usuarios/${user.id}/actualizar`, datosAPerfil(d));
      if (r.data?.usuario) updateUser({ ...user, ...r.data.usuario });
      setGuardado(true);
    } catch {
      setGuardado(false);
      toast.warning('El resultado se ha calculado, pero no se ha podido guardar en tu perfil');
    }
  };

  const mostrar = (r, d) => {
    setResultado(r);
    setDatos(d);
    guardarEnPerfil(d);
  };

  // Datos que vienen del landing (estado de navegación o pendientes del registro)
  useEffect(() => {
    if (procesado.current) return;
    procesado.current = true;
    const pendientes = location.state?.datos || leerPendiente();
    if (pendientes && !validarDatos(pendientes)) {
      borrarPendiente();
      mostrar(calcularNecesidades(pendientes), pendientes);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-uf-darker py-12">
      <SEO title="Calculadora nutricional" description="Calcula tus calorías y macros diarios según tu objetivo." noindex />
      <div className="container mx-auto max-w-4xl px-4">
        <div className="mb-10 text-center">
          <span className="uf-eyebrow justify-center">Nutrición</span>
          <h1 className="mt-3 font-anton text-4xl uppercase text-white md:text-5xl">
            Tus <span className="uf-text-gold">necesidades diarias</span>
          </h1>
          <p className="mt-3 text-uf-muted">Calorías y macros calculados con tus datos. Se guardan en tu perfil para ajustar tus dietas.</p>
        </div>

        {resultado ? (
          <div className="space-y-6">
            <div className="uf-card relative overflow-hidden border-uf-gold/50 p-8 text-center">
              <div className="uf-glow -z-10 left-1/2 top-0 h-56 w-[30rem] -translate-x-1/2" aria-hidden="true" />
              <span className="uf-chip border-uf-gold/40 bg-uf-gold/10 text-uf-gold">
                <Flame className="h-3.5 w-3.5" />
                {resultado.objetivo}
              </span>
              <p className="mt-6 font-anton text-7xl text-white md:text-8xl">{resultado.caloriasObjetivo}</p>
              <p className="mt-1 text-sm uppercase tracking-widest text-uf-muted">kcal al día para tu objetivo</p>

              <div className="mx-auto mt-8 grid max-w-2xl grid-cols-3 gap-3">
                <Macro valor={resultado.proteinas} nombre="Proteínas" color="text-red-400" />
                <Macro valor={resultado.carbohidratos} nombre="Carbohidratos" color="text-blue-400" />
                <Macro valor={resultado.grasas} nombre="Grasas" color="text-yellow-400" />
              </div>

              <dl className="mx-auto mt-8 grid max-w-md grid-cols-2 gap-4 border-t border-uf-line pt-6 text-sm">
                <div>
                  <dt className="text-uf-muted">Metabolismo basal</dt>
                  <dd className="font-bold text-white">{resultado.tmb} kcal</dd>
                </div>
                <div>
                  <dt className="text-uf-muted">Mantenimiento</dt>
                  <dd className="font-bold text-white">{resultado.caloriasMantenimiento} kcal</dd>
                </div>
              </dl>

              {guardado && (
                <p className="mt-6 inline-flex items-center gap-2 text-sm text-green-400">
                  <CheckCircle2 className="h-4 w-4" />
                  Guardado en tu perfil
                </p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Link to="/crear-dieta" className="uf-card uf-card-hover group flex items-center gap-4 p-6">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-uf-gold text-black">
                  <Salad className="h-5 w-5" />
                </span>
                <span className="flex-1">
                  <span className="block font-anton text-xl uppercase text-white group-hover:text-uf-gold">Crear mi dieta</span>
                  <span className="block text-sm text-uf-muted">Monta tu plan y compara con estas cifras</span>
                </span>
                <ArrowRight className="h-5 w-5 text-uf-gold" />
              </Link>
              <Link to="/mis-dietas?tab=publicas" className="uf-card uf-card-hover group flex items-center gap-4 p-6">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-uf-gold text-black">
                  <Utensils className="h-5 w-5" />
                </span>
                <span className="flex-1">
                  <span className="block font-anton text-xl uppercase text-white group-hover:text-uf-gold">Dietas listas</span>
                  <span className="block text-sm text-uf-muted">Planes preparados por el equipo</span>
                </span>
                <ArrowRight className="h-5 w-5 text-uf-gold" />
              </Link>
            </div>

            <button type="button" onClick={() => { setResultado(null); setGuardado(false); }} className="uf-btn uf-btn-ghost w-full">
              Recalcular con otros datos
            </button>
          </div>
        ) : (
          <CalculadoraNutricional
            valoresIniciales={datos || perfilADatos(user)}
            mostrarResultado={false}
            onCalcular={mostrar}
            textoBoton="Calcular y guardar"
          />
        )}
      </div>
    </div>
  );
}

function Macro({ valor, nombre, color }) {
  return (
    <div className="rounded-2xl border border-uf-line bg-black/40 p-4">
      <div className={`font-anton text-3xl md:text-4xl ${color}`}>{valor}g</div>
      <div className="mt-1 text-xs uppercase tracking-wider text-uf-muted">{nombre}</div>
    </div>
  );
}

export default Calculadora;
