import { Link } from 'react-router-dom';
import Layout from '../components/Navbar';

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
    <Layout showNavbar={true}>
      {/* Hero Section */}
      <div className="relative">
        <div 
          className="h-[600px] bg-cover bg-center relative"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent"></div>
          
          <div className="container mx-auto px-4 h-full flex items-center relative z-10">
            <div className="max-w-2xl">
              <div className="bg-uf-gold/90 backdrop-blur-sm px-8 py-4 inline-block rounded mb-6">
                <h2 className="text-black font-bold text-2xl uppercase tracking-wider">
                  CONVIÉRTETE EN ULTIMATE
                </h2>
              </div>
              <p className="text-white text-xl mb-8">
                Aquí mostraremos la manera más eficaz de mantenerte en forma
              </p>
            </div>
          </div>
        </div>

        {/* Barra de búsqueda */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-full max-w-2xl px-4">
          <div className="relative">
            <input 
              type="text"
              placeholder="Buscar..."
              className="w-full bg-uf-gold/90 backdrop-blur-sm text-black placeholder-black/60 px-6 py-4 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-uf-blue"
            />
            <svg className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
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
          <img src="/logo-premium.png" alt="Ultimate Premium" className="h-24 mx-auto mb-6" />
          <h2 className="text-4xl font-bold text-uf-gold mb-4 uppercase">
            ¿LISTO PARA TRANSFORMARTE?
          </h2>
          <p className="text-gray-300 text-xl mb-8">
            Únete a Ultimate Fitness y comienza tu viaje hacia una versión mejorada de ti mismo.
          </p>
          <Link 
            to="/registro"
            className="inline-block bg-uf-gold hover:bg-uf-blue text-black font-bold px-12 py-4 rounded uppercase tracking-wider transition transform hover:scale-105"
          >
            CONVIÉRTETE EN ULTIMATE
          </Link>
        </div>
      </div>
    </Layout>
  );
}

export default Home;