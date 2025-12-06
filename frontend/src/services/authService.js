import api from "./api";

const authService = {
  async register(userData) {
    const response = await api.post("/register", userData);
    return response.data;
  },

  async login(email, password) {
    console.log("authService.login: Intentando login con", email);
    try {
      const response = await api.post("/login", { email, password });
      console.log("authService.login: Respuesta backend:", response.data);

      // 1. Si recibimos el token (formato estándar LexikJWT)
      if (response.data.token) {
        const token = response.data.token;
        localStorage.setItem("token", token);

        // 2. Obtener datos del usuario con el token
        try {
          // Aseguramos que el token esté en el header para esta petición
          // (aunque el interceptor lo haga, es seguro hacerlo explícito o confiar en localStorage)
          const userResponse = await api.get("/me");

          if (userResponse.data.success && userResponse.data.usuario) {
            const usuario = userResponse.data.usuario;
            localStorage.setItem("usuario", JSON.stringify(usuario));
            console.log("authService.login: Login exitoso completo.");
            return { success: true, usuario, token };
          }
        } catch (userError) {
          console.error("authService.login: Error al obtener datos de usuario", userError);
          localStorage.removeItem("token"); // Limpiar si falla
          return { success: false, error: "Error al obtener perfil de usuario" };
        }
      }

      console.error("authService.login: Respuesta sin token", response.data);
      return { success: false, error: "Credenciales inválidas" };

    } catch (error) {
      console.error("authService.login: Error en petición", error);
      return { success: false, error: error.response?.data?.message || "Error de conexión" };
    }
  },

  logout() {
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
  },

  getUser() {
    const s = localStorage.getItem("usuario");
    return s ? JSON.parse(s) : null;
  },

  getToken() {
    return localStorage.getItem("token");
  },

  isAuthenticated() {
    return !!(this.getUser() && this.getToken());
  },

  updateUser(userData) {
    localStorage.setItem("usuario", JSON.stringify(userData));
  }
};

export default authService;
