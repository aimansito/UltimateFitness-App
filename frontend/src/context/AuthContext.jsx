import { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";

export const AuthContext = createContext();

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

      if (data && data.success) {
        // authService.login guarda usuario + token
        setUser(data.usuario);
        navigate("/dashboard");
        return data;
      }

      return data || { success: false, error: "Credenciales inválidas" };
    } catch (error) {
      console.error("Error en login:", error);
      return { success: false, error: "Error de conexión o servidor" };
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
  // REFRESH USER (recargar desde localStorage)
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
  // UPDATE USER (para MisDatosPersonales)
  // ============================================
  const updateUser = (newUser) => {
    setUser(newUser);
    authService.saveUser(newUser); // sincroniza localStorage
  };

  // ============================================
  // ROLES
  // ============================================
  const isAdmin = () => user?.rol === "admin";
  const isTrainer = () => user?.rol === "entrenador";
  const isUser = () => user?.rol === "cliente" || (!user?.rol && user);

  const hasRole = (role) => user?.rol === role;

  // ============================================
  // CONTEXTO
  // ============================================
  const value = {
    user,
    login,
    logout,
    refreshUser,
    updateUser, // <-- añadido correctamente
    isAuthenticated: !!user,
    isPremium:
      user?.es_premium === true ||
      user?.es_premium === 1 ||
      user?.es_premium === "1",
    isAdmin,
    isTrainer,
    isUser,
    hasRole,
    loading,
  };

  // Loading inicial
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
