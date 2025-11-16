// ============================================
// HOME PAGE - Página principal
// ============================================
import { Link } from 'react-router-dom';

function Home() {
  // ============================================
  // DATOS - Cards de servicios
  // ============================================
  const servicios = [
    {
      icon: '💻',
      title: '¿QUÉ OFRECEMOS?',
      description: 'Todo lo que tienes que saber y aprender para mantenerte en forma con nuestro método.',
      image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800',
    },
    {
      icon: '🥗',
      title: 'DIETA EQUILIBRADA Y VARIADA',
      description: 'Debemos de tener una comida estructurada para llevar a cabo bien nuestro cambio',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800',
    },
    {
      icon: '🏃',
      title: 'DEPORTE AL AIRE LIBRE',
      description: 'Hacer deporte en zonas exteriores tiene diversas ventajas...',
      image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800',
    },
    {
      icon: '🏋️',
      title: 'GYM TRAINING',
      description: 'Esta semana tenemos nuevos ejercicios para implementar en nuestra rutina',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800',
    },
  ];

  return (
    <div className="min-h-screen">

      {/* ============================================ */}
      {/* HERO SECTION - Buscador arriba */}
      {/* ============================================ */}
      <div className="relative">
        <div
          className="min-h-[700px] bg-cover bg-center relative flex items-start justify-center pt-8 pb-20"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920)',
          }}
        >
          {/* Overlay oscuro */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80"></div>

          {/* CONTENIDO */}
          <div className="container mx-auto px-4 relative z-10">

            {/* 1. BUSCADOR - PEGADO ARRIBA */}
            <div className="max-w-2xl mx-auto mb-0">
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Buscar ejercicios, dietas, entrenadores..."
                  className="w-full bg-white/10 backdrop-blur-md text-white placeholder-white/70 px-6 py-4 pr-16 rounded-full font-medium focus:outline-none focus:ring-4 focus:ring-uf-gold/50 transition-all border-2 border-white/20 hover:border-uf-gold/50"
                />
                {/* Icono de búsqueda */}
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-uf-gold text-black p-3 rounded-full hover:bg-uf-blue hover:scale-110 transition-all">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* 2. CONTENIDO CENTRAL - MÁS ESPACIO ARRIBA */}
            <div className="text-center space-y-10 mt-32">

              {/* Título principal */}
              <div className="inline-block">
                <h1 className="bg-uf-gold text-black font-anton font-bold text-3xl md:text-4xl uppercase tracking-wider px-12 py-4 rounded-lg shadow-2xl hover:scale-105 transition-transform duration-300">
                  Conviértete en Ultimate
                </h1>
              </div>

              {/* Texto descriptivo */}
              <p className="text-white text-lg md:text-xl font-light tracking-wide max-w-3xl mx-auto">
                Aquí mostraremos la manera más eficaz de mantenerte en forma
              </p>

              {/* Botones CTA */}
              <div className="flex flex-col sm:flex-row justify-center items-center gap-6 pt-8">

                {/* Botón principal */}
                <Link
                  to="/registro"
                  className="group relative overflow-hidden bg-uf-gold hover:bg-uf-blue text-black hover:text-white font-bold px-10 py-3.5 rounded-lg uppercase tracking-wider transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl text-sm"
                >
                  Comenzar Ahora
                  <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></span>
                </Link>

                {/* Botón secundario */}
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
      {/* SERVICIOS GRID */}
      {/* ============================================ */}
      <div className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {servicios.map((servicio, index) => (
            <div
              key={index}
              className="group relative bg-uf-dark border-2 border-uf-gold/50 rounded-lg overflow-hidden hover:border-uf-gold transition-all duration-300 hover:scale-105"
            >
              {/* Imagen */}
              <div className="h-64 overflow-hidden">
                <img
                  src={servicio.image}
                  alt={servicio.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              {/* Contenido */}
              <div className="p-6">
                <div className="bg-uf-gold text-black font-bold text-center py-3 mb-4 rounded uppercase tracking-wider">
                  {servicio.title}
                </div>
                <p className="text-gray-300 text-sm mb-6">
                  {servicio.description}
                </p>
                <Link
                  to="/servicios"
                  className="block w-full text-center bg-uf-blue hover:bg-uf-gold text-white hover:text-black font-bold py-3 rounded uppercase tracking-wider transition"
                >
                  SABER MÁS »
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ============================================ */}
      {/* CTA SECTION - Llamada a la acción final */}
      {/* ============================================ */}
      <div className="container mx-auto px-4 pb-20">
        <div className="bg-gradient-to-r from-uf-gold/20 to-transparent border-2 border-uf-gold rounded-lg p-12 text-center">
          <h2 className="text-4xl font-anton font-bold text-uf-gold mb-4 uppercase">
            ¿LISTO PARA TRANSFORMARTE?
          </h2>
          <p className="text-gray-300 text-xl mb-8">
            Únete a Ultimate Fitness y comienza tu viaje hacia una versión mejorada de ti mismo.
          </p>
          <Link
            to="/registro"
            className="inline-block bg-uf-gold hover:bg-uf-blue text-black font-bold px-8 py-3 rounded-lg uppercase tracking-wider transition transform hover:scale-105 text-sm"
          >
            Conviértete en Ultimate
          </Link>
        </div>
      </div>
    </div >
  );
}

export default Home;