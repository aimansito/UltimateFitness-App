import api from "./api";

export default {
  login: async (email, password) => {
    try {
      console.log("authService.login: Intentando login con", email);

      const res = await api.post("/login", { email, password });
      console.log("authService.login: Respuesta backend:", res.data);

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

      console.log("authService.login: Usuario/Entrenador guardado:", user);

      return {
        success: true,
        usuario: user,
        token: token,
      };
    } catch (error) {
      console.log("authService.login: Error en petición", error);
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
