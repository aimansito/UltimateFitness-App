// ============================================
// Progreso de fuerza: series, repeticiones y peso por ejercicio
// ============================================
import api from './api';

const datos = (promesa) => promesa.then((r) => r.data);

const progresoService = {
  resumen: () => datos(api.get('/progreso/resumen')),
  rutinas: () => datos(api.get('/progreso/rutinas')),
  rutina: (entrenamientoId) => datos(api.get('/progreso/rutina/' + entrenamientoId)),
  historial: (ejercicioId) => datos(api.get(`/progreso/ejercicio/${ejercicioId}`)),
  // series: [{ repeticiones, peso }] · fecha 'YYYY-MM-DD' (por defecto hoy)
  guardar: ({ ejercicioId, entrenamientoId, fecha, series }) =>
    datos(api.post('/progreso/registros', { ejercicioId, entrenamientoId, fecha, series })),
  borrarSesion: (ejercicioId, fecha) => datos(api.delete(`/progreso/ejercicio/${ejercicioId}/${fecha}`)),
};

export default progresoService;
