// ============================================
// API CLIENT - Configuración de Axios
// ============================================
// Este archivo centraliza todas las llamadas HTTP al backend

import axios from 'axios';

// Crear instancia de Axios con configuración base
const api = axios.create({
  // URL base del backend - Todas las peticiones partirán desde aquí
  baseURL: 'http://localhost:8000/api',
  
  // Headers por defecto que se envían en todas las peticiones
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============================================
// INTERCEPTOR - Añade token automáticamente
// ============================================
// Intercepta TODAS las peticiones antes de enviarlas
// para añadir el token de autenticación si existe
api.interceptors.request.use(
  (config) => {
    // Obtener usuario del localStorage
    const userStr = localStorage.getItem('usuario');
    
    if (userStr) {
      const user = JSON.parse(userStr);
      
      // Si el usuario tiene token, añadirlo al header
      if (user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    }
    
    return config;
  },
  (error) => {
    // Si hay error en la petición, rechazarla
    return Promise.reject(error);
  }
);

export default api;