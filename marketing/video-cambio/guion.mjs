// ============================================
// GUION DEL VÍDEO «MI CAMBIO» — única fuente de verdad del montaje.
// Aquí se toca todo lo editable: tempo, orden y duración de los planos,
// transiciones, textos, pausas de la locución y datos de las tarjetas.
// Después: `node montar.mjs` (ver README.md).
// ============================================

export const FORMATO = { ancho: 1080, alto: 1920, fps: 30 };

// Canción: «Lay All Your Love On Me» (ABBA) ≈ 133 BPM. Todos los cortes caen en un tiempo
// de este compás, contando desde el segundo 0 del vídeo: al poner la canción en TikTok/CapCut,
// hazla empezar en el segundo 0 para que los cortes coincidan con el ritmo.
export const TEMPO = { bpm: 133 };

export const FUENTES = {
  video: '../../video1.mp4',
  locucion: 'fuentes/locucion.mp3',
  fotoAntes: 'fuentes/antes.jpeg',
  recorteAntes: [946, 1260, 0, 394], // la foto viene con franjas negras
  fotoDespues: 'fuentes/despues.jpeg',
};

// App en local, para las capturas de las funcionalidades
export const APP = { url: 'http://localhost:5173', usuario: 'sara@example.com', clave: 'password123', dietaId: 20 };

// --------------------------------------------
// Clips (segundos) y su zona útil sin franjas negras [ancho, alto, x, y].
// Sin `archivo`, el clip está dentro de video1.mp4.
// --------------------------------------------
export const CLIPS = {
  espaldaInicio: { ini: 0, fin: 1.0333, recorte: [576, 768, 0, 128] },
  dominadas: { ini: 1.0333, fin: 2.2, recorte: [576, 1024, 0, 0] },
  bosu: { ini: 2.2, fin: 2.7667, recorte: [474, 1024, 52, 0] },
  jalon: { ini: 2.7667, fin: 3.8, recorte: [576, 768, 0, 128] },
  barra: { ini: 3.8, fin: 4.8, recorte: [576, 768, 0, 128] },
  espejoRedondo: { ini: 4.8, fin: 5.8, recorte: [576, 768, 0, 128] },
  abdominales: { ini: 5.8, fin: 6.7333, recorte: [576, 768, 0, 128] },
  extension: { ini: 6.7333, fin: 7.9333, recorte: [576, 732, 0, 164] },
  maquina: { ini: 7.9333, fin: 9.1667, recorte: [576, 768, 0, 128] },
  remo: { ini: 9.8667, fin: 10.9, recorte: [576, 768, 0, 128] },
  frente: { ini: 10.9, fin: 12.0, recorte: [576, 992, 0, 16] },
  espaldaAhora: { ini: 12.0, fin: 13.0, recorte: [576, 1024, 0, 0] },
  // Sustituye al plano de las mancuernas (retirado)
  triceps: { archivo: 'fuentes/escenaTriceps.mp4', ini: 0, fin: 1.5567, recorte: [576, 768, 0, 0] },
};

// --------------------------------------------
// Tarjetas de entreno: van sobre un vídeo del grupo muscular trabajado.
// minutos: duración real del entreno (null = se pinta «?? MIN»).
// --------------------------------------------
export const TARJETAS = {
  pecho: {
    grupos: ['PECHO', 'HOMBRO', 'TRÍCEPS'],
    musculos: ['chest', 'front-deltoids', 'back-deltoids', 'triceps'],
    minutos: 60,
  },
  espalda: {
    grupos: ['ESPALDA', 'BÍCEPS', 'TRAPECIO'],
    musculos: ['trapezius', 'upper-back', 'lower-back', 'biceps'],
    minutos: 40,
  },
};

export const MARCA = { usuario: '@ultimatefitness.utf', web: 'ultimatefitnessuf.com' };

// --------------------------------------------
// LÍNEA DE TIEMPO. Cada plano dura `tiempos` (tiempos del compás; 4 = un compás ≈ 1,8 s).
// Los clips van solo a cámara lenta (sin ida y vuelta): la velocidad sale de lo que dura el
// plano frente a lo que dura el clip, así que menos `tiempos` = más rápido.
// anclaX / anclaY (0-1): hacia dónde se acerca el zoom. El clip se ve entero, sobre un fondo difuminado.
// entrada: transición con la que ENTRA el plano (nombres de xfade de ffmpeg) y su duración en fotogramas.
// subY: altura (px) del centro de los subtítulos durante el plano; false = sin subtítulos.
// --------------------------------------------
const T = (tipo, fotogramas = 8) => ({ tipo, fotogramas });

export const PLANOS = [
  // ---- Intro sin voz (2 compases): ráfaga de un plano por tiempo, del principio a hoy ----
  { id: 'i1', tiempos: 1, clip: 'espaldaInicio', anclaX: 0.72, zoom: [1.0, 1.05], color: 'recuerdo', capitulo: '' },
  { id: 'i2', tiempos: 1, clip: 'dominadas', zoom: [1.05, 1.1], color: 'recuerdo', capitulo: '', entrada: T('fade', 2) },
  { id: 'i3', tiempos: 1, clip: 'jalon', zoom: [1.0, 1.05], color: 'vivo', capitulo: '', entrada: T('fade', 2) },
  { id: 'i4', tiempos: 1, clip: 'barra', anclaX: 0.35, zoom: [1.05, 1.1], color: 'vivo', capitulo: '', entrada: T('fade', 2) },
  { id: 'i5', tiempos: 1, clip: 'espejoRedondo', anclaX: 0.12, zoom: [1.0, 1.05], color: 'vivo', capitulo: '', entrada: T('fade', 2) },
  { id: 'i6', tiempos: 1, clip: 'abdominales', anclaX: 0.0, zoom: [1.05, 1.1], color: 'vivo', capitulo: '', entrada: T('fade', 2) },
  { id: 'i7', tiempos: 1, clip: 'frente', zoom: [1.0, 1.05], color: 'vivo', capitulo: '', entrada: T('fade', 2) },
  { id: 'i8', tiempos: 1, clip: 'espaldaAhora', zoom: [1.05, 1.12], color: 'vivo', capitulo: '', entrada: T('fade', 2) },

  // ---- 01 · El comienzo: «Empecé como todos… qué camino seguir» (cortes cada 2-3 tiempos) ----
  { id: 'c1_espalda', tiempos: 3, clip: 'espaldaInicio', anclaX: 0.72, zoom: [1.06, 1.0], color: 'recuerdo', capitulo: '01 · EL COMIENZO', entrada: T('fadewhite', 8) },
  { id: 'c1_dominadas', tiempos: 3, clip: 'dominadas', zoom: [1.0, 1.06], color: 'recuerdo', capitulo: '01 · EL COMIENZO', entrada: T('hblur', 6) },
  { id: 'c1_bosu', tiempos: 2, clip: 'bosu', anclaY: 0.3, zoom: [1.0, 1.05], color: 'recuerdo', capitulo: '01 · EL COMIENZO', entrada: T('smoothleft', 6) },
  { id: 'c1_espalda2', tiempos: 2, clip: 'espaldaInicio', anclaX: 0.7, anclaY: 0.55, zoom: [1.12, 1.2], color: 'recuerdo', capitulo: '01 · EL COMIENZO', entrada: T('hblur', 6) },
  { id: 'c1_dominadas2', tiempos: 3, clip: 'dominadas', anclaY: 0.4, zoom: [1.18, 1.1], color: 'recuerdo', capitulo: '01 · EL COMIENZO', entrada: T('smoothup', 6) },
  { id: 'c1_bosu2', tiempos: 2, clip: 'bosu', anclaY: 0.4, zoom: [1.1, 1.18], color: 'recuerdo', capitulo: '01 · EL COMIENZO', entrada: T('hblur', 6) },

  // ---- 02 · El progreso: «Con los años probé de todo… orgulloso» ----
  { id: 'c2_jalon', tiempos: 3, clip: 'jalon', zoom: [1.0, 1.06], color: 'vivo', capitulo: '02 · EL PROGRESO', entrada: T('fadewhite', 8) },
  { id: 'c2_barra', tiempos: 3, clip: 'barra', anclaX: 0.35, zoom: [1.06, 1.0], color: 'vivo', capitulo: '02 · EL PROGRESO', entrada: T('hblur', 6) },
  { id: 'c2_espejo', tiempos: 2, clip: 'espejoRedondo', anclaX: 0.12, zoom: [1.0, 1.06], color: 'vivo', capitulo: '02 · EL PROGRESO', entrada: T('smoothup', 6) },
  { id: 'c2_abdominales', tiempos: 3, clip: 'abdominales', anclaX: 0.0, zoom: [1.0, 1.07], color: 'vivo', capitulo: '02 · EL PROGRESO', entrada: T('hblur', 6) },
  { id: 'c2_frente', tiempos: 3, clip: 'frente', zoom: [1.0, 1.08], color: 'vivo', capitulo: '02 · EL PROGRESO', entrada: T('smoothleft', 6) },
  { id: 'c2_espalda', tiempos: 3, clip: 'espaldaAhora', zoom: [1.0, 1.08], color: 'vivo', capitulo: '02 · EL PROGRESO', entrada: T('hblur', 6) },

  // ---- 03 · Estancado (sin color): «Pero llevo años estancado. Y me cansé de conformarme» ----
  { id: 'c3_maquina', tiempos: 4, clip: 'maquina', zoom: [1.05, 1.0], color: 'apagado', capitulo: '03 · ESTANCADO', entrada: T('dissolve', 12) },
  { id: 'c3_triceps', tiempos: 4, clip: 'triceps', zoom: [1.0, 1.06], color: 'apagado', capitulo: '03 · ESTANCADO', entrada: T('dissolve', 12) },

  // ---- El siguiente nivel: Ultimate Fitness ----
  { id: 'logo', tiempos: 6, escena: 'logo', entrada: T('fadeblack', 12) },
  {
    id: 'app_rutinas', tiempos: 6, escena: 'app', subY: 1480, entrada: T('smoothup', 10),
    datos: { antetitulo: 'USO ULTIMATE FITNESS PARA', titulo: 'MIS RUTINAS', pantallas: 'rutinas' },
  },
  {
    id: 'app_dietas', tiempos: 5, escena: 'app', subY: 1480, entrada: T('smoothleft', 10),
    datos: { antetitulo: 'Y TAMBIÉN PARA', titulo: 'MIS DIETAS', pantallas: 'dietas' },
  },

  // ---- Tarjetas de entreno sobre un vídeo de ese grupo muscular: «y cada entreno que hago» ----
  { id: 'tarjeta_pecho', tiempos: 6, clip: 'triceps', capa: 'tarjeta', tarjeta: 'pecho', zoom: [1.0, 1.06], color: 'fondo', subY: 420, entrada: T('fadewhite', 10) },
  { id: 'tarjeta_espalda', tiempos: 6, clip: 'jalon', capa: 'tarjeta', tarjeta: 'espalda', zoom: [1.0, 1.06], color: 'fondo', subY: 420, entrada: T('hblur', 10) },

  // ---- Cierre ----
  { id: 'comparativa', tiempos: 7, escena: 'comparativa', subY: 960, entrada: T('fadewhite', 10) },
  { id: 'cta', tiempos: 13, escena: 'cta', subY: false, entrada: T('fadeblack', 12) },
];

// Rótulos grandes sin voz (ahora ninguno: los subtítulos solo salen cuando habla la voz).
// Formato: [tiempo inicial, tiempo final, ['LÍNEA con *palabra dorada*']]
export const ROTULOS = [];

// --------------------------------------------
// LOCUCIÓN. Tiempos (s) dentro del mp3 original, sacados de sus silencios.
// La voz empieza cuando acaba la intro. `bloques` permite abrir pausas: cada bloque va de un
// corte (en mitad de un silencio) al siguiente, y `pausa` son segundos extra antes del bloque.
// velocidad: acelera la voz sin cambiar el tono (1 = original) para acortar el vídeo.
// --------------------------------------------
export const LOCUCION = {
  compasesIntro: 2,
  velocidad: 1,
  bloques: [
    { hasta: 6.95, pausa: 0 }, //    Empecé como todos… qué camino seguir.
    { hasta: 14.45, pausa: 0 }, //   Con los años probé de todo… orgulloso.
    { hasta: 18.32, pausa: 0 }, //   Pero llevo años estancado. Y me cansé de conformarme.
    { hasta: 20.67, pausa: 0.3 }, // Por eso he creado mi propia app.            (logo)
    { hasta: 23.17, pausa: 0 }, //   Ahí llevo mis rutinas, mis dietas…          (pantallas de la app)
    { hasta: 24.87, pausa: 2.34 }, // y cada entreno que hago.                   (tarjeta de pecho)
    { hasta: 27.12, pausa: 0.87 }, // Ahora voy a por mi siguiente nivel.        (tarjeta de espalda)
    { hasta: 29.77, pausa: 0.48 }, // Y lo vas a ver todo, paso a paso.          (antes / ahora)
    { hasta: 99, pausa: 0.48 }, //   Si tú también quieres dar el salto… sígueme. (cierre)
  ],
  // [inicio, fin, texto] de cada frase. Si el audio dice otra cosa, corrige aquí el texto.
  frases: [
    [0.0, 1.22, 'Empecé como todos'],
    [1.57, 2.67, 'Sin saber entrenar'],
    [2.84, 3.81, 'sin saber comer'],
    [4.25, 5.68, 'y sin tener ni idea'],
    [5.78, 6.67, 'de qué camino seguir'],
    [7.23, 8.76, 'Con los años probé de todo'],
    [9.12, 10.82, 'Me equivoqué mil veces'],
    [11.25, 11.94, 'Y aun así'],
    [12.07, 14.23, 'conseguí un físico del que estoy orgulloso'],
    [14.68, 16.21, 'Pero llevo años estancado'],
    [16.61, 18.08, 'Y me cansé de conformarme'],
    [18.56, 20.44, 'Por eso he creado mi propia app'],
    [20.9, 23.09, 'Ahí llevo mis rutinas mis dietas'],
    [23.25, 24.67, 'y cada entreno que hago'],
    [25.08, 26.94, 'Ahora voy a por mi siguiente nivel'],
    [27.3, 28.37, 'Y lo vas a ver todo'],
    [28.72, 29.57, 'paso a paso'],
    [29.97, 31.68, 'Si tú también quieres dar el salto'],
    [32.04, 32.56, 'sígueme'],
  ],
};

export const SUBTITULOS = {
  yPorDefecto: 1330,
  maxPalabras: 3,
  maxLetras: 17,
};
