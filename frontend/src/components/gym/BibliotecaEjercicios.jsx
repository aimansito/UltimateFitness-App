// ============================================
// BIBLIOTECA DE EJERCICIOS - Vista compartida por /gym y /workout
// ============================================
import { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, Lock, Sparkles, X, Zap } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import SEO from '../common/SEO';
import PageHeader from '../common/PageHeader';
import MuscleMap, { normalizarGrupo } from '../common/MuscleMap';
import Reveal from '../common/Reveal';
import TarjetaEjercicio from './TarjetaEjercicio';
import ModalEjercicio from './ModalEjercicio';
import BarraFiltros from './BarraFiltros';

const GRUPOS_MUSCULARES = [
  { id: 'TODOS', nombre: 'Todos' },
  { id: 'pecho', nombre: 'Pecho' },
  { id: 'espalda', nombre: 'Espalda' },
  { id: 'piernas', nombre: 'Piernas' },
  { id: 'hombros', nombre: 'Hombros' },
  { id: 'biceps', nombre: 'Bíceps' },
  { id: 'triceps', nombre: 'Tríceps' },
  { id: 'core', nombre: 'Core' },
  { id: 'gluteos', nombre: 'Glúteos' },
];

function BibliotecaEjercicios({ seo, eyebrow, title, highlight, subtitle, ejerciciosMuestra }) {
  const { accesoCompleto: isPremium, isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();
  const grupoInicial = GRUPOS_MUSCULARES.find((g) => g.id === normalizarGrupo(searchParams.get('grupo')))?.id || 'TODOS';

  const [ejercicios, setEjercicios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [ejercicioSeleccionado, setEjercicioSeleccionado] = useState(null);
  const [musculoSeleccionado, setMusculoSeleccionado] = useState(grupoInicial);
  const [nivelSeleccionado, setNivelSeleccionado] = useState('');
  const [pedirCuenta, setPedirCuenta] = useState(null);

  const cargarEjercicios = async () => {
    try {
      setCargando(true);
      setError(null);

      const response = await api.get('/custom/ejercicios?limit=300');
      setEjercicios(response.data?.ejercicios ?? []);
    } catch (err) {
      // Sin conexión con la API: se enseña la muestra para que la página no quede vacía
      if (!isAuthenticated && ejerciciosMuestra?.length) setEjercicios(ejerciciosMuestra);
      else setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarEjercicios();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const ejerciciosFiltrados = useMemo(
    () =>
      ejercicios.filter((ej) => {
        const coincideGrupo =
          musculoSeleccionado === 'TODOS' || normalizarGrupo(ej.grupoMuscular) === musculoSeleccionado;
        const coincideNivel =
          !nivelSeleccionado || ej.nivelDificultad?.toLowerCase() === nivelSeleccionado;
        return coincideGrupo && coincideNivel;
      }),
    [ejercicios, musculoSeleccionado, nivelSeleccionado]
  );

  const grupoActivo = GRUPOS_MUSCULARES.find((g) => g.id === musculoSeleccionado);

  return (
    <div className="min-h-screen bg-uf-darker">
      <SEO {...seo} />

      <PageHeader eyebrow={eyebrow} title={title} highlight={highlight} subtitle={subtitle} />

      <div className="container mx-auto px-4 py-12">
        {/* Aviso de acceso */}
        {!isAuthenticated && (
          <div className="uf-card mx-auto mb-10 flex max-w-4xl flex-col items-center gap-5 border-uf-gold/40 p-6 text-center md:flex-row md:text-left">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-uf-gold text-black">
              <Lock className="h-5 w-5" />
            </span>
            <div className="flex-1">
              <h2 className="font-anton text-xl uppercase text-white">Explora todos los ejercicios</h2>
              <p className="mt-1 text-sm text-uf-muted">
                Crea tu cuenta gratis para ver la técnica de cada uno, guardarlos en favoritos y montar tu rutina.
              </p>
            </div>
            <div className="flex shrink-0 gap-3">
              <Link to="/register" className="uf-btn uf-btn-primary !px-5 !py-3">Registrarse gratis</Link>
              <Link to="/login" className="uf-btn uf-btn-ghost !px-5 !py-3">Entrar</Link>
            </div>
          </div>
        )}

        {isAuthenticated && !isPremium && (
          <div className="uf-card mx-auto mb-10 flex max-w-4xl flex-col items-center gap-4 border-uf-gold/40 p-5 text-center sm:flex-row sm:text-left">
            <Sparkles className="h-6 w-6 shrink-0 text-uf-gold" />
            <p className="flex-1 text-sm text-gray-300">
              Hazte Premium (gratis durante el lanzamiento) para acceder a los videos HD.
            </p>
            <Link to="/upgrade-premium" className="uf-btn uf-btn-primary !px-5 !py-3">Pasar a Premium</Link>
          </div>
        )}

        {!cargando && !error && (
          <BarraFiltros
            gruposMusculares={GRUPOS_MUSCULARES}
            musculoSeleccionado={musculoSeleccionado}
            setMusculoSeleccionado={setMusculoSeleccionado}
            nivelSeleccionado={nivelSeleccionado}
            setNivelSeleccionado={setNivelSeleccionado}
          />
        )}

        {/* Cabecera del grupo seleccionado */}
        {!cargando && !error && musculoSeleccionado !== 'TODOS' && (
          <div className="uf-card mb-8 flex items-center gap-6 overflow-hidden p-6">
            <MuscleMap grupo={musculoSeleccionado} vista="ambas" className="h-36 w-40 shrink-0 sm:h-44 sm:w-52" />
            <div>
              <span className="uf-eyebrow">Zona trabajada</span>
              <h2 className="mt-2 font-anton text-4xl uppercase text-white sm:text-5xl">{grupoActivo?.nombre}</h2>
              <p className="mt-2 text-sm text-uf-muted">
                {ejerciciosFiltrados.length} {ejerciciosFiltrados.length === 1 ? 'ejercicio' : 'ejercicios'}
                {nivelSeleccionado ? ` de nivel ${nivelSeleccionado}` : ''}
              </p>
            </div>
          </div>
        )}

        {cargando && (
          <div className="flex flex-col items-center justify-center py-20" role="status">
            <div className="mb-4 h-14 w-14 animate-spin rounded-full border-b-4 border-t-4 border-uf-gold" />
            <p className="text-uf-muted">Cargando ejercicios...</p>
          </div>
        )}

        {error && (
          <div className="py-20 text-center">
            <p className="mb-4 text-xl text-red-400">No se pudieron cargar los ejercicios</p>
            <button type="button" onClick={cargarEjercicios} className="uf-btn uf-btn-primary">Reintentar</button>
          </div>
        )}

        {!cargando && !error && ejerciciosFiltrados.length > 0 && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {ejerciciosFiltrados.map((ejercicio) => (
              <TarjetaEjercicio
                key={ejercicio.id}
                ejercicio={ejercicio}
                isPremium={isPremium}
                onClick={() => (isAuthenticated ? setEjercicioSeleccionado(ejercicio) : setPedirCuenta(ejercicio))}
              />
            ))}
          </div>
        )}

        {!cargando && !error && ejerciciosFiltrados.length === 0 && (
          <div className="uf-card py-16 text-center">
            <p className="text-lg text-uf-muted">No hay ejercicios con estos filtros</p>
          </div>
        )}

        {/* Llamada a crear rutina (solo visitantes) */}
        {!isAuthenticated && !cargando && (
          <section className="mt-24">
            <Reveal>
              <div className="relative isolate overflow-hidden rounded-[1.5rem] border border-uf-gold/50 bg-uf-card px-6 py-12 text-center">
                <div className="uf-glow -z-10 left-1/2 top-0 h-56 w-[30rem] -translate-x-1/2" aria-hidden="true" />
                <h3 className="font-anton text-3xl uppercase text-white md:text-4xl">¿Quieres tu propia rutina a medida?</h3>
                <p className="mx-auto mt-3 max-w-xl text-gray-300">
                  Regístrate gratis y crea tu rutina personalizada con nuestra biblioteca completa de ejercicios.
                </p>
                <Link to="/register" className="uf-btn uf-btn-primary mt-7">
                  <Zap className="h-4 w-4" />
                  Crear mi rutina
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </Reveal>
          </section>
        )}
      </div>

      {pedirCuenta && (
        <div
          className="animate-fadeIn fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setPedirCuenta(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="titulo-pedir-cuenta"
        >
          <div className="uf-card animate-scaleIn relative w-full max-w-md p-8 text-center" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setPedirCuenta(null)}
              aria-label="Cerrar"
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-uf-line text-gray-400 hover:border-uf-gold hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
            <MuscleMap grupo={pedirCuenta.grupoMuscular} vista="ambas" className="mx-auto h-36" />
            <h2 id="titulo-pedir-cuenta" className="mt-5 font-anton text-3xl uppercase text-white">{pedirCuenta.nombre}</h2>
            <p className="mt-3 text-gray-300">
              Crea tu cuenta gratis para ver la técnica de este ejercicio, guardarlo en favoritos y añadirlo a tu rutina.
            </p>
            <div className="mt-7 flex flex-col gap-3">
              <Link to="/register" className="uf-btn uf-btn-primary w-full">
                <Zap className="h-4 w-4" />
                Crear cuenta gratis
              </Link>
              <Link to="/login" className="uf-btn uf-btn-ghost w-full">Ya tengo cuenta</Link>
            </div>
          </div>
        </div>
      )}

      {ejercicioSeleccionado && (
        <ModalEjercicio
          ejercicio={ejercicioSeleccionado}
          onClose={() => setEjercicioSeleccionado(null)}
          isPremium={isPremium}
        />
      )}
    </div>
  );
}

export default BibliotecaEjercicios;
