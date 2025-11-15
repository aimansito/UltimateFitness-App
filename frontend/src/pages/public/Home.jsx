import { Link } from 'react-router-dom';

function Home() {
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
      {/* Hero Section - CENTRADO Y MEJORADO */}
      <div className="relative">
        <div
          className="h-[700px] bg-cover bg-center relative flex items-center justify-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70"></div>

          {/* Barra de búsqueda arriba */}
          <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-full max-w-2xl px-4 z-20">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar ejercicios, dietas, entrenadores..."
                className="w-full bg-uf-gold/95 backdrop-blur-sm text-black placeholder-black/70 px-6 py-4 rounded-lg font-semibold focus:outline-none focus:ring-4 focus:ring-uf-blue transition-all"
              />
              <svg className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Contenido centrado */}
          <div className="container mx-auto px-4 relative z-10 text-center">
            <div className="max-w-4xl mx-auto">
              <div className="bg-uf-gold/95 backdrop-blur-md px-12 py-6 inline-block rounded-xl mb-8 shadow-2xl transform hover:scale-105 transition-all duration-300">
                <h1 className="text-black font-bold text-4xl md:text-5xl uppercase tracking-wider">
                  Conviértete en Ultimate
                </h1>
              </div>
              <p className="text-white text-2xl md:text-3xl mb-12 font-light tracking-wide drop-shadow-lg">
                Aquí mostraremos la manera más eficaz de mantenerte en forma
              </p>

              {/* Botones CTA */}
              <div className="flex justify-center space-x-6">
                <Link
                  to="/registro"
                  className="bg-uf-gold hover:bg-uf-blue text-black hover:text-white font-bold px-10 py-4 rounded-lg uppercase tracking-wider transition-all duration-300 transform hover:scale-110 hover:shadow-2xl text-lg"
                >
                  Comenzar Ahora
                </Link>
                <Link
                  to="/servicios"
                  className="bg-transparent border-2 border-uf-gold hover:bg-uf-gold text-uf-gold hover:text-black font-bold px-10 py-4 rounded-lg uppercase tracking-wider transition-all duration-300 transform hover:scale-110 text-lg"
                >
                  Ver Servicios
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Servicios Grid */}
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

      {/* CTA Section */}
      <div className="container mx-auto px-4 pb-20">
        <div className="bg-gradient-to-r from-uf-gold/20 to-transparent border-2 border-uf-gold rounded-lg p-12 text-center">
          <h2 className="text-4xl font-bold text-uf-gold mb-4 uppercase">
            ¿LISTO PARA TRANSFORMARTE?
          </h2>
          <p className="text-gray-300 text-xl mb-8">
            Únete a Ultimate Fitness y comienza tu viaje hacia una versión mejorada de ti mismo.
          </p>
          <Link
            to="/registro"
            className="inline-block bg-transparent border-2 border-uf-gold hover:bg-uf-gold text-uf-gold hover:text-black font-semibold px-8 py-3 rounded-lg uppercase tracking-wider transition-all duration-300 transform hover:scale-105 text-sm"
          >
            Conviértete en Ultimate
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;