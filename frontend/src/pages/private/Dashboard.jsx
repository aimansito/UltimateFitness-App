// ============================================
// DASHBOARD - Panel principal del usuario
// ============================================
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { Card } from '../../components/common';

function Dashboard() {
  // ============================================
  // OBTENER DATOS DEL USUARIO
  // ============================================
  const { user, isPremium } = useAuth();

  // ============================================
  // DATOS PARA LAS CARDS (ejemplo)
  // ============================================
  const stats = [
    {
      title: 'Entrenamientos',
      value: '12',
      icon: '💪',
      color: 'from-blue-500 to-blue-700',
      link: '/mis-entrenamientos'
    },
    {
      title: 'Dietas',
      value: '3',
      icon: '🥗',
      color: 'from-green-500 to-green-700',
      link: '/mis-dietas'
    },
    {
      title: 'Objetivos',
      value: user.objetivo || 'Sin definir',
      icon: '🎯',
      color: 'from-purple-500 to-purple-700',
      link: '/mis-objetivos'
    },
    {
      title: 'Progreso',
      value: '67%',
      icon: '📈',
      color: 'from-uf-gold to-yellow-600',
      link: '/mi-progreso'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-uf-darker to-black py-12">
      <div className="container mx-auto px-4">
        
        {/* ============================================ */}
        {/* HEADER - Bienvenida */}
        {/* ============================================ */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            ¡Bienvenido, {user.nombre}! 👋
          </h1>
          <p className="text-gray-400 text-lg">
            {isPremium ? (
              <span className="text-uf-gold">
                ✨ Miembro Premium - Acceso total a todas las funcionalidades
              </span>
            ) : (
              <span>
                Estás usando la versión gratuita. 
                <Link to="/premium" className="text-uf-gold hover:text-uf-blue ml-2">
                  Actualiza a Premium →
                </Link>
              </span>
            )}
          </p>
        </div>

        {/* ============================================ */}
        {/* STATS GRID - Resumen rápido */}
        {/* ============================================ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <Link
              key={index}
              to={stat.link}
              className="group"
            >
              <div className={`
                bg-gradient-to-br ${stat.color} 
                rounded-lg p-6 
                transform transition-all duration-300 
                hover:scale-105 hover:shadow-2xl
                border-2 border-transparent hover:border-white/20
              `}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-5xl">{stat.icon}</span>
                  <div className="text-right">
                    <p className="text-white/80 text-sm uppercase tracking-wider">
                      {stat.title}
                    </p>
                    <p className="text-white text-3xl font-bold mt-1">
                      {stat.value}
                    </p>
                  </div>
                </div>
                <div className="text-white/60 text-xs group-hover:text-white transition">
                  Ver detalles →
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* ============================================ */}
        {/* ACCIONES RÁPIDAS */}
        {/* ============================================ */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">
            Acciones Rápidas
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <Card hover className="bg-uf-dark p-6">
              <div className="text-center">
                <div className="text-5xl mb-4">🏋️</div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Nueva Rutina
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  Crea una nueva rutina de entrenamiento personalizada
                </p>
                <Link
                  to="/crear-rutina"
                  className="inline-block bg-uf-gold text-black font-bold px-6 py-2 rounded hover:bg-uf-blue hover:text-white transition"
                >
                  Crear Rutina
                </Link>
              </div>
            </Card>

            {/* Card 2 */}
            <Card hover className="bg-uf-dark p-6">
              <div className="text-center">
                <div className="text-5xl mb-4">📊</div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Mi Progreso
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  Revisa tus estadísticas y evolución
                </p>
                <Link
                  to="/mi-progreso"
                  className="inline-block bg-uf-blue text-white font-bold px-6 py-2 rounded hover:bg-uf-gold hover:text-black transition"
                >
                  Ver Progreso
                </Link>
              </div>
            </Card>

            {/* Card 3 */}
            <Card hover className="bg-uf-dark p-6">
              <div className="text-center">
                <div className="text-5xl mb-4">👤</div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Mi Perfil
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  Actualiza tu información personal y preferencias
                </p>
                <Link
                  to="/perfil"
                  className="inline-block bg-gray-600 text-white font-bold px-6 py-2 rounded hover:bg-uf-gold hover:text-black transition"
                >
                  Editar Perfil
                </Link>
              </div>
            </Card>
          </div>
        </div>

        {/* ============================================ */}
        {/* INFORMACIÓN DEL USUARIO */}
        {/* ============================================ */}
        <div className="bg-uf-dark border-2 border-uf-gold/30 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-4">
            Tu Información
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Nombre completo:</span>
              <span className="text-white ml-2 font-semibold">
                {user.nombreCompleto || `${user.nombre} ${user.apellidos}`}
              </span>
            </div>
            
            <div>
              <span className="text-gray-400">Email:</span>
              <span className="text-white ml-2 font-semibold">
                {user.email}
              </span>
            </div>
            
            <div>
              <span className="text-gray-400">Teléfono:</span>
              <span className="text-white ml-2 font-semibold">
                {user.telefono || 'No especificado'}
              </span>
            </div>
            
            <div>
              <span className="text-gray-400">Objetivo:</span>
              <span className="text-uf-gold ml-2 font-semibold capitalize">
                {user.objetivo?.replace('_', ' ') || 'Sin definir'}
              </span>
            </div>
            
            <div>
              <span className="text-gray-400">Tipo de cuenta:</span>
              <span className={`ml-2 font-semibold ${isPremium ? 'text-uf-gold' : 'text-gray-400'}`}>
                {isPremium ? '👑 Premium' : 'Gratis'}
              </span>
            </div>
            
            <div>
              <span className="text-gray-400">Miembro desde:</span>
              <span className="text-white ml-2 font-semibold">
                {user.fechaRegistro ? new Date(user.fechaRegistro).toLocaleDateString() : 'N/A'}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;