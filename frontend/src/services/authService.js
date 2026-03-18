import api from "./api";

export default {
  login: async (email, password) => {
    try {
      const res = await api.post("/login", { email, password });

      // Backend devuelve: {success: true, token: "...", usuario: {...}} O {success: true, token: "...", entrenador: {...}}
      const { token, usuario, entrenador } = res.data;

      // Tomar el que no sea undefined (usuario o entrenador)
      const user = usuario || entrenador;

      if (!token || !user) {
        throw new Error("Respuesta inválida del backend");
      }

      // Guardar token y usuario en localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("usuario", JSON.stringify(user));



      return {
        success: true,
        usuario: user,
        token: token,
      };
    } catch (error) {

      // Limpiar localStorage en caso de error
      localStorage.removeItem("token");
      localStorage.removeItem("usuario");
      return { success: false, error: "Credenciales inválidas" };
    }
  },

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
  },

  getUser() {
    return JSON.parse(localStorage.getItem("usuario"));
  },

  getToken() {
    return localStorage.getItem("token");
  }
};
