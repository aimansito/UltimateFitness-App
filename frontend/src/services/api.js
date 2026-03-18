import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

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
  "/forgot-password",
  "/reset-password",
  "/blog/posts/public-preview",
  "/blog/categorias",
  "/public/blog/posts",
  "/public/blog/post/",
  "/public/blog/preview",
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

      // Usar el token del entrenador SÓLO para peticiones a /entrenador ó /custom/entrenador
      // En caso contrario, usar el token de usuario normal.
      const isEntrenadorRoute = config.url && (config.url.startsWith("/entrenador") || config.url.includes("/custom/entrenador"));
      
      const finalToken = isEntrenadorRoute && trainerToken ? trainerToken : userToken;

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
      const isEntrenadorRoute = error.config?.url && (error.config.url.startsWith("/entrenador") || error.config.url.includes("/custom/entrenador"));

      if (isEntrenadorRoute) {
        // Limpiar solo token entrenador y redirigir a portal de entrenador (usando /login o la ruta correcta)
        localStorage.removeItem("token_entrenador");
        localStorage.removeItem("entrenador");
        window.location.href = "/login-entrenador"; // Asumiendo que esta es la ruta para inicio de sesión de formador/entrenador. Si no existe, se puede cambiar a /login
      } else {
        // Limpiar solo token usuario y redirigir a login
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
        
        if (!isPublicUrl(error.config?.url)) {
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
