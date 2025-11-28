// ============================================
// DASHBOARD - Router inteligente por rol
// ============================================
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';

function Dashboard() {
  // ============================================
  // OBTENER DATOS DEL USUARIO
  // ============================================
  const { user, loading } = useAuth();

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
    console.log('🔴 Dashboard: No hay usuario, redirigiendo a /login');
    return <Navigate to="/login" replace />;
  }

  // ============================================
  // DEBUG: Mostrar información del usuario
  // ============================================
  console.log('📊 Dashboard Router - Usuario detectado:');
  console.log('  → OBJETO COMPLETO:', user);
  console.log('  → Nombre:', user.nombre);
  console.log('  → Email:', user.email);
  console.log('  → Rol:', user.rol, '(tipo:', typeof user.rol, ')');
  console.log('  → Es Premium:', user.es_premium);

  // ============================================
  // REDIRECCIÓN SEGÚN ROL
  // ============================================

  // Admin -> Dashboard de administración
  console.log('🔍 Verificando rol "admin":', user.rol === 'admin', '| Rol actual:', user.rol);
  if (user.rol === 'admin') {
    console.log('👑 ✅ REDIRIGIENDO A → /admin/dashboard');
    return <Navigate to="/admin/dashboard" replace />;
  }

  // Entrenador -> Dashboard de entrenador
  console.log('🔍 Verificando rol "entrenador":', user.rol === 'entrenador', '| Rol actual:', user.rol);
  if (user.rol === 'entrenador') {
    console.log('💪 ✅ REDIRIGIENDO A → /entrenador/dashboard');
    return <Navigate to="/entrenador/dashboard" replace />;
  }

  // Usuario (Premium o Gratuito) -> Dashboard de usuario
  console.log('👤 ✅ REDIRIGIENDO A → /dashboard/usuario (Premium:', user.es_premium, ')');
  return <Navigate to="/dashboard/usuario" replace />;
}

export default Dashboard;