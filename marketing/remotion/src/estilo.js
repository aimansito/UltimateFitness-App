// Marca (SOCIAL_POSTS.md): fondo #0a0a0a, dorado #CC941A, azul #00AEFF, Anton / Audiowide / Inter
import { loadFont as cargarAnton } from '@remotion/google-fonts/Anton';
import { loadFont as cargarAudiowide } from '@remotion/google-fonts/Audiowide';
import { loadFont as cargarInter } from '@remotion/google-fonts/Inter';
import { interpolate, spring, Easing } from 'remotion';

export const C = {
  oro: '#CC941A', oroClaro: '#E8B23A', azul: '#00AEFF', rojo: '#FF4D4D',
  fondo: '#0a0a0a', tarjeta: 'rgba(19,19,19,0.9)', borde: '#2a2a2a', gris: '#c9c9c9',
};

export const F = {
  anton: cargarAnton('normal', { subsets: ['latin'] }).fontFamily,
  audiowide: cargarAudiowide('normal', { subsets: ['latin'] }).fontFamily,
  inter: cargarInter('normal', { weights: ['600', '700', '800'], subsets: ['latin'] }).fontFamily,
};

/** Entrada con rebote suave a partir de `retraso` fotogramas (0 → 1) */
export const entrada = (frame, fps, retraso = 0, config = { damping: 15, mass: 0.7 }) =>
  spring({ frame: frame - retraso, fps, config });

/** 0 → 1 lineal con suavizado entre dos fotogramas */
export const tramo = (frame, a, b, easing = Easing.inOut(Easing.cubic)) =>
  interpolate(frame, [a, b], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing });

/** Tamaño de un titular en Anton para que la línea más larga quepa en `ancho` px */
export const tamTitular = (lineas, ancho, max) => {
  const larga = Math.max(...lineas.map((l) => l.length));
  return Math.min(max, Math.floor(ancho / (larga * 0.5)));
};

export const eyebrow = {
  fontFamily: F.audiowide, fontSize: 32, letterSpacing: '0.36em', paddingLeft: '0.36em',
  color: '#fff', textTransform: 'uppercase',
};
