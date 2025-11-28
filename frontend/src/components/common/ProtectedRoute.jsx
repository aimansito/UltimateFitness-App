// ============================================
// PROTECTED ROUTE - Protege rutas según rol
// ============================================
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, Lock } from 'lucide-react';

/**
 * Componente que protege rutas según autenticación y rol
 * @param {Object} props
 * @param {React.ReactNode} props.children - Componente a renderizar si pasa la validación
 * @param {string} props.requiredRole - Rol requerido para acceder ('admin', 'entrenador', 'usuario')
 * @param {boolean} props.requireAuth - Si requiere solo autenticación (por defecto true)
 */
function ProtectedRoute({ children, requiredRole, requireAuth = true }) {
    const { user, isAuthenticated, hasRole, loading } = useAuth();

    // Mostrar loading mientras verifica
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-uf-darker via-gray-900 to-black flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-uf-gold mx-auto mb-4"></div>
                    <p className="text-white text-xl">Verificando acceso...</p>
                </div>
            </div>
        );
    }

    // Si requiere autenticación y no está autenticado → redirigir a login
    if (requireAuth && !isAuthenticated) {
        console.log('⛔ Usuario no autenticado, redirigiendo a /login');
        return <Navigate to="/login" replace />;
    }

    // Si requiere un rol específico y no lo tiene → mostrar acceso denegado
    if (requiredRole && !hasRole(requiredRole)) {
        console.log(`⛔ Usuario no tiene el rol requerido: ${requiredRole}. Rol actual: ${user?.rol || 'ninguno'}`);

        return (
            <div className="min-h-screen bg-gradient-to-br from-uf-darker via-gray-900 to-black flex items-center justify-center px-4">
                <div className="max-w-md w-full bg-gradient-to-br from-red-900/40 to-red-800/20 border-2 border-red-700 rounded-lg p-8 text-center">
                    <ShieldAlert className="w-20 h-20 text-red-400 mx-auto mb-6" />
                    <h1 className="text-3xl font-bold text-white mb-4">Acceso Denegado</h1>
                    <p className="text-gray-300 mb-6">
                        No tienes permisos para acceder a esta sección.
                    </p>
                    <p className="text-sm text-gray-400 mb-8">
                        <Lock className="w-4 h-4 inline mr-2" />
                        Se requiere rol: <span className="font-semibold text-red-400">{requiredRole}</span>
                    </p>
                    <a
                        href="/dashboard"
                        className="inline-block bg-uf-gold text-black font-bold px-8 py-3 rounded-lg uppercase tracking-wider hover:bg-yellow-600 transition-all duration-300"
                    >
                        Ir a Mi Dashboard
                    </a>
                </div>
            </div>
        );
    }

    // Si pasa todas las validaciones, renderizar el componente hijo
    console.log(`✅ Acceso permitido a ruta protegida${requiredRole ? ` (rol: ${requiredRole})` : ''}`);
    return children;
}

export default ProtectedRoute;
