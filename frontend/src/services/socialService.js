// ============================================
// Capa social: perfil público, seguidores, guardados, foto y entreno diario
// ============================================
import api from './api';

const API_ORIGIN = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace(/\/api\/?$/, '');

// Las fotos guardadas en local llegan como "/uploads/avatars/..."; las de la nube, como URL completa
export const urlFoto = (fotoUrl) => {
  if (!fotoUrl) return null;
  return fotoUrl.startsWith('/') ? `${API_ORIGIN}${fotoUrl}` : fotoUrl;
};

export const rutaPerfil = ({ tipo, id }) => `/perfil/${tipo}/${id}`;

// Mensaje de error apto para mostrar, venga de donde venga
export const mensajeError = (error, porDefecto = 'Algo ha fallado. Inténtalo de nuevo.') =>
  error?.response?.data?.error || porDefecto;

const datos = (promesa) => promesa.then((r) => r.data);

const socialService = {
  // Perfil
  perfilPublico: (tipo, id) => datos(api.get(`/perfil/publico/${tipo}/${id}`)),
  perfilOficial: () => datos(api.get('/perfil/publico/oficial')),
  miPerfil: () => datos(api.get('/perfil/mio')),
  guardarPrivacidad: (cambios) => datos(api.patch('/perfil/privacidad', cambios)),
  subirAvatar: (archivo) => {
    const form = new FormData();
    form.append('avatar', archivo);
    // Sin Content-Type explícito para que el navegador ponga el boundary del multipart
    return datos(api.post('/perfil/avatar', form, { headers: { 'Content-Type': undefined } }));
  },
  borrarAvatar: () => datos(api.delete('/perfil/avatar')),

  // Seguimientos
  seguir: (tipo, id) => datos(api.post(`/social/seguir/${tipo}/${id}`)),
  dejarDeSeguir: (tipo, id) => datos(api.delete(`/social/seguir/${tipo}/${id}`)),
  seguidores: (tipo, id, pagina = 1) => datos(api.get(`/social/seguidores/${tipo}/${id}`, { params: { pagina } })),
  seguidos: (tipo, id, pagina = 1) => datos(api.get(`/social/seguidos/${tipo}/${id}`, { params: { pagina } })),

  // Guardados y copias
  misGuardados: () => datos(api.get('/social/guardados')),
  guardar: (itemTipo, id) => datos(api.post(`/social/guardados/${itemTipo}/${id}`)),
  quitarGuardado: (itemTipo, id) => datos(api.delete(`/social/guardados/${itemTipo}/${id}`)),
  clonar: (itemTipo, id) => datos(api.post(`/social/clonar/${itemTipo}/${id}`)),
  cambiarVisibilidad: (itemTipo, id, publico) => datos(api.patch(`/social/visibilidad/${itemTipo}/${id}`, { publico })),

  // Entreno diario y feed
  entrenoHoy: () => datos(api.get('/social/entreno-hoy')),
  // detalle opcional: { diaId, ejercicios: [ids] } con lo que se ha hecho de la rutina
  completarEntrenoHoy: (entrenamientoId, compartir, detalle) =>
    datos(api.post('/social/entreno-hoy', { entrenamientoId, compartir, ...(detalle || {}) })),
  rutinaParaMarcar: (entrenamientoId) => datos(api.get(`/social/entreno-hoy/rutina/${entrenamientoId}`)),
  subirFotoEntreno: (calendarioId, blob) => {
    const form = new FormData();
    form.append('foto', blob, 'entreno.jpg');
    return datos(api.post(`/social/entreno-hoy/${calendarioId}/foto`, form, { headers: { 'Content-Type': undefined } }));
  },
  borrarFotoEntreno: (calendarioId) => datos(api.delete(`/social/entreno-hoy/${calendarioId}/foto`)),
  deshacerEntrenoHoy: (calendarioId) => datos(api.delete(`/social/entreno-hoy/${calendarioId}`)),
  feedEntrenos: (pagina = 1) => datos(api.get('/social/feed/entrenos', { params: { pagina } })),
};

export default socialService;
