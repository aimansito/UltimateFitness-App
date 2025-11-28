import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function DashboardRouter() {
  const { user, isAuthenticated, isPremium } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('📊 Dashboard Router - Usuario detectado:');
    console.log('  → Usuario completo:', user);
    console.log('  → Nombre:', user?.nombre);
    console.log('  → Email:', user?.email);
    console.log('  → Rol:', user?.rol);
    console.log('  → Es Premium:', isPremium);
    console.log('  → Autenticado:', isAuthenticated);

    if (!isAuthenticated) {
      console.log('❌ NO autenticado → Redirigiendo a /login');
      navigate('/login');
      return;
    }

    // Redirigir según el rol del usuario
    if (user?.rol === 'admin') {
      console.log('🔐 Admin detectado → /admin/dashboard');
      navigate('/admin/dashboard', { replace: true });
      return;
    }

    if (user?.rol === 'entrenador') {
      console.log('🏋️ Entrenador detectado → /entrenador/dashboard');
      navigate('/entrenador/dashboard', { replace: true });
      return;
    }

    // Usuarios normales (premium o gratuito)
    console.log('👤 Usuario normal detectado → /user/dashboard (Premium:', isPremium, ')');
    navigate('/user/dashboard', { replace: true });
  }, [user, isAuthenticated, isPremium, navigate]);

  // Mientras redirige, mostrar loading
  return (
    <div className="min-h-screen bg-gradient-to-br from-uf-darker via-gray-900 to-black flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-uf-gold mx-auto mb-4"></div>
        <p className="text-white text-xl">Redirigiendo...</p>
      </div>
    </div>
  );
}

export default DashboardRouter;