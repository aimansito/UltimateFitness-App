# Vídeo «Mi cambio»

Montaje vertical (1080×1920, 30 fps) para TikTok/Reels a partir de `video1.mp4` y la locución de
ElevenLabs que están en la raíz del repositorio. Todo se genera con un comando y se puede repetir
tantas veces como haga falta.

## Cómo montarlo

```bash
cd marketing/video-cambio
node montar.mjs
```

El resultado queda en `salida/mi-cambio.mp4`. Solo se rehace lo que ha cambiado desde la última vez.

| Comando | Qué hace |
|---|---|
| `node montar.mjs` | Monta todo reutilizando lo que no ha cambiado |
| `node montar.mjs --solo=logo,cta` | Rehace solo esos planos y recompone |
| `node montar.mjs --capturas` | Vuelve a capturar la app (necesita la app arrancada en local) |
| `node montar.mjs --limpio` | Lo rehace todo desde cero |

Requisitos: Node, `ffmpeg` en el PATH y las dependencias del frontend instaladas (se reutiliza su
Playwright). Las capturas de la app solo hacen falta la primera vez o si cambia la interfaz.

## Qué tocar: `guion.mjs`

Todo lo editable está en ese archivo:

- **`TEMPO.bpm`**: tempo de la canción (133, «Lay All Your Love On Me»). Todos los cortes caen en
  un tiempo del compás contando desde el segundo 0.
- **`PLANOS`**: orden de los planos, cuánto dura cada uno (en tiempos del compás; 4 = un compás),
  con qué transición entra, el encuadre (`anclaX`, `anclaY`, `zoom`) y el color del capítulo.
- **`ROTULOS`**: los textos grandes de la intro, que va sin voz.
- **`LOCUCION`**: el texto de cada frase (para los subtítulos), cuántos compases de intro hay antes
  de la voz y las pausas añadidas entre bloques de la locución.
- **`TARJETAS`**: grupos musculares y **duración real** de los dos entrenos finales. Con
  `minutos: null` la tarjeta pinta «?? MIN».
- **`MARCA`**: usuario de redes y web del cierre.

## Cómo poner la canción

El vídeo sale solo con la voz. Al añadir la canción en TikTok o CapCut, hazla empezar en el
**segundo 0**: los primeros 4 compases (7,2 s) son la intro sin voz y el resto de cortes van a ritmo.

## Estructura

```
guion.mjs        Línea de tiempo, textos y datos (lo único que hay que editar)
montar.mjs       Orquesta el montaje
lib/             Piezas: tiempos, planos de metraje, escenas, rótulos, voz y composición
escenas/         Plantillas HTML de las escenas de marca (logo, app, tarjetas, cierre)
assets/          Logos y capturas de la app
build/           Archivos intermedios (no se versiona)
salida/          Vídeo final (no se versiona)
```

## Cómo funciona

1. **Planos de metraje**: cada clip se recorta, se alarga con cámara lenta interpolada y/o ida y
   vuelta, se lleva a pantalla completa con un zoom suave y recibe el color de su capítulo.
2. **Escenas de marca**: son páginas HTML que el navegador renderiza fotograma a fotograma, con las
   tipografías y colores de la web y la misma figura muscular que usa la app.
3. **Rótulos**: una capa con el sello de marca, el capítulo y los subtítulos palabra a palabra,
   sincronizados con los silencios de la locución.
4. **Composición**: los planos se encadenan con transiciones centradas en el tiempo del compás, se
   superponen los rótulos y se añade la voz normalizada.
