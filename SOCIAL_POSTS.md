# Guía de posts para redes sociales — Ultimate Fitness

Plantilla visual fija para los posts de Instagram/TikTok. El objetivo: el usuario da la idea/contenido, Claude genera el post reutilizando siempre este mismo sistema (tamaño, colores, tipografías, logo, estructura). Solo cambia el contenido.

**Canvas activo (Artifact "Design"):** https://claude.ai/artifact/STq7monJmRyQSzKqaNrwT9
Para añadir un post nuevo: reutilizar este mismo canvas (añadir un artboard más), no crear uno nuevo salvo que el usuario lo pida explícitamente.

## Formato

- Artboard: **1080 × 1350 px** (retrato 4:5), uno por post.
- Fondo: `#0a0a0a` a pantalla completa, `padding` interior ~88-96px (80px en el post de funciones, que lleva más contenido).
- Uno o dos "blobs" de resplandor: círculos grandes (500-620px), `background: {{accent}}`, `opacity: 0.05-0.08`, posicionados fuera del borde (`top`/`bottom` negativos) para dar profundidad sin saturar.

## Marca

- **Colores** (variables reales del proyecto, `frontend/src/index.css`):
  - Dorado (acento principal): `#CC941A`
  - Azul: `#00AEFF` · Rojo: `#FF0000` (uso puntual, no por defecto)
  - Fondo oscuro: `#0a0a0a` / tarjetas: `#131313`–`#141414` / bordes sutiles: `#232323`–`#2a2a2a`
  - Texto: blanco `#ffffff` (titulares), gris `#c7c7c7` (cuerpo), gris apagado `#8a8a8a`/`#9a9a9a` (notas, descripciones)
- **Tipografías** (las mismas de la web, cargarlas siempre vía Google Fonts en el `<head>` del artboard):
  `https://fonts.googleapis.com/css2?family=Anton&family=Audiowide&family=Inter:wght@400;600;700;800&display=swap`
  - **Anton**: titulares grandes, siempre en mayúsculas.
  - **Audiowide**: etiquetas pequeñas tipo "eyebrow" (uppercase, `letter-spacing` amplio).
  - **Inter**: todo el cuerpo de texto.
- **Sello de marca (obligatorio en todos los posts):** logo `frontend/public/logos/logo-small.png` (monograma "UF", prácticamente cuadrado, 290×300px) arriba a la izquierda. Nunca poner "Ultimate Fitness" como texto — el logo hace esa función. Si el post necesita además una etiqueta corta (p. ej. "Próximamente"), va en un `flex` al lado del logo, no lo sustituye.
  - El logo se sube como *asset* del canvas (`Artifact` con `asset: true` sobre `frontend/public/logos/logo-small.png`) y se referencia como `<img src="/_blob/<id>">`. Si se crea un canvas nuevo (no éste), hay que volver a subirlo ahí — el id del blob es propio de cada artifact.
  - **Importante (bug ya resuelto una vez):** el root de cada artboard es `display:flex; flex-direction:column`, cuyo `align-items: stretch` por defecto ESTIRA el `<img>` a todo el ancho si solo se fija `height` con `width:auto` — el logo cuadrado sale como una franja horizontal borrosa. Fijar siempre en el `<img>`: `width` Y `height` iguales (p. ej. `44px`/`44px`), `object-fit: contain`, `align-self: flex-start` y `flex-shrink: 0`.
- **Color de acento editable:** cada artboard declara `data-props` con `"accent": {"editor":"color","default":"#CC941A", "options":["#CC941A","#00AEFF","#FF0000","#FFFFFF"]}` para poder tocar el color desde el propio canvas sin tocar código.

## Arquetipos de post (elegir el que mejor encaje con la idea del usuario)

1. **Gancho / Hook** — capta audiencia con un dolor o pregunta relatable, sin vender nada. Titular Anton grande (2-3 líneas, última línea en dorado), línea divisoria fina, una frase de apoyo en gris, nota final tipo "Sigue leyendo →".
2. **Teaser** — genera curiosidad sobre una función concreta sin explicarla del todo. Eyebrow corto ("Próximamente"), titular, un elemento visual central (mockup simple: tarjetas, iconos), frase de cierre que promete más info.
3. **Explicativo / Funciones** — un solo post con **todas** las funciones del producto en formato grid (2 columnas), cada tarjeta con icono (SVG en línea, nunca emoji), título Anton y una línea de descripción. Cierra con CTA corto ("Empieza gratis → link en la bio").
4. **CTA / Conversión** — titular de cierre, pasos numerados (01/02/03 en Anton dorado + texto en Inter), botón real (`<a>` estilizado, no un `<div>`) y recordatorio de "Link en la bio".

5. **Carrusel de tips** — 4 slides por post (1 portada + 3 tips), organizado en el canvas en su propia fila (misma superficie que los posts sueltos, **no** usar la función `pages` del canvas — quedó probado que esa vista de páginas no es visible/obvia para el usuario; todo va en una sola vista continua, con un título de fila via `notes`).
   - **Slide 1 (portada):** logo **grande** (120×120px) arriba a la izquierda, silueta grande centrada, titular del post debajo (Anton, 2 líneas, última palabra clave en dorado), y abajo del todo los iconos de Instagram + TikTok junto al handle `@ultimatefitness.utf` (un único handle, vale para ambas redes). **Los iconos+handle van solo en la portada**, no se repiten en los slides de tip.
   - **Slides 2-4 (tips):** logo pequeño (40px) arriba a la izquierda + contador "TIP 0X/03" (mismo estilo numérico Anton dorado que el arquetipo CTA), silueta mediana, título del tip (Anton, 2 líneas), explicación breve en Inter (1-2 frases, directas, con el beneficio o el por qué).
   - Las 3 ideas de cada carrusel deben ser del mismo tema general (ej. "errores de técnica", "errores de descanso") para que el post completo tenga coherencia.

### Componente reutilizable `Silueta.dc.html`

**Una sola silueta fija y bien proporcionada** de una persona musculosa (de pie, mancuernas en ambas manos, estilo pictograma sólido con líneas de definición de pecho/abdomen) — la misma en todos los posts, como una especie de mascota de marca. Vive en `project/Silueta.dc.html` y se monta con `<dc-import>` en cada slide:

```html
<dc-import name="Silueta" color="{{accent}}" w="360" h="500" hint-size="360px,500px"></dc-import>
```

- `w`/`h`: tamaño en px del render (el `viewBox` interno es fijo `0 0 300 420`, mantener proporción ~3:4.2 para que no se deforme).
- **Historial importante — por qué no hay poses dinámicas:** la primera versión intentaba variar la pose por tip (sentadilla, peso muerto...) rotando torso/brazos/piernas con `transform: rotate()` anidado. Se rompió dos veces (piernas cruzadas, figuras aplastadas) porque ese cálculo se hace a ciegas, sin previsualización — demasiado riesgo para el beneficio. El usuario pidió explícitamente simplificar a **una silueta normal, fija**. No reintroducir el sistema de poses/ángulos salvo que el usuario lo pida de nuevo explícitamente; si lo pide, considerar primero retomar un generador de imágenes real (Higgsfield u otro) en vez de SVG a mano.
- No hace falta volver a definir el pictograma en cada slide — solo importar. Si se crea un canvas nuevo, hay que copiar también este archivo (no solo los slides).

Si la idea que da el usuario no encaja bien en ninguno de estos arquetipos, **avisar antes de generar algo distinto** y proponer cómo adaptarlo o si conviene crear un arquetipo nuevo (y documentarlo aquí después).

## Reglas de contenido

- Español, tono directo y motivador, frases cortas.
- Nunca inventar cifras, testimonios o datos — si falta un dato real, dejar un placeholder claro (`[DATO]`) y decirlo.
- Iconos: SVG en línea simple (círculos, líneas, rects), nunca emoji ni iconos genéricos de IA.
- Nunca gradientes de fondo como recurso principal — solo los "blobs" de resplandor sutiles descritos arriba.
