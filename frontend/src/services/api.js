import axios from "axios";

const API_URL = "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// =============================
// RUTAS PÚBLICAS
// =============================
const PUBLIC_ROUTES = [
  "/login",
  "/register",
  "/reset-password",
  "/blog/posts/public-preview",
  "/blog/categorias",
];

const isPublicUrl = (url) => {
  if (!url) return false;
  return PUBLIC_ROUTES.some((route) => url.includes(route));
};

// =============================
// REQUEST INTERCEPTOR
// =============================
api.interceptors.request.use(
  (config) => {
    const isPublicRoute = isPublicUrl(config.url);

    if (!isPublicRoute) {
      // Token de usuario normal
      const userToken = localStorage.getItem("token");

      // Token de entrenador
      const trainerToken = localStorage.getItem("token_entrenador");

      const finalToken = trainerToken || userToken;

      if (finalToken) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${finalToken}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// =============================
// RESPONSE INTERCEPTOR
// =============================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Limpiar ambos tokens
      localStorage.removeItem("token");
      localStorage.removeItem("usuario");
      localStorage.removeItem("token_entrenador");
      localStorage.removeItem("entrenador");

      if (!isPublicUrl(error.config?.url)) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
