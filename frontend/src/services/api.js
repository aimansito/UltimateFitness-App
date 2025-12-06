import axios from "axios";

const API_URL = "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// Rutas públicas que NO necesitan token JWT
const PUBLIC_ROUTES = [
  '/login',
  '/register',
  '/reset-password',
  '/blog/posts/public-preview',
  '/blog/categorias',
];

// Verificar si una URL coincide con un patrón de ruta pública
const isPublicUrl = (url) => {
  if (!url) return false;

  // Rutas exactas
  if (PUBLIC_ROUTES.some(route => url.includes(route))) {
    return true;
  }

  // Patrón para detalle de post individual: /blog/posts/{slug}
  // Solo es público si no contiene otros paths como /premium, /categoria, etc.
  if (url.match(/\/blog\/posts\/[^/]+$/) && !url.includes('public-preview')) {
    return true;
  }

  return false;
};

api.interceptors.request.use(
  (config) => {
    // Verificar si la ruta es pública
    const isPublicRoute = isPublicUrl(config.url);

    // Solo agregar token si NO es una ruta pública
    if (!isPublicRoute) {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de respuesta para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si el token es inválido (401), limpiar localStorage
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("usuario");

      // Solo redirigir si NO es una ruta pública
      const isPublicRoute = isPublicUrl(error.config?.url);
      if (!isPublicRoute && window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
