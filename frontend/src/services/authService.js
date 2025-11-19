import axios from "axios";

const API_URL = "http://localhost:8000/api";

// ============================================
// CONFIGURACIÓN DE AXIOS CON JWT
// ============================================
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor: Añadir token JWT automáticamente en cada petición
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    console.log("Interceptor - Token presente:", !!token);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("Añadiendo Authorization header");
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
// ============================================
// FUNCIONES DE AUTENTICACIÓN
// ============================================

const authService = {
  // ============================================
  // REGISTER - Registrar nuevo usuario
  // ============================================
  async register(userData) {
    try {
      const response = await api.post("/register", {
        email: userData.email,
        password: userData.password,
        nombre: userData.nombre,
        apellidos: userData.apellidos || "",
        telefono: userData.telefono || null,
        objetivo: userData.objetivo || "cuidar_alimentacion",
      });

      if (response.data.success) {
        return {
          success: true,
          data: response.data,
          message: "Usuario registrado exitosamente",
        };
      }

      return {
        success: false,
        error: response.data.error || "Error en el registro",
      };
    } catch (error) {
      console.error("Error en registro:", error);
      return {
        success: false,
        error: error.response?.data?.error || "Error al registrar usuario",
      };
    }
  },

  // ============================================
  // LOGIN - Iniciar sesión (devuelve token JWT)
  // ============================================
  async login(email, password) {
    try {
      console.log("Intentando login con:", email);

      const response = await api.post("/login", {
        username: email,
        password: password,
      });

      console.log("Respuesta del servidor:", response.data);

      // Verificar si recibimos el token JWT
      if (response.data.token) {
        const token = response.data.token;

        // Guardar token INMEDIATAMENTE
        localStorage.setItem("token", token);

        console.log("Token guardado:", token.substring(0, 20) + "...");

        // ESPERAR 100ms para asegurar que localStorage se actualizó
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Ahora intentar obtener datos del usuario
        try {
          console.log("Obteniendo datos del usuario...");

          const userResponse = await api.get("/me");

          console.log("Respuesta de /me:", userResponse.data);

          if (userResponse.data.success && userResponse.data.usuario) {
            const userData = userResponse.data.usuario;

            // Guardar usuario en localStorage
            localStorage.setItem("usuario", JSON.stringify(userData));

            console.log("Login completado exitosamente:", userData);

            return {
              success: true,
              usuario: userData,
              token: token,
            };
          } else {
            // Si /me no devuelve bien, aún así el login fue exitoso
            console.warn(
              "No se pudieron obtener datos del usuario, pero el token es válido"
            );

            return {
              success: true,
              token: token,
              usuario: {
                email: email,
                nombre: email.split("@")[0],
              },
            };
          }
        } catch (userError) {
          console.error("Error obteniendo datos del usuario:", userError);
          console.error("Detalles:", userError.response?.data);

          // El login fue exitoso, solo falló obtener datos adicionales
          // Usar datos mínimos
          const minimalUser = {
            email: email,
            nombre: email.split("@")[0],
          };

          localStorage.setItem("usuario", JSON.stringify(minimalUser));

          return {
            success: true,
            token: token,
            usuario: minimalUser,
            warning: "No se pudieron cargar todos los datos del usuario",
          };
        }
      } else {
        return {
          success: false,
          error: "No se recibió token de autenticación",
        };
      }
    } catch (error) {
      console.error("Error en login:", error);
      console.error("Respuesta del servidor:", error.response?.data);

      // Mensajes de error más específicos
      if (error.response?.status === 401) {
        return {
          success: false,
          error: "Email o contraseña incorrectos",
        };
      } else if (error.response?.status === 404) {
        return {
          success: false,
          error: "Servicio de autenticación no disponible",
        };
      } else {
        return {
          success: false,
          error: error.response?.data?.message || "Error al iniciar sesión",
        };
      }
    }
  },

  // ============================================
  // GET CURRENT USER - Obtener usuario autenticado actual
  // ============================================
  async getCurrentUser() {
    try {
      const response = await api.get("/me");

      if (response.data.success && response.data.usuario) {
        return response.data.usuario;
      }

      throw new Error("No se pudo obtener información del usuario");
    } catch (error) {
      console.error("Error obteniendo usuario actual:", error);

      // Si falla, intentar obtener desde localStorage
      const userStr = localStorage.getItem("usuario");
      if (userStr) {
        return JSON.parse(userStr);
      }

      throw error;
    }
  },

  // ============================================
  // LOGOUT - Cerrar sesión
  // ============================================
  logout() {
    // Eliminar token y datos del usuario
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");

    console.log("Sesión cerrada");

    // Redirigir al home
    window.location.href = "/";
  },

  // ============================================
  // IS AUTHENTICATED - Verificar si está autenticado
  // ============================================
  isAuthenticated() {
    const token = localStorage.getItem("token");
    const usuario = localStorage.getItem("usuario");

    return !!(token && usuario);
  },

  // ============================================
  // GET USER FROM STORAGE - Obtener usuario del localStorage
  // ============================================
  getUser() {
    const userStr = localStorage.getItem("usuario");
    return userStr ? JSON.parse(userStr) : null;
  },

  // ============================================
  // GET TOKEN - Obtener token JWT
  // ============================================
  getToken() {
    return localStorage.getItem("token");
  },

  // ============================================
  // REFRESH USER DATA - Refrescar datos del usuario
  // ============================================
  async refreshUserData() {
    try {
      const userData = await this.getCurrentUser();
      localStorage.setItem("usuario", JSON.stringify(userData));
      return userData;
    } catch (error) {
      console.error("Error refrescando datos del usuario:", error);
      return null;
    }
  },
};

export default authService;
