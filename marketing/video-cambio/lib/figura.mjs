// Figura anatómica (la misma librería que usa la app) como SVG, con los músculos trabajados en dorado.
import { cargarDelFrontend } from './navegador.mjs';

const React = cargarDelFrontend('react');
const { renderToStaticMarkup } = cargarDelFrontend('react-dom/server');
const modulo = cargarDelFrontend('react-body-highlighter');
const Model = modulo.default || modulo;

export const ORO = '#CC941A';
export const CUERPO = '#3a3a3a';

/** vista: 'anterior' | 'posterior'. Devuelve el marcado <svg> */
export function figuraSvg(musculos, vista) {
  const html = renderToStaticMarkup(
    React.createElement(Model, {
      type: vista,
      data: [{ name: 'entreno', muscles: musculos }],
      bodyColor: CUERPO,
      highlightedColors: [ORO],
    })
  );
  const svg = html.match(/<svg[\s\S]*<\/svg>/);
  if (!svg) throw new Error('No se pudo generar la figura muscular');
  return svg[0];
}
