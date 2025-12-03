import { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ============================================
  // CARGAR USUARIO AL INICIAR LA APP
  // ============================================
  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser = authService.getUser();
        const token = authService.getToken();

        console.log("Cargando usuario desde localStorage:", storedUser);
        console.log("Token disponible:", !!token);

        if (storedUser && token) {
          // ✅ Si hay usuario Y token, cargar el usuario
          setUser(storedUser);
        }
      } catch (error) {
        console.error("Error cargando usuario:", error);
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
      const data = await authService.login(email, password);

      console.log("Resultado del login:", data);

      if (data.success) {
        // ✅ authService.login() ya guardó usuario y token en localStorage
        // Solo necesitamos actualizar el estado
        setUser(data.usuario);

        // Redirigir a /dashboard
        navigate("/dashboard");

        return data;
      }
    } catch (error) {
      console.error("Error en login:", error);
      throw error;
    }
  };

  // ============================================
  // LOGOUT
  // ============================================
  const logout = () => {
    console.log("Cerrando sesión...");
    authService.logout();
    setUser(null);
    navigate("/login");
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
      console.error("Error actualizando usuario:", error);
    }
    return null;
  };

  // ============================================
  // HELPERS DE VALIDACIÓN DE ROL
  // ============================================
  const isAdmin = () => {
    return user?.rol === "admin";
  };

  const isTrainer = () => {
    return user?.rol === "entrenador";
  };

  const isUser = () => {
    return user?.rol === "cliente" || (!user?.rol && user);
  };

  const hasRole = (role) => {
    if (!user) return false;
    return user.rol === role;
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
    isAdmin,
    isTrainer,
    isUser,
    hasRole,
    loading,
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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ============================================
// HOOK PERSONALIZADO
// ============================================
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
}

export default AuthContext;