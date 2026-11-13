import api from "./api";

const solicitudesService = {
  // =============================
  // LADO CLIENTE (/api/solicitudes/...)
  // =============================
  async descubrirEntrenadores() {
    try {
      const res = await api.get("/solicitudes/descubrir");
      return { success: true, entrenadores: res.data.entrenadores };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || "Error al cargar entrenadores" };
    }
  },

  async solicitar(entrenadorId, mensaje) {
    try {
      const res = await api.post(`/solicitudes/${entrenadorId}`, { mensaje });
      return { success: true, solicitud: res.data.solicitud, message: res.data.message };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || "Error al enviar la solicitud" };
    }
  },

  async miSolicitud() {
    try {
      const res = await api.get("/solicitudes/mia");
      return { success: true, solicitud: res.data.solicitud };
    } catch (error) {
      if (error.response?.status === 404) {
        return { success: false, notFound: true };
      }
      return { success: false, error: error.response?.data?.error || "Error al consultar la solicitud" };
    }
  },

  async cancelar(id) {
    try {
      const res = await api.post(`/solicitudes/${id}/cancelar`);
      return { success: true, message: res.data.message };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || "Error al cancelar la solicitud" };
    }
  },

  async finalizar() {
    try {
      const res = await api.post("/solicitudes/finalizar");
      return { success: true, message: res.data.message };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || "Error al finalizar la relación" };
    }
  },

  // =============================
  // LADO ENTRENADOR (/api/entrenador/solicitudes/...)
  // =============================
  async listarPendientes() {
    try {
      const res = await api.get("/entrenador/solicitudes");
      return { success: true, solicitudes: res.data.solicitudes };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || "Error al cargar solicitudes" };
    }
  },

  async aceptar(id) {
    try {
      const res = await api.post(`/entrenador/solicitudes/${id}/aceptar`);
      return { success: true, message: res.data.message };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || "Error al aceptar la solicitud" };
    }
  },

  async rechazar(id, motivo) {
    try {
      const res = await api.post(`/entrenador/solicitudes/${id}/rechazar`, { motivo });
      return { success: true, message: res.data.message };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || "Error al rechazar la solicitud" };
    }
  },

  async finalizarComoEntrenador(usuarioId) {
    try {
      const res = await api.post(`/entrenador/solicitudes/finalizar/${usuarioId}`);
      return { success: true, message: res.data.message };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || "Error al finalizar la relación" };
    }
  },
};

export default solicitudesService;
