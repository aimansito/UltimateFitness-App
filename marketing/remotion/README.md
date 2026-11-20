# Vídeos con Remotion + Three.js (11 a 15)

Tercera tanda de vídeos de resolución de problemas. Se montan con **Remotion** (vídeo hecho con
React, fotograma a fotograma) y **Three.js** (`@remotion/three`) para los objetos 3D: mancuerna,
batido, cápsula, báscula, plato y la moneda con el logo del cierre.

El resultado va al mismo sitio que el resto: `../contenido/para-publicar/videos/<id>/`.

```bash
npm install
node preparar.mjs                     # voz + datos + render de todos
node preparar.mjs 13-creatina         # solo uno
node preparar.mjs --datos             # solo voz y tiempos (para el estudio)
npm run estudio                       # previsualizar y retocar en el navegador
node fotogramas.mjs 14-no-pierdo-grasa:2,15,30   # hoja de fotogramas en build/
```

- Textos y planos: `guion.mjs`. Escenas: `src/escenas.jsx`. 3D: `src/tres.jsx`. Composición: `src/Video.jsx`.
- Voz: la de ElevenLabs va en `fuentes/<id>.mp3` (una frase por línea de `guion.txt`); sin ella se usa la
  voz de Windows. La alineación de frases y subtítulos es la misma que en `../contenido` (`lib/tiempo.mjs`).
- El metraje de fondo se reutiliza de `../contenido/build/fondo-*.mp4`.
- Licencia de Remotion: gratis para particulares y empresas de hasta 3 personas.
