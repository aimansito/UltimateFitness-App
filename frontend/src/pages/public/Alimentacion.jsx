// ============================================
// ALIMENTACIÓN - Dietas profesionales
// ============================================
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Flame, FlaskConical, Lock, Salad, Star, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import SEO from '../../components/common/SEO';
import PageHeader from '../../components/common/PageHeader';
import Reveal from '../../components/common/Reveal';

const OBJETIVOS = [
  { id: 'TODAS', nombre: 'Todas' },
  { id: 'perder_peso', nombre: 'Pérdida de peso' },
  { id: 'ganar_masa', nombre: 'Ganancia muscular' },
  { id: 'definicion', nombre: 'Definición' },
  { id: 'rendimiento', nombre: 'Rendimiento deportivo' },
  { id: 'mantenimiento', nombre: 'Mantenimiento' },
];

// Plan semanal de ejemplo (solo para visitantes)
const PLAN_EJEMPLO = [
  { dia: 'Lunes', comida: 'Pollo con arroz y verduras', kcal: '2.200 kcal' },
  { dia: 'Martes', comida: 'Salmón con batata asada', kcal: '2.100 kcal' },
  { dia: 'Miércoles', comida: 'Pasta integral con pavo', kcal: '2.300 kcal' },
  { dia: 'Jueves', comida: 'Tortilla de claras y avena', kcal: '2.000 kcal' },
  { dia: 'Viernes', comida: 'Ternera con quinoa', kcal: '2.250 kcal' },
  { dia: 'Sábado', comida: 'Pescado blanco con ensalada', kcal: '2.100 kcal' },
  { dia: 'Domingo', comida: 'Comida libre controlada', kcal: '2.400 kcal' },
];

const SUPLEMENTOS = [
  { nombre: 'Whey Protein Isolate', categoria: 'Proteína', descripcion: 'Proteína de suero aislada de máxima pureza', premium: false },
  { nombre: 'Creatina Monohidrato', categoria: 'Creatina', descripcion: 'Creatina pura micronizada de grado farmacéutico', premium: false },
  { nombre: 'Pre-Workout Extreme', categoria: 'Pre-entreno', descripcion: 'Fórmula avanzada con cafeína y beta-alanina', premium: true },
];

function Alimentacion() {
  const { accesoCompleto: isPremium, isAuthenticated } = useAuth();
  const [dietas, setDietas] = useState([]);
  const [dietasFiltradas, setDietasFiltradas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [objetivoSeleccionado, setObjetivoSeleccionado] = useState('TODAS');

  useEffect(() => {
    const cargarDietas = async () => {
      try {
        setCargando(true);
        const response = await api.get('/custom/dietas/publicas');
        const dietasData = response.data?.dietas || [];
        setDietas(dietasData);
        setDietasFiltradas(dietasData);
      } catch (error) {
        console.error('Error cargando dietas:', error);
      } finally {
        setCargando(false);
      }
    };
    cargarDietas();
  }, []);

  useEffect(() => {
    if (objetivoSeleccionado === 'TODAS') {
      setDietasFiltradas(dietas);
    } else {
      setDietasFiltradas(
        dietas.filter((d) => d.nombre?.toLowerCase().includes(objetivoSeleccionado.toLowerCase()))
      );
    }
  }, [objetivoSeleccionado, dietas]);

  return (
    <div className="min-h-screen bg-uf-darker">
      <SEO
        title="Dietas Profesionales y Nutrición"
        description="Planes nutricionales creados por expertos. Filtra dietas por objetivo: perder peso, volumen, mantenimiento."
        keywords="dietas fitness, nutricion deportiva, perder grasa, volumen, ganar musculo, alimentos"
      />

      <PageHeader
        eyebrow="Nutrición"
        title="Dietas"
        highlight="Profesionales"
        subtitle="Planes nutricionales clasificados por objetivo y valorados por la comunidad."
      />

      <div className="container mx-auto px-4 py-12">
        {/* FILTROS */}
        <div className="mb-12 flex flex-wrap justify-center gap-2" role="group" aria-label="Objetivo">
          {OBJETIVOS.map((objetivo) => (
            <button
              key={objetivo.id}
              type="button"
              onClick={() => setObjetivoSeleccionado(objetivo.id)}
              aria-pressed={objetivoSeleccionado === objetivo.id}
              className={`rounded-full border px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                objetivoSeleccionado === objetivo.id
                  ? 'border-uf-gold bg-uf-gold text-black shadow-lg shadow-uf-gold/30'
                  : 'border-uf-line bg-white/[0.03] text-gray-400 hover:border-uf-gold/60 hover:text-white'
              }`}
            >
              {objetivo.nombre}
            </button>
          ))}
        </div>

        {/* DIETAS DESTACADAS */}
        <section className="mb-20">
          <div className="mb-8">
            <span className="uf-eyebrow">Selección</span>
            <h2 className="mt-3 font-anton text-3xl uppercase text-white md:text-4xl">
              Dietas <span className="uf-text-gold">Destacadas</span>
            </h2>
          </div>

          {cargando && (
            <div className="flex justify-center py-20" role="status">
              <div className="h-14 w-14 animate-spin rounded-full border-b-4 border-t-4 border-uf-gold" />
            </div>
          )}

          {!cargando && dietasFiltradas.length > 0 && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {dietasFiltradas.map((dieta) => (
                <TarjetaDieta key={dieta.id} dieta={dieta} />
              ))}
            </div>
          )}

          {!cargando && dietasFiltradas.length === 0 && (
            <div className="uf-card py-16 text-center">
              <p className="text-lg text-uf-muted">No se encontraron dietas con este filtro</p>
            </div>
          )}
        </section>

        {/* SUPLEMENTOS */}
        <section>
          <div className="mb-8">
            <span className="uf-eyebrow">Complementa</span>
            <h2 className="mt-3 font-anton text-3xl uppercase text-white md:text-4xl">
              <span className="uf-text-gold">Suplementos</span> Recomendados
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {SUPLEMENTOS.map((suplemento) => {
              const bloqueado = suplemento.premium && !isPremium;
              return (
                <div key={suplemento.nombre} className="uf-card flex items-start gap-4 p-6">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-uf-gold/30 bg-uf-gold/10 text-uf-gold">
                    {bloqueado ? <Lock className="h-5 w-5" /> : <FlaskConical className="h-5 w-5" />}
                  </span>
                  <div>
                    <span className="uf-chip">{suplemento.categoria}</span>
                    <h3 className="mt-3 font-anton text-xl uppercase text-white">{suplemento.nombre}</h3>
                    <p className="mt-1 text-sm text-uf-muted">{suplemento.descripcion}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* EJEMPLO DE PLAN SEMANAL (solo visitantes) */}
        {!isAuthenticated && !cargando && (
          <section className="mt-24">
            <Reveal className="mb-10 text-center">
              <span className="uf-eyebrow justify-center">Planificación</span>
              <h2 className="mt-4 font-anton text-4xl uppercase text-white md:text-5xl">
                Ejemplo de <span className="uf-text-gold">Plan Semanal</span>
              </h2>
              <p className="mt-3 text-uf-muted">Así se vería una semana de comidas equilibradas y variadas</p>
            </Reveal>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
              {PLAN_EJEMPLO.map((d, i) => (
                <Reveal key={d.dia} delay={i * 50}>
                  <div className="uf-card flex h-full flex-col items-center p-4 text-center">
                    <p className="font-audiowide text-[10px] uppercase tracking-widest text-uf-muted">{d.dia}</p>
                    <span className="my-4 flex h-12 w-12 items-center justify-center rounded-full border border-uf-gold/30 bg-uf-gold/10 text-uf-gold">
                      <Salad className="h-5 w-5" />
                    </span>
                    <p className="flex-1 text-sm font-semibold leading-snug text-white">{d.comida}</p>
                    <p className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-uf-gold">
                      <Flame className="h-3.5 w-3.5" />
                      {d.kcal}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal className="mt-8">
              <div className="relative isolate overflow-hidden rounded-[1.5rem] border border-uf-gold/50 bg-uf-card px-6 py-12 text-center">
                <div className="uf-glow -z-10 left-1/2 top-0 h-56 w-[30rem] -translate-x-1/2" aria-hidden="true" />
                <h3 className="font-anton text-3xl uppercase text-white md:text-4xl">¿Quieres tu propia dieta a medida?</h3>
                <p className="mx-auto mt-3 max-w-xl text-gray-300">
                  Regístrate gratis y crea tu plan nutricional personalizado según tu objetivo.
                </p>
                <Link to="/register" className="uf-btn uf-btn-primary mt-7">
                  <Zap className="h-4 w-4" />
                  Crear mi dieta
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </Reveal>
          </section>
        )}
      </div>
    </div>
  );
}

// ============================================
// COMPONENTE: TarjetaDieta
// ============================================
function TarjetaDieta({ dieta }) {
  const esPremium = dieta.esPremium === true || dieta.tipo === 'premium';

  return (
    <Link to={`/dieta/${dieta.id}`} className="uf-card uf-card-hover group flex h-full flex-col p-5">
      <div className="mb-4 flex items-center justify-between">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-uf-gold/30 bg-uf-gold/10 text-uf-gold">
          <Salad className="h-5 w-5" />
        </span>
        {esPremium && (
          <span className="uf-chip border-uf-gold/40 bg-uf-gold/10 text-uf-gold">
            <Star className="h-3 w-3 fill-uf-gold" />
            Premium
          </span>
        )}
      </div>

      <h3 className="font-anton text-xl uppercase leading-tight text-white transition-colors group-hover:text-uf-gold">
        {dieta.nombre}
      </h3>

      <p className="mt-2 line-clamp-2 flex-1 text-xs leading-relaxed text-uf-muted">
        {dieta.descripcion || 'Plan nutricional completo'}
      </p>

      <div className="mt-4 flex items-center justify-between border-t border-uf-line pt-4">
        <span className="flex items-center gap-0.5" aria-label={`Valoración ${dieta.valoracionPromedio || 0} de 5`}>
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-3.5 w-3.5 ${i < Math.floor(dieta.valoracionPromedio || 0) ? 'fill-uf-gold text-uf-gold' : 'text-gray-700'}`}
            />
          ))}
          <span className="ml-1 text-xs text-gray-600">({dieta.totalValoraciones || 0})</span>
        </span>
        <ArrowRight className="h-4 w-4 text-uf-muted transition-all group-hover:translate-x-1 group-hover:text-uf-gold" />
      </div>
    </Link>
  );
}

export default Alimentacion;
