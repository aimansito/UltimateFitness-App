// ============================================
// DASHBOARD - Panel principal del usuario
// ============================================
import { useAuth } from '../../context/AuthContext';
import { Link, Navigate } from 'react-router-dom';
import { Card } from '../../components/common';

function Dashboard() {
  // ============================================
  // OBTENER DATOS DEL USUARIO
  // ============================================
  const { user, isPremium, loading } = useAuth();

  // ============================================
  // LOADING STATE
  // ============================================
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-uf-darker to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-uf-gold mx-auto mb-4"></div>
          <p className="text-white text-xl">Cargando tu panel...</p>
        </div>
      </div>
    );
  }

  // ============================================
  // VALIDACIÓN: Redirigir si no hay usuario
  // ============================================
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ============================================
  // DATOS PARA LAS CARDS
  // ============================================
  const stats = [
    {
      title: 'Entrenamientos',
      value: '12',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      color: 'from-blue-500 to-blue-700',
      link: '/mis-entrenamientos'
    },
    {
      title: 'Dietas',
      value: '3',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      color: 'from-green-500 to-green-700',
      link: '/mis-dietas'
    },
    {
      title: 'Objetivos',
      value: user?.objetivo?.replace('_', ' ') || 'Sin definir',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'from-purple-500 to-purple-700',
      link: '/mis-objetivos'
    },
    {
      title: 'Progreso',
      value: '67%',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      color: 'from-uf-gold to-yellow-600',
      link: '/mi-progreso'
    },
  ];

  // ============================================
  // ACCIONES RÁPIDAS
  // ============================================
  const quickActions = [
    {
      title: 'Nueva Rutina',
      description: 'Crea una rutina de entrenamiento personalizada',
      icon: (
        <svg className="w-16 h-16 mb-4 text-uf-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      ),
      link: '/crear-rutina',
      buttonText: 'Crear Rutina',
      buttonColor: 'bg-uf-gold text-black hover:bg-uf-blue hover:text-white'
    },
    {
      title: 'Mi Progreso',
      description: 'Revisa tus estadísticas y evolución',
      icon: (
        <svg className="w-16 h-16 mb-4 text-uf-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      link: '/mi-progreso',
      buttonText: 'Ver Progreso',
      buttonColor: 'bg-uf-blue text-white hover:bg-uf-gold hover:text-black'
    },
    {
      title: 'Mi Perfil',
      description: 'Actualiza tu información y preferencias',
      icon: (
        <svg className="w-16 h-16 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      link: '/perfil',
      buttonText: 'Editar Perfil',
      buttonColor: 'bg-gray-600 text-white hover:bg-uf-gold hover:text-black'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-uf-darker to-black py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* ============================================ */}
        {/* HEADER - Bienvenida */}
        {/* ============================================ */}
        <div className="mb-12 text-center md:text-left">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-anton font-bold text-white mb-3 uppercase tracking-wider">
                ¡Bienvenido, <span className="text-uf-gold">{user?.nombre || 'Usuario'}</span>!
              </h1>
              <p className="text-gray-400 text-lg">
                {isPremium ? (
                  <span className="inline-flex items-center gap-2 text-uf-gold">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    Miembro Premium - Acceso total
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2">
                    Versión gratuita - 
                    <Link to="/premium" className="text-uf-gold hover:text-uf-blue underline font-semibold">
                      Actualiza a Premium
                    </Link>
                  </span>
                )}
              </p>
            </div>

            {/* Badge Premium */}
            {isPremium && (
              <div className="bg-gradient-to-r from-uf-gold to-yellow-600 text-black px-6 py-3 rounded-full font-bold flex items-center gap-2 shadow-lg">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                PREMIUM
              </div>
            )}
          </div>
        </div>

        {/* ============================================ */}
        {/* STATS GRID - Resumen rápido */}
        {/* ============================================ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <Link
              key={index}
              to={stat.link}
              className="group"
            >
              <div className={`
                bg-gradient-to-br ${stat.color} 
                rounded-xl p-6 
                transform transition-all duration-300 
                hover:scale-105 hover:shadow-2xl
                border-2 border-white/10 hover:border-white/30
                relative overflow-hidden
              `}>
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,255,255,0.1),transparent)]"></div>
                </div>

                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-white/90">
                      {stat.icon}
                    </div>
                    <div className="text-right">
                      <p className="text-white/80 text-xs uppercase tracking-wider font-bold mb-1">
                        {stat.title}
                      </p>
                      <p className="text-white text-2xl md:text-3xl font-bold">
                        {stat.value}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-white/60 text-xs group-hover:text-white transition">
                    <span>Ver detalles</span>
                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* ============================================ */}
        {/* ACCIONES RÁPIDAS */}
        {/* ============================================ */}
        <div className="mb-12">
          <h2 className="text-3xl font-anton font-bold text-white mb-6 uppercase tracking-wider">
            <span className="text-uf-gold">Acciones</span> Rápidas
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-uf-dark to-black border-2 border-uf-gold/20 rounded-xl p-8 hover:border-uf-gold transition-all duration-300 hover:shadow-2xl hover:shadow-uf-gold/20 transform hover:scale-105"
              >
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    {action.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 uppercase tracking-wide">
                    {action.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                    {action.description}
                  </p>
                  <Link
                    to={action.link}
                    className={`inline-block ${action.buttonColor} font-bold px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 uppercase text-sm tracking-wider shadow-lg`}
                  >
                    {action.buttonText}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ============================================ */}
        {/* INFORMACIÓN DEL USUARIO */}
        {/* ============================================ */}
        <div className="bg-gradient-to-br from-uf-dark to-black border-2 border-uf-gold/30 rounded-xl p-8 hover:border-uf-gold transition-all duration-300">
          <div className="flex items-center gap-3 mb-6">
            <svg className="w-8 h-8 text-uf-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-2xl font-anton font-bold text-white uppercase tracking-wider">
              Tu Información
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoRow 
              label="Nombre completo" 
              value={user?.nombreCompleto || `${user?.nombre || ''} ${user?.apellidos || ''}`} 
            />
            <InfoRow 
              label="Email" 
              value={user?.email || 'No especificado'} 
            />
            <InfoRow 
              label="Teléfono" 
              value={user?.telefono || 'No especificado'} 
            />
            <InfoRow 
              label="Objetivo" 
              value={user?.objetivo?.replace('_', ' ') || 'Sin definir'}
              highlight
            />
            <InfoRow 
              label="Tipo de cuenta" 
              value={isPremium ? '👑 Premium' : 'Gratis'}
              highlight={isPremium}
            />
            <InfoRow 
              label="Miembro desde" 
              value={user?.fechaRegistro ? new Date(user.fechaRegistro).toLocaleDateString('es-ES') : 'N/A'} 
            />
          </div>
        </div>

      </div>
    </div>
  );
}

// ============================================
// COMPONENTE AUXILIAR - Fila de información
// ============================================
function InfoRow({ label, value, highlight }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-gray-500 text-sm uppercase tracking-wider font-semibold">
        {label}
      </span>
      <span className={`text-lg font-bold capitalize ${highlight ? 'text-uf-gold' : 'text-white'}`}>
        {value}
      </span>
    </div>
  );
}

export default Dashboard;