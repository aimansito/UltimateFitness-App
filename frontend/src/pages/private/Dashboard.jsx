// ============================================
// DASHBOARD - Router inteligente por rol
// ============================================
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';

function Dashboard() {
  const { user, loading } = useAuth();

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

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // REDIRECCIÓN SEGÚN ROL
  if (user.rol === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (user.rol === 'entrenador') {
    return <Navigate to="/entrenador/dashboard" replace />;
  }

  // Usuario (Premium o Gratuito)
  return <Navigate to="/user/dashboard" replace />;
}

export default Dashboard;