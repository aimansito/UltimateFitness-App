import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import {
  Monitor, Salad, Activity, Dumbbell,
  Star, Users, Clock, BookOpen,
  ChevronRight, Zap, Target, Heart,
  TrendingUp, Award, Shield, ArrowRight
} from 'lucide-react';
import SEO from '../../components/common/SEO';

function Home() {

  // ============================================
  // DATOS - Cards de servicios
  // ============================================
  const servicios = [
    {
      icon: Monitor,
      title: '¿QUÉ OFRECEMOS?',
      description: 'Todo lo que tienes que saber para mantenerte en forma con nuestro método.',
      image: '/images/ofrecemos.jpg',
      link: '/servicios',
    },
    {
      icon: Salad,
      title: 'DIETA EQUILIBRADA',
      description: 'Planes nutricionales estructurados para llevar a cabo tu transformación.',
      image: '/images/dieta.jpg',
      link: '/alimentacion',
    },
    {
      icon: Activity,
      title: 'DEPORTE AL AIRE LIBRE',
      description: 'Rutinas de calistenia y funcional para entrenar donde quieras.',
      image: '/images/running.jpg',
      link: '/workout',
    },
    {
      icon: Dumbbell,
      title: 'GYM TRAINING',
      description: 'Ejercicios de gimnasio con guías profesionales y videos HD.',
      image: '/images/gymfondo.jpg',
      link: '/gym',
    },
  ];

  // ============================================
  // DATOS - Stats
  // ============================================
  const stats = [
    { icon: Dumbbell, value: '60+', label: 'Ejercicios', color: 'text-uf-gold' },
    { icon: Salad, value: '30+', label: 'Dietas', color: 'text-green-400' },
    { icon: Users, value: '500+', label: 'Usuarios', color: 'text-uf-blue' },
    { icon: Clock, value: '24/7', label: 'Soporte', color: 'text-purple-400' },
  ];

  // ============================================
  // DATOS - Ejercicios destacados
  // ============================================
  const ejerciciosDestacados = [
    {
      nombre: 'Press de Banca',
      grupo: 'Pecho',
      nivel: 'Intermedio',
      valoracion: 4.8,
      icon: '🏋️',
      color: 'from-red-500/20 to-red-900/20',
      borderColor: 'border-red-500/30',
    },
    {
      nombre: 'Sentadillas',
      grupo: 'Piernas',
      nivel: 'Intermedio',
      valoracion: 4.9,
      icon: '🦵',
      color: 'from-blue-500/20 to-blue-900/20',
      borderColor: 'border-blue-500/30',
    },
    {
      nombre: 'Dominadas',
      grupo: 'Espalda',
      nivel: 'Avanzado',
      valoracion: 4.7,
      icon: '💪',
      color: 'from-green-500/20 to-green-900/20',
      borderColor: 'border-green-500/30',
    },
  ];

  // ============================================
  // DATOS - Dietas preview
  // ============================================
  const dietasPreview = [
    {
      nombre: 'Dieta de Definición',
      objetivo: 'Pérdida de grasa',
      calorias: '1.800 kcal',
      valoracion: 4.8,
      color: 'from-orange-500/20 to-orange-900/20',
    },
    {
      nombre: 'Dieta Volumen Limpio',
      objetivo: 'Ganancia muscular',
      calorias: '3.200 kcal',
      valoracion: 4.9,
      color: 'from-green-500/20 to-green-900/20',
    },
    {
      nombre: 'Dieta Mantenimiento',
      objetivo: 'Mantenimiento',
      calorias: '2.400 kcal',
      valoracion: 4.6,
      color: 'from-blue-500/20 to-blue-900/20',
    },
  ];

  // ============================================
  // DATOS - Testimonios
  // ============================================
  const testimonios = [
    {
      nombre: 'Carlos M.',
      rol: 'Usuario Premium',
      texto: 'En 3 meses he conseguido resultados que no había logrado en dos años por mi cuenta. Las dietas personalizadas marcaron la diferencia.',
      avatar: '💪',
      estrellas: 5,
    },
    {
      nombre: 'Laura G.',
      rol: 'Usuario Premium',
      texto: 'La biblioteca de ejercicios con videos HD es increíble. Mi entrenador me ajusta la rutina cada semana según mi progreso.',
      avatar: '🏃‍♀️',
      estrellas: 5,
    },
    {
      nombre: 'Miguel R.',
      rol: 'Plan Gratuito',
      texto: 'Empecé con el plan gratuito y me encantó. Las rutinas de calistenia son perfectas para entrenar en casa sin equipamiento.',
      avatar: '🧗',
      estrellas: 4,
    },
  ];

  // ============================================
  // ANIMACIÓN - Contador de stats
  // ============================================
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setStatsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen">
      <SEO 
        title="Inicio" 
        description="Únete a Ultimate Fitness y transforma tu cuerpo con nuestros entrenadores expertos, planes de dieta personalizados y gran comunidad."
      />

      {/* ============================================ */}
      {/* 1. HERO SECTION */}
      {/* ============================================ */}
      <div className="relative">
        <div
          className="min-h-[700px] bg-cover bg-center relative flex items-center justify-center pb-20"
          style={{ backgroundImage: 'url(/images/gymfondo.jpg)' }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80"></div>

          <div className="container mx-auto px-4 relative z-10">

            {/* CONTENIDO CENTRAL */}
            <div className="text-center space-y-10">
              <div className="inline-block">
                <h1 className="bg-uf-gold text-black font-anton font-bold text-3xl md:text-4xl uppercase tracking-wider px-12 py-4 rounded-lg shadow-2xl hover:scale-105 transition-transform duration-300">
                  Conviértete en Ultimate
                </h1>
              </div>

              <p className="text-white text-lg md:text-xl font-light tracking-wide max-w-3xl mx-auto">
                La plataforma definitiva de entrenamiento y nutrición online.
                Planes personalizados, ejercicios guiados y entrenadores profesionales.
              </p>

              <div className="flex flex-col sm:flex-row justify-center items-center gap-6 pt-8">
                <Link
                  to="/register"
                  className="group relative overflow-hidden bg-uf-gold hover:bg-uf-blue text-black hover:text-white font-bold px-10 py-3.5 rounded-lg uppercase tracking-wider transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl text-sm"
                >
                  Comenzar Ahora
                  <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></span>
                </Link>

                <Link
                  to="/servicios"
                  className="bg-transparent border-2 border-white/30 hover:border-uf-gold text-white hover:text-uf-gold font-bold px-10 py-3.5 rounded-lg uppercase tracking-wider transition-all duration-300 text-sm backdrop-blur-sm hover:bg-white/5"
                >
                  Ver Servicios
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>



      {/* ============================================ */}
      {/* 3. SERVICIOS GRID */}
      {/* ============================================ */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-anton font-bold text-white mb-4 uppercase tracking-wider">
            Nuestros <span className="text-uf-gold">Servicios</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Todo lo que necesitas para alcanzar tus objetivos fitness en un solo lugar
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {servicios.map((servicio, index) => {
            const IconComponent = servicio.icon;
            return (
              <div
                key={index}
                className="group relative bg-uf-dark border-2 border-uf-gold/50 rounded-lg overflow-hidden hover:border-uf-gold transition-all duration-300 hover:scale-105"
              >
                <div className="h-64 overflow-hidden">
                  <img
                    src={servicio.image}
                    alt={servicio.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                <div className="p-6">
                  <div className="bg-uf-gold text-black font-bold text-center py-3 mb-4 rounded uppercase tracking-wider flex items-center justify-center gap-2 text-sm">
                    <IconComponent className="w-5 h-5" />
                    {servicio.title}
                  </div>
                  <p className="text-gray-300 text-sm mb-6">
                    {servicio.description}
                  </p>
                  <Link
                    to={servicio.link}
                    className="block w-full text-center bg-uf-blue hover:bg-uf-gold text-white hover:text-black font-bold py-3 rounded uppercase tracking-wider transition text-sm"
                  >
                    SABER MÁS »
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ============================================ */}
      {/* 4. EJERCICIOS DESTACADOS */}
      {/* ============================================ */}
      <div className="bg-gradient-to-b from-uf-darker to-black py-20 border-y border-uf-gold/10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-anton font-bold text-white mb-2 uppercase tracking-wider">
                Ejercicios <span className="text-uf-gold">Populares</span>
              </h2>
              <p className="text-gray-400 text-lg">
                Los favoritos de nuestra comunidad
              </p>
            </div>
            <Link
              to="/gym"
              className="mt-4 md:mt-0 inline-flex items-center gap-2 text-uf-gold hover:text-white font-bold uppercase text-sm tracking-wider transition-colors group"
            >
              Ver todos
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {ejerciciosDestacados.map((ej, index) => (
              <Link
                key={index}
                to="/gym"
                className={`group relative bg-gradient-to-br ${ej.color} border-2 ${ej.borderColor} rounded-2xl p-6 hover:border-uf-gold transition-all duration-300 hover:scale-105`}
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-4xl">{ej.icon}</span>
                  <span className="bg-uf-gold/20 text-uf-gold px-3 py-1 rounded-full text-xs font-bold uppercase">
                    {ej.nivel}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-1 uppercase">{ej.nombre}</h3>
                <p className="text-gray-400 text-sm mb-4">{ej.grupo}</p>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < Math.floor(ej.valoracion) ? 'text-uf-gold fill-uf-gold' : 'text-gray-600'}`}
                    />
                  ))}
                  <span className="text-gray-400 text-sm ml-2">{ej.valoracion}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* 5. DIETAS PREVIEW */}
      {/* ============================================ */}
      <div className="container mx-auto px-4 py-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div>
            <h2 className="text-4xl md:text-5xl font-anton font-bold text-white mb-2 uppercase tracking-wider">
              <span className="text-uf-gold">Dietas</span> Profesionales
            </h2>
            <p className="text-gray-400 text-lg">
              Planes nutricionales creados por expertos
            </p>
          </div>
          <Link
            to="/alimentacion"
            className="mt-4 md:mt-0 inline-flex items-center gap-2 text-uf-gold hover:text-white font-bold uppercase text-sm tracking-wider transition-colors group"
          >
            Ver todas
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {dietasPreview.map((dieta, index) => (
            <Link
              key={index}
              to="/alimentacion"
              className={`group bg-gradient-to-br ${dieta.color} border-2 border-gray-700 hover:border-uf-gold rounded-2xl p-6 transition-all duration-300 hover:scale-105`}
            >
              <div className="flex items-center gap-2 mb-4">
                <Salad className="w-6 h-6 text-uf-gold" />
                <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-bold uppercase">
                  {dieta.objetivo}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 uppercase">{dieta.nombre}</h3>
              <p className="text-gray-400 text-sm mb-4">
                <span className="text-uf-gold font-bold">{dieta.calorias}</span> / día
              </p>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < Math.floor(dieta.valoracion) ? 'text-uf-gold fill-uf-gold' : 'text-gray-600'}`}
                  />
                ))}
                <span className="text-gray-400 text-sm ml-2">{dieta.valoracion}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ============================================ */}
      {/* 6. PLANES - GRATIS vs PREMIUM */}
      {/* ============================================ */}
      <div className="bg-gradient-to-b from-black via-uf-darker to-black py-20 border-y border-uf-gold/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-anton font-bold text-white mb-4 uppercase tracking-wider">
              Elige tu <span className="text-uf-gold">Plan</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Comienza gratis y hazte premium cuando estés listo para el siguiente nivel
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* PLAN GRATIS */}
            <div className="bg-gradient-to-br from-uf-dark to-black border-2 border-gray-700 rounded-2xl p-8 hover:border-gray-500 transition-all duration-300">
              <h3 className="text-2xl font-anton font-bold text-white mb-2 uppercase">Plan Gratuito</h3>
              <div className="mb-6">
                <span className="text-5xl font-bold text-white">0€</span>
                <span className="text-gray-400 text-lg ml-2">siempre gratis</span>
              </div>
              <ul className="space-y-3 mb-8">
                {['Acceso a ejercicios básicos', 'Rutinas predefinidas', 'Blog completo', 'Comunidad online'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-300 text-sm">
                    <svg className="w-5 h-5 text-uf-gold flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                to="/register"
                className="block w-full text-center bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 rounded-xl uppercase tracking-wider transition-all duration-300 border-2 border-gray-600"
              >
                Comenzar Gratis
              </Link>
            </div>

            {/* PLAN PREMIUM */}
            <div className="relative bg-gradient-to-br from-uf-dark to-black border-2 border-uf-gold rounded-2xl p-8 shadow-2xl shadow-uf-gold/20 hover:scale-105 transition-all duration-300">
              <div className="absolute top-0 right-0 bg-uf-gold text-black px-6 py-2 text-xs font-bold uppercase tracking-wider rounded-bl-2xl flex items-center gap-2">
                <Star className="w-4 h-4" />
                MÁS POPULAR
              </div>

              <h3 className="text-2xl font-anton font-bold text-white mb-2 uppercase">
                Ultimate Premium
              </h3>
              <div className="mb-6">
                <span className="text-5xl font-bold text-uf-gold">19€</span>
                <span className="text-gray-400 text-lg ml-2">/mes</span>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  'Todo lo del plan gratuito',
                  'Entrenamientos personalizados',
                  'Dietas a medida',
                  'Chat 24/7 con entrenador',
                  'Videos premium 4K',
                  'Seguimiento semanal'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-white text-sm">
                    <svg className="w-5 h-5 text-uf-gold flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                to="/upgrade-premium"
                className="flex items-center justify-center gap-2 w-full text-center bg-uf-gold hover:bg-uf-blue text-black hover:text-white font-bold py-4 rounded-xl uppercase tracking-wider transition-all duration-300 border-2 border-uf-gold shadow-lg"
              >
                <Star className="w-5 h-5" />
                Hacerse Premium
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* 7. BLOG PREVIEW */}
      {/* ============================================ */}
      <div className="container mx-auto px-4 py-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div>
            <h2 className="text-4xl md:text-5xl font-anton font-bold text-white mb-2 uppercase tracking-wider">
              Últimos del <span className="text-uf-gold">Blog</span>
            </h2>
            <p className="text-gray-400 text-lg">
              Consejos, rutinas y todo sobre fitness
            </p>
          </div>
          <Link
            to="/blog"
            className="mt-4 md:mt-0 inline-flex items-center gap-2 text-uf-gold hover:text-white font-bold uppercase text-sm tracking-wider transition-colors group"
          >
            Ver todos los artículos
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              titulo: 'Cómo ganar masa muscular de forma natural',
              categoria: 'Entrenamiento',
              extracto: 'Descubre las claves para maximizar tu ganancia muscular con nutrición y entrenamiento optimizados.',
              catColor: 'bg-blue-500/20 text-blue-400',
              icon: Dumbbell,
            },
            {
              titulo: '5 errores comunes en tu dieta',
              categoria: 'Nutrición',
              extracto: 'Evita los fallos más frecuentes que frenan tu progreso y aprende a optimizar tu alimentación.',
              catColor: 'bg-green-500/20 text-green-400',
              icon: Salad,
            },
            {
              titulo: 'Guía de suplementación deportiva',
              categoria: 'Suplementos',
              extracto: 'Todo lo que necesitas saber sobre proteínas, creatina y los suplementos esenciales.',
              catColor: 'bg-purple-500/20 text-purple-400',
              icon: Zap,
            },
          ].map((post, index) => {
            const PostIcon = post.icon;
            return (
              <Link
                key={index}
                to="/blog"
                className="group bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-2 border-gray-700 hover:border-uf-gold rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105"
              >
                <div className="h-48 bg-gradient-to-br from-uf-gold/10 to-uf-blue/10 flex items-center justify-center">
                  <PostIcon className="w-16 h-16 text-white/20 group-hover:text-uf-gold/40 transition-colors" />
                </div>
                <div className="p-6">
                  <span className={`${post.catColor} px-3 py-1 rounded-full text-xs font-bold uppercase`}>
                    {post.categoria}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-3 mb-2 group-hover:text-uf-gold transition-colors">
                    {post.titulo}
                  </h3>
                  <p className="text-gray-400 text-sm line-clamp-2">{post.extracto}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ============================================ */}
      {/* 8. TESTIMONIOS */}
      {/* ============================================ */}
      <div className="bg-gradient-to-b from-black to-uf-darker py-20 border-t border-uf-gold/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-anton font-bold text-white mb-4 uppercase tracking-wider">
              Lo que dicen nuestros <span className="text-uf-gold">Usuarios</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Historias reales de transformación
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonios.map((t, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-2 border-gray-700 rounded-2xl p-6 hover:border-uf-gold/50 transition-all duration-300"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < t.estrellas ? 'text-uf-gold fill-uf-gold' : 'text-gray-600'}`}
                    />
                  ))}
                </div>
                <p className="text-gray-300 text-sm mb-6 italic leading-relaxed">
                  "{t.texto}"
                </p>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{t.avatar}</span>
                  <div>
                    <p className="text-white font-bold text-sm">{t.nombre}</p>
                    <p className="text-uf-gold text-xs">{t.rol}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* 9. STATS COUNTER */}
      {/* ============================================ */}
      <div ref={statsRef} className="container mx-auto px-4 py-16">
        <div className="bg-uf-dark/90 backdrop-blur-xl border-2 border-uf-gold/30 rounded-2xl p-8 shadow-2xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div
                  key={index}
                  className={`text-center transition-all duration-700 ${statsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  <div className="inline-flex items-center justify-center bg-uf-gold/10 rounded-full p-4 mb-3">
                    <IconComponent className={`w-8 h-8 ${stat.color}`} />
                  </div>
                  <div className={`text-4xl md:text-5xl font-anton font-bold ${stat.color} mb-1`}>
                    {stat.value}
                  </div>
                  <div className="text-gray-400 text-sm uppercase tracking-wider font-semibold">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* 10. CTA FINAL */}
      {/* ============================================ */}
      <div className="container mx-auto px-4 py-20">
        <div className="relative overflow-hidden bg-gradient-to-r from-uf-gold/20 via-uf-blue/10 to-uf-gold/20 border-2 border-uf-gold rounded-2xl p-12 text-center">
          {/* Efecto decorativo */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-uf-gold/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-uf-blue/10 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-anton font-bold text-uf-gold mb-4 uppercase">
              ¿LISTO PARA TRANSFORMARTE?
            </h2>
            <p className="text-gray-300 text-xl mb-8 max-w-2xl mx-auto">
              Únete a Ultimate Fitness y comienza tu viaje hacia una versión mejorada de ti mismo.
              Tu primer paso es completamente gratis.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 bg-uf-gold hover:bg-uf-blue text-black hover:text-white font-bold px-10 py-4 rounded-xl uppercase tracking-wider transition-all duration-300 transform hover:scale-105 shadow-lg text-sm"
              >
                <Zap className="w-5 h-5" />
                Conviértete en Ultimate
              </Link>
              <Link
                to="/contacto"
                className="inline-flex items-center gap-2 bg-transparent border-2 border-white/30 hover:border-uf-gold text-white hover:text-uf-gold font-bold px-10 py-4 rounded-xl uppercase tracking-wider transition-all duration-300 text-sm"
              >
                <BookOpen className="w-5 h-5" />
                Contactar
              </Link>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Home;