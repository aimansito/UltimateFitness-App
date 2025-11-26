import axios from "axios";

const API_URL = "http://localhost:8000/api";

// ============================================
// CONFIGURACIÓN DE AXIOS
// ============================================
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

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
  // LOGIN - Iniciar sesión (SIN JWT)
  // ============================================
  async login(email, password) {
    try {
      console.log('Intentando login con:', email);

      const response = await api.post("/login", {
        email: email,      // ✅ Backend espera 'email'
        password: password,
      });

      console.log('Respuesta del servidor:', response.data);

      // Verificar si el login fue exitoso
      if (response.data.success && response.data.usuario) {
        const userData = response.data.usuario;

        // Guardar usuario en localStorage
        localStorage.setItem("usuario", JSON.stringify(userData));

        console.log('Login exitoso:', userData);

        return {
          success: true,
          usuario: userData,
        };
      } else {
        return {
          success: false,
          error: response.data.error || "Error al iniciar sesión",
        };
      }
    } catch (error) {
      console.error('Error en login:', error);
      console.error('Respuesta del servidor:', error.response?.data);

      // Mensajes de error más específicos
      if (error.response?.status === 401) {
        return {
          success: false,
          error: "Email o contraseña incorrectos",
        };
      } else if (error.response?.status === 400) {
        return {
          success: false,
          error: error.response?.data?.error || "Datos inválidos",
        };
      } else {
        return {
          success: false,
          error: error.response?.data?.error || "Error al iniciar sesión",
        };
      }
    }
  },

  // ============================================
  // LOGOUT - Cerrar sesión
  // ============================================
  logout() {
    // Eliminar datos del usuario
    localStorage.removeItem("usuario");
    console.log("Sesión cerrada");
  },

  // ============================================
  // IS AUTHENTICATED - Verificar si está autenticado
  // ============================================
  isAuthenticated() {
    const usuario = localStorage.getItem("usuario");
    return !!usuario;
  },

  // ============================================
  // GET USER FROM STORAGE - Obtener usuario del localStorage
  // ============================================
  getUser() {
    const userStr = localStorage.getItem("usuario");
    return userStr ? JSON.parse(userStr) : null;
  },

  // ============================================
  // UPDATE USER IN STORAGE - Actualizar usuario en localStorage
  // ============================================
  updateUser(userData) {
    localStorage.setItem("usuario", JSON.stringify(userData));
  },
};

export default authService;