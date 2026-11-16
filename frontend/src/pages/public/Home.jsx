import { Link, useNavigate } from 'react-router-dom';
import { PAGOS } from "../../config/funciones";
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import CalculadoraNutricional from '../../components/dieta/CalculadoraNutricional';
import { guardarPendiente } from '../../utils/calculoNutricional';
import {
  Salad, Dumbbell, Star, Zap, ArrowRight, ArrowUpRight, Check,
  CalendarDays, BookOpen, Layers, Flame, Quote, Mail, Sparkles, Clock,
} from 'lucide-react';
import SEO from '../../components/common/SEO';
import MuscleMap from '../../components/common/MuscleMap';
import Reveal from '../../components/common/Reveal';

const GRUPOS = [
  { id: 'pecho', nombre: 'Pecho' },
  { id: 'espalda', nombre: 'Espalda' },
  { id: 'piernas', nombre: 'Piernas' },
  { id: 'hombros', nombre: 'Hombros' },
  { id: 'biceps', nombre: 'Bíceps' },
  { id: 'triceps', nombre: 'Tríceps' },
  { id: 'core', nombre: 'Core' },
  { id: 'gluteos', nombre: 'Glúteos' },
];

const SERVICIOS = [
  {
    icon: Dumbbell,
    title: 'Gym Training',
    description: 'Biblioteca de ejercicios de gimnasio ordenada por grupo muscular y nivel.',
    image: '/images/gymfondo.jpg',
    link: '/gym',
    span: 'lg:col-span-2 lg:row-span-2',
  },
  {
    icon: Salad,
    title: 'Dieta equilibrada',
    description: 'Planes nutricionales estructurados para tu objetivo.',
    image: '/images/dieta.jpg',
    link: '/alimentacion',
    span: 'lg:col-span-2',
  },
  {
    icon: Flame,
    title: 'Deporte al aire libre',
    description: 'Calistenia y funcional para entrenar donde quieras.',
    image: '/images/running.jpg',
    link: '/workout',
    span: '',
  },
  {
    icon: Layers,
    title: '¿Qué ofrecemos?',
    description: 'Todo lo que incluye cada plan.',
    image: '/images/ofrecemos.jpg',
    link: '/servicios',
    span: '',
  },
];

const STATS = [
  { value: '140+', label: 'Ejercicios' },
  { value: '8', label: 'Grupos musculares' },
  { value: '35+', label: 'Platos y recetas' },
  { value: '24/7', label: 'Acceso a tu plan' },
];

const BLOG = [
  {
    titulo: 'Cómo ganar masa muscular de forma natural',
    categoria: 'Entrenamiento',
    extracto: 'Las claves para maximizar tu ganancia muscular con nutrición y entrenamiento optimizados.',
    icon: Dumbbell,
  },
  {
    titulo: '5 errores comunes en tu dieta',
    categoria: 'Nutrición',
    extracto: 'Evita los fallos más frecuentes que frenan tu progreso y aprende a optimizar tu alimentación.',
    icon: Salad,
  },
  {
    titulo: 'Guía de suplementación deportiva',
    categoria: 'Suplementos',
    extracto: 'Todo lo que necesitas saber sobre proteínas, creatina y los suplementos esenciales.',
    icon: Zap,
  },
];

// Opiniones de ejemplo: no se muestran hasta que haya opiniones reales y verificables
// (mostrar opiniones inventadas como reales es práctica comercial desleal).
const TESTIMONIOS_REALES = false;
const TESTIMONIOS = [
  {
    nombre: 'Carlos M.',
    rol: 'Usuario Premium',
    texto: 'En 3 meses he conseguido resultados que no había logrado en dos años por mi cuenta. Las dietas personalizadas marcaron la diferencia.',
    estrellas: 5,
  },
  {
    nombre: 'Laura G.',
    rol: 'Usuario Premium',
    texto: 'La biblioteca de ejercicios es increíble. Tengo mi rutina organizada por días y sé exactamente qué toca cada sesión.',
    estrellas: 5,
  },
  {
    nombre: 'Miguel R.',
    rol: 'Plan Gratuito',
    texto: 'Empecé con el plan gratuito y me encantó. Las rutinas de calistenia son perfectas para entrenar en casa sin equipamiento.',
    estrellas: 4,
  },
];

const PLAN_GRATIS = [
  'Biblioteca completa de ejercicios',
  'Crea tus rutinas y tus dietas',
  'Rutinas y dietas listas del equipo',
  'Calculadora de calorías y macros',
  'Calendario y registro de entrenos',
  'Blog y comunidad',
];
const PLAN_PREMIUM = [
  'Todo lo del plan gratuito',
  'Entrenador personal asignado',
  'Rutinas y dietas a tu medida',
  'Videos de técnica en HD',
  'Seguimiento semanal',
  'Acceso anticipado a novedades',
];

function SectionHeader({ eyebrow, title, highlight, subtitle, link, linkLabel, center = false }) {
  return (
    <div className={`mb-12 flex flex-col gap-6 ${center ? 'items-center text-center' : 'md:flex-row md:items-end md:justify-between'}`}>
      <div className={center ? 'max-w-2xl' : 'max-w-2xl'}>
        <span className="uf-eyebrow">{eyebrow}</span>
        <h2 className="mt-4 font-anton text-4xl uppercase leading-[1.05] text-white md:text-6xl">
          {title} <span className="uf-text-gold">{highlight}</span>
        </h2>
        {subtitle && <p className="mt-4 text-lg text-uf-muted">{subtitle}</p>}
      </div>
      {link && (
        <Link
          to={link}
          className="group inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-uf-gold transition-colors hover:text-white"
        >
          {linkLabel}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
}

function Home() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [grupoHero, setGrupoHero] = useState(0);
  const [pausado, setPausado] = useState(false);

  // La calculadora es gratis, pero el resultado se ve con cuenta: así queda guardado en su perfil
  const alCalcular = (_resultado, datos) => {
    if (isAuthenticated) {
      navigate('/calculadora', { state: { datos } });
    } else {
      guardarPendiente(datos);
      navigate('/register', { state: { desdeCalculadora: true } });
    }
  };

  useEffect(() => {
    if (pausado) return undefined;
    const id = setInterval(() => setGrupoHero((i) => (i + 1) % GRUPOS.length), 2200);
    return () => clearInterval(id);
  }, [pausado]);

  const grupoActual = GRUPOS[grupoHero];

  return (
    <div className="min-h-screen overflow-x-hidden bg-uf-darker">
      <SEO
        title="Inicio"
        description="Únete a Ultimate Fitness y transforma tu cuerpo con rutinas de entrenamiento, planes de dieta personalizados y seguimiento de tu progreso."
      />

      {/* ============================================ */}
      {/* 1. HERO */}
      {/* ============================================ */}
      <section className="relative isolate overflow-hidden">
        <div
          className="absolute inset-0 -z-20 bg-cover bg-center opacity-25"
          style={{ backgroundImage: 'url(/images/gymfondo.jpg)' }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-uf-darker via-uf-darker/90 to-uf-darker/60" aria-hidden="true" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-uf-darker via-transparent to-uf-darker/70" aria-hidden="true" />
        <div className="uf-grid-bg absolute inset-0 -z-10" aria-hidden="true" />
        <div className="uf-glow -z-10 right-[8%] top-[18%] h-[420px] w-[420px]" aria-hidden="true" />

        <div className="container mx-auto grid items-center gap-12 px-4 pb-20 pt-16 lg:min-h-[calc(100vh-5rem)] lg:grid-cols-[1.1fr_0.9fr] lg:pb-24 lg:pt-10">
          {/* Texto */}
          <div className="text-center lg:text-left">
            <span className="uf-chip mb-6 border-uf-gold/40 bg-uf-gold/10 text-uf-gold">
              <Sparkles className="h-3.5 w-3.5" />
              {PAGOS ? 'Premium gratis durante el lanzamiento' : 'Gratis durante el lanzamiento'}
            </span>

            <h1 className="font-anton text-[3.4rem] uppercase leading-[0.95] text-white sm:text-7xl xl:text-[6.5rem]">
              Conviértete
              <br />
              en <span className="uf-text-gold">Ultimate</span>
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-gray-300 lg:mx-0 lg:text-xl">
              La plataforma de entrenamiento y nutrición online. Consulta ejercicios por grupo muscular,
              sigue dietas equilibradas y crea tu propia rutina.
            </p>

            <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
              <Link to="/register" className="uf-btn uf-btn-primary w-full sm:w-auto">
                <Zap className="h-4 w-4" />
                Comenzar ahora
              </Link>
              <Link to="/gym" className="uf-btn uf-btn-ghost w-full sm:w-auto">
                Ver ejercicios
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <dl className="mx-auto mt-12 grid max-w-xl grid-cols-3 gap-6 border-t border-uf-line pt-8 lg:mx-0">
              {STATS.slice(0, 3).map((s) => (
                <div key={s.label}>
                  <dt className="font-anton text-3xl text-white md:text-4xl">{s.value}</dt>
                  <dd className="mt-1 text-xs uppercase tracking-widest text-uf-muted">{s.label}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Figura anatómica */}
          <div
            className="relative mx-auto w-full max-w-md lg:max-w-none"
            onMouseEnter={() => setPausado(true)}
            onMouseLeave={() => setPausado(false)}
          >
            <div className="uf-card relative overflow-hidden p-6 sm:p-8">
              <div className="mb-4 flex items-center justify-between">
                <span className="uf-eyebrow">Zona trabajada</span>
                <span className="font-anton text-2xl uppercase text-uf-gold">{grupoActual.nombre}</span>
              </div>

              <MuscleMap grupo={grupoActual.id} vista="ambas" className="h-[300px] sm:h-[400px]" />

              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {GRUPOS.map((g, i) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setGrupoHero(i)}
                    aria-pressed={i === grupoHero}
                    className={`rounded-full border px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-all ${
                      i === grupoHero
                        ? 'border-uf-gold bg-uf-gold text-black'
                        : 'border-uf-line bg-white/[0.03] text-gray-400 hover:border-uf-gold/60 hover:text-white'
                    }`}
                  >
                    {g.nombre}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* 3. SERVICIOS */}
      {/* ============================================ */}
      <section className="container mx-auto px-4 py-24">
        <Reveal>
          <SectionHeader
            eyebrow="Todo en un solo lugar"
            title="Nuestros"
            highlight="Servicios"
            subtitle="Todo lo que necesitas para alcanzar tus objetivos fitness."
            link="/servicios"
            linkLabel="Ver todos"
          />
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2 lg:auto-rows-[230px] lg:grid-cols-4">
          {SERVICIOS.map((s, i) => (
            <Reveal key={s.title} delay={i * 80} className={`min-h-[230px] ${s.span}`}>
              <Link
                to={s.link}
                className="group relative flex h-full min-h-[230px] flex-col justify-end overflow-hidden rounded-[1.25rem] border border-uf-line p-6 transition-colors duration-300 hover:border-uf-gold/70"
              >
                <img
                  src={s.image}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover opacity-60 transition-all duration-700 group-hover:scale-105 group-hover:opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                <span className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur transition-all group-hover:border-uf-gold group-hover:bg-uf-gold group-hover:text-black">
                  <ArrowUpRight className="h-5 w-5" />
                </span>
                <div className="relative">
                  <span className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-uf-gold text-black">
                    <s.icon className="h-5 w-5" />
                  </span>
                  <h3 className="font-anton text-2xl uppercase text-white md:text-3xl">{s.title}</h3>
                  <p className="mt-1 max-w-md text-sm text-gray-300">{s.description}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============================================ */}
      {/* 4. ENTRENA POR ZONA */}
      {/* ============================================ */}
      <section className="relative border-y border-uf-line bg-uf-card/60 py-24">
        <div className="container mx-auto px-4">
          <Reveal>
            <SectionHeader
              eyebrow="Biblioteca de ejercicios"
              title="Entrena por"
              highlight="Zona"
              subtitle="Elige el grupo muscular y descubre los ejercicios que lo trabajan."
              link="/gym"
              linkLabel="Ver biblioteca"
            />
          </Reveal>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {GRUPOS.map((g, i) => (
              <Reveal key={g.id} delay={i * 50}>
                <Link
                  to={`/gym?grupo=${g.id}`}
                  className="uf-card uf-card-hover group flex flex-col items-center p-5 text-center"
                >
                  <MuscleMap grupo={g.id} className="h-40 md:h-48" />
                  <h3 className="mt-4 font-anton text-xl uppercase text-white transition-colors group-hover:text-uf-gold">
                    {g.nombre}
                  </h3>
                  <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-uf-muted">
                    Ver ejercicios
                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* 5. BLOG */}
      {/* ============================================ */}
      <section className="container mx-auto px-4 py-24">
        <Reveal>
          <SectionHeader
            eyebrow="Aprende"
            title="Últimos del"
            highlight="Blog"
            subtitle="Consejos, rutinas y todo sobre fitness."
            link="/blog"
            linkLabel="Ver todos los artículos"
          />
        </Reveal>

        <div className="grid gap-4 md:grid-cols-3">
          {BLOG.map((post, i) => (
            <Reveal key={post.titulo} delay={i * 80}>
              <Link to="/blog" className="uf-card uf-card-hover group flex h-full flex-col p-7">
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-uf-gold/30 bg-uf-gold/10 text-uf-gold">
                    <post.icon className="h-5 w-5" />
                  </span>
                  <span className="uf-chip">{post.categoria}</span>
                </div>
                <h3 className="mt-6 font-sans text-xl font-bold leading-snug text-white transition-colors group-hover:text-uf-gold">
                  {post.titulo}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-uf-muted">{post.extracto}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-uf-gold">
                  <BookOpen className="h-4 w-4" />
                  Leer artículo
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {TESTIMONIOS_REALES && (
      <>
      {/* ============================================ */}
      {/* 6. TESTIMONIOS */}
      {/* ============================================ */}
      <section className="border-y border-uf-line bg-uf-card/60 py-24">
        <div className="container mx-auto px-4">
          <Reveal>
            <SectionHeader
              eyebrow="Comunidad"
              title="Lo que dicen nuestros"
              highlight="Usuarios"
              center
            />
          </Reveal>

          <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-3">
            {TESTIMONIOS.map((t, i) => (
              <Reveal key={t.nombre} delay={i * 80}>
                <figure className="uf-card flex h-full flex-col p-7">
                  <Quote className="h-8 w-8 text-uf-gold/50" />
                  <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-gray-300">
                    {t.texto}
                  </blockquote>
                  <div className="mt-5 flex items-center gap-1" aria-label={`${t.estrellas} de 5 estrellas`}>
                    {[...Array(5)].map((_, s) => (
                      <Star key={s} className={`h-4 w-4 ${s < t.estrellas ? 'fill-uf-gold text-uf-gold' : 'text-gray-700'}`} />
                    ))}
                  </div>
                  <figcaption className="mt-5 flex items-center gap-3 border-t border-uf-line pt-5">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-uf-gold font-anton text-lg text-black">
                      {t.nombre.charAt(0)}
                    </span>
                    <span>
                      <span className="block text-sm font-bold text-white">{t.nombre}</span>
                      <span className="block text-xs text-uf-gold">{t.rol}</span>
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>

          {/* Cifras */}
          <Reveal className="mx-auto mt-16 max-w-6xl">
            <dl className="uf-card grid grid-cols-2 divide-uf-line overflow-hidden md:grid-cols-4 md:divide-x">
              {STATS.map((s) => (
                <div key={s.label} className="px-6 py-9 text-center">
                  <dt className="uf-text-gold font-anton text-5xl md:text-6xl">{s.value}</dt>
                  <dd className="mt-2 text-xs font-semibold uppercase tracking-widest text-uf-muted">{s.label}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>
      </>
      )}

      {/* ============================================ */}
      {/* 7. PLANES */}
      {/* ============================================ */}
      <section className="container mx-auto px-4 py-24">
        <Reveal>
          <SectionHeader
            eyebrow="Planes"
            title="Elige tu"
            highlight="Plan"
            subtitle={PAGOS ? 'Comienza gratis y pasa a Premium cuando quieras.' : 'Durante el lanzamiento, todo está incluido en el plan gratuito.'}
            center
          />
        </Reveal>

        <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
          <Reveal>
            <div className="uf-card relative flex h-full flex-col border-uf-gold/70 p-8 shadow-[0_30px_80px_-30px_rgba(204,148,26,0.45)]">
              <span className="absolute -top-3 right-6 inline-flex items-center gap-1.5 rounded-full bg-uf-gold px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-black">
                <Star className="h-3.5 w-3.5 fill-black" />
                Disponible ahora
              </span>
              <h3 className="font-anton text-2xl uppercase text-white">Plan Gratuito</h3>
              <p className="mt-4 flex items-baseline gap-2">
                <span className="font-anton text-6xl text-white">0€</span>
                <span className="text-uf-muted">siempre gratis</span>
              </p>
              <ul className="mt-8 flex-1 space-y-3">
                {PLAN_GRATIS.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-white">
                    <Check className="h-4 w-4 shrink-0 text-uf-gold" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/register" className="uf-btn uf-btn-primary mt-8 w-full">
                <Zap className="h-4 w-4" />
                Crear cuenta gratis
              </Link>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="uf-card relative flex h-full flex-col p-8">
              <span className="absolute -top-3 right-6 inline-flex items-center gap-1.5 rounded-full border border-uf-line bg-uf-darker px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-gray-300">
                <Clock className="h-3.5 w-3.5" />
                {PAGOS ? 'Más popular' : 'Próximamente'}
              </span>
              <h3 className="sr-only">Ultimate Premium</h3>
              <img src="/logos/logo-premium.png" alt="Ultimate Fitness Premium" className="h-20 w-auto self-start" />
              {PAGOS ? (
                <p className="mt-4 flex items-baseline gap-3">
                  <span className="text-2xl font-bold text-gray-600 line-through">19€</span>
                  <span className="uf-text-gold font-anton text-6xl">Gratis</span>
                </p>
              ) : (
                <p className="mt-4 font-anton text-4xl uppercase text-gray-400">Próximamente</p>
              )}
              <p className="mt-2 text-xs font-bold uppercase tracking-widest text-uf-muted">
                {PAGOS ? 'Oferta de lanzamiento' : 'Te avisaremos cuando esté disponible'}
              </p>
              <ul className="mt-6 flex-1 space-y-3">
                {PLAN_PREMIUM.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-gray-300">
                    <Check className="h-4 w-4 shrink-0 text-uf-gold/70" />
                    {item}
                  </li>
                ))}
              </ul>
              {PAGOS ? (
                <Link to="/upgrade-premium" className="uf-btn uf-btn-primary mt-8 w-full">
                  <Star className="h-4 w-4" />
                  Hacerse Premium
                </Link>
              ) : (
                <span className="uf-btn uf-btn-ghost mt-8 w-full cursor-default opacity-60" aria-disabled="true">
                  Disponible pronto
                </span>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================ */}
      {/* 7b. CALCULADORA NUTRICIONAL */}
      {/* ============================================ */}
      <section id="calculadora" className="border-y border-uf-line bg-uf-card/60 py-24">
        <div className="container mx-auto px-4">
          <Reveal>
            <SectionHeader
              eyebrow="Gratis y sin tarjeta"
              title="Calcula tus"
              highlight="Calorías"
              subtitle="Rellena tus datos y te decimos cuántas calorías y macros necesitas al día. El resultado se guarda en tu cuenta gratuita."
              center
            />
          </Reveal>
          <Reveal className="mx-auto max-w-4xl">
            <CalculadoraNutricional
              mostrarResultado={false}
              onCalcular={alCalcular}
              titulo="Calculadora nutricional"
              textoBoton={isAuthenticated ? 'Ver mi resultado' : 'Ver mi resultado con mi cuenta gratis'}
            />
          </Reveal>
        </div>
      </section>

      {/* ============================================ */}
      {/* 8. CTA FINAL */}
      {/* ============================================ */}
      <section className="container mx-auto px-4 pb-24">
        <Reveal>
          <div className="relative isolate overflow-hidden rounded-[2rem] border border-uf-gold/50 bg-uf-card px-6 py-16 text-center md:px-16 md:py-20">
            <div className="uf-grid-bg absolute inset-0 -z-10" aria-hidden="true" />
            <div className="uf-glow -z-10 left-1/2 top-0 h-72 w-[36rem] -translate-x-1/2" aria-hidden="true" />

            <span className="uf-eyebrow justify-center">
              <CalendarDays className="h-3.5 w-3.5" />
              Empieza hoy
            </span>
            <h2 className="mx-auto mt-5 max-w-3xl font-anton text-4xl uppercase leading-[1.05] text-white md:text-6xl">
              ¿Listo para <span className="uf-text-gold">transformarte</span>?
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-300">
              Únete a Ultimate Fitness y da el primer paso hacia tu mejor versión. Empezar es completamente gratis.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/register" className="uf-btn uf-btn-primary w-full sm:w-auto">
                <Zap className="h-4 w-4" />
                Conviértete en Ultimate
              </Link>
              <Link to="/contacto" className="uf-btn uf-btn-ghost w-full sm:w-auto">
                <Mail className="h-4 w-4" />
                Contactar
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}

export default Home;
