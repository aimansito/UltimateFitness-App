// ============================================
// BIBLIOTECA DE EJERCICIOS - Vista compartida por /gym y /workout
// ============================================
import { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, Lock, Moon, Sparkles, Zap } from 'lucide-react';
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

function BibliotecaEjercicios({ seo, eyebrow, title, highlight, subtitle, ejerciciosMuestra, rutinaEjemplo }) {
  const { accesoCompleto: isPremium, isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();
  const grupoInicial = GRUPOS_MUSCULARES.find((g) => g.id === normalizarGrupo(searchParams.get('grupo')))?.id || 'TODOS';

  const [ejercicios, setEjercicios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [ejercicioSeleccionado, setEjercicioSeleccionado] = useState(null);
  const [musculoSeleccionado, setMusculoSeleccionado] = useState(grupoInicial);
  const [nivelSeleccionado, setNivelSeleccionado] = useState('');

  const cargarEjercicios = async () => {
    try {
      setCargando(true);
      setError(null);

      if (!isAuthenticated) {
        setEjercicios(ejerciciosMuestra);
        return;
      }

      const response = await api.get('/custom/ejercicios?limit=300');
      setEjercicios(response.data?.ejercicios ?? []);
    } catch (err) {
      console.error('Error cargando ejercicios:', err);
      setError(err.message);
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
              <h2 className="font-anton text-xl uppercase text-white">Estás viendo una muestra</h2>
              <p className="mt-1 text-sm text-uf-muted">
                Regístrate gratis para acceder a la biblioteca completa con más de 140 ejercicios.
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
                onClick={() => setEjercicioSeleccionado(ejercicio)}
              />
            ))}
          </div>
        )}

        {!cargando && !error && ejerciciosFiltrados.length === 0 && (
          <div className="uf-card py-16 text-center">
            <p className="text-lg text-uf-muted">No hay ejercicios con estos filtros</p>
          </div>
        )}

        {/* Rutina semanal de ejemplo (solo visitantes) */}
        {!isAuthenticated && !cargando && rutinaEjemplo && (
          <section className="mt-24">
            <Reveal className="mb-10 text-center">
              <span className="uf-eyebrow justify-center">Planificación</span>
              <h2 className="mt-4 font-anton text-4xl uppercase text-white md:text-5xl">
                Ejemplo de <span className="uf-text-gold">Rutina Semanal</span>
              </h2>
              <p className="mt-3 text-uf-muted">Así se vería una semana de entrenamiento dividida por grupo muscular</p>
            </Reveal>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
              {rutinaEjemplo.map((d, i) => (
                <Reveal key={d.dia} delay={i * 50}>
                  <div className={`uf-card flex h-full flex-col items-center p-4 text-center ${d.grupo ? '' : 'opacity-60'}`}>
                    <p className="font-audiowide text-[10px] uppercase tracking-widest text-uf-muted">{d.dia}</p>
                    {d.grupo ? (
                      <MuscleMap grupo={d.grupo} className="my-3 h-28" />
                    ) : (
                      <span className="my-3 flex h-28 items-center justify-center">
                        <Moon className="h-9 w-9 text-gray-600" />
                      </span>
                    )}
                    <p className={`font-anton text-lg uppercase ${d.grupo ? 'text-uf-gold' : 'text-gray-500'}`}>
                      {d.titulo}
                    </p>
                    <p className="mt-1 text-xs text-uf-muted">{d.ejercicio || 'Recuperación'}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal className="mt-8">
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
