// ============================================
// AUTH SERVICE - Servicio de autenticación
// ============================================
// Maneja login, logout, y gestión de usuario en localStorage

import api from './api';

const authService = {
  // ============================================
  // LOGIN - Iniciar sesión
  // ============================================
  // Busca el usuario por email en el backend
  async login(email, password) {
    try {
      // IMPORTANTE: Usar backticks `` para interpolar variables
      const response = await api.get(`/usuarios?email=${email}`);
      
      console.log('Respuesta del servidor:', response.data);

      // Verificar si encontró usuarios
      // La API de Symfony devuelve los datos en 'member' o 'hydra:member'
      if (response.data.member && response.data.member.length > 0) {
        const usuario = response.data.member[0];
        
        // TODO: Verificar contraseña (por ahora no se valida)
        console.log('Usuario encontrado:', usuario);
        
        // Guardar usuario en localStorage para mantener la sesión
        localStorage.setItem('usuario', JSON.stringify(usuario));
        
        return { 
          success: true, 
          usuario 
        };
      } else {
        // No se encontró el usuario
        return { 
          success: false, 
          error: 'Usuario no encontrado' 
        };
      }
    } catch (error) {
      // Error de conexión o del servidor
      console.error('Error en login:', error);
      return { 
        success: false, 
        error: 'Error al iniciar sesión' 
      };
    }
  },

  // ============================================
  // LOGOUT - Cerrar sesión
  // ============================================
  // Elimina el usuario del localStorage
  logout() {
    localStorage.removeItem('usuario');
  },

  // ============================================
  // GET CURRENT USER - Obtener usuario actual
  // ============================================
  // Lee el usuario guardado en localStorage
  getCurrentUser() {
    const userStr = localStorage.getItem('usuario');
    return userStr ? JSON.parse(userStr) : null;
  },

  // ============================================
  // IS AUTHENTICATED - Verificar si está autenticado
  // ============================================
  // Devuelve true si hay un usuario en localStorage
  isAuthenticated() {
    return !!localStorage.getItem('usuario');
  }
};

export default authService;