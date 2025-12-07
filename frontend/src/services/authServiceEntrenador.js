import api from "./api";

const authServiceEntrenador = {
  async login(email, password) {
    try {
      const response = await api.post("/entrenador/login", { email, password });

      console.log("LOGIN ENTRENADOR RESPONSE:", response.data);

      if (response.data.token && response.data.entrenador) {
        const token = response.data.token;
        const entrenador = response.data.entrenador;

        localStorage.setItem("token_entrenador", token);
        localStorage.setItem("entrenador", JSON.stringify(entrenador));

        return {
          success: true,
          entrenador,
          token,
        };
      }

      return { success: false, error: "Credenciales inválidas" };
    } catch (error) {
      console.error("Error login entrenador:", error);
      return {
        success: false,
        error: error.response?.data?.error || "Error de conexión",
      };
    }
  },

  logout() {
    localStorage.removeItem("token_entrenador");
    localStorage.removeItem("entrenador");
  },

  getEntrenador() {
    const stored = localStorage.getItem("entrenador");
    return stored ? JSON.parse(stored) : null;
  },

  getToken() {
    return localStorage.getItem("token_entrenador");
  },

  isAuthenticated() {
    return !!(this.getEntrenador() && this.getToken());
  },
};

export default authServiceEntrenador;
