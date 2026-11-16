// Rejilla de tiempos: convierte tiempos del compás en fotogramas y calcula dónde cae cada plano.
import { FORMATO, TEMPO, PLANOS, LOCUCION } from '../guion.mjs';

export const FPS = FORMATO.fps;
export const SEG_POR_TIEMPO = 60 / TEMPO.bpm;

/** Fotograma en el que cae un tiempo del compás (contando desde 0) */
export const fotogramaDeTiempo = (tiempo) => Math.round(tiempo * SEG_POR_TIEMPO * FPS);
export const segundos = (fotogramas) => fotogramas / FPS;

/**
 * Línea de tiempo en fotogramas. Cada plano ocupa [corte, corteSiguiente); además lleva
 * «asas» de media transición a cada lado para poder fundirse con sus vecinos.
 */
export function lineaDeTiempo() {
  let tiempo = 0;
  const planos = PLANOS.map((p, i) => {
    const corte = fotogramaDeTiempo(tiempo);
    tiempo += p.tiempos;
    const fin = fotogramaDeTiempo(tiempo);
    const entrada = i === 0 ? null : p.entrada || { tipo: 'fade', fotogramas: 8 };
    return { ...p, indice: i, tiempoIni: tiempo - p.tiempos, corte, fin, entrada };
  });
  planos.forEach((p, i) => {
    const sig = planos[i + 1];
    p.asaIni = p.entrada ? p.entrada.fotogramas / 2 : 0;
    p.asaFin = sig?.entrada ? sig.entrada.fotogramas / 2 : 0;
    p.fotogramas = p.fin - p.corte + p.asaIni + p.asaFin; // lo que hay que renderizar
    p.dur = segundos(p.fin - p.corte);
  });
  return { planos, total: planos[planos.length - 1].fin };
}

export const VELOCIDAD_VOZ = LOCUCION.velocidad || 1;

/**
 * Bloques de la locución. desde/hasta están en tiempo del mp3 original; cada bloque, ya
 * acelerado, empieza en el vídeo en `inicioVideo`.
 */
export function bloquesLocucion() {
  const inicioVoz = segundos(fotogramaDeTiempo(LOCUCION.compasesIntro * 4));
  let desde = 0;
  let pausas = 0;
  return LOCUCION.bloques.map((b) => {
    pausas += b.pausa;
    const bloque = { desde, hasta: b.hasta, inicioVideo: inicioVoz + pausas + desde / VELOCIDAD_VOZ };
    desde = b.hasta;
    return bloque;
  });
}

/** Pasa un instante del mp3 original a instante del vídeo */
export function aTiempoDeVideo(t, bloques = bloquesLocucion()) {
  const bloque = bloques.find((b) => t >= b.desde && t < b.hasta) || bloques[bloques.length - 1];
  return bloque.inicioVideo + (t - bloque.desde) / VELOCIDAD_VOZ;
}
