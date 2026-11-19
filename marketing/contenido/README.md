# Contenido para redes: 5 vídeos y 5 carruseles

Todo lo que hay que subir está en **`para-publicar/`**:

```
para-publicar/
  videos/
    01-que-puedes-hacer/     video.mp4 · subtitulos.srt · guion.txt · descripcion.txt
    02-cuanto-comer/
    03-carbos-o-proteina/
    04-suplementos/
    05-no-veo-resultados/
  posts/
    01-funciones-app/        1.png 2.png 3.png 4.png · descripcion.txt
    02-calorias-objetivo/
    03-imc/
    04-proteina/
    05-mitos-gym/
```

- **Vídeos**: 1080×1920 (TikTok, Reels, Shorts), voz en off y subtítulos palabra a palabra ya grabados
  en la imagen. `subtitulos.srt` es por si una red los pide aparte; `descripcion.txt` es el texto
  del post con hashtags.
- **Carruseles**: 4 imágenes 1080×1350 (Instagram/TikTok foto), en orden 1 → 4, con el sistema de
  `SOCIAL_POSTS.md` (logo UF, silueta, dorado, Anton/Audiowide/Inter).

## Orden recomendado de publicación

1. Vídeo 01 + carrusel 01: qué es la app.
2. Vídeo 02 + carrusel 02: cuánto comer (calculadora).
3. Carrusel 03: IMC.
4. Vídeo 03 + carrusel 04: carbohidratos/proteína antes de entrenar y cuánta proteína.
5. Vídeo 04: suplementos.
6. Vídeo 05 + carrusel 05: no veo resultados / mitos.

## Cómo regenerarlos

```bash
cd marketing/contenido
node montar.mjs                       # todo
node montar.mjs videos                # solo vídeos (o: posts)
node montar.mjs 04-suplementos        # solo uno, por su id
node montar.mjs --capturas            # recaptura la app (app local arrancada)
node montar.mjs --prueba=03-carbos-o-proteina:2,8   # fotogramas sueltos en build/
```

Textos, datos y escenas: **`guion.mjs`**. Diseño: `escenas/video.html` y `escenas/post.html`.

## La voz

**Con audio propio (ElevenLabs):** deja un `.mp3` por vídeo en `fuentes/<id>.mp3` (por ejemplo
`fuentes/03-carbos-o-proteina.mp3`) con el texto de `guion.txt`, una frase por línea. El montaje
detecta las pausas, coloca cada frase en su plano y ajusta los subtítulos a ese audio. Si cambias
el texto al grabar, cámbialo también en `guion.mjs`.

**Sin audio propio:** se genera en local con las voces de Windows (`lib/voz.ps1`, voz «Pablo»), gratis y sin conexión, y
devuelve el instante de cada palabra para los subtítulos. Se puede cambiar a `Laura` o `Helena` en
`VOZ` dentro de `guion.mjs`. En `voz` va la pronunciación cuando no coincide con el texto
(«Últimeit Fítnes» para Ultimate Fitness), con el mismo número de palabras.

Requisitos: Windows, Node, `ffmpeg` y las dependencias del frontend (se reutiliza su Playwright).
