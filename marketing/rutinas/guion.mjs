// Datos de los dos vídeos de rutina (Empuje y Tirón). Es lo único que hay que tocar.
//
// Los tiempos `ini` son los cortes del vídeo original (segundos): el montaje respeta el ritmo
// original y solo añade encima la portada, las transiciones, los rótulos y el cierre.
// Músculos de la figura: chest, front-deltoids, back-deltoids, triceps, biceps, forearm,
// trapezius, upper-back, lower-back, abs, obliques, quadriceps, hamstring, gluteal, calves.

export const FORMATO = { ancho: 1080, alto: 1920, fps: 30 };

export const MARCA = { web: 'ultimatefitnessuf.com' };

// App local para la captura de la rutina del cierre
export const APP = { url: 'http://localhost:5173', api: 'http://localhost:8000/api', usuario: 'sara@example.com', clave: 'password123' };

/** Segundos que dura el cierre con la captura de la app */
export const CIERRE = 3.6;

export const VIDEOS = {
  empuje: {
    origen: '../empuje/empujeoriginal.mp4',
    titulo: 'Empuje',
    grupos: ['Pecho', 'Hombro', 'Tríceps'],
    duracion: '1 h 20 min',
    portadaFin: 1.5667,
    ejercicios: [
      { ini: 1.5667, nombre: 'Press inclinado', detalle: 'Multipower o banco', series: '4 × 8', zona: 'Pecho superior', musculos: ['chest'], vista: 'anterior', catalogo: 74 },
      { ini: 3.0, nombre: 'Máquina de pecho', series: '3 × 12', zona: 'Pecho medio-alto', musculos: ['chest'], vista: 'anterior', catalogo: 69 },
      { ini: 4.8333, nombre: 'Máquina de pecho', series: '3 × 12', zona: 'Pecho medio-bajo', musculos: ['chest'], vista: 'anterior', catalogo: 69 },
      { ini: 6.6, nombre: 'Aperturas', series: '3 × 12', zona: 'Todo el pecho', musculos: ['chest'], vista: 'anterior', catalogo: 70 },
      { ini: 8.4, nombre: 'Press militar', series: '3 × 12', zona: 'Hombro', musculos: ['front-deltoids'], vista: 'anterior', catalogo: 99 },
      { ini: 10.2333, nombre: 'Laterales', detalle: 'Máquina y polea', series: '3 × 12', zona: 'Hombro lateral', musculos: ['front-deltoids', 'back-deltoids'], vista: 'anterior', catalogo: 102 },
      // Mismo ejercicio en dos clips: el segundo solo cambia la variante
      { ini: 12.0333, nombre: 'Tríceps', detalle: 'Normal', series: '3 × 10', zona: 'Tríceps', musculos: ['triceps'], vista: 'posterior', catalogo: 115 },
      { ini: 13.8, nombre: 'Tríceps', detalle: 'Unilateral', series: '3 × 10', zona: 'Tríceps', musculos: ['triceps'], vista: 'posterior', continua: true },
    ],
  },
  tiron: {
    origen: '../tiron/tironoriginal.mp4',
    titulo: 'Tirón',
    grupos: ['Espalda', 'Bíceps', 'Trapecio'],
    duracion: '50 min',
    portadaFin: 1.7667,
    ejercicios: [
      { ini: 1.7667, nombre: 'Jalón al pecho', series: '3 × 8', zona: 'Dorsales', musculos: ['upper-back'], vista: 'posterior', catalogo: 10 },
      { ini: 4.4, nombre: 'Remo en T', series: '3 × 8', zona: 'Espalda media', musculos: ['upper-back', 'trapezius'], vista: 'posterior', catalogo: 83 },
      { ini: 6.1667, nombre: 'Jalón unilateral', series: '3 × 10', zona: 'Dorsales', musculos: ['upper-back'], vista: 'posterior', catalogo: 77 },
      { ini: 7.8667, nombre: 'Remo en banco', series: '3 × 10', zona: 'Espalda baja y dorsales', musculos: ['lower-back', 'upper-back'], vista: 'posterior', catalogo: 78 },
      { ini: 9.6667, nombre: 'Bíceps con mancuernas', series: '3 × 10', zona: 'Cabeza larga', musculos: ['biceps'], vista: 'anterior', catalogo: 106 },
      { ini: 11.5333, nombre: 'Bíceps en polea', series: '3 × 12', zona: 'Cabeza corta', musculos: ['biceps'], vista: 'anterior', catalogo: 109 },
      { ini: 13.1333, nombre: 'Bíceps en polea', series: '3 × 12', zona: 'Cabeza corta', musculos: ['biceps'], vista: 'anterior', continua: true },
      { ini: 14.6333, nombre: 'Trapecio', series: '3 × 10', zona: 'Trapecio', musculos: ['trapezius'], vista: 'posterior', catalogo: 101 },
    ],
  },
  // Original unido a partir de los 7 clips de marketing/pierna (ver README)
  pierna: {
    origen: '../pierna/piernaoriginal.mp4',
    titulo: 'Pierna',
    grupos: ['Cuádriceps', 'Femoral', 'Glúteo', 'Gemelo'],
    duracion: '1 h 10 min',
    portadaFin: 1.6,
    ejercicios: [
      { ini: 1.6, nombre: 'Sentadilla hack', series: '4 × 8', zona: 'Cuádriceps', musculos: ['quadriceps'], vista: 'anterior', catalogo: 93 },
      { ini: 5.0, nombre: 'Prensa de pierna', series: '3 × 10', zona: 'Cuádriceps y glúteo', musculos: ['quadriceps', 'adductor'], vista: 'anterior', catalogo: 21 },
      { ini: 9.0, nombre: 'Extensión de cuádriceps', series: '3 × 12', zona: 'Cuádriceps', musculos: ['quadriceps'], vista: 'anterior', catalogo: 88 },
      { ini: 11.8, nombre: 'Peso muerto rumano', detalle: 'Con mancuernas', series: '3 × 10', zona: 'Femoral y glúteo', musculos: ['hamstring', 'gluteal'], vista: 'posterior', catalogo: 168 },
      { ini: 16.4, nombre: 'Curl femoral unilateral', detalle: 'De pie', series: '3 × 12', zona: 'Femoral', musculos: ['hamstring'], vista: 'posterior', catalogo: 169 },
      { ini: 20.2, nombre: 'Patada de glúteo', detalle: 'En máquina', series: '3 × 12', zona: 'Glúteo', musculos: ['gluteal'], vista: 'posterior', catalogo: 172 },
      { ini: 23.1, nombre: 'Gemelos en máquina', series: '4 × 15', zona: 'Gemelo', musculos: ['calves'], vista: 'posterior', catalogo: 91 },
    ],
  },
};
