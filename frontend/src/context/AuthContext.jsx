import { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ============================================
  // CARGAR USUARIO AL INICIAR LA APP
  // ============================================
  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser = authService.getUser();
        
        console.log('Cargando usuario desde localStorage:', storedUser);
        
        if (storedUser) {
          setUser(storedUser);
        }
      } catch (error) {
        console.error('Error cargando usuario:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // ============================================
  // LOGIN
  // ============================================
  const login = async (email, password) => {
    try {
      setLoading(true);
      const result = await authService.login(email, password);
      
      console.log('Resultado del login:', result);
      
      if (result.success && result.usuario) {
        setUser(result.usuario);
        return { success: true };
      }
      
      return {
        success: false,
        error: result.error || 'Error al iniciar sesión'
      };
    } catch (error) {
      console.error('Error en login (AuthContext):', error);
      return { 
        success: false, 
        error: 'Error inesperado al iniciar sesión' 
      };
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // LOGOUT
  // ============================================
  const logout = () => {
    console.log('Cerrando sesión...');
    authService.logout();
    setUser(null);
  };

  // ============================================
  // REFRESH USER - Actualizar datos del usuario
  // ============================================
  const refreshUser = async () => {
    try {
      const storedUser = authService.getUser();
      if (storedUser) {
        setUser(storedUser);
        return storedUser;
      }
    } catch (error) {
      console.error('Error actualizando usuario:', error);
    }
    return null;
  };

  // ============================================
  // VALOR DEL CONTEXTO
  // ============================================
  const value = {
    user,
    login,
    logout,
    refreshUser,
    isAuthenticated: !!user,
    isPremium: user?.es_premium || false,
    loading
  };

  // Mostrar loading mientras carga
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-uf-gold mx-auto mb-4"></div>
          Cargando...
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// ============================================
// HOOK PERSONALIZADO
// ============================================
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}

export default AuthContext;