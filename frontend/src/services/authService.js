import api from "./api";

const authService = {
  async register(userData) {
    const response = await api.post("/register", userData);
    return response.data;
  },

  async login(email, password) {
    const response = await api.post("/login", { email, password });
    // Ajusta según lo que devuelva tu backend:
    // espera { success: true, usuario: {...}, token: '...' }
    if (response.data.success && response.data.token && response.data.usuario) {
      localStorage.setItem("usuario", JSON.stringify(response.data.usuario));
      localStorage.setItem("token", response.data.token);
      return { success: true, usuario: response.data.usuario, token: response.data.token };
    }
    return { success: false, error: response.data.error || "Login failed" };
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
