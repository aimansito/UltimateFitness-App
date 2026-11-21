# Vídeos «Rutina de Empuje» y «Rutina de Tirón»

Montaje vertical (1080×1920, 30 fps) para TikTok/Reels a partir de `marketing/empuje/empujeoriginal.mp4`
y `marketing/tiron/tironoriginal.mp4`. Se respetan los cortes y el audio del original y se añade encima:

- **Portada** con el logo, «Rutina de …», los grupos musculares y la duración.
- **Transición de la portada**: el logo UF crece en el centro y la U y la F se separan en diagonal,
  cada una llevándose su mitad de la portada.
- **Transición entre ejercicios**: una línea dorada (desde arriba) y otra azul (desde abajo) se dibujan
  en el centro y se separan hacia los lados descubriendo el siguiente ejercicio.
- **Rótulo de cada ejercicio**: número, nombre, variante, series × repeticiones, zona y la figura
  muscular de la app con los músculos trabajados; arriba, el progreso de la rutina.
- **Cierre**: captura real de la rutina en la app, logo y web.

## Cómo montarlo

```bash
cd marketing/rutinas
node montar.mjs            # los dos vídeos
node montar.mjs empuje     # solo uno
node montar.mjs tiron --prueba=0,2.5,17   # solo esos instantes, en build/tiron/prueba-*.png
node montar.mjs --capturas # rehace las capturas de la app (necesita la app local arrancada)
```

Salida: `salida/rutina-<clave>.mp4`.

**Pierna** viene en 7 clips sueltos (`marketing/pierna/WhatsApp Video …`). Se unen primero en
`marketing/pierna/piernaoriginal.mp4` (576×768, 30 fps), en el orden hack, prensa, extensión, rumano,
curl femoral, patada y gemelos, recortados a 5 / 4 / 2,8 / 4,6 / 3,8 / 2,9 / 3,2 s. Los `ini` de `guion.mjs`
son esos cortes acumulados. Después: `node montar.mjs pierna`.

## Qué tocar: `guion.mjs`

Cortes (`ini`), nombre, variante (`detalle`), series, zona, músculos de la figura y duración de cada
rutina. Un ejercicio grabado en dos clips se marca con `continua: true` en el segundo.
El diseño está en `escenas/capa.html`.
